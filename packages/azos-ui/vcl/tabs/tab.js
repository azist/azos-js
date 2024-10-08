import { isOf } from "azos/aver";
import { TabView } from "./tab-view";
import { Block } from "../../block";
import { html } from "../../ui";

import "../../parts/button";
export class Tab extends Block {
  static properties = {
    active: { type: Boolean, reflect: true },
  };

  get active() { return this === this.tabView.activeTab; }
  get tabView() { return this.parentNode; }

  constructor() {
    super();
  }

  requestUpdate(...args) {
    super.requestUpdate.call(this, ...args);
    this.tabView?.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    isOf(this.parentNode, TabView);
  }

  onClick() {
    alert("Hello!");
  }

  render() {
    // return html`${this.innerHTML}`;
    return html`<slot name="body"></slot>`;
  }


}
