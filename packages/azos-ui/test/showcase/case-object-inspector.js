/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

import "../../vcl/util/object-inspector";

export class CaseObjectInspector extends CaseBase {
  arr = [{ key1: "value" }, { key2: { childKey1: true, childKey2: 5 } }, { key3: [{ childKey3: false, childKey4: 85 }] }];
  obj = { a: true, b: 1, c: "Moo", d: ['d0', 'd1', 'd2', 'd3'], e: { e0: true, e1: 1, e2: "Cow", e3: [{ e30: true, e31: 31, e32: "Great", e33: ["e330", "e331", "e332", "e333"] }] } };

  onRadioChange(evt) { this.objectInspector.doc = evt.target.value === "1" ? this.arr : this.obj; }

  renderControl() {
    return html`
<h2>Object Inspector</h2>

<az-radio-group title="Show which Object?" @change="${this.onRadioChange}" titlePosition="mid-left" value="2">
  <item title="Show Array" value="1"></item>
  <item title="Show Object"  value="2"></item>
</az-radio-group>

<az-object-inspector id="objectInspector" scope="this" .doc=${this.obj}></az-object-inspector>
    `;
  }
}

window.customElements.define("az-case-object-inspector", CaseObjectInspector);
