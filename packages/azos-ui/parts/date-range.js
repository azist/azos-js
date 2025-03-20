/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOneOf, asString, format } from 'azos/strings';
import { html, parseRank, parseStatus, noContent } from '../ui.js';
import { baseStyles, dateRangeStyles, textFieldStyles } from './styles.js';
import { FieldPart } from './field-part.js';
import { DATA_KIND, isNonEmptyString, ValidationError } from 'azos/types';

export class DateRangeField extends FieldPart {
  static properties = {
    /** Aligns input value left, center, or right. Default: left. */
    alignValue: { type: String, reflect: false },

    /** Determines number of rows when textarea is rendered (default: 4 rows) */
    height: { type: Number, reflect: false },

    /** Defines resize attribute for textarea
     * (none | both | horizontal | vertical | block | inline) */
    resize: { type: String, reflect: false },

    /** Re-Defines required to allow values
    * (none | both | start | end) */
    isRequired: { type: String, reflect: true },
  }

  static styles = [baseStyles, textFieldStyles, dateRangeStyles];

  constructor() {
    super();
    // this.dataKind = DATA_KIND.DATE;
    this.dataKind = DATA_KIND.TEXT;
    // this.displayFormat = "MM/dd/yyyy";
    this.placeholder = "mm/dd/yyyy";
    this.isRequired = "both"; // or start, end, none
  }

  #tbStartDateChange(e) {
    const v = e.target.value;
    this.setValueFromInput({ ...this.value, start: v });
    this.inputChanged();
  }

  #tbEndDateChange(e) {
    const v = e.target.value;
    this.setValueFromInput({ ...this.value, end: v });
    this.inputChanged();
  }

  /** True if alignValue is a valid value */
  get isValidAlign() { return isOneOf(this.alignValue, ["left", "center", "right"]); }

  /** True if optionalProps is a valid value */
  get isValidRequired() { return isOneOf(this.isRequired, ["start", "end", "both", "none"]); }

  _validateRequired(context, val, scope) {
    if (!this.isRequired || this.isRequired === "none") return null;
    const rq = this.isRequired;
    if ((rq === "start" || rq === "both") && !val.start) return new ValidationError(this.effectiveSchema, this.effectiveName, scope, "Start date is required");
    if ((rq === "end" || rq === "both") && !val.end) return new ValidationError(this.effectiveSchema, this.effectiveName, scope, "End date is required");
    return null;
  }

  _validateDataKind(context, val, scope) {
    if (!val.start || !val.end) return null;
    const start = Date.parse(val.start);
    const end = Date.parse(val.end);
    if (isNaN(start) || isNaN(end)) return null;
    if (start > end) return new ValidationError(this.effectiveSchema, this.effectiveName, scope, "Start date must be less than end date");
    return null;
  }

  prepareInputValue(v) {
    if (v === null || v === undefined) return null;
    const parts = v.split("-");
    if (parts.length !== 2) return null;
    return { start: parts[0], end: parts[1] };
  }

  /** Override to convert a value into the one displayed in a text input */
  prepareValueForInput(v, isRawValue = false) {
    if (v === undefined || v === null) return "";

    const df = this.displayFormat;
    if (!df || isRawValue) return asString(v) ?? "";

    const result = format(df, { v }, this.arena.app.localizer) ?? "";
    return result;
  }

  focus() {
    const t = this.$("tbStartDate");
    if (!t) return;
    window.queueMicrotask(() => t.focus());
  }

  renderInput() {

    let val = this.value;
    if ((val === undefined || val === null) && this.error)
      val = this.prepareValueForInput(this.rawValue, true);
    else
      val = this.prepareValueForInput(val, false);

    ////console.info("Will render this value: " + val);
    const cls = [
      parseRank(this.rank, true),
      parseStatus(this.effectiveStatus, true, "Bg"),
      this.isValidAlign ? `text-${this.alignValue}` : '',
      this.isReadonly ? 'readonlyInput' : '',
    ].filter(isNonEmptyString).join(' ');

    return html`
      <div class="inputs">
        <input
          class="${cls}"
          id="tbStartDate"
          maxLength="${this.maxLength ? this.maxLength : noContent}"
          minLength="${this.minLength ? this.minLength : noContent}"
          placeholder="${this.placeholder}"
          type="${this.dataKind}"
          .value="${val.start ?? ""}"
          .disabled=${this.isDisabled}
          .required=${this.optionalProps !== "end" && this.isRequired}
          ?readonly=${this.isReadonly}
          @change="${this.#tbStartDateChange}"
          part="start-date"
          autocomplete="off"
        />
        <span class="dash">&mdash;</span>
        <input
          class="${cls}"
          id="tbEndDate"
          maxLength="${this.maxLength ? this.maxLength : noContent}"
          minLength="${this.minLength ? this.minLength : noContent}"
          placeholder="${this.placeholder}"
          type="${this.dataKind}"
          .value="${val.end ?? ""}"
          .disabled=${this.isDisabled}
          .required=${this.optionalProps !== "start" && this.isRequired}
          ?readonly=${this.isReadonly}
          @change="${this.#tbEndDateChange}"
          part="end-date"
          autocomplete="off"
        />
      </div>
    `;
  }
}

window.customElements.define("az-date-range", DateRangeField);
