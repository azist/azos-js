/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOf } from "azos/aver";
import { AzosElement, css, html, noContent } from "./ui";
import { MenuCommand } from "./cmd";


//https://developer.chrome.com/blog/anchor-positioning-api

//We need more general popup manager
//having PopupMenu derive more specific popups
// e.g. i need a "combobox" popup, which is customized to show special content, just like popup menu, but it can be very different than menu


/**
 * Opens up a popup menu by the designated anchor
 */
export class PopupMenu extends AzosElement {

  static styles = css`

  `;//css

  static #instances = [];
  /** Get all menu instances in the order of their opening */
  static get instances() { return [...PopupMenu.#instances]; }


  /** Opens one more popup menu, possibly a child level over an existing one*/
  static open(cmdMenu, {anchor = null, position = null} = {}){
    isOf(cmdMenu, MenuCommand);

    const menu = new PopupMenu(cmdMenu, anchor, position);
    PopupMenu.#instances.push(menu);
    return menu;
  }

  /** Closes all popup menu levels currently open */
  static closeAll(){
    //todo: Close in reverse order
  }


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
    let cls = "";// `${parseRank(this.rank, true)} ${parseStatus(this.status, true)}`;

    if (this.isModal) cls += " modal";

    const body = this.#isShown ? html`<div>  MENU CONTENT </div>` : noContent;

    return html`<dialog id="pop" popover="manual" class="pop ${cls}" style="${this.#isShown ? "" : "display: none"}" @keydown="${this.#onKeyDown}">${body}</dialog>`;
  }

}

window.customElements.define("az-popup-menu", PopupMenu);
