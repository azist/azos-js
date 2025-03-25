/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";
import "../../parts/text-field";
import "../../parts/date-range";

export class CaseDateRange extends CaseBase {

  #onFieldChange(e) {
    console.log("Got change event from field: ", e.target.name, e.target.value);
    this.tbLastName.status = this.chkDrinks.value ? "alert" : "default";
  }

  renderControl() {
    return html`
<h2>Date Range</h2>

<az-date-range title="Valid Span UTC" optionalStart optionalEnd></az-date-range>
<az-date-range title="Valid Span UTC" optionalStart></az-date-range>
<az-date-range title="Valid Span UTC" optionalEnd></az-date-range>
<az-date-range title="Valid Span UTC"></az-date-range>

<h2>Status</h2>
<az-date-range title="Valid Span UTC" status="info"></az-date-range>
<az-date-range title="Valid Span UTC" status="ok"></az-date-range>
<az-date-range title="Valid Span UTC" status="warn"></az-date-range>
<az-date-range title="Valid Span UTC" status="alert"></az-date-range>
<az-date-range title="Valid Span UTC" status="error"></az-date-range>

<h2>Rank</h2>
<az-date-range title="Valid Span UTC" rank="1"></az-date-range>
<az-date-range title="Valid Span UTC" rank="2"></az-date-range>
<az-date-range title="Valid Span UTC" rank="3"></az-date-range>
<az-date-range title="Valid Span UTC" rank="4"></az-date-range>
<az-date-range title="Valid Span UTC" rank="5"></az-date-range>
<az-date-range title="Valid Span UTC" rank="6"></az-date-range>
    `;
  }
}

window.customElements.define("az-case-date-range", CaseDateRange);
