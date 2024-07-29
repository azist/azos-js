import { isOneOf } from 'azos/strings';
import { html, css, parseRank, parseStatus, POSITION, parsePosition } from '../ui.js';
import { baseStyles, radioStyles, switchStyles } from './styles.js';
import { FieldPart } from './field-part.js';

/* Can this work with the FieldPart? */

export class RadioGroupField extends FieldPart{

  static properties = {
    /** Determines if this group contains radio buttons or switches */
    itemType:      {type: String},
  };

  static styles = [baseStyles, radioStyles, switchStyles];

  constructor(){ super(); }

  /** True if the radio group has radio buttons instead of switches */
  get isRadio() { return !this.isSwitch;}

  /** True if the radio group has switches instead of radio buttons */
  get isSwitch(){  return isOneOf(this.itemType, ["switch", "sw"]);}

  /** Checkboxes and switches have pre-defined content layout */
   get isPredefinedContentLayout(){ return true; }


  renderPart(){
    const clsRank =   `${parseRank(this.rank, true)}`;
    const clsStatus = `${parseStatus(this.status, true)}`;
    const clsStatusBg = `${parseStatus(this.status, true, "Bg")}`;
    const clsDisable = `${this.isDisabled ? "disabled" : ""}`;
    const clsPosition = `${this.titlePosition ? parsePosition(this.titlePosition,true) : "mid-left"}`;

    /** Set the width of the input field label */
    let stlTitleWidth = '';
    if(clsPosition === 'mid-left' || this.titlePosition === POSITION.MIDDLE_LEFT || this.titlePosition === POSITION.MIDDLE_RIGHT){
      (this.titleWidth !== undefined)
        ? (0 <= this.titleWidth <= 100)
          ? stlTitleWidth = css`width: ${this.titleWidth}%;`
          : stlTitleWidth = css`width: 80%;`
        : stlTitleWidth = css`width: 80%;`;
    }

    const allOptions = [...this.getElementsByTagName("az-radio-option")];
    const optionList = html`${allOptions.map((option, i) => html`
      <div>
        <label class="${clsPosition}" for="${this.id}_${i}">
          <span style="${stlTitleWidth}">${option.innerText}</span>
          <input type="radio" class="${this.isRadio ? "radio" : "switch"} ${clsRank} ${clsStatusBg}" id="${this.id}_${i}" name="${this.id}" .disabled=${this.isDisabled} .required=${this.isRequired} ?readonly=${this.isReadonly}>
        </label>
      </div>
    `)}`;

    return html`
      <div class="${clsRank} ${clsStatus} ${clsDisable} field">
        <p class="radioPrompt ${this.isRequired ? 'requiredTitle' : ''}">${this.title}</p>
        ${optionList}
      </div>
    `;
  }
}

window.customElements.define("az-radio-group", RadioGroupField);
