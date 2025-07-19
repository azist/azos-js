import { html, css } from "../../ui";
import { ModalDialog } from "../../modal-dialog.js";
import "../../parts/select-field";
import * as aver from "../../../azos/aver";

/**
 * Dialog for configuring forest settings, allowing users to select a forest, tree, and an optional date.
 */
class ForestSettingsDialog extends ModalDialog {

  static styles = [ ModalDialog.styles, css`
    az-button { width: 7em; }
    az-text, az-select { width: -webkit-fill-available; }
  `];

  /**
   * Handles the change event for the forest selection dropdown.
   * Updates the temporary forest selection and retrieves the corresponding trees.
   */
  #onForestChange(e){
    const forestTrees = this.modalArgs.forests.find(f => f.id === e.target.value)?.trees || [];
    this.selTree.innerHTML = forestTrees.map(tree => `<option value="${tree}" title="${tree}">${tree}</option>`).join("");
    this.selTree.value = forestTrees[0] || "";
    this.selTree.requestUpdate();
  }

  /**
   * Lifecycle hook for the Modal show() method
   * this.modalArgs contains the initial settings passed to the dialog.
   * It initializes the dialog with the provided forest, tree, and asOfUtc date.
   */
  async _show(){
    aver.isObject(this.modalArgs, "modalArgs must be an object");
    aver.isArray(this.modalArgs.forests, "modalArgs.forests must be an array");
    aver.isString(this.modalArgs.forest, "modalArgs.forest must be a string");
    aver.isString(this.modalArgs.tree, "modalArgs.tree must be a string");
    aver.isStringOrNull(this.modalArgs.asOfUtc, "modalArgs.asOfUtc must be a string or null");

    // initialize the forest select
    this.selForest.innerHTML = this.modalArgs.forests.map(forest => `<option value="${forest.id}" title="${forest.id}">${forest.id}</option>`).join("");
    this.selForest.value = this.modalArgs.forest;

    // initialize the tree select
    this.selTree.innerHTML = this.modalArgs.forests.find(f => f.id === this.modalArgs.forest)?.trees.map(tree => `<option value="${tree}" title="${tree}">${tree}</option>`).join("");
    this.selTree.value = this.modalArgs.tree;

    // initialize the asOfUtc text input
    this.tbAsOf.value = this.modalArgs.asOfUtc || undefined;
  }

  /**
   * Handles the click event for the Apply button.
   * Validates the selections and sets the modal result with the selected forest, tree, and asOfUtc date.
   * Closes the dialog if all validations pass.
   * If any validation fails, it prevents closing the dialog.
   */
  #btnApplyClick(){
    this.selForest.validate();
    this.selTree.validate();
    this.tbAsOf.validate();
    if(this.selForest.error || this.selTree.error || this.tbAsOf.error) return;

    // todo: the date input validation is borked - this patch will stop the dialog but the tbAsOf input will reset/render...
    if(this.tbAsOf.value === undefined && this.tbAsOf.rawValue !== undefined) return;
    this.modalResult = {
      forest: this.selForest.value,
      tree: this.selTree.value,
      asOfUtc: this.tbAsOf.value || null
    };
    this.close();
  }

  /**
   * Handles the click event for the Close button.
   * Resets the modal result to null and closes the dialog.
   * Clears the forest and tree selections, and resets the asOf date input.
  */
  #btnCancelClick(){
    // Overly aggressive cleanup of previous settings on close.
    this.selForest.innerHTML = "";
    this.selForest.value = undefined;
    this.selTree.innerHTML = "";
    this.selTree.value = undefined;
    this.tbAsOf.value = undefined;

    this.modalResult = null;
    this.close();
  }

  renderBodyContent() {
    return html`
      <div class="strip-h">
        <az-select id="selForest" scope="this" title="Forest" rank="Normal" @change="${this.#onForestChange}" isRequired></az-select>
      </div>
      <div class="strip-h">
        <az-select id="selTree" scope="this" title="Tree" rank="Normal" isRequired></az-select>
      </div>
      <div class="strip-h">
        <az-text  id="tbAsOf" scope="this"  title="As of Date"  placeholder="01/21/2022 1:00 pm" dataType="date"  datakind="datetime"  timeZone="UTC" .value=${this.modalArgs?.asOfUtc || undefined}></az-text>
      </div>
      <div class="row">&nbsp;</div>
      <div class="row cols2">
        <az-button id="btnApplySettings" scope="this" title="Apply" @click="${this.#btnApplyClick}"></az-button>
        <az-button id="btnCloseSettings" scope="this" title="Cancel" @click="${this.#btnCancelClick}"></az-button>
      </div>`;
  }
}

window.customElements.define("az-forest-settings-dialog", ForestSettingsDialog);
