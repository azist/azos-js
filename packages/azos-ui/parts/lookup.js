/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isObjectOrNull, isOf, isTrue } from "azos/aver";
import { AzosElement, css, html, parseRank, parseStatus } from "../ui";
import { lookupStyles } from "./styles";
import { AzosError, isNonEmptyString, isObject, isString } from "azos/types";


/**
 * Provides abstraction for a Lookup Protocol.
 *
 * Create an instance of a lookup and associate it with your field (az-text, etc). The Lookup receives the triggers and responds
 *   appropriately
 */
export class Lookup extends AzosElement {

  static styles = [lookupStyles, css`
  `];//styles

  static properties = {
    results: { type: Array },
    owner: { type: AzosElement },
  };

  #bound_onKeydown = this.#onKeydown.bind(this);
  #bound_onDocumentClick = this.#onDocumentClick.bind(this);
  #bound_onFeed = this.#onFeed.bind(this);

  #shownPromise = null;
  #shownPromiseResolve = null;
  #shownPromiseReject = null;
  /** Returns true if the lookup is shown */
  get isShown() { return this.#shownPromise !== null; }
  get shownPromise() { return this.#shownPromise; }

  get resultNodes() { return [...this.shadowRoot.querySelectorAll(".result")]; }

  get focusedResultElmIndex() { return this.resultNodes.indexOf(this.focusedResultElm); }

  #focusedResultElm = null;
  get focusedResultElm() { return this.#focusedResultElm; }
  set focusedResultElm(v) {
    isTrue(v === null || this.resultNodes.includes(v), `"${v}" must be a valid result node.`);
    if (this.#focusedResultElm === v) return;

    const oldValue = this.#focusedResultElm;
    if (this.#focusedResultElm) this.#focusedResultElm.tabIndex = -1; // previous elm
    this.#focusedResultElm = v;
    if (this.#focusedResultElm) this.#focusedResultElm.tabIndex = 0; // current elm
    this.requestUpdate("focusedResultElm", oldValue);
  }

  constructor() { super(); }

  #onKeydown(e) {
    if (!this.isShown) return;

    let preventDefault = true;
    switch (e.key) {
      case "Escape":
        this.cancel();
        break;
      case "Tab":
        this.#advanceSoftFocus(!e.shiftKey);
        break;
      case "ArrowUp":
        this.#advanceSoftFocus(false);
        break;
      case "ArrowDown":
        this.#advanceSoftFocus();
        break;
      case "Enter":
        if (!this.results.length)
          return this.cancel();
        this.#selectResult();
        break;
      default:
        preventDefault = false;
        break;
    }
    if (preventDefault) e.preventDefault();
  }

  #onDocumentClick(e) {
    if (!this.isShown) return;
    const target = e.composedPath()[0]; // Account for shadowDOM
    // console.log(target, this.isShown);
    if (this.#isWithinParent(target, this) || this.#isWithinParent(target, this.owner)) {
      e.preventDefault();
      return;
    }
    this.cancel();
  }

  #onResultsClick(e) {
    const selectedResultElm = e.target.closest(".result");
    if (!selectedResultElm) return;
    this.focusedResultElm = selectedResultElm;
    this.#selectResult();
    e.preventDefault();
  }

  #onMouseOver(e) {
    const resultElm = e.target.closest(".result");
    if (!resultElm) return;
    this.focusedResultElm = resultElm;
  }

  #advanceSoftFocus(forward = true) {
    if (!this.resultNodes.length) return false;
    const resultNodes = this.resultNodes;
    let nextIndex;
    if (forward)
      nextIndex = (this.focusedResultElmIndex + 1) % resultNodes.length;
    else
      nextIndex = (this.focusedResultElmIndex - 1 + resultNodes.length) % resultNodes.length;
    this.focusedResultElm = resultNodes[nextIndex] ?? null;
    return true;
  }

  #selectResult() {
    this.dispatchEvent(new CustomEvent("select", { detail: { value: this.results[this.focusedResultElmIndex] } }));
    this.hide();
  }

