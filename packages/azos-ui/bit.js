/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from 'azos/aver.js';
import { asBool  } from 'azos/types.js';
import { AzosElement, css, getEffectiveDataMode, getEffectiveSchema, html, noContent, parseRank, parseStatus, UiInputValue } from './ui.js';
import { Block } from './blocks.js';
import { Command } from './cmd.js';
import { DATA_MODE_PROP, DATA_MODE, arrayDelete, DATA_VALUE_PROP, DATA_BLOCK_PROP, DATA_VALUE_DESCRIPTOR_PROP, DATA_VALUE_DESCRIPTOR_IS_LIST, RESET_DIRTY_METHOD, ValidationError } from 'azos/types';
import { dflt, isOneOf } from 'azos/strings';
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
  // eslint-disable-next-line no-unused-vars
  _getSummaryData(effectDisabled, effectMutable){
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


    let effectMutable = !this.isBrowse && !this.isReadonly;

    if (effectMutable){
      let mode = DATA_MODE_PROP in this.renderState
                    ? this.renderState[DATA_MODE_PROP]
                    : this.renderState[DATA_MODE_PROP] = getEffectiveDataMode(this);

      effectMutable = mode === undefined || (mode === DATA_MODE.INSERT || mode === DATA_MODE.UPDATE);
    }


    // ---------------------------------------------------------------------------
    if (this.noSummary){
      let cls = `${parseRank(this.rank, true)}`; //ignore "status" coloring as we do not have the outer frame
      const innerContent = this.renderDetailContent();
      return html`<div id="divControl" class="outer ${cls}" ?inert=${effectDisabled}> ${innerContent} </div>`;
    } else {
      let cls = `${parseRank(this.rank, true)} ${parseStatus(this.status, true)}`;
      const summary = this._getSummaryData(effectDisabled, effectMutable);
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
  border-bottom: 2px dotted #40404020;
  border-radius: 0px;

  &:focus-within{ outline: 1px solid var(--focus-ctl-selected-color); }
}

.selected{ background: var(--selected-item-bg); border-radius: 0.75em; }
.last{ border: none; }
  `];

  static properties = {
    itemTagName: {type: "String"},

    /** If defined as a number greater than one imposes a limit on the minimum of list elements */
    minLength: { type: Number, reflect: false },

    /** If defined as a number greater than one imposes a limit on the maximum number of list elements */
    maxLength: { type: Number, reflect: false },
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

  /** Add command, you may return this from `_getSummaryData()` method */
  _cmdAdd = new Command(this, { icon: "svg://azos.ico.add",  handler: () => this.addItemAsync() });
  /** Remove command, you may return this from `_getSummaryData()` method  */
  _cmdRemove = new Command(this, { icon: "svg://azos.ico.delete", handler: () => this.removeItemAsync() });

  /** Invoked to add item to the list.
   * Default implementation just uses `upsert()` which in turn resorts to `makeOrMapElement(...)`.
   * You can override this method here and allocate a specific element, for example by using a popup to prompt the user, hence
   * this method is asynchronous - it may complete after an indefinite time, for example after getting a user response
   */
  async addItemAsync(){
    if (this.maxLength > 0 && this.count >= this.maxLength) return undefined;
    return this.upsert({});
  }

  /** Invoked to remove selected item from list.
   * You may query user with a dialog to prevent removal
   */
  async removeItemAsync(){
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
      this._loadItemFromData(one, isUiInput);
    }
  }

  /** Override to complete only after your children have loaded */
  async _doAwaitFullStructureLoad(){
    for(const one of this.#listElements) await one.updateComplete;
  }


  /** A reference to a function which handles mapping of existing data into new elements. Signature: f(this: ListBit, elemData: object, existingOnly: bool)*/
  get makeOrMapElementHandler(){ return this.#makeOrMapElementHandler; }
  set makeOrMapElementHandler(v){ this.#makeOrMapElementHandler = aver.isFunctionOrNull(v); }

  /** An element factory: projects data vector into appropriate list item element type.
   *  Returns AzosElement which should be used as a list item. You cam make instances of
   *  an appropriate type polymorphically.
   * The override DOES NOT need to bind data, data property binds later on
   * @param {any} elmData data object (such as a map) which is used to MAKE a new `AzosElement` derivative suitable to be a list item
   * @param {Boolean} existingOnly - true to only return existing elements, false to also make new elements if they do not exist for the specified data
   * @returns {AzosElement} an element which represents the data to be added to the list.
   * WARNING: this method may return an instance of already existing element as it deems necessary for elements of the same equality
   * as determined by business-driven equality comparison
   * */
  makeOrMapElement(elmData, existingOnly = false){
    //Do not confuse handlers and events. Handlers are function pointers and return values unlike events
    if (this.#makeOrMapElementHandler) return this.#makeOrMapElementHandler(this, elmData, existingOnly);

    if (this.indexOf(elmData) >= 0) return elmData;
    if (existingOnly) return null;

    const tItem = this.getDefaultItemClass();
    const result = new tItem();
    return result;
  }

  /** Protected: Loads item from data vector by mapping an object into an existing item or making a new item element (a factory method).
   * This method is nt expected to be called from business code as it is called as a part of data property assignment.
   * The newly created element is added into element list buffer
   */
  _loadItemFromData(data, isUiInput){
    aver.isNotNull(data);
    const elm = this.makeOrMapElement(data, false);
    if (!elm) return null;

    if (DATA_VALUE_PROP in elm) {
      const valToSet = isUiInput ? new UiInputValue(data) : data;
      //we need to bind the data synchronously as the element is not built yet
      //once the elements `updateComplete` resolves, we can now set its data value property
      elm.updateComplete.then(() => {
        elm[DATA_VALUE_PROP] = valToSet;
        if (elm[RESET_DIRTY_METHOD]) elm[RESET_DIRTY_METHOD]();
      });
    }

    if (this.indexOf(elm) < 0) this.#listElements.push(elm);

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

    const idxExisting = this.indexOf(elm);
    if (idxExisting < 0) this.#listElements.push(elm);
    this.requestUpdate();
    return idxExisting < 0;
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

   /**
   * Performs list length validation
   * @param {Error[]} errorBatch - an array of errors which have already been detected during validation. You add more errors via `errorBatch.push(...)`
   * @param {*} context optional validation context
   * @param {*} scope scoping specifier
   */
  // eslint-disable-next-line no-unused-vars
  _doValidate(errorBatch, context, scope){
    if (this.minLength > 0 && this.count < this.minLength){
      errorBatch.push(new ValidationError(getEffectiveSchema(this), dflt(this.name, "*"), scope, `List needs at least ${this.minLength} elements`, null, this.constructor.name));
    }

    if (this.maxLength > 0 && this.count > this.maxLength){
      errorBatch.push(new ValidationError(getEffectiveSchema(this), dflt(this.name, "*"), scope, `List may contain at most ${this.maxLength} elements`, null, this.constructor.name));
    }
  }

  /** Override to return {title, subtitle, commands[]} */
  _getSummaryData(effectDisabled, effectMutable){

    const commands = effectMutable ? [this._cmdAdd, this._cmdRemove] : [];

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
    const result = this.#listElements.map((one, i) => html`<div class="listItem ${one === this.#selectedElement ? "selected" : ""} ${i === this.#listElements.length-1 ? "last" : ""}" @focusin="${() => this.#divItemFocusIn(one)}">${one}</div>`);
    return result;
  }
}

window.customElements.define("az-list-bit", ListBit);
