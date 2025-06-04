/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from 'azos/aver.js';
import { asBool  } from 'azos/types.js';
import { AzosElement, css, getEffectiveDataMode, html, noContent, parseRank, parseStatus, UiInputValue } from './ui.js';
import { Block } from './blocks.js';
import { Command } from './cmd.js';
import { DATA_MODE_PROP, DATA_MODE, arrayDelete, DATA_VALUE_PROP, DATA_BLOCK_PROP, DATA_VALUE_DESCRIPTOR_PROP, DATA_VALUE_DESCRIPTOR_IS_LIST } from 'azos/types';
import { isOneOf } from 'azos/strings';
import { TextField } from './parts/text-field.js';


export const STL_BIT = css`
:host{ display: block; box-sizing: border-box; }

.outer{}
.outer[inert]{ filter: blur(2px) grayscale(0.85);  opacity: 0.75; }

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
    top: -2.2em;
    margin-bottom: -2.2em;
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

.command-icon{
  display: inline-block;
  width: 2.0em;
  height: 2.0em;
  stroke: var(--ink);
}

.fas{ fill: var(--ink); }

`;

/*
  Provides a collapsible summary view of a UI fragment. Bits allow us to save screen space by collapsing the details into
  a reduced summary line of text. The summary line can then be expanded to show the details.
  Bits are used to create a tree-like hierarchical collapsible sections which allow for composition of
  multiple nested data/information fragments such as data for blocks/fields and their lists etc.
  You either sub-class a `Bit` to wrap a piece of UI, or use delegation via handler functions while putting your content inside
  of the `az-bit` tags as `Bit` by default uses a `slot` to render its details.
*/
export class Bit extends Block {

  static styles = [STL_BIT];

  static properties = {
    isExpanded: { type: Boolean, reflect: true },
    statusFlag: { type: String, reflect: true },
    noSummary:  { type: Boolean, reflect: true }
  };

  #isExpanded = false;
  get isExpanded() { return this.noSummary || this.#isExpanded; }
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

  /** Override to extract tuple of (title: string | html, subtitle: string | html, commands: Cmd[])
   * This method gets called on every render. You can also add additional props for your custom rendering
   * of the summary section
  */
  _getSummaryData(){
    if (this.#getSummaryDataHandler){
      return this.#getSummaryDataHandler(this);
    }

    let title = this.title ?? `${this.constructor.name}#${this.id}`;
    let subtitle = this.description;
    let commands = [
      { text: "Edit", icon: "edit", cmd: "edit" },
      { text: "Delete", icon: "delete", cmd: "delete" }
    ];

    return { title, subtitle, commands };
  }


  #onSummaryExpanderClick(e){
    e.stopPropagation();
    this.toggle();
  }


  renderControl(){
    let effectDisabled = this.isDisabled || this.isNa;

    if (!effectDisabled || this.whenView || this.whenInsert || this.whenUpdate){
      let mode = DATA_MODE_PROP in this.renderState
                   ? this.renderState[DATA_MODE_PROP]
                   : this.renderState[DATA_MODE_PROP] = getEffectiveDataMode(this);

      if (mode){
        if (!effectDisabled){
          const spec = mode === DATA_MODE.INSERT ? this.whenInsert : mode === DATA_MODE.UPDATE ? this.whenUpdate : this.whenView;
          effectDisabled = isOneOf(spec, ["na", "disable", "disabled"], false);
        }
      }
    }
    // ---------------------------------------------------------------------------
    if (this.noSummary){
      let cls = `${parseRank(this.rank, true)}`; //ignore "status" coloring as we do not have the outer frame
      const innerContent = this.renderDetailContent();
      return html`<div id="divControl" class="outer ${cls}" ?inert=${effectDisabled}> ${innerContent} </div>`;
    } else {
      let cls = `${parseRank(this.rank, true)} ${parseStatus(this.status, true)}`;
      const summary = this._getSummaryData();
      const innerContent = html`${this.renderStatusFlag()} ${this.renderSummary(summary)} ${this.renderDetails()}`;
      return html`<div id="divControl" class="outer control ${cls}" ?inert=${effectDisabled}> ${innerContent} </div>`;
    }
  }

  renderStatusFlag(){
    const flag = this.error ? "error" : this.statusFlag;
    if (!flag) return null;
    const cls = parseStatus(flag, true);
    return html`<div class="flag ${cls}">  </div>`;
  }

