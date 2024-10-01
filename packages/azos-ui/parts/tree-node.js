/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isNonEmptyString, isOf } from "azos/aver";
import { genGuid } from "azos/types";

export class TreeNode {
  #guid;
  #caption;
  #img;
  #parent;
  #children;
  #state;
  #checkable;
  #path;
  #chevronVisible = true;

  #opened;
  #canClose;
  #canOpen;

  #data;

  get guid() { return this.#guid; }

  get caption() { return this.#caption; }
  set caption(v) { this.#caption = v; }

  get img() { return this.#img; }
  set img(v) { this.#img = v; }

  get checked() { return this.#state; }
  get isChecked() { return !!this.#state; }
  set checked(v) { this.#state = v; }

  get checkable() { return this.#checkable; }
  get isCheckable() { return this.#checkable; }
  set checkable(v) { this.#checkable = v; }

  get parent() { return this.#parent; }
  set parent(v) {
    this.#parent = v;
    this.#updatePath();
  }

  get children() { return this.#children; }
  get hasChildren() { return this.#children.length > 0; }

  get opened() { return this.#opened; }
  get isOpened() { return this.#opened; }
  get isClosed() { return !this.isOpened; }
  set opened(v) { this.open(v); }

  // User-
  get canOpen() { return this.#canOpen; }
  get canClose() { return this.#canClose; }

  get data() { return this.#data; }
  set data(v) { this.#data = v; }

  get chevronVisible() { return this.#chevronVisible; }
  set chevronVisible(v) { this.#chevronVisible = v; }

  get path() { return this.#path; }

  constructor(caption, img, parent = null, canOpen = true, canClose = true, checkable = false) {
    this.#guid = genGuid();
    this.caption = isNonEmptyString(caption);
    this.img = img;
    this.parent = parent;
    this.#updatePath();
    this.checkable = checkable;

    this.#canClose = canClose;
    this.#canOpen = canOpen;
    this.opened = false;
    this.#children = [];
  }

  toggleChecked() {
    if (!this.#checkable) return;
    this.checked = !this.checked;
  }

  addChild(caption, img, canOpen = true, canClose = true, checkable = false, data = null) {
    const childNode = new TreeNode(caption, img, this, canOpen, canClose, checkable);
    childNode.data = data;
    this.#children.push(childNode);
    return childNode;
  }

  removeChild(childNode) {
    isOf(childNode, TreeNode);
    const removed = this.#children.splice(this.#children.indexOf(childNode), 1);
    removed.parent = null;
    return removed?.length >= 1;
  }

  #updatePath() {
    if (this.parent && this.parent.path !== "/") this.#path = `${this.parent.path}/${this.caption}`;
    else if (this.caption === '/') this.#path = "/";
    else this.#path = `/${this.caption}`;
  }

  open(b = true) { this.#opened = b; }
  close() { this.open(false); }

  hideChevron() { this.#chevronVisible = false; }
  showChevron() { this.#chevronVisible = true; }

}
