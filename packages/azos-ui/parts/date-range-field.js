/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { asString, isEmpty } from 'azos/strings';
import { html, parseRank, parseStatus } from '../ui.js';
import { baseStyles, dateRangeStyles, textFieldStyles } from './styles.js';
import { FieldPart } from './field-part.js';
import { asDate, isNonEmptyString, isString, ValidationError } from 'azos/types';

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

  focus() {
    const t = this.$("tbStart");
    if (!t) return;
    window.queueMicrotask(() => t.focus());
  }

  castValue(v) {
    if (v === null || v === undefined || v === "") return null;
    let { start, end } = v;
    if (isEmpty(start)) start = undefined;
    if (isEmpty(end)) end = undefined;
    return { start: asDate(start, true), end: asDate(end, true) };
  }

  prepareValueForInput(v, isRawValue = false) {
    if (v === undefined || v === null) return "";
    if (isRawValue) return asString(v) ?? "";
    return this.arena.app.localizer.formatDateTime({ dt: asDate(v, true) });
  }


  #tbChange() {
    const tbStart = this.$("tbStart");
    const tbEnd = this.$("tbEnd");
    this.setValueFromInput({ start: tbStart.value, end: tbEnd.value });//this may cause validation error but will set this.rawValue
    this.inputChanged();
  }

  _doValidate(context, scope) {
    const { start: startVal, end: endVal } = this.value;
    if (this.$("tbStart").required && (startVal === null || startVal === undefined || (isString(startVal) && isEmpty(startVal)))) {
      return new ValidationError(this.effectiveSchema, this.effectiveName, scope, "Start date is required");
    }

    if (this.$("tbEnd").required && (endVal === null || endVal === undefined || (isString(endVal) && isEmpty(endVal)))) {
      return new ValidationError(this.effectiveSchema, this.effectiveName, scope, "End date is required");
    }

    const startDate = asDate(startVal, true);
    const endDate = asDate(endVal, true);
    if (startDate && endDate && startDate >= endDate) {
      return new ValidationError(this.effectiveSchema, this.effectiveName, scope, "Start date must be less than end date");
    }

  }


  renderInput(effectivelyDisabled) {
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
          id="tbStart"
          placeholder="${this.placeholder}"
          type="text"
          .value="${startValue}"
          ?disabled=${effectivelyDisabled}
          ?required=${!this.optionalStart}
          ?readonly=${this.isReadonly}
          @change="${this.#tbChange}"
          autocomplete="off"
        />
        <span class="dash">&mdash;</span>
        <input
          id="tbEnd"
          placeholder="${this.placeholder}"
          type="text"
          .value="${endValue}"
          ?disabled=${this.isDisabled}
          ?required=${!this.optionalEnd}
          ?readonly=${this.isReadonly}
          @change="${this.#tbChange}"
          autocomplete="off"
        />
      </div>
    `;
  }
}

window.customElements.define("az-date-range", DateRangeField);
