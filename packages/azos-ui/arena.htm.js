/*<FILE_LICENSE>
* Azos (A to Z Application Operating System) Framework
* The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
* See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

/* eslint-disable no-unused-vars */

import { BrowserRouter } from "./browser-router.js";
import { showObject } from "./object-inspector-modal.js";
import { html, verbatimHtml, domRef, domCreateRef, renderInto } from "./ui.js";




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

  const userIcon = self.renderImageSpec("svg://azos.ico.user");
  let user = app.session?.user?.toInitObject();
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

