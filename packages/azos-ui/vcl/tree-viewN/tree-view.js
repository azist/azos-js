/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { TreeNode } from "./tree-node";
import { Control, css, html, noContent, parseRank, parseStatus } from "../../ui";
import { isOf, isTrue } from "azos/aver";
import { baseStyles, iconStyles } from "../../parts/styles";

export class TreeView extends Control {

  static #sidSeed = 0;
  static styles = [baseStyles, iconStyles, css`
:host { display: block; }
.icon{
  --icon-stroke: var(--vcl-treeview-svg-stroke);
  --icon-stroke-width: var(--vcl-treeview-svg-stroke-width);
  --icon-size: var(--vcl-treeview-svg-size);
  --icon-fill: var(--vcl-treeview-svg-fill);
}

.treeNodeChildren {
  user-select: none;
  list-style: none;
  padding-left: 0;
}
.treeNodeChildren .treeNodeChildren {
  padding-left: var(--vcl-treeview-svg-size);
}

.treeNodeHeader {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.treeNodeHeader:focus {
  outline: var(--focus-ctl-outline);
  outline-offset: -1px;
  box-shadow: var(--focus-ctl-box-shadow);
}

.treeNodeHeader:hover {
  background-color: #ddd;
}

.treeNodeHeaderContent {
  flex: 1;
  display: flex;
  padding-left: 0.5em;
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

.icon.folder{ --icon-stroke: maroon; }
.icon.chevron{ --icon-stroke: black; }



    .path {
      font-size: var(--r5-fs);
      color: var(--ink2);
      font-style: italic;
      margin-left: 0.5em;
    }
    .ghostPostfix {
      font-size: 0.5em;
      width: 100%;
      display: flex;
      justify-content: right;
      opacity: 0.6;
      padding-right: 0.5em;
      padding-top: 0.5lh;
      color: var(--brand1-ink-sup);
    }
    .nodeTitle {
      white-space: nowrap;
      font-size: var(--r3-fs);
    }





    .treeNodeChildren .treeNodeChildren {
      padding-left: 0.8em;
    }

    .selected .treeNodeHeader {
      font-weight: bold;
      color: var(--s-info-fg-ctl);
      background: var(--s-info-bg-ctl);
    }

    .loadAnimation {
      display: inline-block;
      /* animation: spin 0.75s linear infinite; */
      animation: pulseOpacity 0.75s linear infinite;
    }

    @keyframes pulseOpacity {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
   }

    @keyframes spin {
      to { transform: rotate(360deg);
    }

    .loadingNode {
      font-weight: 300;
      color: var(--ghost);
    }

    svg.icon {
      --icon-stroke: var(--vcl-treeview-svg-stroke) !important;
    }

    .loadingNode svg.icon {
      --icon-stroke: var(--ghost) !important;
      --icon-stroke-width: 1px !important;
    }

  `];

  static properties = {
    root: { type: TreeNode },
    nodeInFocus: { type: TreeNode },
    showRoot: { type: Boolean },
    title: { type: String },
    _folder: { state: true },
    _folderOpen: { state: true },
  };

  #nodeInFocus;
  #showRoot;
  _chevron = '';
  _chevronClosed = '';
  _folder = '📁';
  _folderOpen = '📂';

  #previouslySelectedNode = null;
  #selectedNode = null;

  constructor() {
    super();
    this.sid = TreeView.#sidSeed++;
    this.root = this._createNode(null, "/"); // default for rendering's sake
    this.showRoot = false;
  }


  /**
   * Protected factory method creates node of appropriate type for this {@link TreeView} subtype.
   *  Override to create a more specific derivation {@link TreeNode}
   * @param {string} title
   * @param {TreeNode} parent
   * @param {TreeNode} options
   * @param {TreeNode} nodeClass the class of {@link TreeNode} to create, default: {@link TreeNode}
   * @returns
   */
  _createNode(parent, title, options = {}) {
    return new TreeNode(this, parent, title, options);
  }

