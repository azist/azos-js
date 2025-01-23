/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

import "../../parts/lookup";
import { matchPattern } from "azos/strings";
import { isNonEmptyString } from "azos/types";

export class CaseLookup extends CaseBase {

  async firstUpdated() {
    super.firstUpdated();
    this.$("lookup").source.results = [
      { street1: "1600 Pennsylvania Ave NW", city: "Washington", state: "DC", zip: "20500" },
      { street1: "600 Biscayne Blvd NW", city: "Miami", state: "FL", zip: "33132" },
      { street1: "2 15th St NW", city: "Washington", state: "DC", zip: "20024" },
    ];
    this.$("lookup").source.filterFn = (result, filterPattern) => ["street1", "street2", "city", "state", "zip"]
      .map(k => result[k])
      .filter(isNonEmptyString)
      .some(str => matchPattern(str, filterPattern))
  }

  selectAddress(event) {
    console.log(event);
    const { street1, street2, city, state, zip } = event.detail.value;
    this.tbStreet1.value = street1;
    this.tbStreet2.value = street2;
    this.tbCity.value = city;
    this.tbState.value = state;
    this.tbZip.value = zip;
    this.requestUpdate();
  }

  renderControl() {
    return html`
<h2>Testing az-lookup</h2>
<az-text id="tbStreet1" scope="this" title="Street 1" lookupId="lookup" placeholder="Start typing to search"></az-text>
<az-text id="tbStreet2" scope="this" title="Street 2"></az-text>
<az-text id="tbCity" scope="this" title="City"></az-text>
<az-text id="tbState" scope="this" title="State" lookupType="valueList" valueList='{"mi":"Michigan", "oh":"Ohio"}'></az-text>
<az-text id="tbZip" scope="this" title="Zip"></az-text>
<az-lookup id="lookup" scope="this" @lookupSelect="${address => this.selectAddress(address)}"></az-lookup>
    `;
  }
}

window.customElements.define("az-case-lookup", CaseLookup);
