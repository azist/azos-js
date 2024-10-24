/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { CLOSE_QUERY_METHOD, DIRTY_PROP, isObjectOrArray } from "azos/types";
import { Tab } from "../tabs/tab";
import { prompt } from "../../ok-cancel-modal";
import { css, html } from "../../ui";
import { AdlibClient } from "azos/sysvc/adlib/adlib-client";
import { Spinner } from "../../spinner";


export class AdlibCollectionTab extends Tab {

  static styles = css`
.container {
  margin: 1em;
  height: 100%;
}

#results {
  max-height: 500px;
}

  `;

  #ref = {
    svcAdlibClient: AdlibClient,
  };

  static properties = {
    context: { type: Object },
    filterText: { type: String },
  };

  #dirty = Math.random() < 0.5;
  get [DIRTY_PROP]() { return this.#dirty; }

  async [CLOSE_QUERY_METHOD]() {
    if (this[DIRTY_PROP]) return await prompt("Are you sure?");
    return true;
  }

  constructor() {
    super();
    this.iconPath = "https://www.shareicon.net/download/2015/03/16/7846_database.ico";
  }

  async #onExecuteClick() {
    const filter = JSON.parse(this.filter.value);

    const got = await Spinner.exec(async () => this.#ref.svcAdlibClient.getItems(filter), "Fetching");
    this.#populateTree(got.data.data);
    this.results.source = JSON.stringify(got.data.data, null, 4);
  }

  #populateTree(doc) {
    doc.forEach((item, index) => createChild(`result${index + 1}`, item, this.treeView.root));

    this.treeView.requestUpdate();
    function createChild(key, value, parent) {
      const objectOrArray = isObjectOrArray(value);
      const options = {
        canOpen: objectOrArray ? true : false,
        opened: objectOrArray ? true : false,
      };
      const title = key + (objectOrArray ? "" : `: ${value}`);
      const node = parent.addChild(title, options);
      if (isObjectOrArray(value)) Object.entries(value).forEach(([k, v]) => createChild(k, v, node));
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
  }

  render() {
    return html`
<div class="container">
  <az-text id="filter" scope="this" itemtype="multiline" value="${this.filterText}" rank="4"></az-text>

  <az-button title="Execute" status="ok" @click="${this.#onExecuteClick}"></az-button>

  <az-tree-view id="treeView" scope="this"></az-tree-view>
  <az-code-box id="results" scope="this" highlight="json" rank="4"></az-code-box>
  </div>
  `;
    // <az-grid-view></az-grid-view>
  }

}

window.customElements.define("az-adlib-collection-tab", AdlibCollectionTab);
