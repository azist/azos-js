/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import {
  VISIT_METHOD,
  ANNOUNCE_METHOD,
  asDataMode,
  DATA_BLOCK_CHANGED_METHOD,
  DATA_BLOCK_PROP,
  DATA_MODE,
  DATA_MODE_PROP,
  DATA_NAME_PROP,
  DATA_VALUE_PROP,
  DIRTY_PROP,
  ERROR_PROP,
  FORM_MODE_JSON_PROP,
  VALIDATE_METHOD,
  ValidationError,
  RESET_DIRTY_METHOD,
  CLOSE_QUERY_METHOD,
  DATA_SCHEMA_PROP,
  isNonEmptyString} from "azos/types";
import { Control, css, getBlockDataValue, getChildDataMembers, getDataParentOfMember, getEffectiveDataMode, getEffectiveSchema, getImmediateParentAzosElement, html, setBlockDataValue } from "./ui.js";
import { dflt, isOneOf } from "azos/strings";
import { isFunction as aver_isFunction } from "azos/aver";
import { prompt } from "./ok-cancel-modal.js";

/**
 * A higher order component which represents a grouping of user interface elements which are
 *  logically connected. e.g., "Address block" containing `street1`, `street2`, `city`, `state`, `zip`.
 * Blocks allow component composition: Block descendants may be re-used in a variety of interfaces,
 * such as popup modals, or be sub-blocks of other blocks or applets.
 *  A special derivation branch based on {@link Form} class represent a logically completed data-bound forms.
 */
export class Block extends Control {

  static styles = [css`:host{ display: block; }`];

  static properties = {
    name:        { type: String },
    title:       { type: String },
    description: { type: String },
    error:       { type: Object },
    schema:      { type: String },

    whenView:   {type: String},
    whenInsert: {type: String},
    whenUpdate: {type: String}
  };

  constructor() {
    super();
    this.title = this.constructor.name;
  }

  /** Use {@link _doLoad} to write business logic on load, when block and all its child structure has loaded.
   * This is defined by business rules of every block, as {@link _doAwaitFullStructureLoad} gets implemented accordingly.
   * Do not override `firstUpdated()` in blocks/forms, override `_doLoad()` instead.
  */
  firstUpdated(){
    super.firstUpdated();
    //wait forBlock to load
    queueMicrotask(async () => {
      await this.updateComplete; //override _doAwaitFullStructureLoad() to determine what "loaded block" means,
                                 //e.g. wait for the "business last" element to appear
      await this._doLoad();
    });
  }

  /** Returns a promise which indicates the completion of block loading when all child data entities (such as a sub-block or a field) load
   * Do not override this method, instead override {@link _doAwaitFullStructureLoad} to define what child fields/structures
   * comprise this block.
   * WARNING: This is how it is done in LIT 3 see: https://lit.dev/docs/components/lifecycle/#getUpdateComplete
   */
  async getUpdateComplete(){
    const result = await super.getUpdateComplete();
    await this._doAwaitFullStructureLoad();
    return result;
  }

  /** Override to complete only after your children have loaded - as dictated by business logic for your specific block */
  async _doAwaitFullStructureLoad(){
    //await this.tbMyField1.updateComplete;
    //await this.tbMyOtherField.updateComplete;
  }

  /** Override to perform actions on load, such as load initial data. Do not use `firstUpdated` */
  async _doLoad(){ }


  get[ERROR_PROP](){ return this.error; }
  set[ERROR_PROP](v){ this.error = v; }

  /** Checks whether any children have unsaved changes (dirty) */
  get [DIRTY_PROP]() {
    const mode = getEffectiveDataMode(this);
    if (mode && mode !== DATA_MODE.UNSPECIFIED) return true;//Must be in View mode not to be "dirty"
    return this[DATA_BLOCK_PROP].some(one => one[DIRTY_PROP] === true);
  }

