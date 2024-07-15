import { html, parseRank, parseStatus } from '../ui.js';
import { FieldPart } from './field-part.js';
import { baseStyles, textInputStyles } from './styles.js';

export class SelectField extends FieldPart{
  static styles=[baseStyles, textInputStyles];

  constructor(){ super(); }

  renderInput(){
    const clsRank     = `${parseRank(this.rank, true)}`;
    const clsStatusBg = `${parseStatus(this.status,true,"Bg")}`;

    const allOptions = [...this.getElementsByTagName("az-select-option")];
    const optionList = html`${allOptions.map((option) => html`
      <option value="${option.getAttribute('value')}" .selected=${this.value!==undefined && this.value===option.getAttribute('value')}>${option.innerText}</option>
    `)}`;

    return html`
      <select class="${clsRank} ${clsStatusBg}" id="${this.id}" name="${this.id}" value="${this.value}" .disabled=${this.isDisabled}>
        ${optionList}
      </select>
    `;
  }
}

window.customElements.define("az-select", SelectField);
