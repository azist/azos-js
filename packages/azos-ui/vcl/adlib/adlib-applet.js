/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AdlibClient } from "azos/sysvc/adlib/adlib-client";
import { html, STATUS } from "azos-ui/ui";

import { Applet } from "azos-ui/applet";
import { Spinner } from "azos-ui/spinner";

import { TreeNode } from "../../parts/tree-node";
import "../tree-view/tree-view";
import "../tree-view/tree-node";

/**  */
export class AdlibApplet extends Applet {

  #ref = {
    svcAdlibClient: AdlibClient,
  };

  collections;

  get title() { return "Adlib Viewer"; }

  async connectedCallback() {
    super.connectedCallback();
    this.arena.hideFooter(true);
    this.link(this.#ref);
    // this.arena.installToolbarCommands([]);
    await this.#loadData();
  }

  async #loadData() {
    Spinner.exec(async () => {
      const response = await this.#ref.svcAdlibClient.getSpaces();
      console.dir(response);
      const root = new TreeNode("/");

      const spacesData = response.data.data;
      const spaceCollectionPromises = await Promise.allSettled(
        spacesData.map(async spaceName => await this.#ref.svcAdlibClient.getCollections(spaceName))
      );

      spacesData
        .map((spaceName, index) => {
          const result = spaceCollectionPromises[index];
          if (result.status === 'fulfilled') {
            return {
              success: true,
              spaceName: spaceName,
              collections: result.value.data.data,
            };
          } else {
            return {
              success: false,
              error: result.reason.error
            }
          }
        })
        .filter(result => result.success)
        .forEach(({ spaceName, collections }) => {
          const node = new TreeNode(spaceName);
          collections.map(collectionName => node.addChild(new TreeNode(collectionName)));
          root.addChild(node);
        });

      this.treeView.root = root;
    });
  }

  render() {
    // <az-sky-adlib-grid id="gridData" scope="this" @showRowData=${this.onShowRowData}>
    // </az-sky-adlib-grid>
    // <div>${this.collections}</div>
    // <az-modal-dialog id="dlgData" scope="this" title="Collections" status="normal">
    // <div slot="body">
    //   <az-button @click="${this.onDlgDataClose}" title="Close" style="float: right;"></az-button>
    // </div>
    // </az-modal-dialog>
    return html`
    <az-tree-view id="treeView" scope="this">
    </az-tree-view>
    `;
  }

  async onShowRowData(e) {
    if (!e.detail.what) {
      this.collections = (await this.#ref.svcAdlibClient.getCollections(e.detail.row)).data.data.join(', ');
      console.dir(this.collections);
      this.dlgData.status = STATUS.DEFAULT;
      this.dlgData.title = `Collections for Space: ${e.detail.row}`;
      this.dlgData.show();
      this.requestUpdate();
    }
  }

}

window.customElements.define("az-sky-adlib-applet", AdlibApplet);
