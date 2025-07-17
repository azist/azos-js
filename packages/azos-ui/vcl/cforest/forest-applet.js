import STL_INLINE_GRID from "../../styles/grid";
import * as aver from "azos/aver";
import { html, css } from "../../ui";
import { Applet } from "../../applet";
import { Block } from "../../blocks";
import { Command } from "../../cmd";
import { Spinner } from "../../spinner";
import "../../bit";
import "../../vcl/util/object-inspector";
import "../../vcl/tabs/tab-view";
import "../../vcl/tabs/tab";
import "../../vcl/tree-viewN/tree-view"
import "../../parts/select-field";
import "../../parts/grid-split"

import "./node-summary";
import "./node-breadcrumbs";
import "./settings-dialog";
import "./versions-dialog";

import { ForestSetupClient } from "azos/sysvc/cforest/forest-setup-client";

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
      min-height: 60vh;
    }

    @media (max-width: 600px) {
      .minHeightEnforced {
        min-height: auto; /* Override for small screens */
      }
   }
  `];

  #client = null;

  // Holds the forests and their trees
  // will be updated after the firstUp2dated
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
    await this.#loadForestsTrees();
    await this.#initializeTreeView();
  }

  async #loadForestsTrees() {
    // get all the trees for each forest and update the forests
    for (let forestIdx = 0; forestIdx <  this.forests.length; forestIdx++) {
      this.forests[forestIdx].trees = await this.#client.treeList(this.forests[forestIdx].id) || [];
      aver.isArray(this.forests[forestIdx].trees, "Forest trees must be an array");
      console.log("Loaded trees for forest:", this.forests[forestIdx].id);
    }

    this.#forest = this.activeForest || this.forests[0].id;
    this.#tree = this.activeTree || this.forests[0].trees[0];
    this.#asOfUtc = this.activeAsOfUtc || null;
  }

  async tvNodeSelected(node) {
    console.log(`tvNodeSelected node: ${node.title}`, node);
    this.activeNodeData = node.data;
    this.activeNodeId = node.data.Id;
    this.addNodeInfo(node);
    this.addChildrenNodes(node);
    this.arena.requestUpdate();
    this.requestUpdate();
  }

  /**
   * Loads the root node of the currently active forest and tree.
   * It clears the node cache and tree map, retrieves the trees for each forest,
   * and fetches the root node by its path. The -root node is then added to the
   * tree view explorer and set as the active/selected node.
   */
  async #initializeTreeView(){

    // bind our select hook for the tree view to our node selection handler
    this.tvExplorer.selectedCallback = this.tvNodeSelected.bind(this);
    this.tvExplorer.openedCallback = this.tvNodeSelected.bind(this);

    await Spinner.exec(async()=> {
      // clear any existing children
      this.tvExplorer.root.removeAllChildren();

      // Load the root node for the currently active forest and tree
      const rootNodeInfo = await this.#client.probePath(this.#forest, this.#tree, "/", this.#asOfUtc);
      const root = this.tvExplorer.root.addChild(rootNodeInfo.PathSegment, {
        data: { ...rootNodeInfo },
        showPath: false,
        canOpen: true,
        icon: "svg://azos.ico.home",
        endContent: html`<span title="${rootNodeInfo?.DataVersion?.State}">${this.formatDT(rootNodeInfo?.DataVersion?.Utc)} UTC</span>`,
      });
      root.isNodeInfoLoaded = true;
      this.tvExplorer.selectNode(root);
      this.tvExplorer.requestUpdate();
    },"Loading forests/trees");
  }

  async addChildrenNodes(parentNode){
    if(parentNode.isChildNodeListLoaded) return;
    parentNode.isChildNodeListLoaded = true;


    aver.isObject(parentNode, "parentNode obj");
    aver.isObject(parentNode.data, "parentNode.data obj");
    aver.isString(parentNode.data.Id, "parentNode.data.Id str");

    const childNodeList = await this.#client.childNodeList(parentNode.data.Id, this.activeAsOfUtc) || [];

    if(childNodeList.length > 0) {
      for(let index = 0; index < childNodeList.length; index++) {
        const child = childNodeList[index];
        const childNodeInfo = await this.#client.nodeInfo(child.Id);
        const grandChildNodeList = await this.#client.childNodeList(child.Id, this.activeAsOfUtc) || [];
        const childNode = parentNode.addChild(child.PathSegment, {
          data: { ...childNodeInfo },
          showPath: false,
          canOpen: grandChildNodeList.length > 0,
          endContent: html`<span title="${childNodeInfo.DataVersion?.State}">${childNodeInfo.DataVersion.Utc} UTC</span>`,
        });

        if(!grandChildNodeList.length > 0) childNode.icon = "svg://azos.ico.draft";
      }
    }
    parentNode.isChildNodeListLoaded = true;
    parentNode.isLoadingDetails = false;
    this.tvExplorer.requestUpdate();
  }

  async addNodeInfo(node){
    if(node.isNodeInfoLoaded) return;
    node.isNodeInfoLoaded = true;
    const nodeInfo = await this.#client.nodeInfo(node.data.Id);
    node.data = { ...node.data, ...nodeInfo  };
    node.endContent = html`<span title="${node.data.DataVersion?.State}">${node.data.DataVersion.Utc} UTC</span>`;
    this.tvExplorer.requestUpdate();
    if(this.isSelected) this.tvExplorer.selectedCallback(node);
  }


  //! todo: implement this without relying on the node's data.FullPath
  /**
   * Loads the ancestors of a given node.
   * This method retrieves the full path of the target node,
   * splits it into segments, and iteratively sets each ancestor node as active in the tree view explorer.
   * It ensures that the tree view is updated to reflect the active node and its ancestors.
   */
  async #loadNodeAncestors(targetNodeId) {
    const targetNodeData = await this.#client.nodeInfo(targetNodeId, this.#asOfUtc);
    const paths = targetNodeData.FullPath.split("/").map( (v,i,a) => `/${a.slice(1,i+1).join("/")}`);

    for (let i = 0; i < paths.length; i++) {
      const visibleNodes = this.tvExplorer.getAllVisibleNodes();

      const path = paths[i];
      const parentNode = visibleNodes.find(n => n.data.FullPath === path);

      console.log(`Loading ancestor path: ${paths[i]}`, parentNode);
      if(parentNode) {
        this.tvExplorer.selectNode(parentNode);

        parentNode.open();
        this.tvExplorer.requestUpdate();

        this.tvExplorer.selectedNode = parentNode;
        parentNode.isSelected = true;

        this.tvExplorer.requestUpdate();

        if(i === paths.length - 1) {
          this.activeNodeData = parentNode.data;
          this.activeNodeId = parentNode.data.Id;
        }

      }
    }
  }

  /**
   * Refreshes the entire tree view by reloading the root node and its children.
   * After refresh it sets the active node to the previously active node if one is set.
   * If the current active node does not match the active tree and forest, it sets the active node to the root node.
   */
  async refreshTree(){
    const currentNode = { ...this.activeNodeData };

    await Spinner.exec(async()=> {
      await this.#initializeTreeView();
      if(currentNode?.Tree === this.activeTree && currentNode?.Forest === this.activeForest && currentNode.FullPath !== "/") {
        await this.#loadNodeAncestors(currentNode.Id);
      } else {
        this.activeNodeData = this.tvExplorer.root.data;
        this.activeNodeId = this.tvExplorer.root.data.Id;
      }
    }, "Loading forests/trees");
  }

  async breadCrumbCrumbClick(crumbPath) {
    const currentNode = this.tvExplorer.getAllVisibleNodes().find(n => n.data.FullPath === crumbPath);
    this.tvExplorer.selectedNode = currentNode;
  }

  formatDT = dt => dt ? this.arena.app.localizer.formatDateTime({ dt, dtFormat: "NumDate", tmDetails: "HM" }) : null;

  render(){
    const asOfDisplay = this.activeAsOfUtc;
    const showAsOf = !this.activeAsOfUtc
      ? html`<div class=""><strong>As of: </strong></span>Utc Now</div>`
      : html`<div class=""><span class="asOfUtc" @click="${() => this.#forestSettingsCmd.exec(this.arena)}"><strong>As of: </strong>${this.formatDT(asOfDisplay)} UTC</span></div>`;

    return html`
      <az-forest-settings-dialog id="dlgSettings" scope="this" title="Explorer Settings"
        .settings="${{
          forests: this.forests,
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
            ${showAsOf}<hr style="opacity: 0.5;"/>
            <az-tree-view-n id="tvExplorer" scope="this" class="minHeightEnforced"></az-tree-view-n>
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
