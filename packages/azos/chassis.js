/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as aver from "./aver.js";
import * as strings from "./strings.js";

/**
 * Implements a default Application chassis pattern
 */
export class Application{
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
    aver.isObject(init);
    this.#instanceId = "aaaa";//crypto.randomUUID();
    this.#startTime = new Date();

    this.#id = strings.dflt(init.id, "#0");
    this.#name = strings.dflt(init.name, this.#id);
    this.#description = strings.dflt(init.description, this.#id);
    this.#copyright = strings.dflt(init.copyright, "2023 Azist Group");
    this.#envName = strings.dflt(init.envName, "local");
    this.#isTest = types.asBool(init.isTest);

    if (Application.#instance !== null){
      Application.#instances.push(Application.#instance);
    }
    Application.#instance = this;
  }

  /**
   * Finalizes the application by unmounting services.
   * This also replaces the {@link Application.instance} value
   * with the app instance that was in effect right before call to .ctor
   * or {@link NopApplication.instance} if there are no more apps in the stack.
   * This method has no effect in `NopApplication`
  */
  destructor(){
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

  /** Returns application instance UUID string assigned at start @return {string}*/
  get instanceId(){ return this.#instanceId; }

  /** Returns application start time stamp Date object @return {Date}*/
  get startTime(){ return this.#startTime; }
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
