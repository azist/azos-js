import { arrayDelete } from "azos/types";
import { TreeNode } from "./tree-node.js";
/**
 * AsyncTreeNode is a specialized TreeNode for displaying a forest structure asynchronously.
 */
export class AsyncTreeNode extends TreeNode {
  #isSelected = false;
  get isSelected() { return this.#isSelected; }
  set isSelected(value) { this.#isSelected = value; }

  #endContent = null;
  get endContent() { return this.#endContent; }
  set endContent(v) { this.#endContent = v; }

  #isLoadingDetails = false;
  get isLoadingDetails() { return this.#isLoadingDetails; }
  set isLoadingDetails(value) { this.#isLoadingDetails = value; }

  constructor(treeView, parent, title, options = {}) {
    super(treeView, parent, title, options);
    this.endContent = options.endContent || null;
  }

  addChild(title, options, nodeClass) {
    const childNode = this.treeView._createNode(this.root, title, options, nodeClass);
    this.children.push(childNode);
    return childNode;
  }

  removeChild(childNode) {
    const removed = arrayDelete(this.children, childNode);
    return removed;
  }

  removeAllChildren() {
    let child;
    for (let i = this.children.length - 1; i >= 0; i--) {//let child of this.#children) {
      child = this.children[i];
      if (child.hasChildren) child.removeAllChildren();
      this.removeChild(child);
    }
  }

  // This method can be overridden to perform actions when a node is selected
  async selected() {}
}
