/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseCodeBox extends CaseBase {

  renderControl() {
    return html`
<h2> VCL / Codebox</h2>
<az-code-box highlight="js" source="">//this is my json object
{
  "a": 1, "b": 2, "c": true,
  d: ["string1", null, true, false, {"name": "string2", "salary": 100.67}],
  "c": "string message",
  "d": [{"a": -123.032, "b": +45}, false, null, null, "ok"]
}
</az-code-box>
    `;
  }
}

window.customElements.define("az-case-code-box", CaseCodeBox);
