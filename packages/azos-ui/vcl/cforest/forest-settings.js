import { html, css } from "azos-ui/ui";
import { Block } from "azos-ui/blocks";
import "azos-ui/parts/select-field";


class CfgForestSettings  extends Block {

  static properties = {
    forests: { type: Array, reflect: true },
    activeForest: { type: String, reflect: true },
    activeTree: { type: String, reflect: true },
    activeAsOfUtc: { type: String, reflect: true },
  }

  static styles = [ Block.styles, css`
    .horizontalBtnBar {
      display: flex;
      width: 100%;
    }
    .horizontalBtnBar az-button {
      flex: 1 1 50%;
      box-sizing: border-box;
    }
   .horizontalBtnBar az-button > button {
      width: 100%;
    }
  `];

  #tmpForestSelection = this.activeForest || null;
  #tmpTreeSelection = this.activeTree || null;
  #tmpAsOfUtc = this.activeAsOfUtc || null;


  open(){ this.dlgCfgForestsSettingsModal.show(); }


  updatedTreeOptions() {

    const trees = (this.forests.find(f => f.id === this.#tmpForestSelection)?.trees || []);
    const treeOptions = [trees.length === 0
      ? html`<option value="No trees available" title="">No trees available</option>`
      : html`<option value="" title="Select a tree&hellip;">"Select a tree&hellip;</option>`,
        ...trees.map(tree => html`<option value="${tree}" .selected="${this.#tmpTreeSelection === tree}" title="${tree}">${tree}</option>`)
    ];

    return treeOptions;

  }

  onForestChange = (e) => {
    const forestId = e.target.value;
    console.log(`CfgForestApplet#renderSettingsForm onForestChange`, forestId);
    this.#tmpForestSelection = forestId;
    this.#tmpTreeSelection = null;
    this.requestUpdate();
  }

  onTreeChange = (e) => {
    const tree = e.target.value;
    this.#tmpTreeSelection = tree;
    console.log(`CfgForestApplet#renderSettingsForm onTreeChange`, tree);
    this.requestUpdate();
  }

  onAsOfDateChange = (e) => {
    const asOfDate = e.target.value;
    this.#tmpAsOfUtc = asOfDate;
    console.log(`CfgForestApplet#renderSettingsForm onAsOfDateChange`, asOfDate);
    this.requestUpdate();
  }

  onOkButtonClick = () => {
    console.log(`CfgForestApplet#renderSettingsForm onOkButtonClick`, this.#tmpForestSelection, this.#tmpTreeSelection, this.#tmpAsOfUtc);
    this.dlgCfgForestsSettingsModal.close();
  }

  onCloseClick = () => {
    console.log(`CfgForestApplet#renderSettingsForm onCloseClick`);
    this.#tmpForestSelection = null;
    this.#tmpTreeSelection = null;
    this.#tmpAsOfUtc = null;
    this.dlgCfgForestsSettingsModal.close();
  }

  render() {

    if(!this.forests || this.forests.length === 0) html`<div class="cardBasic">No forests available. Please create a forest first.</div>`;
    const forests = this.forests.map(forest => html`<option value="${forest.id}" .selected="${  this.activeForest == forest.id }" title="${forest.title}">${forest.title}</option>`);
    const forestOptions = [forests.length === 0 ? html`<option value="No forests available" title="">No forests available</option>` : html`<option value="" title="Select a forest&hellip;">"Select a forest&hellip;</option>`, ...forests ];
    const treeOptions = this.updatedTreeOptions();
    return html`
    <az-modal-dialog id="dlgCfgForestsSettingsModal" scope="this" title="Forest">
      <div slot="body">
        <div class="row">
          <az-select id="forestSelect" title="Select Forest" @change="${this.onForestChange}">${forestOptions}</az-select><br/>
          <az-select id="treeSelect" title="Select Tree" @change="${this.onTreeChange}">${treeOptions}</az-select><br />
          <az-text id="asOfDate" scope="this" title="New As of Date" placeholder="2024/01/01 1:00 pm" dataType="date" dataKind="datetime-local"  @change="${this.onAsOfDateChange}"></az-text><br/>
        </div>

        <div class="horizontalBtnBar">
          <az-button id="btnCfgForestSettings"  title="Ok"   @click="${this.onOkButtonClick}"></az-button>
          <az-button id="btnCloseSettings"      title="Close" @click="${() => {this.dlgCfgForestsSettingsModal.close()}}"></az-button>
        </div>


        <div>
          <p>Temporary values to be applied on Ok</p>
          <ul>
            <li>Forest: ${this.#tmpForestSelection || "Not selected"}</li>
            <li>Tree: ${this.#tmpTreeSelection || "Not selected"}</li>
            <li>As of Date: ${this.#tmpAsOfUtc || "Not set"}</li>
          </ul>
          <p>Active values</p>
          <ul>
            <li>Forest: ${this.activeForest || "Not selected"}</li>
            <li>Tree: ${this.activeTree || "Not selected"}</li>
            <li>As of Date: ${this.activeAsOfUtc || "Not set"}</li>
          </ul>
        </div>
      </div>
    </az-modal-dialog>`;
  }
}

window.customElements.define("az-cfg-forest-settings", CfgForestSettings);
