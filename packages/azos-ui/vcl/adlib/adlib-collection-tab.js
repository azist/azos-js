/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { CLOSE_QUERY_METHOD, DIRTY_PROP } from "azos/types";
import { Tab } from "../tabs/tab";
import { prompt } from "./ok-cancel-modal";
import { css, html } from "../../ui";


export class AdlibCollectionTab extends Tab {

  static styles=css`
.container {
  margin: 1em;
}


  `;

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

  #onExecuteClick(e) {

  }

  render() {
    return html`
<div class="container">

  <az-text multiline=${true}></az-text>

  <az-button title="Execute" @click="${this.#onExecuteClick}"></az-button>

  <az-grid-view></az-grid-view>
  <az-code-box highlight="json">
  {
    "a": 1, "b": 2, "c": true,
    d: ["string1", null, true, false, {"name": "string2", "salary": 100.67}],
    "c": "string message",
    "d": [{"a": -123.032, "b": +45}, false, null, null, "ok"]
  }
  </az-code-box>
</div>
    `;
  }

}

window.customElements.define("az-adlib-collection-tab", AdlibCollectionTab);