  /** Resets dirty flag by going through all child data members and calling reset dirty on each */
  [RESET_DIRTY_METHOD](){
    for(const one of this[DATA_BLOCK_PROP]){
      one[RESET_DIRTY_METHOD]?.();
    }
    this.requestUpdate();
  }

  /**
   * Allows to iterate over data members (e.g. data fields) contained by this block
   */
  *[Symbol.iterator](){ yield* this[DATA_BLOCK_PROP]; }

  /**
   * Allows to iterate over data members (e.g. data fields) contained by this block
   */
  get [DATA_BLOCK_PROP](){ return getChildDataMembers(this, true); }

  /** Broadcasts an announcement message to all children */
  // eslint-disable-next-line no-unused-vars
  [ANNOUNCE_METHOD](sender, from, msg){
    const children = this[DATA_BLOCK_PROP];
    for(const one of children){
      one[ANNOUNCE_METHOD]?.(sender, this, msg);
    }
  }

  /**
   * Override to trigger `change` event dispatch after value changes DUE to user input.
   * The "value" of the block is taken from its constituent fields/parts which are children of the block {@link DATA_BLOCK_PROP}
   */
  [DATA_BLOCK_CHANGED_METHOD](sender){

    this.requestUpdate();

    //Data events are not bubbling and not composed and CANCEL-able
    const evt = new CustomEvent("datachange", { bubbles: false, composed: false, cancelable: true, detail: {sender: sender} });
    const proceed = this.dispatchEvent(evt);

    //we need to manually propagate them to parents
    if (proceed){
      const parent = getDataParentOfMember(this);
      if (parent && parent[DATA_BLOCK_CHANGED_METHOD]){
        parent[DATA_BLOCK_CHANGED_METHOD](sender);
      }
    }
  }

  /** Returns a logical schema name for this data block */
  get [DATA_SCHEMA_PROP](){ return isNonEmptyString(this.schema) ? `${this.constructor.name}('${this.schema}')` : `${this.constructor.name}`; }

  get [DATA_NAME_PROP](){ return this.name; }
  set [DATA_NAME_PROP](v){ this.name = v;}

  get [DATA_VALUE_PROP](){ return getBlockDataValue(this, false); }
  set [DATA_VALUE_PROP](v){
    const anythingApplied = setBlockDataValue(this, v);
    if (anythingApplied) this.requestUpdate();
  }

  //** Non-symbol named property shortcut to data protocol prop {@link DATA_VALUE_PROP} */
  get blockData(){ return this[DATA_VALUE_PROP]; }
  //** Non-symbol named property shortcut to data protocol prop {@link DATA_VALUE_PROP} */
  set blockData(v){ this[DATA_VALUE_PROP] = v; }

  /**
   * Establishes data validation protocol: a function of signature: `[VALIDATE_METHOD](context: any, scope: string, apply: bool): error | null`.
   * Performs validation logic returning an error object if validation fails.
   * Context object may include `[TARGET_PROP]` by convention to specify the validation target system id
   */
  [VALIDATE_METHOD](context, scope, apply = false){
    try{
      const items = this[DATA_BLOCK_PROP];
      var errorBatch = [];

      let i = 0;
      for(const item of items){
        const vm = item[VALIDATE_METHOD];
        if (vm){
          const ve = vm.call(item, context, i > 0 ? `${scope ?? ""}[${i}]` : scope, apply);
          if (ve) errorBatch.push(ve);
        }
        i++;
      }

      this._doValidate(errorBatch, context, scope);

      if (errorBatch.length === 0) {
        if (apply) {
          this.error = null;
          this.requestUpdate();
        }
        return null;//no errors
      }

      //Return a validation batch: an error with an array of errors in its `cause`
      const result = new ValidationError(getEffectiveSchema(getImmediateParentAzosElement(this)), dflt(this.name, "*"), scope, "Validation errors", "Errors", this.constructor.name, errorBatch);

      if (apply) {
        this.error = result;
        this.requestUpdate();
      }

      return result;
    } catch(e) {
      if (apply) {
        this.error = e;
        this.requestUpdate();
      }
      return e;
    }
  }

