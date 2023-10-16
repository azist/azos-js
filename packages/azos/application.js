/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as aver from "./aver.js";
import { Configuration, ConfigNode, makeNew } from "./conf.js";
import { Session } from "./session.js";
import { AppComponent } from "./components.js";
import { Module, ModuleLinker } from "./modules.js";
import * as lcl from "./localization.js";

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
  else throw new Error("Must pass either (a) plain object, or (b) JSON string, or (c) Configuration, or (d) ConfigNode instance into `application(cfg)` factory function");

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

    this.#id = root.getString("id", "#0");
    this.#name = root.getString("name", this.#id);
    this.#description = root.getString("description", this.#id);
    this.#copyright = root.getString("copyright", "2023 Azist Group");
    this.#envName = root.getString("envName", "local");
    this.#isTest = root.getBool("isTest", false);

    this.#session = this._makeSession(root.get("session"));
    this.#localizer = this._makeLocalizer(root.get("localizer"));
    this.#moduleLinker = this._makeModuleLinker(root.get("modules", "module", "mods", "mod"));

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

    const all = this.rootComponents;
    for(const cmp of all) try{ types.dispose(cmp); } catch(e) { console.error(`App dispose root cmp '${cmp}': e.message`, e); }

    let prev = Application.#instances.pop();
    Application.#instance = prev ?? null;
  }

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

  /**
   * Returns the app-level session which is used in browser/ui and other apps
   * which do not support per-logical-flow sessions
   * @returns {Session}
   */
  get session(){ return this.#session; }

  /** Factory method used to allocate sessions from config object
   * @param {object} cfg object
   * @returns {Session}
  */
  _makeSession(cfg){
    if (types.isAssigned(cfg)) {
       return makeNew(Session, cfg);
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
   * @param {object} cfg object
   * @returns {Localizer}
  */
  _makeLocalizer(cfg){
    if (types.isAssigned(cfg)) {
       return  makeNew(lcl.Localizer, cfg, this, lcl.Localizer);
    } else {
       return lcl.INVARIANT;
    }
  }

   /** Factory method used to allocate localizer from config object
   * @param {object} cfg object
   * @returns {ModuleLinker}
   */
   _makeModuleLinker(cfg){
     const linker = new ModuleLinker();

     if (types.isAssigned(cfg)) {
       for(const cfgMod of cfg){
         const module = makeNew(Module, cfgMod, this);
         aver.isOf(module, Module);
         linker.register(module);
       }

     }
     return linker;
  }


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


