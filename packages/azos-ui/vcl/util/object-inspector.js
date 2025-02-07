/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isArray, isObject, isObjectOrArray } from "azos/types";
import { TreeView } from "../tree-view/tree-view";

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

}

customElements.define("az-object-inspector", ObjectInspector);
