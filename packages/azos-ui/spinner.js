/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isFunction } from "azos/aver";
import { AzosElement, html, css, parseRank, parseStatus, STATUS, RANK } from "./ui.js";


/**
 * Spinners indicate some kind of pending operation such as external service call
 */
export class Spinner extends AzosElement {

  /**
   * Shows a spinner with optional title, rank, status and modal mode.
   * This function create a new spinner instance every time and returns it.
   * You can pass the returned spinner instance into `spinner.hide()` to deterministically close it
  */
  static show(title = null, rank = RANK.NORMAL, status = STATUS.DEFAULT, isModal = false){
    const spinner = new Spinner();
    spinner.title = title;
    spinner.rank = rank;
    spinner.status = status;
    spinner.isModal = isModal | false;
    spinner.show();
    return spinner;
  }

  /** Shows a modal spinner with optional title, rank, and status
   * This function create a new spinner instance every time and returns it.
   * You can pass the returned spinner instance into `hide(spinner)` to deterministically dispose it
  */
  static showModal(title = null, rank = RANK.NORMAL, status = STATUS.DEFAULT){ return Spinner.show(title, rank, status, true); }

  /**
   * Asynchronously executes an action `fAction` showing a modal (blocking) spinner before the invocation and
   * ensuring that the spinner is hidden right after the invocation even if error is thrown
   */
  static async exec(fAction, title = null, rank = RANK.NORMAL, status = STATUS.DEFAULT){
    isFunction(fAction);
    const spinner = Spinner.showModal(title, rank, status);
    try     { await fAction(); }
    finally { spinner.hide(); }
  }


  static styles = css`
.lds-ring {
  /* change color here */
  color: #1c4c5b
}
.lds-ring,
.lds-ring div {
  box-sizing: border-box;
}
.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid currentColor;
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
  `;


  static properties = {
    title: {type: String},
    isModal: {type: Boolean},
    timeout: {type: Number}
  };


  #tmr = null;
  #isStandalone = true;
  #isShown = false;
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
    if (this.parentElement === null){
      document.appendChild(this);
      this.#isStandalone = true;
    }

    this.#tmr = setTimeout(() => this.hide(), this.timeout);
    return true;
  }

  /** Hides the shown spinner returning true if it was hidden, or false if it was already hidden before this call*/
  hide(){
    if (this.#isShown) return false;
    this.#isShown = false;
    if (this.#tmr) clearTimeout(this.#tmr);

    if (this.#isStandalone){
      setTimeout(() => document.removeChild(this), 1000);
    }

    return true;
  }

  renderBody(){
    return html`
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    `;
  }

}

//https://loading.io/css/
window.customElements.define("az-spinner", Spinner);
