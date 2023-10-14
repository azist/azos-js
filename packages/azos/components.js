/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as aver from "./aver.js";
import { Application } from "./application.js";

/**
 * Base class for application components which work either under {@link Application} directly
 * or another component. This way components form component trees which application can maintain uniformly
 */
export class AppComponent extends types.DisposableObject{
  static #appMap = new Map();

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

  constructor(dir){
    super();
    this.#director = aver.isOfEither(dir, Application, AppComponent);
    const app = this.app;
    let clist = AppComponent.#appMap.get(app);
    if (clist === undefined){
      clist = [];
      AppComponent.#appMap.set(app, clist);
    }
    clist.push(this);
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
}
