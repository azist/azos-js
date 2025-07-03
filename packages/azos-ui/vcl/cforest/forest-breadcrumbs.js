import { html, css } from "azos-ui/ui";
import { Block } from "azos-ui/blocks";
import "azos-ui/vcl/util/object-inspector";
import { writeToClipboard } from "azos-ui/vcl/util/clipboard";
import { toast } from "azos-ui/toast";

// @todo: implement breadcrumb navigation, pass a onSelect method to the component?

class CForestBreadcrumbs extends Block {

  static properties = {
    node: { type: Object, reflect: true },
    onCrumbClick: { type: Function, reflect: true },
    onCFSettingsClick: { type: Function, reflect: true },
  };

  // --s-brand1-fg: #f8f8ff;
  // --s-brand1-bg: #c045ef;
  // --s-brand1-fg-ctl: #ffe8ff;
  // --s-brand1-bg-ctl: #c045ef;
  // --s-brand1-ink-ctl: #8558a5;
  // --s-brand1-bor-color-ctl: #e8a0f0;
  // --s-brand1-bor-ctl: 1.2px solid var(--s-brand1-bor-color-ctl);
  // --s-brand1-bg-ctl-btn: var(--s-brand1-bg);
  // --s-brand1-fg-ctl-btn: #fff;
  // --s-brand1-bor-ctl-btn: 2px solid var(--s-brand1-bor-color-ctl);
  // --s-brand1-fg-hcontrast: #f4a0ff;
  // --s-brand1-bg-hcontrast: #422157;
  // --s-brand1-bor-hcontrast: #782aa6;
  // --s-brand2-fg: #f8f8e8;
  // --s-brand2-bg: #f08051;
  // --s-brand2-fg-ctl: #fff4e8;
  // --s-brand2-bg-ctl: #f08051;
  // --s-brand2-ink-ctl: #906505;
  // --s-brand2-bor-color-ctl: #f0a420;
  // --s-brand2-bor-ctl: 1.2px solid var(--s-brand2-bor-color-ctl);
  // --s-brand2-bg-ctl-btn: var(--s-brand2-bg);
  // --s-brand2-fg-ctl-btn: #fff;
  // --s-brand2-bor-ctl-btn: 2px solid #f0a420;
  // --s-brand2-fg-hcontrast: #f4a00f;
  // --s-brand2-bg-hcontrast: #574110;
  // --s-brand2-bor-hcontrast: #604214;
  // --s-brand3-fg: #f8f8f8;
  // --s-brand3-bg: #4074ff;
  // --s-brand3-fg-ctl: #e8e8ff;
  // --s-brand3-bg-ctl: #4074ff;
  // --s-brand3-ink-ctl: #2070a4;
  // --s-brand3-bor-color-ctl: #4094ff;
  // --s-brand3-bor-ctl: 1.2px solid var(--s-brand3-bor-color-ctl);
  // --s-brand3-bg-ctl-btn: var(--s-brand3-bg);
  // --s-brand3-fg-ctl-btn: #f2f2ff;
  // --s-brand3-bor-ctl-btn: 2px solid #4094ff;
  // --s-brand3-fg-hcontrast: #4094ff;
  // --s-brand3-bg-hcontrast: #373761;
  // --s-brand3-bor-hcontrast: #404068;

  // --brand1-paper: #f09020;
  // --brand1-ink-sup: #4068f8;
  // --brand1-ink-hdr: #f4f4f4;
  // --brand1-ink-sub: #575757;
  // --brand2-paper: #4068f8;
  // --brand2-ink-sup: #f09020;
  // --brand2-ink-hdr: #f0f0f4;
  // --brand2-ink-sub: #d0d030;
  // --brand3-paper: #404040;
  // --brand3-ink-sup: #f09020;
  // --brand3-ink-hdr: #e4e4f4;
  // --brand3-ink-sub: #4068f8;
  static styles = [ Block.styles, css`

    .crumbs {
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.02));
      border-bottom: 1px solid rgba(0,0,0,0.01);
      display: flex;
      align-items: center;
      font-size: 1rem;
      padding: 0.5em;
    }

    .crumb {
      color: var(--brand2-ink-sup);
      padding: 0 2px;
      transition: text-decoration 0.2s;
      font-size: var(--r3-fs);
    }

    .crumbAlt {
      color: var(--brand1-ink-sup);
      padding: 0 2px;
      font-size: var(--r3-fs);
    }


    .crumb:hover, .crumbAlt:hover {
      cursor: pointer;
    }

    .crumb-current {
      font-weight: bold;
      color: #222;
      cursor: default;
      text-decoration: none;

      &:hover {
        text-decoration: none;
      }
    }

    .crumb-separator {
      color: #888;
      padding: 0 4px;
      user-select: none;
      font-size: var(--r3-fs);
    }

    .forest-setting-separator {
     font-size: var(--r3-fs);
     margin: 0 0.5em;
    }
    .rootCrumb {
      color: #0078d4;
      font-style: italic;
      font-size: var(--r3-fs);
    }

    .crumb-label {
      font-style: italic;
    }`];

  connectedCallback(){
    super.connectedCallback();
    if(!this.onCrumbClick) {
      this.onCrumbClick = (e) => {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent("crumb-click", { detail: { ...this.node }, bubbles: true, composed: true }));
      };
    }
    if(!this.onCFSettingsClick) {
      this.onCFSettingsClick = (e) => {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent("cfg-forest-settings-click", { detail: { ...this.node }, bubbles: true, composed: true }));
      };
    }
  }

  render (){

    const tree = this?.node?.Tree || "None";
    const forest = this?.node?.Forest || "None";
    const label = `${tree}@${forest}`;

    const oldActionBtn = html`<az-button id="btnCfgForestSettings" status="brand3" rank="3" title="${label}" @click="${this.onCFSettingsClick}" titlePosition="left">${label}</az-button>`;

    const actionBtn = html`
    <div id="btnCfgForestSettings" @click="${this.onCFSettingsClick}" >
      <span class="crumb">${tree}</span>@<span class="crumbAlt">${forest}</span>
    </div>`;

    const copyBtn = html`<az-button id="btnCopyPath" rank="6" icon="svg://azos.ico.copy" @click="${(e) => {
      writeToClipboard(this.node.FullPath);
      toast(`Copied '${this.node.FullPath}' to clipboard`, { timeout: 1_000, status: "ok", position: "top-center" });
    }}"></az-button>`;

    const trail = [actionBtn, html`<span class="crumb">://</span>`];


    if (this.node?.FullPath){
      const segments = this.node.FullPath.split('/').filter(p => p);
      const sep = html`<span class="crumb-separator">/</span>`;
      const breadcrumbs = segments.map((seg, i) => html`${i>0? sep : ""}<span class="crumb" @click="${this.onCrumbClick}">${seg}</span>`);
      if(breadcrumbs.length ) trail.push(breadcrumbs);
      if(segments.length > 0) trail.push(copyBtn);
    }
    return html`<div class="crumbs">${trail}</div>`;
  }
}

window.customElements.define("az-cforest-breadcrumbs", CForestBreadcrumbs);
