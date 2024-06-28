/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AzosElement, html, css, parseRank, parseStatus, noContent } from "./ui.js";


function onDocumentKeydown(e){
  if (e.key === "Escape"){
    const dlg = ModalDialog.topmost;
    if (!dlg) return;
    //console.log("====KEYDOWN ESCAPE SUPRESSED in: ", dlg.title);
    dlg.close();
    e.preventDefault();
  }
}



/**
 * Provides abstraction for modal dialog boxes
 */
export class ModalDialog extends AzosElement {

  static styles = css`
dialog{
  background: var(--paper);
  color: var(--ink);

  border: none;
  border-radius: var(--r3-brad-win);
  box-shadow: var(--modal-shadow);
  padding: 0px;
  margin-top: 15vh;
  opacity: 0;
  transform: scale(0.8, 0.5);
  overflow: hidden;
}

dialog[open] {
  opacity: 1;
  transform: scale(1,1);
  transition: 0.12s ease-out;
}

dialog:focus-visible, dialog:hover{ outline: none; }

@starting-style {
  dialog[open] {
    opacity: 0;
    transform: scale(0.8, 0.5);
  }
}

dialog::backdrop{
  background: var(--modal-backdrop-bg);
  backdrop-filter: var(--modal-backdrop-filter);
}

.r1 { font-size: var(--r1-fs); border-radius: var(--r1-brad-win); }
.r2 { font-size: var(--r2-fs); border-radius: var(--r2-brad-win); }
.r3 { font-size: var(--r3-fs); border-radius: var(--r3-brad-win); }
.r4 { font-size: var(--r4-fs); border-radius: var(--r4-brad-win); }
.r5 { font-size: var(--r5-fs); border-radius: var(--r5-brad-win); }
.r6 { font-size: var(--r6-fs); border-radius: var(--r6-brad-win); }


.dlg-title{
  width: 100%;
  height: auto;
  background: var(--modal-title-bg);
  color: var(--modal-title-fg);
  margin: 0px;
  padding: 0.25lh 1ch 0.25lh 1ch;
  font-size: 1.4em;
  font-weight: bold;
  box-sizing: border-box;
  min-height: 20px;
  text-align: left;
}

.dlg-title-close{
   float: right;
   font-size: 2em;
   font-weight: bold;
   color: var(--modal-title-fg);
   cursor: pointer;
   margin-right: 0.5ch;
}

.dlg-body{
  margin: 0px;
  padding: 0.5lh 1ch 0.5lh 1ch;
  max-height: 72vh;
  overflow: auto;
}

.ok      .dlg-title{ background: var(--s-ok-bg);     color: var(--s-ok-fg); }
.info    .dlg-title{ background: var(--s-info-bg);   color: var(--s-info-fg); }
.warning .dlg-title{ background: var(--s-warn-bg);   color: var(--s-warn-fg); }
.alert   .dlg-title{ background: var(--s-alert-bg);  color: var(--s-alert-fg); }
.error   .dlg-title{ background: var(--s-error-bg);  color: var(--s-error-fg); }

dialog.error  { border: 2px solid var(--s-error-bg); }
dialog.warning{ border: 2px solid var(--s-warn-bg); }
dialog.alert  { border: 2px solid var(--s-alert-bg); }
dialog.error  { border: 2px solid var(--s-error-bg); }

.ok      .dlg-title-close{  color: var(--s-ok-fg); }
.info    .dlg-title-close{  color: var(--s-info-fg); }
.warning .dlg-title-close{  color: var(--s-warn-fg); }
.alert   .dlg-title-close{  color: var(--s-alert-fg); }
.error   .dlg-title-close{  color: var(--s-error-fg); }
`;//styles

  static properties = {
    title: {type: String},
  };

  static #instances = [];

  /** Returns a stack of open dialogs, the top one being the last one in the array */
  static get instances(){ return [...ModalDialog.#instances]; }

  /** Returns a top-most global dialog instance open in this browser window or null if nothing is open */
  static get topmost(){
    const stack = ModalDialog.#instances;
    if (stack.length < 1) return null;
    return stack[stack.length - 1];
  }

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
    ModalDialog.#instances.push(this);
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
   * @returns {Promise<boolean> | boolean} Returns "true" (or Promise(true)) to allow close, false to prevent it
  */
  closeQuery(){ return true; }

  #onDialogClose(){
    this.#modalResult = null;
    ModalDialog.#instances.pop();
    this.#resolve(this);
    this.#shownPromise = null;
  }

  #onTitleXClick(){ this.close(); }


  connectedCallback(){
    super.connectedCallback();
    window.document.addEventListener("keydown", onDocumentKeydown);
  }

  disconnectedCallback(){
    window.document.removeEventListener("keydown", onDocumentKeydown);
    super.disconnectedCallback();
  }


  #getDlgElm(){ return this.shadowRoot.querySelector("dialog"); }

  render(){
    let cls = `${parseRank(this.rank, true)} ${parseStatus(this.status, true)}`;
    return html`<dialog  @close="${this.#onDialogClose}" class="${cls}"> ${this.renderTitle()} ${this.renderBody()}</dialog>`;
  }//render

  /** Override to render title bar  */
  renderTitle(){return html`<span class="dlg-title-close" @click="${this.#onTitleXClick}">×</span> <div class="dlg-title">${this.title} </div>`; }

  /** Override to render dialog body section */
  renderBody(){return html`<div class="dlg-body"><slot name="body"></slot></div>`; }
}//ModalDialog

window.customElements.define("az-modal-dialog", ModalDialog);
