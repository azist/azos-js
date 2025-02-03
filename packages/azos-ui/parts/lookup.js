/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOf, isTrue } from "azos/aver";
import { AzosElement, html, parseRank, parseStatus, verbatimHtml } from "../ui";
import { lookupStyles } from "./styles";
import { isAssigned, isNonEmptyString, isString } from "azos/types";
import { isEmpty, matchPattern } from "azos/strings";

import { ImageRegistry } from "azos/bcl/img-registry";


/**
 * Provides abstraction for a Lookup / Typeahead Suggestion / AutoComplete protocol.
 *
 * Create an instance of a lookup and associate it with your field (az-text, etc). The Lookup receives the triggers and responds
 *   appropriately
 *
 * {@link Lookup.feed} a Lookup an owner searchPattern to open a popover attached to the owner presenting a list of
 *  results. The results can be scrolled via shift/tab and arrow keys, selected with enter, and cancelled with escape.
 */
export class Lookup extends AzosElement {
  static styles = [lookupStyles];

  static properties = {
    dataContext: { type: Object },
    debounceMs: { type: Number },
    minChars: { type: Number },
    owner: { type: Object },
    results: { type: Array },
    searchPattern: { type: String },
  };

  #debounceTimerRef = null;
  #blurTimerRef = null;
  #focusedResultElm;
  #owner = null;
  #ownerSetup = false;
  // #loadingData = false;
  #result;

  #promise;
  #resolve;
  #reject;

  #bound_onDocumentClick = this.#onDocumentClick.bind(this);
  #bound_onFeed = this.#onFeed.bind(this);
  #bound_onKeydown = this.#onKeydown.bind(this);
  #bound_onOwnerBlur = this.#onOwnerBlur.bind(this);
  #bound_setPopoverPosition = this.#setPopoverPosition.bind(this);

  constructor({ debounceMs, } = {}) {
    super();
    this.debounceMs = debounceMs ?? 300;
  }

  /** hide dialog and reject shownPromise */
  _cancel() {
    if (this.isShown) this.#reject("cancelled");
    this._closePopover(true);
  }

  /** Clean up after dialog closes */
  _closePopover(isCancel = false) {
    this.#cleanupDebounceTimer();
    this.#cleanupBlurTimer();
    this._lookupCompleted(isCancel);
    this._disconnectListeners();
    this.#teardownOwner();
    this.#promise = null;
    this.#focusedResultElm = null;
    this.searchPattern = null;
    this.update();//sync update dom build
    this.popover.hidePopover();
    console.groupEnd();
  }

  /** The debounced method to prepareAndGetData */
  async _debouncedFeed(searchPattern) {
    // this.#loadingData = true;
    this.open();
    this.results = await this.prepareAndGetData(searchPattern);
    this.update();
    // this.#loadingData = false;
    this.#setPopoverPosition();
    if (!this.focusedResultElm) this.focusedResultElm = this.resultElms[0] ?? null;
  }

  /**
   * Highlight the text based on the query. Wraps matches with span.highlight and returns verbatimHtml.
   * @param {String} text the text to highlight
   * @param {String} searchPattern the searchPattern
   * @returns {HTMLTemplateElement|String} the result of highlighting--wrapped in verbatimHtml if wrapping with spans.
   */
  _highlightMatch(text, searchPattern) {
    if (!searchPattern) return text;
    const regex = new RegExp(`(${searchPattern.replaceAll('*', '')})`, "gi");
    const result = text.replace(regex, `<span class="highlight">$1</span>`);
    return verbatimHtml(result);
  }

  // eslint-disable-next-line no-unused-vars
  _lookupCompleted(isCancel) { }

  /**
   * Selects a choice and resolves shownPromise
   * @param {any} choice the selection from among {@link #results}
   */
  _select(choice) {
    isTrue(this.results.includes(choice));
    this.#result = choice;
    this.#resolve(choice);

    const evt = new CustomEvent("lookupSelect", { detail: { value: choice }, cancelable: true, bubbles: true });
    this.dispatchEvent(evt);
    if (!evt.defaultPrevented) {
      console.debug("Setting owner value manually.");
      this.owner.setValueFromInput(choice[0]);
    }

    this._closePopover();
  }

