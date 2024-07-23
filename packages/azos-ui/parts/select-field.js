import { isOneOf } from 'azos/strings';
import { html, parseRank, parseStatus, POSITION } from '../ui.js';
import { FieldPart } from './field-part.js';
import { baseStyles, textFieldStyles } from './styles.js';

export class SelectField extends FieldPart{
  static properties={
    /** Allowed width of input field as "%" when titlePosition = mid-left | mid-right.
     *  MUST BE BETWEEN 0 and 100 & less than (100 - titleWidth) - otherwise defaults to 40.
     */
    inputWidth: {type: Number},

    /** Determines if this field is a standard dropdown select or a multiple select */
    itemType: {type: String}
  }
  static styles=[baseStyles, textFieldStyles];

  constructor(){ super(); }

  /** True if options are displayed in a dropdown menu */
  get isDropdown(){ return !this.isMultiple; }

  /** True if user can select multiple options */
  get isMultiple(){ return isOneOf(this.itemType, ["multi", "multiple", "choices"]); }

  renderInput(){
    /** Set the slider's width based on the titleWidth property */
    let stlInputWidth = '';
    if(this.titlePosition === POSITION.MIDDLE_LEFT || this.titlePosition === POSITION.MIDDLE_RIGHT){
      if(this.inputWidth !== undefined){
        if(0 <= this.inputWidth <= 100){
          stlInputWidth = (this.inputWidth < (100 - this.titleWidth)) ? css`width: ${this.inputWidth}%;` : css`width: ${(100 - this.titleWidth)}%;`;
        }else{
          stlInputWidth = (this.titleWidth !== undefined) ? css`width: ${(100 - this.titleWidth)}%;` : css`width: 40%;`;
        }
      }else{
        stlInputWidth = (this.titleWidth !== undefined) ? css`width: ${(100 - this.titleWidth)}%;` : css`width: 40%;`;
      }
    }

    const clsRank     = `${parseRank(this.rank, true)}`;
    const clsStatusBg = `${parseStatus(this.status,true,"Bg")}`;

    const allOptions = [...this.getElementsByTagName("az-select-option")];
    const optionList = html`${allOptions.map((option) => html`
      <option value="${option.getAttribute('value')}" .selected=${this.value!==undefined && this.value===option.getAttribute('value')}>${option.innerText}</option>
    `)}`;

    return html`
      <select class="${clsRank} ${clsStatusBg} ${this.isReadonly ? 'readonlyInput' : ''}" style="${stlInputWidth}" id="${this.id}" name="${this.id}" value="${this.value}" .disabled=${this.isDisabled} .multiple=${this.isMultiple} .required=${this.isRequired} ?readonly=${this.isReadonly}>
        ${optionList}
      </select>
    `;
  }
}

window.customElements.define("az-select", SelectField);
