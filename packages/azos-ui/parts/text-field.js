import { isOneOf } from 'azos/strings';
import { html, css, parseRank, parseStatus, noContent, POSITION } from '../ui.js';
import { baseStyles, textInputStyles } from './styles.js';
import { FieldPart } from './field-part.js';

export class TextField extends FieldPart{
  static properties={
    /** Determines number of rows when textarea is rendered (default: 4 rows) */
    height: {type: Number},

    /** Determines if this field is a single-line input, password, or
     *  textarea (multi-line block input) */
    itemType: {type:String},

    /** If defined, field will not allow input to exceed this character length */
    maxChar: {type: Number},

    /** If defined, minimum character length allowed for input
     *  (for validation use only) */
    minChar: {type: Number},

    /** Ghosted text that will be replaced by user input */
    placeholder: {type: String}
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

    /** Calculate the input field's width based on the titleWidth property */
    let stlInputWidth = '';
    if(this.titlePosition === POSITION.MIDDLE_LEFT || this.titlePosition === POSITION.MIDDLE_RIGHT){
      stlInputWidth = (this.titleWidth !== undefined) ? css`width: ${(80 - this.titleWidth)}%;` : css`width: 40%;`;
    }

    let compArea = this.isTextArea ? html`
      <textarea
        class="${clsRank} ${clsStatusBg} ${this.isReadonly ? 'readonlyInput' : ''}"
        id="${this.id}"
        maxLength="${this.maxChar ? this.maxChar : noContent}"
        minLength="${this.minChar ? this.minChar : noContent}"
        placeholder="${this.placeholder}"
        rows="${this.height ? this.height : "4"}"
        value="${this.value}"
        style="${stlInputWidth}"
        .disabled=${this.isDisabled}
        .required=${this.isRequired}
        ?readonly=${this.isReadonly}></textarea>`
    : html`
      <input
        class="${clsRank} ${clsStatusBg} ${this.isReadonly ? 'readonlyInput' : ''}"
        id="${this.id}"
        maxLength="${this.maxChar ? this.maxChar : noContent}"
        minLength="${this.minChar ? this.minChar : noContent}"
        placeholder="${this.placeholder}"
        type="${this.isInputText ? "text" : "password"}"
        value="${this.value}"
        style="${stlInputWidth}"
        .disabled=${this.isDisabled}
        .required=${this.isRequired}
        ?readonly=${this.isReadonly}>
      `;

    return compArea;
  }
}

window.customElements.define("az-text-input", TextField);
