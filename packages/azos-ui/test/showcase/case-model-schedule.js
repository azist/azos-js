/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { DATA_BLOCK_PROP, DATA_VALUE_PROP } from "azos/types";
import { html } from "../../ui.js";
import { CaseBase } from "./case-base.js";
import "../../bit.js";
import "../../../azos-ui/models/lat-lng-bit.js";
import "../../../azos-ui/models/span-bit.js";
import "../../../azos-ui/models/day-override-bit.js";
import "../../../azos-ui/models/adlib-tag-bit.js";
import "../../../azos-ui/models/schedule-bit.js";
import { showMsg } from "../../msg-box.js";

export class CaseSchedule extends CaseBase {

  #btnGetClick(){
    showMsg("ok", "Schedule Data", "The following is obtained \n by calling [DATA_VALUE_PROP]: \n\n" +JSON.stringify(this.bitSchedule[DATA_VALUE_PROP], null, 2), 3, true);
  }

  #btnGetBlockClick(){
    showMsg("ok", "Schedule Data", "The following is obtained \n by calling [DATA_VALUE_PROP]: \n\n" +JSON.stringify(this.bitSchedule[DATA_BLOCK_PROP], null, 2), 3, true);
  }

  renderControl() {
    return html`

<h2> UI Bits (Fragments)</h2>

<p> This is a sample content which is placed outside of bits. </p>
<az-button id="btnGet" scope="this" @click="${this.#btnGetClick}" title="Get Schedule Data"></az-button>
<az-button id="btnBlock" scope="this" @click="${this.#btnGetBlockClick}" title="Get Block Data"></az-button>

<az-schedule-bit
  id="bitSchedule"
  title="Schedule Bit List"
  scope="this"
></az-schedule-bit>


    `;
  }
}

window.customElements.define("az-case-model-schedule", CaseSchedule);
