import { isOf, isStringOrNull } from "azos/aver";
import { ImageRegistry } from "azos/bcl/img-registry"

import { AzosElement, css, html, noContent, verbatimHtml } from "../../ui";
import { Arena } from "../../arena";
import { ModalDialog } from "../../modal-dialog";
import { writeToClipboard } from "./clipboard";
import { matchPattern } from "azos/strings";
import { toast } from "../../toast";

export class ImageRegistryBrowser extends AzosElement {

  static styles = css`
:host {
  display: block;
  background-color: var(--bgColor);
  color: var(--svgStrokeColor);
  padding: 1em;
}

:host-context(dialog), .recInfoBody{
  box-shadow: 0 0 10px 5px var(--bgColor);
  border: 1px solid var(--svgStrokeColor);
  border-radius: 0 0 var(--r3-brad-win) var(--r3-brad-win);
}
:host-context(dialog) .results {padding: 0;}

.filter{
  display: flex;
  align-items: flex-end;
  padding-bottom: 1em;
}
#tbFilter{flex:1;}

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
}

.results h2{margin-top: 0.5em;margin-bottom: 0.25em;}
.results h2, .noResults{grid-column: 1 / -1;}

.record{
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin: 0;
}
.record .name{
  font-size: 10px;
  text-align: center;
}
.record .icon {
  width: 32px;
  text-align: center;
}
.icon svg{
  fill: var(--svgFillColor);
  stroke: var(--svgStrokeColor);
}
.icon.fas svg{
  fill: var(--svgStrokeColor);
}

.results, .recInfoBody{
  background-color: var(--bgColor);
  color: var(--svgStrokeColor);
  padding: 0 1em 1em;
}

.recInfoBody{
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: auto;
}
.recInfoBody figure{
  grid-column: 1 / span 2;
  padding: 1em auto;
}
.recInfoBody figure:hover{cursor: pointer;}
.recInfoBody dt{font-weight: bold;}
.recInfoBody dd{margin-left: 0;}
  `;

  static properties = {
    filter: { type: String },
    bgColor: { type: String },
    svgStrokeColor: { type: String },
    svgFillColor: { type: String },
  };

  #ref = {
    imgRegistry: ImageRegistry,
  };

  tbFilter = null;
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
    return Array.from(matches.map(({ uri, rec }) => {
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

  #filterChanged() {
    console.log("changed:filter", this.tbFilter?.value ?? null);
    this.filter = this.tbFilter?.value ?? null;
  }

  #onCopyClicked(uri, rec) {
    if (this.#copyToast) this.#copyToast.destroy();

    let spec = `${rec.format}://${uri}`;
    writeToClipboard(spec);
    this.#copyToast = toast(`Copied "${spec}" to clipboard`, { timeout: 3_000, status: 'ok' });
  }

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
  }

  render() {
    return html`
<style>
.recInfoBody .icon{
  position: relative;
}
.recInfoBody .icon::after{
  display: inline-block;
  position: absolute;
  left: calc(100% - 32px);
  top: calc(100% - 32px);
  width: 16px;
  height: 16px;
}
:host{
  --bgColor: ${this.bgColor};
  --svgStrokeColor: ${this.svgStrokeColor};
  --svgFillColor: ${this.svgFillColor};
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
  <az-text id="tbFilter" scope="this" title="Filter" placeholder="*checkmark*" @change="${this.#filterChanged}" value="${this.filter}"></az-text>
  <az-text id="tbBg" scope="this" title="BG Color" dataKind="color" @change="${e => this.bgColor = e.detail.value}" value="${this.bgColor}"></az-text>
  <az-text id="tbStroke" scope="this" title="SVG Stroke" dataKind="color" @change="${e => this.svgStrokeColor = e.detail.value}" value="${this.svgStrokeColor}"></az-text>
  <az-text id="tbFill" scope="this" title="SVG Fill" dataKind="color" @change="${e => this.svgFillColor = e.detail.value}" value="${this.svgFillColor}"></az-text>
  <az-check itemType="switch" id="chFill" scope="this" title="No Fill" rank="normal" @change="${e => { this.svgFillColor = e.detail.value ? "none" : "#ffffff" }}" value="${this.svgFillColor === "none"}"></az-check>
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
  <div class="icon${rec.fas ? " fas" : ""}">${verbatimHtml(rec.produceContent().content)}</div>
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
      <div class="icon${rec.fas ? " fas" : ""}">${verbatimHtml(rec.produceContent().content)}</div>
      <figCaption class="spec">${rec.format}://${uri}</figCaption>
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
  static styles = [ModalDialog.styles, css`az-img-registry-browser{ margin: 1em; width: 60vw; height: 55vh;}`];
  renderBody(){ return html`<az-img-registry-browser></az-img-registry-browser>`;}
}
window.customElements.define("az-azdimgbox", AzdimgBox);

/** Provides Image browser popup for debugging */
export async function azdimg(arena = null){
  arena = arena ?? window.ARENA;
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
