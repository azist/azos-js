/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as aver from "./aver.js";
import { Application } from "./application.js";
import { link } from "./linker.js";
import * as logging from "./log.js";

/**
 * Base class for application components which work either under {@link Application} directly
 * or another component. This way components form component trees which application can maintain uniformly
 */
export class AppComponent extends types.DisposableObject{
  static #appMap = new Map();

  static #idSeed = 0;

  /**
   * Returns all components of the specified application
   * @param {Application} app
   * @returns {ApplicationComponent[]} an array of components or empty array if such app does not have any components or not found
   */
  static getAllApplicationComponents(app){
    aver.isOf(app, Application);
    const clist = AppComponent.#appMap.get(app);
    if (clist === undefined) return [];
    return types.arrayCopy(clist);
  }

  /**
   * Returns top-level components of the specified application, directed by that application
   * @param {Application} app
   * @returns {AppComponent[]} an array of components or empty array if such app does not have any components or not found
   */
  static getRootApplicationComponents(app){
    aver.isOf(app, Application);
    const clist = AppComponent.#appMap.get(app);
    if (clist === undefined) return [];
    return clist.filter(c => c.director === app);
  }

  #director;
  #sid;
  #logLevel = null;

  constructor(dir, cfg){
    super();
    this.#sid = ++AppComponent.#idSeed;
    this.#director = aver.isOfEither(dir, Application, AppComponent);
    const app = this.app;
    let clist = AppComponent.#appMap.get(app);
    if (clist === undefined){
      clist = [];
      AppComponent.#appMap.set(app, clist);
    }
    clist.push(this);

    if (cfg && cfg.getString)
    {
      this.#logLevel = logging.asMsgType(cfg.getString("logLevel"), true);
    }

  }

  /**
   * Finalizes app component by unregistering from the app
  */
  [types.DESTRUCTOR_METHOD](){
    const app = this.app;
    let clist = AppComponent.#appMap.get(app);
    if (clist !== undefined){
      types.arrayDelete(clist, this);
      if (clist.length==0) AppComponent.#appMap.delete(app);
    }
  }

  /** Returns a component or an app instance which directs(owns) this component
   * @returns {Application | ApplicationComponent}
  */
  get [types.DIRECTOR_PROP]() { return this.#director; }

  /** Returns int system id of this component. System ids are ever increasing while app runs
   * @returns {int}
   */
  get sid(){ return this.#sid; }

  /** Returns true when this component is owned directly by the {@link Application} vs being owned by another component
   * @returns {boolean}
  */
  get isDirectedByApp(){ return this.#director instanceof Application; }

  /** Returns the {@link Application} which this component is directed by directly or indirectly through another component
   * @returns {Application}
  */
  get app(){ return this.isDirectedByApp ? this.#director : this.#director.app; }

  /** Gets an array of components directed by this one
   * @returns {ApplicationComponent[]}
  */
  get directedComponents(){
    const all = AppComponent.getAllApplicationComponents(this.app);
    return all.filter(c => c.director === this);
  }

  /**
   * Override to provide logging topic, default returns class name
   */
  get logTopic(){ return this.constructor.name; }

  /**
   * Override to provide logging from prefix, default uses class name
   */
  get logFrom(){ return `${this.constructor.name}(#${this.#sid})`; }

  /**
   * Returns log level of this component or null to resort to the director one
   * The {@link effectiveLogLevel} uses this property
   */
  get logLevel(){ return this.#logLevel; }

  /**
   * Returns log level of this component, or if it is null then from its director
   */
  get effectiveLogLevel(){
    return this.logLevel ?? this.director.effectiveLogLevel;
  }

  /**
   * Writes to log if current component effective level permits, returning guid of newly written message
   * @param {string} type an enumerated type {@link log.LOG_TYPE}
   * @param {string} text message text
   * @param {object | null} params optional parameters
   * @param {string | null} rel optional relation guid
   * @param {int | null} src optional int src line num
   * @returns {guid | null} null if nothing was written or guid of the newly written message
   */
  writeLog(type, text, params, rel, src){
    const ell = logging.getMsgTypeSeverity(this.effectiveLogLevel);
    if (logging.getMsgTypeSeverity(type) < ell) return null;
    const log = this.app.log;
    const guid = log.write({
      type: type,
      topic: this.logTopic,
      from: this.logFrom,
      text: text,
      params: params,
      rel: rel ?? this.app.instanceId,
      src: src
    });
    return guid;
  }


  /**
   * Provides short textual component description
   * @returns {string}
   */
  toString(){
    return `${this.constructor.name}(#${this.#sid})`;
  }

  /**
   * Used for private field dependency injection pattern:
   *
   * Links requested module dependencies in the supplied object of a form: `{name: type, name_x: type2, ...}`
   * using the supplied linker instance. Each object entry represents a single module dependency.
   * This function keeps the key, but replaces the values which are class types (.ctor functions)
   * with resolved references to the module object instances which implement these class .ctors (e,.g, inherit from classes).
   * Optionally, you can specify the name for dependency by using the `nsplit` string which is by default "_", e.g.
   * an object entry of "log_main: ILog" will be linked with an instance of the class which derives from "ILog" and
   * has a name "main". You can disable named linking by passing null to "nsplit" param
   * @param {object} map target object which contains pairs: `{nm: type,...}`
   * @param {string} [nsplit="_"] optional split string for name, for example: "logger_main" will link with named object instance "main". The default is '_'. Pass null to disable named dependencies
   * @returns The original map which was passed-in, having its entries linked
   */
  link(map, nsplit = "_"){
    const linker = this.app.moduleLinker;
    return link(linker, map, nsplit);
  }
}
