/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { dfltObject, isOneOf } from "azos/strings";
import { DATA_VALUE_PROP, isObject, isString, VALIDATE_METHOD, ValidationError } from "azos/types";

import { Block } from "../../blocks.js";
import { html } from "../../ui.js";
import { FieldPart } from "../../parts/field-part.js";
import { STL_INLINE_GRID } from "../../styles";

import "../../parts/text-field.js";
import "../../parts/check-field.js"
import { Bit } from "../../bit.js";
import { Command } from "../../cmd.js";

export class PersonBlock extends Block {

  static styles = [...Block.styles, STL_INLINE_GRID];


  static properties = {
    otherStatuses: {type: Array}
  };


  renderControl(){


    return html`
    <h3>Person Block</h3>
      <div class="row cols3">
        <az-text scope="this"  id="tbFirstName"    name="FirstName"  title="First Name"  maxLength=10 isrequired value="William"></az-text>
        <az-text scope="this"  id="tbMiddleName"   name="MiddleName" title="Middle Name" maxLength=5  value="Q"  whenInsert="absent" whenUpdate="disable"></az-text>
        <az-text scope="this"  id="tbLastName"     name="LastName"   title="Last Name"   maxLength=16 isrequired value="Cabbage"></az-text>
      </div>
      <div class="row cols4">
        <az-text scope="this"  id="tbDOB"          name="DOB"        title="Date of Birth (Chicago)" isrequired dataKind="datetime" value="" timeZone="CST"></az-text>
        <az-text scope="this"  id="tbPhone"        name="Phone"      title="Phone"       maxLength=24 isrequired dataKind="tel" value=""></az-text>
        <az-check scope="this" id="chkRegistered"  name="Registered" title="Registered"  isrequired value="true" ></az-check>
        <az-check scope="this" id="chkSmoker"      name="Smoker"     title="Former Smoker"  isrequired value="false" checkType="cross"></az-check>
      </div>

      <div class="row cols2">
        <az-radio-group id="rgDrinking" name="drinking" title="Drinking Choices (choose only 1)" status="ok">
          <item title="Tea" value="tea"></item>
          <item title="Coke" value="coke"></item>
          <item title="Coffee" value="cof"></item>
          <item title="Beer" value="beer"></item>
        </az-radio-group>

        <az-radio-group id="rgFood" name="food" title="Food Preferences (choose only 1)" status="info">
          <item title="Pork" value="pork"></item>
          <item title="Beef" value="beef"></item>
          <item title="Chicken" value="chi"></item>
          <item title="Fish" value="fish"></item>
        </az-radio-group>
      </div>

      <h4>Processing Status</h4>
      <examples-status-block scope="this" id="blockProcessStatus" name="ProcessStatus"></examples-status-block>

      <h4>Payout Status</h4>
      <examples-status-block scope="this" id="blockPayoutStatus" name="PayoutStatus"></examples-status-block>

      <h4>Status List</h4>
      <az-list-bit scope="this" id="lstStatuses" name="Statuses" title="Status List" description="Example of using a list bit" itemTagName="examples-status-block"></az-list-bit>

      <h4>Other Statuses</h4>
      <!-- notice how both fields map to the same field by name effectively creating an array -->
      <examples-status-block scope="this" id="blockOtherStatus0" name="OtherStatuses" rank="small"></examples-status-block>
      <br>
      <examples-status-block scope="this" id="blockOtherStatus1" name="OtherStatuses" rank="small"></examples-status-block>
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

export class StatusBlock extends Bit {

  #cmdAbout = new Command(this, {
    icon: "svg://azos.ico.database",
    handler: function(arena, cmd){
      alert("About Command!!!");
    }
  });

  #cmdTest = new Command(this, {
    icon: "svg://azos.ico.category",
    handler: function(arena, cmd){
      alert("Test Command!!!");
    }
  });

  #cmdCalendar = new Command(this, {
    icon: "svg://azos.ico.calendarToday",
    handler: function(arena, cmd){
      alert("Calendar");
    }
  });


  _getSummaryData(){
    return {
      title: dfltObject(this.tbStatus?.value, html`<span style="color: var(--ghost)">Status</span>`),
      subtitle: this.tbDescription?.value,
      commands: [this.#cmdTest, (this.tbStatus?.value?.indexOf("book") ?? -1) >= 0  ? this.#cmdCalendar : null, this.#cmdAbout]
    };
  }

  renderDetailContent(){
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