  /** Renders the whole summary section */
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

  /** Renders summary/detail expander button (up/down) */
  renderSummaryExpander(){
    const cls = this.isExpanded ? "" : "collapsed";
    return html`<div class="expander ${cls}" @click=${this.#onSummaryExpanderClick}>${this.renderImageSpec("svg://azos.ico.caretDown", {cls: "ico"}).html}</div>`;
  }

  /** Renders the summary title. Must include its own div */
  renderSummaryTitle(data){ return html`<div class="title" @click=${this.#onSummaryExpanderClick}>${data.title}</div>`; }

  /** Renders subtitle. Must include its own div */
  renderSummarySubtitle(data){ return html`<div class="subtitle">${data.subtitle}</div>`; }

  /** Renders the summary toolbar with commands. The commands are passed as an array of Command objects  */
  renderSummaryToolbar(data){
    const commands = data.commands;
    if (!commands) return null;
    const bar = [];
    const arena = this.arena;

    for(const cmd of commands){
      if (!(cmd instanceof Command)) continue;
      if (!cmd.visible) continue;

      const mkp = cmd.provideMarkup(arena, this);
      bar.push(html`<div class="cmd" @click=${() => cmd.exec(arena, this)}>${mkp}</div>`);
    }

    if (bar.length === 0) return noContent;

    return html`<div class="toolbar"> ${bar} </div>`;
  }

  /** Render details section with appropriate classes */
  renderDetails(){
    const cls = this.isExpanded ? "" : "collapsed";
    return html`<section id="sectDetails" class="details ${cls}"> ${this.renderDetailContent()}</section>`;
  }

  /** Renders the content in the details section itself, this is what you override in derived class */
  renderDetailContent(){ return html`<slot>  </slot>`; }
}

window.customElements.define("az-bit", Bit);




/** Provides a `Bit` of LIST-like data functionality returning an array of items  */
export class ListBit extends Bit {


  static styles = [STL_BIT, css`
.listItem{
  padding: 1ch;
  border-bottom: 1px solid #40404030;
  border-radius: 0.25em;

  &:focus-within{ outline: 3px solid var(--focus-ctl-selected-color); }

}

.selected{ background: var(--selected-item-bg);  }
  `];

  static properties = {
    itemTagName: {type: "String"}
  };

  /** Override to return a class of items being handled by this list
   * in cases when default logic is used, such as default add handler.
   * You can override the add handler itself and insert polymorphic types,
   * however this method is used as a default one
  */
  getDefaultItemClass(){
    const tag = this.itemTagName;
    let result = null;
    if (tag)  result = window.customElements.get(tag);
    return result ?? TextField;
  }

  //Actual array of data elements
  #listElements = [];
  #makeOrMapElementHandler = null;
  #selectedElement = null;

  _cmdAdd = new Command(this, {
    icon: "svg://azos.ico.add",
    handler: () => this._cmdAddHandler()
  });

  _cmdRemove = new Command(this, {
    icon: "svg://azos.ico.delete",
    handler: () => this._cmdRemoveHandler()
  });

  _cmdAddHandler(){
    const tItem = this.getDefaultItemClass();
    const one = new tItem();
    one.rank = "medium";
    one.noSummary = true;
    this.upsert(one);
  }

  _cmdRemoveHandler(){
    const one = this.#selectedElement;
    this.#selectedElement = null;
    if (one){
      this.remove(one);
    }
  }

