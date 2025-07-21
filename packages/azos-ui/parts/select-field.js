/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, parseRank, parseStatus } from '../ui.js';
import { FieldPart } from './field-part.js';
import { baseStyles, textFieldStyles } from './styles.js';
import * as aver from '../../azos/aver';
import { isObject } from 'azos/types';

export class SelectField extends FieldPart {
  static properties = {
    /** Allowed width of input field as "%" when titlePosition = mid-left | mid-right.
     *  MUST BE BETWEEN 0 and 100 & less than (100 - titleWidth) - otherwise defaults to 40.
     */
    inputWidth: { type: Number },
  }
  static styles = [baseStyles, textFieldStyles];

  /** Handle change events for the select element */
  #selChange(e) {
    this.value = e.target.value;
    this.inputChanged();
  }

  // utility function to extract the options from the select element
  #optionsFromElements() {
    return [...this.getElementsByTagName("option")].map(option => ({
      value: option.getAttribute('value'), title: option.title
    }));
  }

  // utility function to extract the options from the valueList object
  #optionsFromValueList(){
    return Object.entries(this.valueList).map(([k, v]) => ({ value: k, title: v}));
  }

  // utility function to convert an option object to an option element
  #optionToEl(option) {
    return html`<option
      value="${option.value}"
      title="${option.title}"
      .selected=${option.selected}>
      ${option.title}
    </option>`;
  }

  renderInput(effectivelyDisabled, effectivelyBrowse) {
    const clsRank = `${parseRank(this.rank, true)}`;
    const clsStatusBg = `${parseStatus(this.status, true, "Bg")}`;
    const isSelected = (o) => this.value !== undefined && this.value === o.value;

    const allOptions = isObject(this.valueList)
      ? this.#optionsFromValueList().map(option => ({ ...option, selected: isSelected(option) }))
      : this.#optionsFromElements().map(option => ({ ...option, selected: isSelected(option) }));

    const optionList = html`${allOptions.map((option) => this.#optionToEl(option))}`;

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
  .required=${this.isRequired}
  ?readonly=${rdOnly}
  @change="${this.#selChange}">
  ${optionList}
</select>`;
  }
}

window.customElements.define("az-select", SelectField);
