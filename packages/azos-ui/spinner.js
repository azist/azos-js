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
   * ensuring that the spinner is hidden right after the invocation even if an error is thrown
   */
  static async exec(fAction, title = null, rank = RANK.NORMAL, status = STATUS.DEFAULT){
    isFunction(fAction);
    const spinner = Spinner.showModal(title, rank, status);
    try     { await fAction(); }
    finally { spinner.hide(); }
  }


  static styles = css`

.pop{
  font-size: 25px;

  width: 7em;
  height: 7em;
  border: none;
  border-radius: 1em;
  background-color: rgba(155, 155, 155, 0.45);
  overflow: hidden;
  padding: 1em;
}

div.pop:popover-open{
  opacity: 1;
  transition: 0.51s ease-in;
}

@starting-style{div.pop:popover-open{opacity: 0;}}


.lds-ring,
.lds-ring div {  box-sizing: border-box; }

.lds-ring {
  display: block;
  color: var(--ink);
  width: 7em;
  height: 7em;
  margin: auto;
  padding: 0px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 7em;
  height: 7em;
  margin: 0px;
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
    this.#isStandalone = false;

    if (this.parentNode === null){
      document.body.appendChild(this);
      this.update();//sync update dom build
      this.#isStandalone = true;
    }

    const div = this.$("pop");
    div.showPopover();

    this.#tmr = setTimeout(() => this.hide(), this.timeout);
    return true;
  }

  /** Hides the shown spinner returning true if it was hidden, or false if it was already hidden before this call*/
  hide(){
    if (!this.#isShown) return false;
    this.#isShown = false;
    if (this.#tmr) clearTimeout(this.#tmr);

    const div = this.$("pop");
    div.hidePopover();

    if (this.#isStandalone){
      setTimeout(() => document.body.removeChild(this), 1000);
    }

    return true;
  }

  render(){
    return html`
    <div id="pop" popover="manual" class="pop">
      <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>
    `;
  }

}

//https://loading.io/css/
window.customElements.define("az-spinner", Spinner);
