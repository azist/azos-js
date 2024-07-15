import { isOneOf } from 'azos/strings';
import { html, parseRank, parseStatus } from '../ui.js';
import { baseStyles, textInputStyles } from './styles.js';
import { FieldPart } from './field-part.js';

export class TextField extends FieldPart{
  static properties={
    /** Determines if this field is a single-line input, password, or
     *  textarea (multi-line block input) */
    itemType:{type:String},

    /** If defined, minimum character length allowed for input
     *  (for validation use only) */
    minLength:{type:String},

    /** If defined, field will not allow input to exceed this character length */
    maxLength:{type:String},

    /** Ghosted text that will be replaced by user input */
    placeholder:{type:String},

    /** Determines number of rows when textarea is rendered (default: 4 rows) */
    height:{type:String}
  }

  static styles=[baseStyles, textInputStyles];

  constructor(){ super(); }

  /** True if text input is <textarea> */
  get isTextArea(){ return isOneOf(this.itemType, ["multiline", "long", "textarea"]); }

  /** True if text input is <input type="password"> */
  get isPassword(){ return isOneOf(this.itemType, ["password", "pass", "pw", "masked"]); }

  /** True if text input is <input type="text"> */
  get isInputText(){ return !this.isTextArea && !this.isPassword; }

  renderInput(){
    const clsRank     = `${parseRank(this.rank, true)}`;
    const clsStatusBg = `${parseStatus(this.status,true,"Bg")}`;

    let compArea = this.isTextArea ? html`<textarea id="${this.id}" class="${clsRank} ${clsStatusBg}" minLength="${this.minLength ? this.minLength : ''}" maxLength="${this.maxLength ? this.maxLength : ''}" placeholder="${this.placeholder}" rows="${this.height ? this.height : "4"}" value="${this.value}" .disabled=${this.isDisabled}></textarea>`
    : this.isPassword ? html`<input type="password" id="${this.id}" class="${clsRank} ${clsStatusBg}" minLength="${this.minLength ? this.minLength : ''}" maxLength="${this.maxLength ? this.maxLength : ''}" placeholder="${this.placeholder}" value="${this.value}" .disabled=${this.isDisabled}>`
    : this.isInputText ? html`<input type="text" id="${this.id}" class="${clsRank} ${clsStatusBg}" minLength="${this.minLength ? this.minLength : ''}" maxLength="${this.maxLength ? this.maxLength : ''}" placeholder="${this.placeholder}" value="${this.value}" .disabled=${this.isDisabled}>`
    : html`<p><em>Error rendering field</em></p>`;

    return compArea;
  }
}

window.customElements.define("az-text-input", TextField);
