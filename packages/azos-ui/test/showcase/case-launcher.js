/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/


import { html } from "../../ui";
import { CaseBase } from "./case-base";
import "../../launcher";
import { MenuCommand } from "../../cmd";


export class CaseLauncher extends CaseBase {

  #menu = new MenuCommand(this, {
    title: "Root Menu",
    icon: "svg://azos.ico.user",
    hint: "This is just a root menu item",
    menu: [
      "Section A",
      {title: "Item A"},
      "Section B",
      {title: "Item B"},
      {title: "Item C"},
      {title: "Item D"},
      null,//divider
      {title: "Item E"},
    ]
  });

  #btnOneClick(){
    this.launchMain.menu = this.#menu;
    this.launchMain.reset();
  }



  renderControl() {
    return html`
<h2>Launcher</h2>

<az-button @click="${this.#btnOneClick}" title="Do Something..."></az-button>


<az-launcher id="launchMain" scope="this">

</az-launcher>

    `;
  }
}

window.customElements.define("az-case-launcher", CaseLauncher);
