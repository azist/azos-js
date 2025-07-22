import { html, css } from "../../ui";
import { ModalDialog } from "../../modal-dialog.js";
import "../../parts/select-field";
import * as aver from "../../../azos/aver";

/**
 * Dialog for configuring forest settings, allowing users to select a forest, tree, and an optional date.
 */
class ForestSettingsDialog extends ModalDialog {

  static styles = [ ModalDialog.styles, css`
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
      margin-bottom: 0.25em;
    }
  `];

  /**
   * Lifecycle hook for the Modal show() method
   * this.modalArgs contains the initial settings passed to the dialog.
   * It initializes the dialog with the provided forest, tree, and asOfUtc date.
   */
  async _show(){
    aver.isObject(this.modalArgs, "modalArgs obj");
    aver.isArray(this.modalArgs.forests, "modalArgs.forests arr");
    aver.isString(this.modalArgs.forest, "modalArgs.forest str");
    aver.isString(this.modalArgs.tree, "modalArgs.tree str");
    aver.isStringOrNull(this.modalArgs.asOfUtc, "modalArgs.asOfUtc str|null");

    // create a flat list of top level forest options
    this.selForest.valueList = this.modalArgs.forests.reduce((a,{id}) => ({ ...a, [id]: id }), {});
    this.selForest.value = this.modalArgs?.forest || this.modalArgs.forests[0].id;

    // create a flat list of tree options based on the selected forest
    // if no forest is selected, default to the first forest's trees
    const selectedForest = this.modalArgs.forests.find(f => f.id === this.selForest.value);
    this.selTree.valueList = selectedForest?.trees.reduce((a, tree) => ({ ...a, [tree]: tree }), {});
    this.selTree.value = this.modalArgs?.tree || selectedForest.trees[0] || "";

    // initialize the asOfUtc text input
    this.tbAsOf.value = this.modalArgs.asOfUtc || undefined;
  }

  /**
   * Handles the change event for the forest selection dropdown.
   * Updates the temporary forest selection and retrieves the corresponding trees.
   */
  #onForestChange(e){
    const selectedForest = this.modalArgs.forests.find(f => f.id ===  e.target.value);
    this.selTree.valueList = selectedForest?.trees.reduce((a, tree) => ({ ...a, [tree]: tree }), {});
    this.selTree.value = selectedForest.trees[0];
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
    // this.tbAsOf.validate();
    if(this.selForest.error || this.selTree.error || this.tbAsOf.error) return;

    // todo: the date input validation is borked - this patch will stop the dialog but the tbAsOf input will reset/render...
    // if(this.tbAsOf.value === undefined && (this.tbAsOf.rawValue !== undefined && this.tbAsOf.rawValue !== "")) return;
    this.modalResult = {
      forest: this.selForest.value,
      tree: this.selTree.value,
      asOfUtc: this.tbAsOf.value ?? null
    };
    this.close();
  }

  /**
   * Handles the click event for the Close button.
   */
  #btnCancelClick(){
    this.close();
  }

  renderBodyContent() {
    return html`
      <div class="fields">
        <az-select id="selForest" scope="this" title="Forest" isRequired rank="Normal" @change="${this.#onForestChange}"></az-select>
        <az-select id="selTree"   scope="this" title="Tree"   isRequired rank="Normal"></az-select>
        <az-text id="tbAsOf" scope="this" title="As of Date" placeholder="01/21/2022 1:00 pm" dataType="date" datakind="datetime" timeZone="UTC"></az-text>
      </div>
      <div class="buttons">
        <az-button id="btnApplySettings" scope="this" title="Apply" @click="${this.#btnApplyClick}"></az-button>
        <az-button id="btnCloseSettings" scope="this" title="Cancel" @click="${this.#btnCancelClick}"></az-button>
      </div>`;
  }
}

window.customElements.define("az-forest-settings-dialog", ForestSettingsDialog);
