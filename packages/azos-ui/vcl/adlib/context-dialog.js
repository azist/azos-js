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
dialog {
    width: 100vw;
    max-width: 300px;
}

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
  width: 100%;
  overflow-y: scroll;
}

az-tree-view::part(tree) {
    padding: 0.2em;
    margin: 0;
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
        icon: "https://www.shareicon.net/download/2015/12/28/218240_network.ico",
        data: { type: "space", },
      }));
    }
    this.treeView.requestUpdate();
    return await super.show();
  }

  async close() {
    await super.close();
    this.treeView.closeAllNodes();
    this.#isVisible = false;
  }

  #spacesData = null;
  async #loadData() {
    if (!this.#spacesData) this.#spacesData = await Spinner.exec(async () => (await this.#ref.svcAdlibClient.getSpaces()).data.data);
    return this.#spacesData;
  }

  async #onNodeUserAction(e) {
    const node = e.detail.node;
    const action = e.detail.action;
    if (action === "opened") {
      if (node.data?.type === "space" && !node.data.areCollectionsLoaded) {
        node.data.areCollectionsLoaded = true;
        (await Spinner.exec(async () => (await this.#ref.svcAdlibClient.getCollections(node.title)).data.data))
          .forEach(name => node.addChild(name, {
            canClose: false,
            canOpen: false,
            icon: "https://www.shareicon.net/download/2015/03/16/7846_database.ico",
            data: { type: "collection" }
          }));
        this.treeView.requestUpdate();
      }
      //}else if (action === "closed") toast(`Closed node: ${node.title}`, { position: POSITION.TOP_RIGHT });
    } else if (action === "focusChanged") {
      if (node.data.type === "space") return;
      const collection = node.title;
      const space = node.parent.title;
      this.#selectedContext = { space, collection, type: node.data.type };
    } else if (action === "dblclick") {
      if (node.data.type === "space") return;
      const collection = node.title;
      const space = node.parent.title;
      this.#selectedContext = { space, collection, type: node.data.type };
      this.#btnApplyClick();
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
