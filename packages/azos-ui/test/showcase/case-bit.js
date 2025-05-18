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

<p> This is a sample content which is placed outside of bits. </p>

<az-bit id="bitAboutus" scope="this">
  <p>
  About us paragraph content goes here. It is really
  slotted into the bit. You can use the az-bit tag to place
  content inside the bit. The az-bit tag is a custom element
  that is used to create a bit. And this content is placed in a default slot.
  </p>

  <p>
  Notice, that you can place any content into the bit. For example, you can surround a
  block of data fields with a bit, or surround other bits with this bit, this way you can create a hierarchical
  structure of bits.
  </p>
</az-bit>


<p>
  Another Content outside. We are going to generate some test content here, which will span multiple lines.
  For some reason, we need to generate a lot of text here.
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
</p>

<p>
  Here is another example of bs text to fill space. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</p>

<az-bit id="bitAboutus" scope="this">
  <p>
  About us paragraph content goes here. It is really
  slotted into the bit. You can use the az-bit tag to place
  content inside the bit. The az-bit tag is a custom element
  that is used to create a bit. And this content is placed in a default slot.
  </p>
    <az-bit id="bitAboutus" scope="this">
      <p>
      About us paragraph content goes here. It is really
      slotted into the bit. You can use the az-bit tag to place
      content inside the bit. The az-bit tag is a custom element
      that is used to create a bit. And this content is placed in a default slot.
      </p>

      <az-text title="First Name" required></az-text>
      <az-text title="Last Name" required></az-text>

      <p>
      Notice, that you can place any content into the bit. For example, you can surround a
      block of data fields with a bit, or surround other bits with this bit, this way you can create a hierarchical
      structure of bits.
      </p>
    </az-bit>
  <p>
  Notice, that you can place any content into the bit. For example, you can surround a
  block of data fields with a bit, or surround other bits with this bit, this way you can create a hierarchical
  structure of bits.
  </p>
</az-bit>

    `;
  }
}

window.customElements.define("az-case-bit", CaseBit);
