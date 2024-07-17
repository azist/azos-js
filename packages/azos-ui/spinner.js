/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isFunction } from "azos/aver";
import { AzosElement, html, css, parseRank, parseStatus, STATUS, RANK, noContent } from "./ui.js";


/**
 * Spinners indicate some kind of pending operation such as external service call
 */
export class Spinner extends AzosElement {

  /**
   * Shows a spinner with optional message, timeout, rank, status and modal mode.
   * This function create a new spinner instance every time and returns it.
   * You can pass the returned spinner instance into `spinner.hide()` to deterministically close it
  */
  static show(msg = null, timeout = 0, rank = RANK.NORMAL, status = STATUS.DEFAULT, isModal = false){
    const spinner = new Spinner();
    spinner.message = msg;
    spinner.timeout = timeout | 0;
    spinner.rank = rank;
    spinner.status = status;
    spinner.isModal = isModal | false;
    spinner.show();
    return spinner;
  }

  /** Shows a modal spinner with optional message, timeout, rank, and status
   * This function create a new spinner instance every time and returns it.
   * You can pass the returned spinner instance into `hide(spinner)` to deterministically dispose it
  */
  static showModal(msg = null, timeout = 0, rank = RANK.NORMAL, status = STATUS.DEFAULT){ return Spinner.show(msg, timeout, rank, status, true); }

  /**
   * Asynchronously executes an action `fAction` showing a modal (blocking) spinner before the invocation and
   * ensuring that the spinner is hidden right after the invocation even if an error is thrown
   */
  static async exec(fAction, msg = null, rank = RANK.NORMAL, status = STATUS.DEFAULT){
    isFunction(fAction);
    const spinner = Spinner.showModal(msg, -1, rank, status);
    try     { await fAction(spinner); }
    finally { spinner.hide(); }
  }


  static styles = css`
dialog{
  display: block;
  border: none;
  border-radius: 1em;
  background: rgba(from var(--s-default-fg) r g b / .50);
  color:  var(--s-default-fg);
  overflow: hidden;
  padding: 1em;
  box-shadow: 0px 0px 24px #7f7f7f30;
  opacity: 0;
}

dialog.modal::backdrop{
  background: var(--modal-spin-backdrop-bg);
  backdrop-filter: var(--modal-spin-backdrop-filter);
}

dialog:popover-open, dialog[open]{
  opacity: 1;
  transition: 0.51s ease-in;
}

@starting-style{dialog:popover-open, dialog[open]{opacity: 0;}}


dialog:focus-visible, dialog:hover{ outline: none; }

.ring,.ring div {  box-sizing: border-box; }

.ring {
  display: block;
  width: 5em;
  height: 5em;
  padding 0px;
  margin: .5em auto .5em auto;
}
.ring div {
  display: inline-block;
  position: absolute;
  width: 5em;
  height: 5em;
  margin: auto;
  border: 0.5em solid currentColor;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: currentColor transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.msg{
  display: block;
  font-size: 0.75em;
  font-weight: bold;
  text-align: center;
  max-width: 24ch;
  min-width: 20ch;
  margin-top: 1em;
  -webkit-user-select: none;
  user-select: none;
  text-shadow: 0px 0px 6px hsl(from var(--s-default-fg-ctl) h s 85% / .95);
}

.r1 { font-size: var(--r1-fs); }
.r2 { font-size: var(--r2-fs); }
.r3 { font-size: var(--r3-fs); }
.r4 { font-size: var(--r4-fs); }
.r5 { font-size: var(--r5-fs); }
.r6 { font-size: var(--r6-fs); }
.ok      { background: rgba(from var(--s-ok-bg-ctl) r g b / .45);     color: var(--s-ok-fg-ctl);    text-shadow: 0px 0px 6px hsl(from var(--s-ok-fg-ctl) h s 85% / .95);}
.info    { background: rgba(from var(--s-info-bg-ctl) r g b / .45);   color: var(--s-info-fg-ctl);  text-shadow: 0px 0px 6px hsl(from var(--s-info-fg-ctl) h s 85% / .95);}
.warning { background: rgba(from var(--s-warn-bg-ctl) r g b / .45);   color: var(--s-warn-fg-ctl);  text-shadow: 0px 0px 6px hsl(from var(--s-warn-fg-ctl) h s 85% / .95);}
.alert   { background: rgba(from var(--s-alert-bg-ctl) r g b / .45);  color: var(--s-alert-fg-ctl); text-shadow: 0px 0px 6px hsl(from var(--s-alert-fg-ctl) h s 85% / .95);}
.error   { background: rgba(from var(--s-error-bg-ctl) r g b / .45);  color: var(--s-error-fg-ctl); text-shadow: 0px 0px 6px hsl(from var(--s-error-fg-ctl) h s 85% / .95);}
`;


  static properties = {
    message: {type: String},
    isModal: {type: Boolean},
    timeout: {type: Number}
  };


  #tmr = null;
  #isStandalone = true;
  #isShown = false;
  #shownAsModal = false;
  constructor(){
    super();
    this.timeout = 25_000;
  }


  /** Returns true if the spinner is shown */
  get isShown(){ return this.#isShown;}

  /** Shows a spinner returning true if it was shown, or false if it was already shown before this call */
  show(){
    if (this.#isShown) return false;
    this.#isShown = true;
    this.#isStandalone = false;

    if (this.parentNode === null){
      document.body.appendChild(this);
      this.#isStandalone = true;
      }

    this.update();//sync update dom build

    const dlg = this.$("pop");
    this.#shownAsModal = this.isModal;
    if (this.#shownAsModal)
      dlg.showModal();
    else
      dlg.showPopover();

    const to = this.timeout === 0 ? 40_000 : this.timeout;
    this.#tmr = to > 0 ? setTimeout(() => this.hide(), to) : null;
    return true;
  }

  /** Hides the shown spinner returning true if it was hidden, or false if it was already hidden before this call*/
  hide(){
    if (!this.#isShown) return false;
    this.#isShown = false;
    if (this.#tmr) clearTimeout(this.#tmr);

    this.update();//sync update dom build

    const dlg = this.$("pop");
    if (this.#shownAsModal)
      dlg.close();
    else
      dlg.hidePopover();

    if (this.#isStandalone){
      setTimeout(() => document.body.removeChild(this), 1000);
    }

    return true;
  }

  #onKeyDown(e){
    if (e.key === "Escape"){//prevent modal spinner close on ESCAPE
      e.preventDefault();
    }
  }

  render(){
    let cls = `${parseRank(this.rank, true)} ${parseStatus(this.status, true)}`;

    if (this.isModal) cls += " modal";

    const msg = this.message ? html`<div class="msg">${this.message}</div>` : noContent;

    const body = this.#isShown ? html`<div class="ring">  <div></div>  <div></div>  <div></div>  <div></div> </div>${msg}` : noContent;

    return html`<dialog id="pop" popover="manual" class="pop ${cls}" style="${this.#isShown ? "" : "display: none"}" @keydown="${this.#onKeyDown}">${body}</dialog>`;
  }

}

//https://loading.io/css/
window.customElements.define("az-spinner", Spinner);
