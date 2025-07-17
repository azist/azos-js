import { html } from "../../ui";
import { AsyncTreeNode } from "../tree-view/async-tree-node";
import * as aver from "azos/aver";

export class CfgForestTreeNode extends AsyncTreeNode {

  isNodeInfoLoaded = false;
  isChildNodeListLoaded = false;

  // can use this to change the focus... but not sure if that is good ux...
  async close() {
    super.close();
    if(this.treeView.selectedNode && !this.isSelected) {
      this.isSelected = true;
      this.treeView.selectedNode = this;
    }
  }

  async #addChildren(){
    aver.isObject(this.treeView.settings, "settings obj");
    aver.isString(this.treeView.settings.activeForest, "activeForest str");
    aver.isString(this.treeView.settings.activeTree, "activeTree str");
    // todo: check for activeAsOfUtc if needed

    const asOfUtc = this.treeView.settings.activeAsOfUtc || null;
    if(this.isChildNodeListLoaded) return;
    const childNodeList = await this.treeView.client.childNodeList(this.data.Id, asOfUtc) || [];
    if(childNodeList.length > 0) {
      for(let index = 0; index < childNodeList.length; index++) {
        const child = childNodeList[index];
        const grandChildNodeList = await this.treeView.client.childNodeList(child.Id, asOfUtc) || [];

        const childNodeInfo = await this.treeView.client.nodeInfo(child.Id);

        // quick check to ensure we've not already created this node
        // todo: this is slow, do better
        if(this.children.some(c => c.data.Id === child.Id)) continue;

        const childNode = this.addChild(child.PathSegment, {
          data: { ...childNodeInfo },
          showPath: false,
          canOpen: grandChildNodeList.length > 0,
          endContent: html`<span title="${childNodeInfo.DataVersion?.State}">${childNodeInfo.DataVersion.Utc} UTC</span>`,
        }, CfgForestTreeNode);
        if(!grandChildNodeList.length > 0) childNode.icon = "svg://azos.ico.draft";
      }
    }
    this.isChildNodeListLoaded = true;
    this.isLoadingDetails = false;
    this.treeView.requestUpdate();
  }

  async #addData(){
    if(this.isNodeInfoLoaded) return;
    const nodeInfo = await this.treeView.client.nodeInfo(this.data.Id);
    this.data = { ...this.data, ...nodeInfo  };
    this.endContent = html`<span title="${this.data.DataVersion?.State}">${this.data.DataVersion.Utc} UTC</span>`;
    this.isNodeInfoLoaded = true;
    this.treeView.requestUpdate();
    if(this.isSelected) this.treeView.selectedCallback(this);
  }

  async open(force = false) {
    if(this.isLoadingDetails && !force) return;
    this.isLoadingDetails = true;
    await this.#addData();
    await this.#addChildren();
    super.open();
    this.isLoadingDetails = false;
  }

  async selected() {
    if(this.isLoadingDetails) return;
    this.isLoadingDetails = true;
    await this.#addData();
    await this.#addChildren();
    this.isLoadingDetails = false;
  }

}
