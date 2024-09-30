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

  .tabBtns{
    overflow:hidden;
  }

  .tabBtn{
    background-color:#fff;
    float:left;
    border:none;
    border-bottom:1px solid var(--ink);
    outline:none;
    border-radius:.5em .5em 0 0;
    margin:2px 2px 0 2px;
    cursor:pointer;
    padding:14px 16px;
    transition:0.3s;
  }
  .tabBtn:hover{
    filter:brightness(1.15);
  }
  .tabBtn.active{
    background-color:var(--ink);
    color:var(--paper);
  }
  .tabContent{
    padding:6px 12px;
    animation:fadeEffect 1s;
  }
  @keyframes fadeEffect{
    from{opacity:0;}
    to{opacity:1;}
  }

  .ok > details > summary      { background: var(--s-ok-bg-ctl-btn);     color: var(--s-ok-fg-ctl);    border: var(--s-ok-bor-ctl-btn);}
  .info > details > summary    { background: var(--s-info-bg-ctl-btn);   color: var(--s-info-fg-ctl);  border: var(--s-info-bor-ctl-btn);}
  .warning > details > summary { background: var(--s-warn-bg-ctl-btn);   color: var(--s-warn-fg-ctl);  border: var(--s-warn-bor-ctl-btn);}
  .alert > details > summary   { background: var(--s-alert-bg-ctl-btn);  color: var(--s-alert-fg-ctl); border: var(--s-alert-bor-ctl-btn);}
  .error > details > summary   { background: var(--s-error-bg-ctl-btn);  color: var(--s-error-fg-ctl); border: var(--s-error-bor-ctl-btn);}
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

  render() {
    const clsRank = `${parseRank(this.rank, true)}`;
    const clsStatus = `${parseStatus(this.status, true)}`;
    const allItems = [...this.getElementsByTagName("az-tab-item")];
    const tabList = html`${allItems.map((item, i) => html`
      <button class="tabBtn tab-${clsStatus} ${(parseInt(this.activeTabIndex) === i) ? 'active' : ''}" data-tab-btn="${i}" @click="${this.#openTab}">${item.title}</button>
    `)}`;
    const tabContentList = html`${allItems.map((item, i) => html`
      <div class="tabContent" style="display:${(parseInt(this.activeTabIndex) === i) ? 'block' : 'none'};">${verbatimHtml(item.innerHTML)}</div>
    `)}`;

    return html`
      <div class="tabContainer ${(!this.align) ? 'align-left' : 'align-' + this.align}">
        <div class="tabBtns ${clsRank}">
          ${tabList}
        </div>
        ${tabContentList}
      </div>
    `
  }

  // Bubbles tab change up to parent component
  tabChanged() {
    const evt = new Event("change", { bubbles: true, cancelable: false });
    this.dispatchEvent(evt);
  }
}

window.customElements.define("az-tabs", Tabs);
