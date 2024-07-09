import {isOneOf} from 'azos/strings';
import { html, parseRank, parseStatus } from '../ui.js';
import { AzosPart } from './part.js';
import { baseStyles, checkStyles, switchStyles } from './styles.js';

export class Checkbox extends AzosPart{
  static properties={
    checked:{},
    title:{type: String},
    itemType:{type:String}
  };
  static styles=[baseStyles,checkStyles,switchStyles];
  constructor(){
    super();
    this.checked=false;
  }

  /** True if the radio group has radio buttons instead of switches */
  get isCheck() { return !this.isSwitch;}

  /** True if the radio group has switches instead of radio buttons */
  get isSwitch(){  return isOneOf(this.itemType, ["switch", "sw"]);}

  renderPart(){
    const clsRank=`${parseRank(this.rank, true)}`;
    const clsStatus=`${parseStatus(this.status, true)}`;
    const clsStatusBg=`${parseStatus(this.status,true,"Bg")}`;
    const clsDisable = `${this.isDisabled ? "disabled" : ""}`;
    return html`
      <div class="${clsRank} ${clsStatus} ${clsDisable}">
        <label for="${this.id}">
          <input type="checkbox" class="${this.isCheck ? "check" : "switch"} ${clsRank} ${clsStatusBg}" id="${this.id}" name="${this.id}" .disabled=${this.isDisabled}>
          <span>${this.title}</span>
        </label>
      </div>
    `;
  }
}

window.customElements.define("az-checkbox", Checkbox);
