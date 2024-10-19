/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, css } from "../../ui";
import { ModalDialog } from "../../modal-dialog";

import "../../parts/button";
import { dflt } from "azos/strings";

export class OkCancelModal extends ModalDialog {
  static properties = {
    okBtnTitle: String(),
    cancelBtnTitle: String(),
    okCancelPrompt: String(),
  };

  constructor(okCancelPrompt, { title, okBtnTitle, cancelBtnTitle } = {}) {
    super();
    this.title = dflt(title, "Confirm");
    this.okBtnTitle = dflt(okBtnTitle, "Ok");
    this.cancelBtnTitle = dflt(cancelBtnTitle, "Cancel");
    this.okCancelPrompt = dflt(okCancelPrompt, "Are you sure?");
  }

  static styles = [ModalDialog.styles, css`
.strip-h{
  display: flex;
  justify-content: center;
}
  `];

  #onCancelClick() {
    this.modalResult = false;
    this.close();
  }

  #onOkClick() {
    this.modalResult = true;
    this.close();
  }

  renderBodyContent() {
    return html`
<p class="strip-h">${this.okCancelPrompt}</p>

<div class="strip-h">
  <az-button title="${this.cancelBtnTitle}" @click="${this.#onCancelClick}"> </az-button>
  <az-button title="${this.okBtnTitle}" @click="${this.#onOkClick}" status="ok"> </az-button>
</div>
    `;
  }

}

export async function prompt(okCancelPrompt, { title, okBtnTitle, cancelBtnTitle } = {}) {
  const modal = new OkCancelModal(okCancelPrompt, { title, okBtnTitle, cancelBtnTitle });
  document.body.appendChild(modal);
  modal.update();
  try {
    modal.show();
    await modal.shownPromise;
    return modal.modalResult;
  } finally {
    document.body.removeChild(modal);
  }
}

window.customElements.define("az-ok-cancel-modal", OkCancelModal);
