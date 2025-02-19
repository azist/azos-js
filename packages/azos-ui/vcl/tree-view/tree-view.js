/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { TreeNode } from "./tree-node";
import { Control, css, html, parseRank, parseStatus } from "../../ui";
import { isOf, isTrue } from "azos/aver";
import { baseStyles, iconStyles } from "../../parts/styles";

export class TreeView extends Control {

  static #idSeed = 0;
  static styles = [baseStyles, iconStyles, css`
:host { display: block; }

.treeView { user-select: none; }

.treeView, .treeNodeChildren {
  list-style: none;
  padding-left: 1em;
}

.treeNodeHeader {
  cursor: pointer;
  display: flex;
  align-items: baseline;
}

.treeNodeHeader:focus {
  outline: var(--focus-ctl-outline);
  box-shadow: var(--focus-ctl-box-shadow);
}

.treeNodeHeader:hover {
  background-color: #ddd;
}

.treeNodeHeaderContent {
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

.folder {
  --icon-fill-color: brown;
  --icon-stroke-color: brown;
  margin-right: 0.5em;
}

.chevron {
  --icon-fill-color: black;
  --icon-stroke-color: black;
}

.icon{--icon-width: 24px;}
  `];

  static properties = {
    root: { type: TreeNode },
    nodeInFocus: { type: TreeNode },
    showRoot: { type: Boolean },
    _folder: { state: true },
    _folderOpen: { state: true },
  };

  #nodeInFocus;
  #showRoot;
  _chevron = '';
  _chevronClosed = '';
  _folder = '📁';
  _folderOpen = '📂';

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
   * @param {TreeNode} node the node that changed
   * @param {any} eArgs arguments passed to the event via detail
   */
  _dispatchNodeUserActionEvent(node, eArgs) {
    this.dispatchEvent(new CustomEvent("nodeUserAction", { detail: { node, ...eArgs } }));
  }

  /** @param {TreeNode} node */
  get nodeInFocus() { return this.#nodeInFocus; }
  set nodeInFocus(node) {
    isTrue(isOf(node, TreeNode).treeView === this);
    this.#nodeInFocus = node;
  }

  /** @param {boolean} v */
  set showRoot(v) {
    this.#showRoot = v;
    this.root.isVisible = v;
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
    const nodeInFocusIndex = nodes.findIndex(node => node.treeNodeId === this.nodeInFocus?.treeNodeId);
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
    const nodeElement = this.$(`tn${node.treeNodeId}`);
    nodeElement.tabindex = 0;
    nodeElement.focus();
    if (emitEvent) this._dispatchNodeUserActionEvent(node, { action: "focusChanged" });
    if (previousNode?.isVisible) this.$(`tn${previousNode.treeNodeId}`).tabindex = -1;
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
    this._dispatchNodeUserActionEvent(node, { action: "click" });
  }

  #onDoubleClick(e, node) {
    this.#onNodeToggleOpen(e, node);
    this._dispatchNodeUserActionEvent(node, { action: "dblclick" });
  }

  _onKeyDown(e) {
    const { key } = e;
    let preventDefault = true;
    switch (key) {
      case "ArrowUp":
        this.#advanceFocusPrevious();
        break;
      case "ArrowDown":
        this.#advanceFocus();
        break;
      case "ArrowLeft":
        if (this.nodeInFocus.hasChildren && this.nodeInFocus.isOpened) this.#close(this.nodeInFocus);
        else if (this.nodeInFocus.parent)
          if (this.nodeInFocus.parent.isVisible) this.#focusNode(this.nodeInFocus.parent);
          else this.#focusNode(this.nodeInFocus.parent.children[0]);
        break;
      case "ArrowRight":
        if (this.nodeInFocus.hasChildren && this.nodeInFocus.isClosed) this.#open(this.nodeInFocus);
        else if (this.nodeInFocus.hasChildren) this.#advanceFocus(this.nodeInFocus.children[0]);
        break;
      case "Tab":
        this.#advanceFocus(!e.shiftKey);
        break;
      case "Space":
        if (this.nodeInFocus.checkable) {
          this.nodeInFocus.toggleChecked();
          this.dispatchEvent(new CustomEvent("nodeChecked", { detail: { node: this.nodeInFocus } }));
        }
        break;
      default:
        preventDefault = false;
        break;
    }
    if (preventDefault) e.preventDefault();
  }

