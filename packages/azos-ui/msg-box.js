/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { dflt } from "azos/strings";
import { ModalDialog } from "./modal-dialog";
import { html } from "./ui";

/**
 * A simple message dialog box with a close button
 */
export class MsgBox extends ModalDialog{

  static properties = {
   message: {type: String},
   closeTitle: {type: String},
   closeStatus: {type: String},
   pre: {type: Boolean}
  };


  constructor(){
    super();
    this.title = "Message";
  }

  #btnCloseClick(){ this.close(); }

  renderBody(){
    const msg = this.pre ? html`<pre>${this.message}</pre>` : html`<p>${this.message}</p>`;
    return html`
 <div class="dlg-body">
   ${msg}
   <az-button id="btnClose" scope="this" title="${dflt(this.closeTitle, "Close")}" status="${this.closeStatus}" @click="${this.#btnCloseClick}" style="float: right"> </az-button>
 </div>`;
  }

}

window.customElements.define("az-msgbox", MsgBox);

/** Shows OK msg box */
export function okMsg(title, message, rank = 3, pre = false)     { return showMsg("ok", title, message, rank, pre);     }

/** Shows Info msg box */
export function infoMsg(title, message, rank = 3, pre = false)   { return showMsg("info", title, message, rank, pre);   }

/** Shows Warning msg box */
export function warningMsg(title, message, rank = 3, pre = false){ return showMsg("warning", title, message, rank, pre);}

/** Shows Alert msg box */
export function alertMsg(title, message, rank = 3, pre = false)  { return showMsg("alert", title, message, rank, pre);  }

/** Shows Error msg box */
export function errorMsg(title, message, rank = 3, pre = false)  { return showMsg("error", title, message, rank, pre);  }


/** Shows a message box with the specified status, title, message, rank and pre option */
export async function showMsg(status, title, message, rank = 3, pre = false){
  const box = new MsgBox();
  box.status = status;
  box.title = title;
  box.message = message;
  box.rank = rank;
  box.pre = pre;
  document.body.appendChild(box);
  box.update();
  try{
    box.show();
    await box.shownPromise;
  }finally{
    document.body.removeChild(box);
  }
}
