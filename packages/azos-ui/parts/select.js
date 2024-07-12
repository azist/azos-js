import { html, css, parseRank, parseStatus, parsePosition } from '../ui.js';
import { AzosPart } from './part.js';
import { baseStyles, textInputStyles } from './styles.js';

export class Select extends AzosPart{
  static properties={
    title:{title:String},
    value:{title:String},
    position:{type:String},
    labelMargin:{type:Number}   //The amount of horizontal space taken by title in "ch" units. Only applicable when position is mid-left or mid-right
  }
  static styles=[baseStyles, textInputStyles];
  constructor(){ super(); }

  render(){
    const clsRank     = `${parseRank(this.rank, true)}`;
    const clsStatus   = `${parseStatus(this.status, true)}`;
    const clsStatusBg = `${parseStatus(this.status,true,"Bg")}`;
    const clsDisable  = `${this.isDisabled ? "disabled" : ""}`;
    const clsPosition = `${this.position ? parsePosition(this.position,true) : "top-left"}`;

    let labelM='';
    if(this.labelMargin && (clsPosition==="mid-right" || clsPosition==="mid-left")){
      clsPosition==="mid-right" ? labelM=css`margin-left:${this.labelMargin}ch;` : labelM=css`margin-right:${this.labelMargin}ch;`;
    }
    console.log(this.value);
    const allOptions = [...this.getElementsByTagName("az-select-option")];
    const optionList = html`${allOptions.map((option) => html`
      <option value="${option.getAttribute('value')}" .selected=${this.value!==undefined && this.value===option.getAttribute('value')}>${option.innerText}</option>
    `)}`;

    return html`
      <div class="${clsRank} ${clsStatus} ${clsDisable}">
        <label class="${clsPosition}">
          <span style="${labelM}">${this.title}</span>
          <select class="${clsRank} ${clsStatusBg}" id="${this.id}" name="${this.id}" value="${this.value}" .disabled=${this.isDisabled}>
            ${optionList}
          </select>
        </label>
      </div>
    `;
  }
}

window.customElements.define("az-select", Select);
