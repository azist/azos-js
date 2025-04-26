/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { asString, DATA_MODE, DATA_MODE_PROP, DATA_VALUE_PROP, ERROR_PROP, isArray as types_isArray, VALIDATE_METHOD, VISIT_METHOD } from "azos/types";
import { Form, Block } from "./blocks.js";
import { css, html, noContent } from "./ui.js";
import { showMsg } from "./msg-box.js";
import { isOneOf } from "azos/strings";
import { isFunctionOrNull, isNotNull, isObjectOrNull } from "azos/aver";

/**
 * Provides {@link Form} specialization for CRUD -related data functionality.
 * You either subclass this form and override `_doSaveAsync()` method which saves the data OR
 * use this type as it takes the inner content via a built-in `slot`, in which case you need to
 * set `.saveAsyncHandler` function which is a delegate pattern implemented by the consumer of the form.
 **/
export class CrudForm extends Form {

  static styles = [Block.styles, css`
.toolbar{
  display: flex;
  flex-direction: row;
  gap: 0.25em;
  justify-content: right;
  place-items: center;
  margin: 0.25em 0.25em;
}

.cmd{  }
.commit{ width: 12ch; }

hr{ border: 1px solid var(--ink); opacity: 0.15; }
`];

  static properties = {
    toolbar: { type: String },
    capabilities: { type: String }
  };

  get isToolbarAbove()    { return isOneOf(this.toolbar, ["top", "above"]); }
  get isNewSupported()    { return this.isCapabilitySupported("new"); }
  get isEditSupported()   { return this.isCapabilitySupported("edit"); }
  get isRefreshSupported(){ return this.isCapabilitySupported("refresh"); }
  get isSaveSupported()   { return this.isNewSupported || this.isEditSupported; }
  get isCancelSupported() { return this.isSaveSupported; }

  #data = null;
  #saveResult;
  #saveAsyncHandler;
  #capabilities;

