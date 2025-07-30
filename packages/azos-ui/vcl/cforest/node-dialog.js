import { html, css } from "../../ui";
import { ModalDialog } from "../../modal-dialog";
import * as aver from "../../../azos/aver";
import { Block } from "../../blocks";

import STL_INLINE_GRID from "../../styles/grid";
import { DATA_VALUE_PROP, RESET_DIRTY_METHOD, VALIDATE_METHOD } from "azos/types";
import { Spinner } from "../../spinner";
import "../util/code-box";
import { ForestSetupClient } from "azos/sysvc/cforest/forest-setup-client";
import { toast } from "../../toast.js";


export class ForestNodeDialog extends ModalDialog {

  static styles = [ModalDialog.styles, STL_INLINE_GRID, css`
    .fields {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
      margin-bottom: 1em;
    }
    .buttons {
      display: flex;
      flex-direction: row;
      gap: 0.5em;
      justify-content: flex-end;
    }
    .buttons az-button { width: 11ch; }
    .row.compact {
      margin-bottom: 0;
    }
    az-text { width: 100%; }
    az-bit { margin-bottom: 0.5em; }
  `];

  #client = { forestClient: ForestSetupClient };

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#client);
  }

  /**
   * Lifecycle hook for the Modal show() method
   * this.modalArgs contains the initial settings passed to the dialog.
   */
  async _show() {
    aver.isObject(this.modalArgs, "modalArgs obj");
    aver.isString(this.modalArgs.Forest, "modalArgs.Forest str");
    aver.isString(this.modalArgs.Tree, "modalArgs.Tree str");
    aver.isString(this.modalArgs.G_Parent, "modalArgs.G_Parent str");
    aver.isString(this.modalArgs.StartUtc, "modalArgs.StartUtc str");
    aver.isString(this.modalArgs.PathSegment, "modalArgs.PathSegment str");
    aver.isString(this.modalArgs.Properties, "modalArgs.Properties str");
    aver.isString(this.modalArgs.LevelConfig, "modalArgs.LevelConfig str");
    aver.isString(this.modalArgs.action, "modalArgs.action str");

    this.title = this.modalArgs?.action === "add" ? "Add New Node" : "Edit Node Details";

    this.#resetBlockNodeDetails();

    // initialize the existing node block
    this.bitExistingNode[DATA_VALUE_PROP] = this.modalArgs;

    // if this is an add we need to set the details node to the current and the form to an empty state
    this.bitNode[DATA_VALUE_PROP] = this.modalArgs?.action === "add" ? {} : this.modalArgs;

    if (this.modalArgs?.action === "add") {
      this.bitNode.tbLevelConfig.value = `{"conf":{}}`;
      this.bitNode.tbProperties.value = `{"prop":{}}`;
    }

    this.bitNodeDetails.expand();
    this.bitNodeContainer.collapse();

    // todo: confirm these requestUpdates are needed
    queueMicrotask(() => this.bitNode.requestUpdate());
    queueMicrotask(() => this.bitNodeDetails.requestUpdate());
    this.requestUpdate();

    // console.log({ action: this.modalArgs?.action, existing: this.bitExistingNode[DATA_VALUE_PROP], node: this.bitNode[DATA_VALUE_PROP] });
  }


  /**
   * Handles the click event for the Apply button.
   * Closes the dialog if all validations pass.
   * If any validation fails, it prevents closing the dialog.
   */
  async #btnApplyClick() {

    // validate all information needed is available
    this.bitNode[VALIDATE_METHOD](this, null, true);

    // todo: confirm UTC field processing correctly

    // on any errors stop processing and return to the open dlg
    if (this.bitNode.error) return;

    // holds the results of the save operation
    let results = null;

    // let the user know somthing is happening
    const msg = `Saving node ${this.modalArgs?.action ? "adding" : "editing"}...`;
    await Spinner.exec(async () => {
      const userValues = this.bitNode[DATA_VALUE_PROP]

      // setup for all actions
      let nodeObj = {
        Forest: this.modalArgs.Forest,
        Tree: this.modalArgs.Tree,
        StartUtc: userValues.StartUtc,
        PathSegment: userValues.PathSegment,
        Config: userValues.LevelConfig,
        Properties: userValues.Properties,
      };

      // add StartUTC if it has a value
      nodeObj.StartUtc = userValues.StartUtc ? userValues.StartUtc : null;

      // on updates we need the Gdid of the existing node we're editing
      if (this.modalArgs.action === "edit") nodeObj = {
        ...nodeObj,
        Gdid: this.modalArgs.Gdid, // ensure Gdid is set for updates
        G_Parent: this.modalArgs.G_Parent, // ensure G_Parent is set for updates
      };

      // on add we need the parent
      if (this.modalArgs.action === "add") {
        nodeObj.G_Parent = this.modalArgs.Gdid;
      }

      // do the action (save w/Gdid is update, w/o Gdid is new)
      results = await this.#client.forestClient.saveNode(nodeObj);
    }, msg);

    // here we return all the new values for post-processing in the main applet (treeview refreshing, etc.)
    this.modalResult = results;
    this.close();
  }

  /**
   * Handles the click event for the Close button.
   */
  #btnCancelClick() {
    this.modalResult = null;
    this.#resetBlockNodeDetails();
    this.close();
  }

  #resetBlockNodeDetails() {
    this.bitNode.tbStartUtc.value = undefined;
    this.bitNode.tbPathSegment.value = undefined;
    this.bitNode.tbLevelConfig.value = undefined;
    this.bitNode.tbProperties.value = undefined;

    this.bitNode.tbProperties.error = null;
    this.bitNode.tbStartUtc.error = null;
    this.bitNode.tbPathSegment.error = null;
    this.bitNode.tbLevelConfig.error = null;

    this.bitNodeDetails[DATA_VALUE_PROP] = {};
    this.bitNodeDetails[RESET_DIRTY_METHOD]();
    this.bitNodeDetails.error = null;
  }

  async #btnDeleteClick() {
    this.dlgNodeDelete.data = this.modalArgs;
    this.dlgNodeDelete.deleteFn = async (item, asOf) => {
      const result = await this.#client.forestClient.deleteNode(item.Id, asOf);
      console.log("Delete result:", result);
      this.modalResult = result;
      return result;
    };

    this.modalResult = (await this.dlgNodeDelete.show()).modalResult;
    if (!this.modalResult) {
      toast("Deletion cancelled", { status: "info" });
      return;
    }
    this.close();
  }

  renderBodyContent() {

    // set titles based on action type
    const title = `${this.modalArgs?.action === "add" ? "Parent node" : "Current node"} ${this.modalArgs?.Id}`;
    const description = `${this.modalArgs?.action === "add" ? "Parent" : "Current"} location: ${this.modalArgs?.Tree}@${this.modalArgs?.Forest}::/${this.modalArgs?.FullPath}`;
    const actionTitle = this.modalArgs?.action === "add" ? "Add New Node" : "Edit Node Details";

    return html`
    <az-bit scope="this" id="bitNodeContainer" title=${title} description=${description} rank="5">
     <az-cforest-node scope="this" id="bitExistingNode"></az-cforest-node>
    </az-bit>

    <az-bit title="${actionTitle}" scope="this" id="bitNodeDetails" isExpanded>
      <az-cforest-node-mutable scope="this" id="bitNode"></az-cforest-node-mutable>
    </az-bit>

    <div class="row cols2 compact">
      ${this.modalArgs?.action === "edit" && this.modalArgs?.PathSegment !== "/" ? html`<az-button icon="svg://azos.ico.delete" id="btnDelete" scope="this" title="Delete Node" status="error" @click="${this.#btnDeleteClick}"></az-button>` : html`<div></div>`}
      <div class="buttons">
        <az-button id="btnApplySettings" scope="this" title="Apply" @click="${this.#btnApplyClick}"></az-button>
        <az-button id="btnCloseSettings" scope="this" title="Cancel" @click="${this.#btnCancelClick}"></az-button>
      </div>
    </div>

    <az-dialog-delete scope="this" id="dlgNodeDelete" displayProp="Id"></az-dialog-delete>
    `;
  }
}

