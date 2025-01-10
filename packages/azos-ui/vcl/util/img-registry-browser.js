import { isNonEmptyString } from "azos/aver";
import { ImageRegistry } from "azos/bcl/img-registry"

import { AzosElement, css, html, verbatimHtml } from "../../ui";
import { writeToClipboard } from "./clipboard";
import { isString } from "azos/types";
import { matchPattern } from "azos/strings";
import { toast } from "../../toast";

export class ImageRegistryBrowser extends AzosElement {

  static #instance;

  static styles = css`
.record {
  width: 32px;
  height: 32px;
}
.record svg {
  fill:#000
}
  `;

  static properties = {
    filter: { type: String },
  };

  static browse(filter) {
    isNonEmptyString(filter);
    if (!ImageRegistryBrowser.#instance) ImageRegistryBrowser.#instance = new ImageRegistryBrowser;

    ImageRegistryBrowser.#instance.show(filter);
  }

  #isShown = false;
  #ref = {
    imgRegistry: ImageRegistry,
  };

  tbFilter = null;
  #filter = null;
  get filter() { return this.#filter; }
  set filter(v) {
    const oldValue = this.#filter;
    this.#filter = isNonEmptyString(v);
    this.requestUpdate("filter", oldValue);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
  }

  show() {
    if (this.#isShown) return;
    document.body.appendChild(this);

    this.update();

    // this.$(this.guid).showPopover();
    this.#isShown = true;
  }

  render() {
    return html`
<div id="ImgRegistryBrowser">
  ${this.renderSearchField()}
  ${this.renderResults()}
</div>
    `;
  }

  #filterChanged() {
    console.log("changed:filter", this.tbFilter.value);
    this.filter = this.tbFilter.value;
  }

  renderSearchField() {
    return html`
<az-text id="tbFilter" scope="this" title="Filter" placeholder="*hamburger*" @change=${this.#filterChanged}></az-text>
    `;
  }

  getFilteredUris() {
    const filter = this.filter && this.filter !== "" ? this.filter : null;
    return this.#ref.imgRegistry.getUris()/*.filter(uri => isString(filter) ? matchPattern(uri, filter) : true)*/;
  }
  renderResults() {
    const filteredUris = this.getFilteredUris();
    return html`
${/*filteredUris.length ? */filteredUris.map(uri => this.renderUri(uri))/*: "No matches"*/}
    `;
  }

  renderUri(uri) {
    return html`
<h2>${uri}</h2>
${this.#ref.imgRegistry.getRecords(uri).map(rec => this.renderRecord(uri, rec))}
    `;
  }

  recClick(uri, { format, media, isoLang, theme } = {}) {

    let spec = `${format}://${uri}`;

    if (media || isoLang || theme) {
      if (media) media = `m=${media}`;
      if (isoLang) isoLang = `i=${isoLang}`;
      if (theme) theme = `t=${theme}`;
      spec += `?` + [media, isoLang, theme].filter(isString).join("&");
    }

    writeToClipboard(spec);
    toast(`Copied "${spec}"`, { timeout: 3_000 });
  }

  renderRecord(uri, rec) {
    return html`
<div class="record" @click="${() => this.recClick(uri, rec)}">
  ${verbatimHtml(rec.produceContent().content)}
</div>
    `;
  }
}

customElements.define("az-img-registry-browser", ImageRegistryBrowser);

window.dbgImgs = ImageRegistryBrowser.browse.bind(ImageRegistryBrowser);
