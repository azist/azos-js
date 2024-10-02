/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { TreeNode } from "../../parts/tree-node";
import { Toast } from "../../toast";
import { AzosElement, css, html, POSITION } from "../../ui";

export class TreeView extends AzosElement {

  static styles = css`
.tree-view {
  user-select: none;
}

.tree-view, .tree-node-children {
  list-style: none;
  padding-left: 1em;
}

.tree-node {

}

.tree-node-header {
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: baseline;
}

.tree-node-header:focus {
  outline: var(--focus-ctl-outline);
  box-shadow: var(--focus-ctl-box-shadow);
}

.tree-node-header:hover {
  background-color: #ddd;
}

.tree-node-content {
  flex: 1;
  display: flex;
}

.path {
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
  `;

  static properties = {
    root: { type: TreeNode },
    focusedNode: { type: Object },
  };

  #doRenderRoot = false;
  get doRenderRoot() { return this.#doRenderRoot; }
  set doRenderRoot(v) { this.#doRenderRoot = v; }

  constructor() {
    super();
    this.root = null;
    this.nodeInFocus = null;
  }

  /**
   * Construct the root node for this tree. A tree requires a root.
   * see {@link TreeNode}
   */
  createRootNode(caption, img, parent = null, canOpen = true, canClose = true, checkable = false, data = null) {
    if (this.root) return this.root;
    this.root = new TreeNode(caption, img, parent, canOpen, canClose, checkable);
    this.root.data = data;
    this.nodeInFocus = this.root;
    this.nodeInFocus.tabindex = 0;
    return this.root;
  }

  /**
   * Manage the focus of prior and upcoming node focus.
   * @param {TreeNode} node the {@link TreeNode} to nav to
   * @param {TreeNode} previousNode the previous {@link TreeNode} to nav from
   */
  focusNode(node, previousNode = null) {
    this.nodeInFocus = node;
    const nodeElement = this.$(node.guid);
    nodeElement.tabindex = 0;
    nodeElement.focus();
    if (previousNode) this.$(previousNode.guid).tabindex = -1;
  }

  toggleOpen(node) { this.open(node, !node.opened); }
  close(node) { this.open(node, false); }
  open(node, doOpen = true, emit = true) {
    console.log('open');
    node.opened = doOpen;
    this.requestUpdate();
    if (emit) this.dispatchEvent(new CustomEvent("openNode", { detail: { node: node } }));
  }

  hideChevron(node) {
    node.showChevron = false;
    this.close(node);
    this.requestUpdate();
  }

  handleKeyDown(e) {
    const toast = msg => Toast.toast(msg, undefined, undefined, undefined, POSITION.TOP_RIGHT);
    const { key } = e;
    switch (key) {
      case "ArrowUp":
        this.advanceFocusPrevious();
        toast(key); break;
      case "ArrowDown":
        this.advanceFocus();
        toast(key); break;
      case "ArrowLeft":
        if (this.nodeInFocus.hasChildren && this.nodeInFocus.isOpened) this.close(this.nodeInFocus);
        else if (this.nodeInFocus.parent) this.focusNode(this.nodeInFocus.parent);
        toast(key); break;
      case "ArrowRight":
        this.open(this.nodeInFocus);
        toast(key); break;
      case "Tab":
        e.preventDefault();
        this.advanceFocus(!e.shiftKey);
        toast(key); break;
      case "Space":
        e.preventDefault();
        if (this.nodeInFocus.checkable) {
          this.nodeInFocus.toggleChecked();
          this.dispatchEvent(new CustomEvent("nodeChecked", { detail: { node: this.nodeInFocus } }));
        }
        toast(key); break;
    }
  }

  /** Advance focus to the previous element. */
  advanceFocusPrevious() { this.advanceFocus(false); }

  /**
   * Default: advance focus to next element
   * @param {boolean} next false to move focus to the previous element
   */
  advanceFocus(next = true) {
    const nodes = this.getAllVisibleNodes();
    const nodeInFocusIndex = nodes.findIndex(node => node.guid === this.nodeInFocus.guid);
    if (nodeInFocusIndex === -1) {
      this.focusNode(nodes[0]);
      return;
    }

    let newFocusedNode = null;
    if (next) {
      if (nodeInFocusIndex === (nodes.length - 1)) newFocusedNode = nodes[0];
      else newFocusedNode = nodes[nodeInFocusIndex + 1];
    } else {
      if (nodeInFocusIndex === 0) newFocusedNode = nodes[nodes.length - 1];
      else newFocusedNode = nodes[nodeInFocusIndex - 1];
    }
    if (newFocusedNode) this.focusNode(newFocusedNode, this.nodeInFocus);
  }

  /**
   * Retrieve all nodes--or return a single node by {@link filterNodeId}--within {@link root}
   * @param {string} filterNodeId the element id ({@link TreeNode.guid}) by which to filter
   * @param {*} root default {@link this.root}, the node from which to being collecting nodes
   * @returns all nodes from all sub-nodes from {@link root}
   */
  getAllVisibleNodes(filterNodeId, root = this.root) {
    const nodes = [];
    traverseNode(root);
    return filterNodeId ? (nodes.length ? nodes[0] : null) : nodes;

    function traverseNode(node) {
      if (filterNodeId) {
        if (node.guid === filterNodeId) {
          nodes.push(node);
          return true;
        }
      } else nodes.push(node);
      if (node.hasChildren && node.isOpened) node.children.some(traverseNode);
    }
  }

  render() {
    if (!this.root) return html`<div>No tree data to display.</div>`;
    const h = html`
    <ul role="tree" class="tree-view" @keydown="${this.handleKeyDown}">
      ${this.doRenderRoot ? this.renderNode(this.root) : this.root.children.map(child => this.renderNode(child))}
    </ul>`;
    return h;
  }

  renderNode(node) {
    return html`
    <li role="treeitem" class="tree-node">
      ${this.renderHeader(node)}
      ${this.renderChildren(node)}
    </li>
    `;
  }

  /**
   * CAUTION about tabindex: https://adrianroselli.com/2014/11/dont-use-tabindex-greater-than-0.html
   * @param {*} node the {@link TreeNode} to render
   * @returns the html representing the {@link TreeNode} element
   */
  renderHeader(node) {
    // console.log(node.guid, this.focusedNode.guid);
    return html`
    <div id="${node.guid}"
      class="tree-node-header"
      @click=${() => this.focusNode(node)}
      @dblclick="${() => this.toggleOpen(node)}"
      tabindex="${this.nodeInFocus.guid === node.guid ? 0 : -1}">
      <div class="tree-node-chevron" @click="${() => this.toggleOpen(node)}" style="${node.showChevron ? '' : 'visibility: hidden'}">
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

  renderChildren(node) {
    if (node.opened && node.children.length) {
      return html`
      <ul role="group" class="tree-node-children">
        ${node.children.map(child => this.renderNode(child))}
      </ul>
      `
    } else return '';
  }

  renderIcon(node) { return html`${node.opened ? '🗁' : '📁'}`; }

  renderChevron(node) { return html`<div class="chevron ${node.opened ? 'open' : "closed"}"></div>` }

  renderContent(node) { return html`${node.caption} <span class="path">${node.path}</span>`; }

}

customElements.define("az-tree-view", TreeView);
