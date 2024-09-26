/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AdlibClient } from "azos/sysvc/adlib/adlib-client";
import { html, POSITION, STATUS } from "azos-ui/ui";

import { Applet } from "azos-ui/applet";
import { Spinner } from "azos-ui/spinner";

import { Toast } from "azos-ui/toast";
import { TreeNode } from "../../parts/tree-node";
import "../tree-view/tree-view";

const toast = Toast.toast.bind(Toast);

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
      const root = this.treeView.createRootNode("root", null, null, null, null, { isRoot: true });
      const spacesData = response.data.data;
      spacesData.forEach(spaceName => root.addChild(spaceName, null, null, null, null, { isSpace: true }));
      this.requestUpdate();
    });
  }

  async updateSpacesWithCollections(spacesData, root) {
    const spaceCollectionPromises = await Promise.allSettled(
      spacesData.map(async (spaceName) => await this.#ref.svcAdlibClient.getCollections(spaceName))
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
          };
        }
      })
      .filter(result => result.success)
      .forEach(({ spaceName, collections }) => {
        const node = new TreeNode(spaceName);
        root.addChild(node);
        collections.map(collectionName => node.addChild(new TreeNode(collectionName)));
      });
  }

  async onExpandNode(e) {
    const node = e.detail.node;
    if (node.isExpanded) {
      if (node.data?.isSpace && !node.data.areCollectionsLoaded) {
        Spinner.exec(async () => {
          const response = await this.#ref.svcAdlibClient.getCollections(node.caption);
          const collectionsData = response.data.data;
          collectionsData.forEach(collectionName => node.addChild(collectionName, null, null, null, null, { isCollection: true }));
          this.treeView.expand(node);
          node.data.areCollectionsLoaded = true;
        });
      } else if (node.data?.isCollection && !node.hasChildren) {
        if (!node.data.areCollectionChildrenLoaded) {
          node.data.areCollectionChildrenLoaded = true;
          Spinner.exec(async () => {
            await new Promise(r => setTimeout(r, 500));
            toast(`There are no children for node '${node.caption}'.`, undefined, null, STATUS.INFO, POSITION.TOP_RIGHT);
          });
        }
        this.treeView.hideChevron(node);
      }
    }
  }

  render() {
    return html`
    <az-tree-view id="treeView" scope="this"
      @expandNode=${this.onExpandNode}
      .doRenderRoot=${true}>
    </az-tree-view>
    `;
  }

  async onShowRowData(e) {
    if (!e.detail.what) {
      this.collections = (await this.#ref.svcAdlibClient.getCollections(e.detail.row)).data.data.join(', ');
      this.dlgData.status = STATUS.DEFAULT;
      this.dlgData.title = `Collections for Space: ${e.detail.row}`;
      this.dlgData.show();
      this.requestUpdate();
    }
  }

}

window.customElements.define("az-sky-adlib-applet", AdlibApplet);
