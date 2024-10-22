/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "azos-ui/ui";

import { Applet } from "azos-ui/applet";

import "azos-ui/parts/button";
import "azos-ui/vcl/tree-view/tree-view";
import "azos-ui/vcl/tabs/tab-view";

import { AdlibClient } from "azos/sysvc/adlib/adlib-client";
import "azos-ui/vcl/adlib/filter-dialog";
import "azos-ui/vcl/adlib/context-dialog";
import { AdlibCollectionTab } from "./adlib-collection-tab";
import { AdlibSpaceTab } from "./adlib-space-tab";

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
  }

  async #onAddTabToLeft(e) {
    e.preventDefault();
    const modal = await this.contextSelector.show();
    if (!modal.modalResult) return;
    const { space, collection, type } = modal.modalResult;
    this.addTab(type, space, collection);
  }

  addTab(type, space, collection) {
    let tab;
    if (type === "space")
      tab = this.tabView.addTab(AdlibSpaceTab, `${space}`, null, true);
    else if (type === "collection")
      tab = this.tabView.addTab(AdlibCollectionTab, `${collection}`, null, true);
    tab.context = { space, collection };
  }

  #onAddCollectionFilter() {
    let activeTab = this.tabView.activeTab;
    if (!activeTab) {
      this.addTab("collection", "g8formf", "temptest");
      activeTab = this.tabView.activeTab;
    }
    const space = activeTab.context.space;
    const collection = activeTab.context.collection;

    activeTab.filterText = JSON.stringify({
      filter: {
        space,
        collection,
        "fetchtags": true,
        "fetchcontent": true,
        "pagingStartIndex": 0,
        "pagingCount": 20
      }
    }, null, 4);
  }

  render() {
    return html`
      <az-sky-adlib-ctx-selector-dialog id="contextSelector" scope="this" title="Select a context"></az-sky-adlib-ctx-selector-dialog>
      <az-sky-adlib-filter-dialog id="filterDialog" scope="this" title="Construct filter"></az-sky-adlib-filter-dialog>
      <az-button title="New Query" @click="${this.#onAddTabToLeft}"></az-button>
      <az-button title="Add collection filter to active (or new) tab" @click="${this.#onAddCollectionFilter}"></az-button>
      <az-tab-view id="tabView" scope="this" .isDraggable="${true}">
      </az-tab-view>
      `;
  }
}

window.customElements.define("az-sky-adlib-applet", AdlibApplet);
