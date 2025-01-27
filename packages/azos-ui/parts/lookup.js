/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isArrayOrNull, isOf, isTrue } from "azos/aver";
import { AzosElement, html, parseRank, parseStatus, verbatimHtml } from "../ui";
import { lookupStyles } from "./styles";
import { isAssigned, isFunction, isNonEmptyString, isObject, isString } from "azos/types";
import { matchPattern } from "azos/strings";


/**
 * Provides abstraction for a Lookup Protocol.
 *
 * Create an instance of a lookup and associate it with your field (az-text, etc). The Lookup receives the triggers and responds
 *   appropriately
 */
export class Lookup extends AzosElement {
  static styles = [lookupStyles];

  static properties = {
    owner: { type: Object },
    source: { type: Object },
    results: { type: Array },
    minChars: { type: Number },
    debounceMs: { type: Number },
  };

  constructor(owner, source, { debounceMs } = {}) {
    super();
    this.owner = owner ? isOf(owner, AzosElement) : null;
    this.source = source ? isOf(source, ValueListLookupSource) : this._makeDefaultSource();
    this.debounceMs = debounceMs ?? 200;
  }

  #result;
  #source;

  #focusedResultElm;

  #promise;
  #resolve;
  #reject;

  #bound_onKeydown = this.#onKeydown.bind(this);
  #bound_onDocumentClick = this.#onDocumentClick.bind(this);
  #bound_onFeed = this.#onFeed.bind(this);
  #bound_onOwnerBlur = this.#onOwnerBlur.bind(this);

  get result() { return this.#result; }
  get source() { return this.#source; }
  set source(v) {
    const oldValue = this.#source;
    this.#source = v;
    this.requestUpdate("source", oldValue);
  }

  get selectedResult() { return this.results[this.focusedResultElmIndex] ?? null; }

  get resultElms() { return [...this.shadowRoot.querySelectorAll(".result")]; }

  get focusedResultElm() { return this.#focusedResultElm; }
  set focusedResultElm(v) {
    const oldValue = this.#focusedResultElm;
    this.#focusedResultElm = v;
    this.requestUpdate("focusedResultElm", oldValue);
  }

  get focusedResultElmIndex() { return this.resultElms.indexOf(this.focusedResultElm); }

  get shownPromise() { return this.#promise; }
  get isOpen() { return isAssigned(this.#promise); }

  get dialog() { return this.$("pop"); }

  _makeDefaultSource() {
    return new ValueListLookupSource();
  }

  #onResultsClick(e) {
    // console.log(e);
    const selectedResultElm = e.target.closest(".result");
    if (!selectedResultElm) return;
    this.focusedResultElm = selectedResultElm;
    this._select(this.selectedResult);
    e.preventDefault();
  }

  #onMouseOver(e) {
    const resultElm = e.target.closest(".result");
    if (!resultElm) return;
    this.focusedResultElm = resultElm;
  }

  #onKeydown(e) {
    if (!this.isOpen) return;

    let preventDefault = true;
    switch (e.key) {
      case "Escape":
        this.#cancel();
        break;
      case "Tab":
        if (this.results.length) {
          this.#advanceSoftFocus(!e.shiftKey);
        } else {
          preventDefault = false;
          if (this.isOpen) this.#cancel();
        }
        break;
      case "ArrowUp":
        this.#advanceSoftFocus(false);
        break;
      case "ArrowDown":
        this.#advanceSoftFocus();
        break;
      case "Enter":
        if (!this.results.length) return this.#cancel();
        this._select(this.selectedResult);
        break;
      default:
        preventDefault = false;
        break;
    }
    if (preventDefault) e.preventDefault();
  }

  #onDocumentClick(e) {
    if (!this.isOpen) return;
    const target = e.composedPath()[0]; // Account for shadowDOM
    if (isWithinParent(target, this) || (this.owner && isWithinParent(target, this.owner))) {
      e.preventDefault();
      return;
    }
    this.#cancel();
  }

  #onFeed(evt) {
    const { owner, value, ctx } = evt.detail;
    this.feed(owner, value, ctx);
  }

  #onOwnerBlur() {
    clearTimeout(this.#debounceTimerRef);
    setTimeout(() => { if (this.isOpen) this.#cancel() }, 1000);
  }

  #advanceSoftFocus(forward = true) {
    if (!this.resultElms.length) return false;
    const resultElms = this.resultElms;
    let nextIndex;
    if (forward)
      nextIndex = (this.focusedResultElmIndex + 1) % resultElms.length;
    else
      nextIndex = (this.focusedResultElmIndex - 1 + resultElms.length) % resultElms.length;
    this.focusedResultElm = resultElms[nextIndex] ?? null;
    return true;
  }

  /** hide dialog and cancel (reject) promise */
  #cancel() {
    this.#reject("canceled");
    this.#cleanup();
  }

  /** Clean up after dialog closes */
  #cleanup() {
    this.#cleanupDebounceTimer();
    this.owner.removeEventListener("blur", this.#bound_onOwnerBlur);
    this.#promise = null;
    this.#focusedResultElm = null;
    this.update();//sync update dom build
    this.dialog.hidePopover();
  }

  #cleanupDebounceTimer() {
    clearTimeout(this.#debounceTimerRef);
    this.#debounceTimerRef = null;
  }

  #attachToDOM(arena) {
    arena.shadowRoot.appendChild(this);
    this.update();
  }

