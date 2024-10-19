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
import { deferredPromise } from "azos/types";

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
  #isVisible = false;

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
    let dataLoaded = !!this.#spacesData;
    if (!dataLoaded) await this.#loadData();

    this.#isVisible = true;
    this.requestUpdate();
    await this.updateComplete;

    if (!dataLoaded) {
      const root = this.treeView.root;
      this.#spacesData.forEach(spaceName => root.addChild(spaceName, { data: { isSpace: true } }));
    }
    this.treeView.requestUpdate();
    await super.show();
  }

  async close() {
    this.#isVisible = false;
    await super.close();
  }

  #spacesData = null;
  async #loadData() {
    if (this.#spacesData) return this.#spacesData;
    const { promise, resolve } = deferredPromise();
    Spinner.exec(async () => {
      const spacesResponse = await this.#ref.svcAdlibClient.getSpaces();
      this.#spacesData = spacesResponse.data.data;
      resolve(this.#spacesData);
    });
    return promise;
  }

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
  }

  render() { return this.#isVisible ? super.render() : html``; }

  renderBodyContent() {
    return html`
<az-tree-view id="treeView" scope="this"></az-tree-view>

<div class="strip-h" style="float: right;">
  <az-button id="btnApply" scope="this" title="&#8623; Apply" @click="${this.#btnApplyClick}" status="ok"> </az-button>
  <az-button id="btnCancel" scope="this" title="Cancel" @click="${this.#btnCancelClick}"> </az-button>
</div>
    `;
  }

}

window.customElements.define("az-sky-adlib-ctx-selector-dialog", AdlibTabContextSelectorDialog);
