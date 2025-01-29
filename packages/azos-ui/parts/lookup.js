/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isArrayOrNull, isOf, isTrue } from "azos/aver";
import { AzosElement, html, parseRank, parseStatus, verbatimHtml } from "../ui";
import { lookupStyles } from "./styles";
import { isAssigned, isNonEmptyString, isObject, isString } from "azos/types";
import { matchPattern } from "azos/strings";

import { ImageRegistry } from "azos/bcl/img-registry";


/**
 * Provides abstraction for a Lookup / Typeahead Suggestion / AutoComplete protocol.
 *
 * Create an instance of a lookup and associate it with your field (az-text, etc). The Lookup receives the triggers and responds
 *   appropriately
 *
 * {@link Lookup.feed} a Lookup an owner, data, and context to open a dialog attached to the owner presenting a list of
 *  results. The results can be scrolled via shift/tab and arrow keys, selected with enter, and canceled with escape.
 */
export class Lookup extends AzosElement {
  static styles = [lookupStyles];

  static properties = {
    owner: { type: Object },
    results: { type: Array },
    minChars: { type: Number },
    debounceMs: { type: Number },
  };

  #owner = null;
  #result;
  #focusedResultElm;

  #promise;
  #resolve;
  #reject;

  #bound_onKeydown = this.#onKeydown.bind(this);
  #bound_onDocumentClick = this.#onDocumentClick.bind(this);
  #bound_onFeed = this.#onFeed.bind(this);
  #bound_onOwnerBlur = this.#onOwnerBlur.bind(this);
  #bound_setPopoverPosition = this.#setPopoverPosition.bind(this);

  constructor({ debounceMs, } = {}) {
    super();
    this.debounceMs = debounceMs ?? 200;
  }

  /** connectedCallback links the references; property is protected to allow for override. */
  _ref = null;

  /**
   * Get a list of data matching pattern and context. Override to customize data fetching.
   * @param {Object|String} pattern the filter criteria
   * @param {Object|null} ctx additional filter context
   * @returns {any[]} the results fetched from service or `data` matching pattern and ctx.
   */
  // eslint-disable-next-line no-unused-vars
  async _getData(pattern, ctx) {
    // return this._ref.myService.fetchData(pattern, ctx);
    return [];
  }

  /**
   * Selects a choice and resolves shownPromise
   * @param {any} choice the selection from among {@link #results}
   */
  _select(choice) {
    isTrue(this.results.includes(choice));
    let gvc = 0;
    this.#result = choice;
    this.#resolve(choice);
    this.dispatchEvent(new CustomEvent("lookupSelect", { detail: { get value() { gvc++; return choice; } } }));
    if (gvc === 0 && this.owner) this.owner.setValueFromInput(choice[0]);
    this._cleanup();
  }

  /** hide dialog and reject shownPromise */
  _cancel() {
    if (this.isShown) this.#reject("canceled");
    this._cleanup();
  }

  /** Clean up after dialog closes */
  _cleanup() {
    this.#cleanupDebounceTimer();
    this.#teardownOwner();
    this.#promise = null;
    this.#focusedResultElm = null;
    this.update();//sync update dom build
    this.dialog.hidePopover();
  }


  /**
   * Highlight the text based on the query. Wraps matches with span.highlight and returns verbatimHtml.
   * @param {String} text the text to highlight
   * @param {String} query the pattern to highlight within the text
   * @returns {HTMLTemplateElement|String} the result of highlighting--wrapped in verbatimHtml if wrapping with spans.
   */
  _highlightMatch(text, query) {
    const regex = new RegExp(`(${query.replaceAll('*', '')})`, "gi");
    const result = text.replace(regex, `<span class="highlight">$1</span>`);
    return verbatimHtml(result);
  }

