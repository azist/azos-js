/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
import { CLOSE_QUERY_METHOD } from "azos/types";

import { Block } from "../../blocks";
import { html } from "../../ui";
import { TabView } from "./tab-view";

import "../../parts/button";

export class Tab extends Block {
  static #sidSeed = 0;

  static properties = {
    active: { type: Boolean, reflect: true },
    minWidth: { type: Number },
    maxWidth: { type: Number },
    canClose: { type: Boolean },
    icon: { type: String },
    slot: { type: String, reflect: true },
    data: { type: Object },
  };

  [CLOSE_QUERY_METHOD]() {
    return this.canClose;
  }

  #sid;
  get sid() { return this.#sid; }

  #icon;
  get icon() { return this.#icon; }
  set icon(v) { this.#icon = v; }

  #canClose = true;
  get canClose() { return this.#canClose; }
  set canClose(v) { this.#canClose = v; }

  get active() { return this === this.tabView.activeTab; }
  get order() { return this.tabView.tabs.findIndex(tab => tab === this); }

  get previousTab() { return this.#getPreviousSibling(false); }
  get previousVisibleTab() { return this.#getPreviousSibling(true); }

  get nextTab() { return this.#getNextSibling(false); }
  get nextVisibleTab() { return this.#getNextSibling(true); }

  #getNextSibling(visibleOnly = true) {
    const tabView = this.tabView;
    const totalTabs = tabView.tabs.length;
    const idx = this.order;
    if (idx < 0) return null;
    if (totalTabs === 0) return null;

    let t;
    for (let i = idx + 1; i < totalTabs; i++) {
      t = this.tabView.tabs[i];
      if (visibleOnly && t.isAbsent === true) continue;
      return t;
    }
    return null;
  }

  #getPreviousSibling(visibleOnly = true) {
    const tabView = this.tabView;
    const totalTabs = tabView.tabs.length;
    const idx = this.order;
    if (idx < 0) return null;
    if (totalTabs === 0) return null;

    let t;
    for (let i = idx - 1; i >= 0; i--) {
      t = this.tabView.tabs[i];
      if (visibleOnly && t.isAbsent === true) continue;
      return t;
    }
    return null;
  }

  get tabView() { return this.parentNode; }

  constructor(title, data) {
    super();
    // It is possible to construct via markup, so these could be undefined
    if (title) this.title = aver.isNonEmptyString(title);
    if (data) this.data = data;
    this.#sid = ++Tab.#sidSeed;
  }

  requestUpdate(...args) {
    super.requestUpdate.call(this, ...args);
    if (this.tabView?.requestUpdate) this.tabView.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    aver.isOf(this.parentNode, TabView);
  }

  /** Within the tabView, makes this tab active. */
  activate() { this.tabView.activeTab = this; }

  /** Within the tabView, closes this tab and discards it. */
  async close(force = false) { return this.tabView.closeTab(this, force); }

  /** @param {number} stepCount negative for left, positive for right */
  move(stepCount, visibleOnly = true) {
    if (stepCount === 0) return;

    const tabs = visibleOnly ? this.tabView.visibleTabs : this.tabView.tabs;
    const currentIndex = this.order;
    const count = tabs.length;

    let newIndex = currentIndex + stepCount;

    if (newIndex < 0) return;
    if (newIndex > count - 1) return;

    let beforeTab;
    if (newIndex === count - 1) beforeTab = null;
    else if (newIndex === 0) beforeTab = tabs[0];
    else {
      if (stepCount < 0 && newIndex !== 0) newIndex -= 1
      beforeTab = tabs[newIndex].nextElementSibling;
    }

    this.tabView.moveTab(this, beforeTab);
  }

  /**
   * This method is called when the tab is activated, i.e. when it becomes the active tab in the TabView.
   * It can be overridden in subclasses to perform actions when the tab is activated.
   * By default, it dispatches an "activated" event for use with an adhoc az-tab application.
   */
  _doAfterActivated() {
    this.dispatchEvent(new Event("activated"));
  }

  renderControl() { return html`<slot></slot>`; }
}
