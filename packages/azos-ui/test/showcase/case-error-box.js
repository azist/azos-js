/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";
import "../../vcl/util/error-box.js";
import { CLIENT_MESSAGE_PROP, ValidationError } from "azos/types";

export class CaseErrorBox extends CaseBase {


  renderControl() {
    return html`

<h2> VCL / Errorbox</h2>

<az-button title="Set Data" @click=${() => this.errorBox1.data = [
  new Error("Whats up?"),
  "Error string 2",
  ["SubLevel Another", ["SubSub 1", "Another reason SubSub 2 for error text goes here"], "Sub Level Error text as plain string"],
  "Crash!",
  new ValidationError("DoctorForm", "/", "", "Form validation", "Form contains validation errors", "", [
    new ValidationError("HumanNameBlock", "LastName", "", "Invalid value", "Maximum field length of 16 exceeded", ""),
    new ValidationError("HumanNameBlock", "Phone", "", "Invalid value", "Bad phone", ""),
  ]),
  {[CLIENT_MESSAGE_PROP]: "Custom error provider,"},
  {x: 1, b: -234}
 ]}> </az-button>

<az-error-box id="errorBox1" scope="this"></az-error-box>



    `;
  }
}

window.customElements.define("az-case-error-box", CaseErrorBox);