  get selectedNode() { return this.#selectedNode; }
  set selectedNode(node) {
    if(!node || !node.isSelectable) return;
    if(this.#previouslySelectedNode) this.#previouslySelectedNode.isSelected = false;
    this.#previouslySelectedNode = node;
    this.#selectedNode = node;
    node.isSelected = true;
    this.requestUpdate();
    this.selectedCallback?.(node);
  }

  async selectNode(node){
    this.selectedNode = node;
    this.requestUpdate();
  }

  /**
   * @param {TreeNode} node the node that changed
   * @param {any} eArgs arguments passed to the event via detail
   */
  _dispatchNodeUserActionEvent(node, eArgs) {
    // console.log("TreeView._dispatchNodeUserActionEvent", node, eArgs);
    if(eArgs?.action === "click") this.selectedNode = node;
    if(eArgs?.action === "opened") this.openedCallback?.(node);
    this.dispatchEvent(new CustomEvent("nodeUserAction", { detail: { node, ...eArgs } }))
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

  #onDoubleClick(evt, node) {
    console.log("double click");
    this.#onNodeToggleOpen(node);
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
    this._folder = this.renderImageSpec("svg://azos.ico.folder", { cls: "folder icon", wrapImage: false }).html;
    this._folderOpen = this.renderImageSpec("svg://azos.ico.folderOpen", { cls: "folder icon", wrapImage: false }).html;
    this._chevron = this.renderImageSpec("svg://azos.ico.caretRight", { cls: "chevron icon", wrapImage: false }).html;
    this._chevronClosed = this.renderImageSpec("svg://azos.ico.caretDown", { cls: "chevron icon", wrapImage: false }).html;
  }

  renderIcon(node) {
    if (node.icon === null) return '';
    if (node.icon) return this.renderImageSpec(node.icon, { wrapImage: false }).html;
    else return node.isOpened ? this._folderOpen : this._folder; // default when undefined
  }

  renderControl() {
    let title = noContent;
    if (this.title) title = html`<h2>${this.title}</h2>`;
    if (!this.root) return html`${title}<div>No tree data to display.</div>`;

    let cls = `${parseRank(this.rank, true)} ${parseStatus(this.status, true)}`;
    return html`
${title}
<ol id="tv${this.sid}" scope="this" part="tree" role="tree" class="${cls} treeNodeChildren" @keydown="${this._onKeyDown}" tabindex=0 @focus="${this._onTreeFocus}">
  ${this.#showRoot ? this.renderNode(this.root) : this.root.children.map(child => this.renderNode(child))}
</ol>
    `;
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
    let nodeHtml = html`
      <div id="tn${node.treeNodeId}"
        class="treeNodeHeader"
        @click=${() => this.#onNodeClicked(node)}
        @dblclick="${evt => this.#onDoubleClick(evt, node)}"
        tabindex="${this.nodeInFocus?.treeNodeId === node.treeNodeId ? 0 : -1}"
        >
        ${this.renderChevron(node)}
        <span class="${node.isLoading ? 'loadAnimation' : ''}">${this.renderIcon(node)}</span>
        <div class="treeNodeHeaderContent">
          ${this.renderHeaderContent(node)}
        </div>
      </div>
    `;

    if(node.isLoading) nodeHtml = html`<span class="loadingNode browse">${nodeHtml}</span>`;
    if(node.isSelected) nodeHtml = html`<span class="selected">${nodeHtml}</span>`;
    return nodeHtml;
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

  renderHeaderContent(node) {
    const content = [html`<span class="nodeTitle">${node.title}</span>`];
    if(node.showPath) content.push(html`<span class="path">${node.displayPath}</span>`);
    if(node.endContent) content.push(html`<span class="ghostPostfix">${node.endContent}</span>`);
    return content;
  }

}

customElements.define("az-tree-view-n", TreeView);
