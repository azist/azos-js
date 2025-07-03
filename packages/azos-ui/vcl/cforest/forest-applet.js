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

import "./forest-view";
import "./forest-summary";
import "./forest-breadcrumbs";
import "./forest-settings";

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
  `];


  #ref = { forestClient: ForestSetupClient };

  #forests = null;
  #useDefaultRoot = true;

  #activeRootNode = null;
  #activeForest = null;
  #activeTree = null;
  #activeAsOfUtc = null;
  #activeNodeData = null;

  #nodeCache = new Map();

  get activeForest() { return this.#activeForest; }
  set activeForest(value) {
    if (this.#activeForest !== value) {
      this.#activeForest = !value ? null : value;
      this.#activeTree = null;
      this.#activeAsOfUtc = null;
      this.treeView.requestUpdate();
      this.arena.requestUpdate();
      this.requestUpdate();
    }
  }

  get activeTree() { return this.#activeTree; }
  set activeTree(value) {
    if (this.#activeTree !== value) {
      this.#activeTree = value;
      if (this.#activeForest && this.#activeTree) {
        this.#initTreeRootNode(this.#activeForest, this.#activeTree, "/");
      }
    }
  }

  get activeRootNode() { return this.#activeRootNode; }
  set activeRootNode(node) {
    this.#activeRootNode = node;
    this.treeView.requestUpdate();
    this.requestUpdate();
    if (this.#activeForest && this.#activeTree) {
      if(this.#activeRootNode?.Id) {
        this.#initTreeRootNode(this.#activeForest, this.#activeTree, undefined, this.#activeRootNode.Id);
      } else {
        this.#initTreeRootNode(this.#activeForest, this.#activeTree, "/");
      }
    }
  }

  get activeAsOfUtc() { return this.#activeAsOfUtc; }
  set activeAsOfUtc(value) {
    if (this.#activeAsOfUtc !== value) {
      this.#activeAsOfUtc = value;
      this.requestUpdate();
      if (this.#activeForest && this.#activeTree) {
        this.#initTreeRootNode(this.#activeForest, this.#activeTree, this.#activeRootNode?.FullPath ?? "/");
      }
    }
  }

  get title(){
    return html` ${
      !this.activeTree
        ? ""
        : `Forest Explorer: ${this.activeTree}@${
          !this.activeForest
            ? ""
            : `${this.activeForest}${
              this.#activeNodeData?.PathSegment
                ? `/${this.#activeNodeData.PathSegment}` : ""
            }`}`}`;
  }

  #cfgForestSettingsCmd = new Command(this, {
    uri: `CfgForest.ForestTreeAsOfUtc`,
    icon: "svg://azos.ico.database",
    title: "CfgForest Settings",
    handler: async () => {
      console.log(`CfgForestApplet#cfgForestSettingsCmd handler`, this.forestSettings);
      this.forestSettings.open();
    }
  });

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
    this.arena.installToolbarCommands([this.#cfgForestSettingsCmd]);
    this.#bootstrap();
  }

  openForestSettings() {
    console.log(`CfgForestApplet#openForestSettings`, this.forestSettings);
    this.forestSettings.open();
  }

  async #bootstrap() {
    await Spinner.exec(async()=> {
      await this.#loadTreesForForests();
      if (this.#useDefaultRoot) {
        this.activeForest = this.#forests[0].id;
        this.activeTree = this.#forests[0].trees[0];
      }

      this.treeView.addEventListener("nodeUserAction", (e) => {
        e.stopPropagation();
        const { node, action } = e.detail;
        console.log("CfgForestApplet#treeView nodeUserAction", { node, action });
        if (action === "click") {
          this.onCFNodeSelected(node);
        }
      });

      this.treeView.requestUpdate();

      this.arena.requestUpdate();
      this.requestUpdate();
    },"Loading forests");
  }

  async #loadTreesForForests() {
    const forests = [
      { id: "test-f1", title: "Test Forest 1", trees: [] },
      { id: "g8corp", title: "G8 Corporation", trees: [] }
    ];
    for (let forestIdx = 0; forestIdx < forests.length; forestIdx++) {
      const forest = forests[forestIdx];
      const trees = await this.#ref.forestClient.treeList(forest.id);
      forest.trees = trees;
    }
    this.#forests = forests;
    this.arena.requestUpdate();
    this.requestUpdate();
  }

  async #initTreeRootNode(forest = this.#activeForest, tree = this.#activeTree, path = null, nodeId = null, parent = this.treeView.root, asOfUtc = this.#activeAsOfUtc, abortSignal = null) {
    if(!forest || !tree) return;
    await Spinner.exec(async()=> this.#configureRootTreeNode(forest, tree, path, nodeId, parent, asOfUtc, abortSignal), "Initializing Tree View Root");
    this.treeView.requestUpdate();
    this.requestUpdate();
    this.arena.requestUpdate();
    this.#activeNodeData = this.#nodeCache.get(this.#activeRootNode?.Id) || null;
  }

  async #configureRootTreeNode(forest = this.#activeForest, tree = this.#activeTree, path = null, nodeId = null, parent = this.treeView.root, asOfUtc = this.#activeAsOfUtc, abortSignal = null) {
    if(!forest || !tree) return;
    this.treeView.removeAllNodes();
    if(path === null && nodeId === null) path = "/";

    const rootCfgNode = nodeId
      ? await this.#getNodeById(nodeId,asOfUtc,abortSignal)
      : await this.#getNodeByPath(forest, tree, path,asOfUtc,abortSignal);

    const parentId = rootCfgNode.Id;
    this.#nodeCache.set(parentId, rootCfgNode);

    let rootNode = parent.addChild(rootCfgNode.PathSegment, { // { icon, checkable, canClose, canOpen, nodeVisible, opened, showPath
      data: { ...rootCfgNode },
      showPath: false,
      canOpen: true,
      ghostPostfix: html`<span title="${rootCfgNode?.DataVersion?.State}">${(new Date(rootCfgNode?.DataVersion?.Utc)).toLocaleDateString()} - ${(new Date(rootCfgNode?.DataVersion?.Utc)).toLocaleTimeString()}</span>`,
    });

    rootCfgNode._tvNode = rootNode;
    this.#nodeCache.set(parentId, rootCfgNode);
    rootNode.isRoot = true;

    this.#activeRootNode = rootNode.data;
    await this.preloadChildren(nodeId, 2, rootNode);
  }

  async #getNodeByPath(idForest, idTree, path = '/', asOfUtc = this.#activeAsOfUtc, abortSignal = null) {
    let node = await this.#ref.forestClient.probePath(idForest, idTree, path, asOfUtc, abortSignal);
    return node;
  }

  async #getNodeById(id = '0:0:1', asOfUtc = this.#activeAsOfUtc, abortSignal = null) {
    let node = await this.#ref.forestClient.nodeInfo(id, asOfUtc, abortSignal);
    return node;
  }

  async preloadChildren(id, depth, parentNode ) {
    if(!id || depth <= 0) return;
    let parentData = this.#nodeCache.has(id) ? this.#nodeCache.get(id) : await this.#getNodeById(id)
    if(parentData._childrenLoaded) return;
    parentNode.isLoading = true;


    this.treeView.requestUpdate();

    if(!parentData.Versions)  {
      const versions = await this.#ref.forestClient.nodeVersionList(id) || [];
      parentData.Versions = versions;
    }

    if(!parentData.Children) {
      const children =  await this.#ref.forestClient.childNodeList(id) || [];
      parentData.Children = children;
    }

    const hasChildren = parentData.Children && parentData.Children.length > 0;
    parentNode.chevronVisible = hasChildren;
    parentNode.canOpen = hasChildren;
    parentNode.isBranch = hasChildren;
    parentNode.isLeaf = !hasChildren;
    parentNode.showPath = false;
    parentNode.ghostPostfix = html`<span title="${parentData?.DataVersion?.State}">${(new Date(parentData?.DataVersion?.Utc)).toLocaleDateString()} - ${(new Date(parentData?.DataVersion?.Utc)).toLocaleTimeString()}</span>`;

    for (const child of parentData.Children) {
      const childNode = parentNode.addChild(child.PathSegment, { showPath: false, data: child });
      await this.preloadChildren(child.Id, depth - 1, childNode);
      parentData._childrenLoaded = true;
    }

    parentNode.isLoading = false;
    parentData._tvNode = parentNode;
    this.#nodeCache.set(id, parentData);
  }

  async onCFNodeSelected(node){
    console.log("CfgForestApplet#onCFNodeSelected", node);
    // const doIt = async () => {
    //   const id = node.data.Id;
    //   console.log("onCFNodeSelected", node.id, this.#nodeCache.has(id));

    //   if(!this.#nodeCache.has(id)) {
    //     const data = await this.#ref.forestClient.nodeInfo(id);
    //     this.#nodeCache.set(id, data);
    //   }

    //   const currentNodeData = this.#nodeCache.get(id);
    //   this.#activeNodeData = currentNodeData;
    //   await this.preloadChildren(id, 2, node);
    //   this.treeView.requestUpdate();
    // }
    // await Spinner.exec(async()=> { await doIt(); }, "Loading Node Data");

    // this.requestUpdate();
  }

  async onCFNodeClick(node) {
    const doIt = async () => {
      const id = node.data.Id;
      console.log("onCFNodeClick", node.id, this.#nodeCache.has(id));

      if(!this.#nodeCache.has(id)) {
        const data = await this.#ref.forestClient.nodeInfo(id);
        this.#nodeCache.set(id, data);
      }

      const currentNodeData = this.#nodeCache.get(id);
      this.#activeNodeData = currentNodeData;
      await this.preloadChildren(id, 2, node);
      this.treeView.requestUpdate();
    }
    await Spinner.exec(async()=> { await doIt(); }, "Loading Node Data");

    this.requestUpdate();
  }

  renderCrudForm(){
    const onCrudElementChange = (e) =>  console.log(`CfgForestApplet#renderCrudForm onCrudElementChange`, e);
    return html`
    <az-modal-dialog id="dlgNode" scope="self" title="Selected Node">
      <div slot="body">
        <az-text id="tbNodeTitle"           scope="this" name="PathSegment"     title="Node Title"        placeholder="Node Title"          dataType="string" @change="${onCrudElementChange}"></az-text>
        <az-text id="tbNodeProperties"      scope="this" name="Properties"      title="Node Properties"   placeholder="Node Properties"     dataType="json"   @change="${onCrudElementChange}"></az-text>
        <az-text id="tbNodeEffectiveConfig" scope="this" name="EffectiveConfig" title="Effective Config"  placeholder="Effective Config"    dataType="json"   @change="${onCrudElementChange}"></az-text>
        <az-text id="tbNodeLevelConfig"     scope="this" name="LevelConfig"     title="Level Config"      placeholder="Level Config"        dataType="json"   @change="${onCrudElementChange}"></az-text>
        <az-button @click="${() => this.dlgNode.close()}" title="Close" style="float: right;"></az-button>
      </div>
    </az-modal-dialog>
    `;
  }


  render(){
    if(!this.#forests) return;
    const asOfDisplay = (new Date( this.#activeAsOfUtc ? this.#activeAsOfUtc : Date.now())).toLocaleString();
    const showAsOf = !this.#activeAsOfUtc
      ? html`<div class="cardBasic"><strong>As of: </strong></span>Utc Now</div>`
      : html`<div class="cardBasic"><span class="asOfUtc" @click="${(e) => this.#cfgForestSettingsCmd.exec(this.arena)}"><strong>As of: </strong>${asOfDisplay}</span></div>`;

    return html`
      ${this.renderCrudForm()}

      <az-cfg-forest-settings scope="this" id="forestSettings"
        .forests="${this.#forests}"
        .activeForest="${this.#activeForest}"
        .activeTree="${this.#activeTree}"
        .activeAsOfUtc="${this.#activeAsOfUtc}"></az-cfg-forest-settings>

      <az-cforest-breadcrumbs
        id="cforestBreadcrumbs" scope="this"
        .node="${this.#activeNodeData}"
        .onCrumbClick="${e => { e.preventDefault(); }}"
        .onCFSettingsClick="${(e) => { e.preventDefault(); this.openForestSettings(); }}">
      </az-cforest-breadcrumbs>

      <az-grid-split id="splitGridView" scope="this" splitLeftCols="4" splitRightCols="8">
        <div slot="left-top">
          <div class="cardBasic">
            <az-cforest-view
              id="treeView" scope="this"
              .title="${ html`${showAsOf}`}"
              .selectHook="${this.onCFNodeClick.bind(this)}"
              .rootNode="${this.#activeRootNode}"></az-cforest-view>
          </div>

        </div>
        <div slot="right-bottom">

          <div class="cardBasic">
            <az-cforest-summary id="cforestSummary" scope="this" .source="${this.#activeNodeData}"></az-cforest-summary>
          </div>

          <az-block id="selectedSummary" scope="this" title="Summary" isExpanded="${true}">
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
          </az-block>

        </div>
      </az-split-grid-view>
    `;
  }
}

window.customElements.define("az-cfg-forest-applet", CfgForestApplet);
