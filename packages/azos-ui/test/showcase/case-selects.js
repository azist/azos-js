/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseSelects extends CaseBase {

  renderControl() {
    return html`
<h2>Selects/Combos</h2>
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
    `;
  }
}

window.customElements.define("az-case-selects", CaseSelects);
