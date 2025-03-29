/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
import { Control, css, html, noContent } from "./ui";
import { MenuCommand } from "./cmd";


/** Visualizes menu commands in a cascading fashion as used in
 * arena launcher  */
export class Launcher extends Control {

  #state = {
   ranks: []
  };

  #menu;
  /** Returns the root rank of the launcher menu */
  get menu(){ return this.#menu; }
  /** Sets the root rank of the launcher menu */
  set menu(v) { this.#menu = aver.isOf(v, MenuCommand); }

  static properties = {
    menu: { type: Object, reflect: false}
  };


  /** Returns currently open menu rank or root rank */
  get current(){ return this.#state.path.at(-1); }

  /** Collapses menu navigation and starts over from the top */
  reset(){
   this.#state.ranks = [];
   this.requestUpdate();
  }


  static styles = [css`
   `];//styles


  renderControl(){
    if (!this.#menu) return noContent;

    const head = this.renderHead();
    const menu = this.renderMenu();
    const foot = this.renderFoot();

    return html`
     <section id="sHead">${head}</section>
     <section id="sMenu">${menu} </section>
     <section id="sFoot">${foot}</section>
    `;
  }

  renderHead(){
   return html`Menu Parent/Menu Child/...`;
  }

  renderMenu(){
   return html` MENU BODY `;
  }

  renderFoot(){
    return html`
    Read Application Description
    (c) 2025 App Copyright
    App Version Tag / App Environment
    `;
  }

}
