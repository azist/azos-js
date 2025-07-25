/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { DATA_BLOCK_PROP, DATA_VALUE_PROP } from "azos/types";
import { html, UiInputValue } from "../../ui.js";
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

  #btnGetListClick(){
    showMsg("ok", "Schedule List Data", "The following is obtained \n by calling [DATA_VALUE_PROP]: \n\n" +JSON.stringify(this.bitScheduleList[DATA_VALUE_PROP], null, 2), 3, true);
  }

  #btnSetClick(){
    this.bitSchedule[DATA_VALUE_PROP] = new UiInputValue({
        "name":"asdf",
        "title": [
                {
                  "d": "poiwer",
                  "iso": "eng",
                  "n": "lksjdf"
                }
              ],
        "spans": [
              {
                "poiu": {
                  "monday": "asdf",
                  "tuesday": "zxcv",
                  "wednesday": "asdf",
                  "thursday": "zcxv",
                  "friday": "qwer",
                  "saturday": "sdfg",
                  "sunday": "erty"
                }
              }
            ],
        "overrides": [
          {
            "date": "2025-01-01T00:00:00.000Z",
            "hours": "closed",
            "name": "new year",
            "title": [
              {
                "d": "poiwer",
                "iso": "eng",
                "n": "lksdjf"
              }
            ]
          }
        ]
      });
  }

  

  renderControl() {
    return html`

<h2> UI Bits (Fragments)</h2>

<p> This is a sample content which is placed outside of bits. </p>
<az-button id="btnGet" scope="this" @click="${this.#btnGetClick}" title="Get Schedule Data"></az-button>
<az-button id="btnGetList" scope="this" @click="${this.#btnGetListClick}" title="Get List Data"></az-button>
<az-button id="btnSet" scope="this" @click="${this.#btnSetClick}" title="Set Schedule Data"></az-button>

<az-schedule-bit
  id="bitSchedule"
  title="Schedule Bit"
  scope="this"
></az-schedule-bit>


<az-schedule-bit-list
  id="bitScheduleList"
  title="Schedule Bit List"
  scope="this"
></az-schedule-bit-list>


    `;
  }
}

window.customElements.define("az-case-model-schedule", CaseSchedule);
