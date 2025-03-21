/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { asString, isOneOf } from 'azos/strings';
import { html, parseRank, parseStatus } from '../ui.js';
import { baseStyles, dateRangeStyles, textFieldStyles } from './styles.js';
import { FieldPart } from './field-part.js';
import { asDate, isNonEmptyString, VALIDATE_METHOD, ValidationError } from 'azos/types';
import { isTrue } from 'azos/aver';

export class DateRangeField extends FieldPart {
  static properties = {
    optionalStart: { type: Boolean, reflect: true },
    optionalEnd: { type: Boolean, reflect: true },
  }

  static styles = [baseStyles, textFieldStyles, dateRangeStyles];

  constructor() {
    super();
    this.placeholder = "mm/dd/yyyy";
    this.optionalStart = false;
    this.optionalEnd = false;
  }

  #rawValue = null;
  #value = null;

  get rawValue() { return this.#rawValue; }
  get value() { return this.#value; }

  get isRequired() {
    return !this.optionalStart && !this.optionalEnd;
  }

  #dateChanged(e, field) {
    isTrue(isOneOf(field, ["start", "end"]));
    const v = e.target.value;
    this.setValueFromInput(v, field);
    this.inputChanged();
  }

  setValueFromInput(v, field) {
    this.#rawValue ??= {};
    this.#value ??= {};

    this.#rawValue[field] = v;
    this.#value[field] = undefined;

    try {
      v = this.prepareInputValue(v);
      this.#value[field] = v;
      this.error = this.noAutoValidate ? null : this[VALIDATE_METHOD](null);
    } catch (e) {
      this.error = e;
    } finally {
      this.requestUpdate();
    }
  }

  prepareInputValue(v) {
    if (v === null || v === undefined) return null;
    return asDate(v, true);
  }

  _validateRequired(context, val, scope) {
    if (this.optionalStart && this.optionalEnd) return null;
    if (!this.optionalStart && !val.start) return new ValidationError(this.effectiveSchema, this.effectiveName, scope, "Start date is required");
    if (!this.optionalEnd && !val.end) return new ValidationError(this.effectiveSchema, this.effectiveName, scope, "End date is required");
    return null;
  }

  _validateDataKind(context, val, scope) {
    if (!val.start && !val.end) return null;
    const start = asDate(val.start, true);
    const end = asDate(val.end, true);
    if (isNaN(start) || isNaN(end)) return null;
    if (start >= end) return new ValidationError(this.effectiveSchema, this.effectiveName, scope, "Start date must be less than end date");
    return null;
  }

  focus() {
    const t = this.$("tbStartDate");
    if (!t) return;
    window.queueMicrotask(() => t.focus());
  }

  prepareValueForInput(v, isRawValue = false) {
    if (v === undefined || v === null) return "";
    if (isRawValue) return asString(v) ?? "";
    return this.arena.app.localizer.formatDateTime({ dt: asDate(v, true) });
  }

  renderInput() {
    const cls = [
      parseRank(this.rank, true),
      parseStatus(this.effectiveStatus, true, "Bg"),
      this.isReadonly ? 'readonlyInput' : '',
    ].filter(isNonEmptyString).join(' ');

    let startValue = this.value?.start;
    if ((startValue === undefined || startValue === null) && this.error)
      startValue = this.prepareValueForInput(this.rawValue?.start, true);
    else
      startValue = this.prepareValueForInput(startValue, false);

    let endValue = this.value?.end;
    if ((endValue === undefined || endValue === null) && this.error)
      endValue = this.prepareValueForInput(this.rawValue?.end, true);
    else
      endValue = this.prepareValueForInput(endValue, false);

    return html`
      <div class="inputs ${cls}">
        <input
          id="tbStartDate"
          placeholder="${this.placeholder}"
          type="text"
          .value="${startValue}"
          .disabled=${this.isDisabled}
          .required=${!this.optionalStart}
          ?readonly=${this.isReadonly}
          @change="${e => this.#dateChanged(e, "start")}"
          part="start-date"
          autocomplete="off"
        />
        <span class="dash">&mdash;</span>
        <input
          id="tbEndDate"
          placeholder="${this.placeholder}"
          type="text"
          .value="${endValue}"
          .disabled=${this.isDisabled}
          .required=${!this.optionalEnd}
          ?readonly=${this.isReadonly}
          @change="${e => this.#dateChanged(e, "end")}"
          part="end-date"
          autocomplete="off"
        />
      </div>
    `;
  }
}

window.customElements.define("az-date-range", DateRangeField);
