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
  }

  async firstUpdated() {
    this.treeView.createRootNode("root", null, null, null, null);
    await this.#loadData();
  }

  async #loadData() {
    Spinner.exec(async () => {
      const response = await this.#ref.svcAdlibClient.getSpaces();
      const spacesData = response.data.data;
      spacesData.forEach(spaceName => this.treeView.root.addChild(spaceName, null, null, null, null, { isSpace: true }));
      this.requestUpdate();
    });
  }

  async updateSpacesWithCollections(spacesData, root) {
    const spaceCollectionPromises = await Promise.allSettled(
      spacesData.map(async (spaceName) => await this.#ref.svcAdlibClient.getCollections(spaceName))
    );

    spacesData.forEach((spaceName, index) => {
      const result = spaceCollectionPromises[index];
      if (result.status === 'fulfilled') {
        const node = root.addChild(spaceName);
        result.value.data.data.map(collectionName => node.addChild(collectionName));
      } else {
        toast(result.reason.error, null, null, STATUS.ALERT, POSITION.TOP_RIGHT);
      }
    });
  }

  async onOpenNode(e) {
    const node = e.detail.node;
    console.log('onOpenNode', e);
    if (node.isOpened) {
      if (node.data?.isSpace && !node.data.areCollectionsLoaded) {
        Spinner.exec(async () => {
          const response = await this.#ref.svcAdlibClient.getCollections(node.caption);
          const collectionsData = response.data.data;
          collectionsData.forEach(collectionName => node.addChild(collectionName, null, null, null, null, { isCollection: true }));
          this.treeView.open(node, true, false);
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

  async onNodeChecked(e) {
    const node = e.detail.node;
    console.log('onNodeChecked', e);
    console.log(`Node is ${node.isChecked ? "" : "not"} checked`);
  }

  render() {
    return html`
    <input name="moo"></input>
    <input name="moo2"></input>
    <az-tree-view id="treeView" scope="this"
      @openNode=${this.onOpenNode}
      .doRenderRoot=${true}>
    </az-tree-view>
    `;
  }

}

window.customElements.define("az-sky-adlib-applet", AdlibApplet);
