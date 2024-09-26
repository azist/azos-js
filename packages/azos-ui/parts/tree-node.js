/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isNonEmptyString, isOf } from "azos/aver";

export class TreeNode {
  #caption;
  #img;
  #parent;
  #children;
  #state;
  #checkable;
  #path;
  #chevronVisible = true;

  #expanded;
  #canCollapse;
  #canExpand;

  #data;

  get caption() { return this.#caption; }
  set caption(v) { this.#caption = v; }

  get img() { return this.#img; }
  set img(v) { this.#img = v; }

  get state() { return this.#state; }
  get isChecked() { return !!this.#state; }
  set state(v) { this.#state = v; }

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

  get expanded() { return this.#expanded; }
  get isExpanded() { return this.#expanded; }
  set expanded(v) { this.expand(v); }

  // User-
  get canCollapse() { return this.#canCollapse; }
  get canExpand() { return this.#canExpand; }

  get data() { return this.#data; }
  set data(v) { this.#data = v; }

  get chevronVisible() { return this.#chevronVisible; }
  set chevronVisible(v) { this.#chevronVisible = v; }

  get path() { return this.#path; }

  constructor(caption, img, parent = null, checkable = false, collapsible = true, expandable = true) {
    this.caption = isNonEmptyString(caption);
    this.img = img;
    this.parent = parent;
    this.#updatePath();
    this.checkable = checkable;

    this.#canCollapse = collapsible;
    this.#canExpand = expandable;
    this.expanded = false;
    this.#children = [];
  }

  toggleStatus() {
    if (!this.#checkable) return;
    this.state = !this.state;
  }

  addChild(caption, img, checkable = false, collapsible = true, expandable = true, data = null) {
    const childNode = new TreeNode(caption, img, this, checkable, collapsible, expandable);
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

  expand(b = true) { this.#expanded = b; }
  collapse() { this.expand(false); }

  hideChevron() { this.#chevronVisible = false; }
  showChevron() { this.#chevronVisible = true; }

}
