import { html, css } from "azos-ui/ui";
import { TreeNode } from "azos-ui/vcl/tree-view/tree-node";
import { TreeView } from "azos-ui/vcl/tree-view/tree-view";

export class CForestNode extends TreeNode {
  #isRoot = false;
  #isLeaf = false;
  #isBranch = false;
  #isLoading = false;
  #isSelected = false;

  #ghostPostfix = null;

  get isRoot() { return this.#isRoot; }
  set isRoot(value) { this.#isRoot = value; }

  get isLeaf() { return this.#isLeaf; }
  set isLeaf(value) { this.#isLeaf = value; }

  get isBranch() { return this.#isBranch; }
  set isBranch(value) { this.#isBranch = value; }

  get isLoading() { return this.#isLoading; }
  set isLoading(value) { this.#isLoading = value; }

  get isSelected() { return this.#isSelected; }
  set isSelected(value) { this.#isSelected = value; }

  get ghostPostfix() { return this.#ghostPostfix; }
  set ghostPostfix(v) { this.#ghostPostfix = v; }

  constructor(treeView, parent, title, options = {}) {
    super(treeView, parent, title, options);
    this.ghostPostfix = options.ghostPostfix || null;
  }
}

export class CForestTree extends TreeView {
  _globalSelectHook = null;

  #selectedNode = null;
  #prevouslySelectedNode = null;

  set selectHook(fn) { this._globalSelectHook = fn; }

  get selectedNode() { return this.#selectedNode; }
  set selectedNode(node) {
    if(this.#prevouslySelectedNode) this.#prevouslySelectedNode.isSelected = false;
    this.#selectedNode = node;
    node.isSelected = true;
    this.#prevouslySelectedNode = node;
    this._globalSelectHook(node);
    this.requestUpdate();
  }

  static styles = [ ...TreeView.styles,
  css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
    }
    .path {
      font-size: var(--r5-fs);
      color: var(--ink2);
      font-style: italic;
      margin-left: 0.5em;
    }
    .ghostPostfix {
      font-size: var(--r6-fs);
      font-style: italic;
      width: 100%;
      display: flex;
      justify-content: right;
      opacity: 0.6;
    }
    .nodeTitle {
      white-space: nowrap;
      font-size: var(--r5-fs);
    }
    .selected {
      font-weight: bold;
      color: var(--s-info-fg-ctl);
      background: var(--s-info-bg-ctl);
    }
    .treeNodeChildren {
      margin:0;
    }
    .treeNodeChildren .treeNodeChildren {
      padding-left: 0.8em;
    }
  `];

  _createNode(parent, title, options = {}) {
    const node = new CForestNode(this, parent, title, options);
    if (this._globalSelectHook) node.selectHook = this._globalSelectHook;
    return node;
  }

  _dispatchNodeUserActionEvent(node, { action }) {
    super._dispatchNodeUserActionEvent(node, { action });
    if (action === "click" || action === "dblclick") {
      this.selectedNode = node; // set the selected node to the clicked node
      if(node.canOpen && !node.isOpened) node.open();
      if(action === "dblclick" && node.canOpen && node.isOpened) node.close();
    }
  }

  renderHeaderContent(node) {
    const content = [html`<span class="nodeTitle">${node.title}</span>`];
    if(node.showPath) content.push(html`<span class="path">${node.displayPath}</span>`);
    if(node.ghostPostfix) content.push(html`<span class="ghostPostfix">${node.ghostPostfix}</span>`);
    return content;
  }

  renderIcon(node) {
    if(node.isLoading) return this.renderImageSpec("svg://azos.ico.moreHorizontal", { wrapImage: false }).html;
    if(node.isSelected) return this.renderImageSpec("svg://azos.ico.checkmark", { wrapImage: false }).html;
    if(node.isRoot) return this.renderImageSpec("svg://azos.ico.home", { wrapImage: false }).html;
    if(node.isLeaf) return this.renderImageSpec("svg://azos.ico.draft", { wrapImage: false }).html;
    if(node.isBranch && node.isOpened) return this.renderImageSpec("svg://azos.ico.folderOpen", { wrapImage: false }).html;
    if(node.isBranch && !node.isOpened) return this.renderImageSpec("svg://azos.ico.folder", { wrapImage: false }).html;
    return this.renderImageSpec("svg://azos.ico.moreHorizontal", { wrapImage: false }).html;
  }
}

window.customElements.define("az-cforest-view", CForestTree);
