/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui.js";
import { CaseBase } from "./case-base.js";
import "../../bit.js";
import "../../../azos-ui/models/adlib-tag-bit.js";

export class CaseAdlib extends CaseBase {
  renderControl() {
    return html`

<h2> UI Bits (Fragments)</h2>

<p> This is a sample content which is placed outside of bits. </p>

<az-adlib-tag-bit
        id="bitTag"
        scope="this"
        class="span1"
        title="Text Tag"
      ></az-adlib-tag-bit>

      <az-adlib-tag-bit
        id="bitTag"
        scope="this"
        class="span1"
        title="Numeric Tag"
        isnumeric
      ></az-adlib-tag-bit>

    `;
  }
}

window.customElements.define("az-case-model-adlib", CaseAdlib);