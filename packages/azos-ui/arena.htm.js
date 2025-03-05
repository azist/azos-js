/*<FILE_LICENSE>
* Azos (A to Z Application Operating System) Framework
* The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
* See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

/* eslint-disable no-unused-vars */

import { showObject } from "./object-inspector-modal.js";
import { html, verbatimHtml, domRef, domCreateRef, renderInto } from "./ui.js";

// SVG Icons
// https://www.svgrepo.com/collection/solar-outline-icons/


function menuOpen(){
  this.renderRoot.getElementById("navMenu").classList.add("side-menu_expanded");
}
function menuClose(){
  this.renderRoot.getElementById("navMenu").classList.remove("side-menu_expanded");
}

function showUser(user, arena) {
  if (user.status === "Invalid")
    window.location.assign("/app/login");
  else
    showObject(user, { title: "User Profile", okBtnTitle: "Close" }, arena);
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
  let user = app.session?.user?.toInitObject();
  // user = { asof: "2025-03-05T15:10:41.605Z", authToken: "xyz", "claims": { "aud": "zeus", "email": "dkh-g8@greatdayimprovements.com", "exp": 1741274242, "g8_loupe": "223-322", "g8_org_unit": "orgu.path@sky-auth::/org/it/se/arch", "g8_pcms_id": "d641195a-2a37-45b0-8877-8f3f7539cd1d", "g8_role": "/role/it/super", "grafana-role": "Editor", "iat": 1741187441, "iss": "G8DayImprovements", "name": "Dmitriy K", "sub": "dkh" }, "descr": "DmitriyK", "name": "Dmitriy K", "rights": {}, "status": "Admin" };
  // user.desc = null;
  // user.name = null;
  let initials, cls;
  if (user?.status !== "Invalid") {
    initials = getInitials(user);
    cls = "loggedIn";
  }

  const content = html`
<div class="strip-btn ${cls}" id="divToolbar_User" @click="${evt => showUser.call(app, user, self)}">${initials ?? userIcon.html}</div>
${itemContent}
  `;

  renderInto(content, divToolbar);
}

function getInitials(user) {
  let parts;
  for (let screenName of [user.descr, user.name]) {
    if (!screenName) continue;
    else if (screenName.includes(" ")) { parts = screenName.split(" "); break; }
    else if (screenName.includes(".")) { parts = screenName.split("."); break; }
    else if (screenName.includes("-")) { parts = screenName.split("-"); break; }
    else if (screenName.includes("_")) { parts = screenName.split("_"); break; }
  }
  let initials;
  if (parts?.length > 0) initials = parts.map(n => n[0]).join("");
  else initials = user.name ?? "IN";

  return initials.slice(0, 2).toUpperCase();
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
    </ul>
  </nav>

  <div class="contact"></div>
  <div class="copyright">Copyright &copy; 2022-2023 Azist</div>
  `;
}
