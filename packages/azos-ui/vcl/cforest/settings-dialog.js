import { html, css } from "azos-ui/ui";
import { ModalDialog } from "../../modal-dialog.js";
import "azos-ui/parts/select-field";

/**
 * Dialog for configuring forest settings, allowing users to select a forest, tree, and an optional date.
 */
class ForestSettingsDialog extends ModalDialog {

  static properties = {
    settings: { type: Object },
  }

  static styles = [ ModalDialog.styles, css`
    az-button { width: 7em; }
    az-text, az-select { width: -webkit-fill-available; }
  `];

  /**
   * Temporary selections for forest, tree, and asOfUtc date.
   * These are used to hold the user's selections before applying them.
   * They are initialized to null or undefined to indicate no selection.
   */
  #tmpForestSelection = null;
  #tmpTreeSelection = null;
  #tmpAsOfUtc = undefined;

  /**
   * The currently selected forest object and its trees.
   */
  #currentForestObject = null;
  #currentForestTrees = null;

  /**
   * Handles the change event for the forest selection dropdown.
   * Updates the temporary forest selection and retrieves the corresponding trees.
   */
  #onForestChange(e){
    const forestId = e.target.value;
    this.#tmpForestSelection = forestId;

    this.#currentForestObject = this.settings.forests.find(f => f.id === forestId);
    this.#currentForestTrees = this.#currentForestObject?.trees || [];

    this.#tmpForestSelection = forestId;
    this.#tmpTreeSelection = this.#currentForestTrees[0] || null;

    this.requestUpdate();
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
   */
  #btnCancelClick(){
    this.modalResult = null;
    this.close();
  }

  /**
   * Converts a forest option object to an HTML option element.
   * @param {Object} opt - The forest option object containing id and title.
   * @param {boolean} [selected=false] - Whether the option should be selected.
   * @returns {HTMLTemplateElement} - The HTML option element.
   */
  #optToOption(opt, selected = false) {
    return html`<option value="${opt.id}" .selected="${selected}" title="${opt.id}">${opt.id}</option>`;
  }

  renderBodyContent(){

    const currentForestId = this.#tmpForestSelection || this.settings.activeForest;
    const currentTreeId = this.#tmpTreeSelection || this.settings.activeTree;
    const asOfValue = this.#tmpAsOfUtc || this.settings.activeAsOfUtc || undefined;

    const forestOptions = this.settings.forests.map(forest => this.#optToOption(forest, currentForestId === forest.id));
    const treeOptions = this.settings.forests.find(f => f.id === currentForestId)?.trees?.map(tree => this.#optToOption({ id: tree, title: tree }, currentTreeId === tree));

    return html`
      <div class="strip-h">
        <az-select
          id="selForest"
          scope="this"
          title="Forest"
          rank="Normal"
          @change="${this.#onForestChange}"
          .value="${currentForestId}"
          isRequired>${forestOptions}</az-select></div>

      <div class="strip-h">
        <az-select
          id="selTree"
          scope="this"
          title="Tree"
          rank="Normal"
          .value="${currentTreeId}"
          isRequired>${treeOptions}</az-select></div>

      <div class="strip-h">
        <az-text
          id="tbAsOf"
          scope="this"
          title="As of Date"
          placeholder="01/21/2022 1:00 pm"
          dataType="date"
          datakind="datetime"
          timeZone="UTC"
          .value="${asOfValue}"
        ></az-text>
      </div>

      <div class="row">&nbsp;</div>

      <div class="row cols2">
        <az-button id="btnApplySettings" scope="this" title="Apply" @click="${this.#btnApplyClick}"></az-button>
        <az-button id="btnCloseSettings" scope="this" title="Cancel" @click="${this.#btnCancelClick}"></az-button>
      </div>`;
  }
}

window.customElements.define("az-forest-settings-dialog", ForestSettingsDialog);
