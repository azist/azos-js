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
import "azos-ui/parts/select-field";

import "azos-ui/parts/grid-split"

import "azos-ui/vcl/cforest/node-summary";
import "azos-ui/vcl/cforest/node-breadcrumbs";
import "azos-ui/vcl/cforest/settings-dialog";
import "azos-ui/vcl/cforest/versions-dialog";

import "azos-ui/vcl/cforest/forest-treeview";

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
    }

    .minHeightEnforced {
      min-height: 30vh;
    }

    @media (max-width: 600px) {
      .minHeightEnforced {
        min-height: auto; /* Override for small screens */
      }
  `];

  #ref = { forestClient: ForestSetupClient };

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
    this.dlgSettings.requestUpdate();
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
    this.dlgSettings.requestUpdate();
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
    this.#asOfUtc = (value === null || value === undefined) ? this.#asOfUtc = null : (new Date(value)).toISOString(); // ensure it's a string
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
  set activeNodeData(value) {
    if(this.#activeNodeData === value) return;
    this.#activeNodeData = value;
    this.arena.requestUpdate();
  }

  get title(){
    const activeForest = this.#forest || " - ";
    const activeTree = this.#tree || " - ";
    const activeNodePath = this.#activeNodeData?.PathSegment ? this.#activeNodeData.PathSegment === "/" ? "://" : this.#activeNodeData.PathSegment : "";
    return html`Forest Explorer: ${activeTree}@${activeForest} &hellip; ${activeNodePath}`;
  }

  #forestSettingsCmd = new Command(this, {
    uri: `CfgForest.ForestTreeAsOfUtc`,
    icon: "svg://azos.ico.database",
    title: "CfgForest Settings",
    handler: async () =>  {
      const settings = (await this.dlgSettings.show()).modalResult;
      if (!settings) return;
      await this.#loadForestSettings(settings);
    }
  });

  #loadForestSettings = async ({ forest, tree, asOfUtc }) => {
    console.log(`Applying settings: Forest=${forest}, Tree=${tree}, AsOfDate=${asOfUtc}`);

    if(this.activeForest === forest && this.activeTree === tree && this.activeAsOfUtc === asOfUtc) return;
    this.activeForest = forest;
    this.activeTree = tree;
    this.activeAsOfUtc = asOfUtc;
    this.activeNodeData = null;
    this.refreshTree();
  }

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

    const bootstrap = async () => {
      await Spinner.exec(async()=> {
        await this.#loadRootNode();
        this.#addTreeViewEventListeners();
        this.arena.requestUpdate();
        this.requestUpdate();
      },"Loading forests/trees");
    }

    bootstrap();
    window.nodeCache = this.#nodeCache; // for debugging purposes
    window.nodeTreeMap = this.#nodeTreeMap; // for debugging purposes
  }

  #addTreeViewEventListeners(){
    this.tvExplorer.addEventListener("nodeUserAction", (e) => {
      e.stopPropagation();
      const { node, action } = e.detail;
      console.log("Node User Action:", action, node);

      if(action === "click") {
        // if(node.canOpen && !node.opened){
        //   node.icon = "svg://azos.ico.folderOpen";
        //   node.open();
        // }
        // if(node.canOpen && node.opened) {
        //   node.icon = "svg://azos.ico.folder";
        //   node.close();
        // }
        this.setActiveNodeId(node.data.Id, node);
        this.tvExplorer.selectedNode = node;
      }
    });
  }

  async #loadRootNode(){
    this.#nodeCache.clear();
    this.#nodeTreeMap.clear();

    for (let forestIdx = 0; forestIdx < this.#forests.length; forestIdx++) {
      this.#forests[forestIdx].trees = await this.#ref.forestClient.treeList(this.#forests[forestIdx].id);
    }

    this.#forest = this.activeForest || this.#forests[0].id;
    this.#tree = this.activeTree || this.#forests[0].trees[0];
    this.#asOfUtc = this.activeAsOfUtc || null;

    const rootNodeInfo = await this.#getNodeByPath(this.#forest, this.#tree, "/", this.#asOfUtc);
    this.#nodeCache.set(rootNodeInfo.Id, rootNodeInfo);
    this.#activeNodeData = rootNodeInfo;
    this.#activeNodeId = rootNodeInfo.Id;

    let root = undefined;
    if(this.tvExplorer){
      root = this.tvExplorer.root.addChild(rootNodeInfo.PathSegment, {
        data: { ...rootNodeInfo },
        showPath: false,
        canOpen: true,
        icon: "svg://azos.ico.home",
        endContent: html`<span title="${rootNodeInfo?.DataVersion?.State}">${rootNodeInfo?.DataVersion?.Utc}</span>`,
      });
      this.tvExplorer.requestUpdate();
    }

    await this.#loadNodeChildren( rootNodeInfo.Id, 2, root);
    this.setActiveNodeId(rootNodeInfo.Id, root);
  }

  async #loadNodeAncestors(targetNodeId) {
    const targetNodeData = await this.#getNodeById(targetNodeId, this.#asOfUtc);
    const paths = targetNodeData.FullPath.split("/").map( (v,i,a) => `/${a.slice(1,i+1).join("/")}`);

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const visibleNodes = this.tvExplorer.getAllVisibleNodes();
      const parentNode = visibleNodes.filter(n => n.data.FullPath === path);
      for (const node of parentNode) {
        await this.setActiveNodeId(node.data.Id, node);
      }
    }

    this.tvExplorer.requestUpdate();
  }

  async #loadNodeChildren(parentId, depth = 1, parentNode = null) {
    if(depth === 0 || this.#nodeTreeMap.has(parentId)) return;

    const children = await this.#getChildrenNodesById(parentId);
    this.#nodeTreeMap.set(parentId, children);
    if(!children || children.length === 0) {
      if(parentNode) {
        parentNode.canOpen = false;
        parentNode.canClose = false;
        parentNode.opened = false;
        parentNode.icon = "svg://azos.ico.draft";
        this.tvExplorer.requestUpdate();
      }
      return;
    }

    for (const child of children) {
      const childNodeInfo = await this.#getNodeById(child.Id, this.#asOfUtc);
      if (!childNodeInfo) {
        parentNode.canOpen = false;
        parentNode.opened = false;
        this.tvExplorer.requestUpdate();
        continue;
      }

      const childNode = parentNode.addChild(childNodeInfo.PathSegment, {
        data: { ...childNodeInfo },
        showPath: false,
        canOpen: true,
        opened: true,
        showChevron: false,
        endContent: html`<span title="${childNodeInfo?.DataVersion?.State}">${childNodeInfo?.DataVersion?.Utc}</span>`,
      });

      parentNode.canOpen = true;
      parentNode.canClose = true;
      parentNode.icon = parentNode.isOpen ? "svg://azos.ico.folderOpen" : "svg://azos.ico.folder";
      parentNode.open();

      await this.#loadNodeChildren(child.Id, depth - 1, childNode);
    }
    this.#updateNodeIcons();
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

  #updateNodeIcons() {
    // dirty fix for nodes
    this.tvExplorer.getAllVisibleNodes().forEach(node => {
      const nodeId = node.data?.Id;
      if(!nodeId) return;
      const fromTreeMap = this.#nodeTreeMap.get(nodeId);
      if(!fromTreeMap) return;
      if(fromTreeMap.length > 0) {
        node.canOpen = true;
        node.canClose = true;
        node.opened = true;
        node.icon = !node.isOpen ? "svg://azos.ico.folderOpen" : "svg://azos.ico.folder";
      } else {
        node.canOpen = false;
        node.canClose = false;
        node.opened = false;
        node.icon = "svg://azos.ico.draft";
      }
    });
    this.tvExplorer.requestUpdate();
  }

  async setActiveNodeId(id, originNode = null) {
    if(!id) return;
    this.#activeNodeId = id;
    this.#activeNodeData = this.#nodeCache.get(id) || null;
    if(!this.#nodeCache.get(id)) {
      this.#activeNodeData = await this.#getNodeById(id, this.#asOfUtc);
      this.#nodeCache.set(id, this.#activeNodeData);
    }
    await Spinner.exec(async()=> { await this.#loadNodeChildren(id, 1, originNode); }, "Loading node children");
    this.tvExplorer.selectedNode = originNode ? originNode : this.tvExplorer.getAllVisibleNodes().find(n => n.data.Id === id);

    this.arena.requestUpdate();
    this.requestUpdate();
  }

  async refreshTree(){
    const currentNode = { ...this.activeNodeData };

    await Spinner.exec(async()=> {
      this.tvExplorer.root.removeAllChildren();
      await this.#loadRootNode();

      if(currentNode?.Tree === this.activeTree && currentNode?.Forest === this.activeForest && currentNode.FullPath !== "/") {
        await this.#loadNodeAncestors(currentNode.Id);
        await this.setActiveNodeId(currentNode.Id);
      } else {
        await this.setActiveNodeId(this.tvExplorer.root.data.Id, this.tvExplorer.root);
      }
    }, "Loading forests/trees");
  }

  render(){
    const asOfDisplay = this.activeAsOfUtc;
    const showAsOf = !this.activeAsOfUtc
      ? html`<div class=""><strong>As of: </strong></span>Utc Now</div>`
      : html`<div class=""><span class="asOfUtc" @click="${() => this.#forestSettingsCmd.exec(this.arena)}"><strong>As of: </strong>${asOfDisplay}</span></div>`;

    return html`
      <az-forest-settings-dialog
        id="dlgSettings"
        scope="this"
        title="Forest"
        .settings="${{
          forests: this.#forests,
          activeForest: this.activeForest,
          activeTree: this.activeTree,
          activeAsOfUtc: this.activeAsOfUtc
        }}"
      ></az-forest-settings-dialog>

      <az-forest-node-version-dialog
        id="dlgNodeVersions"
        scope="this"
        title="Node Versions"
        .source="${this.#activeNodeData}"
        .activeForest="${this.activeForest}"
        .activeTree="${this.activeTree}"
      ></az-forest-node-version-dialog>

      <az-cforest-breadcrumbs
        .node="${this.#activeNodeData}"
        .onCrumbClick="${crumbPath => {
          const currentNode = this.tvExplorer.getAllVisibleNodes().find(n => n.data.FullPath === crumbPath);
          this.setActiveNodeId(currentNode?.data?.Id);
          this.tvExplorer.selectedNode = currentNode;
        }}"
        .onCFSettingsClick="${() => this.dlgSettings.show()}"
        scope="this"
        id="cforestBreadcrumbs"
      ></az-cforest-breadcrumbs>


      <az-grid-split id="splitGridView" scope="this" splitLeftCols="4" splitRightCols="8">
        <div slot="left-top">

          <div class="cardBasic">
            ${showAsOf}
            <hr style="opacity: 0.5;"/>
            <az-cforest-view id="tvExplorer" scope="this" class="minHeightEnforced"></az-cforest-view>
          </div>

        </div>
        <div slot="right-bottom">

          <div class="cardBasic">
            <az-cforest-summary .source="${this.#activeNodeData}" .openVersions="${() => this.dlgNodeVersions.show()}" scope="this" id="cforestSummary"></az-cforest-summary>
          </div>

          <az-tab-view title="Draggable TabView" activeTabIndex="0" isDraggable>
            <az-tab title="Selected Node" .canClose="${false}">
              <az-object-inspector id="objectInspector0" scope="self"
                .source=${this.#activeNodeData}></az-object-inspector>
            </az-tab>
            <az-tab title="Level Config" .canClose="${false}">
              <az-object-inspector id="objectInspector1" scope="self"
                .source=${this.#activeNodeData?.LevelConfig ? JSON.parse(this.#activeNodeData?.LevelConfig) : {}}></az-object-inspector>
            </az-tab>
            <az-tab title="Effective Config" .canClose="${false}">
              <az-object-inspector id="objectInspector2" scope="self"
                .source=${this.#activeNodeData?.EffectiveConfig ? JSON.parse(this.#activeNodeData?.EffectiveConfig) : {}}></az-object-inspector>
            </az-tab>
            <az-tab title="Properties" .canClose="${false}">
              <az-object-inspector id="objectInspector3" scope="self"
                .source=${this.#activeNodeData?.Properties ? JSON.parse(this.#activeNodeData?.Properties) : {}}></az-object-inspector>
            </az-tab>
          </az-tab-view>

        </div>
      </az-grid-split>
    `;
  }
}

window.customElements.define("az-cfg-forest-applet", CfgForestApplet);
