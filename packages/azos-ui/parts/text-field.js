import { isOneOf } from 'azos/strings';
import { html, parseRank, parseStatus, noContent } from '../ui.js';
import { baseStyles, textFieldStyles } from './styles.js';
import { FieldPart } from './field-part.js';

export class TextField extends FieldPart{
  static properties={
    /** Aligns input value left, center, or right. Default: left. */
    alignValue: {type: String},

    /** Determines number of rows when textarea is rendered (default: 4 rows) */
    height: {type: Number},

    /** Determines if this field is a single-line input, password, or
     *  textarea (multi-line block input) */
    itemType: {type:String},

    /** If defined, field will not allow input to exceed this character length */
    maxLength: {type: Number},

    /** If defined, minimum character length allowed for input
     *  (for validation use only) */
    minLength: {type: Number},

    /** Ghosted text that will be replaced by user input */
    placeholder: {type: String}
  }

  static styles=[baseStyles, textFieldStyles];

  constructor(){ super(); }

  /** True if text input is <textarea> */
  get isTextArea(){ return isOneOf(this.itemType, ["multiline", "long", "textarea"]); }

  /** True if text input is <input type="password"> */
  get isPassword(){ return isOneOf(this.itemType, ["password", "pass", "pw", "masked"]); }

  /** True if text input is <input type="text"> */
  get isInputText(){ return !this.isTextArea && !this.isPassword; }

  /** True if alignValue is a valid value */
  get isValidAlign(){ return isOneOf(this.alignValue, ["left", "center", "right"]); }


  ///// castValue(v){ return `xyz: ${v}`; }

  #tbChange(e){
    this.value = e.target.value;
    this.inputChanged();
  }

  renderInput(){
    const clsRank     = `${parseRank(this.rank, true)}`;
    const clsStatusBg = `${parseStatus(this.status,true,"Bg")}`;

    let compArea = this.isTextArea ? html`
      <textarea
        class="${clsRank} ${clsStatusBg} ${this.isValidAlign ? `text-${this.alignValue}` : ''} ${this.isReadonly ? 'readonlyInput' : ''}"
        id="${this.id}"
        maxLength="${this.maxLength ? this.maxLength : noContent}"
        minLength="${this.minLength ? this.minLength : noContent}"
        placeholder="${this.placeholder}"
        rows="${this.height ? this.height : "4"}"
        .value="${this.value ?? ""}"
        .disabled=${this.isDisabled}
        .required=${this.isRequired}
        ?readonly=${this.isReadonly}
        @change="${this.#tbChange}"
        ></textarea>`
    : html`
      <input
        class="${clsRank} ${clsStatusBg} ${this.isValidAlign ? `text-${this.alignValue}` : ''} ${this.isReadonly ? 'readonlyInput' : ''}"
        id="${this.id}"
        maxLength="${this.maxChar ? this.maxChar : noContent}"
        minLength="${this.minChar ? this.minChar : noContent}"
        placeholder="${this.placeholder}"
        type="${this.isInputText ? "text" : "password"}"
        .value="${this.value ?? ""}"
        .disabled=${this.isDisabled}
        .required=${this.isRequired}
        ?readonly=${this.isReadonly}
        @change="${this.#tbChange}" />
      `;

    return compArea;
  }
}

window.customElements.define("az-text", TextField);
