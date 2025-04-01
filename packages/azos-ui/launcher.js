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
    return true;
  }

  static styles = [css`
:root {
  --link-pad: .25em 1em;
}
:host{
  display: block;
  width: 100%;
  /* padding: 1em; */
  margin: 1em 0;
  box-sizing: border-box;
  user-select: none;
  font-size: 16px;
  padding-top: 44px;
}

ul {
  list-style-type: none;
  display: block;
  margin: 0px;
  padding: 0px;
}

li{
  padding: 0.1em;
  padding: var(--link-pad);
  }

.menu-command:hover{
  /* text-shadow: 0px 0px 8px  #202020af; */
}

.menu-divider hr {
  height: 0px;
  width: 95%;
  border: 1px solid #e0e0e040;
  font-size: 0.1em;
  float: left;
}

.menu-command{}

.menu-header, .menu-command, li {
  padding: var(--link-pad);
}

.menu-header{
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  margin: 10px 0px;
  padding: 8px 0px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 0px;
}

.menu-section{
  margin: 0.2em 0 0.35em 0em;
  padding: 0.25em;
  font-size: 0.75em;
}

.icon svg{
  height: 2.0em;
  stroke: #fff;
  vertical-align: middle;
}
.fas svg{ fill: #fff; }

/* General Styles */
#sectMenu {

    padding: 15px;
}

/* List Styles */
ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

li {
    padding: 8px 12px;
    border-radius: 4px;
    transition: background 0.3s ease-in-out;
    font-weight: 500;
}

li:not(.menu-section):hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Section Headers */
.menu-section {
    font-weight: bold;
    text-transform: uppercase;
    margin: 10px 0;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 0;
}

/* Menu Items */
.menu-command {
    padding: 10px;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s ease-in-out;
}

.menu-command:hover {
    background: rgba(255, 255, 255, 0.1);
}

.menu-command i {
    margin-right: 10px;
}

/* SVG Icons */
.menu-command svg {
    width: 20px;
    height: 20px;
}

/* Dividers */
.menu-divider {
  margin: 1em 0;
  border: 1px solid #e0e0e040;
  padding: 0;
  hr {
    display: none;
  }
}

.menu-header:hover {
  position: relative;
  .header-back {
    display: block; }
}
.header-back {
  position: absolute;
  display: none;
  /* background-blend-mode: multiply; */
  background-color: #f9a33d;
  backdrop-filter: blur(10px);
}

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
    for(const one of menus){
      const ico = one.icon ? this.renderImageSpec(one.icon).html : noContent;
      children.push(html`<li class="menu-header" @click="${() => { this.#onClickHeader(one);} }"><span class="header-back">${this.renderImageSpec('svg://azos.ico.arrowLeft').html}</span> ${ico} ${one.title}</li>`);
    }
    return html`<ul> ${children} </ul>`;
  }

  renderMenu(){
   const children = [];
   for(const one of this.current.menu){

     if (!one){ //menu divider
      children.push(html`<li class="menu-divider"> <hr> </li>`);
      continue;
     }

     if (one instanceof Command){
       const ico = one.icon ? this.renderImageSpec(one.icon).html : noContent;
       children.push(html`<li class="menu-command" @click="${() => { this.#onClickItem(one);} }">${ico} ${one.title}</li>`);
       continue;
     }

     //Section name
     children.push(html`<li class="menu-section">${one.toString()}</li>`);
   }
   return html`<ul> ${children} </ul>`;
  }

  async #onClickHeader(item){
    console.dir(item);
    if (item instanceof MenuCommand){
      this.navBack(item);
    }
    //todo: Add custom event to close
  }

  async #onClickItem(item){
    console.dir(item);
    if (item instanceof MenuCommand){
      this.navChild(item);
    } else {
      await item.exec(this);
    }

    //todo: Add custom event to close
  }

}

window.customElements.define("az-launcher", Launcher);
