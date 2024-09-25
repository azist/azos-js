/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { TreeNode } from "../../parts/tree-node";
import { AzosElement, css, html } from "../../ui";

export class TreeView extends AzosElement {

  static properties = {
    root: { type: TreeNode }
  };

  static styles = css`
    .tree-view {
      color: #c8c8c8c;
    }
  `;

  constructor() {
    super();
    this.root = null;
  }

  render() {
    if (!this.root) return html`<div>No tree data to display.</div>`;
    return html`
    <div class="tree-view">
      <az-tree-node .treeNode="${this.root}">
      </az-tree-node>
    </div>`;
  }
}

customElements.define("az-tree-view", TreeView);
