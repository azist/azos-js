import { html, css, Control } from "../../ui";
import { toast } from "../../toast";
import { writeToClipboard } from "../util/clipboard";

import "./node-dialog"

/**
 * Component for displaying a summary of a selected node in a forest context.
 */
class ForestNodeSummary extends Control {

  static properties = {
    source: { type: Object },
    nodeAddedCallback: { type: Function },
    nodeEditedCallback: { type: Function },
    nodeDeletedCallback: { type: Function },
  }

  static styles = [ css`
    h4, h5, h6 {
      margin: 0;
    }

    .buttonBar {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 0.5em;
      margin-bottom: 0;
    }

    .btnSettings {
      display: block;
      padding: 0;
      margin: 0;
    }

    .buttonBar> :last-child {
      margin-left: auto;
    }
  `];

  async #addNode(parentNode) {
    console.log(`Adding node under parent: ${parentNode.Id}`, parentNode);
    let args = this.source;
    const newNode = (await this.dlgNode.show({ ...args, isNew: true })).modalResult;
    if (!newNode) return;
    console.log("New node added:", newNode);
    await this.nodeAddedCallback?.(newNode);
  }

  async #editNode(node) {
    console.log(`Editing node with ID: ${node.Id}`, node);
    let args = this.source;
    const editedNode = (await this.dlgNode.show({ ...args, isNew: false })).modalResult;
    if (!editedNode) return;
    console.log("Node edit results:", editedNode);
    await this.nodeEditedCallback?.(editedNode);
  }

  renderControl(){
    if(!this.source) return html`<span class="no-version">No selected version</span>`;
    const title = this.source.PathSegment || "No selected node";

    const copyBtn = html`<az-button
      id="btnCopyPath"
      rank="6"
      icon="svg://azos.ico.copy"
      title="Copy Id"
      @click="${(e) => {
        writeToClipboard(this.source.Id);
        toast(`Copied '${this.source.Id}' to clipboard`, { timeout: 1_000, status: "ok", position: "top-center" });
      }}"></az-button>`;

    return html`
      <div class="buttonBar row cols2">
        <div>
          <h4>${title === "/" ? "/ (root of tree)" : title}</h4>
          <h5>${this.source.Id}${copyBtn}</h5>
          <h6>${this.source?.DataVersion?.Utc} (${this.source?.DataVersion?.State})</h6>
        </div>
        <div>
          <az-button id="btnAddNode"  title="Add Node"    rank="4" class="selectedNodeBtn" position="left" icon="svg://azos.ico.add" @click="${(e) => this.#addNode(this.source)}">Add</az-button>
          <az-button id="btnEditNode" title="Edit Node"   rank="4" class="selectedNodeBtn" position="left" icon="svg://azos.ico.edit" @click="${(e) => this.#editNode(this.source.Id)}">Edit</az-button>
          <az-button id="btnVersions" title="Versions..." rank="4" class="selectedNodeBtn" position="left" icon="svg://azos.ico.calendarToday" @click="${(e) => this.openVersions()}">Edit</az-button>
        </div>
      </div>

      <az-forest-node-dialog id="dlgNode" scope="this" title="Node Editing"></az-forest-node-dialog>
      `;
  }
}

window.customElements.define("az-cforest-summary", ForestNodeSummary);
