import { ModalDialog } from "../modal-dialog";
import {html, css} from "../ui";

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

  renderBody(){
    return html`<div class="dlg-body">Hello, ${this.toad}<br> I am XYZ, did you wash your hands?</div> `;
  }

  closeQuery(){
    return false;//prevent close
  }

}

window.customElements.define("xyz-dialog", XyzDialog);

