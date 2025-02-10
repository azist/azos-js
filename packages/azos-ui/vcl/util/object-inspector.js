/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isArray, isNonEmptyString, isObject, isObjectOrArray } from "azos/types";
import { TreeView } from "../tree-view/tree-view";
import { html, parseRank, parseStatus } from "../../ui";

export class ObjectInspector extends TreeView {
  static properties = {
    doc: { type: Object | Array },
  }

  #doc = null;
  get doc() { return this.#doc; }
  set doc(doc) {
    this.#doc = doc;
    this.convertObjToTree();
    this.requestUpdate("root");
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
      let node;
      if (key === null) node = parent;
      else {
        const objectOrArray = isObjectOrArray(value);
        const options = {
          canOpen: objectOrArray ? true : false,
          opened: objectOrArray ? true : false,
          iconPath: null,
          showPath: false,
          data: { key, value, parent },
        };
        const title = key + (objectOrArray ? (isObject(value) ? " {}" : ` [](${value.length})`) : `: ${value}`);
        node = parent.addChild(title, options);
      }
      if (isArray(value)) value.forEach((item, idx) => createChild(`${idx}`, item, node));
      if (isObject(value)) Object.entries(value).forEach(([k, v]) => createChild(k, v, node));
      return node;
    }
  }

  renderControl() {
    if (!this.root) return html`<div>No tree data to display.</div>`;

    const cls = [
      "treeView",
      parseRank(this.rank, true),
      parseStatus(this.status, true)
    ].filter(isNonEmptyString).join(" ");
    const elmId = `tv${this.treeViewId}`;

    return html`
<ol id="${elmId}" scope="this" part="tree" role="tree" class="${cls}" tabIndex=0 @keydown="${this._onKeyDown}" @focus="${this._onTreeFocus}">
  ${this.showRoot
        ? this.renderNode(this.root)
        : this.root.children.map(child => this.renderNode(child))
      }
</ol>
      `;
  }

  renderObject(obj) {

  }

  renderArray(arr) {

  }

  renderPrimitive(prim) {

  }

}

customElements.define("az-object-inspector", ObjectInspector);
