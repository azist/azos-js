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


export function ok(title, message, rank)     { return show("ok", title, message, rank);     }
export function info(title, message, rank)   { return show("info", title, message, rank);   }
export function warning(title, message, rank){ return show("warning", title, message, rank);}
export function alert(title, message, rank)  { return show("alert", title, message, rank);  }
export function error(title, message, rank)  { return show("error", title, message, rank);  }


export async function show(status, title, message, rank = 3, pre = false){
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
