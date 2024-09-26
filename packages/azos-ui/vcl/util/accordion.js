/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AzosElement, css, html, verbatimHtml, parseRank, parseStatus } from "../../ui";

/** Provides code display functionality with optional syntax highlighting */
export class Accordion extends AzosElement {

  static styles = css`
  .r1 { font-size: var(--r1-fs);}
  .r2 { font-size: var(--r2-fs);}
  .r3 { font-size: var(--r3-fs);}
  .r4 { font-size: var(--r4-fs);}
  .r5 { font-size: var(--r5-fs);}
  .r6 { font-size: var(--r6-fs);}

  details{
    font-family: inherit;
    margin:0 auto;
  }
  details > summary{
    font-weight:      var(--ctl-button-fweight);
    font-style:       var(--ctl-button-fstyle);
    letter-spacing:   var(--ctl-button-letter-spacing);
    border:           var(--s-default-bor-ctl-btn);
    padding:          0.5lh 1ch 0.5lh 1ch;
    background-color: var(--s-default-bg-ctl);
    color:            var(--s-default-fg-ctl);
    cursor:           pointer;
    list-style:       none;
  }
  details > summary::before{
    content:      "\u{23F5}";
    margin-right: .75em;
    padding-bottom: 1em;
  }
  details[open] > summary::before{
    content: "\u{23F7}";
  }
  details > div{
    background-color:var(--s-default-bg-ctl);
    padding:1em 2em;
    margin:0;
    border: var(--s-default-bor-ctl-btn);
  }

  .accordion{display:flex;text-align:left;}
  .align-left{justify-content:start;}
  .align-center{justify-content:center;}
  .align-right{justify-content:end;}

  .ok > details > summary      { background: var(--s-ok-bg-ctl-btn);     color: var(--s-ok-fg-ctl);    border: var(--s-ok-bor-ctl-btn);}
  .info > details > summary    { background: var(--s-info-bg-ctl-btn);   color: var(--s-info-fg-ctl);  border: var(--s-info-bor-ctl-btn);}
  .warning > details > summary { background: var(--s-warn-bg-ctl-btn);   color: var(--s-warn-fg-ctl);  border: var(--s-warn-bor-ctl-btn);}
  .alert > details > summary   { background: var(--s-alert-bg-ctl-btn);  color: var(--s-alert-fg-ctl); border: var(--s-alert-bor-ctl-btn);}
  .error > details > summary   { background: var(--s-error-bg-ctl-btn);  color: var(--s-error-fg-ctl); border: var(--s-error-bor-ctl-btn);}
  `;

  static properties = {
    name: { type: String, reflect: true },
    activeItemIndex: { type: Number },
    width: { type: String, reflect: true },
    align: { type: String, reflect: true }
  };

  constructor() {
    super();
  }

  render() {
    const clsRank = `${parseRank(this.rank, true)}`;
    const clsStatus = `${parseStatus(this.status, true)}`;
    const allItems = [...this.getElementsByTagName("az-accordion-item")];
    const itemsList = html`${allItems.map((item, i) => html`
      <details
        name="${item.name}"
        .open=${this.activeItemIndex === i}
      >
        <summary>${item.title}</summary>
        <div>${verbatimHtml(item.innerHTML)}</div>
      </details>
    `)}`;

    return html`
      <div class="accordion ${(!this.align) ? 'align-left' : 'align-' + this.align}">
      <div class="${clsRank} ${clsStatus}" style="width: ${this.width}">
        ${itemsList}
      </div></div>
    `
  }
}

window.customElements.define("az-accordion", Accordion);
