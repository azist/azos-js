import STL_INLINE_GRID from "../../styles/grid";
import * as aver from "azos/aver";
import { html, css } from "../../ui";
import { Applet } from "../../applet";
import { Block } from "../../blocks";
import { Command } from "../../cmd";
import { Spinner } from "../../spinner";
import "../../bit";

import "../util/code-box";
import "../util/sticky-container";
import "../tabs/tab-view";
import "../tabs/tab";

import "../tree-viewN/tree-view"
import "../../parts/select-field";
import "../../parts/grid-split"

import "./settings-dialog";
import "./breadcrumbs";
import "./node-summary";
import "./versions-dialog";

import { ForestSetupClient } from "azos/sysvc/cforest/forest-setup-client";

/**
 * ForestExplorerApplet provides the user interface for exploring and managing configuration forests, their trees, and their nodes.
 */
export class ForestExplorerApplet extends Applet  {

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

    .scrollerTitle {
      padding: 0.5em 0.5em 0 0.5em;
    }

    .tvScroller {
      max-height: calc(100vh - 14.5em);
      min-height: 50vh;
      overflow: auto;
      margin: 0;
      padding: 0 1em;
    }

    @media (max-width: 600px) {
      .tvScroller {
        min-height: auto;
        max-height: 24vh;
      }
      .maxHeightEnforced {
        min-height: auto;
        max-height: auto;
      }
    }
  `];

  #client = null;

  // Holds the forests and their trees
  // will be updated after the firstUpdated
  #forests = [];
  get forests() { return this.#forests; }
  set forests(value) { this.#forests = value; }

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
  set activeNodeId(value) {
    if(this.#activeNodeId === value) return;
    this.#activeNodeId = value;
  }

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
      let args = {
        forests: this.#forests,
        forest:  this.activeForest,
        tree:    this.activeTree,
        asOfUtc: this.activeAsOfUtc
      };

      const settings = (await this.dlgSettings.show(args)).modalResult;
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
   * Bootstrap the applet by initializing the client and tree view.
   */
  async appletBootstrap() {
    aver.isObject(this.args, "CfgForestApplet args obj");
    aver.isArray(this.args.forestIds, "args.forestIds arr");

    this.#forests = this.args.forestIds.map(f => ({ id: f, trees: []}));
    if(this.args.client instanceof ForestSetupClient) {
      this.#client = this.args.client;
    } else {
      aver.isString(this.args.client, "args.client str");
      this.#client = this.arena.app.moduleLinker.resolve(ForestSetupClient, this.args.client);
    }

    // Perform any actions needed after the applet is mounted
    this.arena.installToolbarCommands([ this.#forestSettingsCmd, this.#forestRefreshCmd]);

    // bind our select hook for the tree view to our node selection handler
    this.tvExplorer.selectedCallback = this.updateOnNodeSelect.bind(this);
    this.tvExplorer.openedCallback = this.updateOnNodeSelect.bind(this);

    // Load forests and trees, and initialize the tree view
    await Spinner.exec(async () => {
      await this.#loadForestsTrees();
      await this.#initializeTreeView();

      this.tvExplorer.selectNode(this.tvExplorer.root.children[0]);
      this.tvExplorer.requestUpdate();

      this.requestUpdate();
      this.arena.requestUpdate();
    }, "Loading forests/trees");
  }

  /**
   * Applies the forest settings by updating the active forest, tree, and asOfUtc.
   * If the settings are the same as the current active settings, it does nothing.
   * @param {Object} settings - The settings object containing forest, tree, and asOfUtc.
   * @param {string} settings.forest - The id of the forest to set as active.
   * @param {string} settings.tree - The id of the tree to set as active.
   * @param {string|null} settings.asOfUtc - The UTC timestamp to set as active, or null for "now".
   */
  async #applyForestSettings ({ forest, tree, asOfUtc }){
    // console.log(`Applying settings: Forest=${forest}, Tree=${tree}, AsOfDate=${asOfUtc}`);
    if(this.activeForest === forest && this.activeTree === tree && this.activeAsOfUtc === asOfUtc) return;
    this.activeForest = forest;
    this.activeTree = tree;
    this.activeAsOfUtc = asOfUtc;
    this.activeNodeData = null;
    this.refreshTree();
  }

  /**
   * Fetches trees for each forest and sets the active forest, tree, and asOfUtc.
   */
  async #loadForestsTrees() {
    // get all the trees for each forest and update the forests
    for (let forestIdx = 0; forestIdx <  this.forests.length; forestIdx++) {
      this.forests[forestIdx].trees = await this.#client.treeList(this.forests[forestIdx].id) || [];
      aver.isArray(this.forests[forestIdx].trees, "Forest trees must be an array");
      // console.log("Loaded trees for forest:", this.forests[forestIdx].id);
    }

    this.#forest = this.activeForest || this.forests[0].id;
    this.#tree = this.activeTree || this.forests[0].trees[0];
    this.#asOfUtc = this.activeAsOfUtc || null;
  }


  /**
   * Cache map holding the nodeInfo and childNodeList results for each node id
   */
  #nodeCache = new Map();

  /**
   * Cache holding the childNodeList results for each node Id
   */
  #nodeChildrenCache = new Map();

  /**
   * Clears the fetch caches for node information and child node lists.
   */
  clearFetchCaches() {
    this.#nodeCache.clear();
    this.#nodeChildrenCache.clear();
  }

  /**
   * Fetches information about a specific node.
   * @param {string} id - The ID of the node to fetch information for.
   * @returns {Promise<Object>} - A promise that resolves to the node information.
   */
  async fetchNodeInfo(id){
    const nodeInfo = this.#nodeCache.has(id)
      ? this.#nodeCache.get(id)
      : await this.#client.nodeInfo(id, this.activeAsOfUtc);

    if(!this.#nodeCache.has(id))
      this.#nodeCache.set(id, nodeInfo);

    return nodeInfo;
  }

  /**
   * Fetches the child node info for a specific parent node.
   * @param {string} id - The ID of the parent node to fetch children for.
   * @returns {Promise<Array>} - A promise that resolves to an array of child nodes.
   */
  async fetchNodeChildren(id){
    const childNodeList = this.#nodeChildrenCache.has(id)
      ? this.#nodeChildrenCache.get(id)
      : await this.#client.childNodeList(id, this.activeAsOfUtc) || [];

    if(!this.#nodeChildrenCache.has(id))
      this.#nodeChildrenCache.set(id, childNodeList);

    return childNodeList;
  }

  /**
   * Updates the applet state when a tree view node is selected.
   * Fetches the node's data and children nodes,
   * and sets the active node data and id.
   * @param {TreeNode} node - The selected tree node.
   */
  async updateOnNodeSelect(node) {
    // console.log(`tvNodeSelected node: ${node.title}`, node);
      this.activeNodeData = node.data;
      this.activeNodeId = node.data.Id;

      node.isLoading = true;
      this.tvExplorer.requestUpdate();

      await this.addNodeInfo(node);
      await this.addChildrenNodes(node);

      node.open();

      node.isLoading = false;
      this.tvExplorer.requestUpdate();
      this.requestUpdate();
      this.arena.requestUpdate();
      return node; // return the node for further processing if needed
  }

  /**
   * Loads the root node of the currently active forest and tree.
   * Retrieves the trees for each forest, and fetches the root node
   * by its path. The root node is then added to the tree view
   * explorer and set as the active/selected node.
   */
  async #initializeTreeView() {
    let child = null;
    await Spinner.exec(async ()=> {
      // clear any existing children
      this.tvExplorer.root.removeAllChildren();

      // Load the root node for the currently active forest and tree
      const rootNodeInfo = await this.#client.probePath(this.#forest, this.#tree, "/", this.#asOfUtc);
      child = this.tvExplorer.root.addChild(rootNodeInfo.PathSegment, {
        data: { ...rootNodeInfo },
        showPath: false,
        canOpen: true,
        icon: "svg://azos.ico.home",
        endContent: html`<span title="${rootNodeInfo?.DataVersion?.State}">${this.formatDT(rootNodeInfo?.DataVersion?.Utc)}</span>`,
        isVisible: true,
      });
    },"Loading forests/trees");

    return child;
  }

  /**
   * Adds child nodes to the specified parent node.
   * @param {TreeNode} parentNode - The parent node to add children to.
   */
  async addChildrenNodes(parentNode){
    if(parentNode.nodeChildrenLoaded) return parentNode;
    parentNode.nodeChildrenLoaded = true;
    aver.isObject(parentNode, "parentNode obj");
    aver.isObject(parentNode.data, "parentNode.data obj");
    aver.isString(parentNode.data.Id, "parentNode.data.Id str");

    const childNodeList = await this.fetchNodeChildren(parentNode.data.Id);

    let children = [];
    if(childNodeList.length > 0) {

      parentNode.icon = "svg://azos.ico.folder";
      parentNode.showChevron = true;

      for(let index = 0; index < childNodeList.length; index++) {
        const child = childNodeList[index];
        const childNodeInfo = await this.fetchNodeInfo(child.Id);
        const grandChildNodeList = await this.fetchNodeChildren(child.Id) || [];
        const childNode = parentNode.addChild(child.PathSegment, {
          data: { ...childNodeInfo },
          showPath: false,
          canOpen: grandChildNodeList.length > 0,
          hideChevron: true,
          icon: grandChildNodeList.length > 0 ? "svg://azos.ico.folder" : "svg://azos.ico.moreHorizontal",
          endContent: html`<span title="${childNodeInfo.DataVersion.State}">${this.formatDT(childNodeInfo.DataVersion.Utc)}</span>`,
          isVisible: true,
        });
        children.push(childNode);
      }
    }
    this.tvExplorer.requestUpdate();
    return parentNode;
  }

  /**
   * Fetches and adds node information to the specified node data.
   * @param {TreeNode} node - The node to add information to.
   * @returns {Promise<void>}
   */
  async addNodeInfo(node){
    if(node.nodeInfoLoaded) return node;
    const nodeInfo = await this.fetchNodeInfo(node.data.Id);
    node.data = { ...node.data, ...nodeInfo  };
    node.nodeInfoLoaded = true;
    node.endContent = html`<span title="${node.data.DataVersion?.State}">${this.formatDT(node.data.DataVersion.Utc)}</span>`;
    this.tvExplorer.requestUpdate();
    return node;
  }

  /**
   * Walks up the parent nodes and returns chain array [{ id: "123",  segment: "abc" }]
   */
  getNodePathChain(node){
    const pathChain = [];
    while (node && !node.isRoot) {
      pathChain.unshift({ id: node.data?.Id, segment: node.data?.PathSegment, tree: node.data?.Tree, forest: node.data?.Forest });
      node = node.parent;
    }
    return pathChain;
  };

  /**
   * Restores the node path by walking up the parent nodes and selecting each node in the chain.
   */
  async restoreNodePath(pathChain, parent = this.tvExplorer.root, pathIndex = 0) {
    const element = pathChain[pathIndex];
    let currNode = parent.children.find(n => n.data.Id === element.id && n.data.PathSegment === element.segment);

    // If the current node is not found, return the parent node
    if(!currNode?.data) return parent;

    // load current parent info
    const parentData = await this.fetchNodeInfo(currNode.data.Id);
    currNode.data = { ...currNode.data, ...parentData}
    currNode = await this.addChildrenNodes(currNode)
    if(currNode.children.length > 0) await currNode.open();

    // find next child in path child node by id
    let node = parent.children.find(n => n.data.Id === element.id);

    // load child info
    const nodeData = await this.fetchNodeInfo(node.data.Id);
    node.data = { ...node.data, ...nodeData }
    node = await this.addChildrenNodes(node)

    // move to next path segment if there are more segments in the path chain
    if(pathIndex < pathChain.length - 1) {
      return this.restoreNodePath(pathChain, node, pathIndex + 1); // recursively restore the next node in the chain
    } else if (pathIndex === pathChain.length - 1) {
      node = await this.tvExplorer.selectNode(node); // select the node
      this.tvExplorer.requestUpdate();
      this.requestUpdate();
      this.arena.requestUpdate();
    }

    return node; // return the node for further processing if needed
  }

  async refreshTree(){
    const previousPath = this.getNodePathChain(this.tvExplorer.selectedNode);
    await Spinner.exec(async () => {
      this.clearFetchCaches(); // clear caches to ensure fresh data
      const currentNode = await this.#initializeTreeView();

      if(previousPath[0].tree === this.activeTree && previousPath[0].forest === this.activeForest) {
        const restoredNode = await this.restoreNodePath(previousPath);
        this.tvExplorer.selectNode(restoredNode);
      } else {
        this.tvExplorer.selectNode(currentNode);
      }

      this.tvExplorer.requestUpdate();
      this.requestUpdate();
    }, "Refreshing forest tree view");
  }

  // Searches the tree view for a node with the specified path.
  // If found, it selects the node and updates the active node data and id.
  async breadCrumbCrumbClick(crumbPath) {
    const currentNode = this.tvExplorer.getAllVisibleNodes().find(n => n.data.FullPath === crumbPath);
    await this.tvExplorer.selectNode(currentNode);
  }

  formatDT = dt => dt ? this.arena.app.localizer.formatDateTime({ dt, dtFormat: "NumDate", tmDetails: "HM" }) : null; // formats the date to a human-readable format
  formatCV = cv => cv ?  JSON.stringify(JSON.parse(cv), null, 2) : "{}"; // formats the config version to a JSON string

  render(){
    const asOfDisplay = this.activeAsOfUtc;
    const showAsOf = !this.activeAsOfUtc
      ? html`<div class="scrollerTitle"><strong>As of Utc: </strong></span>Now</div>`
      : html`<div class="scrollerTitle"><span class="asOfUtc" @click="${() => this.#forestSettingsCmd.exec(this.arena)}"><strong>As of: </strong>${this.formatDT(asOfDisplay)} UTC</span></div>`;

    return html`
      <az-forest-settings-dialog id="dlgSettings" scope="this" title="Explorer Settings" .settings="${{
        forests: this.forests, activeForest: this.activeForest, activeTree: this.activeTree,  activeAsOfUtc: this.activeAsOfUtc }}"
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
          <az-sticky-container top="60" minWidth="600">

            <div class="cardBasic">
              ${showAsOf}<hr style="opacity: 0.5;"/>
              <az-tree-view-n id="tvExplorer" scope="this" class="tvScroller"></az-tree-view-n>
            </div>

          </az-sticky-container>
        </div>

        <div slot="right-bottom">

          <div class="cardBasic">
            <az-cforest-summary
              id="cforestSummary"
              scope="this"
              .source="${this.#activeNodeData}"
              .openVersions="${() => this.dlgNodeVersions.show({
                source: this.#activeNodeData
              })}"
              .nodeChangedCallback="${() => this.#forestRefreshCmd.exec(this.arena)}"
              ></az-cforest-summary>
          </div>

          <az-tab-view title="Draggable TabView" activeTabIndex="0" isDraggable>
            <az-tab title="Selected Node" .canClose="${false}" class="maxHeightEnforced">
              <az-code-box id="objectInspector0" scope="self" highlight="json" .source=${JSON.stringify(this.#activeNodeData, null, 2)}></az-code-box>
            </az-tab>
            <az-tab title="Level Config" .canClose="${false}" class="maxHeightEnforced">
              <az-code-box id="objectInspector1" scope="self" highlight="json" .source=${this.formatCV(this.#activeNodeData?.LevelConfig)}></az-code-box>
            </az-tab>
            <az-tab title="Effective Config" .canClose="${false}" class="maxHeightEnforced">
              <az-code-box id="objectInspector2" scope="self" highlight="json" .source=${this.formatCV(this.#activeNodeData?.EffectiveConfig)}></az-code-box>
            </az-tab>
            <az-tab title="Properties" .canClose="${false}" class="maxHeightEnforced">
              <az-code-box id="objectInspector3" scope="self" highlight="json" .source=${this.formatCV(this.#activeNodeData?.Properties)}></az-code-box>
            </az-tab>
          </az-tab-view>

        </div>
      </az-grid-split>
    `;
  }
}

window.customElements.define("az-cfg-forest-applet", ForestExplorerApplet);
