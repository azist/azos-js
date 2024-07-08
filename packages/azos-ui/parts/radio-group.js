import { isOneOf } from 'azos/strings';
import { html, parseRank, parseStatus } from '../ui.js';
import { AzosPart } from './part.js';
import { baseStyles, radioStyles, switchStyles } from './styles.js';

export class RadioGroup extends AzosPart{

  static properties = {
    title:     {type: String},
    itemType: {type: String}
  };

  static styles = [baseStyles, radioStyles, switchStyles];

  constructor(){ super(); }

  /** True if the radio group has radio buttons instead of switches */
  get isRadio() { return !this.isSwitch;}

  /** True if the radio group has switches instead of radio buttons */
  get isSwitch(){  return isOneOf(this.itemType, ["switch", "sw"]);}


  render(){
    const clsRank =   `${parseRank(this.rank, true)}`;
    const clsStatus = `${parseStatus(this.status, true, "Bg")}`;
    const clsDisable = `${this.isDisabled ? "disabled" : ""}`;

    const allOptions = [...this.getElementsByTagName("az-radio-option")];
    const optionList = html`${allOptions.map((option, i) => html`
      <div>
        <label>
          <input type="radio" class="${this.isRadio ? "radio" : "switch"} ${clsRank} ${clsStatus}" id="${this.id}_${i}" name="${this.id}" .disabled=${this.isDisabled}>
          <span class="${clsStatus}">${option.innerText}</span>
      </label>
      </div>
    `)}`;

    return html`
        <div class="${clsRank} ${clsDisable}">
            <p>${this.title}</p>
            ${optionList}
        </div>
    `;
  }
}

window.customElements.define("az-radio-group", RadioGroup);
