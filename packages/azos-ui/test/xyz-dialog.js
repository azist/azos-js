/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { CLOSE_QUERY_METHOD } from "azos/types";
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

  btnCancelClick(){
    this.btnOk.isVisible = !this.btnOk.isVisible;
  }

  renderBody(){
    return html`<div class="dlg-body">Hello, ${this.toad}<br> I am XYZ, did you wash your hands? <br>

      <az-button id="btnOk" scope="this" title="OK!" status="ok" @click="${this.btnOkClick}"> </az-button>
      <az-button id="btnCancel" scope="this" title="Cancel" status="error" @click="${this.btnCancelClick}"> </az-button>

      ${verbatimHtml(this.innerHTML)}
    </div>  `;
  }

  [CLOSE_QUERY_METHOD](){
    return confirm("Hook you hard? and close");
    //return false;//prevent close
  }

}

window.customElements.define("xyz-dialog", XyzDialog);

