/*<FILE_LICENSE>
* Azos (A to Z Application Operating System) Framework
* The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
* See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

/* eslint-disable no-unused-vars */

import { html } from "./ui.js";

function menuOpen(){
  this.renderRoot.getElementById("navMenu").classList.add("side-menu_expanded");
}
function menuClose(){
  this.renderRoot.getElementById("navMenu").classList.remove("side-menu_expanded");
}


/** @param {Application} app   @param {Arena} self  */
export function renderHeader(app, self){
  return html`
  <a href="#" class="menu" id="btnMenuOpen" @click="${menuOpen}">
    <svg><path d="M0,5 30,5  M0,14 25,14  M0,23 30,23"/></svg>
  </a>

  <nav class="side-menu" id="navMenu">
    <a href="#" class="close-button" id="btnMenuClose" @click="${menuClose}" >&times;</a>
    <ul>
      <li><a href="1.app">Applet 1</a></li>
      <li><a href="another.app">Another Applet </a></li>
      <li><a href="settings.app">Settings </a></li>
      <li><a href="x.app" >Menu Item X  </a></li>
    </ul>
  </nav>

  <div class="title">A very long name for the Arena: ${app.name}</div>

  <div class="strip">
    <div class="strip-btn">${app.session.user.name}</div>
    <div class="strip-btn"><svg style="width: 40px; height: 40px;"><path d="M0,5 30,5  M0,14 25,14  M0,23 30,23"/></svg></div>
    <div class="strip-btn">B3</div>
    </div>

  </div>
`;

}

/** @param {Application} app   @param {Arena} self  */
export function renderMain(app, self){
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