  /** Returns a copy of list elements */
  get listElements(){ return [...this.#listElements]; }

  /** Returns a number of items contained in this list */
  get count(){ return this.#listElements.length; }

  /** Returns an index of existing element found by reference comparison or -1 if not found*/
  indexOf(elm){
    if (!elm) return -1;
    return this.#listElements.indexOf(elm);
  }


  /**
   * Allows to iterate over data members (e.g. data fields) contained by this block
   */
  get [DATA_BLOCK_PROP](){ return [...this.#listElements]; }

  get [DATA_VALUE_DESCRIPTOR_PROP](){ return { [DATA_VALUE_DESCRIPTOR_IS_LIST]: true}; }

  get [DATA_VALUE_PROP](){
    const result = [];
    for(const one of this.#listElements){
      const value =  DATA_VALUE_PROP in one ? one[DATA_VALUE_PROP] : one.toString();
      result.push(value);
    }
    return result;
  }

  set [DATA_VALUE_PROP](v){
    this.#listElements = [];
    this.requestUpdate();
    if (!v) return;

    let isUiInput = false;
    if (v instanceof UiInputValue) {//unwrap UiInputValue
      isUiInput = true;
      v = v.value();
    }

    aver.isArray(v, "ListBit needs array value");
    for(const one of v) {
      this.loadItemFromData(one, isUiInput);
    }
  }


  /** A reference to a function which handles mapping of existing element or making new elements. Required if you did not override the `makeOrMapElement(data, mapExistingOnly)` method  */
  get makeOrMapElementHandler(){ return this.#makeOrMapElementHandler; }
  set makeOrMapElementHandler(v){ this.#makeOrMapElementHandler = aver.isFunctionOrNull(v); }

  /** An element factory: projects data vector into appropriate list item element type.
   *  Returns AzosElement which should be used as a list item. You cam make appropriate type polymorphically  */
  makeOrMapElement(elmData, mapExistingOnly = false){
    //Do not confuse handlers and events. Handlers are function pointers and return values unlike events
    if (this.#makeOrMapElementHandler) return this.#makeOrMapElementHandler(this, elmData, mapExistingOnly);

    if (this.indexOf(elmData) >=0) return elmData;
    if (mapExistingOnly) return null;

    const tItem = this.getDefaultItemClass();
    const result = new tItem();
    return result;
  }

  loadItemFromData(data, isUiInput){
    aver.isNotNull(data);
    const elm = this.makeOrMapElement(data, false);
    if (!elm) return null;

    if (DATA_VALUE_PROP in elm) elm[DATA_VALUE_PROP] = isUiInput ? new UiInputValue(data) : data;

    this.#listElements.push(elm);
    return elm;
  }

  /** Adds an element to list returning true if it was added as it did not exist, otherwise deems element as updated
   * @param {object | AzosElement} elm  an object data mappable to `AzosElement` via factory method invocation or pre-mapped AzosElement
   * @param {boolean} [updateOnly=false] pass true to suppress the insert option and treat this as pure update of an existing item
   * @returns {boolean | null} true if inserted, false if updated, null if could not find for update only mode
  */
  upsert(elm, updateOnly = false){
    aver.isNotNull(elm);
    if (!(elm instanceof AzosElement)) elm = this.makeOrMapElement(elm, updateOnly);
    if (!elm) return null;

    const existing = this.#listElements.find(one => one === elm);
    if (!existing) this.#listElements.push(elm);
    this.requestUpdate();
    return !existing;
  }

  /**
   * Removes an element returning true if found and removed
   * @param {object | AzosElement} elm  an object data mappable to `AzosElement` via factory method invocation or pre-mapped AzosElement
   * @returns {boolean} true when removed, otherwise false
   */
  remove(elm){
    aver.isNotNull(elm);
    if (!(elm instanceof AzosElement)) elm = this.makeOrMapElement(elm, true);
    if (!elm) return false;

    const ok = arrayDelete(this.#listElements, elm);
    if (!ok) return false;
    this.requestUpdate();
    return true;
  }

  _getSummaryData(){
    let mode = DATA_MODE_PROP in this.renderState
                   ? this.renderState[DATA_MODE_PROP]
                   : this.renderState[DATA_MODE_PROP] = getEffectiveDataMode(this);

    const mutable = mode === DATA_MODE.INSERT || mode === DATA_MODE.UPDATE;
    const commands = mutable ? [this._cmdAdd, this._cmdRemove] : [];

    return {
      title: `${this.title} (${this.count})`,
      subtitle: this.description,
      commands: commands
    }
  }

  renderDetailContent(){
    const head = this.renderListHead();
    const items = this.renderListItems();
    const tail = this.renderListTail();
    return html`${head}${items}${tail}`;
  }


  renderListHead(){ return noContent;  }
  renderListTail(){ return noContent;  }


  #divItemFocusIn(item){
    this.#selectedElement = item;
    this.requestUpdate();
  }

  renderListItems(){
    const result = this.#listElements.map(one => html`<div class="listItem ${one == this.#selectedElement ? "selected" : ""}" @focusin="${() => this.#divItemFocusIn(one)}">${one}</div>`);
    return result;
  }
}

window.customElements.define("az-list-bit", ListBit);
