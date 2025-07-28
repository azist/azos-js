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
import { showMsg } from "../../msg-box.js";


export class CaseSpan extends CaseBase {
#btnGetClick(){
    showMsg("ok", "Span Data", "The following is obtained \n by calling [DATA_VALUE_PROP]: \n\n" +JSON.stringify(this.bitSpan[DATA_VALUE_PROP], null, 2), 3, true);
  }

  #btnSetClick(){
    this.bitSpan[DATA_VALUE_PROP] = new UiInputValue(
  {
    "name": "Yarp",
    "title": {
      "eng": {
        "n": "Yarp",
        "d": "English title"
      }
    },
    "range": {
      "start": "2023-10-01T00:00:00.000Z",
      "end": "2023-10-31T23:59:59.999Z"
    },
          "monday": "c'thulu",
          "tuesday": "narlethep",
          "wednesday": "the one who slumbers",
          "thursday": "the prince of insanity",
          "friday": "rae'liegh",
          "saturday": "jellyfish",
          "sunday": "oipuwer"
        }
  );
  }

  renderControl() {
    return html`

<h2> UI Bits (Fragments)</h2>

<p> This is a sample content which is placed outside of bits. </p>
<az-button id="btnGet" scope="this" @click="${this.#btnGetClick}" title="Get Span Data"></az-button>
<az-button id="btnSet" scope="this" @click="${this.#btnSetClick}" title="Set Span Data"></az-button>

<az-span-bit
  id="bitSpan"
  title="Span Bit"
  scope="this"
></az-span-bit>`;
  }
}

window.customElements.define("az-case-model-schedule-span", CaseSpan);
