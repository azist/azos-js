import { TreeNode } from "azos-ui/vcl/tree-view/tree-node";
import { TreeView } from "azos-ui/vcl/tree-view/tree-view";
import { html, css } from "azos-ui/ui";

class CForestNode extends TreeNode {
  #isSelected = false;
  #endContent = null;

  get isSelected() { return this.#isSelected; }
  set isSelected(value) { this.#isSelected = value; }

  get endContent() { return this.#endContent; }
  set endContent(v) { this.#endContent = v; }

  constructor(treeView, parent, title, options = {}) {
    super(treeView, parent, title, options);
    this.endContent = options.endContent || null;
  }
}

class CForestTree extends TreeView {

  #selectedNode = null;
  #prevouslySelectedNode = null;

  get selectedNode() { return this.#selectedNode; }
  set selectedNode(node) {
    if(this.#prevouslySelectedNode) this.#prevouslySelectedNode.isSelected = false;
    this.#prevouslySelectedNode = node;
    this.#selectedNode = node;
    node.isSelected = true;
    this.requestUpdate();
  }

  static styles = [ ...TreeView.styles,
  css`
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
      padding-right: 0.5em;
    }
    .nodeTitle {
      white-space: nowrap;
      font-size: var(--r5-fs);
    }
    .selected .treeNodeHeader {
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
    return node;
  }

  renderHeader(node) {
    let prerender = super.renderHeader(node);
    if(node.isSelected) prerender = html`<span class="selected">${prerender}</span>`;
    return prerender;
  }


  renderHeaderContent(node) {
    const content = [html`<span class="nodeTitle">${node.title}</span>`];
    if(node.showPath) content.push(html`<span class="path">${node.displayPath}</span>`);
    if(node.endContent) content.push(html`<span class="ghostPostfix">${node.endContent}</span>`);
    return content;
  }
}

window.customElements.define("az-cforest-view", CForestTree);
