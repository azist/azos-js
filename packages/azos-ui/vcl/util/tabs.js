/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AzosElement, css, html, verbatimHtml, parseRank, parseStatus } from "../../ui";

/** Provides code display functionality with optional syntax highlighting */
export class Tabs extends AzosElement {

  static styles = css`
  .r1 { font-size: var(--r1-fs);}
  .r2 { font-size: var(--r2-fs);}
  .r3 { font-size: var(--r3-fs);}
  .r4 { font-size: var(--r4-fs);}
  .r5 { font-size: var(--r5-fs);}
  .r6 { font-size: var(--r6-fs);}

  .tabNav{
    display:flex;
    align-items:center;
    overflow:hidden;
    user-select: none;
    -webkit-user-select: none;
  }
  .scrollBtn{
    background-color:var(--paper);
    color:var(--ink);
    border:none;
    padding:1em .5em;
    cursor:pointer;
    font-size:.75em;
  }
  .tabBtns{
    overflow-x:auto;
    white-space:nowrap;
    scroll-behavior:smooth;
  }
  .tabBtns::-webkit-scrollbar{display:none;}
  .tabBtn{
    display:inline-block;
    cursor:pointer;
    font-size:.75em;
    padding:.5em 1em;
    margin:0 -.35em 0 0;
    background-color:var(--paper);
    color:var(--ink);
    border:none;
    border-bottom:1px solid var(--ink);
    border-radius:.5em .5em 0 0;
    filter:brightness(.75);
    transition:filter .2s;
  }
  .tabBtn:hover{
    filter:brightness(.85);
  }
  .tabBtn.active{
    filter:brightness(1);
    border:1px solid var(--ink);
    border-bottom:none;
  }
  .tabContent{
    padding:6px 12px;
    animation:fadeEffect 1s;
  }
  @keyframes fadeEffect{
    from{opacity:0;}
    to{opacity:1;}
  }

  .tab-ok      { background: var(--s-ok-bg-ctl-btn);     color: var(--s-ok-fg-ctl);    border: var(--s-ok-bor-ctl-btn);}
  .tab-info    { background: var(--s-info-bg-ctl-btn);   color: var(--s-info-fg-ctl);  border: var(--s-info-bor-ctl-btn);}
  .tab-warning { background: var(--s-warn-bg-ctl-btn);   color: var(--s-warn-fg-ctl);  border: var(--s-warn-bor-ctl-btn);}
  .tab-alert   { background: var(--s-alert-bg-ctl-btn);  color: var(--s-alert-fg-ctl); border: var(--s-alert-bor-ctl-btn);}
  .tab-error   { background: var(--s-error-bg-ctl-btn);  color: var(--s-error-fg-ctl); border: var(--s-error-bor-ctl-btn);}
  `;

  static properties = {
    name: { type: String, reflect: true },
    activeTabIndex: { type: Number },
    width: { type: String, reflect: true },
    align: { type: String, reflect: true }
  };

  constructor() {
    super();
  }

  #openTab(e) {
    const oldTab = this.activeTabIndex;
    const newTab = parseInt(e.currentTarget.getAttribute('data-tab-btn'));
    if (newTab !== oldTab) {
      this.activeTabIndex = newTab;
      this.tabChanged();
    }
  }
  #scrollLeft() {
    this.shadowRoot.querySelectorAll('.tabBtns')[0].scrollBy({
      top: 0,
      left: -150,
      behavior: 'smooth'
    });
  }
  #scrollRight() {
    this.shadowRoot.querySelectorAll('.tabBtns')[0].scrollBy({
      top: 0,
      left: 150,
      behavior: 'smooth'
    });
  }
  render() {
    const clsRank = `${parseRank(this.rank, true)}`;
    const clsStatus = `${parseStatus(this.status, true)}`;
    const allItems = [...this.getElementsByTagName("az-tab-item")];
    const tabList = html`${allItems.map((item, i) => html`
      <div class="tabBtn tab-${parseStatus(item.getAttribute('status'), true)} ${(parseInt(this.activeTabIndex) === i) ? 'active' : ''}" data-tab-btn="${i}" @click="${this.#openTab}">${item.title}</div>
    `)}`;
    const tabContentList = html`${allItems.map((item, i) => html`
      <div class="tabContent" style="display:${(parseInt(this.activeTabIndex) === i) ? 'block' : 'none'};">${verbatimHtml(item.innerHTML)}</div>
    `)}`;

    return html`
      <div class="tabContainer ${(!this.align) ? 'align-left' : 'align-' + this.align}">
        <div class="tabNav">
          <button class="scrollBtn" @click="${this.#scrollLeft}">&lt;</button>
          <div class="tabBtns ${clsRank}" id="tabBtns">
            ${tabList}
          </div>
          <button class="scrollBtn" @click="${this.#scrollRight}">&gt;</button>
        </div>
        ${tabContentList}
      </div>
    `
  }

  firstUpdated() {
    const tabMenuWidth = this.shadowRoot.querySelector('.tabBtns').offsetWidth;
    const scrollBtns = this.shadowRoot.querySelectorAll('.scrollBtn');
    const tabBtns = this.shadowRoot.querySelectorAll('.tabBtn');
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

  // Bubbles tab change up to parent component
  tabChanged() {
    const evt = new Event("change", { bubbles: true, cancelable: false });
    this.dispatchEvent(evt);
  }
}

window.customElements.define("az-tabs", Tabs);
