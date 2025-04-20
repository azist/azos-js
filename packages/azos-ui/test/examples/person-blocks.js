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
import { ValidationError } from "azos/types";

export class PersonBlock extends Block{
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
      <az-text scope="this"  id="tbFirstName"    name="FirstName"  title="First Name"  maxLength=10 isrequired value="William"></az-text>
      <az-text scope="this"  id="tbMiddleName"   name="MiddleName" title="Middle Name" maxLength=5  value="Q" ></az-text>
      <az-text scope="this"  id="tbLastName"     name="LastName"   title="Last Name"   maxLength=16 isrequired value="Cabbage"></az-text>
      <az-check scope="this" id="chkRegistered"  name="Registered" title="Registered"  isrequired value="true" ></az-check>
      <az-check scope="this" id="chkSmoker"      name="Smoker"     title="Former Smoker"  isrequired value="false"></az-check>
      <h4>Processing Status</h4>
      <examples-status-block scope="this" id="blockProcessStatus" name="ProcessStatus"></examples-status-block>
      <h4>Payout Status</h4>
      <examples-status-block scope="this" id="blockPayoutStatus" name="PayoutStatus"></examples-status-block>
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

export class StatusBlock extends Block{
  render(){
    return html`
      <az-text scope="this"  id="tbStatus"    name="Status"  title="Status"  maxLength=10 isrequired value="Init"></az-text>
      <az-text scope="this"  id="tbDescription"   name="Description" title="Description" maxLength=25  value="Initital" ></az-text>
      <az-check scope="this" id="chkApproved" checktype="switch" status="warning" name="Approved" title="Approved"  isrequired value="false" ></az-check>
    `;
  }
}

window.customElements.define("examples-person-block", PersonBlock);
window.customElements.define("examples-status-block", StatusBlock);