  _connectListeners() {
    window.document.addEventListener("keydown", this.#bound_onKeydown);
    window.document.addEventListener("click", this.#bound_onDocumentClick);
    window.addEventListener("resize", this.#bound_setPopoverPosition);
    window.addEventListener("scroll", this.#bound_setPopoverPosition);
  }

  _disconnectListeners() {
    window.document.removeEventListener("keydown", this.#bound_onKeydown);
    window.document.removeEventListener("click", this.#bound_onDocumentClick);
    window.removeEventListener("resize", this.#bound_setPopoverPosition);
    window.removeEventListener("scroll", this.#bound_setPopoverPosition);
  }

  get focusedResultElm() { return this.#focusedResultElm; }
  set focusedResultElm(v) {
    const oldValue = this.#focusedResultElm;
    this.#focusedResultElm = v;
    this.#scrollResultIntoView(v);
    this.requestUpdate("focusedResultElm", oldValue);
  }

  get focusedResultElmIndex() { return this.resultElms.indexOf(this.focusedResultElm); }

  get owner() { return this.#owner; }
  set owner(v) {
    isOf(v, AzosElement);
    const oldValue = this.#owner;
    this.#owner = v;
    this.requestUpdate("owner", oldValue);
  }

  get popover() { return this.$("pop"); }

  get result() { return this.#result; }
  get selectedResult() { return this.results[this.focusedResultElmIndex] ?? null; }

  get resultElms() { return [...this.shadowRoot.querySelectorAll(".result")]; }


  get shownPromise() { return this.#promise; }
  get isOpen() { return isAssigned(this.#promise); }

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

  #cleanupDebounceTimer() { if (this.#debounceTimerRef) this.#debounceTimerRef = clearTimeout(this.#debounceTimerRef); }
  #cleanupBlurTimer() { if (this.#blurTimerRef) this.#blurTimerRef = clearTimeout(this.#blurTimerRef); }

  #onDocumentClick(evt) {
    if (!this.isOpen) return;
    const target = evt.composedPath()[0]; // Account for shadowDOM
    if (isWithinParent(target, this) || (this.owner && isWithinParent(target, this.owner))) {
      evt.preventDefault();
      return;
    }
    this._cancel();
  }

  #onFeed(evt) {
    evt.preventDefault();
    const { owner, value } = evt.detail;
    this.feed(owner, value);
  }

  #onKeydown(evt) {
    if (!this.isOpen) return;

    let preventDefault = true;
    switch (evt.key) {
      case "Escape":
        this._cancel();
        break;
      case "Tab":
        if (this.results.length) {
          this.#advanceSoftFocus(!evt.shiftKey);
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
    if (preventDefault) evt.preventDefault();
  }

  #onMouseOver(evt) {
    const resultElm = evt.target.closest(".result");
    if (!resultElm) return;
    this.focusedResultElm = resultElm;
  }

  #onOwnerBlur() {
    this.#cleanupDebounceTimer();
    this.#cleanupBlurTimer();
    this.#blurTimerRef = setTimeout(() => {
      if (this.isOpen) this._cancel()
      this.#teardownOwner();
    }, this.debounceMs);
  }

  #onResultsClick(evt) {
    const selectedResultElm = evt.target.closest(".result");
    if (!selectedResultElm) return;
    this.focusedResultElm = selectedResultElm;
    this._select(this.selectedResult);
    evt.preventDefault();
  }

  #scrollResultIntoView(result) {
    isOf(result, HTMLLIElement);
    const resultBounds = result.getBoundingClientRect();
    const popoverBounds = this.popover.getBoundingClientRect();

    let top;
    if (resultBounds.top < popoverBounds.top) {
      const previousResult = result.previousElementSibling;
      const previousResultBounds = previousResult?.getBoundingClientRect() || null;
      top = resultBounds.top - popoverBounds.top - (previousResultBounds ? previousResultBounds.height / 1.5 : 20);
    } else if (resultBounds.bottom > popoverBounds.bottom) {
      const nextResult = result.nextElementSibling;
      const nextResultBounds = nextResult?.getBoundingClientRect() || null;
      top = resultBounds.bottom - popoverBounds.bottom + (nextResultBounds ? nextResultBounds.height / 1.5 : 20);
    }
    this.popover.scrollBy({
      top,
      left: 0,
      behavior: 'smooth'
    });
  }

  #setPopoverPosition() {
    console.log("setPopoverPosition()");
    const owner = this.owner;
    const popover = this.popover;
    const itemHeight = this.itemHeight ?? 36;
    this.maxItems = undefined;
    const maxItemsHeight = (this.maxItems ?? Infinity) * itemHeight;

    if (!this.isOpen || !owner || !popover) return;

    const ownerRect = owner.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let maxHeight = Math.min(viewportHeight - ownerRect.bottom, maxItemsHeight);

    let top = ownerRect.bottom;
    let left = ownerRect.left;

    console.log({ ownerRect, popoverRect, viewportWidth, viewportHeight, maxHeight, top, left });
    if (ownerRect.right < 0 || ownerRect.left > viewportWidth || ownerRect.top < 0 || ownerRect.top > viewportHeight)
      return this._cancel();

    if (ownerRect.left + popoverRect.width > viewportWidth)
      left = viewportWidth - popoverRect.width;
    if (ownerRect.bottom + popoverRect.height > viewportHeight) {
      maxHeight = Math.min(ownerRect.top, maxItemsHeight);
      top = ownerRect.top - popoverRect.height;
    }

    console.log({ ownerRect, popoverRect, viewportWidth, viewportHeight, maxHeight, top, left });

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
    popover.style.maxHeight = `${maxHeight}px`;
  }

  #setupNewOwner(owner) {
    if (this.#ownerSetup) return;
    this.#ownerSetup = true;
    this.owner = owner;
    // this.owner.addEventListener("blur", this.#bound_onOwnerBlur);
  }

  #teardownOwner() {
    if (!this.#ownerSetup) return;
    this.#ownerSetup = false;
    if (this.owner) this.owner.removeEventListener("blur", this.#bound_onOwnerBlur);
    this.#owner = null;
  }

  async feed(owner, searchPattern) {
    this.#cleanupDebounceTimer();
    this.#cleanupBlurTimer();

    if (!this.owner || (owner && owner !== this.owner)) {
      if (this.isOpen) this._cancel();
      this.#teardownOwner();
      this.#setupNewOwner(owner);
    }
    if (searchPattern === this.searchPattern) return;
    if (isEmpty(searchPattern) && this.isOpen) return this._cancel();
    if (this.minChars && isString(searchPattern) && searchPattern.length <= this.minChars) return;

    this.#debounceTimerRef = setTimeout(() => this._debouncedFeed(searchPattern), this.debounceMs);
  }

  async prepareAndGetData(searchPattern) {
    if (!this.owner) return null;
    this.searchPattern = searchPattern;
    this.prepareDataContext(searchPattern);
    return await this.getData();
  }

  prepareDataContext(searchPattern) {
    this.dispatchEvent(new CustomEvent("prepareDataContext", { detail: { searchPattern }, bubbles: false, cancelable: false }));
  }

  /**
   * Get a list of data matching pattern and context. Override to customize data fetching.
   * @returns {any[]} the results fetched from service
   */
  async getData() {
    const searchPattern = `*${this.searchPattern}*`;
    if (this.isOpen) return Object.entries(this.owner.valueList).filter(kvOne => kvOne.some(one => matchPattern(one, searchPattern)));
  }

  /**
   * Shows a Lookup dialog
   * @returns true if dialog was opened; false if it was previously opened
   */
  open() {
    if (this.isOpen) return false;
    console.groupCollapsed(`"${this.owner.id}"`);
    this.#result = null;
    this.#promise = new Promise((res, rej) => {
      this.#resolve = res;
      this.#reject = rej;
    }).catch(evt => this.writeLog("Info", evt));

    this.popover.showPopover();
    this.update();
    this.#setPopoverPosition();
    this._connectListeners();

    return true;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("lookupFeed", this.#bound_onFeed);
  }

  disconnectedCallback() {
    this.removeEventListener("lookupFeed", this.#bound_onFeed);
    super.disconnectedCallback();
  }

  render() {
    const cls = [
      parseRank(this.rank, true),
      parseStatus(this.status, true),
      this.isOpen ? "" : "hidden",
      this.owner ? "hasOwner" : "",
      // this.#loadingData ? "loading" : "",
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
    // if (this.#loadingData) return html`<div class="loader"></div>`;
    if (!this.results || !this.results.length) return html`<span class="noResults">No results</span>`;
    return html`
<ul class="results" @mouseover="${evt => this.#onMouseOver(evt)}" @click="${evt => this.#onResultsClick(evt)}">
    ${this.results.map((result, index) => this.renderResult(result, index))}
</ul>
    `;
  }

  /**
   * @param {any} result a result from the results
   * @param {Number} index the index of the result within the results
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
  renderResultBody(result) {
    const [key, value] = result;
    return html`
<div>
  <span>${this._highlightMatch(`${value} (${key})`, this.searchPattern)}</span>
</div>
    `;
  }
}

export class XYZAddressLookup extends Lookup {
  constructor({ debounceMs } = {}) {
    super({ debounceMs });

    this.data = [
      { street1: "1600 Pennsylvania Ave NW", city: "Washington", state: "DC", zip: "20500", country: "USA" },
      { street1: "700 Highland Rd", city: "Macedonia", state: "OH", zip: "44056", country: "USA" },
      { street1: "600 Biscayne Blvd NW", city: "Miami", state: "FL", zip: "33132", country: "USA" },
      { street1: "2 15th St NW", city: "Washington", state: "DC", zip: "20024", country: "CN" },
    ];
  }

  #ref = { imgRegistry: ImageRegistry };

  async getData() {
    const searchPattern = `*${this.searchPattern}*`;
    let filtered = this.data;

    try {
      filtered = this.data.filter(one => ["street1", "street2", "city", "state", "zip"]
        .map(k => one[k])
        .filter(isNonEmptyString)
        .some(str => matchPattern(str, searchPattern)));
    } catch (err) { console.error(err); }

    return filtered;
  }

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
  }

  renderResultBody(result) {
    return html`
  <div style="display:flex;gap:5px;">
    <div style="width:16px">${verbatimHtml(this.#ref.imgRegistry.resolveSpec("svg://azos.ico.checkmark").produceContent().content)}</div>
    <span>${this._highlightMatch(`${result.street1}, ${result.city}, ${result.state} ${result.zip}`, this.searchPattern)}</span>
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
window.customElements.define("xyz-address-lookup", XYZAddressLookup);
