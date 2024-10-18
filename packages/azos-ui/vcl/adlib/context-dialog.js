/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, css } from "../../ui";
import { ModalDialog } from "../../modal-dialog";

import "../../parts/button";
import "../../parts/text-field";
import "../../parts/check-field";
import { AdlibClient } from "azos/sysvc/adlib/adlib-client";
import { Spinner } from "../../spinner";

export class AdlibTabContextSelectorDialog extends ModalDialog {
  static styles = [ModalDialog.styles, css`
.strip-h{
  display: flex;
  flex-wrap: wrap;
  margin: 0.5em 0em 0em 0em;
}
  `];

  #ref = {
    svcAdlibClient: AdlibClient,
  };

  #selectedContext;

  constructor() { super(); }

  #btnApplyClick() {
    this.modalResult = this.#selectedContext;
    this.close();
  }

  #btnCancelClick() {
    this.modalResult = null;
    this.close();
  }

  async show() {
    await super.show();
    await this.#loadData();
  }

  async #loadData() {
    Spinner.exec(async () => {
      const response = await this.#ref.svcAdlibClient.getSpaces();
      const spacesData = response.data.data;
      const root = this.treeView.root;
      spacesData.forEach(spaceName => root.addChild(spaceName, { data: { isSpace: true } }));
      this.treeView.requestUpdate();
      await new Promise(res => setTimeout(res, 30000));
    });
  }

  renderBodyContent() {
    return html`
<az-tree-view id=treeView scope=this></az-tree-view>

<div class="strip-h" style="float: right;">
  <az-button id="btnApply" scope="this" title="&#8623; Apply" @click="${this.#btnApplyClick}" status="ok"> </az-button>
  <az-button id="btnCancel" scope="this" title="Cancel" @click="${this.#btnCancelClick}"> </az-button>
</div>
    `;
  }

}

window.customElements.define("az-sky-adlib-ctx-selector-dialog", AdlibTabContextSelectorDialog);