window.customElements.define("az-forest-node-dialog", ForestNodeDialog);







export class CfgForestNode extends Block {

  static styles = [Block.styles, STL_INLINE_GRID, css`
    :host { min-width: 80vw; }
    az-text { width: 100%;}
    h3 { margin-top:0; }
  `];

  renderControl() {
    return html`
    <h3>Node Details</h3>

    <div class="row cols6">
      <div><az-text scope="this" id="tbForest" name="Forest" title="Forest" isreadonly></az-text></div>
      <div><az-text scope="this" id="tbTree" name="Tree" title="Tree" isreadonly></az-text></div>
      <div class="span2"><az-text scope="this" id="tbGParent" name="G_Parent" title="Parent Id" isreadonly></az-text></div>
      <div class="span2"><az-text scope="this" id="tbId" name="Id" title="Node Id" isreadonly></az-text></div>
      <div class="span2"><az-text scope="this" id="tbGdid" name="Gdid" title="Node Gdid" isreadonly></az-text></div>
    </div>

    <az-cforest-node-data-version scope="this" id="blockDataVersion" name="DataVersion"></az-cforest-node-data-version>

    <div class="row cols2">
      <az-text scope="this" id="tbStartUtc" name="StartUtc" title="Start UTC" isreadonly></az-text>
      <az-text scope="this" id="tbPathSegment" name="PathSegment" title="Path Segment" isreadonly></az-text>
    </div>

    <div class="row">
      <az-text multiline scope="this" id="tbLevelConfig" name="LevelConfig" title="Level Configuration" isreadonly></az-text>
    </div>

    <div class="row">
      <az-text multiline scope="this" id="tbProperties" name="Properties" title="Properties" isreadonly></az-text>
    </div>
    `;
  }
}

