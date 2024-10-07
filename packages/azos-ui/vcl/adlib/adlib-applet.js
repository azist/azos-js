/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AdlibClient } from "azos/sysvc/adlib/adlib-client";
import { html, POSITION, STATUS } from "azos-ui/ui";

import { Applet } from "azos-ui/applet";
import { Spinner } from "azos-ui/spinner";

import { toast } from "azos-ui/toast";
import "../tree-view/tree-view";
import "azos-ui/parts/button";

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
    await this.#loadData();

    // this.arena.installToolbarCommands([]);
  }

  // async firstUpdated() {
  //   super.firstUpdated();
  //   this.$("input2").tabindex = 0;
  //   this.$("input2").focus();
  // }

  async #loadData() {
    Spinner.exec(async () => {
      const response = await this.#ref.svcAdlibClient.getSpaces();
      const spacesData = response.data.data;
      const root = this.treeView.root;
      spacesData.forEach(spaceName => root.addChild(spaceName, { data: { isSpace: true } }));
      this.treeView.requestUpdate();
    });
  }

  async #onNodeUserAction(e) {
    const node = e.detail.node;
    const action = e.detail.action;

    console.log('onOpenNode', e);
    if (action === "opened") {
      if (node.data?.isSpace && !node.data.areCollectionsLoaded) {
        node.data.areCollectionsLoaded = true;
        Spinner.exec(async () => {
          const response = await this.#ref.svcAdlibClient.getCollections(node.title);
          const collectionsData = response.data.data;
          collectionsData.forEach(collectionName => node.addChild(collectionName, { data: { isCollection: true, yesOrNo: Math.random() < 0.25 } }));
          this.treeView.requestUpdate();
        });
      } else if (!node.hasChildren) {
        if (node.data?.isCollection && !node.data.areCollectionChildrenLoaded) {
          node.data.areCollectionChildrenLoaded = true;
          Spinner.exec(async () => {
            await new Promise(r => setTimeout(r, 500));
            toast(`There are no children for node '${node.title}'.`, { status: STATUS.INFO, position: POSITION.TOP_RIGHT });
          });
          node.hideChevron();
        }
      }
    } else if (action === "closed") toast(`Closed node: ${node.title}`, { position: POSITION.TOP_RIGHT });
  }

  async onNodeChecked(e) {
    const node = e.detail.node;
    console.log('onNodeChecked', e);
    console.log(`Node is ${node.isChecked ? "" : "not"} checked`);
  }

  render() {
    return html`
      <input id=input1 tabindex=0>
      <az-tree-view id="treeView" scope="this"
        @nodeUserAction=${this.#onNodeUserAction}
        .showRoot=${false}>
      </az-tree-view>
      `;
    // @nodeOpenOrClose=${this.onOpenNode}
  }
}

window.customElements.define("az-sky-adlib-applet", AdlibApplet);
