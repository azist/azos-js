import { ModalDialog } from "../modal-dialog";
import {html, verbatimHtml} from "../ui";

/**
 * XYZ asks question if uncle Toad washed his hands before supper
 */
export class XyzDialog extends ModalDialog{

  static properties ={
   toad: {type: "String"}
  };


  constructor(){
    super();
    this.title = "Did Uncle Toad wash before Supper?"
  }

  btnOkClick(){
    //console.dir(this.btnOk);
    //this.btnOk.isAbsent = true;
    this.btnOk.title += "1";
  }

  renderBody(){
    return html`<div class="dlg-body">Hello, ${this.toad}<br> I am XYZ, did you wash your hands? <br>

      <az-button id="btnOk" scope="this" title="OK!" status="ok" @click="${this.btnOkClick}">

      ${verbatimHtml(this.innerHTML)}
    </div>  `;
  }

  closeQuery(){
    return confirm("Hook you hard? and close");
    //return false;//prevent close
  }

}

window.customElements.define("xyz-dialog", XyzDialog);

