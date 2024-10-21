/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOf, isOfOrNull, isStringOrNull, isTrue } from "azos/aver";
import { arrayDelete, DESTRUCTOR_METHOD, DisposableObject, DISPOSE_METHOD } from "azos/types";
import { TreeView } from "./tree-view";

export class TreeNode extends DisposableObject {
  static #idSeed = 0;

  #id;
  #title;
  #iconPath;
  #parent;
  #treeView;
  #children;
  #state;
  #checkable;
  #nodeVisible = true;
  #chevronVisible = true;

  #opened;
  #canClose;
  #canOpen;

  #data;

  get id() { return this.#id; }

  get title() { return this.#title; }
  set title(v) { this.#title = v; }

  get iconPath() { return this.#iconPath; }
  set iconPath(v) { this.#iconPath = v; }

  get checked() { return this.#state; }
  get isChecked() { return !!this.#state; }
  set checked(v) { this.#state = v; }

  get checkable() { return this.#checkable; }
  get isCheckable() { return this.#checkable; }
  set checkable(v) { this.#checkable = v; }

  get parent() { return this.#parent; }
  get treeView() { return this.#treeView; }

  get children() { return this.#children; }
  get hasChildren() { return this.#children.length > 0; }

  get isOpened() { return this.#opened; }
  get isClosed() { return !this.#opened; }

  // User-
  get canOpen() { return this.#canOpen; }
  set canOpen(v) { this.#canOpen = v; }
  get canClose() { return this.#canClose; }
  set canClose(v) { this.#canClose = v; }

  get data() { return this.#data; }
  set data(v) { this.#data = v; }

  get isVisible() { return this.#nodeVisible; }
  set isVisible(v) { this.#nodeVisible = v; }

  get chevronVisible() { return this.#chevronVisible; }
  set chevronVisible(v) { this.#chevronVisible = v; }

  get displayPath() {
    if (this.parent && this.parent.displayPath !== "/")
      return `${this.parent.displayPath}/${this.title}`;
    else if (this.title === '/') return "/";
    else return `/${this.title}`;
  }

  get isRoot() { return this.#parent === null; }

  constructor(treeView, parent, title, { iconPath, checkable, canClose, canOpen, nodeVisible, data } = {}) {
    super();
    this.#treeView = isOf(treeView, TreeView);
    this.#parent = isOfOrNull(parent, TreeNode);

    this.#id = TreeNode.#idSeed++;
    this.#title = isStringOrNull(title);
    this.#iconPath = iconPath ?? null;
    this.#checkable = checkable ?? false;
    this.#nodeVisible = nodeVisible ?? true;

    this.#canClose = canClose ?? true;
    this.#canOpen = canOpen ?? true;
    this.#data = data ?? {};
    this.#opened = false;
    this.#children = [];
  }

  [DESTRUCTOR_METHOD]() {
    this.parent.removeChildNode(this);
    this.#parent = null;
    this.#treeView = null;
  }

  toggleChecked() {
    if (!this.#checkable) return;
    this.checked = !this.checked;
  }

  addChild(title, options) {
    const childNode = this.treeView._createNode(this, title, options);
    this.#children.push(childNode);
    return childNode;
  }

  removeChild(childNode) {
    isTrue(isOf(childNode, TreeNode).treeNode === this);
    const removed = arrayDelete(this.#children, childNode);
    if (removed) childNode[DISPOSE_METHOD]();
    return removed;
  }

  close() {
    this.#opened = false;
    this.treeView.requestUpdate();
  }

  open() {
    this.#opened = true;
    this.treeView.requestUpdate();
  }

  hideChevron() {
    this.#chevronVisible = false;
    this.#opened = false;
    this.treeView.requestUpdate();
  }

  showChevron() {
    this.#chevronVisible = true;
    this.treeView.requestUpdate();
  }

}
