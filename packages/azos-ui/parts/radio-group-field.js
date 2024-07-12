import { isOneOf } from 'azos/strings';
import { html, parseRank, parseStatus } from '../ui.js';
import { baseStyles, radioStyles, switchStyles } from './styles.js';
import { RadioOptionField } from './radio-option-field.js';

export class RadioGroupField extends RadioOptionField{

  static properties = {
    title:    {type: String},
    itemType: {type: String}
  };

  static styles = [baseStyles, radioStyles, switchStyles];

  constructor(){ super(); }

  /** True if the radio group has radio buttons instead of switches */
  get isRadio() { return !this.isSwitch;}

  /** True if the radio group has switches instead of radio buttons */
  get isSwitch(){ return isOneOf(this.itemType, ["switch", "sw"]);}


  render(){
    const clsRank =   `${parseRank(this.rank, true)}`;
    const clsStatus = `${parseStatus(this.status, true)}`;
    const clsDisable = `${this.isDisabled ? "disabled" : ""}`;

    const allOptions = [...this.getElementsByTagName("az-radio-option")];
    const optionList = html`${allOptions.map((option) => html`
      ${option.renderRadioOption()}
    `)}`;

    return html`
        <div class="${clsRank} ${clsStatus} ${clsDisable}">
            <p>${this.title}</p>
            ${optionList}
        </div>
    `;
  }
}

window.customElements.define("az-radio-group", RadioGroupField);
