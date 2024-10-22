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
    const {name, type} = modal.modalResult;
    if (!modal.modalResult) return;
    if (type === "space")
      this.tabView.addTab(AdlibSpaceTab, `${name}`, null, true);
    else if (type === "collection")
      this.tabView.addTab(AdlibCollectionTab, `${name}`, null, true);
  }

  render() {
    return html`
      <az-sky-adlib-ctx-selector-dialog id="contextSelector" scope="this" title="Select a context"></az-sky-adlib-ctx-selector-dialog>
      <az-sky-adlib-filter-dialog id="filterDialog" scope="this" title="Construct a filter"></az-sky-adlib-filter-dialog>
      <az-button @click=${this.#onAddTabToLeft} title="New Query"></az-button>
      <az-tab-view id="tabView" scope="this" .isDraggable="${true}">
        <az-adlib-collection-tab></az-adlib-collection-tab>
        <az-adlib-space-tab></az-adlib-space-tab>
      </az-tab-view>
      `;
  }
}

window.customElements.define("az-sky-adlib-applet", AdlibApplet);
