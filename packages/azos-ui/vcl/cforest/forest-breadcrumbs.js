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
      color: #0078d4;
      padding: 0 2px;
      transition: text-decoration 0.2s;
      font-size: var(--r3-fs);
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

    const actionBtn = html`<az-button id="btnCfgForestSettings" status="brand3" rank="3" title="${label}" @click="${this.onCFSettingsClick}" titlePosition="left">${label}</az-button>`;
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


