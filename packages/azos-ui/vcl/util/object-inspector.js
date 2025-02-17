/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { describeTypeOf, isArray, isNonEmptyString, isNumber, isObject, isObjectOrArray } from "azos/types";
import { TreeView } from "../tree-view/tree-view";
import { css, html, parseRank, parseStatus } from "../../ui";

export class ObjectInspector extends TreeView {
  static properties = {
    doc: { type: Object | Array },
  }

  static styles = [TreeView.styles, css`
.treeNodeHeader{
  align-items: center;
}
.idx, .key{
  padding: 0 0.75em;
  background-color: #d2b48c44;
}
.idx::after, .key::after{content: ":"}
.boolean{color: green}
.number{color: blue}
.string{color: purple}
.array{color: red}
.object{color: orange}
  `];

  #doc = null;
  get doc() { return this.#doc; }
  set doc(doc) {
    this.#doc = doc;
    this.convertObjToTree();
    this.requestUpdate();
  }

  constructor(doc) {
    super();
    this.doc = doc;
  }

  convertObjToTree() {
    if (!this.doc) return;
    this.#populateTree(this.doc);
  }

  #populateTree(doc) {
    console.log(doc);
    this.root.removeAllChildren();
    createChild(null, doc, this.root);
    this.requestUpdate();

    function createChild(key, value, parent) {
      // console.log(...arguments, describeTypeOf(value));
      let node;
      if (key === null) node = parent;
      else {
        const objectOrArray = isObjectOrArray(value);
        const options = {
          canOpen: objectOrArray ? true : false,
          iconPath: null, // {open: svg://azos.ico.folder-open, close: svg://azos.ico.folder-close}
          showPath: false,
          data: {
            key,
            value,
            parent,
          },
        };
        node = parent.addChild(null, options);
      }

      if (isArray(value))
        value.forEach((item, idx) => createChild(idx, item, node));
      else if (isObject(value))
        Object.entries(value).forEach(([k, v]) => createChild(k, v, node));

      return node;
    }
  }

  renderControl() {
    if (!this.root) return html`<div>No tree data to display.</div>`;

    const elmId = `tv${this.treeViewId}`;
    const cls = [
      "treeView",
      parseRank(this.rank, true),
      parseStatus(this.status, true)
    ].filter(isNonEmptyString).join(" ");

    return html`
<ol id="${elmId}" scope="this" part="tree" role="tree" class="${cls}" tabIndex=0 @keydown="${this._onKeyDown}" @focus="${this._onTreeFocus}">
  ${this.showRoot
        ? this.renderNode(this.root)
        : this.root.children.map(child => this.renderNode(child))}
</ol>`;
  }

  renderNode(node) {
    const _isArray = isArray(node.data.value);
    const _isObject = isObject(node.data.value);
    const cls = [
      _isArray && "array",
      _isObject && "object",
    ].filter(isNonEmptyString).join(" ");

    return html`
<li role="treeitem" class="treeNode ${cls}">
  ${this.renderHeader(node)}
  ${this.renderChildren(node)}
</li>
    `;
  }

  renderHeaderContent(node) {
    console.log(node);
    const data = node.data;
    let header = html`<span class="${isNumber(data.key) ? "idx" : "key"}">${data.key}</span>`;

    const valueType = describeTypeOf(data.value);
    // console.log({ key: data.key, value: data.value, typeofValue: typeof data.value });
    switch (valueType) {
      case "object":
        header = html`${header} ${node.isOpened ? "" : "{...}"}`;
        break;
      case "array":
        header = html`${header} ${node.isOpened ? "" : "Array"}(${data.value.length})`;
        break;
      default:
        header = html`${header} <span class="${valueType}">${data.value}</span>`;
    }
    return header;
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

}

customElements.define("az-object-inspector", ObjectInspector);
