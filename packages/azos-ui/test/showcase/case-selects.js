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
    const selectedValue = e.target.value;
    const selectedData = this.dropdownData.find(({ value }) => value === selectedValue);
    // set child dropdown options based on the selected parent
    this.selChild.options = selectedData?.childOptions || [];
    // default the value to the first item in the child options
    this.selChild.value = this.selChild.options[0]?.value || "";
    // set grandchild options based on the first child option
    const selectedChildObj = this.selChild.options.find(({ value }) => value === this.selChild.value);
    // set grandchild dropdown options based on the selected child
    this.selGrandchild.options = selectedChildObj?.grandchildOptions || [];
  }

  #selChildChange(e) {
    const selectedValue = e.target.value;
    const selectedChildData = this.selChild.options.find(({ value }) => value === selectedValue);
    // set grandchild dropdown options based on the selected child
    this.selGrandchild.options = selectedChildData?.grandchildOptions || [];
    // default the value to the first item in the grandchild options
    this.selGrandchild.value = this.selGrandchild.options[0]?.value || "";
  }

  renderControl() {
    // Prepare options for the parent select
    const parentOptions = [];
    this.dropdownData.forEach(({ value, title }) => parentOptions.push(html`<option value="${value}" title="${title ?? value}">${title ?? value}</option>`));

    // Prepare options for the child select based on the first parent option
    const childOptions = [];
    const selectedParentObj = this.dropdownData.find(({ value }) => value === this.selParent?.value) || this.dropdownData[0];
    selectedParentObj.childOptions.forEach(({ value, title }) => childOptions.push(html`<option value="${value}" title="${title ?? value}">${title ?? value}</option>`));

    // Prepare options for the grandchild select based on the first child option
    const grandchildOptions = [];
    const selectedChildObj = selectedParentObj.childOptions.find(({ value }) => value === this.selChild?.value) || selectedParentObj.childOptions[0];
    selectedChildObj.grandchildOptions.forEach(({ value, title }) => grandchildOptions.push(html`<option value="${value}" title="${title ?? value}">${title ?? value}</option>`));

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

<h4>Cascading Selects</h4>
<div class="row cols3">
  <az-select
    id="selParent"
    title="Select the parent option"
    scope="this"
    @change="${this.#selParentChange}"
  >${parentOptions}
  </az-select>
  <az-select
    id="selChild"
    title="Select the child option"
    scope="this"
    @change="${this.#selChildChange}"
  >${childOptions}</az-select>
  <az-select
    id="selGrandchild"
    title="Select the grandchild option"
    scope="this"
  >${grandchildOptions}</az-select>
</div>



    `;
  }
}

window.customElements.define("az-case-selects", CaseSelects);