  get owner() { return this.#owner; }
  set owner(v) {
    isOf(v, AzosElement);
    const oldValue = this.#owner;
    this.#owner = v;
    this.requestUpdate("owner", oldValue);
  }

  get result() { return this.#result; }

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

  #setPopoverPosition() {
    const owner = this.owner;
    const dialog = this.dialog;

    if (!this.isOpen || !owner || !dialog) return;

    const ownerRect = owner.getBoundingClientRect();
    const dialogRect = dialog.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = ownerRect.bottom;
    let left = ownerRect.left;

    // console.log(ownerRect, dialogRect, viewportWidth, viewportHeight, top, left, owner.offsetTop, owner.offsetLeft, owner.offsetHeight);

    if (left + dialogRect.width > viewportWidth) left = viewportWidth - dialogRect.width;
    if (top + dialogRect.height > viewportHeight) top = ownerRect.top - dialogRect.height;

    dialog.style.top = `${top}px`;
    dialog.style.left = `${left}px`;
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
        this._cancel();
        break;
      case "Tab":
        if (this.results.length) {
          this.#advanceSoftFocus(!e.shiftKey);
        } else {
          preventDefault = false;
          if (this.isOpen) this._cancel();
        }
        break;
      case "ArrowUp":
        this.#advanceSoftFocus(false);
        break;
      case "ArrowDown":
        this.#advanceSoftFocus();
        break;
      case "Enter":
        if (!this.results.length) return this._cancel();
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
    this._cancel();
  }

  #onFeed(evt) {
    const { owner, value, ctx } = evt.detail;
    this.feed(owner, value, ctx);
  }

  #onOwnerBlur() {
    console.log("Blurred");
    clearTimeout(this.#debounceTimerRef);
    setTimeout(() => {
      if (this.isOpen) this._cancel()
      this.#teardownOwner();
    }, this.debounceMs);
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

  #cleanupDebounceTimer() { this.#debounceTimerRef = clearTimeout(this.#debounceTimerRef); }

  #attachToDOM(arena) {
    arena.shadowRoot.appendChild(this);
    this.update();
  }

  #debounceTimerRef = null;
  async feed(owner, data, ctx) {
    if (this.#debounceTimerRef) this.#cleanupDebounceTimer();

    if (!data?.length && this.isOpen) return this._cancel();

    if (!this.owner || owner !== this.owner) {
      if (this.isOpen) this._cancel();
      this.owner = owner;
    }

    if (this.minChars && isString(data) && data.length <= this.minChars) return;
    this.#setupOwner();

    // console.info(`beginning debounce`);
    this.#debounceTimerRef = setTimeout(() => this._performFilter(owner, data, ctx), this.debounceMs);
  }

  #ownerSetup = false;
  #setupOwner() {
    if (this.#ownerSetup) return;
    this.#ownerSetup = true;
    this.#owner.addEventListener("blur", this.#bound_onOwnerBlur);
  }

  #teardownOwner() {
    if (!this.#ownerSetup) return;
    this.#ownerSetup = false;
    this.#owner.removeEventListener("blur", this.#bound_onOwnerBlur);
  }

  async _performFilter(owner, data, ctx) {
    // console.info(`debounced. open: ${this.isOpen}`);
    if (!this.isConnected) this.#attachToDOM(owner.arena);
    if (!this.isOpen) this.open(owner);
    this.results = await this._getData(data, ctx);
    this.update();
    if (!this.focusedResultElm) this.focusedResultElm = this.resultElms[0] ?? null;
  }

  /**
   * Shows a Lookup dialog
   * @returns true if dialog was opened; false if it was previously opened
   */
  open(owner) {
    // console.info(`open: ${this.isOpen}`);
    if (this.isOpen) return false;
    this.#result = null;
    this.#promise = new Promise((res, rej) => {
      this.#resolve = res;
      this.#reject = rej;
    }).catch(e => this.writeLog("Info", e));

    if (!owner) this.writeLog("Warning", `Lookup does not have an owner.`);

    this.dialog.showPopover();
    this.update();
    this.#setPopoverPosition();

