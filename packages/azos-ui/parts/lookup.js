/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isTrue } from "azos/aver";
import { AzosElement, css, html, parseRank, parseStatus } from "../ui";
import { lookupStyles } from "./styles";
import { isNonEmptyString } from "azos/types";


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
    results: { type: Array }
  };

  #bound_onKeydown = this.#onKeydown.bind(this);
  #bound_onDocumentClick = this.#onDocumentClick.bind(this);
  #bound_onFeed = this.#onFeed.bind(this);

  #isShown = false;
  /** Returns true if the lookup is shown */
  get isShown() { return this.#isShown; }

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
    let preventDefault = true;
    switch (e.key) {
      case "Escape":
        this.hide();
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
        this.#selectResult();
        break;
      default:
        preventDefault = false;
        break;
    }
    if (preventDefault) e.preventDefault();
  }

  #advanceSoftFocus(forward = true) {
    const resultNodes = this.resultNodes;
    let nextIndex;
    if (forward)
      nextIndex = (this.focusedResultElmIndex + 1) % resultNodes.length;
    else
      nextIndex = (this.focusedResultElmIndex - 1 + resultNodes.length) % resultNodes.length;
    this.focusedResultElm = resultNodes[nextIndex] ?? null;
  }

  #selectResult() {
    this.dispatchEvent(new CustomEvent("select", { detail: { value: this.results[this.focusedResultElmIndex] } }));
    this.hide();
  }

  #isWithinParent(elm, parent) {
    let currentElement = elm;
    while (currentElement) {
      if (currentElement === parent) return true;
      currentElement = currentElement.parentElement;
    }
    return false;
  }

  #onDocumentClick(e) {
    if (this.#isWithinParent(e.target)) return;
    this.hide();
  }

  updated(changedProperties) {
    if (changedProperties.has("results")) {
      this.focusedResultElm = this.resultNodes[0];
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.document.addEventListener("keydown", this.#bound_onKeydown);
    window.document.addEventListener("click", this.#bound_onDocumentClick);
    this.addEventListener("feed", this.#bound_onFeed);
  }

  disconnectedCallback() {
    window.document.removeEventListener("keydown", this.#bound_onKeydown);
    window.document.removeEventListener("click", this.#bound_onDocumentClick);
    this.removeEventListener("feed", this.#bound_onFeed);
    super.disconnectedCallback();
  }

  #onFeed(e) {
    const value = e.detail.value;
    console.log(value, e);
    this.feed(value);
  }

  feed(data) {
    if (data.length >= 2) {
      if (!this.isShown) this.show();
      // this.results = this.getData(`${data}*`);
      this.dispatchEvent(new CustomEvent("getData", { detail: { filterText: `*${data}*` } }));
    }
  }

  /** Shows a lookup returning true if it was shown, or false if it was already shown before this call */
  show() {
    if (this.#isShown) return false;
    this.#isShown = true;

    this.update();//sync update dom build

    const dlg = this.$("pop");
    dlg.showPopover();
    this.focusedResultElm = this.resultNodes[0] ?? null;

    this.requestUpdate();

    return true;
  }

  /** Hides the shown spinner returning true if it was hidden, or false if it was already hidden before this call*/
  hide() {
    if (!this.#isShown) return false;
    this.#isShown = false;
    this.focusedResultElm = null;

    this.update();//sync update dom build

    const dlg = this.$("pop");
    dlg.hidePopover();

    return true;
  }

  render() {
    const cls = `${parseRank(this.rank, true)} ${parseStatus(this.status, true)}`;
    const stl = `${this.#isShown ? "" : "display: none"}`;

    return html`
<div id="pop" popover="manual" class="pop ${cls}" style="${stl}">
  ${this.renderBody()}
</div>
    `;
  }

  #onMouseOver(e) {
    if (!e.target.classList.contains("result")) return;
    this.focusedResultElm = e.target;
  }

  renderBody() {
    if (!this.results) return html`No results`;
    return html`
<ul class="results" @mouseover="${e => this.#onMouseOver(e)}">
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
  <span>${result.street1}</span>
</div>
    `;
  }


}//Lookup

window.customElements.define("az-lookup", Lookup);
