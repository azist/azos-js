import { html, css } from "azos-ui/ui";
import { Block } from "azos-ui/blocks";
import "azos-ui/parts/select-field";
import { VALIDATE_METHOD } from "azos/types";

// @todo: remove redundant forest and tree vars
// @todo: remove redundant request updates

class CfgForestSettings extends Block {

  static properties = {
    forests: { type: Array },
    activeForest: { type: String },
    activeTree: { type: String },
    activeAsOfUtc: { type: String },
    applySettings: { type: Function },
  }

  static styles = [ Block.styles, css`
    az-button { width: 12ch; }
  `];

  #tmpForestSelection = null;
  #tmpTreeSelection = null;
  #tmpAsOfUtc = undefined;

  #currentForestObject = null;
  #currentForestTrees = null;

  async open(){
    this.#tmpForestSelection = this.activeForest || null;
    this.#tmpTreeSelection = this.activeTree || null;
    if(this.#tmpAsOfUtc) this.#tmpAsOfUtc = this.activeAsOfUtc;

    this.#currentForestObject = this.forests.find(f => f.id === this.#tmpForestSelection);
    this.#currentForestTrees = this.#currentForestObject?.trees;

    this.selForest.requestUpdate();
    this.selTree.requestUpdate();
    this.dlgSettingsModal.requestUpdate();
    this.requestUpdate();
    await this.dlgSettingsModal.show();

  }

  #onForestChange = (e) => {
    const forestId = e.target.value;
    this.#tmpForestSelection = forestId;

    this.#currentForestObject = this.forests.find(f => f.id === forestId);
    this.#currentForestTrees = this.#currentForestObject?.trees || [];

    this.#tmpForestSelection = forestId;
    this.#tmpTreeSelection = this.#currentForestTrees[0] || null;

    this.selForest.requestUpdate();
    this.selTree.requestUpdate();
    this.dlgSettingsModal.requestUpdate();
    this.requestUpdate();
  }

  #btnOkClick = (e) => {
    e.preventDefault();

    // do validation
    const invalidForest = this.selForest[VALIDATE_METHOD](null, "", true)
    const invalidTree = this.selTree[VALIDATE_METHOD](null, "", true)
    if(invalidForest || invalidTree) return;

    this.applySettings?.( this.selForest.value, this.selTree.value, this.datAsOfDate.value || null);
    this.dlgSettingsModal.close();
  }

  #btnCloseClick = () => {
    // console.log(`CfgForestApplet#renderSettingsForm onCloseClick`);
    this.dlgSettingsModal.close();
  }

  #optToOption = (opt, selected = false) => html`<option value="${opt.id}" .selected="${selected}" title="${opt.title}">${opt.title}</option>`;


  render(){
    const forestOptions = this.forests.map(forest => this.#optToOption(forest, this.#tmpForestSelection === forest.id));
    const treeOptions = this.#currentForestObject?.trees?.map(tree => this.#optToOption({ id: tree, title: tree }, this.#tmpTreeSelection === tree));

    // console.log("CfgForestApplet#renderSettingsForm render", this.#currentForestObject, this.#currentForestTrees);

    return html`
    <az-modal-dialog id="dlgSettingsModal" scope="self" title="Forest">
      <div slot="body">

        <div class="row">
          <az-select
            id="selForest"
            scope="this"
            title="Forest"
            rank="Normal"
            @change="${this.#onForestChange}"
            .value="${this.#tmpForestSelection}"
            isRequired>${forestOptions}</az-select></div>

        <div class="row">
          <az-select
            id="selTree"
            scope="this"
            title="Tree"
            rank="Normal"
            .value="${this.#tmpTreeSelection}"
            isRequired>${treeOptions}</az-select></div>

        <div class="row">
          <az-text
            id="datAsOfDate"
            scope="this"
            title="As of Date"
            placeholder="2024/01/01 1:00 pm"
            dataType="date"
            datakind="datetime"
            .value="${this.#tmpAsOfUtc}"
            timeZone="UTC"></az-text>
        </div>

        <div class="row"></div>

        <div class="row cols2">
          <az-button id="btnCfgForestSettings" title="Ok"    @click="${this.#btnOkClick}"></az-button>
          <az-button id="btnCloseSettings"     title="Close" @click="${this.#btnCloseClick}"></az-button>
        </div>

      </div>
    </az-modal-dialog>
    `;
  }
}

window.customElements.define("az-cfg-settings", CfgForestSettings);
