/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
import { isAssigned, isNonEmptyString, isString } from "azos/types";
import { isEmpty, matchPattern } from "azos/strings";
import { LOG_TYPE } from "azos/log";
import { ABORT_ERROR_NAME, ABSTRACT } from "azos/coreconsts";

import { Part, css, html, parseRank, parseStatus, verbatimHtml } from "../../ui.js";


/**
 * Provides abstraction for a Lookup / Typeahead Suggestion / AutoComplete protocol.
 * Lookups are popover-like parts: you can customize where and how they get data in a context and customize how they render
 * the popover content itself.
 * Create an instance of a lookup and associate it with your field (az-text, etc). The Lookup receives the triggers and responds
 *   appropriately
 *
 * {@link Lookup.feed} a Lookup an owner searchPattern to open a popover attached to the owner presenting a list of
 *  results. The results can be scrolled via shift/tab and arrow keys, selected with enter, and cancelled with escape.
 */
export class Lookup extends Part {

  static styles = [css`
    .hidden{ display: none !important; }
    #pop{
      display: flex;
      flex-direction: column;
      position: fixed;
      min-width: 200px;
      max-width: 80vw;
      max-height: 80vh;
      margin: 0;
      padding: 0;
      background: var(--paper);
      box-shadow: 1px 4px 10px #585858;
      border: 1px solid #c2c2c2;
      border-radius: 10px;
      border-top-left-radius: 0;
      border-top-width: 1px;
      color: #656565;
      scrollbar-width: none;
      overflow-y: auto;

      &.onTop.onLeft{
        border-radius: 10px;
        border-bottom-right-radius: 0;
      }
      &.onTop{
        border-radius: 10px;
        border-bottom-left-radius: 0;
      }
      &.onLeft{
        border-radius: 10px;
        border-top-right-radius: 0;
      }
      &:not(.hasOwner){
        margin: revert;
        position: revert;
      }
    }
    ul{
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li, #pop > span.noResults{
      padding: 0.5em 1em;
    }
    li{
      &:focus-visible,
      &.focused{
        cursor: pointer;
        outline: 0;
        background: #ccc;
      }
      &+li{
        border-top: 1px solid #eee;
      }
    }
    .highlight{
      background-color: var(--vcl-codebox-hi-string-hover);
    }
    .loading .loader{
      display: flex;
      margin: 1ch;
      align-items: center;
      column-gap: 1ch;
    }
    .loader::after{
      --size: 2ch;
      content: "";
      width: var(--size);
      height: var(--size);
      border: 4px solid #dddddd;
      border-top-color: #336699;
      border-radius: 50%;
      animation: loader 1s ease infinite;
    }
    @keyframes loader{ to{ transform: rotate(1turn); }}
    `];

  static properties = {
    dataContext: { type: Object },
    debounceMs: { type: Number },
    minChars: { type: Number },
    maxItems: { type: Number },
    minItems: { type: Number },
    owner: { type: Object },
    results: { type: Array },
    searchPattern: { type: String },
  };

  #debounceTimerRef = null;
  #blurTimerRef = null;
  #debouncedRepositionPopoverTimerRef = null;
  #focusedResultElm;
  #owner = null;
  #ownerSetup = false;
  #loadingData = false;
  #result;

  #promise;
  #resolve;
  #reject;

