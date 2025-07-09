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
      color: var(--ink);
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

  #onCrumbClick(seg,fullpath){
    if(seg === "/") {
      this.onCrumbClick("/");
      return;
    }
    if(!seg || !fullpath) return "";
    const segments = fullpath.split('/').filter(p => p);
    if(segments.length === 0) return seg;
    const idx = segments.indexOf(seg);
    if(idx < 0) return seg;
    this.onCrumbClick(`/${segments.slice(0, idx + 1).join('/')}`);
  }

  render (){

    const tree = this?.node?.Tree || "None";
    const forest = this?.node?.Forest || "None";

    const actionBtn = html`
    <div id="btnCfgForestSettings" style="font-weight: bold;" @click="${this.onCFSettingsClick}" >
      <span class="crumb">${tree}</span>@<span class="crumbAlt">${forest}</span>
    </div>`;

    const copyBtn = html`<az-button id="btnCopyPath" class="copyBtn" rank="6" icon="svg://azos.ico.copy" @click="${(e) => {
      writeToClipboard(this.node.FullPath);
      toast(`Copied '${this.node.FullPath}' to clipboard`, { timeout: 1_000, status: "ok", position: "top-center" });
    }}">
    </az-button>`;

    const trail = [actionBtn, html`<span class="crumb"  @click="${() => this.#onCrumbClick("/","/")}">://</span>`];


    if (this.node?.FullPath){
      const segments = this.node.FullPath.split('/').filter(p => p);
      const sep = html`<span class="crumb-separator">/</span>`;
      const breadcrumbs = segments.map((seg, i) => html`${i>0? sep : ""}<span class="crumb ${i<segments.length-1 ? "": "crumb-current"}" @click="${() => this.#onCrumbClick(seg,this.node.FullPath)}">${seg}</span>`);
      if(breadcrumbs.length ) trail.push(breadcrumbs);
      if(segments.length > 0) trail.push(copyBtn);
    }
    return html`<div class="crumbs">${trail}</div>`;
  }
}

window.customElements.define("az-cforest-breadcrumbs", CForestBreadcrumbs);
