
/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { css, html } from "../../ui";
import { CaseBase } from "./case-base";
import { isObject, isObjectOrArray } from "azos/types";

import "../../vcl/tree-viewN/tree-view";
import STL_PROSE from "../../styles/prose.js";

export class CaseTreeViewN extends CaseBase {

  static styles = [CaseBase.styles, STL_PROSE, css`
    h2{ margin-top: 0 }
  `];

  constructor() { super(); }

  firstUpdated() {
    this.#populatBasicTreeView();
    this.#populatStyledTreeView();
  }

  #results = [{ key1: "value" }, { key2: { childKey1: true, childKey2: 5 } }, { key3: [{ childKey3: false, childKey4: 85 }] }];

  #populatBasicTreeView() {
    const root = this.treeViewBasic.root;
    const data = this.#results;

    data.forEach((result, index) => createChild(`${index + 1}`, result, root));
    queueMicrotask(()=> this.treeViewBasic.requestUpdate());

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


  #populatStyledTreeView() {
    const root = this.treeViewStyled.root;
    const data = this.#results;

    const currentPath = node => {
      const path = [];
      while (node && !node.isRoot) {
        path.unshift(node.data?.key);
        node = node.parent;
      }
      return path.join("/");
    }

    this.treeViewStyled.selectedCallback = (node) =>  console.log(`Selected node:`, {path: currentPath(node), node });

    data.forEach((result, index) => createChild(`${index + 1}`, result, root));
    queueMicrotask(()=> this.treeViewStyled.requestUpdate());

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
      if (isObjectOrArray(value)) {
        node.icon = "svg://azos.ico.folder";
        Object.entries(value).forEach(([k, v]) => createChild(k, v, node));
      } else {
        node.icon = "svg://azos.ico.draft";
      }
    }
  }

  // todo: add a code block with the correct usage of the tree view to the right of each example using flex or grid or grid-split
  renderControl() {
    return html`
    <h2>Tree View - New</h2>
    <div class="prose">
      <div class="tip">Tree View N (new) is the work in progress update to the existing TreeView component that displays hierarchical data in a tree structure.</div>
    </div>

    <h4>Tree View - Basic</h4>
    <az-tree-view-n id="treeViewBasic" scope="this"></az-tree-view-n>

    <h4>Tree View - Custom icons, styles, and selected callback</h4>
    <div style="width: 300px; height: 300px; border: 1px solid #ccc; overflow: auto;">
      <az-tree-view-n id="treeViewStyled" scope="this"></az-tree-view-n>
    </div>
    `;
  }
}

window.customElements.define("az-case-tree-view-n", CaseTreeViewN);
