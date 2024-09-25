/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { TreeNode } from "../../parts/tree-node";
import { AzosElement, css, html } from "../../ui";

export class TreeNodeElement extends AzosElement {

  static properties = {
    treeNode: { type: TreeNode }
  };

  static styles = css`
    .tree-node {
      margin-left: 2em;
    }

    .chevron {
      width: 10px;
      height: 10px;
      border-style: solid;
      border-width: 0 3px 3px 0;
      border-color: #000000ee;
      border-radius: 2px;
      display: inline-block;
      padding: 0;
      margin-right: 0.2em;
      transform: rotate(45deg);
      transition: transform 0.075s ease;
      cursor: pointer;
    }

    .chevron.collapsed {
      transform: rotate(-45deg);
    }

    .tree-node > .tree-node-header {
      cursor: pointer;
      font-weight: bold;
      display: flex;
      align-items: baseline;
    }

    .tree-node-header > .tree-node-icon {

    }

    .tree-node-header > .tree-node-content {
      flex: 1;
    }
  `;

  constructor() {
    super();
    this.treeNode = null;
  }

  toggleExpand() {
    this.treeNode.expanded = !this.treeNode.expanded;
    this.requestUpdate();
  }

  renderIcon() { return html`${this.treeNode.expanded ? '🗁' : '📁'}`; }
  renderChevron() { return html`<div class="chevron ${this.treeNode.expanded ? '' : "collapsed"}"></div>` }
  renderContent() { return html`${this.treeNode.caption}`; }

  render() {
    return html`
    <div class="tree-node">
      <div class="tree-node-header" @click="${this.toggleExpand}">
        ${this.renderChevron()}
        <div class="tree-node-icon">${this.renderIcon()}</div>
        <div class="tree-node-content">${this.renderContent()}</div>
      </div>
      ${this.treeNode.expanded ? html`
        <div class="tree-node-children">
          ${this.treeNode.children.map(child => this.renderChild(child))}
        </div>
        ` : ''}
    </div>
    `;
  }

  renderChild(child) {
    return html`<az-tree-node .treeNode="${child}"></az-tree-node>`;
  }
}

customElements.define("az-tree-node", TreeNodeElement);
