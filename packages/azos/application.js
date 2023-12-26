/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as aver from "./aver.js";
import { $ } from "./linq.js";
import { Configuration, ConfigNode, makeNew, config } from "./conf.js";
import { Session } from "./session.js";
import { AppComponent } from "./components.js";
import { Module, ModuleLinker } from "./modules.js";
import * as lcl from "./localization.js";
import { asMsgType, LOG_TYPE } from "./log.js";
import { ILog, ConLog } from "./ilog.js";

/** Provides uniform base for App chassis related exceptions */
export class AppError extends types.AzosError {
  constructor(message, from = null, cause = null){ super(message, from, cause, 507); }
}


/**
 * A helper factory method creates a new application (new Application(cfg)) from a config object
 * which is either a plain JS object, or a string representation in JSON format,
 * or {@link Configuration}, or {@link ConfigNode} objects.
 * Please see {@link Application} and {@link Configuration} topics
 * @param {object | Configuration | ConfigNode} cfg plain object, JSON string, Configuration or ConfigNode instance
 * @returns {Application} New Application instance
 */
export function application(cfg){
  if (cfg === undefined || cfg === null) cfg = { };

  if (types.isString(cfg)){
    cfg = new Configuration(cfg);
  }
  else if (types.isObject(cfg)){
    if (cfg instanceof ConfigNode) cfg = cfg.configuration;
    if (!(cfg instanceof Configuration)) cfg = new Configuration(cfg);
  }
  else throw new AppError("Must pass either (a) plain object, or (b) JSON string, or (c) Configuration, or (d) ConfigNode instance into `application(cfg)` factory function", "application()");

  return new Application(cfg);
}


/**
 * Implements a base Application chassis pattern
 */
export class Application extends types.DisposableObject{
  static #instances = [];
  static #instance = null;

