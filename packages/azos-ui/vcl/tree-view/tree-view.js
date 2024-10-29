/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { TreeNode } from "./tree-node";
import { AzosElement, css, html, parseRank, parseStatus } from "../../ui";
import { isOf, isTrue } from "azos/aver";
import { baseStyles } from "../../parts/styles";

export class TreeView extends AzosElement {

  static #idSeed = 0;
  static styles = [baseStyles, css`
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
  `];

  static properties = {
    root: { type: TreeNode },
    nodeInFocus: { type: TreeNode },
    showRoot: { type: Boolean },
  };

  #nodeInFocus;
  /** @param {TreeNode} node */
  get nodeInFocus() { return this.#nodeInFocus; }
  set nodeInFocus(node) {
    isTrue(isOf(node, TreeNode).treeView === this);
    this.#nodeInFocus = node;
  }

  #showRoot;
  /**
   * @param {boolean} v
   */
  set showRoot(v) {
    this.#showRoot = v;
    this.root.isVisible = v;
  }

  constructor() {
    super();
    this.treeViewId = TreeView.#idSeed++;
    this.root = this._createNode(null, "/"); // default for rendering's sake
    this.showRoot = false;
  }

  /**
   * Protected factory method creates node of appropriate type for this {@link TreeView} subtype.
   *  Override to create a more specific derivation {@link TreeNode}
   * @param {string} title
   * @param {TreeNode} parent
   * @param {TreeNode} options
   * @returns
   */
  _createNode(parent, title, options = {}) {
    // console.log(options);
    return new TreeNode(this, parent, title, options);
  }

  /**
   *
   * @param {TreeNode} node the node that changed
   * @param {any} eArgs arguments passed to the event via detail
   */
  _dispatchNodeUserActionEvent(node, eArgs) {
    this.dispatchEvent(new CustomEvent("nodeUserAction", { detail: { node, ...eArgs } }));
  }

  /**
   * Retrieve all nodes--or return a single node by {@link filterNodeId}--within {@link root}
   * @param {string} filterNodeId the element id ("tn{@link TreeNode.id}") by which to filter
   * @param {*} root default {@link this.root}, the node from which to being collecting nodes
   * @returns all nodes from all sub-nodes from {@link root}
   */
  getAllVisibleNodes(filterNodeId, root = this.root) {
    const nodes = [];
    traverseNode(root);
    return filterNodeId ? (nodes.length ? nodes[0] : null) : nodes;

    function traverseNode(node) {
      if (filterNodeId) {
        if (node.id === filterNodeId) {
          nodes.push(node);
          return true;
        }
      } else if (node.isVisible) nodes.push(node);
      if ((node.isRoot || (node.isVisible && node.isOpened)) && node.hasChildren) node.children.some(traverseNode);
    }
  }

  closeAllNodes() {
    const visibleNodes = this.getAllVisibleNodes();
    this.#focusNode(visibleNodes[0], this.nodeInFocus, false);
    visibleNodes.forEach(node => node.close());
    this.requestUpdate();
  }

  removeAllNodes() {
    if (!this.root.hasChildren) return;
    this.nodeInFocus = this.root;
    this.root.removeAllChildren();
    this.requestUpdate();
  }

  #close(node) {
    node.close();
    this._dispatchNodeUserActionEvent(node, { action: "closed" });
  }

