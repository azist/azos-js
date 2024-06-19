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
   transition: 0.5s;
 }

 dialog::backdrop{
   background: rgba(100,100,100,0.45);
   backdrop-filter: blur(4px);
 }

 .dlg-title{
 }

 .dlg-body{
 }

 .dlg-footer{
 }

   `;//styles

  static properties = {
    title: {type: String},

  };

  #shownPromise = null;
  #resolve = null;

  constructor() {
    super();
  }


  /** Returns true if this dialog instance is already shown  */
  get isShown(){ return this.#shownPromise !== null;}

  /** Returns a Promise which resolves with modal dialog result, or null if `show()` has not been called yet */
  get shownPromise() { return this.#shownPromise; }

  /** Opens a modal dialog box
   *
   * @returns {Promise<modal_result>}
  */
  show(){
    if (this.#shownPromise !== null) return this.#shownPromise;
    const dlg = this.shadowRoot.querySelector("dialog");
    dlg.showModal();
    this.#shownPromise = new Promise((resolve, reject) =>{
     this.#resolve = resolve;
    });

    return this.#shownPromise;
  }


  /** Override to prompt the user on Close, e.g. if your Dialog is "dirty"/contains unsaved changes
   * you may pop-up a confirmation box. Return "true" to allow close, false to prevent it.
   * The method is called by the close/flow
   */
  closeQuery(){
    return true;
  }

  onDialogClose(){
    this.#resolve("closed");
    this.#shownPromise = null;
  }

  render() {
    return html`
<dialog @close="${this.onDialogClose}">
  ${this.renderTitle()}
  ${this.renderBody()}
  ${this.renderFooter()}
</dialog>`;
  }//render

  /** Override to render title bar  */
  renderTitle(){
    return html`<div class="dlg-title">${this.title}</div>`;
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
