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

import "azos-ui/vcl/tree-view/tree-view";

import "azos-ui/parts/grid-split"
import "azos-ui/parts/select-field";

import "azos-ui/vcl/cforest/forest-summary";
import "azos-ui/vcl/cforest/forest-breadcrumbs";
import "azos-ui/vcl/cforest/forest-settings";


export class CfgForestApplet extends Applet  {

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
    }`];


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
    handler: async () =>  await this.dlgSettings.open()
  });

  #forestRefreshCmd = new Command(this, {
    uri: `CfgForest.RefreshForestTree`,
    icon: "svg://azos.ico.refresh",
    title: "CfgForest Refresh",
    handler: async () =>  await this.#refreshTree()
  });

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
    this.arena.installToolbarCommands([ this.#forestSettingsCmd, this.#forestRefreshCmd]);
    this.#bootstrap();
  }

  async #bootstrap(){
    await Spinner.exec(async()=> {
      await this.#loadRootNode();
      // listen for any treeview interactions
      this.tvExplorer.addEventListener("nodeUserAction", (e) => {
        e.stopPropagation();
        const { node, action } = e.detail;
        console.log("CfgForestApplet#tvExplorer nodeUserAction", { node, action });
        if (["click"].includes(action)){
          if(node.canOpen && !node.opened) node.open();
          if(node.canOpen && node.opened) node.close();
          this.#setActiveNodeId(node.data.Id, node);
        }
      });
    },"Loading forests/trees");

    // debug only
    // @todo: !remove these before production!
    window.nodeTreeMap = this.#nodeTreeMap; // for debugging
    window.nodeCache = this.#nodeCache; // for debugging
    window.setCurrentNodeId = async (id) => await this.#setActiveNodeId(id); // for debugging
  }

  async #refreshTree(){
    console.debug("#refreshTree called");
    const currentNode = this.activeNodeData;
    await Spinner.exec(async()=> {
      this.tvExplorer.root.removeAllChildren();
      await this.#loadRootNode();
      if(currentNode.FullPath !== "/") {
        await this.#loadNodeAncestors(currentNode.Id);
        await this.#setActiveNodeId(currentNode.Id);
      }
    }, "Loading forests/trees");
  }

  async #loadRootNode(){
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

    // add root node to the tree view
    let root = undefined;
    if(this.tvExplorer){
      root = this.tvExplorer.root.addChild(rootNodeInfo.PathSegment, {
        data: { ...rootNodeInfo },
        showPath: false,
        canOpen: true,
      });
      this.tvExplorer.requestUpdate();
    }

    // Load children of the root node to a depth of 2
    await this.#loadNodeChildren(this.#rootNodeId, 2, root);

    this.arena.requestUpdate();
    this.requestUpdate();

    // @todo: allow for the loading of any node by id or path
    // @todo: path traversal to only load the children at the levels of the ancestor nodes
  }

  // @todo: refactor to ensure children are loaded under the correct parent node
  async #loadNodeAncestors(nodeId, stopAtId = "0:0:1") {
    if(!nodeId) return;
    const parentNodeDetails = [];
    const node = await this.#getNodeById(nodeId, this.#asOfUtc);
    this.#nodeCache.set(nodeId, node);

    let parentId = `${this.activeTree}.gnode@${this.activeForest}::${node.G_Parent}`;

    // go up the tree gathering node info until root node is reached
    while(parentId !== `${this.activeTree}.gnode@${this.activeForest}::${stopAtId}`){
      const parentNodeInfo = await this.#getNodeById(parentId, this.#asOfUtc);
      parentNodeDetails.push({ id: parentId, info: parentNodeInfo});
      this.#nodeCache.set(parentId, parentNodeInfo);
      parentId = `${this.activeTree}.gnode@${this.activeForest}::${parentNodeInfo.G_Parent}`;
    }

    parentNodeDetails.reverse(); // reverse to start from the root node


    let parentNode = this.tvExplorer.getAllVisibleNodes().find( n => n.data.Id === parentId);
    let priorParent = this.tvExplorer.getAllVisibleNodes().find( n => n.data.Id === nodeId);
    // load each node starting from the root node children
    for (const { id, info } of parentNodeDetails) {
      console.log("all visible nodes", this.tvExplorer.getAllVisibleNodes());
      await this.#loadNodeChildren(id, 1, parentNode);
      priorParent = parentNode;
      parentNode = this.tvExplorer.getAllVisibleNodes().find(n => n.data.Id === id);
      console.log("CForestNodeVersions.#loadNodeAncestors", priorParent, parentNode);
    }

    this.tvExplorer.requestUpdate();
  }

  async #loadNodeChildren(parentId, depth = 2, parentNode = null) {
    if(depth === 0 || this.#nodeTreeMap.has(parentId)) return;
    const children = await this.#getChildrenNodesById(parentId);
    this.#nodeTreeMap.set(parentId, children);

    for (const child of children) {
      const childNodeInfo = await this.#getNodeById(child.Id, this.#asOfUtc);

      if(parentNode) {
        if (!childNodeInfo) {
          parentNode.canOpen = false;
          parentNode.chevronVisible = false;
          parentNode.opened = false;
          parentNode.icon = "svg://azos.ico.draft";
          this.tvExplorer.requestUpdate();
          continue;
        }
        parentNode.canOpen = true; // ensure the parent node can be opened
      }

      const childNode = parentNode.addChild(childNodeInfo.PathSegment, {
        data: { ...childNodeInfo },
        showPath: false,
        canOpen: true,
        ghostPostfix: html`<span title="${childNodeInfo?.DataVersion?.State}">${childNodeInfo?.DataVersion?.Utc}</span>`,
      });

      parentNode.open();
      await this.#loadNodeChildren(child.Id, depth - 1, childNode);
    }
    this.tvExplorer.requestUpdate();
  }

  async #getChildrenNodesById(parentId) {
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

  async #setActiveNodeId(id, originNode = null) {
    console.debug("#setActiveNodeId", id, originNode);
    if(!id) return;
    this.#activeNodeId = id;
    this.#activeNodeData = this.#nodeCache.get(id) || null;
    if(!this.#nodeCache.get(id)) {
      this.#activeNodeData = await this.#getNodeById(id, this.#asOfUtc);
      this.#nodeCache.set(id, this.#activeNodeData);
      await Spinner.exec(async()=> { await this.#loadNodeChildren(id, 2, originNode); }, "Loading node children");
    }
    this.requestUpdate();
  }

  #txtCrumbClick(crumbPath) {
    const findIdByFullPath = async (fullPath) => {
      const node = await this.#getNodeByPath(this.activeForest, this.activeTree, fullPath, this.activeAsOfUtc);
      if(!node) {
        console.warn("#findIdByFullPath - Node not found for path:", fullPath);
        return null;
      }
      return node.Id;
    }

    findIdByFullPath(crumbPath).then(nodeId => {
      if(nodeId) this.#setActiveNodeId(nodeId);
    }).catch(err => console.error("Error finding node by path:", crumbPath, err));
  }

  #renderDevInfo(){
    return html`
      <hr style="opacity: 0.5;"/>
      <ul>
        <li>Root: ${this.#forest} / ${this.#tree} @ ${this.#asOfUtc || "now"}</li>
        <li>Nodes in cache: ${this.#nodeCache.size}</li>
        <li>Nodes in tree map: ${this.#nodeTreeMap.size}</li>
      </ul>
    `;
  }

  render(){
    const asOfDisplay = this.activeAsOfUtc;
    const showAsOf = !this.activeAsOfUtc
      ? html`<div class=""><strong>As of: </strong></span>Utc Now</div>`
      : html`<div class=""><span class="asOfUtc" @click="${() => this.#forestSettingsCmd.exec(this.arena)}"><strong>As of: </strong>${asOfDisplay}</span></div>`;

    return html`
      <az-cfg-settings
        id="dlgSettings"
        scope="this"
        .forests="${this.#forests}"
        .activeForest="${this.activeForest}"
        .activeTree="${this.activeTree}"
        .activeAsOfUtc="${this.activeAsOfUtc}"
        .applySettings="${(forest, tree, asOfUtc) => {
          this.activeForest = forest;
          this.activeTree = tree;
          this.activeAsOfUtc = asOfUtc;
          this.#refreshTree();
        }}"
      ></az-cfg-settings>


      <az-cforest-breadcrumbs
        .node="${this.#activeNodeData}"
        .onCrumbClick="${this.#txtCrumbClick.bind(this)}"
        .onCFSettingsClick="${() => this.dlgCfgForestsSettingsModal.show()}"
        scope="this"
        id="cforestBreadcrumbs"
      ></az-cforest-breadcrumbs>


      <az-grid-split id="splitGridView" scope="this" splitLeftCols="4" splitRightCols="8">
        <div slot="left-top">

          <div class="cardBasic">
            ${showAsOf}
            <hr style="opacity: 0.5;"/>
            <az-tree-view id="tvExplorer" scope="this"></az-tree-view>
            ${this.#renderDevInfo()}
          </div>

        </div>
        <div slot="right-bottom">

          <div class="cardBasic">
            <az-cforest-summary .source="${this.#activeNodeData}" scope="this" id="cforestSummary"></az-cforest-summary>
          </div>

          <az-tab-view title="Draggable TabView" activeTabIndex="0" isDraggable>
            <az-tab title="Selected Node" .canClose="${false}">
                <az-object-inspector id="objectInspector0" scope="self" .source=${this.#activeNodeData}></az-object-inspector>
            </az-tab>
            <az-tab title="Level Config" .canClose="${false}">
              <az-object-inspector id="objectInspector1" scope="self" .source=${this.#activeNodeData?.LevelConfig ? JSON.parse(this.#activeNodeData?.LevelConfig) : {}}></az-object-inspector>
            </az-tab>
            <az-tab title="Effective Config" .canClose="${false}">
              <az-object-inspector id="objectInspector2" scope="self" .source=${this.#activeNodeData?.EffectiveConfig ? JSON.parse(this.#activeNodeData?.EffectiveConfig) : {}}></az-object-inspector>
            </az-tab>
            <az-tab title="Properties" .canClose="${false}">
              <az-object-inspector id="objectInspector3" scope="self" .source=${this.#activeNodeData?.Properties ? JSON.parse(this.#activeNodeData?.Properties) : {}}></az-object-inspector>
            </az-tab>
          </az-tab-view>

        </div>
      </az-grid-split>
    `;
  }
}

window.customElements.define("az-cfg-forest2-a-applet", CfgForestApplet);
