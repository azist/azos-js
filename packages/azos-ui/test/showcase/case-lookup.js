/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

import "../../parts/lookup";

export class CaseLookup extends CaseBase {

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated() {
    super.firstUpdated();
    this.lookup.show();
    // setTimeout(() => this.lookup.hide(), 5000);
  }

  renderControl() {
    return html`
<h2>Testing az-lookup</h2>
<az-lookup id="lookup" scope="this"></az-lookup>
    `;
  }
}

window.customElements.define("az-case-lookup", CaseLookup);
