import { isOneOf } from 'azos/strings';
import { html, parseRank, parseStatus } from '../ui.js';
import { FieldPart } from './field-part.js';
import { baseStyles, textInputStyles } from './styles.js';

export class SelectField extends FieldPart{
  static properties={
    /** Determines if this field is a standard dropdown select or a multiple select */
    itemType: {type: String}
  }
  static styles=[baseStyles, textInputStyles];

  constructor(){ super(); }

  /** True if options are displayed in a dropdown menu */
  get isDropdown(){ return !this.isMultiple; }

  /** True if user can select multiple options */
  get isMultiple(){ return isOneOf(this.itemType, ["multi", "multiple", "choices"]); }

  renderInput(){
    const clsRank     = `${parseRank(this.rank, true)}`;
    const clsStatusBg = `${parseStatus(this.status,true,"Bg")}`;

    const allOptions = [...this.getElementsByTagName("az-select-option")];
    const optionList = html`${allOptions.map((option, i) => html`
      <option value="${option.getAttribute('value')}" .selected=${this.value!==undefined && this.value===option.getAttribute('value')}>${option.innerText}</option>
    `)}`;

    return html`
      <select class="${clsRank} ${clsStatusBg} ${this.isReadonly ? 'readonlyInput' : ''}" id="${this.id}" name="${this.id}" value="${this.value}" .disabled=${this.isDisabled} .multiple=${this.isMultiple} .required=${this.isRequired} ?readonly=${this.isReadonly}>
        ${optionList}
      </select>
    `;
  }
}

window.customElements.define("az-select", SelectField);
