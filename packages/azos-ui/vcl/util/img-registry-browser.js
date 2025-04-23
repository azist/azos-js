/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOf, isStringOrNull } from "azos/aver";
import { ImageRegistry } from "azos/bcl/img-registry"
import { matchPattern } from "azos/strings";

import { writeToClipboard } from "./clipboard.js";
import { iconStyles } from "../../parts/styles.js";
import { AzosElement, css, html, noContent, renderImageSpec } from "../../ui.js";
import { Arena } from "../../arena.js";
import { ModalDialog } from "../../modal-dialog.js";
import { toast } from "../../toast.js";

export class ImageRegistryBrowser extends AzosElement {

  static styles = [iconStyles, css`
:host {
  display: block;
  background-color: var(--img-registry-bg-color);
  color: var(--img-registry-icon-stroke-color);
  padding: 1em;
}

:host-context(dialog), .recInfoBody{
  border: 1px solid var(--img-registry-icon-stroke-color);
  border-radius: 0 0 var(--r3-brad-win) var(--r3-brad-win);
}
:host-context(dialog) .results { padding: 0; }
.icon{
  --icon-stroke: var(--img-registry-icon-stroke-color);
  --icon-fill: var(--img-registry-icon-fill);
}

.filter{
  display: flex;
  align-items: flex-end;
  padding-bottom: 1em;
}
#tbFilter{ flex:1; }

.suggestion{
  text-decoration: underline;
  cursor: pointer;
  font-weight: bolder;
}

.results{
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(auto-fill, minmax(50px, 75px));
  grid-template-rows: repeat(auto-fill, minmax(30px, auto));

  h2{ margin-top: 0.5em; margin-bottom: 0.25em; }
  h2, .noResults{ grid-column: 1 / -1; }
}


.record{
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin: 0;

  &:hover{
    background-color: hsl(from var(--img-registry-bg-color) h s max(calc(l - 10), 10));
    border-radius: 5px;
  }

  .name{
    font-size: 10px;
    text-align: center;
  }

  .iconWrapper{
    flex: 1;
    place-content: center;

    .icon{
      width: 32px;
      text-align: center;
    }
  }
}

.results, .recInfoBody{
  background-color: var(--img-registry-bg-color);
  color: var(--img-registry-icon-stroke-color);
  padding: 0 1em 1em;
}

.recInfoBody{
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: auto;

  figure{
    grid-column: 1 / span 2;
    padding: 1em auto;

    &:hover{ cursor: pointer; }

    dt{ font-weight: bold; }
    dd{ margin-left: 0; }
    .spec{ text-align: center; }

    .iconWrapper{
      position: relative;

      .copyIcon{
        position: absolute;
        right: 0;
        bottom: 0;
        width: 32px;
        height: 32px;
        background-color: hsl(from var(--img-registry-bg-color) h s max(calc(l - 10), 10));
        border-radius: 5px;
      }

      .specIcon{
        --icon-size: 15em;
      }
    }
  }
}

  `];

  static properties = {
    filter: { type: String },
    bgColor: { type: String },
    svgStrokeColor: { type: String },
    svgFillColor: { type: String },
  };

