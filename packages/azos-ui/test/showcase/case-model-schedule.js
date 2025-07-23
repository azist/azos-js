/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui.js";
import { CaseBase } from "./case-base.js";
import "../../bit.js";
import "../../../azos-ui/models/lat-lng-bit.js";
import "../../../azos-ui/models/span-bit.js";
import "../../../azos-ui/models/day-override-bit.js";
import "../../../azos-ui/models/adlib-tag-bit.js";
import "../../../azos-ui/models/schedule-bit.js";

export class CaseSchedule extends CaseBase {
  renderControl() {
    return html`

<h2> UI Bits (Fragments)</h2>

<p> This is a sample content which is placed outside of bits. </p>
//TODO: add button to display json output from schedule bit data look in feature b for display of Person Block data use showMsg from msg-box.js
<az-schedule-bit
  id="bitSchedule"
  title="Schedule Bit List"
  scope="this"
></az-schedule-bit>
    `;
  }
}

window.customElements.define("az-case-model-schedule", CaseSchedule);
