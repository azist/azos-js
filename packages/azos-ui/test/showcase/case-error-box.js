/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";
import "../../vcl/util/error-box.js";

export class CaseErrorBox extends CaseBase {


  renderControl() {
    return html`

<h2> VCL / Errorbox</h2>

<az-button title="Set Data" @click=${() => this.errorBox1.data = [new Error("Whats up?"), "Error string 2", "Crash!" ]}> </az-button>

<az-error-box id="errorBox1" scope="this"></az-error-box>



    `;
  }
}

window.customElements.define("az-case-error-box", CaseErrorBox);
