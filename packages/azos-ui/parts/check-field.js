/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOneOf } from 'azos/strings';
import { html, parseRank, parseStatus, domCreateRef, domRef } from '../ui.js';
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

  inputRef = domCreateRef();

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

  firstUpdated() {
    if(this.isReadonly) {
      this.inputRef.value.setAttribute("onclick", "return false");
    }
  }

  renderInput(){
    const clsRank=`${parseRank(this.rank, true)}`;
    const clsStatusBg=`${parseStatus(this.status,true,"Bg")}`;
    const checkboxStyles = this.isCheck ? "check" : "switch";

    return html`
      <input
        ${domRef(this.inputRef)}
        type="checkbox"
        class="${checkboxStyles} ${clsRank} ${clsStatusBg}"
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
