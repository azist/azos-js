/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
import { isSubclassOf, AzosError } from "azos/types";
import { html, css, AzosElement } from "./ui.js";
import { Application } from "azos/application.js";

import { ARENA_STYLES } from "./arena.css.js";

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
  static styles = ARENA_STYLES; //[ARENA_STYLES, css`p { color: blue }`];

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

    return html`
<header>
${this.renderHeader(app)}
</header>
<main>
${this.renderMain(app)}
</main>
<footer>
${this.renderFooter(app)}
</footer>`;
  }//render

  /** @param {Application} app  */
  renderHeader(app){
    return html`
  <a href="#" class="menu" id="btnMenuOpen">
    <svg style="stroke:#f0f0f0; stroke-width: 3px;">
      <path d="M0,5 30,5  M0,14 25,14  M0,23 30,23"/>
    </svg>
  </a>

  <nav class="side-menu" id="navMenu">
    <a href="#" class="close-button" id="btnMenuClose">&times;</a>
    <ul>
      <li><a href="1.app">Applet 1</a></li>
      <li><a href="another.app">Another Applet </a></li>
      <li><a href="settings.app">Settings </a></li>
      <li><a href="x.app" >Menu Item X  </a></li>
    </ul>
  </nav>

  <div class="title">Azos Arena: ${app.name}</div>

  <div class="user">Welcome ${app.session.user.name}!</div>`;
  }

  renderMain(app){
    return html`
    <h1>Header One</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
      nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
      esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
      in culpa qui officia deserunt mollit anim id est laborum.
    </p>
    `;
  }

  renderFooter(app){
    return html`
    <nav class="bottom-menu" id="navBottomMenu">
    <ul>
        <li><a href="index"   >Home     </a></li>
        <li><a href="about"   >About    </a></li>
        <li><a href="services">Services </a></li>
        <li><a href="contact" >Contact  </a></li>
      </ul>
    </nav>

    <div class="contact">
      <span class="line">1982 Jack London Street suite 2A</span>
      <span class="line">New Applewood, CA 90210-1234</span>
      <span class="line">555.123.4567</span>
    </div>`;
  }

}//Arena


