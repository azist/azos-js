/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseInputTests extends CaseBase {

  #onFieldChange(e) {
    console.log("Got change event from field: ", e.target.name, e.target.value);
    this.tbLastName.status = this.chkDrinks.value ? "alert" : "default";
  }

  renderControl() {
    return html`
<h2>Testing @change with az-text and az-check</h2>

<az-text id="tbNasa" scope="window" name="Nasa" title="Nasa Experimentation" placeholder="Hatch diameter inches" @change="${this.#onFieldChange}" datatype="int" value="10"></az-text>

<az-text id="tbFirstName" scope="this" name="FN" title="First Name" placeholder="Patient First Name" @change="${this.#onFieldChange}" value="SHITTERESSS"></az-text>
<az-text id="tbLastName" scope="this" name="LN" title="Last Name" placeholder="Patient Last Name" @change="${this.#onFieldChange}"></az-text>

<az-text id="getADate" scope="this" name="getADate" title="Get a Date" placeholder="2024/01/01" dataKind="date"></az-text>

<az-check id="chkSmokes" scope="this" name="Smokes" title="He smokes" @change="${this.#onFieldChange}"></az-check>
<az-check id="chkDrinks" scope="this" name="Drinks" title="He drinks hard liquor" @change="${this.#onFieldChange}"></az-check>
    `;
  }
}

window.customElements.define("az-case-input-tests", CaseInputTests);
