/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { css, html } from "azos-ui/ui";

import { Applet } from "azos-ui/applet";

import "azos-ui/parts/button";
import "azos-ui/vcl/tree-view/tree-view";
import "azos-ui/vcl/tabs/tab-view";

import { AdlibClient } from "azos/sysvc/adlib/adlib-client";
import "azos-ui/vcl/adlib/filter-dialog";
import "azos-ui/vcl/adlib/context-dialog";
import { AdlibCollectionTab } from "./adlib-collection-tab";
import { AdlibSpaceTab } from "./adlib-space-tab";
import { IStorage } from "azos/storage";
import { matchPattern } from "azos/strings";
import { Command } from "../../cmd";

/**  */
export class AdlibApplet extends Applet {

  static styles = css`
:host {display: block; padding: 1em;}
  `;

  #ref = {
    svcAdlibClient: AdlibClient,
  };

  #storage = null;
  get #hasStorage() { return !!this.#storage; }
  get #isStored() { return !!this.#storedValue; }
  get #storedValue() { return this.#storage === null ? null : this.#storage.getItem(this.#storageKey); }
  get #storageKey() { return `${this.arena.applet.localStoragePrefix}.${this.constructor.name}.${this.title}` }

  collections;
  get title() { return "Adlib Viewer"; }

  #cmdNewQuery = new Command(this, {
    uri: "Adlib.NewQuery",
    title: "New Query",
    icon: `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
            <rect width="6" height="28" x="11" y="0" fill="white"/>
            <rect width="28" height="6" x="0" y="11" fill="white"/>
          </svg>`,
    handler: (e) => this.#onAddTabToLeft(e)
  });

  #cmdPrefillQuery = new Command(this, {
    uri: "Adlib.PrefillQuery",
    title: "Add collection filter to active (or new) tab",
    icon: `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 20.5V25h4.5l13.3-13.3-4.5-4.5L3 20.5zM24.7 8.3c.4-.4.4-1 0-1.4l-3.6-3.6c-.4-.4-1-.4-1.4 0L17 5.6l4.5 4.5 3.2-3.3z" fill="white"/>
            <rect x="18" y="18" width="2" height="8" fill="white"/>
            <rect x="15" y="21" width="8" height="2" fill="white"/>
          </svg>`,
    handler: (e) => this.#onAddCollectionFilter(e)
  });

  async connectedCallback() {
    super.connectedCallback();
    this.arena.hideFooter(true);
    this.link(this.#ref);
    this.#storage = this.arena.app.moduleLinker.tryResolve(IStorage);
    this.arena.installToolbarCommands([this.#cmdPrefillQuery, this.#cmdNewQuery]);
  }

  async firstUpdated() {
    let matches = [];
    for (let i = 0; i < this.#storage?.length; i++) {
      const key = this.#storage.key(i);
      let match = matchPattern(key, this.localStoragePrefix + "*");
      if (match) matches.push({ key, value: JSON.parse(this.#storage.getItem(key)) });
    }
    matches.forEach(({ key, value }) => {
      const parts = key.split('.');
      const clzName = parts[parts.length - 2];
      const title = parts[parts.length - 1];
      const { context, filterText } = value;
      const found = [AdlibCollectionTab, AdlibSpaceTab].find(cls => cls.name === clzName);
      const tab = this.tabView.addTab(found, title);
      tab.context = context;
      tab.filter = filterText;
    });
  }

  async #onAddTabToLeft() {
    const modal = await this.contextSelector.show();
    if (!modal.modalResult) return;
    const { space, collection, type } = modal.modalResult;
    this.addTab(type, space, collection);
  }

  addTab(type, space, collection) {
    let tab;
    if (type === "collection")
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

    activeTab.filter = {
      filter: {
        space,
        collection,
        "fetchtags": true,
        "fetchcontent": true,
        "pagingStartIndex": 0,
        "pagingCount": 20
      }
    };
  }

  render() {
    return html`
      <az-sky-adlib-ctx-selector-dialog id="contextSelector" scope="this" title="Select a context"></az-sky-adlib-ctx-selector-dialog>
      <az-sky-adlib-filter-dialog id="filterDialog" scope="this" title="Construct filter"></az-sky-adlib-filter-dialog>
      <az-tab-view id="tabView" scope="this" .isDraggable="${true}" .allowCloseAll="${true}">
      </az-tab-view>
      `;
  }
}

window.customElements.define("az-sky-adlib-applet", AdlibApplet);