  #bound_onDocumentClick = this.#onDocumentClick.bind(this);
  #bound_onKeydown = this.#onKeydown.bind(this);
  #bound_onOwnerBlur = this.#onOwnerBlur.bind(this);
  #bound_debouncedRepositionPopover = this.#debounced_repositionPopover.bind(this);

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
    this.#clearTimers();
    this._lookupCompleted(isCancel);
    this._disconnectListeners();
    this.#teardownOwner();
    this.#promise = null;
    this.#focusedResultElm = null;
    this.searchPattern = null;
    this.results = null;
    this.#loadingData = false;
    this.update();//sync update dom build
    this.popover.hidePopover();
    console.groupEnd();
  }

  /** The debounced method to prepareAndGetData */
  async _debouncedFeed(searchPattern) {
    this.#loadingData = true;
    this.focusedResultElm = null;
    this.open();
    const results = await this.prepareAndGetData(searchPattern);
    this.#loadingData = false;
    if (!results) return;

    this.results = results;
    this.update();
    this.#repositionPopover();
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
    if (!this.results.includes(choice)) return;
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
    window.addEventListener("resize", this.#bound_debouncedRepositionPopover);
    window.addEventListener("scroll", this.#bound_debouncedRepositionPopover);
  }

  _disconnectListeners() {
    window.document.removeEventListener("keydown", this.#bound_onKeydown);
    window.document.removeEventListener("click", this.#bound_onDocumentClick);
    window.removeEventListener("resize", this.#bound_debouncedRepositionPopover);
    window.removeEventListener("scroll", this.#bound_debouncedRepositionPopover);
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
    aver.isOfOrNull(v, Part);
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
  #cleanupDebouncedRepositionPopoverTimer() { if (this.#debouncedRepositionPopoverTimerRef) this.#debouncedRepositionPopoverTimerRef = clearTimeout(this.#debouncedRepositionPopoverTimerRef); }
  #clearTimers() {
    this.#cleanupDebounceTimer();
    this.#cleanupBlurTimer();
    this.#cleanupDebouncedRepositionPopoverTimer();
  }

  #onDocumentClick(evt) {
    if (!this.isOpen) return;
    const target = evt.composedPath()[0]; // Account for shadowDOM
    if (isWithinParent(target, this) || (this.owner && isWithinParent(target, this.owner))) {
      evt.preventDefault();
      return;
    }
    this._cancel();
  }

  #onKeydown(evt) {
    if (!this.isOpen) return;

    let preventDefault = true;
    switch (evt.key) {
      case "Escape":
        this._cancel();
        break;
      case "Tab":
        if (!this.results.length) {
          preventDefault = false;
          if (this.isOpen) this._cancel();
        } else if (this.results.length === 1) {
          this._select(this.selectedResult);
          preventDefault = false;
        } else {
          this.#advanceSoftFocus(!evt.shiftKey);
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
    this.#clearTimers();
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
    if (!result) return;

    aver.isOf(result, HTMLLIElement);
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

  #repositionPopover() {
    const owner = this.owner?.shadowRoot?.querySelector("input") || this.owner;
    const popover = this.popover;

    if (!this.isOpen || !owner || !popover) return;

    const PADDING = 5;
    const TOP_BOUNDARY = 0 + PADDING;
    const RIGHT_BOUNDARY = window.visualViewport.width - PADDING;
    const BOTTOM_BOUNDARY = window.visualViewport.height - PADDING;
    const LEFT_BOUNDARY = 0 + PADDING;

    const ITEM_HEIGHT = this.resultElms[0]?.getBoundingClientRect()?.height ?? 36;
    const MIN_ITEMS_HEIGHT = (this.minItems ?? 2) * ITEM_HEIGHT
    const MAX_ITEMS_HEIGHT = (this.maxItems ?? Infinity) * ITEM_HEIGHT;

    const ownerRect = owner.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();

    let top = ownerRect.bottom;
    let left = ownerRect.left;
    let maxHeight = Math.min(BOTTOM_BOUNDARY - ownerRect.bottom, MAX_ITEMS_HEIGHT);
    popover.classList.remove("onLeft", "onTop");

    if (ownerRect.top > BOTTOM_BOUNDARY || ownerRect.right < LEFT_BOUNDARY || ownerRect.top < TOP_BOUNDARY || ownerRect.left > RIGHT_BOUNDARY)
      return this._cancel();

    if (ownerRect.left < LEFT_BOUNDARY) {
      left = LEFT_BOUNDARY;
    } else if (ownerRect.left + popoverRect.width > RIGHT_BOUNDARY) {
      left = RIGHT_BOUNDARY - popoverRect.width;
      popover.classList.add("onLeft");
    }

    if (maxHeight < MIN_ITEMS_HEIGHT) {
      maxHeight = Math.min(ownerRect.top - TOP_BOUNDARY, MAX_ITEMS_HEIGHT);
      queueMicrotask(() => {
        const ownerTop = owner.getBoundingClientRect().top;
        const popoverHeight = popover.getBoundingClientRect().height;
        popover.style.cssText += `top: ${ownerTop - popoverHeight}px`;
        popover.classList.add("onTop");
      });
    }

    popover.style.cssText += `top: ${top}px; left: ${left}px; max-height: ${maxHeight}px`;
  }
  #debounced_repositionPopover(e) {
    this.#cleanupDebouncedRepositionPopoverTimer();
    this.#debouncedRepositionPopoverTimerRef = setTimeout(() => this.#repositionPopover(e), 100);
  }

  #setupNewOwner(owner) {
    if (this.#ownerSetup) return;
    this.#ownerSetup = true;
    this.owner = owner;
    if (this.owner) this.owner.addEventListener("blur", this.#bound_onOwnerBlur);
  }

  #teardownOwner() {
    if (!this.#ownerSetup) return;
    this.#ownerSetup = false;
    if (this.owner) this.owner.removeEventListener("blur", this.#bound_onOwnerBlur);
    this.#owner = null;
  }

  async feed(owner, searchPattern) {
    this.#clearTimers();

    if (!this.owner || (owner && owner !== this.owner)) {
      if (this.isOpen) this._cancel();
      this.#teardownOwner();
      this.#setupNewOwner(owner);
    }
    if (searchPattern === this.searchPattern) return;
    if (isEmpty(searchPattern) && this.isOpen) return this._cancel();
    if (this.minChars && isString(searchPattern) && searchPattern.length < this.minChars) return;

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
    this.#result = null;
    this.#promise = new Promise((res, rej) => {
      this.#resolve = res;
      this.#reject = rej;
    }).catch(evt => this.writeLog("Info", evt));

    this.popover.showPopover();
    this.update();
    this.#repositionPopover();
    this._connectListeners();

    return true;
  }

  renderPart() {
    const cls = [
      parseRank(this.rank, true),
      parseStatus(this.status, true),
      this.isOpen ? "" : "hidden",
      this.owner ? "hasOwner" : "",
      this.#loadingData ? "loading" : "",
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
    if (this.#loadingData) return html`<div class="loader">Loading...</div>`;
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

/** Provides a uniform base abstraction for look-ups which get their data by executing some 3rd party code such as a service call.
 * The concept introduces an abort controller to be able to cancel a pending call, such as a service client Http call or the like.
 * You MUST DERIVE from this type and implement `_doCall(abortController)`
 */
export class ExternalCallLookup extends Lookup {

  #abortController = null;

  /** Returns current abort controller or NULL */
  get abortController() {return this.#abortController; }

  // eslint-disable-next-line no-unused-vars
  _lookupCompleted(isCancel){ this._abortPendingCallIfAny(); }

  /** Aborts the pending call if there is anything pending, otherwise does nothing */
  _abortPendingCallIfAny(){
    try {
      if (this.#abortController){
        this.#abortController.abort(ABORT_ERROR_NAME);
      }
    } catch (cause){
      this.writeLog(LOG_TYPE.ERROR, "Leaked _abortPendingCallIfAny()", cause);
    } finally{
      this.#abortController = null;
    }
  }

  /**
   * Override to make an actual external call, such as a service call to the remote party
   * @param {AbortController} abortController to be used to abort the call
   * */
  // eslint-disable-next-line no-unused-vars
  _doCall(abortController){
    throw ABSTRACT("_getDataCore(abortController)");
  }

  async getData(){
    this._abortPendingCallIfAny();
    this.#abortController = new AbortController();
    try {
      const gotData = await this._doCall(this.#abortController);
      return gotData;
    } catch(e) {
      if (e.cause === ABORT_ERROR_NAME) return null;
      throw e;
    } finally {
      this.#abortController = null;
    }
  }
}
