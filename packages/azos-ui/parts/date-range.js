/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { asString, isOneOf } from 'azos/strings';
import { html, parseRank, parseStatus } from '../ui.js';
import { baseStyles, dateRangeStyles, textFieldStyles } from './styles.js';
import { FieldPart } from './field-part.js';
import { asDate, asObject, isNonEmptyString, isObject, VALIDATE_METHOD, ValidationError } from 'azos/types';
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
  #fieldErrors = null;

  get rawValue() { return this.#rawValue; }
  get value() { return this.#value; }

  /**
   * Sets field data values which will each be type-cast in accordance with the specified {@link dataType}.
   * If the cast fails the exception gets thrown, this behavior differs from  {@link setValueFromInput}
   * which will capture cast exception as a field error
   * @param {Object} v object with start and end date values
   */
  set value(v) {
    this.#rawValue = v;
    this.#value = undefined;
    this.requestUpdate();
    if (!isObject(v)) v = asObject(v);
    this.#value = {
      start: this.castValue(v?.start),
      end: this.castValue(v?.end)
    };
  }

  get isRequired() { return !this.optionalStart || !this.optionalEnd; }

  #dateChanged(e, field) {
    isTrue(isOneOf(field, ["start", "end"]));
    const fv = e.target.value;
    this.setFieldValueFromInput(fv, field);
    this.inputChanged();
  }

  setValueFromInput(v) {
    this.setFieldValueFromInput(v?.start, "start");
    this.setFieldValueFromInput(v?.end, "end");
  }

  setFieldValueFromInput(v, field) {
    this.#rawValue ??= {};
    this.#value ??= {};
    this.#fieldErrors ??= {};

    this.error = null;
    this.requestUpdate();

    this.#rawValue[field] = v;
    this.#value[field] = undefined;
    this.#fieldErrors[field] = undefined;

    try {
      this.#value[field] = this.castValue(v);
    } catch (e) {
      this.#fieldErrors[field] = e;
    } finally {
      if (this.#fieldErrors["start"] || this.#fieldErrors["end"])
        this.error = this.#fieldErrors["start"] || this.#fieldErrors["end"];
    }
    if (!this.error) this.error = this.noAutoValidate ? null : this[VALIDATE_METHOD](null);
  }

  castValue(v) {
    if (v === null || v === undefined || v === "") return null;
    return asDate(v, true, true);
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
          class="${this.#fieldErrors?.["start"] ? "error" : ""}"
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
          class="${this.#fieldErrors?.["end"] ? "error" : ""}"
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