  #positionPopover() {
    const owner = this.owner;
    const dialog = this.dialog;

    if (!this.isOpen || !owner || !dialog) return;

    const ownerRect = owner.getBoundingClientRect();
    const dialogRect = dialog.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = ownerRect.bottom;
    let left = ownerRect.left;

    console.log(ownerRect, dialogRect, viewportWidth, viewportHeight, top, left, owner.offsetTop, owner.offsetLeft, owner.offsetHeight);

    if (left + dialogRect.width > viewportWidth) left = viewportWidth - dialogRect.width;
    if (top + dialogRect.height > viewportHeight) top = ownerRect.top - dialogRect.height;

    dialog.style.top = `${top}px`;
    dialog.style.left = `${left}px`;
  }

  /**
   * Selects a choice and resolves (resolve) promise
   * @param {any} choice the selection from among {@link #results}
   */
  _select(choice) {
    isTrue(this.results.includes(choice));
    let gvc = 0;
    this.#result = choice;
    this.#resolve(choice);
    this.dispatchEvent(new CustomEvent("lookupSelect", { detail: { get value() { gvc++; return choice; } } }));
    // console.log(gvc, choice);
    if (gvc === 0 && this.owner) this.owner.setValueFromInput(choice[0]);
    this.#cleanup();
  }

  #debounceTimerRef = null;
  async feed(owner, data, ctx) {
    if (this.#debounceTimerRef) this.#cleanupDebounceTimer();

    if (!data?.length && this.isOpen) return this.#cancel();

    if (!this.owner || owner !== this.owner) {
      this.#cancel();
      this.owner = isOf(owner, AzosElement);
      this.owner.addEventListener("blur", this.#bound_onOwnerBlur);
    }

    if (this.minChars && isString(data) && data.length <= this.minChars) return;

    // console.info(`beginning debounce`);
    this.#debounceTimerRef = setTimeout(() => this._performFilter(owner, data, ctx), this.debounceMs);
  }

  async _performFilter(owner, data, ctx) {
    // console.info(`debounced`);
    if (!this.isConnected) this.#attachToDOM(owner.arena);
    if (!this.isOpen) this.open(owner);
    this.results = await this.#source.getData(data, ctx);
    this.update();
    if (!this.focusedResultElm) this.focusedResultElm = this.resultElms[0] ?? null;
  }

  /**
   * Shows a Lookup dialog
   * @returns true if dialog was opened; false if it was previously opened
   */
  open(owner) {
    if (this.isOpen) return false;
    this.#promise = new Promise((res, rej) => {
      this.#resolve = res;
      this.#reject = rej;
    }).catch(e => this.writeLog("Info", e));

    if (!owner) this.writeLog("Warning", `Lookup does not have an owner.`);

    this.dialog.showPopover();

    return true;
  }

  // updated() { this.#positionPopover(); }

  connectedCallback() {
    super.connectedCallback();
    window.document.addEventListener("keydown", this.#bound_onKeydown);
    window.document.addEventListener("click", this.#bound_onDocumentClick);
    this.addEventListener("lookupFeed", this.#bound_onFeed);
  }

  disconnectedCallback() {
    window.document.removeEventListener("keydown", this.#bound_onKeydown);
    window.document.removeEventListener("click", this.#bound_onDocumentClick);
    this.removeEventListener("lookupFeed", this.#bound_onFeed);
    if (this.owner) this.owner.removeEventListener("blur", this.#bound_onOwnerBlur);
    super.disconnectedCallback();
  }

  render() {
    const cls = [
      parseRank(this.rank, true),
      parseStatus(this.status, true),
      this.isOpen ? "" : "hidden",
      this.owner ? "hasOwner" : "",
    ].filter(isNonEmptyString).join(" ");

    const stl = [
      this.owner ? `left: ${this.owner.offsetLeft - 0}px` : "",
      this.owner ? `top: ${this.owner.offsetTop + this.owner.offsetHeight + 0}px` : "",
    ].filter(isNonEmptyString).join(";");

    return html`
<div id="pop" popover="manual" class="${cls}" style="${stl}">
  ${this.renderBody()}
</div>
    `;
  }

  renderBody() {
    if (!this.results || !this.results.length) return html`<span class="noResults">No results</span>`;
    return html`
<ul class="results" @mouseover="${e => this.#onMouseOver(e)}" @click="${e => this.#onResultsClick(e)}">
    ${this.results.map((result, index) => this.renderResult(result, index))}
</ul>
    `;
  }

  renderResult(result, index) {
    const cls = [
      'result',
      this.focusedResultElmIndex === index ? 'focused' : ''
    ].filter(isNonEmptyString).join(' ');

    return html`
<li id="result-${index}" class="${cls}">${this.renderResultBody(result)}</li>
    `;
  }

  highlightMatch(text, query) {
    const regex = new RegExp(`(${query.replaceAll('*', '')})`, "gi");
    const result = text.replace(regex, `<span class="highlight">$1</span>`);
    return verbatimHtml(result);
  }

  renderResultBody(result) {
    const [key, value] = result;
    return html`
<div>
  <span>${this.highlightMatch(`${value} (${key})`, this.source.filterPattern)}</span>
</div>
    `;
  }
}

export class DynamicLookupSource {
  constructor(app) {
    this.#app = isObject(app);
  }

  #svc = null;
  #app = null;
  get app() { return this.#app; }

  async getData(pattern, ctx) {
    // this.#svc ??= this.app.linker.resolve(MyDynamicLookupService);
    return this.#svc.getData(pattern, ctx);
  }
}

/**
 * Provides results for lookup source.
 *  NOTES:
 *   - With a LookupSource instance, assign a `filterFn` which has `this` context.
 *   - Extend it to add a service-oriented architecture
 *   -
 */
export class ValueListLookupSource extends DynamicLookupSource {
  static DFLT_FILTER_FN = (one, filterPattern) => matchPattern(one, filterPattern);

  constructor(app, data, filterFn) {
    super(app); // app is unused.
    this.data = data;
    this.filterFn = filterFn;
  }

  #data;
  #filterPattern;
  _filterFn;

  get data() { return this.#data; }
  set data(v) { this.#data = isArrayOrNull(v) ?? []; }

  get filterPattern() { return this.#filterPattern }

  get filterFn() { return this._filterFn; }
  set filterFn(v) { this._filterFn = isFunction(v) ? v : ValueListLookupSource.DFLT_FILTER_FN; }

  async getData(pattern, ctx) {
    if (ctx) this.ctx = ctx;
    pattern = isNonEmptyString(pattern) ? `*${pattern}*` : "*";
    this.#filterPattern = pattern;
    let filtered = this.data;
    try { filtered = this.data.filter(one => this.filterFn(one, pattern), this); }
    catch (e) { console.error(e); }
    return filtered;
  }
}

export class XYZAddressLookup extends Lookup {
  constructor(owner, source) { super(owner, source); }

  _makeDefaultSource() {
    return new XYZAddressLookupSource();
  }

  renderResultBody(result) {
    return html`
<div>
  <span>${this.highlightMatch(`${result.street1}, ${result.city}, ${result.state} ${result.zip}`, this.source.filterPattern)}</span>
</div>
    `;
  }
}

export class XYZAddressLookupSource extends ValueListLookupSource {
  constructor() {
    super();
    this.data = [
      { street1: "1600 Pennsylvania Ave NW", city: "Washington", state: "DC", zip: "20500" },
      { street1: "700 Highland Rd", city: "Macedonia", state: "OH", zip: "44056" },
      { street1: "600 Biscayne Blvd NW", city: "Miami", state: "FL", zip: "33132" },
      { street1: "2 15th St NW", city: "Washington", state: "DC", zip: "20024" },
    ];
  }

  _filterFn = (one, filterPattern) => ["street1", "street2", "city", "state", "zip"]
    .map(k => one[k])
    .filter(isNonEmptyString)
    .some(str => matchPattern(str, filterPattern));
}

function isWithinParent(elm, parent) {
  console.info(elm, parent);
  let currentElement = elm;
  while (currentElement) {
    if (currentElement === parent) return true;

    if (currentElement.assignedSlot)
      currentElement = currentElement.assignedSlot;
    else if (currentElement.parentElement)
      currentElement = currentElement.parentElement;
    else { // dive into shadowDOM
      const root = currentElement?.getRootNode();
      if (root instanceof ShadowRoot) currentElement = root.host;
      else break;
    }
  }
  return false;
}

window.customElements.define("az-lookup", Lookup);
window.customElements.define("xyz-address-lookup", XYZAddressLookup);
