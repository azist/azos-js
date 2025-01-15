import { isOf, isStringOrNull } from "azos/aver";
import { ImageRegistry } from "azos/bcl/img-registry"

import { AzosElement, css, html, noContent, verbatimHtml } from "../../ui";
import { Arena } from "../../arena";
import { ModalDialog } from "../../modal-dialog";
import { writeToClipboard } from "./clipboard";
import { isString as types_isString } from "azos/types";
import { matchPattern } from "azos/strings";
import { toast } from "../../toast";

export class ImageRegistryBrowser extends AzosElement {

  static styles = css`
:host {
  display: block;
  max-width: 500px;
  max-height: 400px;
  border-radius: 10px 0 0 10px;
  border: 1px solid #aaa;
  background-color: #ddd;
  overflow-y: scroll;
  padding: 1ch;
}

.filter{
  display: flex;
  align-items: flex-end;
  padding-bottom: 1em;
}

.suggestion{
  text-decoration: underline;
  cursor: pointer;
  font-weight: bolder;
}

.results{
  display: grid;
  gap: 0.5em;
  grid-template-columns: repeat(2, auto);
}

.records{
  display: grid;
  gap: 0.5em;
  grid-template-columns: repeat(auto-fit, 42px);
}

.record{
  background-color: #ccc;
  border: 1px solid #aaa;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.record .icon:hover{
  cursor: pointer;
  filter: brightness(115%);
}
.record svg{fill:#000}
.record .moreInfo{text-align: center;}

.info{
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: auto;
}
.info .first {
  grid-column: 1 / span 2;
  padding: 1em auto;
}
.info dt{font-weight: bold;}
  `;

  static properties = {
    filter: { type: String },
  };

  #ref = {
    imgRegistry: ImageRegistry,
  };

  tbFilter = null;
  #filter = null;
  get filter() { return this.#filter; }
  set filter(v) {
    const oldValue = this.#filter;
    this.#filter = isStringOrNull(v);
    this.requestUpdate("filter", oldValue);
  }

  get hasSuggestedFilter() { return !this.filter.startsWith("*") || !this.filter.endsWith("*"); }
  get suggestedFilter() { return `*${(this.#filter ?? "").replace(/^\*?|\*?$/g, '')}*`; }

  constructor() {
    super();
    this.filter = "*";
  }

  #filterChanged() {
    console.log("changed:filter", this.tbFilter?.value ?? null);
    this.filter = this.tbFilter?.value ?? null;
  }

  get filteredUris() {
    const filter = this.filter && this.filter !== "" ? this.filter : null;
    const allUris = this.#ref.imgRegistry.getUris().filter(uri => !matchPattern(uri, "azos.ico.none"));
    const match = filter === null ? () => true : uri => matchPattern(uri, filter);
    return [...allUris.filter(match)];
  }

  #onRecordClicked(uri, rec) {
    let spec = this.#formatFullSpec(uri, rec);
    writeToClipboard(spec);
    toast(`Copied "${spec}"`, { timeout: 3_000 });
  }

  #formatFullSpec(uri, { format, media, isoLang, theme } = {}) {
    let spec = `${format}://${uri}`;

    if (media || isoLang || theme) {
      if (media) media = `m=${media}`;
      if (isoLang) isoLang = `i=${isoLang}`;
      if (theme) theme = `t=${theme}`;
      spec += `?` + [media, isoLang, theme].filter(types_isString).join("&");
    }

    return spec;
  }

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
  }

  #selectedForInfoRec = null;
  async #showInfo(uri, rec) {
    this.#selectedForInfoRec = { uri, rec };
    this.update();
    this.recInfo.show();
    await this.recInfo.shownPromise;
    this.#selectedForInfoRec = null;
    this.requestUpdate();
  }

  render() {
    const { uri, rec } = (this.#selectedForInfoRec ?? {});
    return html`
${this.renderFilterField()}
${this.renderResults()}
<az-modal-dialog id="recInfo" scope="this" title="Image Spec">
  <div slot="body" class="info">
    ${uri ? html`
    <div style="grid-column: 1/span 2">${this.#formatFullSpec(uri, rec)}</div>
    <div style="grid-column: 1/span 2">${verbatimHtml(rec.produceContent().content)}</div>
    <dt>Uri:</dt><dd>${uri}</dd>
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

  renderFilterField() {
    return html`
<div class="filter">
  <az-text id="tbFilter" scope="this" title="Filter" placeholder="*checkmark*" @change="${this.#filterChanged}" value="${this.filter}"></az-text>
  <az-button @click="${() => this.filter = null}" title="Clear Results" status="alert" rank="4"></az-button>
</div>
    `;
  }

  renderResults() {
    return html`
<div class="results">
  ${this.filteredUris.length
        ? this.filteredUris.map(uri => this.renderUri(uri))
        : this.renderNoResults()}
</div>
    `;
  }

  renderUri(uri) {
    const records = this.#ref.imgRegistry.getRecords(uri);
    return html`
<div class="result">
  <h4>${uri}</h4>
  <div class="records">
    ${[...records, ...records, ...records, ...records, ...records, ...records, ...records, ...records, ...records].map(rec => this.renderRecord(uri, rec))}
  </div>
</div>
    `;
  }

  renderRecord(uri, rec) {
    return html`
<div class="record">
  <div class="icon" @click="${() => this.#onRecordClicked(uri, rec)}">${verbatimHtml(rec.produceContent().content)}</div>
  <a class="moreInfo" href="#icon" @click="${e => { e.preventDefault(); this.#showInfo(uri, rec); }}">Info</a>
</div>
    `;
  }

  renderNoResults() {
    return html`
<div> No results.
${this.hasSuggestedFilter
        ? html`Did you mean <a class="suggestion" @click="${() => this.filter = this.suggestedFilter}">${this.suggestedFilter}</a>?`
        : noContent}
</div>
    `;
  }
}

customElements.define("az-img-registry-browser", ImageRegistryBrowser);


/* --------------------------------------- Debugging Facilities ------------------------------------------------*/

class AzdimgBox extends ModalDialog{
  constructor(arena){ super(arena); }
  static styles = [ModalDialog.styles, css` az-img-registry-browser{ margin: 1em; width: 80vw; height: 80vh;}`];
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
