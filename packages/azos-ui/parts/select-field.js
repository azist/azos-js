/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOneOf } from '../../azos/strings';
import { html, parseRank, parseStatus } from '../ui.js';
import { FieldPart } from './field-part.js';
import { baseStyles, textFieldStyles } from './styles.js';
import * as aver from '../../azos/aver';

export class SelectField extends FieldPart {
  static properties = {
    /** Allowed width of input field as "%" when titlePosition = mid-left | mid-right.
     *  MUST BE BETWEEN 0 and 100 & less than (100 - titleWidth) - otherwise defaults to 40.
     */
    inputWidth: { type: Number },

    /** Determines if this field is a standard dropdown select or a multiple select */
    itemType: { type: String }
  }
  static styles = [baseStyles, textFieldStyles];

  constructor() { super(); }

  /** True if options are displayed in a dropdown menu */
  get isDropdown() { return !this.isMultiple; }

  /** True if user can select multiple options */
  get isMultiple() { return isOneOf(this.itemType, ["multi", "multiple", "choices"]); }

  /** options to be rendered for the select */
  #options = [];
  get options() { return this.#options; }
  set options(opts) {
    // Ensure options is an array
    aver.isArray(opts);
    // Validate each option object
    opts.forEach(opt => {
      aver.isObject(opt, "SelectField opts obj");
      aver.isStringOrNull(opt.value, "SelectField opt value str|null");
      aver.isStringOrNull(opt.title, "SelectField opt title str|null");
    });
    // Set the options
    this.#options = opts;
    this.requestUpdate();
  }

  /** Handle change events for the select element */
  #selChange(e) {
    this.value = e.target.value;
    this.inputChanged();
  }

  renderInput(effectivelyDisabled, effectivelyBrowse) {
    const clsRank = `${parseRank(this.rank, true)}`;
    const clsStatusBg = `${parseStatus(this.status, true, "Bg")}`;
    const isSelected = (o) => this.value !== undefined && this.value === o.value;

    const allOptions = this.#options.length > 0
      ? this.#options.map(option => ({ ...option, selected: isSelected(option) }))
      : [...this.getElementsByTagName("option")].map(option => {
          return { value: option.getAttribute('value'), title: option.title,  selected: isSelected( option.getAttribute('value')) };
        });

    const optionList = html`${allOptions.map((option) => html`
      <option value="${option.value}" .selected=${option.selected}>${option.title}</option>
    `)}`;

    const rdOnly = this.isReadonly || effectivelyBrowse;

    //HTML SELECT inputs do not support read-only attribute by design
    //that is why we need to emulate it with showing a red-only text input
    if (rdOnly){
      const valTitle = (allOptions.filter(one => one.value === this.value)?.[0]?.title) ?? "";
      return html`
<input
  class="${clsRank} ${clsStatusBg} ${this.isValidAlign ? `text-${this.alignValue}` : ''} readonlyInput"
  id="tbData"
  placeholder="${this.placeholder}"
  .value="${valTitle}"
  .disabled=${effectivelyDisabled}
  .required=${this.isRequired}
  ?readonly=${true}
  @click="${this.onClick}"
  part="field"
  autocomplete="off"
/>`;
    }

    return html`
<select
  class="${clsRank} ${clsStatusBg} ${rdOnly ? 'readonlyInput' : ''}"
  id="${this.id}"
  name="${this.id}"
  value="${this.value}"
  .disabled=${effectivelyDisabled}
  .multiple=${this.isMultiple}
  .required=${this.isRequired}
  ?readonly=${rdOnly}
  @change="${this.#selChange}">
  ${optionList}
</select>`;
  }
}

window.customElements.define("az-select", SelectField);
