/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOf, isOfOrNull, isStringOrNull, isSubclassOf, isTrue } from "azos/aver";
import { Control, css, html, parseRank, parseStatus, noContent } from "../../ui";
import { Tab } from "./tab";
import { dflt } from "azos/strings";
import { CLOSE_QUERY_METHOD, DIRTY_PROP } from "azos/types";

export class TabView extends Control {

  static styles = css`
:host { display: block; margin-top: 1.0em }

.tab-nav {
  display: flex;
  max-width: 100vw;
}

.tab-nav .scroll-btn {
  cursor: pointer;
  border: var(--s-default-bor-ctl-btn);
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
  position: relative;
}

.tab-nav .scroll-btn:after {
  content: '';
  display: inline-block;
  position: absolute;
  width: 0;
  height: 0;
  top: calc(50% - 4px);
  left: 7px;
  border: 5px solid transparent;
}

.tab-nav .scroll-btn.right:after {
  border-right: 0;
  border-left-color: black;
}

.tab-nav .scroll-btn.left:after {
  border-left: 0;
  border-right-color: black;
}

.tab-view { display: block; }

.tab-btn-container-inner {
  display: inline-flex;
  padding-left: 2ch;
  padding-right: 2ch;
  border-bottom: 2px solid var(--ink2);
}

.tab-btn-container-inner.modern { padding: 0; }

.tab-btn-container {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  scroll-behavior: smooth;
}

.tab-body {
  display: block;
  width: 100%;
  box-sizing: border-box;
}

.tab-btn.active {
  border-bottom-color: black;
  background-color: var(--paper);
}

.modern .tab-btn-container-inner {
  border-bottom: none;
}

.modern .tab-btn {
  border: none;
  border-bottom: 1px solid;
  background: none;
}

.modern .tab-btn.active {
  border-bottom: 3px solid;
  font-weight: bold;
}

.tab-btn.active::after {
  content: '';
  display: block;
  height: 2px;
  width: 100%;
  background-color: var(--paper);
  position: absolute;
  top: 100%;
  left: 0;
}

.modern .tab-btn.active::after { display: none; }
.tab-btn.active .close-ind { pointer-events: auto; }
.tab-btn.dragging { opacity: 0.5; }

.tab-btn.drop-zone:before {
  content: '';
  display: block;
  position: absolute;
  width: 5px;
  height: 80%;
  background-color: var(--s-info-bor-color-ctl);
  bottom: 0;
  opacity: 1;
}

.tab-btn.drop-zone.left:before { left: -5px;}
.tab-btn.drop-zone.right:before { right: -5px; }

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
  border-top: 3px solid var(--ink2);
  border-left: 1px solid var(--ink2);
  border-right: 1px solid var(--ink2);
  transition: font-size 0.1s;
}

.tab-btn:not(.active):not(.isAbsent):hover {
  cursor: pointer;
  filter: brightness(1.05);
}

.tab-icon { margin-right: 0.3em; }

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
    isDraggable: { type: Boolean },
    allowCloseAll: { type: Boolean },
    isModern: { type: Boolean },
  }

  #draggedTabIndex = null;

  get [DIRTY_PROP]() { return this.tabs.some(one => one[DIRTY_PROP]); }
  async [CLOSE_QUERY_METHOD]() {
    for (let one of this.tabs) {
      if (!(await one[CLOSE_QUERY_METHOD]())) return false;
    }
    return true;
  }

  get tabBtns() { return Array.from(this.shadowRoot.querySelectorAll(".tab-btn")) }
  get tabs() { return [...this.children].filter(child => child instanceof Tab); }
  get visibleTabs() { return [...this.children].filter(child => (child.isAbsent || child.isHidden) !== true); }

  #activeTab;
  /** @returns an active tab or undefined */
  get activeTab() { return this.#activeTab; }
  set activeTab(v) {
    if (v === null) {
      this.#activeTab = null;
      this.requestUpdate();
      return;
    }
    isTrue(v instanceof Tab);
    isTrue(v.tabView === this);
    if (this.#activeTab === v) return;
    if (this.dispatchEvent(new CustomEvent("tabChanging", { detail: { tab: v }, bubbles: true, cancelable: true }))) return;

    this.tabs.forEach(one => one.slot = null);
    this.#activeTab = v;
    this.#activeTab.slot = "body";
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent("tabChanged", { detail: { tab: v }, bubbles: true }));
  }

  constructor() {
    super();
    this.allowCloseAll = false;
  }

  async #onScrollTabContainer(scrollToTheRight) {
    const tabContainer = this.shadowRoot.querySelectorAll('.tab-btn-container')[0];
    tabContainer.scrollBy({
      top: 0,
      left: (tabContainer.clientWidth - 100) * (scrollToTheRight ? 1 : -1),
      behavior: 'smooth'
    });
    this.requestUpdate();
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

  async #onCloseTabClick(e, tab) {
    e.stopPropagation();
    await this.closeTab(tab);
  }

  #onDragStart(event, tabIndex) {
    this.#draggedTabIndex = tabIndex;
    const targetTab = event.target;
    targetTab.classList.add("dragging");
  }

  #onDragEnd(event) {
    this.#draggedTabIndex = null;
    event.target.classList.remove("dragging");
  }

  #onDragOver(event) {
    event.preventDefault(); // necessary to allow drop
    const tabIndex = this.#findClosestTabIndex(event.clientX);
    this.#highlightDropZone(tabIndex);
  }

  #onDragDrop(event) {
    event.preventDefault();

    const tabIndex = this.#findClosestTabIndex(event.clientX);
    this.insertBefore(this.visibleTabs[this.#draggedTabIndex], this.visibleTabs[tabIndex]);
    this.#removeHighlight();
    this.requestUpdate();
  }

  #findClosestTabIndex(mouseX) {
    const tabBtns = this.tabBtns;
    let closestTabIndex = null;
    let closestDistance = Infinity, lastDistance = Infinity;
    tabBtns.some((tabBtn, index) => {
      const rect = tabBtn.getBoundingClientRect();
      const tabCenter = rect.left + rect.width / 2;

      const distance = mouseX - tabCenter;

      if (Math.abs(distance) < Math.abs(closestDistance)) {
        closestDistance = distance;
        closestTabIndex = index;
      } else if (Math.abs(distance) > Math.abs(lastDistance)) // getting further away
        return true;
      lastDistance = distance;
    });
    if (closestDistance > 0)
      if (closestTabIndex < tabBtns.length - 1) closestTabIndex++;
      else if (closestTabIndex === tabBtns.length - 1) closestTabIndex = null;
    if (closestTabIndex > tabBtns.length - 1) closestTabIndex = null;
    return closestTabIndex;
  }

  #lastTabIndex;
  #highlightDropZone(tabIndex) {
    if (this.#lastTabIndex === tabIndex) return;
    this.#lastTabIndex = tabIndex;
    this.#removeHighlight();
    if (tabIndex === null)
      this.tabBtns[this.tabBtns.length - 1].classList.add("drop-zone", "right");
    else
      this.tabBtns[tabIndex].classList.add("drop-zone", "left");
  }

  #removeHighlight() { this.tabBtns.forEach(tab => tab.classList.remove("drop-zone", "left", "right")); }

  /**
   * @returns true if tab was unselected
   */
  unselectActiveTab() {
    const ogTab = this.#activeTab;
    let newTab = ogTab.nextTab;

    if (!newTab) newTab = ogTab.previousTab;
    if (!this.allowCloseAll && !newTab) return false;

    this.activeTab = newTab;
    return true;
  }

  /**
   * @param {Tab} tab the tab to move
   * @param {Tab|null} beforeTab the tab to insertBefore, null for "append"
   */
  async moveTab(tab, beforeTab) {
    isTrue(isOf(tab, Tab).tabView === this);
    isOfOrNull(beforeTab, Tab);
    if (beforeTab) isTrue(beforeTab.tabView === this);
    this.insertBefore(tab, beforeTab);
    this.requestUpdate();
    await this.updateComplete;
    if (tab.active) this.#scrollTabBtnIntoView(tab);
  }

  /**
   * @param {Tab} tTab the tab class
   * @param {string} title
   * @param {Tab|null} beforeTab
   */
  addTab(tTab, title, beforeTab = null, makeActive = true) {
    tTab === Tab || isSubclassOf(tTab, Tab);
    isOfOrNull(beforeTab, Tab);
    isStringOrNull(title);

    const existing = this.visibleTabs.filter(tab => tab.title === title)[0];

    let tab;
    if (existing) tab = existing;
    else {
      tab = new tTab();
      tab.title = dflt(title, tTab.name);
      if (beforeTab) isTrue(isOf(beforeTab, Tab).tabView === this);
      this.insertBefore(tab, beforeTab);
    }

    if (!this.#activeTab || makeActive) tab.activate();

    this.requestUpdate();
    return tab;
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

  connectedCallback() {
    super.connectedCallback();
    if (this.tabs.length) {
      this.#activeTab = this.tabs[0];
      this.#activeTab.slot = "body";
    }
  }

  updated() {
    if (!this.tabs.length) return;
    const tabContainerWidth = this.shadowRoot.querySelector('.tab-btn-container').offsetWidth;
    const scrollBtns = this.shadowRoot.querySelectorAll('.scroll-btn');
    const tabBtns = this.shadowRoot.querySelectorAll('.tab-btn');
    let tabBtnsTotalWidth = 0;
    if (tabBtns.length !== 0) tabBtns.forEach((tab) => tabBtnsTotalWidth += tab.offsetWidth);
    scrollBtns.forEach((btn) => btn.style.display = tabBtnsTotalWidth > tabContainerWidth ? 'block' : 'none');
  }

  renderControl() {
    return html`
    <div class="tab-view ${this.isModern ? 'modern' : ''}">
    ${this.tabs.length ? this.renderTabs() : ''}
    ${this.renderBody()}
    </div>
    `;
  }

  renderTabs() {
    const cls = `${parseStatus(this.#activeTab.status, true, '-tab-btn-container')}`;
    return html`
<div class="tab-nav">
  <button class="scroll-btn left" @click="${() => this.#onScrollTabContainer(false)}"></button>
  <div class="tab-btn-container">
    <div class="tab-btn-container-inner ${cls}"
      @dragover="${(e) => this.#onDragOver(e)}"
      @drop="${e => this.#onDragDrop(e)}"
    >
      ${this.tabs.map((tab, index) => {
      const cls = [
        tab.active ? "active" : "",
        tab[DIRTY_PROP] ? "dirty" : "",
        parseRank(tab.rank, true),
        parseStatus(tab.status, true, '-tab-btn'),
        "tab-btn",
      ].filter(item => item !== "").join(" ");

      const stl = [
        tab.minWidth ? `min-width: ${tab.minWidth}ch` : (this.defaultMinTabWidth ? `min-width: ${this.defaultMinTabWidth}ch` : ``),
        tab.maxWidth ? `max-width: ${tab.maxWidth}ch` : (this.defaultMaxTabWidth ? `max-width: ${this.defaultMaxTabWidth}ch` : ``),
        tab.calcStyles(),
      ].filter(item => item !== "").join(";");

      return html`
          <div id="tabBtn${tab.id}" class="${cls}" style="${stl}"
            @click="${e => this.#onTabClick(e, tab)}"
            draggable="${this.isDraggable}"
            @dragstart="${e => this.#onDragStart(e, index)}"
            @dragend="${this.#onDragEnd}"
            >
            ${tab.iconPath ? html`<img class="tab-icon" src="${tab.iconPath}"/>` : noContent}
            <span class="${tab.active ? "active-tab-title" : ""}">${tab.title}</span>
            <span class="dirty-ind">·</span>
            ${tab.canClose ? html`<div class="close-ind" @click="${e => this.#onCloseTabClick(e, tab)}">&times;</div>` : noContent}
          </div>
        `})}
    </div>
  </div>
  <button class="scroll-btn right" @click="${() => this.#onScrollTabContainer(true)}"></button>
</div>
    `;
  }

  renderBody() {
    return html`<div class="tab-body"><slot name="body"></slot></div>`;
  }

}


window.customElements.define("az-tab", Tab);
window.customElements.define("az-tab-view", TabView);
