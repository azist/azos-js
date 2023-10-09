/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as aver from "./aver.js";
import * as str from "./strings.js";

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

  #id;
  #name;
  #description;
  #copyright;
  #envName;
  #isTest;

  #instanceId;
  #startTime;

  /**
   * Initializes {@link Application} object instance by passing init object,
   * @param {{id,name,description,copyright,envName,isTest}} init
   * @return {Application}
  */
  constructor(init){
    super();
    aver.isObject(init);
    this.#instanceId = types.genGuid();
    this.#startTime = new Date();

    this.#id = str.dflt(init.id, "#0");
    this.#name = str.dflt(init.name, this.#id);
    this.#description = str.dflt(init.description, this.#id);
    this.#copyright = str.dflt(init.copyright, "2023 Azist Group");
    this.#envName = str.dflt(init.envName, "local");
    this.#isTest = types.asBool(init.isTest);

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
    let prev = Application.#instances.pop();
    Application.#instance = prev ?? null;
  }

  /** Returns application id atom @return {atom}*/
  get id(){ return this.#id; }

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
   *  @returns {ApplicationComponent[]} an array of components or empty array
  */
  get components(){ return ApplicationComponent.getAllApplicationComponents(this); }

  /** Returns an array of top-level components directed by this app directly
   * @returns {ApplicationComponent[]} an array of components or empty array
  */
  get rootComponents(){ return ApplicationComponent.getRootApplicationComponents(this); }
}

/**
 * System stub class which implements an {@link Application} which does nothing
 */
export class NopApplication extends Application{
  static #instance = new NopApplication();
  static get instance(){ return NopApplication.#instance; }

  constructor(){
    super({
      id: "NOP",
      name: "NOP",
      description: "Nop application",
      envName: "local"
    });
  }
}


/**
 * Base class for application components which work either under {@link Application} directly
 * or another component. This way components form component trees which application can maintain uniformly
 */
export class ApplicationComponent extends types.DisposableObject{
  static #appMap = new Map();

  /**
   * Returns all components of the specified application
   * @param {Application} app
   * @returns {ApplicationComponent[]} an array of components or empty array if such app does not have any components or not found
   */
  static getAllApplicationComponents(app){
    aver.isOf(app, Application);
    const clist = ApplicationComponent.#appMap.get(app);
    if (clist === undefined) return [];
    return types.arrayCopy(clist);
  }

  /**
   * Returns top-level components of the specified application, directed by that application
   * @param {Application} app
   * @returns {ApplicationComponent[]} an array of components or empty array if such app does not have any components or not found
   */
  static getRootApplicationComponents(app){
    aver.isOf(app, Application);
    const clist = ApplicationComponent.#appMap.get(app);
    if (clist === undefined) return [];
    return clist.filter(c => c.director === app);
  }

  #director;

  constructor(dir){
    super();
    this.#director = aver.isOfEither(dir, Application, ApplicationComponent);
    const app = this.app;
    let clist = ApplicationComponent.#appMap.get(app);
    if (clist === undefined){
      clist = [];
      ApplicationComponent.#appMap.set(app, clist);
    }
    clist.push(this);
  }

  /**
   * Finalizes app component by unregistering from the app
  */
  [types.DESTRUCTOR_METHOD](){
    const app = this.app;
    let clist = ApplicationComponent.#appMap.get(app);
    if (clist !== undefined){
      types.arrayDelete(clist, this);
      if (clist.length==0) ApplicationComponent.#appMap.delete(app);
    }
  }

  /** Returns a component or an app instance which directs(owns) this component
   * @returns {Application | ApplicationComponent}
  */
  get [types.DIRECTOR_PROP]() { return this.#director; }

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
    const all = ApplicationComponent.getAllApplicationComponents(this.app);
    return all.filter(c => c.director === this);
  }
}

/**
 * Arena represents a virtual "stage" - what application/user "deals with"
 * e.g. sees at the present moment.
 * An arena maintains a state of scenes which get created by components such as
 * modal dialogs which have a stacking order
 */
export class Arena extends ApplicationComponent{

  constructor(app){
    aver.isOf(app, Application);
    super(app);
  }

}
