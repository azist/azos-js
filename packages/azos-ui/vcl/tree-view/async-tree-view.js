import { html, css } from "../../ui.js";
import { AsyncTreeNode } from "./async-tree-node.js";
import { TreeView } from "./tree-view.js";
/**
 * AsyncTreeView is a specialized TreeView for displaying a forest structure asynchronously.
 */
export class AsyncTreeView extends TreeView {

  static properties = {
    ...TreeView.properties,
    settings: { type: Object },
  }


  #prevouslySelectedNode = null;
  #selectedNode = null;
  get selectedNode() { return this.#selectedNode; }
  set selectedNode(node) {
    if(!node) return;
    if(this.#prevouslySelectedNode) this.#prevouslySelectedNode.isSelected = false;
    this.#prevouslySelectedNode = node;
    this.#selectedNode = node;
    node.isSelected = true;
    node.selected();
    this.selectedCallback(node);
    this.requestUpdate();
  }

  async selectNode(node) {
    this.selectedNode = node;
  }

  #client = null;
  get client() { return this.#client; }
  set client(value) {
    this.#client = value;
    this.requestUpdate();
  }

  #selectedCallback = null;
  get selectedCallback() { return this.#selectedCallback; }
  set selectedCallback(value) { this.#selectedCallback = value; }

  #settings = null;
  get settings() { return this.#settings; }
  set settings(value) {
    this.#settings = value;
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
      font-size: var(--r3-fs);
    }
    .selected .treeNodeHeader {
      font-weight: bold;
      color: var(--s-info-fg-ctl);
      background: var(--s-info-bg-ctl);
    }
    .treeNodeChildren {

    }
    .treeNodeChildren .treeNodeChildren {
      padding-left: 0.8em;
    }

    svg.icon {
      --icon-stroke: var(--vcl-treeview-svg-stroke) !important;
    }
  `];

  _createNode(parent, title, options = {}, nodeClass = AsyncTreeNode) {
    return new nodeClass(this, parent, title, options);
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

  /**
   * Dispatches a custom event when a user action occurs on a node.
   * This method is used to handle user interactions with nodes, such as clicks or opens.
   * It allows for custom actions to be performed based on the node and the event type.
   * @param {TreeNode} node the node that changed
   * @param {Object} eArgs arguments passed to the event via detail
   * @returns {void}
   */
  _dispatchNodeUserActionEvent(node, eArgs) {
    if(eArgs?.action === "click") {
      this.selectedNode = node;
    }

    this.dispatchEvent(new CustomEvent("nodeUserAction", { detail: { node, ...eArgs } }))
  }
}

customElements.define("az-async-tree-view", AsyncTreeView);
