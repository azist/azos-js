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
  width: 100%;
  scroll-behavior: smooth;
}

.tab-body {
  display: block;
  width: 100%;
}

.tab-btn.active {
  border-bottom-color: black;
  margin-bottom: -2px;
  padding-top: 0.3em;
  background-color: var(--paper);
  pointer-events: none;
}

.tab-btn.active .close-ind {
  pointer-events: auto;
}

.tab-btn.active .active-tab-title {
  font-size: 1.25em;
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

.tab-btn span {
  transition: all 0.2s, margin-bottom 1ms;
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

  constructor() { super(); }

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
    isOf(v, Tab);
    isTrue(v.tabView === this);
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

  moveTabAtIndex(idx, newIdx) {
    // FIXME: Validate indices
    const before = newIdx === null ? null : this.tabs[newIdx];
    const child = this.tabs[idx];
    this.insertBefore(child, before);
    this.requestUpdate();
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

    if (beforeTab) {
      isTrue(beforeTab.tabView === this);
      this.insertBefore(tab, beforeTab);
    } else {
      this.appendChild(tab);
    }

    this.requestUpdate();
    return tab;
  }

  #onScrollLeft() {
    this.shadowRoot.querySelectorAll('.tab-btn-container')[0].scrollBy({
      top: 0,
      left: -150,
      behavior: 'smooth'
    });
  }

  #onScrollRight() {
    this.shadowRoot.querySelectorAll('.tab-btn-container')[0].scrollBy({
      top: 0,
      left: 150,
      behavior: 'smooth'
    });
  }

  #onTabClick(e, tab) {
    tab.activate();
    const btnBounds = e.currentTarget.getBoundingClientRect();
    const tabContainer = this.shadowRoot.querySelectorAll('.tab-btn-container')[0];
    const tabContainerBounds = tabContainer.getBoundingClientRect();
    console.log(btnBounds, tabContainerBounds);

    if (btnBounds.left < tabContainerBounds.left) {
      tabContainer.scrollBy({
        top: 0,
        left: btnBounds.width * -1,
        behavior: 'smooth'
      });
    }
    if (btnBounds.right > tabContainerBounds.right) {
      tabContainer.scrollBy({
        top: 0,
        left: btnBounds.width,
        behavior: 'smooth'
      })
    }
  }

  #onCloseTabClick(e, tab) {
    e.stopPropagation();
    const sure = confirm("Are you sure?");
    if (!sure) return;
    if (tab.active && (!this.unselectActiveTab())) return;
    this.removeChild(tab);
    this.requestUpdate();
  }

  updated() {
    const tabMenuWidth = this.shadowRoot.querySelector('.tab-btn-container').offsetWidth;
    const scrollBtns = this.shadowRoot.querySelectorAll('.scroll-btn');
    const tabBtns = this.shadowRoot.querySelectorAll('.tab-btn');
    let tabBtnsTotalWidth = 0;
    if (tabBtns.length !== 0) {
      tabBtns.forEach((tab) => {
        tabBtnsTotalWidth = tabBtnsTotalWidth + tab.offsetWidth;
      });
    }
    scrollBtns.forEach((btn) => {
      (tabBtnsTotalWidth > tabMenuWidth) ? btn.style.display = 'block' : btn.style.display = 'none';
    });
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
          <div class="${cls}" @click="${(e) => this.#onTabClick(e, tab)}" style="${stl}">
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
