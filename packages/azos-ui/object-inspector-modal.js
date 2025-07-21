/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, css } from "./ui";
import { ModalDialog } from "./modal-dialog";

import "./parts/button";
import "./vcl/util/object-inspector";
import { isObject } from "azos/aver";

export class ObjectInspectorModal extends ModalDialog {

  static styles = [ModalDialog.styles, css`
.strip-h{
  display: flex;
  justify-content: flex-end;
}
  `];

  static properties = {
    okBtnTitle: { type: String },
    objToInspect: {type: Object},
  };

  /**
   * @param {Object} obj The object to display within Object Inspector
   * @param {Object} modalOptions title=modal title (dflt: ""), okBtnTitle=btn title (dflt: "Ok")
   * @param {Arena} arena
   */
  constructor(obj, { title, okBtnTitle, okBtnStatus } = {}, arena) {
    super(arena);
    this.title = title ?? "";
    this.objToInspect = isObject(obj);
    this.okBtnTitle = okBtnTitle ?? "Ok";
    this.okBtnStatus = okBtnStatus ?? "ok";
    this.modalResult = { response: false };
  }

  #onOkClick() {
    this.modalResult = { response: true };
    this.close();
  }

  renderBodyContent() {
    return html`
<az-object-inspector .source="${this.objToInspect}"></az-object-inspector>
<div class="strip-h">
  <az-button title="${this.okBtnTitle}" @click="${this.#onOkClick}" status="${this.okBtnStatus}"> </az-button>
</div>
    `;
  }

}

/**
 * @param {String|null} objToInspect The object to inspect
 * @param {Object} modalOptions override title, okBtnTitle, okBtnStatus
 * @param {Arena} arena
 * @returns
 */
export async function showObject(objToInspect, { title, ok, okBtnStatus } = {}, arena) {
  const modal = new ObjectInspectorModal(objToInspect, { title, ok, okBtnStatus }, arena);
  document.body.appendChild(modal);
  try {
    modal.update();
    return await modal.show();
  } finally {
    document.body.removeChild(modal);
  }
}

window.customElements.define("object-inspector-modal", ObjectInspectorModal);
