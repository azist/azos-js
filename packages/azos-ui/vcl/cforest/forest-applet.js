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
import { isAssigned } from "azos/types";


/**
 * CfgForestApplet is an applet that provides a user interface for exploring and managing configuration forests, their trees, and their nodes.
 */
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
      border-radius: var(--r4-brad-ctl);
      box-shadow: var(--ctl-box-shadow);
      margin: 0 0 0.5em 0;
    }

    az-tab {
      margin: 0;
      padding: 0.5em;
      border: var(--s-default-bor-ctl);
      background-color: var(--s-default-bg-ctl);
      box-shadow: var(--ctl-box-shadow);
      border-radius: 0 var(--r4-brad-ctl) 0 var(--r4-brad-ctl);
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
   }
  `];

  #ref = { forestClient: ForestSetupClient };

  // Holds the forests and their trees
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
  }

  /**
   * Holds the currently selected tree - trees are only ids...
   */
  #tree = null;
  get activeTree() { return this.#tree; }
  set activeTree(value) {
    if(this.#tree === value) return;
    this.#tree = value;
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
  }

  /**
   * Returns the title of the applet based on the active forest, tree, and node path.
   * If no forest or tree is selected, it defaults to " - "
   */
  get title(){
    const activeForest = this.#forest || " - ";
    const activeTree = this.#tree || " - ";
    const activeNodePath = this.#activeNodeData?.PathSegment ? this.#activeNodeData.PathSegment === "/" ? "://" : this.#activeNodeData.PathSegment : "";
    return html`Config Tree Explorer: ${activeTree}@${activeForest} &hellip; ${activeNodePath}`;
  }

  /**
   * Command to open the settings dialog for configuring the forest, tree, and an optional asOfUtc
   */
  #forestSettingsCmd = new Command(this, {
    uri: `CfgForest.ForestTreeAsOfUtc`,
    icon: "svg://azos.ico.database",
    title: "CfgForest Settings",
    handler: async () =>  {
      const settings = (await this.dlgSettings.show()).modalResult;
      if (!settings) return;
      await this.#applyForestSettings(settings);
    }
  });


  /**
   * Command to refresh the forest tree view.
   * It reloads the root node and updates the tree view.
   */
  #forestRefreshCmd = new Command(this, {
    uri: `CfgForest.RefreshForestTree`,
    icon: "svg://azos.ico.refresh",
    title: "CfgForest Refresh",
    handler: async () =>  await this.refreshTree()
  });

  /**
   * Applies the forest settings by updating the active forest, tree, and asOfUtc.
   * If the settings are the same as the current active settings, it does nothing.
   * @param {Object} settings - The settings object containing forest, tree, and asOfUtc.
   * @param {string} settings.forest - The id of the forest to set as active.
   * @param {string} settings.tree - The id of the tree to set as active.
   * @param {string|null} settings.asOfUtc - The UTC timestamp to set as active, or null for "now".
   */
  #applyForestSettings = async ({ forest, tree, asOfUtc }) => {
    console.log(`Applying settings: Forest=${forest}, Tree=${tree}, AsOfDate=${asOfUtc}`);

    if(this.activeForest === forest && this.activeTree === tree && this.activeAsOfUtc === asOfUtc) return;
    this.activeForest = forest;
    this.activeTree = tree;
    this.activeAsOfUtc = asOfUtc;
    this.activeNodeData = null;
    this.refreshTree();
  }


  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
    this.arena.installToolbarCommands([ this.#forestSettingsCmd, this.#forestRefreshCmd]);

    const bootstrap = async () => {
      await Spinner.exec(async()=> {
        await this.#loadRootNode();
        this.#addTreeViewEventListeners();
      },"Loading forests/trees");
    }

    bootstrap();
  }

  /**
   * Attaches event listeners to the tree view explorer for user actions.
   * Events tracked include focusChanged, click, dblclick, opened, closed.
   */
  #addTreeViewEventListeners(){
    this.tvExplorer.addEventListener("nodeUserAction", (e) => {
      e.stopPropagation();
      const { node, action } = e.detail;
      // console.log("Node User Action:", action, node);

      if(action === "click") {
        this.setActiveNodeId(node.data.Id, node);
        this.tvExplorer.selectedNode = node;
      }
    });
  }

  /**
   * Loads the root node of the currently active forest and tree.
   * It clears the node cache and tree map, retrieves the trees for each forest,
   * and fetches the root node by its path. The root node is then added to the
   * tree view explorer and set as the active/selected node.
   */
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
        endContent: html`<span title="${rootNodeInfo?.DataVersion?.State}">${this.formatDT(rootNodeInfo?.DataVersion?.Utc)} UTC</span>`,
      });
      this.tvExplorer.requestUpdate();
    }

    await this.#loadNodeChildren( rootNodeInfo.Id, 1, root);
    this.setActiveNodeId(rootNodeInfo.Id, root);
  }

  /**
   * Loads the ancestors of a given node.
   * This method retrieves the full path of the target node,
   * splits it into segments, and iteratively sets each ancestor node as active in the tree view explorer.
   * It ensures that the tree view is updated to reflect the active node and its ancestors.
   */
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
  }


  /**
   * Loads the children of a given node.
   * This method checks if the node's children are already cached, and if not, it retrieves them from the server.
   * It then creates child nodes in the tree view explorer and recursively loads their children if necessary.
   * If the node has no children, it updates the parent node's properties to reflect that it cannot be opened or closed,
   * and sets its icon to indicate that it is a draft node.
   */
  async #loadNodeChildren(parentId, depth = 1, parentNode = null) {
    if(depth === 0 || this.#nodeTreeMap.has(parentId)) return;

    const children = await this.#getChildrenNodesById(parentId);
    this.#nodeTreeMap.set(parentId, children);
    if(!children || children.length === 0) {
      if(parentNode) {
        parentNode.canOpen = false;
        parentNode.canClose = false;
        parentNode.opened = false;
        parentNode.showChevron = false;
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
        // canOpen: false,
        // opened: false,
        // showChevron: false,
        endContent: html`<span title="${childNodeInfo?.DataVersion?.State}">${this.formatDT(childNodeInfo?.DataVersion?.Utc)} UTC</span>`,
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

  /**
   * Retrieves the children nodes of a given parent node by its ID.
   * It checks if the children are already cached in the nodeTreeMap.
   * If cached, it returns the cached children; otherwise, it fetches them from the server.
   * The method ensures that the children are returned as an array, even if there is
   * only a single child node.
   * @param {string} parentId - The ID of the parent node for which to retrieve children.
   * @returns {Promise<Array>} - A promise that resolves to an array of child nodes
   */
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


  /**
   * Retrieves a node by its path in the specified forest and tree.
   * @param {string} idForest - The ID of the forest to which the tree belongs.
   * @param {string} idTree - The ID of the tree to which the node belongs.
   * @param {string} path - The path of the node to retrieve, defaults to '/'.
   * @param {string|null} asOfUtc - The UTC timestamp to retrieve the node as of, defaults to the current asOfUtc.
   * @param {AbortSignal|null} abortSignal - Optional signal to abort the request.
   * @returns {Promise<Object>}
   */
  async #getNodeByPath(idForest, idTree, path = '/', asOfUtc = this.#asOfUtc, abortSignal = null) {
    let node = await this.#ref.forestClient.probePath(idForest, idTree, path, asOfUtc, abortSignal);
    return node;
  }

  /**
   * Retrieves a node by its ID and asOfUtc timestamp.
   * @param {string} id - The ID of the node to retrieve.
   * @param {string|null} asOfUtc - The UTC timestamp to retrieve the node as of.
   * @param {AbortSignal|null} abortSignal - Optional signal to abort the request
   * @return {Promise<Object>} - A promise that resolves to the node data.
   */
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

  /**
   * Sets the active node ID and updates the UI accordingly.
   * @param {*} id - The ID of the node to set as active.
   * @param {*} originNode - The original node from which the action was initiated.
   * @returns {Promise<void>}
   */
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

  /**
   * Refreshes the entire tree view by reloading the root node and its children.
   * After refresh it sets the active node to the previously active node if one is set.
   * If the current active node does not match the active tree and forest, it sets the active node to the root node.
   */
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


  async breadCrumbCrumbClick(crumbPath) {
    const currentNode = this.tvExplorer.getAllVisibleNodes().find(n => n.data.FullPath === crumbPath);
    this.setActiveNodeId(currentNode?.data?.Id);
    this.tvExplorer.selectedNode = currentNode;
  }

  formatDT = dt => isAssigned(dt) ? this.arena.app.localizer.formatDateTime({ dt, dtFormat: "NumDate", tmDetails: "HM" }) : null;


  render(){
    const asOfDisplay = this.activeAsOfUtc;
    const showAsOf = !this.activeAsOfUtc
      ? html`<div class=""><strong>As of: </strong></span>Utc Now</div>`
      : html`<div class=""><span class="asOfUtc" @click="${() => this.#forestSettingsCmd.exec(this.arena)}"><strong>As of: </strong>${this.formatDT(asOfDisplay)} UTC</span></div>`;

    return html`
      <az-forest-settings-dialog id="dlgSettings" scope="this" title="Explorer Settings"
        .settings="${{
          forests: this.#forests,
          activeForest: this.activeForest,
          activeTree: this.activeTree,
          activeAsOfUtc: this.activeAsOfUtc
        }}"
      ></az-forest-settings-dialog>

      <az-forest-node-version-dialog id="dlgNodeVersions" scope="this" title="Node Versions"
        .source="${this.#activeNodeData}" .activeForest="${this.activeForest}" .activeTree="${this.activeTree}">
      </az-forest-node-version-dialog>

      <az-cforest-breadcrumbs id="cforestBreadcrumbs" scope="this"
        .node="${this.#activeNodeData}"
        .onCrumbClick="${crumb => this.breadCrumbCrumbClick(crumb)}"
        .onCFSettingsClick="${() => this.#forestSettingsCmd.exec(this.arena)}"
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
