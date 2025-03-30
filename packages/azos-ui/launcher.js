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

  #ranks = [];

  #menu;
  /** Returns the root rank of the launcher menu */
  get menu(){ return this.#menu; }
  /** Sets the root rank of the launcher menu */
  set menu(v) {
    this.#menu = aver.isOf(v, MenuCommand);
    this.requestUpdate();
  }

  static properties = {
    menu: { type: Object, reflect: false}
  };


  /** Returns currently open menu rank starting at the root menu rank */
  get current(){ return this.#ranks.length > 0 ? this.#ranks.at(-1) : this.#menu; }

  /** Collapses menu navigation and starts over from the top */
  reset(){
   this.#ranks = [];
   this.requestUpdate();
  }

  /** Navigates to a next child rank of the current one */
  navChild(rank){
    aver.isOf(rank, MenuCommand);
    aver.isTrue(this.current.menu.some(one => one === rank), "Menu rank must be a child of the current one");
    this.#ranks.push(rank);
    this.requestUpdate();
  }

  /** Navigates back to any rank on the parent path. Null navigates to the root */
  navBack(rank){
    aver.isOfOrNull(rank, MenuCommand);
    if (!rank || rank === this.#menu) {
      this.reset();
      return;
    }
    const idx = this.#ranks.indexOf(rank);
    aver.isTrue(idx >= 0, "Existing parent menu rank");
    this.#ranks.splice(idx + 1);
    this.requestUpdate();
    return true;
  }

  static styles = [css`
.breadcrumb{
  font-size: 0.85em;
  opacity: 0.5;
}

.breadcrumb span{
  font-size: 0.9em;
  opacity: 1.0;
}

   `];//styles


  renderControl(){
    if (!this.#menu) return noContent;

    const head = this.renderHead();
    const menu = this.renderMenu();
    const foot = this.renderFoot();

    return html`
     <section id="sectHead">${head}</section>
     <section id="sectMenu">${menu} </section>
     <section id="sectFoot">${foot}</section>
    `;
  }

  renderHead(){
   const ranks = [];
   for(const one of this.#ranks){
     ranks.push(html`&nbsp;/&nbsp;<span>${one.title}</span>`);
   }
   return html`<div class="breadcrumb"> ${ranks} </div>`;
  }

  renderMenu(){
   const children = [];
   for(const one of this.current.menu){
    children.push(html`<li>${one.title}</li>`);
   }
   return html`<ul> ${children} </ul>`;
  }

  renderFoot(){
    return html`
    Read Application Description
    (c) 2025 App Copyright
    App Version Tag / App Environment
    `;
  }

}

window.customElements.define("az-launcher", Launcher);
