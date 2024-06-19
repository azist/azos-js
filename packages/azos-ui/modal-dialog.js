/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AzosElement, html, css } from "./ui.js";

/**
 * Provides abstraction for modal dialog boxes
 */
export class ModalDialog extends AzosElement {

  static styles = css`
  dialog{
   background: #f0f0f0;
   color: #4e4e4e;
   border: 1px solid #505050;
   border-radius: 6px;
   box-shadow: 2px 2px 18px rgba(28, 28, 28, 0.55);
   padding: 0px;

   opacity: 0;
   transform: scale(0.8, 0.5);
 }

 dialog[open] {
  opacity: 1;
  transform: scale(1,1);
  transition: 0.12s ease-out;
}

@starting-style {
  dialog[open] {
    opacity: 0;
    transform: scale(0.8, 0.5);
  }
}

 dialog::backdrop{
   background: rgba(100,100,100,0.45);
   backdrop-filter: blur(4px);
 }

 .dlg-title{
   width: 100%;
   height: auto;
   background: #b5b5b5;
   margin: 0px;
   padding: 8px 8px 8px 12px;
   font-size: 1.4em;
   font-weight: bold;
   color: #505050;
   box-sizing: border-box;
 }

 .dlg-title-close{
    float: right;
    font-size: 2em;
    font-weight: bold;
    color: #505050;
    cursor: pointer;
    margin-top: 1px;
    margin-right: 8px;
 }

 .dlg-body{
  padding: 8px;
 }

 .dlg-footer{
  padding: 8px;
 }

   `;//styles

  static properties = {
    title: {type: String},

  };

  #shownPromise = null;
  #resolve = null;
  #modalResult = null;

  constructor() {
    super();
  }


  /** Returns true if this dialog instance is already shown  */
  get isShown(){ return this.#shownPromise !== null;}

  /** Returns a Promise which resolves with modal dialog result, or null if `show()` has not been called yet */
  get shownPromise() { return this.#shownPromise; }

  /** Gets modal result object which is set when this dialog is closed */
  get modalResult() { return this.#modalResult; }

  /** Sets modal result before this dialog gets closed */
  set modalResult(v) { this.#modalResult = v; }

  /**
   * Opens a modal dialog box and instantly returns a promise
   * which is resolved on dialog close. You can then inspect `dialog.modalResult` property
   * to see why/how/with what result dialog was closed
   * @returns {Promise<this>} a promise with is resolved upon dialog box closure
  */
  show(){
    if (this.#shownPromise !== null) return this.#shownPromise;
    const dlg = this.#getDlgElm();
    dlg.showModal();
    this.#shownPromise = new Promise((resolve) => this.#resolve = resolve);
    return this.#shownPromise;
  }

  /**
   * Closes an open dialog box programmatically.
   * @returns {Promise<boolean>} True if already closed, or got closed. False if `closeQuery` prevented the close
   */
  async close(){
    if (this.#shownPromise === null) return true;
    const dlg = this.#getDlgElm();
    const canClose = await this.closeQuery();
    if (!canClose) return false;
    dlg.close();
    return true;
  }



  /**
   * Override to prompt the user on Close, e.g. if your Dialog is "dirty"/contains unsaved changes
   * you may pop-up a confirmation box. Return "true" to allow close, false to prevent it.
   * The method is called by the close/flow. By default returns true to always allow close
   * @returns {Promise<boolean> | boolean} Returns "true" to allow close, false to prevent it
   */
  closeQuery(){ return true; }

  #onDialogClose(){
    this.#modalResult = "Undetermined";
    this.#resolve(this);
    this.#shownPromise = null;
  }

  #onTitleXClick(){
    this.close();
  }

  #getDlgElm() { return this.shadowRoot.querySelector("dialog"); }

  render() {
    return html`
<dialog @close="${this.#onDialogClose}">
  ${this.renderTitle()}
  ${this.renderBody()}
  ${this.renderFooter()}
</dialog>`;
  }//render

  /** Override to render title bar  */
  renderTitle(){
    return html`
    <span class="dlg-title-close" @click="${this.#onTitleXClick}">×</span>
    <div class="dlg-title">${this.title} </div>`;
  }

  /** Override to render dialog body section */
  renderBody(){
    return html`<slot name="body" class="dlg-body"></slot>`;
  }

  /** Override to render dialog footer bar  */
  renderFooter(){
    return html`<div class="dlg-footer"> </div>`;
  }


}//ModalDialog

window.customElements.define("az-modal-dialog", ModalDialog);
