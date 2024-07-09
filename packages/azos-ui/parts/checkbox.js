import {isOneOf} from 'azos/strings';
import { html, parseRank, parseStatus, parsePosition } from '../ui.js';
import { AzosPart } from './part.js';
import { baseStyles, checkStyles, switchStyles } from './styles.js';

export class Checkbox extends AzosPart{
  static properties={
    checked:{},
    title:{type: String},
    itemType:{type:String},
    position:{type:String}
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
    const clsPosition = `${this.position ? parsePosition(this.position,true) : "middle_right"}`;
    return html`
      <div class="${clsRank} ${clsStatus} ${clsDisable}">
        <label class="${clsPosition}" for="${this.id}">
          <span>${this.title}</span>
          <input type="checkbox" class="${this.isCheck ? "check" : "switch"} ${clsRank} ${clsStatusBg}" id="${this.id}" name="${this.id}" .disabled=${this.isDisabled}>
        </label>
      </div>
    `;
  }
}

window.customElements.define("az-checkbox", Checkbox);
