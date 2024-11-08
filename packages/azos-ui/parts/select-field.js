/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOneOf } from 'azos/strings';
import { css, html, parseRank, parseStatus } from '../ui.js';
import { FieldPart } from './field-part.js';
import { baseStyles, textFieldStyles } from './styles.js';

export class SelectField extends FieldPart {
  static properties = {
    /** Allowed width of input field as "%" when titlePosition = mid-left | mid-right.
     *  MUST BE BETWEEN 0 and 100 & less than (100 - titleWidth) - otherwise defaults to 40.
     */
    inputWidth: { type: Number },

    /** Determines if this field is a standard dropdown select or a multiple select */
    itemType: { type: String }
  }
  static styles = [baseStyles, textFieldStyles, css`:host { display: inline-block; }`];

  constructor() { super(); }

  /** True if options are displayed in a dropdown menu */
  get isDropdown() { return !this.isMultiple; }

  /** True if user can select multiple options */
  get isMultiple() { return isOneOf(this.itemType, ["multi", "multiple", "choices"]); }

  #selChange(e) {
    this.value = e.target.value;
    this.inputChanged();
  }

  renderInput() {
    const clsRank = `${parseRank(this.rank, true)}`;
    const clsStatusBg = `${parseStatus(this.status, true, "Bg")}`;

    const allOptions = [...this.getElementsByTagName("option")];
    const optionList = html`${allOptions.map((option) => html`
      <option
        value="${option.getAttribute('value')}"
        .selected=${this.value !== undefined && this.value === option.getAttribute('value')}>
          ${option.title}
      </option>
    `)}`;

    return html`
      <select
        class="${clsRank} ${clsStatusBg} ${this.isReadonly ? 'readonlyInput' : ''}"
        id="${this.id}"
        name="${this.id}"
        value="${this.value}"
        .disabled=${this.isDisabled}
        .multiple=${this.isMultiple}
        .required=${this.isRequired}
        ?readonly=${this.isReadonly}
        @change="${this.#selChange}">
        ${optionList}
      </select>
    `;
  }
}

window.customElements.define("az-select", SelectField);
