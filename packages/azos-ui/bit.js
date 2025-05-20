/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { asBool, DATA_BLOCK_PROP } from 'azos/types.js';
import { Control, css, getChildDataMembers, html, parseRank, parseStatus } from './ui.js';
import * as aver from 'azos/aver.js';


export const STL_BIT = css`
:host{ display: block; box-sizing: border-box; }


.control{
  position: relative;
  border: var(--s-default-bor-ctl);
  background-color:  var(--s-default-bg-ctl);
  color: var(--s-default-fg-ctl);
  padding: 0.55em 0.75em 0.55em 0.75em;
  border-radius: 0.75em;
  box-shadow: var(--ctl-box-shadow);
  overflow: hidden;

  &:focus-within{ outline: 3px solid var(--focus-ctl-selected-color); }

  .flag{
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: .75ch;
    height: 100%;
    border-radius: 0.75em;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background: #40404040;
    border: none;
    opacity: 0.75;
    z-index: 15;

    &.ok      { background: var(--s-ok-bg);     }
    &.info    { background: var(--s-info-bg);   }
    &.warning { background: var(--s-warn-bg);   }
    &.alert   { background: var(--s-alert-bg);  }
    &.error   { background: var(--s-error-bg);  }
    &.brand1  { background: var(--s-brand1-bg); }
    &.brand2  { background: var(--s-brand2-bg); }
    &.brand3  { background: var(--s-brand3-bg); }
  }
}

.summary{
  border-bottom: none;
  user-select: none;

  &.collapsed{ border-bottom: 1px dotted #20202040; }

  .expander{
    display: inline-block;
    z-index: 10;
    margin: .2em;
    position: relative;
    border-radius: 50%;
    width: 3ch;
    height: 3ch;
    background: #20202030;
    opacity: 0.45;
    border: 1px solid #20202040;
    transition: 0.35s ease-in-out;
    transform: rotate(-180deg);
    vertical-align: sub;
    cursor: pointer;

    .ico{ svg{ height: 1.2lh; position: relative; top: 0.25em; left: 0.13em;} }
    &.collapsed{ transform: rotate(0deg); opacity: 0.85; }
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
    top: -1.75em;
    margin-bottom: -1.0em;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 0.35em;
    z-index: 0;
    div{  cursor: pointer; }
  }
}

.details{
  display: block;
  border-radius: 0.75em;
  background: #f4f4f4a0;
  transition: 0.25s ease-in-out;
  overflow: hidden;
  opacity: 1;
  height: calc-size(auto, size);

  box-shadow: 0px 0px 8px #20202020;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding: .75em;

  border: 1px solid #20202010;

  &.collapsed{ margin-top: 0; margin-bottom: 0; height: 0; opacity: 0; padding: 0; visibility: hidden; }
}

.r1 { font-size: var(--r1-fs); }
.r2 { font-size: var(--r2-fs); }
.r3 { font-size: var(--r3-fs); }
.r4 { font-size: var(--r4-fs); }
.r5 { font-size: var(--r5-fs); }
.r6 { font-size: var(--r6-fs); }

.ok      { background: var(--s-ok-bg-ctl);     color: var(--s-ok-ink-ctl);     border: var(--s-ok-bor-ctl);}
.info    { background: var(--s-info-bg-ctl);   color: var(--s-info-ink-ctl);   border: var(--s-info-bor-ctl);}
.warning { background: var(--s-warn-bg-ctl);   color: var(--s-warn-ink-ctl);   border: var(--s-warn-bor-ctl);}
.alert   { background: var(--s-alert-bg-ctl);  color: var(--s-alert-ink-ctl);  border: var(--s-alert-bor-ctl);}
.error   { background: var(--s-error-bg-ctl);  color: var(--s-error-ink-ctl);  border: var(--s-error-bor-ctl);}
.brand1  { background: var(--s-brand1-bg-ctl); color: var(--s-brand1-ink-ctl); border: var(--s-brand1-bor-ctl);}
.brand2  { background: var(--s-brand2-bg-ctl); color: var(--s-brand2-ink-ctl); border: var(--s-brand2-bor-ctl);}
.brand3  { background: var(--s-brand3-bg-ctl); color: var(--s-brand3-ink-ctl); border: var(--s-brand3-bor-ctl);}


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
    statusFlag: { type: String, reflect: true },
    summaryTitle: { type: String },
    summarySubtitle: { type: String }
  };

  #isExpanded = false;
  get isExpanded() { return this.#isExpanded; }
  set isExpanded(value) { this.#isExpanded = asBool(value); }

  #statusFlag = null;
  get statusFlag() { return this.#statusFlag; }
  set statusFlag(v) { this.#statusFlag = v ? parseStatus(v) : null; }


  #getSummaryDataHandler = null;
  /** A reference to a function which handles data extraction to get summary data. You can also override `_getSummaryData()` if you subclass  */
  get getSummaryDataHandler(){ return this.#getSummaryDataHandler; }
  set getSummaryDataHandler(v){ this.#getSummaryDataHandler = aver.isFunctionOrNull(v); }



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

  /**
   * Allows to iterate over data members (e.g. data fields) contained by this bit.
   * Note: bit is not a block, it is merely a UI grouper, so its "internal fields" are included in a linear data fashion
   * as if they were part of the parent outside of this Bit
  */
  get [DATA_BLOCK_PROP](){ return getChildDataMembers(this, true); }



  /** Override to extract tuple of (title: string | html, subtitle: string | html, commands: Cmd[])
   * This method gets called on every render. You can also add additional props for your custom rendering
   * of the summary section
  */
  _buildSummaryData(){
    if (this.#getSummaryDataHandler){
      return this.#getSummaryDataHandler(this);
    }

    let title = this.summaryTitle ?? `${this.constructor.name}#${this.id}`;
    let subtitle = this.summarySubtitle;
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
    return html`<div id="divControl" class="control ${cls}"> ${this.renderStatusFlag()} ${this.renderSummary(summary)} ${this.renderDetails()} </div>`;

  }

  renderStatusFlag(){
    if (!this.statusFlag) return null;
    const cls = parseStatus(this.statusFlag, true);
    return html`<div class="flag ${cls}">  </div>`;
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

  renderSummaryExpander(){
    const cls = this.isExpanded ? "" : "collapsed";
    return html`<div class="expander ${cls}" @click=${this.#onSummaryExpanderClick}>${this.renderImageSpec("svg://azos.ico.caretDown", {cls: "ico"}).html}</div>`;
  }


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
