import { AzosElement, css, html } from "../../ui";
import { Tab } from "./tab";

export class TabView extends AzosElement {
  static styles = css`
.tab-container {
  border-bottom: 1px solid;
  display: inline-flex;
}

.tab {
  padding: 1em 3em;
  margin-bottom: -1px;
  margin-left: 0.25em;
  margin-right: 0.25em;
  border: 1px solid;
  border-radius: 10px 10px 0 0;
  user-select: none;
}

.tab.alert {
  border-color:
}

.tab:hover {
  cursor: pointer;
}

.tab.active {
  border-bottom: 1px solid var(--paper);
}
`;

  constructor() {
    super();
  }

  get tabs() {
    return [...this.children].filter(child => child instanceof Tab);
  }

  #activeTab;
  get activeTab() { return this.#activeTab; }

  connectedCallback() {
    super.connectedCallback();
    this.#activeTab = this.tabs[0];
    this.#activeTab.slot = "body";
  }

  #onTabClick(e) {
    this.tabs.forEach(tab => tab.slot = null);
    const tabIndex = e.target.dataset.index;
    const tab = this.tabs[tabIndex];
    this.#activeTab = tab;
    this.#activeTab.slot = "body";
    this.requestUpdate();
  }

  render() {
    return html`${this.renderTabs()} ${this.renderBody()}`;
  }

  renderTabs() {
    console.dir(this.tabs);
    return html`
<div class="tab-container" @click="${this.#onTabClick}">
  ${this.tabs.map((tab, index) => {
      const cls = tab.active ? "active" : "";
      return html`
      <div class="tab ${cls}" data-index="${index}">${tab.title}</div>
    `})}
</div>
    `;
  }

  renderBody() {
    return html`<slot name="body"></slot>`;
  }

}


window.customElements.define("az-tab", Tab);
window.customElements.define("az-tab-view", TabView);
