import * as aver from "azos/aver";
import { isSubclassOf, AzosError } from "azos/types";
import { html, css, AzosElement } from "./ui.js";
import { Application } from "azos/application.js";

/**
 * Defines a root UI element which displays the whole Azos app.
 * See architecture introduction in root `readme.md`
 */
export class Arena extends AzosElement {

  /**
   * Launches Arena by registering it with the `window.customElementRegistry: CustomElementsRegistry`
   * @param {Application} app required application instance which arena works under
   * @param {string?} elementName - null or string name of arena custom element, `az-arena` used by default
   * @param {Function?} arenaClass - null or Arena or its subclass, `Arena` class used by default
   */
  static launch(app, elementName, arenaClass){
    aver.isOf(app, Application);
    elementName = aver.isString(elementName ?? "az-arena");
    arenaClass = arenaClass ?? Arena;
    aver.isTrue(arenaClass === Arena || isSubclassOf(arenaClass, Arena));
    window.customElements.define(elementName, arenaClass);

    //hook application by element name
    const allArenas = document.getElementsByTagName(elementName);
    for(const one of allArenas){
      one.____bindApplicationAtLaunch(app);
    }
  }

  //Sharing style sheets between Shadow Dom
  //// Create an element in the document and then create a shadow root:
  //const node = document.createElement("div");
  //const shadow = node.attachShadow({ mode: "open" });
  ////Adopt the same sheet into the shadow DOM
  //shadow.adoptedStyleSheets = [sheet];
  //https://stackoverflow.com/questions/69702129/how-to-use-adoptedstylesheets-in-lit
  //https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets
  static styles = css`p { color: blue }`;

  static properties = {
    name: {type: String},
  };

  #app;
  constructor() {
    super();
    this.name = 'Somebody';
  }

  /** System internal, don't use */
  ____bindApplicationAtLaunch(app){
    this.#app = app;
    this.requestUpdate();
  }

  /** Returns {@link Application} instance where this arena was launched
   * @returns {Application}
  */
  get app(){ const app = this.#app; if (!app) throw new AzosError("Arena app is not bound. Must call `Arena.launch(app...)`"); return app; }

  render() {
    const app = this.#app;
    if (!app) return "";
    //---------------------------
    return html`<section>
     <span>${this.name}</span>, Welcome to Azos Arena!
     App description is: ${app.description}
    </section>`;
  }

}


