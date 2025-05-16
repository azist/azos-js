/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui.js";
import { CaseBase } from "./case-base.js";
import "../../bit.js";

export class CaseBit extends CaseBase {


  renderControl() {
    return html`

<h2> UI Bits (Fragments)</h2>

<az-bit id="bitAboutUs" scope="this">
  About us paragraph content goes here. It is really
  slotted into the bit. You can use the az-bit tag to place
  content inside the bit. The az-bit tag is a custom element
  that is used to create a bit. And this content is placed in a default slot.
</az-bit>
    `;
  }
}

window.customElements.define("az-case-bit", CaseBit);
