/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseRadios extends CaseBase {

  renderControl() {
    return html`
<h2>Radios</h2>

<p>A long-used form of placeholder text in design mockups and more, the standard use of dummy text has come under fire in recent years as web design grows (and the internet makes the spread of opinions much more efficient).</p>

<az-radio-group id="baseGroup" value="choiceOption" title="Group of radios (choose only 1)">
  <item title="Option 1" value="v1"></item>
  <item title="Option 2" value="v2"></item>
  <item title="Another"  value="v3"></item>
  <item title="Snake Number Four"  value="v4"></item>
</az-radio-group>
    `;
  }
}

window.customElements.define("az-case-radios", CaseRadios);
