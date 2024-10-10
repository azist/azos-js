import { isOf } from "azos/aver";
import { Block } from "../../block";
import { html } from "../../ui";
import { TabView } from "./tab-view";

import { asBool } from "azos/types";
import "../../parts/button";

export class Tab extends Block {
  static properties = {
    active: { type: Boolean, reflect: true },
    hidden: { type: Boolean, reflect: true },
    minWidth: { type: Number },
    maxWidth: { type: Number },
  };

  #hidden = false;
  get hidden() { return this.#hidden; }
  set hidden(v) {
    v = asBool(v);
    if (this.#hidden === v) return;
    const tabView = this.tabView;
    if (!v) {
      this.#hidden = false;
    } else {
      if (this.active && !(tabView?.unselectActiveTab())) return;
      this.#hidden = true;
    }
    tabView?.requestUpdate();
  }

  get active() { return this === this.tabView.activeTab; }
  get order() { return this.tabView.tabs.findIndex(tab => tab === this); }

  get previousTab() { return this.#getPreviousSibling(false); }
  get previousVisibleTab() { return this.#getPreviousSibling(true); }

  get nextTab() { return this.#getNextSibling(false); }
  get nextVisibleTab() { return this.#getNextSibling(true); }

  #getNextSibling(visibleOnly = true) {
    //FIXME:WIP
    const tabView = this.tabView;
    const totalTabs = tabView.tabs.length;
    const idx = this.order;
    if (idx < 0) return null;
    if (totalTabs === 0) return null;

    let t;
    for (let i = idx + 1; i < totalTabs; i++) {
      t = this.tabView.tabs[i];
      if (visibleOnly && t.hidden === true) continue;
      return t;
    }

    for (let i = 0; i < idx; i++) {
      t = this.tabView.tabs[i];
      if (visibleOnly && t.hidden === true) continue;
      return t;
    }

    return null;
  }

  #getPreviousSibling(visibleOnly = true) {
    //TODO:WIP
    const tabView = this.tabView;
    const totalTabs = tabView.tabs.length;
    const idx = this.order;
    if (idx < 0) return null;
    if (totalTabs === 0) return null;

    let t;
    for (let i = idx - 1; i >= 0; i--) {
      t = this.tabView.tabs[i];
      if (visibleOnly && t.hidden === true) continue;
      return t;
    }

    for (let i = totalTabs - 1; i > idx; i--) {
      t = this.tabView.tabs[i];
      if (visibleOnly && t.hidden === true) continue;
      return t;
    }

    return null;

    // for (let i = 1; i < totalTabs; i++) {
    //   if (next)
    //     index = idx + i;
    //   else
    //     index = idx - i + totalTabs;

    //   index %= totalTabs;
    //   console.log(index);

    //   t = tabView.tabs[index];
    //   if (visibleOnly && t.hidden === true) continue;

    //   return t;
    // }
  }

  get tabView() { return this.parentNode; }

  // get [DIRTY_PROP]() { return true; }

  constructor() { super(); }

  requestUpdate(...args) {
    super.requestUpdate.call(this, ...args);
    this.tabView?.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    isOf(this.parentNode, TabView);
  }

  /** Within the tabView, makes this tab active. */
  activate() { this.tabView.activeTab = this; }

  /** @param {number} stepCount negative for left, positive for right */
  move(stepCount) {
    // FIXME: WIP
    if (stepCount === 0) return; // don't move
    let t = this; // starting element
    let newIdx;
    if (stepCount < 0) { // move left
      stepCount = Math.abs(stepCount);
      while (stepCount-- > 0) t = t.previousVisibleTab;
      newIdx = t.order;
      if (newIdx >= this.tabView.tabs.length - 1) newIdx = null;
    } else { // move right
      while (stepCount-- > 0) t = t.nextVisibleTab;
      newIdx = t.order;
      if (newIdx > this.tabView.tabs.length - 1) newIdx = null;
      if (newIdx !== 0) newIdx += 1;
      if (newIdx > this.tabView.tabs.length - 1) newIdx = null;
    }
    this.tabView.moveTabAtIndex(this.order, newIdx);
  }

  render() { return html`<slot></slot>`; }

}
