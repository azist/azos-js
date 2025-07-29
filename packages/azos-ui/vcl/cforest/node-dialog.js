import { html, css } from "../../ui";
import { ModalDialog } from "../../modal-dialog";
import * as aver from "../../../azos/aver";
import { Block } from "../../blocks";
import STL_INLINE_GRID from "../../styles/grid";
import { DATA_VALUE_PROP, RESET_DIRTY_METHOD, VALIDATE_METHOD } from "azos/types";
import { Spinner } from "../../spinner";
import "../util/code-box";


export class ForestNodeDialog extends ModalDialog {

  static styles = [ ModalDialog.styles, STL_INLINE_GRID, css`
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

  /**
   * Lifecycle hook for the Modal show() method
   * this.modalArgs contains the initial settings passed to the dialog.
   */
  async _show(){
    aver.isObject(this.modalArgs, "modalArgs obj");
    aver.isString(this.modalArgs.Forest, "modalArgs.Forest str");
    aver.isString(this.modalArgs.Tree, "modalArgs.Tree str");
    aver.isString(this.modalArgs.G_Parent, "modalArgs.G_Parent str");
    aver.isString(this.modalArgs.StartUtc, "modalArgs.StartUtc str");
    aver.isString(this.modalArgs.PathSegment, "modalArgs.PathSegment str");
    aver.isString(this.modalArgs.Properties, "modalArgs.Properties str");
    aver.isString(this.modalArgs.LevelConfig, "modalArgs.LevelConfig str");
    aver.isBool(this.modalArgs.isNew, "modalArgs.isNew bool");

    this.title = this.modalArgs?.isNew ? "Add New Node" : "Edit Node Details";

    this.#resetBlockNodeDetails();

    // initialize the existing node block
    this.bitExistingNode[DATA_VALUE_PROP] = this.modalArgs;

    // if this is an add we need to set the details node to the current and the form to an empty state
    this.bitNode[DATA_VALUE_PROP] = this.modalArgs?.isNew ? {} : this.modalArgs;

    // todo: confirm these requestUpdates are needed
    queueMicrotask(() => this.bitNode.requestUpdate());
    this.requestUpdate();

    console.log({ action: this.modalArgs?.isNew ? "add" : "edit", existing: this.bitExistingNode[DATA_VALUE_PROP], node: this.bitNode[DATA_VALUE_PROP] });
  }

  /**
   * Handles the click event for the Apply button.
   * Closes the dialog if all validations pass.
   * If any validation fails, it prevents closing the dialog.
   */
  #btnApplyClick(){

    // validate all information needed is available
    this.bitNode[VALIDATE_METHOD](this, null, true);

    if(this.bitNode.error) return;

    // here we return all the new values for processing within the main applet
    this.modalResult = this.bitNode[DATA_VALUE_PROP];

    // call client and attempt update
    const clientValues = {
      Forest: this.modalArgs.Forest,
      Tree: this.modalArgs.Tree,
      G_Parent: this.modalArgs.Gdid,
      StartUtc: this.bitNode[DATA_VALUE_PROP].StartUtc,
      PathSegment: this.bitNode[DATA_VALUE_PROP].PathSegment,
      LevelConfig: this.bitNode[DATA_VALUE_PROP].LevelConfig,
      Properties: this.bitNode[DATA_VALUE_PROP].Properties,
    };

    console.log("ForestNodeAddDialog modalResult", clientValues);

    Spinner.exec(async spin => {

      // todo: actual save logic should be implemented here


      // Simulate a client call to save the node
      const delay = Math.random() * 1_000 + 500; // Random delay between 500ms and 1500ms
      await new Promise(resolve => setTimeout(resolve, delay));
    }, `Saving node ${this.modalArgs?.isNew ? "adding" : "editing"}...`, { scope: this });



    this.close();
  }

  /**
   * Handles the click event for the Close button.
   */
  #btnCancelClick(){
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

  renderBodyContent() {

    // set titles based on isNew flag
    const detailsTitle = `${ this.modalArgs?.isNew ? "Parent node" : "Current node"} ${this.modalArgs?.Id}`;
    const detailsDescription = `${ this.modalArgs?.isNew ? "Parent" : "Current"} location: ${this.modalArgs?.Tree}@${this.modalArgs?.Forest}::/${this.modalArgs?.FullPath}`;

    return html`
    <az-bit scope="this" id="bitNodeContainer" title=${detailsTitle} description=${detailsDescription} rank="5">
     <az-cforest-node scope="this" id="bitExistingNode"></az-cforest-node>
    </az-bit>

    <az-bit title="New Node Details" scope="this" id="bitNodeDetails" isExpanded>
      <az-cforest-node-mutable scope="this" id="bitNode"></az-cforest-node-mutable>
    </az-bit>

    <div class="buttons">
      <az-button id="btnApplySettings" scope="this" title="Apply" @click="${this.#btnApplyClick}"></az-button>
      <az-button id="btnCloseSettings" scope="this" title="Cancel" @click="${this.#btnCancelClick}"></az-button>
    </div>`;
  }
}

window.customElements.define("az-forest-node-dialog", ForestNodeDialog);







export class CfgForestNode extends Block  {

  static styles = [ Block.styles, STL_INLINE_GRID, css`
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

  static styles = [ Block.styles, STL_INLINE_GRID ];

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

  static styles = [ Block.styles, STL_INLINE_GRID, css`

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
          <az-text scope="this" id="tbStartUtc" name="StartUtc" title="Start UTC"  placeholder="01/21/2022 1:00 pm" dataType="date" datakind="datetime" timeZone="UTC"></az-text>
        </div>
      </div>
      <az-text multiline scope="this" id="tbLevelConfig" name="LevelConfig" title="Level Configuration" isRequired></az-text>
      <az-text multiline scope="this" id="tbProperties" name="Properties" title="Properties" isRequired></az-text>`;
  }
}

window.customElements.define("az-cforest-node-mutable", CfgForestNodeMutable);