  get capabilities(){ return this.#capabilities ? this.#capabilities.join(" ") : null; }
  set capabilities(v){ this.#capabilities = asString(v, false).toLowerCase().split(" "); }

  isCapabilitySupported(cap){
    if (!types_isArray(this.#capabilities)) return true;
    return this.#capabilities.some(one => one === cap);
  }


  /** Gets form data buffer as set before a NEW or EDIT, or after a SAVE */
  get data(){ return this.#data; }
  /** Sets form data buffer as set before a NEW or EDIT, or after a SAVE */
  set data(v){ this.#data = isObjectOrNull(v); }


  /** Captures an object (if any) returned upon save */
  get saveResult(){ return this.#saveResult; }
  /** Captures an object (if any) returned upon save */
  set saveResult(v){ this.#saveResult = v; }


  /** A reference to an asynchronous function which handles data save operation. Required if you did not override the `_doSaveAsync()` method  */
  get saveAsyncHandler(){ return this.#saveAsyncHandler; }
  /** A reference to an asynchronous function which handles data save operation. Required if you did not override the `_doSaveAsync()` method  */
  set saveAsyncHandler(v){ this.#saveAsyncHandler = isFunctionOrNull(v); }


  firstUpdated(){
    super.firstUpdated();
    queueMicrotask(() => {
      this[DATA_VALUE_PROP] = this.data;
      this[DATA_MODE_PROP] = DATA_MODE.UNSPECIFIED;
      this.applyInvariants();
    });
  }

  #btnRefreshClick(){
    this.applyInvariants();
  }

  #btnNewClick(){
    this[DATA_VALUE_PROP] = null; //todo:  SET DEFAULT here
    this[DATA_MODE_PROP] = DATA_MODE.INSERT;
    this.applyInvariants();
  }

  #btnEditClick(){
    this[DATA_MODE_PROP] = DATA_MODE.UPDATE;
    this.applyInvariants();
  }


  async #btnSaveClick(){
    const errors = this[VALIDATE_METHOD]({}, null, true);

    //todo: Create a usable Validation Summary browser
    if (errors) {
      showMsg("error", "Validation Errors", "Error list: \n\n" +JSON.stringify(errors, null, 2), 3, true);
      return;
    }

    showMsg("ok", "Saved Data", "The following is obtained \n by calling [DATA_VALUE_PROP]: \n\n" +JSON.stringify(this[DATA_VALUE_PROP], null, 2), 3, true);

    this.#saveResult = await this._doSaveAsync();

    this.data = this[DATA_VALUE_PROP];//commit data into the buffer
    this[DATA_MODE_PROP] = DATA_MODE.UNSPECIFIED;
    this.applyInvariants();
  }

  /**
   * Override to perform actual work, such as service client or logic call.
   * The data is already client-validated before this call
   * Important: upon a successful save you can return/set some values into hidden fields, or `saveResult`
   * property -  this way you can pass extra data back, such as server-assigned GDID or save message
   * @returns {any} saveResult object, such as save message etc...
   * */
  async _doSaveAsync(){
     //Data events are not bubbling and not composed and CANCEL-able
     isNotNull(this.#saveAsyncHandler, "CrudForm.saveAsyncHandler function");
     return await this.#saveAsyncHandler.call(this);
  }

  async #btnCancelClick(){

    //todo:  Query isDirty and abort if there are changes

    //reset errors which do not matter as we cancel
    this[VISIT_METHOD]( one => {
      if (ERROR_PROP in one) one[ERROR_PROP] = null;
    });

    //set back to "View"
    this[DATA_VALUE_PROP] = this.#data;
    this[DATA_MODE_PROP] = DATA_MODE.UNSPECIFIED;

    this.applyInvariants();
  }

  /**
   * Override to apply invariant logical rules, such as button enabled/disabled states etc.
   * This method is called on every form mode transition, such as the one after NEW/EDIT/SAVE/CANCEL button clicks
   */
  applyInvariants(){
    const mode = this[DATA_MODE_PROP];
    const isView = mode === undefined || mode === DATA_MODE.UNSPECIFIED;
    this.btnRefresh.isEnabled = isView;
    this.btnNew.isEnabled = isView;
    this.btnEdit.isEnabled = isView && this.data;
    this.btnSave.isDisabled = isView;
    this.btnSave.status = isView ? "default" : "info";
    this.btnCancel.isDisabled = isView;
    this.btnCancel.status = isView ? "default" : "alert";
  }

  updated(){
    super.updated();
    this.applyInvariants();
  }

  renderControl(){
    return this.isToolbarAbove ? html` ${this.renderToolbar()} <hr> ${this.renderFormBody()} <br>`
                               : html` ${this.renderFormBody()} <br> <hr> ${this.renderToolbar()} `;
  }

  renderToolbar(){
    return html`
    <div class="toolbar">

      <az-button id="btnRefresh" scope="this"
        @click="${this.#btnRefreshClick}"
        title="Refresh"
        shrink
        class="cmd"
        icon="svg://azos.ico.refresh"
        .isAbsent=${!this.isRefreshSupported}></az-button>

      <az-button id="btnNew" scope="this"
        @click="${this.#btnNewClick}"
        title="New"
        shrink
        class="cmd"
        icon="svg://azos.ico.draft"
        .isAbsent=${!this.isNewSupported}></az-button>

      <az-button id="btnEdit" scope="this"
        @click="${this.#btnEditClick}"
        title="Edit"
        shrink
        class="cmd"
        icon="svg://azos.ico.edit"
        .isAbsent=${!this.isEditSupported}></az-button>

      ${this.isSaveSupported ? html`<div style="width: 4ch"></div>` : noContent}

      <az-button id="btnSave" scope="this"
        @click="${this.#btnSaveClick}"
        title="Save"
        class="commit"
        icon="svg://azos.ico.checkmark"
        .isAbsent=${!this.isSaveSupported}></az-button>

      <az-button id="btnCancel" scope="this"
        @click="${this.#btnCancelClick}"
        title="Cancel"
        class="commit"
        icon="svg://azos.ico.close"
        .isAbsent=${!this.isCancelSupported}></az-button>

    </div>`;
  }

  renderFormBody(){
    return html`<div class="form-body"> <slot>  </slot> </div>`;
  }

}

window.customElements.define("az-crud-form", CrudForm);