  /**
   * Returns instance of the most recently constructed {@link Application} object,
   * or {@link NopApplication} object if no app was initialized
   * @return {Application}
  */
  static get instance(){ return Application.#instance ?? NopApplication.instance; }

  #config;
  #id;
  #name;
  #description;
  #copyright;
  #envName;
  #isTest;

  #instanceId;
  #startTime;

  #session;
  #localizer;
  #moduleLinker;
  #dfltLog;
  #logLevel;

  /**
   * Initializes {@link Application} object instance by passing {@link Configuration} object.
   * You can also call {@link application()} helper instead
   * @param {Configuration} cfg
   * @return {Application}
  */
  constructor(cfg){
    super();
    this.#config = aver.isOf(cfg, Configuration);
    const root = cfg.root;

    this.#instanceId = types.genGuid();
    this.#startTime = new Date();

    this.#logLevel = asMsgType(root.getString("logLevel", LOG_TYPE.INFO));

    this.#id = root.getString("id", "#0");
    this.#name = root.getString("name", this.#id);
    this.#description = root.getString("description", this.#id);
    this.#copyright = root.getString("copyright", "2023 Azist Group");
    this.#envName = root.getString(["envName", "env", "environment"], "local");
    this.#isTest = root.getBool("isTest", false);

    this.#dfltLog = new ConLog(this, config({name: "log", [types.ORDER_PROP]: -1_000_000}).root);

    this.#session = this._makeSession(root.get("session"));
    this.#localizer = this._makeLocalizer(root.get("localizer"));

    this.#moduleLinker = new ModuleLinker();
    this._loadModules(this.#moduleLinker, root.get("modules", "module", "mods", "mod"));
    if (this.#moduleLinker.tryResolve(ILog)===null) this.#moduleLinker.register(this.#dfltLog);
    this._modulesAfterLoad();

    if (Application.#instance !== null){
      Application.#instances.push(Application.#instance);
    }
    Application.#instance = this;
  }

  /**
   * Finalizes the application by unmounting services.
   * Call this method via app[Symbol.dispose] protocol.
   * This also replaces the {@link Application.instance} value
   * with the app instance that was in effect right before call to .ctor
   * or {@link NopApplication.instance} if there are no more apps in the stack.
   * This method has no effect in `NopApplication`.
  */
  [types.DESTRUCTOR_METHOD](){
    if (this instanceof NopApplication) return;

    try{ this._modulesBeforeCleanup(); }
    catch(e) { console.error(`App dispose _modulesBeforeCleanup() leaked: ${e.message}`, e); }

    const all = this.rootComponents;
    for(const cmp of all) try{ types.dispose(cmp); } catch(e) { console.error(`App dispose root cmp '${cmp}': ${e.message}`, e); }

    try{ types.dispose(this.#dfltLog); }
    catch(e){ console.error(`App dispose dfltLog leaked: ${e.message}`, e); }

    let prev = Application.#instances.pop();
    Application.#instance = prev ?? null;
  }

  /** String representation of app */
  toString(){ return `${this.constructor.name}('${this.#id}')`; }

  /** Returns application id atom @return {atom}*/
  get id(){ return this.#id; }

  /** Returns application configuration object @return {Configuration}*/
  get config(){ return this.#config; }

  /** Returns application short name string @return {string}*/
  get name(){ return this.#name; }

  /** Returns application description @return {string}*/
  get description(){ return this.#description; }

  /** Returns application copyright line @return {string}*/
  get copyright(){ return this.#copyright; }

  /** Returns environment name @return {string}*/
  get envName(){ return this.#envName; }

  /** Returns application short name string @return {boolean}*/
  get isTest(){ return this.#isTest; }

  /** Returns application instance GUID string assigned at start @return {string}*/
  get instanceId(){ return this.#instanceId; }

  /** Returns application start time stamp Date object @return {Date}*/
  get startTime(){ return this.#startTime; }

  /** Returns an array of all components directed by this app, directly or indirectly (through other components)
   *  @returns {AppComponent[]} an array of components or empty array
  */
  get components(){ return AppComponent.getAllApplicationComponents(this); }

  /** Returns an array of top-level components directed by this app directly
   * @returns {AppComponent[]} an array of components or empty array
  */
  get rootComponents(){ return AppComponent.getRootApplicationComponents(this); }

  /** Returns an array of all app Modules according to their ORDER
   * @returns {Module[]} an array of modules ordered according to their `ORDER_PROP` key
  */
  get modules(){
    const mods = $(AppComponent.getAllApplicationComponents(this))
                 .where(one => one instanceof Module)
                 .orderBy((a, b) => a[types.ORDER_PROP] < b[types.ORDER_PROP] ? -1 : 1);
    return mods.toArray();
  }

  /**
   * Returns an app log or default console log if app was not init with log
   * @returns {ILog}
   */
  get log(){
    const log = this.#moduleLinker.tryResolve(ILog) ?? this.#dfltLog;
    return log;
  }

  /**
   * Returns log level of this component or null to resort to the director one
   * The {@link effectiveLogLevel} uses this property
   */
  get logLevel(){ return this.#logLevel; }

  /**
   * Returns the effective log level of the app.
   * The property is kept for symmetry with {@link AppComponent} design, as it is a shortcut to {@link logLevel}
   */
  get effectiveLogLevel(){ return this.logLevel; }


  /**
   * Returns the app-level session which is used in browser/ui and other apps
   * which do not support per-logical-flow sessions
   * @returns {Session}
   */
  get session(){ return this.#session; }

  /** Factory method used to allocate sessions from config object
   * @param {ConfigNode} cfg configuration node
   * @returns {Session}
  */
  _makeSession(cfg){
    if (types.isAssigned(cfg)) {
       return makeNew(Session, cfg, this);
    } else {
       return new Session(this, null);//empty session
    }
  }

  /**
   * Returns the app-level localizer
   * @returns {Localizer}
   */
  get localizer(){ return this.#localizer; }

  /** Factory method used to allocate localizer from config object
   * @param {ConfigNode} cfg configuration node
   * @returns {Localizer}
  */
  _makeLocalizer(cfg){
    if (types.isAssigned(cfg)) {
       return  makeNew(lcl.Localizer, cfg, this, lcl.Localizer);
    } else {
       return lcl.INVARIANT;
    }
  }

  /**
   * Returns module linker used for service location/DI
   * @returns {ModuleLinker}
   */
  get moduleLinker(){ return this.#moduleLinker; }

  /** Factory method used to allocate modules and register with linker.
   * @param {ModuleLinker} linker
   * @param {ConfigNode} cfg configuration node
   */
  _loadModules(linker, cfg){
    if (types.isAssigned(cfg)) {
      aver.isOf(cfg, ConfigNode);
      for(const cfgMod of cfg.getChildren(false)){
        const module = makeNew(Module, cfgMod, this);
        linker.register(module);
      }
    }
  }

  /** Called by app after modules loaded, delegates to each module _appAfterLoad */
  _modulesAfterLoad(){ for(const one of this.modules) one._appAfterLoad(); }

  /** Called by app after modules loaded, delegates to each module _appBeforeCleanup */
  _modulesBeforeCleanup(){ for(const one of this.modules.reverse()) one._appBeforeCleanup(); }
}

const cfgNOP = new Configuration({
  id: "NOP",
  name: "NOP",
  description: "Nop application",
  envName: "local"
});

/**
 * System stub class which implements an {@link Application} which does nothing
 */
export class NopApplication extends Application{
  static #instance = new NopApplication();
  static get instance(){ return NopApplication.#instance; }
  constructor(){ super(cfgNOP); }
}


