import { html, css } from "azos-ui/ui";
import { ModalDialog } from "../../modal-dialog.js";
import "azos-ui/parts/select-field";

class CfgForestSettings extends ModalDialog {

  static properties = {
    settings: { type: Object },
  }

  static styles = [ ModalDialog.styles, css`
    az-button { width: 7em; }
    az-text, az-select { width: -webkit-fill-available; }
  `];

  #tmpForestSelection = null;
  #tmpTreeSelection = null;
  #tmpAsOfUtc = undefined;

  #currentForestObject = null;
  #currentForestTrees = null;

  #onForestChange = (e) => {
    const forestId = e.target.value;
    this.#tmpForestSelection = forestId;

    this.#currentForestObject = this.settings.forests.find(f => f.id === forestId);
    this.#currentForestTrees = this.#currentForestObject?.trees || [];

    this.#tmpForestSelection = forestId;
    this.#tmpTreeSelection = this.#currentForestTrees[0] || null;

    this.selForest.requestUpdate();
    this.selTree.requestUpdate();
    this.requestUpdate();
  }

  show(){
    this.#tmpForestSelection = this.settings.activeForest || null;
    this.#tmpTreeSelection = this.settings.activeTree || null;
    if(this.#tmpAsOfUtc) this.#tmpAsOfUtc = this.settings.activeAsOfUtc;

    this.#currentForestObject = this.settings.forests.find(f => f.id === this.#tmpForestSelection);
    this.#currentForestTrees = this.#currentForestObject?.trees;

    this.selForest.requestUpdate();
    this.selTree.requestUpdate();
    this.requestUpdate();

    return super.show();
  }

  #btnApplyClick = (e) => {
    this.selForest.validate();
    this.selTree.validate();
    if(this.selForest.error || this.selTree.error) return;
    this.modalResult = {
      forest: this.selForest.value,
      tree: this.selTree.value,
      asOfUtc: this.datAsOfDate.value || null
    };
    this.close();
  }

  #btnCloseClick = () => {
    this.modalResult = null;
    this.#tmpForestSelection = null;
    this.#tmpTreeSelection = null;
    this.#tmpAsOfUtc = undefined;
    this.close();
  }

  #optToOption = (opt, selected = false) => html`<option value="${opt.id}" .selected="${selected}" title="${opt.title}">${opt.title}</option>`;

  renderBodyContent(){



    const forestOptions = this.settings.forests.map(forest => this.#optToOption(forest, this.#tmpForestSelection === forest.id));
    const treeOptions = this.#currentForestObject?.trees?.map(tree => this.#optToOption({ id: tree, title: tree }, this.#tmpTreeSelection === tree));

    return html`
      <div class="strip-h">
        <az-select
          id="selForest"
          scope="this"
          title="Forest"
          rank="Normal"
          @change="${this.#onForestChange}"
          .value="${this.#tmpForestSelection}"
          isRequired>${forestOptions}</az-select></div>

      <div class="strip-h">
        <az-select
          id="selTree"
          scope="this"
          title="Tree"
          rank="Normal"
          .value="${this.#tmpTreeSelection}"
          isRequired>${treeOptions}</az-select></div>

      <div class="strip-h">
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

      <div class="row">&nbsp;</div>

      <div class="row cols2">
        <az-button id="btnApplySettings" title="Apply" @click="${this.#btnApplyClick}"></az-button>
        <az-button id="btnCloseSettings" title="Close" @click="${this.#btnCloseClick}"></az-button>
      </div>`;
  }
}

window.customElements.define("az-forest-settings-dialog", CfgForestSettings);
