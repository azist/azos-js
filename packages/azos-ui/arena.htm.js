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


  const content = html`
  <div class="strip-btn" id="divToolbar_User" @click="${showUser.bind(app)}">
    <svg width="28px" height="28px" viewBox="0 0 24 24">
      <circle cx="12" cy="6" r="4"/>
      <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"/>
    </svg>
  </div>

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

/*
  <div class="strip">
    <div class="strip-btn">
      <svg width="28px" height="28px" viewBox="0 0 24 24">
      <circle cx="12" cy="6" r="4"/>
      <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"/>
      </svg>
    </div>
    <div class="strip-btn">
    <svg width="28px" height="28px" viewBox="0 0 24 24">
      <path d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z"/>
      <path d="M10 9H14L10 13H14" stroke-linejoin="round"/>
      <path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" />
    </svg>
    </div>
    <div class="strip-btn">
      <svg width="28px" height="28px" viewBox="0 0 24 24">
        <path d="M16 4C18.175 4.01211 19.3529 4.10856 20.1213 4.87694C21 5.75562 21 7.16983 21 9.99826V15.9983C21 18.8267 21 20.2409 20.1213 21.1196C19.2426 21.9983 17.8284 21.9983 15 21.9983H9C6.17157 21.9983 4.75736 21.9983 3.87868 21.1196C3 20.2409 3 18.8267 3 15.9983V9.99826C3 7.16983 3 5.75562 3.87868 4.87694C4.64706 4.10856 5.82497 4.01211 8 4" />
        <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" />
        <path d="M15 13L12 13M12 13L9 13M12 13L12 10M12 13L12 16"/>
      </svg>
    </div>
  </div>
 */

}

/** @param {Application} app   @param {Arena} self  */
export function renderMain(app, self, appletTagName){

  const appletHtml = appletTagName ? `<${appletTagName} id="elmActiveApplet"></${appletTagName}>` : `<slot name="applet-content"> </slot>`;

  const clsMain = self.isKiosk ? "kiosk" : "";

  return html`
  <!--nav class="strip" id="navAreas">  THIS will be moved out into tab group control
    <div class="strip-btn strip-btn-selected">
      <svg width="28px" height="28px" viewBox="0 0 24 24">
      <circle cx="12" cy="6" r="4"/>
      <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"/>
      </svg>
    </div>
    <div class="strip-btn">
      <svg width="28px" height="28px" viewBox="0 0 24 24">
      <circle cx="12" cy="6" r="4"/>
      <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"/>
      </svg>
    </div>
  </nav-->

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