    return true;
  }

  connectedCallback() {
    super.connectedCallback();
    window.document.addEventListener("keydown", this.#bound_onKeydown);
    window.document.addEventListener("click", this.#bound_onDocumentClick);
    window.addEventListener("resize", this.#bound_setPopoverPosition);
    window.addEventListener("scroll", this.#bound_setPopoverPosition);
    this.addEventListener("lookupFeed", this.#bound_onFeed);
    if (this._ref !== null) this.link(this._ref);
  }

  disconnectedCallback() {
    window.document.removeEventListener("keydown", this.#bound_onKeydown);
    window.document.removeEventListener("click", this.#bound_onDocumentClick);
    window.removeEventListener("resize", this.#bound_setPopoverPosition);
    window.removeEventListener("scroll", this.#bound_setPopoverPosition);
    this.removeEventListener("lookupFeed", this.#bound_onFeed);
    // This is added to the owner when owner property is set
    this.#teardownOwner();
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
    ].filter(isNonEmptyString).join(";");

    return html`
<div id="pop" popover="manual" class="${cls}" style="${stl}">
  ${this.renderBody()}
</div>
    `;
  }

  /**
   * @returns render `noResults` or results mapped to {@link renderResult}
   */
  renderBody() {
    if (!this.results || !this.results.length) return html`<span class="noResults">No results</span>`;
    return html`
<ul class="results" @mouseover="${e => this.#onMouseOver(e)}" @click="${e => this.#onResultsClick(e)}">
    ${this.results.map((result, index) => this.renderResult(result, index))}
</ul>
    `;
  }

  /**
   * @param {any} result a result from the resultSet
   * @param {Number} index the index of the result within the resultSet
   * @returns html template to render a single result container, calls {@link renderResultBody}
   */
  renderResult(result, index) {
    const cls = [
      'result',
      this.focusedResultElmIndex === index ? 'focused' : ''
    ].filter(isNonEmptyString).join(' ');

    return html`
<li id="result-${index}" class="${cls}">${this.renderResultBody(result)}</li>
    `;
  }

  /**
   * @param {any} result a data point from the results
   * @returns html template to render a single result body
   */
  // eslint-disable-next-line no-unused-vars
  renderResultBody(result) {
    return html`NO CONTENT`;
  }
}

export class StaticDataLookup extends Lookup {
  constructor({ debounceMs } = {}) { super({ debounceMs }); }

  _filterPattern = "";

  _filterFn(one, filterPattern) { return matchPattern(one, filterPattern); }

  async _getData(pattern, ctx) {
    if (ctx) this.ctx = ctx;
    pattern = isNonEmptyString(pattern) ? `*${pattern}*` : "*";
    this._filterPattern = pattern;
    let filtered = this.data;
    try { filtered = this.data.filter(one => this._filterFn(one, pattern), this); }
    catch (e) { console.error(e); }
    return filtered;
  }

  #data;

  get data() { return this.#data; }
  set data(v) { this.#data = isArrayOrNull(v) ?? []; }

  get filterPattern() { return this._filterPattern }

  renderResultBody(result) {
    return html`
<div>
  <span>${this._highlightMatch(`${result}`, this._filterPattern)}</span>
</div>
    `;
  }
}

/** This lookup's data is crafted from the valueList property of the owner (anything extending field-part). */
export class ValueListLookup extends StaticDataLookup {
  constructor({ debounceMs } = {}) { super({ debounceMs }); }

  _filterFn(one, filterPattern) { return one.some(str => matchPattern(str, filterPattern)); }

  async feed(owner, match, ctx) {
    isTrue(isObject(owner.valueList));
    this.data = Object.entries(owner.valueList);
    super.feed(owner, match, ctx);
  }

  renderResultBody(result) {
    const [key, value] = result;
    return html`
<div>
  <span>${this._highlightMatch(`${value} (${key})`, this._filterPattern)}</span>
</div>
    `;
  }
}

/**
 * A clone of ValueList lookup but settings its own data in constructor for testing purposes.
 *  NOTE: This could probably be made to be a StaticDataLookup with some formal data make-up
 *    but that's for another day.
 */
export class XYZAddressLookup extends StaticDataLookup {
  constructor({ debounceMs } = {}) {
    super({ debounceMs });

    this.data = [
      { street1: "1600 Pennsylvania Ave NW", city: "Washington", state: "DC", zip: "20500", country: "USA" },
      { street1: "700 Highland Rd", city: "Macedonia", state: "OH", zip: "44056", country: "USA" },
      { street1: "600 Biscayne Blvd NW", city: "Miami", state: "FL", zip: "33132", country: "USA" },
      { street1: "2 15th St NW", city: "Washington", state: "DC", zip: "20024", country: "CN" },
    ];
  }

  _ref = { imgRegistry: ImageRegistry };

  _filterFn(one, filterPattern) {
    return ["street1", "street2", "city", "state", "zip"]
      .map(k => one[k])
      .filter(isNonEmptyString)
      .some(str => matchPattern(str, filterPattern));
  }

  renderResultBody(result) {
    return html`
  <div style="display:flex;gap:5px;">
    <div style="width:16px">${verbatimHtml(this._ref.imgRegistry.resolveSpec("svg://azos.ico.checkmark").produceContent().content)}</div>
    <span>${this._highlightMatch(`${result.street1}, ${result.city}, ${result.state} ${result.zip}`, this.filterPattern)}</span>
  </div>
      `;
  }
}

function isWithinParent(elm, parent) {
  // console.info(elm, parent);
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
window.customElements.define("az-value-list-lookup", ValueListLookup);
window.customElements.define("xyz-address-lookup", XYZAddressLookup);
