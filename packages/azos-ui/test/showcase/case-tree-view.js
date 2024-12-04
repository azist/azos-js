/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";
import { isObject, isObjectOrArray } from "azos/types";

import "../../vcl/tree-view/tree-view";

export class CaseTreeView extends CaseBase {

  firstUpdated() {
    const results = [{ key1: "value" }, { key2: { childKey1: true, childKey2: 5 } }, { key3: [{ childKey3: false, childKey4: 85 }] }];
    const root = this.treeView.root;

    results.forEach((result, index) => createChild(`${index + 1}`, result, root));
    this.treeView.requestUpdate();

    function createChild(key, value, parent) {
      const objectOrArray = isObjectOrArray(value);
      const options = {
        canOpen: objectOrArray ? true : false,
        opened: objectOrArray ? true : false,
        showPath: false,
        data: { key, value, parent },
      };
      const title = key + (objectOrArray ? (isObject(value) ? " {}" : " []") : `: ${value}`);
      const node = parent.addChild(title, options);
      if (isObjectOrArray(value)) Object.entries(value).forEach(([k, v]) => createChild(k, v, node));
    }
  }

  renderControl() {
    return html`
<h2>Tree View</h2>
<az-tree-view id="treeView" scope="this"></az-tree-view>
    `;
  }
}

window.customElements.define("az-case-tree-view", CaseTreeView);