  #ref = {
    imgRegistry: ImageRegistry,
  };

  #copyToast = null;
  #selectedForInfoRec = null;
  #filter = null;

  get filter() { return this.#filter; }
  set filter(v) {
    const oldValue = this.#filter;
    this.#filter = isStringOrNull(v);
    this.requestUpdate("filter", oldValue);
  }

  get hasSuggestedFilter() { return !this.filter.startsWith("*") || !this.filter.endsWith("*"); }
  get suggestedFilter() { return `*${(this.#filter ?? "").replace(/^\*?|\*?$/g, '')}*`; }

  get iconsByGroup() {
    const filter = this.filter && this.filter !== "" ? this.filter : null;
    let uris = this.#ref.imgRegistry.getUris().filter(uri => !matchPattern(uri, "azos.ico.none"));
    const match = filter === null ? () => true : uri => matchPattern(uri, filter);
    const matches = [...uris.filter(match)]
      .flatMap(uri => this.#ref.imgRegistry.getRecords(uri)
        .map(rec => ({ uri, rec }))
      );
    if (!matches.length) return null;
    return Array.from(matches
      .sort(({ uri: a }, { uri: b }) => a > b ? 1 : b > a ? -1 : 0) // sort uris alphabetically
      .map(({ uri, rec }) => {
      let parts = uri.split(".");
      const recName = parts.pop();
      const group = parts.join(".");
      return { group, uri, recName, rec };
    })
      .reduce((groups, { group, uri, recName, rec }) => {
        if (!groups.has(group)) groups.set(group, []);
        groups.get(group).push({ uri, recName, rec });
        return groups;
      }, new Map), ([group, records]) => ({ group, records }));

  }

  constructor() {
    super();
    this.filter = "*";
    this.bgColor = "#404040";
    this.svgStrokeColor = "#ffffff";
    this.svgFillColor = "none";
  }

  async #showInfo(uri, recName, rec) {
    this.#selectedForInfoRec = { uri, recName, rec };
    this.update();
    this.recInfo.show();
    await this.recInfo.shownPromise;
    this.#selectedForInfoRec = null;
    this.requestUpdate();
  }

  async #onCopyClicked(uri, rec) {
    if (this.#copyToast) this.#copyToast.destroy();

    let spec = `${rec.format}://${uri}`;
    if (await writeToClipboard(spec))
      this.#copyToast = toast(`Copied "${spec}" to clipboard`, { timeout: 3_000, status: 'ok' });
    else {
      this.#copyToast = toast(`Press ctrl+c to copy "${spec}" to clipboard`, { timeout: 5_000, status: 'alert' });
      const range = document.createRange();
      range.selectNodeContents(this.$("specValue"));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
  }

  render() {
    return html`
<style>
:host{
  --img-registry-bg-color: ${this.bgColor};
  --img-registry-icon-stroke-color: ${this.svgStrokeColor};
  --img-registry-icon-fill: ${this.svgFillColor};
}
</style>
${this.renderFilterField()}
${this.renderResults()}
${this.renderInfoDialog()}
    `;
  }

  renderFilterField() {
    return html`
<div class="filter">
  <az-text class="tbFilter" title="Filter" placeholder="*checkmark*" @change="${e => this.filter = e.target.value ?? null}" value="${this.filter}"></az-text>
  <az-text class="tbBg" title="BG Color" dataKind="color" @change="${e => this.bgColor = e.target.value}" value="${this.bgColor}"></az-text>
  <az-text class="tbStroke" title="SVG Stroke" dataKind="color" @change="${e => this.svgStrokeColor = e.target.value}" value="${this.svgStrokeColor}"></az-text>
  <az-text class="tbFill" title="SVG Fill" dataKind="color" @change="${e => { this.svgFillColor = e.target.value }}" value="${this.svgFillColor}"></az-text>
  <az-check class="chFill" itemType="switch" title="No Fill" rank="normal" @change="${e => { this.svgFillColor = e.target.value ? "none" : "#ffffff" }}" value="${this.svgFillColor === "none"}"></az-check>
</div>
    `;
  }

  renderResults() {
    const ig = this.iconsByGroup;
    if (ig === null) return this.renderNoResults();
    return html`<div class="results">${ig.map(({ group, records }) => this.renderGroup(group, records))}</div>`;
  }

  renderGroup(group, records) {
    return html`
<h2>${group}</h2>
${records.map(({ uri, recName, rec }) => this.renderRecord(uri, recName, rec))}
    `;
  }

  renderRecord(uri, recName, rec) {
    return html`
<div class="record" @click="${e => { e.preventDefault(); this.#showInfo(uri, recName, rec); }}">
  <div class="iconWrapper">${renderImageSpec(null, rec, { wrapImage: false }).html}</div>
  <span class="name">${recName}</span>
</div>
    `;
  }

  renderNoResults() {
    return html`
<div class="noResults">No matches.
${this.hasSuggestedFilter
        ? html`Did you mean <a class="suggestion" @click="${() => this.filter = this.suggestedFilter}">${this.suggestedFilter}</a>?`
        : noContent}
</div>
    `;
  }

  renderInfoDialog() {
    const { uri, recName, rec } = (this.#selectedForInfoRec ?? {});
    return html`
<az-modal-dialog id="recInfo" scope="this" title="Image Spec">
  <div slot="body" class="recInfoBody">
    ${uri ? html`
    <figure @click="${() => this.#onCopyClicked(uri, rec)}">
      <div class="iconWrapper">
        ${renderImageSpec(null, rec, { cls: "specIcon icon", wrapImage: false }).html}
        ${this.renderImageSpec("svg://azos.ico.copy", { cls: "copyIcon icon", wrapImage: false }).html}</div>
      </div>
      <figCaption id="specValue" scope="this" class="spec">${rec.format}://${uri}</figCaption>
    </figure>
    <dt>Name:</dt><dd>${recName}</dd>
    <dt>Format:</dt><dd>${rec.format ?? "--"}</dd>
    <dt>Media:</dt><dd>${rec.media ?? "--"}</dd>
    <dt>Iso:</dt><dd>${rec.isoLang ?? "--"}</dd>
    <dt>Theme:</dt><dd>${rec.theme ?? "--"}</dd>
    <dt>Score:</dt><dd>${rec.score ?? "--"}</dd>
    `: noContent}
  </div>
</az-modal-dialog>
    `;
  }
}

customElements.define("az-img-registry-browser", ImageRegistryBrowser);


/* --------------------------------------- Debugging Facilities ------------------------------------------------*/

class AzdimgBox extends ModalDialog{
  constructor(arena){ super(arena); }
  static styles = [ModalDialog.styles, css`az-img-registry-browser{ margin: 1em; width: 60vw; height: 55vh;overflow-y:scroll;}`];
  renderBody(){ return html`<az-img-registry-browser></az-img-registry-browser>`;}
}
window.customElements.define("az-azdimgbox", AzdimgBox);

/** Provides Image browser popup for debugging */
export async function azdimg(arena = null){
  arena = arena ?? window.ARENA; // WARNING: NEVER EVER use window.ARENA reference, here it is used because this is a dev-only hack
  isOf(arena, Arena);
  const box = new AzdimgBox(arena);
  box.title = "Image Registry Viewer";
  arena.shadowRoot.appendChild(box);
  box.update();
  try{
    box.show();
    await box.shownPromise;
  }finally{
    arena.shadowRoot.removeChild(box);
  }
}

//global dbg hook
window.azdimg = azdimg;
