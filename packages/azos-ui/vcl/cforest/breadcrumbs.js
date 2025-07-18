import { html, css, Control } from "azos-ui/ui";
import { Block } from "azos-ui/blocks";
import "azos-ui/vcl/util/object-inspector";
import { writeToClipboard } from "azos-ui/vcl/util/clipboard";
import { toast } from "azos-ui/toast";

/**
 * Component for displaying node breadcrumbs in a forest context
 *   allowing navigation through nodes, copying node paths, and a utility button.
 */
class ForestBreadcrumbs extends Control {

  static properties = {
    node: { type: Object, reflect: true },
    onCrumbClick: { type: Function, reflect: true },
    onCFSettingsClick: { type: Function, reflect: true },
  };

  static styles = [css`

    :host {
      --vcl-cfe-bc-padding: 0.5em;
      --vcl-cfe-bc-fs: var(--r3-fs);
      --vcl-cfe-bc-ink: var(--brand2-ink-sup);
      --vcl-cfe-bc-ink-alt: var(--brand1-ink-sup);
      --vcl-cfe-bc-ink-inactive: var(--ink);

      --vcl-cfe-bc-bar-bg: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.02));
      --vcl-cfe-bc-bar-ink: var(--vcl-cfe-bc-ink);
      --vcl-cfe-bc-bar-height: 2em;
      --vcl-cfe-bc-bar-bor-btm: 1px solid rgba(0,0,0,0.01);

      --vcl-cfe-bc-btn-bg: var(--s-default-bg-ctl);
      --vcl-cfe-bc-btn-bor: var(--s-default-bor-ctl-btn);
      --vcl-cfe-bc-btn-bor-rad: var(--r4-brad-ctl);
      --vcl-cfe-bc-btn-padding: var(--vcl-cfe-bc-padding);

      --vcl-cfe-bc-root-padding: 0 var(--vcl-cfe-bc-padding);
    }

    .crumbs {
      display: flex;
      align-items: center;
      background: var(--vcl-cfe-bc-bar-bg);
      border-bottom: var(--vcl-cfe-bc-bar-bor-btm);
      padding: var(--vcl-cfe-bc-padding);
      height: var(--vcl-cfe-bc-bar-height);
    }

    .btnSettings {
      background: var(--vcl-cfe-bc-btn-bg);
      border: var(--vcl-cfe-bc-btn-bor);
      padding: var(--vcl-cfe-bc-btn-padding);
      border-radius: var(--vcl-cfe-bc-btn-bor-rad);
    }

    .btnSettings:hover {
      background: var(--focus-ctl-selected-color);
      cursor: pointer;
    }

    .forest-setting-separator {
      font-size: var(--vcl-cfe-bc-fs);
      margin: 0 var(--vcl-cfe-bc-padding);
    }

    .rootCrumb {
      padding: var(--vcl-cfe-bc-root-padding);
    }

    .crumb-separator {
      color: var(--vcl-cfe-bc-ink-inactive);
      padding: 0 4px;
      user-select: none;
      font-size: var(--vcl-cfe-bc-fs);
    }

    .crumb {
      color: var(--vcl-cfe-bc-ink);
      font-size: var(--vcl-cfe-bc-fs);
    }

    .crumbAlt {
      color: var(--vcl-cfe-bc-ink-alt);
      font-size: var(--vcl-cfe-bc-fs);
    }

    .crumb:hover, .crumbAlt:hover {
      cursor: pointer;
    }

    .crumb.crumb-current {
      font-weight: bold;
      color: var(--vcl-cfe-bc-ink-inactive);
      cursor: default;
      text-decoration: none;

      &:hover {
        text-decoration: none;
      }
    }


    `];


  /**
   * Handles breadcrumb click events.
   * @param {*} idx - The index of the clicked breadcrumb.
   * @param {*} fullpath - The full path of the currently selected node.
   * @returns {void}
   */
  #onCrumbClick(idx, fullpath) {
    const segments = fullpath.split('/').filter(p => p);
    if (idx === -1) {
      this.onCrumbClick("/");
      return;
    }
    if (segments.length === 0) return "/";
    const path = "/" + segments.slice(0, idx + 1).join("/");
    this.onCrumbClick(path);
  }


  /**
   * Click handler for copying the node path to clipboard.
   * Displays a toast notification upon successful copy.
   * @param {Event} e - The click event.
   */
  #btnCopyClick(e) {
    writeToClipboard(this.node.FullPath);
    toast(`Copied '${this.node.FullPath}' to clipboard`, { timeout: 1_000, status: "ok", position: "top-center" });
  }

  render (){
    const tree = this?.node?.Tree || "None";
    const forest = this?.node?.Forest || "None";

    const actionBtn = html`<div id="btnCfgForestSettings" class="btnSettings" @click="${this.onCFSettingsClick}" ><span class="crumb">${tree}</span>@<span class="crumbAlt">${forest}</span></div>`;
    const copyBtn = html`<az-button id="btnCopyPath" rank="6" icon="svg://azos.ico.copy" title="Copy Path" @click="${this.#btnCopyClick}"></az-button>`;

    const trail = [actionBtn, html`<span class="crumb rootCrumb ${this.node?.FullPath === "/" ? "crumb-current" : ""}" @click="${() => this.#onCrumbClick(-1,this.node.FullPath)}">://</span>`];

    if (this.node?.FullPath){
      const segments = this.node.FullPath.split('/').filter(p => p);
      const sep = html`<span class="crumb-separator">/</span>`;
      const breadcrumbs = segments.map((seg, i) => html`${i>0? sep : ""}<span class="crumb ${i<segments.length-1 ? "": "crumb-current"}" @click="${() => this.#onCrumbClick(i,this.node.FullPath)}">${seg}</span>`);

      if(breadcrumbs.length ) trail.push(breadcrumbs);
      if(segments.length > 0) trail.push(copyBtn);
    }

    return html`<div class="crumbs">${trail}</div>`;
  }
}

window.customElements.define("az-cforest-breadcrumbs", ForestBreadcrumbs);
