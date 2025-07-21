/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { SelectField } from "../../parts/select-field.js";
import { html, css } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseSelects extends CaseBase {

  static styles = [SelectField.styles, css`
.strip-h{
    display: flex
;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 0.5em;
    gap: 1ch;
}
  `];

  dropdownData = [
  { value: "opt1", title: "Option 1", childOptions: [
      { value: "opt1-1", title: "Option 1-1", grandchildOptions: [
          { value: "opt1-1-1", title: "Option 1-1-1" },
          { value: "opt1-1-2", title: "Option 1-1-2" },
          { value: "opt1-1-3", title: "Option 1-1-3" }]},
      { value: "opt1-2", title: "Option 1-2", grandchildOptions: [
          { value: "opt1-2-1", title: "Option 1-2-1" },
          { value: "opt1-2-2", title: "Option 1-2-2" },
          { value: "opt1-2-3", title: "Option 1-2-3" }]},
      { value: "opt1-3", title: "Option 1-3", grandchildOptions: [
          { value: "opt1-3-1", title: "Option 1-3-1" },
          { value: "opt1-3-2", title: "Option 1-3-2" },
          { value: "opt1-3-3", title: "Option 1-3-3" }]}]},
  { value: "opt2", childOptions: [
      { value: "opt2-1", title: "Option 2-1", grandchildOptions: [
          { value: "opt2-1-1", title: "Option 2-1-1" },
          { value: "opt2-1-2", title: "Option 2-1-2" },
          { value: "opt2-1-3", title: "Option 2-1-3" }]},
      { value: "opt2-2", title: "Option 2-2", grandchildOptions: [
          { value: "opt2-2-1", title: "Option 2-2-1" },
          { value: "opt2-2-2", title: "Option 2-2-2" },
          { value: "opt2-2-3", title: "Option 2-2-3" }]},
      { value: "opt2-3", title: "Option 2-3", grandchildOptions: [
          { value: "opt2-3-1", title: "Option 2-3-1" },
          { value: "opt2-3-2", title: "Option 2-3-2" },
          { value: "opt2-3-3", title: "Option 2-3-3" }]}]},
  { value: "opt3", title: "Option 3", childOptions: [
      { value: "opt3-1", title: "Option 3-1", grandchildOptions: [
          { value: "opt3-1-1", title: "Option 3-1-1" },
          { value: "opt3-1-2", title: "Option 3-1-2" },
          { value: "opt3-1-3", title: "Option 3-1-3" }]},
      { value: "opt3-2", title: "Option 3-2", grandchildOptions: [
          { value: "opt3-2-1", title: "Option 3-2-1" },
          { value: "opt3-2-2", title: "Option 3-2-2" },
          { value: "opt3-2-3", title: "Option 3-2-3" }
      ]},
      { value: "opt3-3", title: "Option 3-3", grandchildOptions: [
          { value: "opt3-3-1", title: "Option 3-3-1" },
          { value: "opt3-3-2", title: "Option 3-3-2" },
          { value: "opt3-3-3", title: "Option 3-3-3" }]}]
  }
];

  #selParentChange(e) {
    // get parent selected
    const selectedValue = e.target.value; // capture the new value on change
    this.selParent.value = selectedValue; // set the parent select value to the new value
    const selectedData = this.dropdownData.find(({ value }) => value === selectedValue);

    // get children
    const children = selectedData?.childOptions || []; // capture children from parent data
    const childrenValueList = children.reduce((a,c) => ({ ...a, [c.value]: c.title ?? c.value }), {}); // create valueList dictionary from children
    this.selChild.valueList = childrenValueList; // set the sel valueList
    this.selChild.value = children[0]?.value;  // set the el value to the first item in the child options

    // get grandchildren
    const selectedChildObj = children.find(({ value }) => value === this.selChild.value);
    const grandchildren = selectedChildObj?.grandchildOptions || [];
    const grandchildrenValueList = grandchildren.reduce((a,c) => ({ ...a, [c.value]: c.title ?? c.value }), {});
    this.selGrandchild.valueList = grandchildrenValueList;
    this.selGrandchild.value = grandchildren[0]?.value;  // set the el value to the first item in the grandchild options
  }

  #selChildChange(e) {
    const selectedChild = e.target.value;
    const grandchildren = this.dropdownData.find(({ value }) => value === this.selParent.value).childOptions.find(({value}) => value === selectedChild).grandchildOptions || [];
    const grandchildrenValueList = grandchildren.reduce((a,c) => ({ ...a, [c.value]: c.title ?? c.value }), {});
    this.selGrandchild.valueList = grandchildrenValueList;
    this.selGrandchild.value = grandchildren[0]?.value;  // set the el value to the first item in the grandchild options
  }

  renderControl() {
    // Prepare options for the parent select
    let parentValueList = {};
    this.dropdownData.forEach(({ value, title }) => parentValueList[value] = title ?? value);
    parentValueList = JSON.stringify(parentValueList);

    // Prepare options for the child select based on the first parent option
    let childValueList = {};
    const selectedParentObj = this.dropdownData.find(({ value }) => value === this.selParent?.value) || this.dropdownData[0];
    selectedParentObj.childOptions.forEach(({ value, title }) => childValueList[value] = title ?? value);
    childValueList = JSON.stringify(childValueList);

    // Prepare options for the grandchild select based on the first child option
    let grandchildValueList = {};
    const selectedChildObj = selectedParentObj.childOptions.find(({ value }) => value === this.selChild?.value) || selectedParentObj.childOptions[0];
    selectedChildObj.grandchildOptions.forEach(({ value, title }) => grandchildValueList[value] = title ?? value);
    grandchildValueList = JSON.stringify(grandchildValueList);

    return html`
<h2>Selects/Combos</h2>
<h4>Single Select</h4>
<div class="strip-h">
  <az-select id="defaultSelect" title="Select one of the following from the dropdown">
    <option value="" title="Select an option&hellip;"></option>
    <option value="valueOne" title="Selected first value"></option>
    <option value="secondValue" title="Select second option"></option>
    <option value="thirdOption" title="This is an option"></option>
    <option value="opt4" title="Option #4"></option>
    <option value="fifthValue" title="OPTION FIVE"></option>
    <option value="value6" title="Yet another option"></option>
    <option value="numberSeven" title="Are you losing count yet?"></option>
    <option value="eighthOption" title="Maybe chose this one"></option>
    <option value="optionNine" title="Almost done"></option>
    <option value="finalValue" title="Last test option"></option>
  </az-select>
</div>


<h4>Select Options from Value List</h4>
  <div class="strip-h">
    <az-select
      id="selValueList"
      title="Select from the value list"
      scope="this"
      valueList='{"opt1": "Option 1", "opt2": "Option 2", "opt3": "Option 3"}'>
    </az-select>
  </div>

<h4>Cascading Selects</h4>
<div class="row cols3">
  <az-select
    id="selParent"
    title="Select the parent option"
    scope="this"
    @change="${this.#selParentChange}"
    valueList="${parentValueList}">
  </az-select>
  <az-select
    id="selChild"
    title="Select the child option"
    scope="this"
    @change="${this.#selChildChange}"
    valueList="${childValueList}">
  </az-select>
  <az-select
    id="selGrandchild"
    title="Select the grandchild option"
    scope="this"
    valueList="${grandchildValueList}">
  </az-select>
</div>



    `;
  }
}

window.customElements.define("az-case-selects", CaseSelects);