  #open(node) {
    node.open();
    this._dispatchNodeUserActionEvent(node, { action: "opened" });
  }

  /** Advance focus to the previous element. */
  #advanceFocusPrevious() { this.#advanceFocus(false); }

  /**
   * Default: advance focus to next element
   * @param {boolean} next false to move focus to the previous element
   */
  #advanceFocus(next = true) {
    const nodes = this.getAllVisibleNodes();
    const nodeInFocusIndex = nodes.findIndex(node => node.id === this.nodeInFocus?.id);
    if (nodeInFocusIndex === -1) {
      if (nodes.length > 0) this.#focusNode(nodes[0]);
      return;
    }

    let newNodeInFocus = null;
    if (next) {
      if (nodeInFocusIndex === (nodes.length - 1))
        if (this.nextElementSibling) this.nextElementSibling.focus();
        else newNodeInFocus = nodes[0];
      else newNodeInFocus = nodes[nodeInFocusIndex + 1];
    } else {
      if (nodeInFocusIndex === 0)
        if (this.previousElementSibling) this.previousElementSibling.focus();
        else newNodeInFocus = nodes[nodes.length - 1];
      else newNodeInFocus = nodes[nodeInFocusIndex - 1];
    }
    if (newNodeInFocus) this.#focusNode(newNodeInFocus, this.nodeInFocus);
  }

  /**
   * Manage the focus of prior and upcoming node focus.
   * @param {TreeNode} node the {@link TreeNode} to nav to
   * @param {TreeNode} previousNode the previous {@link TreeNode} to nav from
   * @param {boolean} emitEvent true to emit event `focusChanged`, default: true
   */
  #focusNode(node, previousNode = null, emitEvent = true) {
    this.nodeInFocus = node;
    const nodeElement = this.$(`tn${node.id}`);
    nodeElement.tabindex = 0;
    nodeElement.focus();
    if (emitEvent) this._dispatchNodeUserActionEvent(node, { action: "focusChanged" });
    if (previousNode?.isVisible) this.$(`tn${previousNode.id}`).tabindex = -1;
  }

  #onNodeToggleOpen(node) {
    if (!node.canOpen) return;
    if (node.isOpened)
      this.#close(node);
    else
      this.#open(node);
  }

  #onChevronClicked(e, node) {
    e.stopPropagation();
    this.#onNodeToggleOpen(node);
  }

  #onNodeClicked(node) {
    this.#focusNode(node, null);
    this._dispatchNodeUserActionEvent(node, { action: "clicked" });
  }

  #onKeyDown(e) {
    const { key } = e;
    switch (key) {
      case "ArrowUp":
        e.preventDefault();
        this.#advanceFocusPrevious();
        break;
      case "ArrowDown":
        e.preventDefault();
        this.#advanceFocus();
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (this.nodeInFocus.hasChildren && this.nodeInFocus.isOpened) this.#close(this.nodeInFocus);
        else if (this.nodeInFocus.parent)
          if (this.nodeInFocus.parent.isVisible) this.#focusNode(this.nodeInFocus.parent);
          else this.#focusNode(this.nodeInFocus.parent.children[0]);
        break;
      case "ArrowRight":
        e.preventDefault();
        if (this.nodeInFocus.isClosed) this.#open(this.nodeInFocus);
        else if (this.nodeInFocus.hasChildren) this.#advanceFocus(this.nodeInFocus.children[0]);
        break;
      case "Tab":
        e.preventDefault();
        this.#advanceFocus(!e.shiftKey);
        break;
      case "Space":
        e.preventDefault();
        if (this.nodeInFocus.checkable) {
          this.nodeInFocus.toggleChecked();
          this.dispatchEvent(new CustomEvent("nodeChecked", { detail: { node: this.nodeInFocus } }));
        }
        break;
    }
  }

  async #onTreeFocus(e) {
    await this.updateComplete;
    if (this.nodeInFocus) {
      this.#focusNode(this.nodeInFocus);
      return;
    }
    if (e.target) this.$(e.target.id).tabindex = -1;
    const visibleNodes = this.getAllVisibleNodes();
    if (!visibleNodes) return;
    this.#focusNode(visibleNodes[0]);
  }

  render() {
    if (!this.root) return html`<div>No tree data to display.</div>`;
    let cls = `${parseRank(this.rank, true)} ${parseStatus(this.status, true)}`;
    const h = html`
    <ul id="tv${this.treeViewId}" scope="this" part="tree" role="tree" class="${cls} tree-view" @keydown="${this.#onKeyDown}" tabindex=0 @focus="${this.#onTreeFocus}">
      ${this.#showRoot ? this.renderNode(this.root) : this.root.children.map(child => this.renderNode(child))}
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
    // console.log(node.id, this.focusedNode?.id);
    return html`
    <div id="tn${node.id}"
      class="tree-node-header"
      @click=${() => this.#onNodeClicked(node)}
      @dblclick="${(e) => this.#onNodeToggleOpen(e, node)}"
      tabindex="${this.nodeInFocus?.id === node.id ? 0 : -1}"
      >
      <div class="tree-node-chevron" @click="${(e) => this.#onChevronClicked(e, node)}" style="${node.canOpen && node.chevronVisible ? '' : 'visibility: hidden'}">
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
    if (node.isOpened && node.children.length) {
      return html`
      <ul role="group" class="tree-node-children">
        ${node.children.map(child => this.renderNode(child))}
      </ul>
      `
    } else return '';
  }

  renderIcon(node) {
    if (node.iconPath) return html`<img src="${node.iconPath}"/>`;
    return html`${node.isOpened ? '📂' : '📁'}`;
  }

  renderChevron(node) { return html`<div class="chevron ${node.isOpened ? 'open' : "closed"}"></div>` }

  renderContent(node) { return html`${node.title} ${node.showPath ? html`<span class="path">${node.displayPath}</span>` : ``}`; }

}

customElements.define("az-tree-view", TreeView);
