import { isOf, isOfOrNull, isStringOrNull, isSubclassOf, isTrue } from "azos/aver";
import { AzosElement, css, html, parseRank, parseStatus } from "../../ui";
import { Tab } from "./tab";
import { dflt } from "azos/strings";
import { CLOSE_QUERY_METHOD, DIRTY_PROP } from "azos/types";

export class TabView extends AzosElement {

  static #idSeed = 0;
  static styles = css`
:host {
  --my-color: #989898;
}

.hidden { display: none !important; }

.tab-nav {
  display: flex;
  align-items: baseline;
  max-width: 100vw;
}

.tab-nav .scroll-btn {
  border: none;
  padding: 1em .5em;
  cursor: pointer;
}

.tab-view {
  display: block;
}

.tab-btn-container-inner {
  display: inline-flex;
  padding-left: 2ch;
  padding-right: 2ch;
  border-bottom: 2px solid var(--my-color);
}

.tab-btn-container {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  scroll-behavior: smooth;
}

.tab-body {
  display: block;
  width: 100%;
}

.tab-btn.active {
  border-bottom-color: black;
  background-color: var(--paper);
  pointer-events: none;
}

.tab-btn.active:after {
  content: '';
  display: block;
  height: 2px;
  width: 100%;
  background-color: var(--paper);
  position: absolute;
  top: 100%;
  left: 0;
}

.tab-btn.active .close-ind {
  pointer-events: auto;
}

.tab-btn {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.3em 1em;
  margin-left: 0.1em;
  margin-right: 0.1em;
  line-height: 1.25em;
  background-color: var(--paper2);
  color: var(--ink);
  border-radius: 0.4em 0.4em 0 0;
  user-select: none;
  border-top: 3px solid var(--my-color);
  border-left: 1px solid var(--my-color);
  border-right: 1px solid var(--my-color);
  transition: font-size 0.1s;
}

.tab-btn:not(.active):not(.hidden):hover {
  cursor: pointer;
  filter: brightness(1.05);
}

.dirty-ind {
  font-weight: bold;
  padding-left: 0.25em;
}

.close-ind {
  position: absolute;
  padding: 5px;
  padding-top: 0;
  top: 0;
  right: 0;
}

.tab-btn:not(.dirty) .dirty-ind {display: none;}

.r1 { font-size: var(--r1-fs);}
.r2 { font-size: var(--r2-fs);}
.r3 { font-size: var(--r3-fs);}
.r4 { font-size: var(--r4-fs);}
.r5 { font-size: var(--r5-fs);}
.r6 { font-size: var(--r6-fs);}

.ok-tab-btn-container { border-bottom-color: var(--s-ok-bor-color-ctl); }
.info-tab-btn-container { border-bottom-color: var(--s-info-bor-color-ctl); }
.warning-tab-btn-container { border-bottom-color: var(--s-warn-bor-color-ctl); }
.alert-tab-btn-container { border-bottom-color: var(--s-alert-bor-color-ctl); }
.error-tab-btn-container { border-bottom-color: var(--s-error-bor-color-ctl); }

.ok-tab-btn { color: var(--s-ok-fg-ctl);  border-color: var(--s-ok-bor-color-ctl);}
.info-tab-btn { color: var(--s-info-fg-ctl); border-color: var(--s-info-bor-color-ctl);}
.warning-tab-btn { color: var(--s-warn-fg-ctl); border-color: var(--s-warn-bor-color-ctl);}
.alert-tab-btn { color: var(--s-alert-fg-ctl); border-color: var(--s-alert-bor-color-ctl);}
.error-tab-btn { color: var(--s-error-fg-ctl); border-color: var(--s-error-bor-color-ctl);}
`;

  static properties = {
    defaultMinTabWidth: { type: Number },
    defaultMaxTabWidth: { type: Number },
  }

  get [DIRTY_PROP]() { return this.tabs.some(one => one[DIRTY_PROP]); }
  async [CLOSE_QUERY_METHOD]() {
    for (let one of this.tabs) {
      if (!(await one[CLOSE_QUERY_METHOD]())) return false;
    }
    return true;
  }

  get tabs() { return [...this.children].filter(child => child instanceof Tab); }
  get visibleTabs() { return [...this.children].filter(child => child.hidden !== true); }

  #activeTab;
  /** @returns an active tab or undefined */
  get activeTab() { return this.#activeTab; }
  set activeTab(v) {
    isTrue(isOf(v, Tab).tabView === this);
    if (this.#activeTab === v) return;
    const evt = new CustomEvent("tabChanging", { detail: { tab: v }, bubbles: true, cancelable: true });
    this.dispatchEvent(evt);
    if (evt.canceled) return;
    this.tabs.forEach(one => one.slot = undefined);
    this.#activeTab = v;
    this.#activeTab.slot = "body";
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent("tabChanged", { detail: { tab: v }, bubbles: true }));
  }

  constructor() { super(); }

  /**
   * @returns true if tab was unselected
   */
  unselectActiveTab() {
    const ogTab = this.#activeTab;
    let newTab = ogTab.nextTab;

    if (!newTab) newTab = ogTab.previousTab;
    if (!newTab) return false;

    this.activeTab = newTab;
    return true;
  }

  async moveTab(tab, beforeTab) {
    isTrue(isOf(tab, Tab).tabView === this);
    isOfOrNull(beforeTab, Tab);
    if (beforeTab) isTrue(beforeTab.tabView === this);
    this.insertBefore(tab, beforeTab);
    this.requestUpdate();
    await this.updateComplete;
    if (tab.active) this.#scrollTabBtnIntoView(tab);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.tabs.length) {
      this.#activeTab = this.tabs[0];
      this.#activeTab.slot = "body";
    }
  }

