import STL_INLINE_GRID from "azos-ui/styles/grid";
import { html, css } from "azos-ui/ui";
import { Applet } from "azos-ui/applet";
import { Block } from "azos-ui/blocks";
import { Command } from "azos-ui/cmd";
import { Spinner } from "azos-ui/spinner";
import { ForestSetupClient } from "azos/sysvc/cforest/forest-setup-client";
import "azos-ui/bit";

import "azos-ui/vcl/util/object-inspector";
import "azos-ui/vcl/tabs/tab-view";
import "azos-ui/vcl/tabs/tab";

import "azos-ui/parts/grid-split"
import "azos-ui/parts/select-field";

import "azos-ui/vcl/cforest/forest-summary";
import "azos-ui/vcl/cforest/forest-breadcrumbs";
// import "./forest-view";
// import "azos-ui/vcl/cforest/forest-settings";

export class CfgForestApplet2ABetterForestExplorer extends Applet  {

  static styles = [ STL_INLINE_GRID, Block.styles, css`
    h2, h3 { margin-top: 0; }
    .inputBar {
      display: flex;
      justify-content: flex-start;
    }

    .cardBasic {
      position: relative;
      border: var(--s-default-bor-ctl);
      background-color: var(--s-default-bg-ctl);
      padding: 0.55em 0.75em 0.55em 0.75em;
      border-radius: 0.75em 0.75em 0.75em 0.75em;
      box-shadow: var(--ctl-box-shadow);
      margin: 0 0 0.5em 0;
    }

    az-tab {
      margin: 0;
      padding: 0.5em;
      background-color: var(--s-default-bg-ctl);
      border: var(--s-default-bor-ctl);
      background-color: var(--s-default-bg-ctl);
      box-shadow: var(--ctl-box-shadow);
      border-radius: 0 0.75em 0 0.75em;
      overflow: auto;
    }

    .horizontalBtnBar {
      display: flex;
      width: 100%;
    }
    .horizontalBtnBar az-button {
      flex: 1;

    }

  `];

  #ref = { forestClient: ForestSetupClient };

  // Holds the root node id for the active tree for quick access
  // @todo: most likely remove for a better solution
  #rootNodeId = null;