  /**
   * Override to perform block-level validation, such as cross-field validation.
   * This gets called after all fields have validated individually, having existing errors (if any) passed-in via `errorBatch`
   * @param {Error[]} errorBatch - an array of errors which have already been detected during validation. You add more errors via `errorBatch.push(...)`
   * @param {*} context optional validation context
   * @param {*} scope scoping specifier
   */
  // eslint-disable-next-line no-unused-vars
  _doValidate(errorBatch, context, scope){ }

  /**
   * Visits this object by applying a supplied function to this block and its data members
   * @param {Function} fVisitor required visitor body function `f(): bool` returning a truthy value to stop the traversal
   * @returns {boolean} true when traversal has stopped and should not be continued further
   */
  [VISIT_METHOD](fVisitor){
    aver_isFunction(fVisitor);

    const stop = fVisitor(this); //visit self

    if (stop) return true;

    //visit children
    const items = this[DATA_BLOCK_PROP];
    for(const item of items){
      if (item[VISIT_METHOD]?.(fVisitor)) return true;
    }

    return false;
  }

  calcHostStyles(effectiveAbsent){
    if (!effectiveAbsent && (this.whenView || this.whenInsert || this.whenUpdate)){//try to hide the element IF it is not demanded to be hidden already

      let mode = DATA_MODE_PROP in this.renderState
                   ? this.renderState[DATA_MODE_PROP]
                   : this.renderState[DATA_MODE_PROP] = getEffectiveDataMode(this);

      if (mode){
        const spec = mode === DATA_MODE.INSERT ? this.whenInsert : mode === DATA_MODE.UPDATE ? this.whenUpdate : this.whenView;
        effectiveAbsent = isOneOf(spec, ["absent", "remove"], false);
      }
    }

    return super.calcHostStyles(effectiveAbsent);
  }


}//Block


/**
 * A higher order {@link Block} which represents a data view/entry form.
 * Forms may have service/backend logic association and provide data models context -
 * this makes forms more specific than blocks as forms provide data schema via metadata for contained detail fields
 * and/or sub-blocks (which in turn may have child fields and/or sub-blocks etc.)
 * You may want to derive from a more specialized `CrudForm` if you need standard CRUD buttons (New/Edit/Save/Cancel) etc.
 */
export class Form extends Block {

  #dataMode;

  get dataMode(){ return this.#dataMode; }
  set dataMode(v){
    this.#dataMode = asDataMode(v) ?? DATA_MODE.UNSPECIFIED;
    this.requestUpdate();
    this[ANNOUNCE_METHOD](this, this, {event: "change", what: "DATA_MODE"});
  }

  get [DATA_MODE_PROP](){ return this.dataMode; }
  set [DATA_MODE_PROP](v){ this.dataMode = v; }

  get isViewMode() {
    const mode = this[DATA_MODE_PROP];
    return  mode === undefined || mode === DATA_MODE.UNSPECIFIED;
  }

  async [CLOSE_QUERY_METHOD](){
    if (!this[DIRTY_PROP]) return true;

    const result = await prompt("Discard data changes in progress?", {title: "Cancel Form", ok: "Discard", cancel: "No, go back", status: "warning", okBtnStatus: "error", rank: "normal"});
    return !!(result?.modalResult?.response);
   }

  static properties = {
    dataMode:   { type: String }
  };

  constructor() { super(); }

  get [DATA_VALUE_PROP](){
    const got = super[DATA_VALUE_PROP];
    got[FORM_MODE_JSON_PROP] = this.dataMode; //add form mode tag
    return got;
  }

  set [DATA_VALUE_PROP](v){
    super[DATA_VALUE_PROP] = v;
    const got = v?.[FORM_MODE_JSON_PROP];
    if (got) this.dataMode = asDataMode(got);// init form mode from set data
  }


  renderControl(){
    return html`<slot></slot>`;
  }

}//Form

window.customElements.define("az-form", Form);
