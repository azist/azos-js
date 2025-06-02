/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { dflt, isEmpty } from 'azos/strings';
import { asDate, isNonEmptyString, isString, ValidationError } from 'azos/types';
import { DATE_FORMAT, TIME_DETAILS } from 'azos/localization';
import { getEffectiveTimeZone, html, parseRank, parseStatus } from '../ui.js';
import { baseStyles, dateRangeStyles, textFieldStyles } from './styles.js';
import { FieldPart } from './field-part.js';

export class DateRangeField extends FieldPart {
  static properties = {
    optionalStart: { type: Boolean, reflect: true },
    optionalEnd: { type: Boolean, reflect: true },
    formatDate: { type: String },
    formatTime: { type: String },
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

    let start, end;
    if (isString(v)) {
      try {
        ({ start, end } = JSON.parse(v));
      } catch (e) {
        // If the value is a string (and not JSON), we assume it is a date range separated by commas, semicolons, or colons.
        [start, end] = v.split(/[,;:]/).map(p => p.trim());
      }
    } else {
      ({ start, end } = v);
    }

    const result = {
      start: asDate(start, true), // true to allow empty string
      end: asDate(end, true),
    };
    return result;
  }

  /**
   * @param {{ start: String, end: String }} v the value to prepare for use in this DateRangeField.value prop.
   * @returns {{ start: Date | null, end: Date | null }} an object with start and end dates, or null if the input is empty.
   */
  prepareInputValue(v) {
    if (v === null || v === undefined) return null;
    let { start, end } = v;

    const session = this.arena.applet.session;
    const tz = getEffectiveTimeZone(this);

    const result = {
      start: this.arena.app.localizer.treatUserDateInput(start, tz, session)?.dt ?? undefined, //#278
      end: this.arena.app.localizer.treatUserDateInput(end, tz, session)?.dt ?? undefined, //#278
    };
    return result;
  }

  /**
   * Prepare for use in an input element.
   * @param {String} v a single string value to format for input (either start or end)
   * @param {Boolean} isRawValue true if provided `v` is from rawValue, false if from value
   * @returns a string value formatted for input
   */
  prepareValueForInput(v, isRawValue = false) {
    let start, end;
    if (v === undefined || v === null || v === "") start = end = null;
    else if (isRawValue && isString(v)) {
      [start, end] = v.split(/[,;:]/).map(p => p.trim());
    } else {
      ({ start, end } = v);
    }

    const timeZone = getEffectiveTimeZone(this);
    const dtFormat = dflt(this.formatDate, DATE_FORMAT.NUM_DATE);
    const tmDetails = dflt(this.formatTime, TIME_DETAILS.NONE);

    const result = {
      start: !start ? "" : this.arena.app.localizer.formatDateTime({ dt: start, timeZone, dtFormat, tmDetails }),
      end: !end ? "" : this.arena.app.localizer.formatDateTime({ dt: end, timeZone, dtFormat, tmDetails })
    };
    return result;
  }


  #tbChange() {
    const tbStart = this.$("tbStart");
    const tbEnd = this.$("tbEnd");
    this.setValueFromInput({ start: tbStart.value, end: tbEnd.value });//this may cause validation error but will set this.rawValue
    this.inputChanged();
  }

  _doValidate(context, scope) {
    const { start: startVal, end: endVal } = this.value;
    if (this.$("tbStart").required && isEmpty(startVal)) {
      return new ValidationError(this.effectiveSchema, this.effectiveName, scope, "Start date is required");
    }

    if (this.$("tbEnd").required && isEmpty(endVal)) {
      return new ValidationError(this.effectiveSchema, this.effectiveName, scope, "End date is required");
    }

    const startDate = asDate(startVal, true);
    const endDate = asDate(endVal, true);
    if (startDate && endDate && startDate >= endDate) {
      return new ValidationError(this.effectiveSchema, this.effectiveName, scope, "Start date must be less than end date");
    }

  }


  renderInput(effectivelyDisabled, effectivelyBrowse) {
    const cls = [
      parseRank(this.rank, true),
      parseStatus(this.effectiveStatus, true, "Bg"),
      this.isReadonly ? 'readonlyInput' : '',
    ].filter(isNonEmptyString).join(' ');

    let value = this.value;
    if ((value === undefined || value === null) && this.error)
      value = this.prepareValueForInput(this.rawValue, true);
    else
      value = this.prepareValueForInput(value, false);

    const { start, end } = value;

    return html`
      <div class="inputs ${cls}">
        <input
          id="tbStart"
          placeholder="${this.placeholder}"
          type="text"
          .value="${start}"
          ?disabled=${effectivelyDisabled}
          ?required=${!this.optionalStart}
          ?readonly=${this.isReadonly || effectivelyBrowse}
          @change="${this.#tbChange}"
          autocomplete="off"
        />
        <span class="dash">&mdash;</span>
        <input
          id="tbEnd"
          placeholder="${this.placeholder}"
          type="text"
          .value="${end}"
          ?disabled=${this.isDisabled}
          ?required=${!this.optionalEnd}
          ?readonly=${this.isReadonly || effectivelyBrowse}
          @change="${this.#tbChange}"
          autocomplete="off"
        />
      </div>
    `;
  }
}

window.customElements.define("az-date-range", DateRangeField);