  /**
   * @param {Tab} tTab the tab class
   * @param {string} title
   * @param {string|null} id
   * @param {Tab|null} beforeTab
   */
  addTab(tTab, title, id = null, beforeTab = null) {
    tTab === Tab || isSubclassOf(tTab, Tab);
    isOfOrNull(beforeTab, Tab);
    isStringOrNull(title);
    isStringOrNull(id);

    const tab = new tTab();
    tab.id = id ?? `tab-${++TabView.#idSeed}`;
    tab.title = dflt(title, tTab.name);

    if (beforeTab) isTrue(isOf(beforeTab, Tab).tabView === this);
    this.insertBefore(tab, beforeTab);

    this.requestUpdate();
    return tab;
  }

  #onScrollLeft() {
    this.shadowRoot.querySelectorAll('.tab-btn-container')[0].scrollBy({
      top: 0,
      left: -300,
      behavior: 'smooth'
    });
  }

  #onScrollRight() {
    this.shadowRoot.querySelectorAll('.tab-btn-container')[0].scrollBy({
      top: 0,
      left: 300,
      behavior: 'smooth'
    });
  }

  #onTabClick(e, tab) {
    tab.activate();
    this.#scrollTabBtnIntoView(tab);
  }

  #scrollTabBtnIntoView(tab) {
    isOf(tab, Tab);
    const tabBtn = this.shadowRoot.getElementById(`tabBtn${tab.id}`);
    const btnBounds = tabBtn.getBoundingClientRect();
    const tabContainer = this.shadowRoot.querySelectorAll('.tab-btn-container')[0];
    const tabContainerBounds = tabContainer.getBoundingClientRect();


    let left;
    if (btnBounds.left < tabContainerBounds.left) {
      const previousBtn = tabBtn.previousElementSibling;
      const previousBtnBounds = previousBtn?.getBoundingClientRect() || null;
      left = btnBounds.left - tabContainerBounds.left - (previousBtnBounds ? previousBtnBounds.width / 1.5 : 20);
    } else if (btnBounds.right > tabContainerBounds.right) {
      const nextBtn = tabBtn.nextElementSibling;
      const nextBtnBounds = nextBtn?.getBoundingClientRect() || null;
      left = btnBounds.right - tabContainerBounds.right + (nextBtnBounds ? nextBtnBounds.width / 1.5 : 20);
    }
    tabContainer.scrollBy({
      top: 0,
      left,
      behavior: 'smooth'
    });
  }

  /**
   * Emits "closing" if !force, "closed" if closed.
   * @param {boolean} force true to bypass dirty checks, etc
   * @returns true if tab closed
   */
  async closeTab(tab, force = false) {
    if (!force) {
      if (!await tab[CLOSE_QUERY_METHOD]()) return false;
      this.dispatchEvent(new CustomEvent("tabClosing", { detail: { tab }, cancelable: true, bubbles: true }));
    }
    if (tab.active && !this.unselectActiveTab()) return false;
    this.dispatchEvent(new CustomEvent("tabClosed", { detail: { tab }, cancelable: false, bubbles: true }));
    this.removeChild(tab);
    // TODO: needed? if (removed) tab[DISPOSE_METHOD]();
    this.requestUpdate();
  }

  async #onCloseTabClick(e, tab) {
    e.stopPropagation();
    await this.closeTab(tab);
  }

  updated() {
    const tabContainerWidth = this.shadowRoot.querySelector('.tab-btn-container').offsetWidth;
    const scrollBtns = this.shadowRoot.querySelectorAll('.scroll-btn');
    const tabBtns = this.shadowRoot.querySelectorAll('.tab-btn');
    let tabBtnsTotalWidth = 0;
    if (tabBtns.length !== 0) tabBtns.forEach((tab) => tabBtnsTotalWidth += tab.offsetWidth);
    scrollBtns.forEach((btn) => btn.style.display = tabBtnsTotalWidth > tabContainerWidth ? 'block' : 'none');
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
    const cls = `${parseStatus(this.#activeTab.status, true, '-tab-btn-container')}`;
    return html`
<div class="tab-nav">
  <button class="scroll-btn" @click="${this.#onScrollLeft}">&lt;</button>
  <div class="tab-btn-container">
    <div class="tab-btn-container-inner ${cls}">
      ${this.tabs.map(tab => {
      const cls = [
        tab.active ? "active" : "",
        tab.hidden ? "hidden" : "",
        tab[DIRTY_PROP] ? "dirty" : "",
        parseRank(tab.rank, true),
        parseStatus(tab.status, true, '-tab-btn'),
        "tab-btn",
      ].filter(item => item !== "").join(" ");

      const stl = [
        tab.minWidth ? `min-width: ${tab.minWidth}ch` : (this.defaultMinTabWidth ? `min-width: ${this.defaultMinTabWidth}ch` : ``),
        tab.maxWidth ? `max-width: ${tab.maxWidth}ch` : (this.defaultMaxTabWidth ? `max-width: ${this.defaultMaxTabWidth}ch` : ``),
      ].filter(item => item !== "").join(";");

      return html`
          <div id="tabBtn${tab.id}" class="${cls}" @click="${(e) => this.#onTabClick(e, tab)}" style="${stl}">
            <span class="${tab.active ? "active-tab-title" : ""}">${tab.title}</span>
            <span class="dirty-ind">·</span>
            <div class="close-ind" @click="${e => this.#onCloseTabClick(e, tab)}">&times;</div>
          </div>
        `})}
    </div>
  </div>
  <button class="scroll-btn" @click="${this.#onScrollRight}">&gt;</button>
</div>
    `;
  }

  renderBody() {
    return html`<div class="tab-body"><slot name="body"></slot></div>`;
  }

}


window.customElements.define("az-tab", Tab);
window.customElements.define("az-tab-view", TabView);
