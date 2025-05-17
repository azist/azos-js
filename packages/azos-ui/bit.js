/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { asBool } from 'azos/types';
import { Control, css, html, parseRank, parseStatus } from './ui.js';


export const STL_BIT = css`
:host{ display: block; box-sizing: border-box; }

.control{
  border: var(--s-default-bor-ctl);
  background-color:  var(--s-default-bg-ctl);
  color: var(--s-default-fg-ctl);
  padding: 0.55em 0.75em 0.55em 0.75em;
  border-radius: 0.75em;
  box-shadow: var(--ctl-box-shadow);
}

.summary{
  border-bottom: none;

  &.collapsed{ border-bottom: 1px solid #20202040; }

  .expander{
    display: inline;
    font-size: 1.2em;
    font-weight: bold;
    cursor: pointer;
  }

  .title{
    display: inline;
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 0.1em;
    z-index: 10;
    cursor: pointer;
    position: relative;
  }

  .subtitle{
    display: block;
    font-size: 1em;
    font-weight: normal;
    padding: 0.25em;
    padding-left: 1ch;
    opacity: 0.75;
  }

  .toolbar{
    position: relative;
    top: -1.2em;
    margin-bottom: -1.0em;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 0.35em;
    z-index: 0;
    cursor: pointer;
  }
}

.details{
  display: block;
  border-radius: 0.75em;
  background: var(--paper2);
  transition: height,opacity 0.55s ease-in-out;
  overflow: hidden;
  opacity: 1;
  height: auto;

  box-shadow: 0px 0px 8px #20202020;
  margin-top: 0.25em;
  padding: .75em;

  border-top: 1px dotted #20202020;
  border-bottom: 1px dotted #20202060;

  &.collapsed{ border-top: none; margin-top: 0; height: 0; opacity: 0; padding: 0;}
}

.r1 { font-size: var(--r1-fs); }
.r2 { font-size: var(--r2-fs); }
.r3 { font-size: var(--r3-fs); }
.r4 { font-size: var(--r4-fs); }
.r5 { font-size: var(--r5-fs); }
.r6 { font-size: var(--r6-fs); }

.ok      { background: var(--s-ok-bg-ctl);     color: var(--s-ok-ink-ctl);    border: var(--s-ok-bor-ctl);}
.info    { background: var(--s-info-bg-ctl);   color: var(--s-info-ink-ctl);  border: var(--s-info-bor-ctl);}
.warning { background: var(--s-warn-bg-ctl);   color: var(--s-warn-ink-ctl);  border: var(--s-warn-bor-ctl);}
.alert   { background: var(--s-alert-bg-ctl);  color: var(--s-alert-ink-ctl); border: var(--s-alert-bor-ctl);}
.error   { background: var(--s-error-bg-ctl);  color: var(--s-error-ink-ctl); border: var(--s-error-bor-ctl);}
.brand1  { background: var(--s-brand1-bg-ctl);  color: var(--s-brand1-ink-ctl); border: var(--s-brand1-bor-ctl);}
.brand2  { background: var(--s-brand2-bg-ctl);  color: var(--s-brand2-ink-ctl); border: var(--s-brand2-bor-ctl);}
.brand3  { background: var(--s-brand3-bg-ctl);  color: var(--s-brand3-ink-ctl); border: var(--s-brand3-bor-ctl);}

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
  set isExpanded(value) { this.#isExpanded = asBool(value); }

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
    let cls = `${parseRank(this.rank, true)} ${parseStatus(this.status, true)}`;
    const summary = this._buildSummaryData();
    return html`<div id="divControl" class="control ${cls}"> ${this.renderSummary(summary)} ${this.renderDetails()} </div>`;
  }

  renderSummary(data){
    const cls = this.isExpanded ? "" : "collapsed";
    return html`
<section id="sectSummary" class="summary ${cls}">
    ${this.renderSummaryExpander(data)}
    ${this.renderSummaryTitle(data)}
    ${this.renderSummaryToolbar(data)}
    ${this.renderSummarySubtitle(data)}
</section>`;
  }

  renderSummaryExpander(){ return html`<div class="expander" @click=${this.#onSummaryExpanderClick}>${this.isExpanded ? "-" : "+"}</div>`; }
  renderSummaryTitle(data){ return html`<div class="title" @click=${this.#onSummaryExpanderClick}>${data.title}</div>`; }
  renderSummarySubtitle(data){ return html`<div class="subtitle">${data.subtitle}</div>`; }
  renderSummaryToolbar(data){ return html`<div class="toolbar"> <div>[A]</div> <div>[B]</div> </div>`; }

  renderDetails(){
    const cls = this.isExpanded ? "" : "collapsed";
    return html`<section id="sectDetails" class="details ${cls}"> ${this.renderDetailContent()}</section>`;
  }

  renderDetailContent(){ return html`<slot>  </slot>`; }
}



window.customElements.define("az-bit", Bit);
