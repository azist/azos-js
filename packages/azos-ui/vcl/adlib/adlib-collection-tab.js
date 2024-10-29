/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { CLOSE_QUERY_METHOD, DIRTY_PROP, isObject, isObjectOrArray } from "azos/types";
import { Tab } from "../tabs/tab";
import { prompt } from "../../ok-cancel-modal";
import { css, html, POSITION } from "../../ui";
import { AdlibClient } from "azos/sysvc/adlib/adlib-client";
import { Spinner } from "../../spinner";
import { toast } from "../../toast";
import writeToClipboard from "../util/clipboard";
import { IStorage } from "azos/storage";

/**
 * A Tab Control where to Query a Collection in Adlib.
 */
export class AdlibCollectionTab extends Tab {

  static styles = css`
.container {
  margin: 1em;
  height: 100%;
}

#resultsPanel {
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

#resultsPanel > * {
  width: 50vw;
  height: 100%;
  max-height: 500px;
  overflow-y: scroll;
}
  `;

  #ref = {
    svcAdlibClient: AdlibClient,
  };

  static properties = {
    context: { type: Object },
    filter: { type: String },
  };

  #storage = null;
  get #hasStorage() { return !!this.#storage; }
  get #isStored() { return !!this.#storedValue; }
  get #storedValue() { return this.#storage === null ? null : this.#storage.getItem(this.#storageKey); }
  get #storageKey() { return `${this.arena.applet.localStoragePrefix}.${this.constructor.name}.${this.title}` }

  get #filterText() { return this.filter ? JSON.stringify(this.filter, null, 2) : ''; }

  #dirty = true;
  get [DIRTY_PROP]() { return this.#dirty; }
  async [CLOSE_QUERY_METHOD]() {
    if (this.#isStored) {
      const { response } = await prompt("Delete this tab?") || {};
      if (response) this.#storage.removeItem(this.#storageKey); // else, hide it
      return response;
    }
    if (this[DIRTY_PROP]) return (await prompt("Close this tab?") || {}).response;
    return true;
  }

  constructor() {
    super();
    this.iconPath = "https://www.shareicon.net/download/2015/03/16/7846_database.ico";
  }

  async #onExecuteClick() {
    this.resultsTree.removeAllNodes();

    const filter = JSON.parse(this.filterElm.value);
    const got = await Spinner.exec(async () => this.#ref.svcAdlibClient.getItems(filter), "Fetching");
    if (!got) toast("A problem occurred while executing the query.", { timeout: 5_000, status: "error", position: POSITION.TOP_RIGHT });

    const gotResults = got.data.data;
    this.#populateResultsTree(gotResults);
    this.resultsCodeBox.source = JSON.stringify(gotResults, null, 2);
  }

  #populateResultsTree(results) {
    results.forEach((result, index) => createChild(`${index + 1}`, result, this.resultsTree.root));
    this.resultsTree.requestUpdate();

    function createChild(key, value, parent) {
      const objectOrArray = isObjectOrArray(value);
      const options = {
        canOpen: objectOrArray ? true : false,
        opened: objectOrArray ? true : false,
        showPath: false,
        data: { key, value, parent },
      };
      const title = key + (objectOrArray ? (isObject(value) ? " {}" : " []") : `: ${value}`);
      const node = parent.addChild(title, options);
      if (isObjectOrArray(value)) Object.entries(value).forEach(([k, v]) => createChild(k, v, node));
    }
  }

  #onCloseAllNodes() { this.resultsTree.closeAllNodes(); }
  #onClearAll() {
    this.resultsTree.removeAllNodes();
    this.resultsCodeBox.source = "";
    this.requestUpdate();
  }

  async #onNodeUserAction(e) {
    const { node, action } = e.detail;
    let { value } = node.data;

    if (action === "clicked") {
      if (node.hasChildren) value = JSON.stringify(value);
      await writeToClipboard(value);
      toast(`Copied!`);
    }
  }

  async #save() {
    this.#storage.setItem(this.#storageKey, JSON.stringify({ filterText: this.filter, context: this.context }));
    this.#dirty = false;
    this.requestUpdate();
    toast("Saved!", { timeout: 5_000, status: "ok", position: POSITION.TOP_RIGHT });
  }

  async #onSaveClick() {
    if (!this.#hasStorage || !this.#dirty) return;

    if (this.#isStored) {
      this.#save();
      return;
    }

    let readyToWriteToNewStorage = false;
    let newTitle = this.title;
    let newStorageKey;

    while (!readyToWriteToNewStorage) {
      let { response: rr, value: inputName } = await prompt(false,
        { title: "Save the tab", ok: "Save", cancel: "Cancel" },
        { doPromptUserInput: true, currentValue: newTitle, title: "Name:" }) || {};

      if (rr === false) return;

      newTitle = inputName;
      newStorageKey = `${this.arena.applet.localStoragePrefix}.${this.constructor.name}.${newTitle}`;

      const currentStoredValue = this.#storage.getItem(newStorageKey);
      if (currentStoredValue) {
        const { response: overwriteResponse } = await prompt(`Overwrite '${newTitle}'?`);
        readyToWriteToNewStorage = overwriteResponse;
      } else readyToWriteToNewStorage = true;
    }

    this.#dirty = false;
    this.title = newTitle;
    this.#save();
  }

  #filterTextChanged() {
    this.#dirty = true;
    this.requestUpdate();
  }

  firstUpdated() {
    super.firstUpdated();
    this.btnSave.isAbsent = !this.#hasStorage;
  }

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
    this.#storage = this.arena.app.moduleLinker.tryResolve(IStorage);
  }

  render() {
    return html`
<div class="container">
  <form @submit="${this.#onExecuteClick}" name="CollectionForm">
    <az-text id="filterElm" scope="this" itemtype="multiline" @input="${this.#filterTextChanged}" value="${this.#filterText}" rank="4"></az-text>

    <az-button title="Execute" status="ok" type="submit" @click="${this.#onExecuteClick}"></az-button>
    <az-button id="btnSave" scope="this" title="Save" type="button" @click="${this.#onSaveClick}"></az-button>
    <az-button title="Close All Nodes" type="button" @click="${this.#onCloseAllNodes}"></az-button>
    <az-button title="Clear Results" status="error" type="button" @click="${this.#onClearAll}"></az-button>
  </form>

  <div id="resultsPanel">
    <div><az-tree-view id="resultsTree" scope="this" @nodeUserAction=${this.#onNodeUserAction}></az-tree-view></div>
    <div><az-code-box id="resultsCodeBox" scope="this" highlight="json" rank="4" ></az-code-box></div>
  </div>
</div>
  `;
    // <az-grid-view></az-grid-view>
  }

}

window.customElements.define("az-adlib-collection-tab", AdlibCollectionTab);