  // Holds the forests and their trees
  // @todo: implement loading and saving of forest data
  #forests = [
    { id: "test-f1", title: "Test Forest 1", trees: [] },
    { id: "g8corp", title: "G8 Corporation", trees: [] }
  ];
  get forests() { return this.#forests; }

  /**
   * Cache for nodes to avoid redundant requests
   */
  #nodeCache = new Map(); // Map<id, nodeData>
  #nodeTreeMap = new Map(); // Map<parentId, childrenData[] >

  /**
   * Holds the currently selected forest id
   */
  #forest = null;
  get activeForest() { return this.#forest; }
  set activeForest(value) {
    if(this.#forest === value) return;
    this.#forest = value;
    this.requestUpdate();
  }

  /**
   * Holds the currently selected tree - trees are only ids...
   */
  #tree = null;
  get activeTree() { return this.#tree; }
  set activeTree(value) {
    if(this.#tree === value) return;
    this.#tree = value;
    this.requestUpdate();
  }

  /**
   * Holds the currently selected asOfUtc timestamp or is null for "now"
   * @type {Date|null}
   * @default null
   */
  #asOfUtc = null;
  get activeAsOfUtc() { return this.#asOfUtc; }
  set activeAsOfUtc(value) {
    if(this.#asOfUtc === value) return;
    this.#asOfUtc = (new Date(value)).toISOString(); // ensure it's a string
    this.requestUpdate();
  }

  /**
   * Holds the currently selected node id
   * @type {string|null}
   * @default null
   */
  #activeNodeId = null;
  get activeNodeId() { return this.#activeNodeId; }

  /**
   * Holds the currently selected node data
   * @type {object|null}
   * @default null
   */
  #activeNodeData = null;
  get activeNodeData() { return this.#activeNodeData; }


  get title(){
    const activeForest = this.#forest || " - ";
    const activeTree = this.#tree || " - ";
    const activeNodePath = this.#activeNodeData?.PathSegment ? this.#activeNodeData.PathSegment : "";
    return html`Forest Explorer: ${activeTree}@${activeForest} ${activeNodePath}`;
  }

  #forestSettingsCmd = new Command(this, {
    uri: `CfgForest.ForestTreeAsOfUtc`,
    icon: "svg://azos.ico.database",
    title: "CfgForest Settings",
    handler: async () =>  this.dlgCfgForestsSettingsModal.show()
  });

  #forestRefreshCmd = new Command(this, {
    uri: `CfgForest.RefreshForestTree`,
    icon: "svg://azos.ico.refresh",
    title: "CfgForest Refresh",
    handler: async () =>  await this.refreshTree()
  });

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
    this.arena.installToolbarCommands([ this.#forestSettingsCmd, this.#forestRefreshCmd]);
    Spinner.exec(async()=> await this.loadRootNode(),"Loading forests/trees");

    // debug only
    // @todo: !remove these before production!
    window.nodeTreeMap = this.#nodeTreeMap; // for debugging
    window.nodeCache = this.#nodeCache; // for debugging
    window.setCurrentNodeId = async (id) => await this.setActiveNodeId(id); // for debugging
  }

  refreshTree = async () => {
    console.debug("#refreshTree called");
    const currentNode = this.activeNodeData;
    await Spinner.exec(async()=> {
      await this.loadRootNode();
      if(currentNode.FullPath !== "/") {
        await this.loadNodeAncestors(currentNode.Id);
        await this.setActiveNodeId(currentNode.Id);
      }
    }, "Loading forests/trees");
  }

  async loadRootNode(){
    this.#nodeCache.clear();
    this.#nodeTreeMap.clear();

    // get and update all forests trees for selection
    for (let forestIdx = 0; forestIdx < this.#forests.length; forestIdx++) {
      const forest = this.#forests[forestIdx];
      const trees = await this.#ref.forestClient.treeList(forest.id);
      forest.trees = trees;
    }

    // set defaults for now
    // @todo: auto load the last used forest/tree/asofutc/nodeId or show setting modal for forests
    this.#forest = this.activeForest || "test-f1";
    this.#tree = this.activeTree || "t1";
    this.#asOfUtc = this.activeAsOfUtc || null ; // null means "now"

    // Get the root node for the active tree and set it's data as the current data object
    const rootNodeInfo = await this.#getNodeByPath(this.#forest, this.#tree, "/", this.#asOfUtc);
    this.#nodeCache.set(rootNodeInfo.Id, rootNodeInfo);
    this.#activeNodeData = rootNodeInfo;

    // Set the root node id for quick access
    this.#rootNodeId = rootNodeInfo.Id;
    // Set the active node id to the root node id
    this.#activeNodeId = rootNodeInfo.Id;

    // Load children of the root node to a depth of 2
    await this.loadNodeChildren(this.#rootNodeId, 4);

    this.arena.requestUpdate();
    this.requestUpdate();

    // @todo: allow for the loading of any node by id or path
    // @todo: path traversal to only load the children at the levels of the ancestor nodes
  }

  async loadNodeAncestors(nodeId, max = 10) {
    console.debug("#loadNodeAncestors", nodeId);
    if(!nodeId) return;
    const node = await this.#getNodeById(nodeId, this.#asOfUtc);
    if(!node) return;

    // Load the parent node
    const parentId = `${this.activeTree}.gnode@${this.activeForest}::${node.G_Parent}`;
    if(parentId && !this.#nodeTreeMap.has(parentId)) {
      await this.loadNodeChildren(parentId, 2);
    }

    // Load the ancestors recursively
    if(parentId && parentId !== `${this.activeTree}.gnode@${this.activeForest}::0:0:1` && max > 0) {
      await this.loadNodeAncestors(parentId, max - 1);
    }
  }

  async loadNodeChildren(parentId, depth = 2) {
    if(depth === 0 || this.#nodeTreeMap.has(parentId)) return;
    const children = await this.getChildrenNodesById(parentId);
    this.#nodeTreeMap.set(parentId, children);
    for (const child of children) {
      await this.loadNodeChildren(child.Id, depth - 1);
    }
  }

  async getChildrenNodesById(parentId) {
    const isCached = this.#nodeTreeMap.has(parentId);
    if(isCached){
      const childrenFromCache = this.#nodeTreeMap.get(parentId);
      return Array.isArray(childrenFromCache) ? childrenFromCache : [ childrenFromCache ];
      // @todo: look into why setting the children as an array with a single object gets only the object
    }

    const children = await this.#ref.forestClient.childNodeList(parentId) || [];
    this.#nodeTreeMap.set(parentId, children);
    return Array.isArray(children) ? children : [ children ];
  }

  async #getNodeByPath(idForest, idTree, path = '/', asOfUtc = this.#asOfUtc, abortSignal = null) {
    let node = await this.#ref.forestClient.probePath(idForest, idTree, path, asOfUtc, abortSignal);
    return node;
  }

  async #getNodeById(id = '0:0:1', asOfUtc = this.#asOfUtc, abortSignal = null) {
    let node = await this.#ref.forestClient.nodeInfo(id, asOfUtc, abortSignal);
    return node;
  }

  async setActiveNodeId(id) {
    console.debug("#setActiveNodeId", id);
    if(!id) return;
    this.#activeNodeId = id;
    this.#activeNodeData = this.#nodeCache.get(id) || null;
    if(!this.#nodeCache.get(id)) {
      this.#activeNodeData = await this.#getNodeById(id, this.#asOfUtc);
      this.#nodeCache.set(id, this.#activeNodeData);
      await this.loadNodeChildren(id);
    }
    this.requestUpdate();
  }

  _treeOptions(forestId = this.#tmpForestSelection || this.activeForest) {
    const treeOptions = this.#forests.find(f => f.id === forestId)?.trees.map(tree => html`<option value="${tree}" title="${tree}">${tree}</option>`) || [];
    if(treeOptions.length === 0) treeOptions.push(html`<option value="" title="No trees available">No trees available</option>`);
    if(treeOptions.length === 1 && treeOptions[0].value === "") {
      treeOptions.unshift(html`<option value="" title="Select a tree&hellip;">Select a tree&hellip;</option>`);
    }
    return treeOptions;
  }

  // settings holders
  #tmpForestSelection = null;
  #tmpTreeSelection = null;
  #tmpAsOfUtc = null;

  _onForestSelect(e) {
    e.preventDefault();
    console.log("#_onForestSelect", e.target.value);
    const forestSelect = this.shadowRoot.querySelector("#selectForest");
    this.#tmpForestSelection = forestSelect.value;
    this.#tmpTreeSelection = null;
    this.requestUpdate();
    this.arena.requestUpdate();
    // force update of the az-select tree options
    this.shadowRoot.querySelector("#selectTree").requestUpdate();
  }

  _onTreeSelect(e) {
    e.preventDefault();
    console.log("#_onTreeSelect", e.target.value);
    const treeSelect = this.shadowRoot.querySelector("#selectTree");
    this.#tmpTreeSelection = treeSelect.value;
    this.requestUpdate();
    this.arena.requestUpdate();
  }

  _onAsOfDateChange(e) {
    e.preventDefault();
    console.log("#_onAsOfDateChange", e.target.value);
    this.#tmpAsOfUtc = e.target.value;
    this.requestUpdate();
    this.arena.requestUpdate();
  }

  _onOkButtonClick() {
    console.log("#_onOkButtonClick", this.#tmpForestSelection, this.#tmpTreeSelection, this.#tmpAsOfUtc);
    // Set the active forest, tree and asOfUtc to the temporary selections
    this.activeForest = this.#tmpForestSelection;
    this.activeTree = this.#tmpTreeSelection;
    this.activeAsOfUtc = this.#tmpAsOfUtc ? new Date(this.#tmpAsOfUtc) : null;
    // Close the settings modal
    this.dlgCfgForestsSettingsModal.close();
    // Reset the temporary selections
    this.#tmpForestSelection = null;
    this.#tmpTreeSelection = null;
    this.#tmpAsOfUtc = null;
    // Refresh the tree view with the new selections
    this.refreshTree();
  }

  _onCrumbClick(crumbPath) {
    const findIdByFullPath = async (fullPath) => {
      const node = await this.#getNodeByPath(this.activeForest, this.activeTree, fullPath, this.activeAsOfUtc);
      if(!node) {
        console.warn("#findIdByFullPath - Node not found for path:", fullPath);
        return null;
      }
      return node.Id;
    }

    findIdByFullPath(crumbPath).then(nodeId => {
      if(nodeId) this.setActiveNodeId(nodeId);
    }).catch(err => console.error("Error finding node by path:", crumbPath, err));
  }

  renderNodeTreeCacheButtons(){
    const buttons = [];
    for(const entry of this.#nodeTreeMap.entries()){
      let [ , childNodeList ] = entry;
      childNodeList = Array.isArray(childNodeList) ? childNodeList : [ childNodeList ];
      childNodeList?.forEach(childNode => {
        buttons.push(html`<az-button title="Set ${childNode.PathSegment} as active" @click="${() => this.setActiveNodeId(childNode.Id)}"></az-button>`)
      });
    }
    return buttons;
  }


  render(){

    const forestId = this.#tmpForestSelection || this.activeForest;
    const forests = this.#forests.map(forest => html`<option value="${forest.id}" .selected="${  this.activeForest == forest.id }" title="${forest.title}">${forest.title}</option>`);
    const forestOptions = [forests.length === 0 ? html`<option value="No forests available" title="">No forests available</option>` : html`<option value="" title="Select a forest&hellip;">"Select a forest&hellip;</option>`, ...forests ];

    const trees = this.#forests.find(f => f.id === forestId)?.trees || [];
    const treeOptions = trees.length === 0 ? [ html`<option value="" title="No trees available">No trees available</option>` ] : [
      html`<option value="" title="Select a tree&hellip;">Select a tree&hellip;</option>`,
      ...trees.map(tree => html`<option value="${tree}" .selected="${this.#tmpTreeSelection === tree}" title="${tree}">${tree}</option>`)
    ];

    const asOfDisplay = (new Date( this.activeAsOfUtc ? this.activeAsOfUtc : Date.now())).toLocaleString();
    const showAsOf = !this.activeAsOfUtc
      ? html`<div class=""><strong>As of: </strong></span>Utc Now</div>`
      : html`<div class=""><span class="asOfUtc" @click="${(e) => this.#forestSettingsCmd.exec(this.arena)}"><strong>As of: </strong>${asOfDisplay}</span></div>`;





    return html`
    <az-modal-dialog id="dlgCfgForestsSettingsModal" scope="this" title="Forest">
      <div slot="body">
        <div class="row cols2">
          <div class="span2">
            <az-select id="selectForest" title="Forest" rank="Normal" @change="${this._onForestSelect}">${forestOptions}</az-select>
            <az-select id="selectTree" title="Tree" rank="Normal" @change="${this._onTreeSelect}">${treeOptions}</az-select>
          </div>
          <div class="span2">
            <az-text id="asOfDate" scope="this" title="As of Date" placeholder="2024/01/01 1:00 pm" dataType="date" dataKind="date"  @change="${this._onAsOfDateChange}"></az-text>
          </div>
          <div class="horizontalBtnBar">
            <az-button id="btnCfgForestSettings"  title="Ok"   @click="${this._onOkButtonClick}"></az-button>
            <az-button id="btnCloseSettings"      title="Close" @click="${() => {this.dlgCfgForestsSettingsModal.close()}}"></az-button>
          </div>
        </div>

        <h5>Pending selections</h5>
        <pre>
          Forest: ${this.#tmpForestSelection || "Not selected"}
          Tree: ${this.#tmpTreeSelection || "Not selected"}
          As of Date: ${this.#tmpAsOfUtc || "Not set"}
        </pre>

        <p>Active  values</p>
        <pre>
          Forest: ${this.activeForest || "Not selected"}
          Tree: ${this.activeTree || "Not selected"}
          As of Date: ${this.activeAsOfUtc || "Not set"}
        </pre>

        </div>
      </div>
    </az-modal-dialog>


    <az-cforest-breadcrumbs
      .node="${this.#activeNodeData}"
      .onCrumbClick="${this._onCrumbClick.bind(this)}"
      .onCFSettingsClick="${() => this.dlgCfgForestsSettingsModal.show()}"
      scope="this"
      id="cforestBreadcrumbs"
    ></az-cforest-breadcrumbs>
    <az-grid-split id="splitGridView" scope="this" splitLeftCols="4" splitRightCols="8">
      <div slot="left-top">
        <div class="cardBasic">
          ${showAsOf}
          <hr/>
          <ul>
            <li>Root: ${this.#forest} / ${this.#tree} @ ${this.#asOfUtc || "now"}</li>
            <li>Nodes in cache: ${this.#nodeCache.size}</li>
            <li>Nodes in tree map: ${this.#nodeTreeMap.size}</li>
          </ul>

          <az-button title="Set root as active" @click="${()=> this.setActiveNodeId(this.#rootNodeId) }"></az-button>
          ${this.renderNodeTreeCacheButtons()}
        </div>

      </div>
      <div slot="right-bottom">

        <div class="cardBasic">
          <az-cforest-summary .source="${this.#activeNodeData}" scope="this" id="cforestSummary"></az-cforest-summary>
        </div>

        <az-bit id="selectedSummary" scope="this" title="Summary" isExpanded="${true}">
          [ Node content details  ]
          <pre>${JSON.stringify(this.#activeNodeData, null, 2) || "No active node data"}</pre>
        </az-bit>

      </div>
    </az-grid-split>
    `;
  }
}

window.customElements.define("az-cfg-forest2-a-applet", CfgForestApplet2ABetterForestExplorer);
