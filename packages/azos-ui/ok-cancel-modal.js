/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, css } from "./ui";
import { ModalDialog } from "./modal-dialog";

import "./parts/button";
import { dflt } from "azos/strings";
import { isStringOrNull } from "azos/aver";

export class OkCancelModal extends ModalDialog {

  static properties = {
    okBtnTitle: { type: String },
    cancelBtnTitle: { type: String },
    okCancelPrompt: { type: String },
    doPromptUserInput: { type: Boolean },
    inputCurrentValue: { type: String },
    inputTitle: { type: String },
  };

  /**
   *
   * @param {String|false} okCancelPrompt The question to present to the user (dflt: "Are you sure?", when null; false, hides message)
   * @param {Object} modalOptions title=modal title (dflt: "Confirm"), ok=btn title (dflt: "Ok"), cancel=btn title (dflt: "Cancel")
   * @param {Object} inputOptions doPromptUserInput=produces `<az-text value='currentValue' (dflt: null) title='inputTitle' (dflt: null)></az-text>`
   */
  constructor(okCancelPrompt, { title, ok, cancel, okBtnStatus } = {}, { doPromptUserInput, currentValue, inputTitle } = {}) {
    super();
    this.title = dflt(title, "Confirm");
    this.okBtnTitle = dflt(ok, "Ok");
    this.okBtnStatus = dflt(okBtnStatus, "ok");
    this.cancelBtnTitle = dflt(cancel, "Cancel");
    this.okCancelPrompt = okCancelPrompt === false ? null : dflt(okCancelPrompt, "Are you sure?");
    this.doPromptUserInput = !!doPromptUserInput ?? false;
    this.inputValue = dflt(isStringOrNull(currentValue), null);
    this.inputTitle = dflt(isStringOrNull(inputTitle), null);
    this.modalResult = { response: false };
  }

  static styles = [ModalDialog.styles, css`
.strip-h{
  display: flex;
  justify-content: center;
}
  `];

  #onOkClick() {
    this.modalResult = {
      response: true,
      value: this.answer?.value,
    };
    this.close();
  }

  renderBodyContent() {
    return html`
${this.okCancelPrompt ? html`
<p class="strip-h">${this.okCancelPrompt}</p>`
        : html``}

${this.doPromptUserInput ? html`
<div class="strip-h">
  <az-text id="answer" scope="this" title="${this.inputTitle}" value="${this.inputValue}"> </az-text>
</div>`
        : html``}
<div class="strip-h">
  <az-button title="${this.cancelBtnTitle}" @click="${this.close}"> </az-button>
  <az-button title="${this.okBtnTitle}" @click="${this.#onOkClick}" status="ok"> </az-button>
</div>
    `;
  }

}

/**
 *
 * @param {String|null} okCancelPrompt The string for to prompt the user
 * @param {Object} modalOptions override title, ok, and cancel titles
 * @param {Object} inputOptions do prompt for user input, value will be added to modalResult
 * @returns
 */
export async function prompt(okCancelPrompt, { title, ok, cancel, okBtnStatus } = {}, { doPromptUserInput, currentValue, title: inputTitle } = {}) {
  const modal = new OkCancelModal(okCancelPrompt, { title, ok, cancel, okBtnStatus }, { doPromptUserInput, currentValue, inputTitle });
  document.body.appendChild(modal);
  modal.update();
  try {
    modal.show();
    return await modal.shownPromise;
  } finally {
    document.body.removeChild(modal);
  }
}

window.customElements.define("az-ok-cancel-modal", OkCancelModal);