  async _onTreeFocus(e) {
    await this.updateComplete;
    if (this.nodeInFocus) {
      this.#focusNode(this.nodeInFocus);
      return;
    }
    if (e.target?.treeNodeId) this.$(e.target.treeNodeId).tabindex = -1;
    const visibleNodes = this.getAllVisibleNodes();
    if (!visibleNodes) return;
    this.#focusNode(visibleNodes[0]);
  }

  /**
   * Retrieve all nodes--or return a single node by {@link filterNodeId}--within {@link root}
   * @param {string} filterNodeId the element id ("tn{@link TreeNode.treeNodeId}") by which to filter
   * @param {*} root default {@link this.root}, the node from which to being collecting nodes
   * @returns all nodes from all sub-nodes from {@link root}
   */
  getAllVisibleNodes(filterNodeId, root = this.root) {
    const nodes = [];
    traverseNode(root);
    return filterNodeId ? (nodes.length ? nodes[0] : null) : nodes;

    function traverseNode(node) {
      if (filterNodeId) {
        if (node.treeNodeId === filterNodeId) {
          nodes.push(node);
          return true;
        }
      } else if (node.isVisible) nodes.push(node);
      if ((node.isRoot || (node.isVisible && node.isOpened)) && node.hasChildren) node.children.some(traverseNode);
    }
  }

  closeAllNodes() {
    const visibleNodes = this.getAllVisibleNodes();
    if (visibleNodes.length === 0) return;
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

  connectedCallback() {
    super.connectedCallback();
    this._folder = this.renderIconSpec("svg://azos.ico.folder", "folder");
    this._folderOpen = this.renderIconSpec("svg://azos.ico.folderOpen", "folder");
    this._chevron = this.renderIconSpec("svg://azos.ico.caretRight", "chevron");
    this._chevronClosed = this.renderIconSpec("svg://azos.ico.caretDown", "chevron");
  }

  renderIcon(node) {
    if (node.iconPath === null) return '';
    let icon;
    if (node.iconPath) icon = this.renderIconSpec(node.iconPath);
    else icon = node.isOpened ? this._folderOpen : this._folder; // default when undefined
    return html`<div class="treeNodeIcon">${icon}</div>`;
  }

  renderControl() {
    if (!this.root) return html`<div>No tree data to display.</div>`;
    let cls = `${parseRank(this.rank, true)} ${parseStatus(this.status, true)}`;
    const h = html`
    <ol id="tv${this.treeViewId}" scope="this" part="tree" role="tree" class="${cls} treeView" @keydown="${this._onKeyDown}" tabindex=0 @focus="${this._onTreeFocus}">
      ${this.#showRoot ? this.renderNode(this.root) : this.root.children.map(child => this.renderNode(child))}
    </ol>`;
    return h;
  }

  renderNode(node) {
    return html`
    <li role="treeitem" class="treeNode">
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
    // console.log(node.treeNodeId, this.focusedNode?.treeNodeId);
    return html`
    <div id="tn${node.treeNodeId}"
      class="treeNodeHeader"
      @click=${() => this.#onNodeClicked(node)}
      @dblclick="${(e) => this.#onDoubleClick(e, node)}"
      tabindex="${this.nodeInFocus?.treeNodeId === node.treeNodeId ? 0 : -1}"
      >
      ${this.renderChevron(node)}
      ${this.renderIcon(node)}
      <div class="treeNodeHeaderContent">
        ${this.renderHeaderContent(node)}
      </div>
    </div>
  `;
  }

  renderChildren(node) {
    if (node.isOpened && node.children.length) {
      return html`
      <ol role="group" class="treeNodeChildren">
        ${node.children.map(child => this.renderNode(child))}
      </ol>
      `
    } else return '';
  }

  renderChevron(node) {
    return html`
<div class="treeNodeChevron" @click="${(e) => this.#onChevronClicked(e, node)}" style="${node.canOpen && node.chevronVisible ? '' : 'visibility: hidden'}">
  ${node.isOpened ? this._chevronClosed : this._chevron}
</div>
  `;
  }

  renderHeaderContent(node) { return html`${node.title} ${node.showPath ? html`<span class="path">${node.displayPath}</span>` : ``}`; }

}

customElements.define("az-tree-view", TreeView);
