/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

import "../../vcl/util/object-inspector";

export class CaseObjectInspector extends CaseBase {
  results = [{ key1: "value" }, { key2: { childKey1: true, childKey2: 5 } }, { key3: [{ childKey3: false, childKey4: 85 }] }];
  obj = { a: true, b: 1, c: "Moo", d: ['d0', 'd1', 'd2', 'd3'], e: { e0: true, e1: 1, e2: "Cow", e3: [{ e30: true, e31: 31, e32: "Great", e33: ["e330", "e331", "e332", "e333"] }] } }

  renderControl() {
    return html`
<h2>Object Inspector</h2>

<az-object-inspector id="objectInspector" scope="this" .doc=${this.obj}></az-object-inspector>
    `;
  }
}

window.customElements.define("az-case-object-inspector", CaseObjectInspector);
