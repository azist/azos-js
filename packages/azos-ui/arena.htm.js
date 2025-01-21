/*<FILE_LICENSE>
* Azos (A to Z Application Operating System) Framework
* The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
* See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

/* eslint-disable no-unused-vars */

import { html, verbatimHtml, domRef, domCreateRef, renderInto } from "./ui.js";

// SVG Icons
// https://www.svgrepo.com/collection/solar-outline-icons/


function menuOpen(){
  this.renderRoot.getElementById("navMenu").classList.add("side-menu_expanded");
}
function menuClose(){
  this.renderRoot.getElementById("navMenu").classList.remove("side-menu_expanded");
}

function showUser(){
  alert("Logged in user is: " + this.session.user.name);
}

async function toolbarClick(){
  await this.exec(this);
}

function getRefToolbar(arena){
  let refToolbar = arena.__refToolbar;
  if (!refToolbar){
    arena.__refToolbar = refToolbar = domCreateRef();
  }
  return refToolbar;
}


/** @param {Application} app   @param {Arena} self  */
export function renderToolbar(app, self, commands){
  const divToolbar = getRefToolbar(self).value;
  if (!divToolbar) return;

  const itemContent = [];

  let i=0;
  for(let cmd of commands){
    const one = html`<div class="strip-btn" id="divToolbar_${i++}" @click="${toolbarClick.bind(cmd)}">
      ${cmd.provideMarkup(self, self)}
    </div>`;
    itemContent.push(one);
  }


  const userIcon = self.renderImageSpec("svg://azos.ico.user?m=i32");
  const content = html`
  <div class="strip-btn" id="divToolbar_User" @click="${showUser.bind(app)}">${userIcon.html}</div>

  ${itemContent}
    `;

  renderInto(content, divToolbar);
}


/** @param {Application} app   @param {Arena} self  */
export function renderHeader(app, self){

  const applet = self.applet;
  const title = applet !== null ? html`${applet.title}` : html`${app.description} - ${self.name}`

  if (self.menu==="show"){
    return html`
    <a href="#" class="menu" id="btnMenuOpen" @click="${menuOpen}">
      <svg><path d="M0,5 30,5  M0,14 25,14  M0,23 30,23"/></svg>
    </a>

    <nav class="side-menu" id="navMenu">
      <a href="#" class="close-button" id="btnMenuClose" @click="${menuClose}" >&times;</a>
      <ul>
        <li><a href="/">New Visual Control Showcase</a></li>
        <li><a href="/0.app">Old Visual Control Showcase</a></li>
        <li><a href="/1.app">Old Visual Control Showcase Tabbed</a></li>
        <li><a href="/2.app">Old Visual Control Showcase SlideDeck</a></li>
        <li><a href="/4.app">Simple Control Showcase</a></li>
        <li><a href="/5.app">Scheduling Control - WIP</a></li>
      </ul>
    </nav>

    <div class="title">${title}</div>
    <div class="strip" ${domRef(getRefToolbar(self))}> </div>
  `;
  } else {//noMenu
    return html`
     <div class="title" style="left: 0px;">${title}</div>
     <div class="strip" ${domRef(getRefToolbar(self))}> </div>`;
  }

}

/** @param {Application} app   @param {Arena} self  */
export function renderMain(app, self, appletTagName){

  const appletHtml = appletTagName ? `<${appletTagName} id="elmActiveApplet"></${appletTagName}>` : `<slot name="applet-content"> </slot>`;

  const clsMain = self.isKiosk ? "kiosk" : "";

  return html`
  <div class="applet-container ${clsMain}" role="main" >
    ${verbatimHtml(appletHtml)}
  </div>
  `;
}

/** @param {Application} app   @param {Arena} self  */
export function renderFooter(app, self){
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
