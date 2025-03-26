/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { CLOSE_QUERY_METHOD } from "azos/types";
import { ModalDialog } from "../../modal-dialog";
import { html, verbatimHtml } from "../../ui";

/**
 * XYZ asks question if uncle Toad washed his hands before supper
 */
export class XyzDialog extends ModalDialog {
  constructor() {
    super();
    this.title = "Did Uncle Toad wash his hands?";
  }

  static properties = { toad: { type: "String" } };
  [CLOSE_QUERY_METHOD]() { return confirm("You've been hooked. Are you sure you wish to close?"); }

  #btnOkClick() { this.btnOk.title += "1"; }
  #btnCancelClick() { this.btnOk.isVisible = !this.btnOk.isVisible; }

  renderBody() {
    return html`
      <div class="dlg-body">
        <p>Hello, ${this.toad ?? "Nephew"}!</p>
        <p>I am XYZ, did Uncle Toad wash your hands?</p>

        ${verbatimHtml(this.innerHTML)}

        <az-button id="btnCancel" scope="this" title="No..." status="error" @click="${this.#btnCancelClick}"> </az-button>
        <az-button id="btnOk" scope="this" title="Yes!" status="ok" @click="${this.#btnOkClick}"> </az-button>
      </div>
    `;
  }
}

window.customElements.define("xyz-dialog", XyzDialog);
