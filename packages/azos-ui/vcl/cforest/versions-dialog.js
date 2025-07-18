import { html, css } from "../../ui";
import { ModalDialog } from "../../modal-dialog.js";
import { Spinner } from "../../spinner";
import { ForestSetupClient } from "../../../azos/sysvc/cforest/forest-setup-client";
import "../../parts/select-field";

/**
 * Dialog for displaying, selecting, and viewing versions of a source forest node.
 */
class ForestNodeVersionsDialog extends ModalDialog {

  static styles = [ ModalDialog.styles, css`
    az-select { width: -webkit-fill-available; }
  `];

  static properties = {
    source: { type: Object },
    activeForest: { type: String },
    activeTree: { type: String },
  }

  #ref = { forestClient: ForestSetupClient };

  /**
   * Currently selected versions and their details.
   */
  #selectedVersions = null;
  #selectedVersionDetails = null;
  #selectedVersionId = null;
  #versionOptions = [];

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
  }

  /**
   * Shows the dialog and loads the versions for the selected node.
   */
  show(){
    this.#loadVersions();
    return super.show();
  }

  /**
   * Closes the dialog and resets the selected versions and details.
   */
  close() {
    this.#selectedVersions = null;
    this.#selectedVersionDetails = null;
    this.#selectedVersionId = null;
    this.#selectedVersionDetails = null;
    this.objectInspector.source = {};
    super.close();
  }

  /**
   * Loads the versions for the selected node.
   * It fetches the versions from the forest client and populates the version options.
   * It also automatically loads the details of the currently selected version.
   */
  async #loadVersions() {
    await Spinner.exec(async()=> {
      this.#selectedVersionId  = this.source.DataVersion?.G_Version;
      this.#selectedVersions = await this.#ref.forestClient.nodeVersionList(this.source.Id);
      this.#versionOptions = this.#selectedVersions.map(opt => ({ title: `${opt.State} ${opt.Utc} - ${opt.G_Version}`, value: opt.G_Version }));

      await this.#loadVersionDetails(this.#selectedVersionId); // auto load the current version details
      this.requestUpdate();
    }, "Loading versions...");
  }


  /**
   * Loads the details of a specific version by its ID.
   * It fetches the version details from the forest client and updates the object inspector.
   * @param {string} versionId - The ID of the version to load.
   */
  async #loadVersionDetails(versionId) {
    this.#selectedVersionId  = this.source.DataVersion?.G_Version;
    this.#selectedVersionDetails = await this.#ref.forestClient.nodeInfoVersion(`${this.source.Tree}.gver@${this.source.Forest}::${versionId}`);
    this.requestUpdate();
  }

  renderBodyContent(){

    return html`
      <div class="row">
        <az-select
          id="selVersions"
          scope="this"
          title="Select version"
          rank="Normal"
          .value="${this.#selectedVersionId}"
          @change="${e => this.#loadVersionDetails(e.target.value)}">
            ${this.#versionOptions.map(opt => html`<option value="${opt.value}" title="${opt.title}">${opt.title}</option>`)}
        </az-select>
      </div>

      <div class="row">
        <az-object-inspector id="objectInspector" scope="this" .source=${this.#selectedVersionDetails}></az-object-inspector>
      </div>

      <div class="row">
        <az-button @click="${() => this.close()}" title="Close" style="float: right;"></az-button>
      </div>`;
  }
}

window.customElements.define("az-forest-node-version-dialog", ForestNodeVersionsDialog);
