/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, POSITION, STATUS } from "azos-ui/ui";

import { Applet } from "azos-ui/applet";
import { Spinner } from "azos-ui/spinner";

import "azos-ui/parts/button";
import { toast } from "azos-ui/toast";
import "azos-ui/vcl/tree-view/tree-view";
import { Tab } from "azos-ui/vcl/tabs/tab";

import { AdlibClient } from "azos/sysvc/adlib/adlib-client";
import "azos-ui/vcl/adlib/filter-dialog";
import "azos-ui/vcl/adlib/context-dialog";
import { prompt } from "./ok-cancel-modal";
import { AdlibWorkTab } from "./adlib-work-tab";

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
    // await this.#loadData();

    // this.arena.installToolbarCommands([]);
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

  async #onAddTabToLeft(e) {
    e.preventDefault();
    // const collectionName = (await this.contextSelector.show()).modalResult;
    // if (!collectionName) return;
    // await this.#loadData(collectionName);
    const collectionName = "Things";
    this.tabView.addTab(AdlibWorkTab, `${collectionName}`);
  }

  render() {
    return html`
      <az-sky-adlib-ctx-selector-dialog id="contextSelector" scope="this" title="Select a context"></az-sky-adlib-ctx-selector-dialog>
      <az-sky-adlib-filter-dialog id="filterDialog" scope="this" title="Construct a filter"></az-sky-adlib-filter-dialog>
      <az-button @click=${this.#onAddTabToLeft} title="New Query"></az-button>
      <az-tab-view id="tabView" scope="this">
      </az-tab-view>
      `;
    // <input id=input1 tabindex=0>
    // <az-tree-view id="treeView" scope="this"
    //   @nodeUserAction=${this.#onNodeUserAction}
    //   .showRoot=${false}>
    // </az-tree-view>
    // <input id=input2 tabindex=0>
  }
}

window.customElements.define("az-sky-adlib-applet", AdlibApplet);
