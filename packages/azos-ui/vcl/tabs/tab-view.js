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

.tab.selected {
  border-bottom: 1px solid white;
}
`;

  get tabs() {
    return [...this.children].filter(child => child instanceof Tab);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.unselectAllTabs();
    this.tabs[0].selected = true;
    this.tabs[0].slot = "body";
  }

  #onTabClick(e) {
    const tabIndex = e.target.dataset.index;
    console.dir(tabIndex);
    this.unselectAllTabs();
    const tab = this.tabs[tabIndex];
    tab.selected = true;
    tab.slot = "body";
    this.requestUpdate();
  }

  unselectAllTabs() {
    this.tabs.forEach(tab => {
      tab.selected = false;
      tab.slot = null;
    });
  }

  render() {
    return html`${this.renderTabs()} ${this.renderBody()}`;
  }

  renderTabs() {
    console.dir(this.tabs);
    return html`
<div class="tab-container" @click="${this.#onTabClick}">
  ${this.tabs.map((tab, index) => html`
    <div class="tab ${tab.selected ? "selected" : ""}" data-index="${index}">${tab.title}</div>
  `)}
</div>
    `;
  }

  renderBody() {
    return html`<slot name="body"></slot>`;
  }

}


window.customElements.define("az-tab", Tab);
window.customElements.define("az-tab-view", TabView);
