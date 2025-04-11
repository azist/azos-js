/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
import { Control, css, html, noContent } from "./ui";
import { Command, MenuCommand } from "./cmd";

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
    this.#ranks.splice(idx);
    this.requestUpdate();
  }

  static styles = [css`

:host{
  display: block;
  width: 100%;
  padding: 1em;
  box-sizing: border-box;
  user-select: none;
}

ul {
  list-style-type: none;
  display: block;
  margin: 0px;
  padding: 0px;
}

li{
  padding: 0.1em;
  font-size: 0.825em;
}

.menu-command:hover{
  text-shadow: 0px 0px 8px  #202020af;
}

.menu-divider hr {
  height: 0px;
  width: 95%;
  border: 1px solid #e0e0e040;
  font-size: 0.1em;
  float: left;
}

.menu-command{}

.menu-header{
  color: #ffffffa0;
  border-bottom: 1px solid #f0f0f0d0;
  margin: 0.2em 0 0.35em 0em;
  padding: 0.25em;
  font-size: 0.85em;
  position: relative;
  left: -1ch;
}

.menu-section{
  color: #ffffffa0;
  border-bottom: 1px solid #f0f0f050;
  margin: 0.2em 0 0.35em 0em;
  padding: 0.25em;
  font-size: 0.75em;
}

.icon svg{
  height: 2.0em;
  stroke: #ffffffd0;
  vertical-align: middle;
}
.fas svg{ fill: #ffffffa0; }


   `];//styles


  renderControl(){
    if (!this.#menu) return noContent;

    const head = this.renderHead();
    const menu = this.renderMenu();

    return html`
     <section id="sectHead">${head}</section>
     <section id="sectMenu">${menu} </section>
    `;
  }

  // renderHead(){
  //  const menus = [this.#menu, ...this.#ranks];

  //  const ranks = [];
  //  let first = true;
  //  for(const one of menus){
  //    if (!first) ranks.push(html`&nbsp;/&nbsp;<span>${one.title}</span>`);
  //    first = false;
  //  }
  //  return html`<div class="breadcrumb"> ${ranks} </div>`;
  // }

  renderHead(){
    const menus = [this.#menu, ...this.#ranks].slice(1);//skip root
    const children = [];
    const session = this.arena.app.session;
    for(const one of menus){
      if (!one.isAnythingAuthorized(session)) continue;
      const ico = one.icon ? this.renderImageSpec(one.icon).html : noContent;
      children.push(html`<li class="menu-header" @click="${() => { this.#onClickHeader(one);} }">${ico} ${one.title}</li>`);
    }
    return html`<ul> ${children} </ul>`;
  }

  renderMenu(){
   const children = [];
   const session = this.arena.app.session;
   for(const one of this.current.menu){

     if (!one){ //menu divider
      children.push(html`<li class="menu-divider"> <hr> </li>`);
      continue;
     }

     if (one instanceof Command){
       if (!one.isAnythingAuthorized(session)) continue;
       const ico = one.icon ? this.renderImageSpec(one.icon).html : noContent;
       children.push(html`<li class="menu-command" @click="${() => { this.#onClickItem(one);} }">${ico} ${one.title}</li>`);
       continue;
     }

     //Section name
     children.push(html`<li class="menu-section">${one.toString()}</li>`);
   }
   return html`<ul> ${children} </ul>`;
  }

  _onItemActivated(item, result){
    const options = {
      detail: {item: item, result: result},
      bubbles: true,
      composed: true,
      cancelable: false
    };
    this.dispatchEvent(new CustomEvent('itemActivated', options));
  }

  async #onClickHeader(item){
    if (item instanceof MenuCommand){
      this.navBack(item);
    }
    this._onItemActivated(item, null);
  }

  async #onClickItem(item){

    let result = null;

    if (item instanceof MenuCommand){
      this.navChild(item);
    } else {
      result = await item.exec(this.arena, this);
    }

    this._onItemActivated(item, result);
  }

}

window.customElements.define("az-launcher", Launcher);
