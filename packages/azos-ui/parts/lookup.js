/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AzosElement, css, html, parseRank, parseStatus } from "../ui";
import { FieldPart } from "./field-part";
import { lookupStyles } from "./styles";


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
    field: { type: FieldPart }
  };

  #isShown = false;
  constructor() { super(); }

  #onKeydown(e) {
    if (e.key === "Escape") {
      this.hide();
      e.preventDefault();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.document.addEventListener("keydown", e => this.#onKeydown(e));
  }

  disconnectedCallback() {
    window.document.removeEventListener("keydown", e => this.#onKeydown(e));
    super.disconnectedCallback();
  }

  /** Returns true if the spinner is shown */
  get isShown() { return this.#isShown; }

  /** Shows a spinner returning true if it was shown, or false if it was already shown before this call */
  show() {
    if (this.#isShown) return false;
    this.#isShown = true;

    this.update();//sync update dom build

    const dlg = this.$("pop");
    dlg.showPopover();

    return true;
  }

  /** Hides the shown spinner returning true if it was hidden, or false if it was already hidden before this call*/
  hide() {
    if (!this.#isShown) return false;
    this.#isShown = false;

    this.update();//sync update dom build

    const dlg = this.$("pop");
    dlg.hidePopover();

    return true;
  }

  render() {
    const cls = `${parseRank(this.rank, true)} ${parseStatus(this.status, true)}`;
    const stl = `${this.#isShown ? "" : "display: none"}`;

    return html`
<div id="pop" popover="manual" class="pop ${cls}" style="${stl}" tabindex="1">
  ${this.renderBody()}
</div>
    `;
  }

  renderBody() {
    return html`
<ul class="results">
    ${this.results.map(result => this.renderResult(result))}
</ul>
    `;
  }

  renderResult(result) { return html`<li class="result">${this.renderResultBody(result)}</li>`; }
  renderResultBody(result) {
    return html`
<div>
  <span>${result.name}</span>
</div>
    `;
  }

  results = [{ name: "Test1" }, { name: "Test2" }];


}//Lookup

window.customElements.define("az-lookup", Lookup);
