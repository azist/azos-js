/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Block } from "../../blocks.js";
import { html } from "../../ui.js";

import "../../parts/text-field.js";

export class PersonBlock extends Block{
  render(){
    return html`
    <h3>Person Block</h3>
      <az-text scope="this" id="tbFirstName"  name="FirstName" title="First Name" maxLength=10 required></az-text>
      <az-text scope="this" id="tbMiddleName" name="MiddleName" title="Middle Name" ></az-text>
      <az-text scope="this" id="tbLastName"   name="LastName" title="Last Name" maxLength=16 required></az-text>
    `;
  }
}

window.customElements.define("examples-person-block", PersonBlock);
