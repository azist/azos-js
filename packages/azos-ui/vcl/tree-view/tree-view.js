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
  user-select: none;
}

.tree-node {
  margin-left: 1em;
}

.tree-node > .tree-node-header {
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: baseline;
}

.chevron {
  width: 10px;
  height: 10px;
  border-style: solid;
  border-width: 0 3px 3px 0;
  border-color: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  display: inline-block;
  padding: 0;
  margin-right: 0.2em;
  transform: rotate(45deg);
  transition: transform 0.075s ease;
  cursor: pointer;
  box-sizing: border-box;
}

.chevron.closed {
  transform: rotate(-45deg);
}

.tree-node-header:hover {
  background-color: #ddd;
}

.tree-node-header > .tree-node-content {
  flex: 1;
  display: flex;
}

.tree-node-header > .tree-node-content > .path {
  color: #ccc;
  background-color: #999;
  border-radius: 5px;
  padding: 0.1em 0.5em;
  box-sizing: border-box;
  font-size: 0.75em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5em;
}
  `;

  #doRenderRoot = false;
  get doRenderRoot() { return this.#doRenderRoot; }
  set doRenderRoot(v) { this.#doRenderRoot = v; }

  constructor() {
    super();
    this.root = null;
  }

  /**
   * Construct the root node for this tree. A tree requires a root.
   * see {@link TreeNode}
   */
  createRootNode(caption, img, parent = null, canOpen = true, canClose = true, checkable = false, data = null) {
    if (this.root) return this.root;
    this.root = new TreeNode(caption, img, parent, canOpen, canClose, checkable);
    this.root.data = data;
    return this.root;
  }

  close(node) { this.open(node, false); }
  open(node, opened = true) {
    node.opened = opened;
    this.requestUpdate();
  }

  toggleOpened(node) {
    this.open(node, !node.opened);
    this.dispatchEvent(new CustomEvent("openNode", { detail: { node } }));
  }

  hideChevron(node) {
    node.showChevron = false;
    this.close(node);
    this.requestUpdate();
  }

  render() {
    if (!this.root) return html`<div>No tree data to display.</div>`;
    return html`
    <div class="tree-view">
      ${this.doRenderRoot ? this.renderNode(this.root) : this.root.children.map(child => this.renderNode(child))}
    </div>`;
  }

  renderNode(node) {
    return html`
    <div class="tree-node">
      ${this.renderHeader(node)}
      ${this.renderChildren(node)}
    </div>
    `;
  }

  renderChildren(node) {
    if (node.opened && node.children.length) {
      return html`
      <div class="tree-node-children">
        ${node.children.map(child => this.renderNode(child))}
      </div>
      `
    } else return '';
  }

  renderHeader(node) {
    return html`
    <div class="tree-node-header" @dblclick="${() => this.toggleOpened(node)}">
      <div class="tree-node-chevron" @click="${() => this.toggleOpened(node)}" style="${node.showChevron ? '' : 'visibility: hidden'}">
        ${this.renderChevron(node)}
      </div>
      <div class="tree-node-icon">
        ${this.renderIcon(node)}
      </div>
      <div class="tree-node-content">
        ${this.renderContent(node)}
      </div>
    </div>
  `;
  }

  renderIcon(node) { return html`${node.opened ? '🗁' : '📁'}`; }
  renderChevron(node) { return html`<div class="chevron ${node.opened ? 'open' : "closed"}"></div>` }
  renderContent(node) { return html`${node.caption} <span class="path">${node.path}</span>`; }

}

customElements.define("az-tree-view", TreeView);
