import { isStringOrNull, isSubclassOf } from "azos/aver";
import { AzosElement, css, html, parseRank, parseStatus } from "../../ui";
import { Tab } from "./tab";
import { dflt } from "azos/strings";

export class TabView extends AzosElement {
  static #idSeed = 0;
  static styles = css`
  :host {
    --my-color: #989898;
  }
.tab-view {
  width: 100%;
  display: block;
}

.tab-container {
  display: inline-flex;
  padding-left: 2ch;
  padding-right: 2ch;
  border-bottom: 2px solid var(--my-color);
}

.tab-body {
  display: block;
  width: 100%;
  padding: 0.3em;
}

.tab.active {
  border-bottom-color: black;
  margin-bottom: -2px;
  background-color: var(--paper);
}

.active-tab-title {
  font-size: 1.25em;
}

.tab {
  display: flex;
  align-items: center;
  padding: 0.3em 1em;
  margin-left: 0em;
  margin-right: .2em;
  background-color: var(--paper2);
  color: var(--ink);
  border-radius: 0.4em 0.4em 0 0;
  user-select: none;
  border-top: 0.2em solid var(--my-color);
  border-left: 0.1em solid var(--my-color);
  border-right: 0.1em solid var(--my-color);
}

.tab span {
  transition: all 0.2s;
  text-align: center;
}

.tab:hover {
  cursor: pointer;
}

.r1 { font-size: var(--r1-fs);}
.r2 { font-size: var(--r2-fs);}
.r3 { font-size: var(--r3-fs);}
.r4 { font-size: var(--r4-fs);}
.r5 { font-size: var(--r5-fs);}
.r6 { font-size: var(--r6-fs);}

.ok-tab-container { border-bottom-color: var(--s-ok-bor-color-ctl); }
.info-tab-container { border-bottom-color: var(--s-info-bor-color-ctl); }
.warning-tab-container { border-bottom-color: var(--s-warn-bor-color-ctl); }
.alert-tab-container { border-bottom-color: var(--s-alert-bor-color-ctl); }
.error-tab-container { border-bottom-color: var(--s-error-bor-color-ctl); }

.ok-tab      { color: var(--s-ok-fg-ctl);  border-color: var(--s-ok-bor-color-ctl);}
.info-tab    { color: var(--s-info-fg-ctl); border-color: var(--s-info-bor-color-ctl);}
.warning-tab { color: var(--s-warn-fg-ctl); border-color: var(--s-warn-bor-color-ctl);}
.alert-tab   { color: var(--s-alert-fg-ctl); border-color: var(--s-alert-bor-color-ctl);}
.error-tab   { color: var(--s-error-fg-ctl); border-color: var(--s-error-bor-color-ctl);}
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

  /**
   *
   * @param {Tab} tTab the tab class
   * @param {string} title
   * @param {string|null} id
   * @param {number|null} order
   */
  addTab(tTab, title, id = null, order = -1) {
    tTab === Tab || isSubclassOf(tTab, Tab);
    isStringOrNull(title);
    isStringOrNull(id);
    const tab = new tTab();
    tab.id = id ?? `tab-${++TabView.#idSeed}`;
    tab.title = dflt(title, tTab.name);
    // tab.tabView = this;
    this.appendChild(tab);
    this.requestUpdate();
    return tab;
  }

  #onTabClick(tab) {
    this.tabs.forEach(one => one.slot = null);
    this.#activeTab = tab;
    this.#activeTab.slot = "body";
    this.requestUpdate();
  }

  render() {
    return html`
    <div class="tab-view">
    ${this.renderTabs()}
    ${this.renderBody()}
    </div>
    `;
  }

  renderTabs() {
    const cls = `${parseStatus(this.#activeTab.status, true, '-tab-container')}`;
    return html`
<div class="tab-container ${cls}">
  ${this.tabs.map(tab => {
      const cls = `${parseRank(tab.rank, true)} ${parseStatus(tab.status, true, '-tab')} ${tab.active ? "active" : ""}`;
      return html`
      <div class="${cls} tab" @click="${() => this.#onTabClick(tab)}"><span class="${tab.active ? "active-tab-title" : ""}">${tab.title}</span></div>
    `})}
</div>
    `;
  }

  renderBody() {
    return html`<div class="tab-body"><slot name="body"></slot></div>`;
  }

}


window.customElements.define("az-tab", Tab);
window.customElements.define("az-tab-view", TabView);