window.customElements.define("az-cforest-node", CfgForestNode);


export class CfgForestNodeDataVersion extends Block {

  static styles = [Block.styles, STL_INLINE_GRID];

  static properties = {
    additionalData: { type: Object },
  };

  renderControl() {
    return html`
      <h3>Node Data Version</h3>
      <div>
        <az-text scope="this" id="tbG_Version" name="G_Version" title="G Version" isreadonly></az-text>
        <az-text scope="this" id="tbState" name="State" title="State" isreadonly></az-text>
        <az-text scope="this" id="tbUtc" name="Utc" title="UTC" isreadonly></az-text>
        <az-text scope="this" id="tbOrigin" name="Origin" title="Origin" isReadonly></az-text>
        <az-text scope="this" id="tbActor" name="Actor" title="Actor" isReadonly></az-text>
      </div>
    `;
  }
}

window.customElements.define("az-cforest-node-data-version", CfgForestNodeDataVersion);


export class CfgForestNodeMutable extends Block {

  static styles = [Block.styles, STL_INLINE_GRID, css`

    az-button { width: 11ch; }

    .fields {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
      margin-bottom: 1em;
    }
    .buttons {
      display: flex;
      flex-direction: row;
      gap: 0.5em;
      justify-content: flex-end;
    }

    az-text { width: 100%;}
    az-bit { margin-bottom: 0.5em; }


    `];

  renderControl() {
    return html`
      <div class="row cols4">
        <div class="span3">
          <az-text scope="this" id="tbPathSegment" name="PathSegment" title="Path Segment" isrequired></az-text>
        </div>
        <div>
          <az-text scope="this" id="tbStartUtc" name="StartUtc" title="Start UTC"  placeholder="01/21/2022 1:00 pm" dataType="date" datakind="datetime" timeZone="UTC" isrequired></az-text>
        </div>
      </div>
      <az-text multiline scope="this" id="tbLevelConfig" name="LevelConfig" title="Level Configuration" isRequired minlength="9"></az-text>
      <az-text multiline scope="this" id="tbProperties" name="Properties" title="Properties" isRequired minlength="9"></az-text>`;
  }
}

window.customElements.define("az-cforest-node-mutable", CfgForestNodeMutable);


/**
 * DeleteDialog component for confirming and executing delete operations
 * @property {Object} data - Data about the item being deleted
 * @property {Function} deleteFn - Function to call to perform the deletion
 */
export class DeleteDialog extends ModalDialog {
  static styles = [
    ModalDialog.styles,
    css`
      main {
        display: flex;
        flex-direction: column;
        padding: 1em;
      }

      .delete-warning {
        color: var(--s-error-fg-ctl);
      }

      .delete-details {
        padding: 0.75em;
        background-color: var(--paper2);
        border-radius: var(--r5-brad-ctl);
      }

      .delete-item-name {
        font-weight: bold;
      }

      .button-container {
        display: flex;
        justify-content: flex-end;
        gap: 0.5em;
        margin-top: 1em;
      }
    `,
  ];

  static properties = {
    data: { type: Object },
    deleteFn: { type: Function },
  };

  constructor() {
    super();
  }

  get title() {
    return `Delete ${this.itemName || "Item"}`;
  }

  async #btnDelete() {
    this.tbAsOf[VALIDATE_METHOD](this, null, true);
    if (this.tbAsOf.error) {
      toast("Please provide a valid date for deletion", { status: "error" });
      return;
    }

    const res = await this.deleteFn(this.data, this.tbAsOf.value);
    if (!res) {
      toast("Deletion failed", { status: "error" });
      return;
    }

    this.modalResult = res;
    toast("Item deleted successfully", { status: "ok" });
    this.close();
  }

  #btnCancel() {
    this.modalResult = null;
    this.close();
  }

  renderBody() {
    if (this.tbAsOf?.value) this.tbAsOfUtc.value = undefined;
    return html`
      <main>
        <p class="delete-warning">You are about to delete the following item.</p>

        <div class="delete-details">
          <div class="delete-item-name">${this.data?.Id}</div>
        </div>


        <az-text scope="this" id="tbAsOf" name="AsOf" title="Delete As Of"  placeholder="01/21/2022 1:00 pm" dataType="date" datakind="datetime" timeZone="UTC" isrequired></az-text>
        <div class="button-container">
          <az-button title="Cancel" @click="${this.#btnCancel}"></az-button>
          <az-button title="Delete" status="error" @click="${this.#btnDelete}"></az-button>
        </div>
      </main>
    `;
  }
}

window.customElements.define("az-dialog-delete", DeleteDialog);
