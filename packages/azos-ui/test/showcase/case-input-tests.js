/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui.js";
import { CaseBase } from "./case-base.js";
import "../../parts/text-field.js";
import "../../parts/date-range-field.js";

export class CaseInputTests extends CaseBase {

  #onFieldChange(e) {
    console.log("Got change event from field: ", e.target.name, e.target.value);
    this.tbLastName.status = this.chkDrinks.value ? "alert" : "default";
  }

  renderControl() {
    return html`
<h2>Testing @change with az-text and az-check</h2>

<az-text id="tbNasa" scope="window" status="info" name="Nasa" title="Nasa Experimentation" placeholder="Hatch diameter inches" @change="${this.#onFieldChange}" datatype="int" value="10"></az-text>

<az-text id="tbFirstName" scope="this" name="FN" title="First Name" placeholder="Patient First Name" @change="${this.#onFieldChange}" value="Patient A"></az-text>
<az-text id="tbLastName" scope="this" name="LN" title="Last Name" placeholder="Patient Last Name" @change="${this.#onFieldChange}"></az-text>

<az-text id="tbD1" scope="this" name="d1" title="Date Type" placeholder="2024/01/01 1:00 pm" dataType="date" dataKind="text" @change="${this.#onFieldChange}" style="width: 50vw"></az-text>
<az-text id="tbD2" scope="this" name="d2" title="Date Type with Kind" placeholder="2024/01/01 1:00 pm" dataType="date" dataKind="datetime" @change="${this.#onFieldChange}" style="width: 50vw"></az-text>
<az-text id="tbD3" scope="this" name="d3" title="Date Type with Display Format" placeholder="2024/01/01 1:00 pm" dataType="date" dataKind="datetime" displayFormat='My prefix: <<v::ld{"dtFormat": "LongDate", "tmDetails": "NONE"}>>' @change="${this.#onFieldChange}" style="width: 50vw"></az-text>

<az-text id="tbDX" scope="this" name="dx" title="Date Type with Local Kind" placeholder="2024/01/01 1:00 pm" dataType="date" dataKind="datetime-local" @change="${this.#onFieldChange}" style="width: 50vw"></az-text>

<az-check id="chkSmokes" scope="this" name="Smokes" title="He smokes" @change="${this.#onFieldChange}"></az-check>
<az-check id="chkDrinks" scope="this" name="Drinks" title="He drinks hard liquor" @change="${this.#onFieldChange}"></az-check>
    `;
  }
}

window.customElements.define("az-case-input-tests", CaseInputTests);
