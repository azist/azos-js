import {isOneOf} from 'azos/strings';
import { html, parseRank, parseStatus, parsePosition } from '../ui.js';
import { AzosPart } from './part.js';
import { baseStyles, textInputStyles } from './styles.js';

export class TextInput extends AzosPart{
  static properties={
    title:{title:String},
    itemType:{type:String},     //determines if this field is a single-line input, password, or textarea (multi-line block input)
    position:{type:String},
    minLength:{type:String},    //if defined, minimum character length allowed for input (for validation use only)
    maxLength:{type:String},    //if defined, will not allow input to exceed this length
    placeholder:{type:String},
    height:{type:String}        //height determines number of rows when textarea is rendered (default: 4 rows)
  }
  static styles=[baseStyles, textInputStyles];
  constructor(){ super(); }

  /* True if text input is <textarea> */
  get isTextArea(){ return isOneOf(this.itemType, ["multiline", "long", "textarea"]); }

  /* True if text input is <input type="password"> */
  get isPassword(){ return isOneOf(this.itemType, ["password", "pass", "pw", "masked"]); }

  /* True if text input is <input type="text"> */
  get isInputText(){ if(!this.isTextArea && !this.isPassword) return true; }

  render(){
    const clsRank     = `${parseRank(this.rank, true)}`;
    const clsStatus   = `${parseStatus(this.status, true)}`;
    const clsStatusBg = `${parseStatus(this.status,true,"Bg")}`;
    const clsDisable  = `${this.isDisabled ? "disabled" : ""}`;
    const clsPosition = `${this.position ? parsePosition(this.position,true) : "top_left"}`;

    let compArea='';
    this.isTextArea ? compArea = html`<textarea id="${this.id}" class="${clsRank} ${clsStatusBg}" minLength="${this.minLength ? this.minLength : ''}" maxLength="${this.maxLength ? this.maxLength : ''}" placeholder="${this.placeholder}" rows="${this.height ? this.height : "4"}" .disabled=${this.disabled}></textarea>`
    : this.isPassword ? compArea = html`<input type="password" id="${this.id}" class="${clsRank} ${clsStatusBg}" minLength="${this.minLength ? this.minLength : ''}" maxLength="${this.maxLength ? this.maxLength : ''}" placeholder="${this.placeholder}" .disabled=${this.disabled}>`
    : this.isInputText ? compArea = html`<input type="text" id="${this.id}" class="${clsRank} ${clsStatusBg}" minLength="${this.minLength ? this.minLength : ''}" maxLength="${this.maxLength ? this.maxLength : ''}" placeholder="${this.placeholder}" .disabled=${this.disabled}>`
    : compArea = html`<p><em>Error rendering field</em></p>`;

    return html`
      <div class="${clsRank} ${clsStatus} ${clsDisable}">
        <label class="${clsPosition}">
          <span>${this.title}</span>
          ${compArea}
        </label>
      </div>
    `;
  }
}

window.customElements.define("az-text-input", TextInput);
