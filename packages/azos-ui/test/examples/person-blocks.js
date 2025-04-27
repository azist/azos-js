/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Block } from "../../blocks.js";
import { html } from "../../ui.js";

import "../../parts/text-field.js";
import "../../parts/check-field.js"
import { isOneOf } from "azos/strings";
import { DATA_VALUE_PROP, isObject, isString, VALIDATE_METHOD, ValidationError } from "azos/types";
import { FieldPart } from "../../parts/field-part.js";
import STL_GRID from "../../styles/grid.js";

export class PersonBlock extends Block {

  static styles = [...Block.styles, STL_GRID];


  static properties = {
    otherStatuses: {type: Array}
  };


  render(){

    let errors = [];//error summary

    if (this.error){
       errors.push(html`<h4 style="color: red">Block validation has errors:</h4>`);
       if (this.error.cause){
         for(const one of this.error.cause){
          errors.push(html`<div style="color: #ff8010">'${one.field}': ${one.message}</div>`);
         }
       }
    }

    return html`
    <h3>Person Block</h3>
      ${errors}
      <div class="grid cols3">
        <az-text scope="this"  id="tbFirstName"    name="FirstName"  title="First Name"  maxLength=10 isrequired value="William"></az-text>
        <az-text scope="this"  id="tbMiddleName"   name="MiddleName" title="Middle Name" maxLength=5  value="Q" ></az-text>
        <az-text scope="this"  id="tbLastName"     name="LastName"   title="Last Name"   maxLength=16 isrequired value="Cabbage" whenInsert="absent" whenUpdate="disable"></az-text>
      </div>
      <div class="grid cols3">
        <az-text scope="this"  id="tbPhone"        name="Phone"      title="Phone"       maxLength=24 isrequired dataKind="tel" value=""></az-text>
        <az-check scope="this" id="chkRegistered"  name="Registered" title="Registered"  isrequired value="true" ></az-check>
        <az-check scope="this" id="chkSmoker"      name="Smoker"     title="Former Smoker"  isrequired value="false"></az-check>
      </div>

      <h4>Processing Status</h4>
      <examples-status-block scope="this" id="blockProcessStatus" name="ProcessStatus"></examples-status-block>

      <h4>Payout Status</h4>
      <examples-status-block scope="this" id="blockPayoutStatus" name="PayoutStatus"></examples-status-block>

      <h4>Other Statuses</h4>
      <!-- notice how both fields map to the same field by name effectively creating an array -->
      <examples-status-block scope="this" id="blockOtherStatus0" name="OtherStatuses"></examples-status-block>
      <examples-status-block scope="this" id="blockOtherStatus1" name="OtherStatuses"></examples-status-block>
      ${this.otherStatuses}
    `;
  }

  //Add cross-field validation
  _doValidate(errorBatch, context, scope){
    super._doValidate(errorBatch, context, scope);
    if (this.chkSmoker.value && isOneOf(this.tbLastName.value, "Mozart;Bach")){
      errorBatch.push(new ValidationError("PersonBlock", "Smoker", scope, "Neither Bach nor Mozart are allowed to smoke in this system"));
    }
  }
}

export class StatusBlock extends Block {
  render(){
    return html`
      <az-text scope="this"  id="tbStatus"    name="Status"  title="Status"  maxLength=10 isrequired value="Init"></az-text>
      <az-text scope="this"  id="tbDescription"   name="Description" title="Description" maxLength=25  value="Initital" ></az-text>
      <az-check scope="this" id="chkApproved" checktype="switch" status="warning" name="Approved" title="Approved"  isrequired value="false" ></az-check>
    `;
  }
}

export class PersonField extends FieldPart {

  castValue(v){
    if (v === null || v === undefined) return null;
    if (isObject(v)) return v;
    if (isString(v)) return JSON.parse(v);
    throw new ValidationError("PersonField", "value", "", "Invalid value", "Bad value");
  }

  focus(){
    const t = this.$("blockData");
    if (!t) return;
    window.queueMicrotask(() => t.focus());
  }

  firstUpdated(){
    const block = this.$("blockData");
    if (!block) return;
    window.queueMicrotask(() =>  block[DATA_VALUE_PROP] = this.value);
  }

  #blockDataChange(e){
    this.setValueFromInput(e.target[DATA_VALUE_PROP]);
    this.inputChanged();
  }

  _doValidate(context, scope){
    let result = super._doValidate(context, scope);
    if (result) return result;

    const block = this.$("blockData");
    if (!block) return;
    return block[VALIDATE_METHOD](context, scope, true);
  }

  renderInput(){
    return html`<examples-person-block id="blockData" .blockData=${this.value} @datachange=${this.#blockDataChange}></examples-person-block>`
  }
}



window.customElements.define("examples-person-block", PersonBlock);
window.customElements.define("examples-status-block", StatusBlock);
window.customElements.define("examples-person-field", PersonField);
