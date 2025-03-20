/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOneOf, asString, format } from 'azos/strings';
import { html, parseRank, parseStatus, noContent } from '../ui.js';
import { baseStyles, dateRangeStyles, textFieldStyles } from './styles.js';
import { FieldPart } from './field-part.js';
import { isNonEmptyString, ValidationError } from 'azos/types';

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
    requiredFields: { type: String, reflect: true },
  }

  static styles = [baseStyles, textFieldStyles, dateRangeStyles];

  constructor() {
    super();
    // this.dataKind = DATA_KIND.DATE;
    // this.dataKind = DATA_KIND.TEXT;
    this.displayFormat = `<<date::ld>>`;
    this.placeholder = "mm/dd/yyyy";
    this.requiredFields = "both"; // or start, end, none
  }

  get isRequired() {
    return this.requiredFields === "start" || this.requiredFields === "end" || this.requiredFields === "both";
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
  get isValidRequired() { return isOneOf(this.requiredFields, ["start", "end", "both", "none"]); }

  _validateRequired(context, val, scope) {
    if (!this.requiredFields || this.requiredFields === "none") return null;
    const rf = this.requiredFields;
    if ((rf === "start" || rf === "both") && !val.start) return new ValidationError(this.effectiveSchema, this.effectiveName, scope, "Start date is required");
    if ((rf === "end" || rf === "both") && !val.end) return new ValidationError(this.effectiveSchema, this.effectiveName, scope, "End date is required");
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

  /** Override to convert a value into the one displayed in a text input */
  prepareValueForInput(v, isRawValue = false) {
    if (v === undefined || v === null) return "";

    if (isRawValue) return asString(v) ?? "";

    return format(this.displayFormat, { date: v }, this.arena.app.localizer) ?? "";
  }

  focus() {
    const t = this.$("tbStartDate");
    if (!t) return;
    window.queueMicrotask(() => t.focus());
  }

  renderInput() {

    let startValue = this.value?.start;
    let endValue = this.value?.end;

    if (!startValue && this.error)
      startValue = this.prepareValueForInput(this.rawValue.start, true);
    else
      startValue = this.prepareValueForInput(startValue, false);

    if (!endValue && this.error)
      endValue = this.prepareValueForInput(this.rawValue.end, true);
    else
      endValue = this.prepareValueForInput(endValue, false);

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
          type="text"
          .value="${startValue ?? ""}"
          .disabled=${this.isDisabled}
          .required=${this.requiredFields !== "start" || this.requiredFields === "both"}
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
          type="text"
          .value="${endValue ?? ""}"
          .disabled=${this.isDisabled}
          .required=${this.requiredFields === "end" || this.requiredFields === "both"}
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
