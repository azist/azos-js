import { isOneOf } from 'azos/strings';
import { html, parseRank, parseStatus } from '../ui.js';
import { baseStyles, radioStyles, switchStyles } from './styles.js';
import { FieldPart } from './field-part.js';

/* Can this work with the FieldPart? */

export class RadioGroupField extends FieldPart{
  static properties = {
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

  #radioChange(e){
    this.value = e.target.value;
    this.inputChanged();
  }

  renderInput(){
    const clsRank =   `${parseRank(this.rank, true)}`;
    const clsStatusBg = `${parseStatus(this.status, true, "Bg")}`;

    const allItems = [...this.getElementsByTagName("item")];
    const v = this.value;

    const itemList = html`${allItems.map((item, i) => {
      const itv = item.getAttribute('value');
      return  html`
      <li>
        <input
          type="radio"
          class="${this.isRadio ? "radio" : "switch"} ${clsRank} ${clsStatusBg}"
          id="${this.id}_${i}"
          name="${this.id}"
          value="${itv}"
          .disabled=${this.isDisabled}
          .required=${this.isRequired}
          ?readonly=${this.isReadonly}
          @change="${this.#radioChange}"
          .checked=${itv===v}
          />

        <label for="${this.id}_${i}">${item.title}</label>
      </li>
    `;})}`;

    return html`<ul style="list-style: none;">${itemList}</ul>`;
  }
}

window.customElements.define("az-radio-group", RadioGroupField);
