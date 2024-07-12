import { isOneOf } from 'azos/strings';
import { html, parseRank, parseStatus } from '../ui.js';1
import { FieldPart } from './field-part.js';

export class RadioOptionField extends FieldPart{
  static properties = {
    checked:  {type: Boolean, reflect: true},
    itemType: {type: String},
    seqId:    {type: String}
  };

  constructor(){
    super();
    this.checked = false;
  }

  /** True if the radio group has radio buttons instead of switches */
  get isRadio() { return !this.isSwitch; }

  /** True if the radio group has switches instead of radio buttons */
  get isSwitch(){ return isOneOf(this.itemType, ["switch", "sw"]); }

  renderInput(){
    const clsRank =     `${parseRank(this.rank, true)}`;
    const clsStatusBg = `${parseStatus(this.status, true, "Bg")}`;

    return html`
      <input type="radio" class="${this.isRadio ? "radio" : "switch"} ${clsRank} ${clsStatusBg}" id="${this.seqId}" name="${this.id}" .disabled=${this.isDisabled}>
    `;
  }

  /** Override to render radio option(s) */
  renderRadioOption(){ return noContent; }
}
