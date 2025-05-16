/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { asBool } from 'azos/types';
import { Control, css, html } from './ui.js';


export const STL_BIT = css`
  :host{ display: block; padding: 0em; box-sizing: border-box; }

  .details{
    display: block;
    border: 1px solid red;
    border-radius: 0.5em;
    background: none;
    transition: all 0.2s ease-in-out;
    overflow: hidden;
    opacity: 1;
    height: auto;

    &.collapsed{ height: 0px; opacity: 0; }

  }
`;

/*
  Provides a collapsible summary view of a UI fragment. Bits allow us to save screen space by collapsing the details into
  a reduced summary line of text. The summary line can then be expanded to show the details.
  Bits are used to create a tree-like hierarchical collapsible sections which allow for composition of
  multiple nested data/information fragments such as data for blocks/fields and their lists etc.
  You either sub-class a `Bit` to wrap a piece of UI, or use delegation via handler functions while putting your content inside
  of the `az-bit` tags as `Bit` by default uses a `slot` to render its details.
*/
export class Bit extends Control {

  static styles = [STL_BIT];

  static properties = {
    isExpanded: { type: Boolean, reflect: true },
    groupId: { type: String }
  };

  #isExpanded = false;
  get isExpanded() { return this.#isExpanded; }
  set isExpanded(value) {
    this.#isExpanded = asBool(value);
   // this.requestUpdate();
  }

  /** Expands the detail section. This DOES NOT call an event */
  expand()  { this.isExpanded = true; }

  /** Collapses the detail section. This DOES NOT call an event */
  collapse(){ this.isExpanded = false; }

  /**
   * Toggles the expansion status and calls an event which can be cancelled to prevent a change
   * The summary toggle button calls this method to expand/collapse the details
   * @returns {boolean} - true if the toggle was successful, false if it was cancelled by an event handler
  */
  toggle(){
    const evt = new CustomEvent("beforeExpandToggle", { bubbles: false, cancelable: true, composed: false, detail: { isExpanded: this.isExpanded } });
    this.dispatchEvent(evt);
    if (evt.defaultPrevented) return false; // Cancelled by the event handler
    this.isExpanded = !this.isExpanded;
    return true;
  }



  /** Override to extract tuple of (title: string, subtitle: string, commands: Cmd[])
   * This method gets called on every render. You can also add additional props for your custom rendering
   * of the summary section
  */
  _buildSummaryData(){
    let title = "Joseph Paul Morris";
    let subtitle = "Consultant/medical";
    let toolbarCmds = [
      { text: "Edit", icon: "edit", cmd: "edit" },
      { text: "Delete", icon: "delete", cmd: "delete" }
    ];
    return { title, subtitle, toolbarCmds };
  }


  #onSummaryExpanderClick(e){
    e.stopPropagation();
    this.toggle();
  }


  renderControl(){
    const summary = this._buildSummaryData();
    return html` ${this.renderSummary(summary)} ${this.renderDetails()}`;
  }

  renderSummary(data){
    return html`
<section id="sectSummary">
    ${this.renderSummaryExpander(data)}
    ${this.renderSummaryTitle(data)}
    ${this.renderSummaryToolbar(data)}
    ${this.renderSummarySubtitle(data)}
</section>`;
  }

  renderSummaryExpander(){ return html`<div class="summary-expander" @click=${this.#onSummaryExpanderClick}></div>`; }
  renderSummaryTitle(data){ return html`<h2>${data.title}</h2>`; }
  renderSummarySubtitle(data){ return html`<div>${data.subtitle}</div>`; }
  renderSummaryToolbar(data){ return html`<div class="summary-toolbar">${data.subtitle}</div>`; }

  renderDetails(){
    return html`<section id="sectDetails" class="details"> ${this.renderDetailContent()}</section>`;
  }

  renderDetailContent(){ return html`<slot>  </slot>`; }
}



window.customElements.define("az-bit", Bit);
