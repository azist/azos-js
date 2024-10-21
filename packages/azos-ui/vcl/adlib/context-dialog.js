/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, css, POSITION } from "../../ui";
import { ModalDialog } from "../../modal-dialog";

import "../../parts/button";
import "../../parts/text-field";
import "../../parts/check-field";
import { AdlibClient } from "azos/sysvc/adlib/adlib-client";
import { Spinner } from "../../spinner";
import { deferredPromise } from "azos/types";
import { toast } from "../../toast";

export class AdlibTabContextSelectorDialog extends ModalDialog {
  static styles = [ModalDialog.styles, css`
.strip-h {
  display: flex;
  flex-wrap: wrap;
  margin: 0.5em 0em 0em 0em;
}

.dlg-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

az-tree-view {
  max-height: 75%;
  overflow: auto;
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
      this.#spacesData.forEach(name => root.addChild(name, {
        iconPath: "https://www.shareicon.net/download/2015/12/28/218240_network.ico",
        data: { type: "space", },
      }));
    }
    this.treeView.requestUpdate();
    return await super.show();
  }

  async close() {
    await super.close();
    this.#isVisible = false;
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

  async #onNodeUserAction(e) {
    const node = e.detail.node;
    const action = e.detail.action;
    if (action === "opened") {
      if (node.data?.type === "space" && !node.data.areCollectionsLoaded) {
        node.data.areCollectionsLoaded = true;
        Spinner.exec(async () => {
          const response = await this.#ref.svcAdlibClient.getCollections(node.title);
          const cData = response.data.data;
          cData.forEach(name => node.addChild(name, {
            canClose: false,
            canOpen: false,
            iconPath: "https://www.shareicon.net/download/2015/03/16/7846_database.ico",
            data: { type: "collection" }
          }));
          this.treeView.requestUpdate();
        });
      }
    } else if (action === "closed") toast(`Closed node: ${node.title}`, { position: POSITION.TOP_RIGHT });
    else if (action === "focusChanged") {
      this.#selectedContext = { name: node.title, type: node.data.type };
      // console.log('onFocusChanged', e);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
  }

  render() { return this.#isVisible ? super.render() : html``; }

  renderBodyContent() {
    return html`
<az-tree-view id="treeView" scope="this"
  class="tree-view"
  @nodeUserAction=${this.#onNodeUserAction}></az-tree-view>

<div class="strip-h">
  <az-button id="btnApply" scope="this" title="&#8623; Apply" @click="${this.#btnApplyClick}" status="ok"> </az-button>
  <az-button id="btnCancel" scope="this" title="Cancel" @click="${this.#btnCancelClick}"> </az-button>
</div>
    `;
  }

}

window.customElements.define("az-sky-adlib-ctx-selector-dialog", AdlibTabContextSelectorDialog);