  #isWithinParent(elm, parent) {
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

  updated(changedProperties) {
    if (changedProperties.has("results")) {
      this.focusedResultElm = this.resultNodes[0] ?? null;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.document.addEventListener("keydown", this.#bound_onKeydown);
    window.document.addEventListener("click", this.#bound_onDocumentClick);
    this.addEventListener("lookup-feed", this.#bound_onFeed);
  }

  disconnectedCallback() {
    window.document.removeEventListener("keydown", this.#bound_onKeydown);
    window.document.removeEventListener("click", this.#bound_onDocumentClick);
    this.removeEventListener("lookup-feed", this.#bound_onFeed);
    super.disconnectedCallback();
  }

  #onFeed(evt) {
    const value = evt.detail.value;
    // console.trace(value, e);
    this.feed(value);
  }

  feed(data) {
    if (data.length >= 2) {
      if (!this.isShown) this.show();
      this.dispatchEvent(new CustomEvent("getData", { detail: { filterText: `*${data}*` } }));
    }
  }

  /** Shows a lookup returning true if it was shown, or false if it was already shown before this call */
  show() {
    if (this.isShown) return false;
    this.#shownPromise = new Promise((res, rej) => {
      this.#shownPromiseResolve = res;
      this.#shownPromiseReject = rej;
    }).catch(e => this.writeLog("Info", e));

    this.update();//sync update dom build

    const msg = `Lookup does not have an owner.`;
    if (!this.owner) this.writeLog("Warning", msg, new AzosError(msg));

    const dlg = this.$("pop");
    dlg.showPopover();

    this.focusedResultElm = this.resultNodes[0] ?? null;

    this.requestUpdate();

    return true;
  }

  /** Hides the shown lookup returning true if it was hidden, or false if it was already hidden before this call */
  #finalize() {
    this.#shownPromise = null;
    this.#focusedResultElm = null;
    this.update();//sync update dom build
    const dlg = this.$("pop");
    dlg.hidePopover();
  }

  /** Resolve the lookup dialog */
  hide() {
    if (!this.isShown) return false;
    this.#shownPromiseResolve();
    this.#finalize();
    return true;
  }

  /** Cancel the lookup dialog */
  cancel() {
    if (!this.isShown) return false;
    this.#shownPromiseReject("canceled");
    this.#finalize();
    return true;
  }

  render() {
    const cls = [
      parseRank(this.rank, true),
      parseStatus(this.status, true),
      this.isShown ? "" : "hidden",
      this.owner ? "hasOwner" : "",
    ].filter(isNonEmptyString).join(" ");

    const stl = [
      this.owner ? `left: ${this.owner.offsetLeft}px` : "",
      this.owner ? `top: ${this.owner.offsetTop + this.owner.offsetHeight}px` : "",
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

  renderResultBody(result) {
    // return html`NOCONTENT`;
    return html`
<div>
  <span>${result.street1}, ${result.city}, ${result.state} ${result.zip}</span>
</div>
    `;
  }


}//Lookup

export class LookupInstance {
  static #idSeed = 0;

  #id; get id() { return this.#id }
  #owner; get owner() { return this.#owner }
  #ctx; get ctx() { return this.#ctx }
  #promise; get promise() { return this.#promise }
  #resolve;
  #reject;
  #result; get result() { return this.#result }

  #instance = null;

  constructor(owner, ctx) {
    this.#owner = isOf(owner, AzosElement);
    this.#ctx = isObjectOrNull(ctx) ?? {};

    this.#ctx.owner = owner;
    this.#id = ++LookupInstance.#idSeed;

    this.#instance = new Lookup();

    this.#promise = new Promise((res, rej) => {
      this.#resolve = res;
      this.#reject = rej;
    });
  }

  feed(data) {
    isTrue(isObject(data) || isString(data));
    this.#instance.feed(data);
  }

  select(result) {
    this.#result;
    this.#resolve(result);
    this.#instance.hide();
  }
  cancel() {
    this.#reject();
    this.#instance.hide();
  }
}

window.customElements.define("az-lookup", Lookup);
