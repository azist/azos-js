import { isOneOf } from 'azos/strings';
import { html, parseRank, parseStatus } from '../ui.js';
import { FieldPart } from './field-part.js';
import { baseStyles, checkStyles, switchStyles } from './styles.js';
import { asTriBool } from 'azos/types';

export class CheckField extends FieldPart{
  static properties = {
    itemType: {type: String}
  };

  static styles = [baseStyles, checkStyles, switchStyles];

  constructor(){
    super();
  }

  /** check fields store boolean value only */
  castValue(v){ return asTriBool(v); }

  /** True if this part has a checkbox instead of a switch */
  get isCheck(){ return !this.isSwitch;}

  /** True if this part has a switch instead of a checkbox */
  get isSwitch(){ return isOneOf(this.itemType, ["switch", "sw"]); }

   /** Checkboxes and switches have pre-defined content layout */
   get isPredefinedContentLayout(){ return true; }


  #chkChange(e){
    this.value = e.target.checked;
    this.inputChanged();
  }


  renderInput(){
    const clsRank=`${parseRank(this.rank, true)}`;
    const clsStatusBg=`${parseStatus(this.status,true,"Bg")}`;

    return html`
      <input
        type="checkbox"
        class="${this.isCheck ? "check" : "switch"} ${clsRank} ${clsStatusBg}"
        id="${this.id}"
        name="${this.id}"
        .disabled=${this.isDisabled}
        .required=${this.isRequired}
        ?readonly=${this.isReadonly}
        .checked=${this.value}
        @change="${this.#chkChange}" />
    `;
  }
}

window.customElements.define("az-check", CheckField);
