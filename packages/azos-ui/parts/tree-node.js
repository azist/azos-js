/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isArrayOrNull, isNonEmptyString, isOf } from "azos/aver";

export class TreeNode {
  #caption;
  #img;
  #state;
  #checkable;
  #parent;
  #path;
  #indentLevel;

  #children;
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
  set parent(v) { this.#parent = v; }

  get indentLevel() { return this.#indentLevel; }
  set indentLevel(v) { this.#indentLevel = v; }

  get children() { return this.#children; }

  get expanded() { return this.#expanded; }
  set expanded(v) { this.expand(v); }

  // User-
  get canCollapse() { return this.#canCollapse; }
  get canExpand() { return this.#canExpand; }

  get data() { return this.#data; }

  get path() { return this.#path; }

  constructor(caption, img, indentLevel, checkable = false, parent = null, collapsible = true, children = null, data = null) {
    this.#caption = isNonEmptyString(caption);
    this.#img = img;
    this.#checkable = checkable;
    this.#indentLevel = indentLevel;
    this.#parent = parent;
    this.#path = `${parent ? parent.path : ''}/${this.caption}`;

    this.#canCollapse = collapsible;
    this.#expanded = false;

    this.#data = data;

    isArrayOrNull(children);
    if (children === null) this.#children = [];
    else children.forEach(child => this.addChild(child));
  }

  toggleStatus() {
    if (!this.#checkable) return;
    this.state = !this.state;
    // this.dispatchEvent(new CustomEvent("status", { node: this, isChecked: this.isChecked }));
  }

  addChild(childNode) {
    isOf(childNode, TreeNode);
    childNode.parent = this;
    this.#children.push(childNode);
  }

  removeChild(childNode) {
    isOf(childNode, TreeNode);
    const removed = this.#children.splice(this.#children.indexOf(childNode), 1);
    // TODO: Remove from DOM?
    removed.parent = null;
    return removed?.length >= 1;
  }

  expand(b = true) { this.#expanded = b; }
  collapse() { this.expand(false); }

}
