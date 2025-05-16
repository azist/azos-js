/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { css, html } from "../../ui.js";
import { CaseBase } from "./case-base.js";
import "../../parts/text-field.js";
import "../../parts/date-range-field.js";
import "../../vcl/util/code-box.js";

export class CaseDateRange extends CaseBase {
  constructor() { super(); }
  static styles = css`
#resultProgrammatic{ display: grid; grid-template-columns: 1fr 1fr; grid-auto-rows: 1fr; align-items: center; }
#resultProgrammatic *{ width: calc(100% - 20px); }
#drHasValue{ width: calc(50% - 20px);}
  `;
  #drProgrammaticUpdated(e) {
    const pad = v => (v + "").padStart(2, "0");
    const dateToDateFieldString = v => v ? `${v.getUTCFullYear()}-${pad(v.getUTCMonth() + 1)}-${pad(v.getUTCDate())}` : null;
    const value = e.target.value;
    this.cbProgrammatic.source = JSON.stringify(value, null, 2);
    this.tbStart.setValueFromInput(dateToDateFieldString(value.start));
    this.tbEnd.setValueFromInput(dateToDateFieldString(value.end));
    this.requestUpdate();
  }

  #tbChange(e, field) {
    const value = e.target.value;
    this.drProgrammatic.setFieldValueFromInput(value, field);
    this.cbProgrammatic.source = JSON.stringify(this.drProgrammatic.value, null, 2);
    this.update();
  }

  firstUpdated() { this.drProgrammatic.setValueFromInput({ start: "2023-01-01", end: "2023-12-31" }); }
  #dateRangeStartValue = { start: "2023-01-01", end: "2023-12-31" };
  renderControl() {
    return html`
<h2>Programmatic input</h2>
<az-text id="tbStart" scope="this" @change="${e => this.#tbChange(e, "start")}" title="Start" dataKind="date"></az-text>
<az-text id="tbEnd" scope="this" @change="${e => this.#tbChange(e, "end")}" title="End" dataKind="date"></az-text>
<div id="resultProgrammatic">
  <az-date-range id="drProgrammatic" scope="this" title="Programmatic Date Range" @change="${this.#drProgrammaticUpdated}"></az-date-range>
  <az-code-box id="cbProgrammatic" scope="this" title="Value from Date Range" source=" "></az-code-box>
</div>

<h2>Direct Assignment</h2>
<h4>Value: '${JSON.stringify(this.#dateRangeStartValue)}'</h4>
<az-date-range id="drHasObjectValue" title="As Object via '.value'" .value="${this.#dateRangeStartValue}"></az-date-range>
<az-date-range id="drHasJsonValue" title="As Json via 'value'" value="${JSON.stringify(this.#dateRangeStartValue)}"></az-date-range>

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
