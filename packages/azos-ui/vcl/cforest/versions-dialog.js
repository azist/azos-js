import { html } from "azos-ui/ui";
import { ModalDialog } from "../../modal-dialog.js";
import "azos-ui/parts/select-field";
import { ForestSetupClient } from "azos/sysvc/cforest/forest-setup-client";
import { Spinner } from "../../spinner";

class CForestNodeVersions extends ModalDialog {

  static properties = {
    source: { type: Object },
    activeForest: { type: String },
    activeTree: { type: String },
  }

  #ref = { forestClient: ForestSetupClient };

  #selectedVersions = null;
  #selectedVersionDetails = null;
  #selectedVersionId = null;
  #versionOptions = [];

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
  }

  show(){
    this.#loadVersions();
    return super.show();
  }

  close(){
    this.#selectedVersions = null;
    this.#selectedVersionDetails = null;
    this.#selectedVersionId = null;
    this.#versionOptions = [];
    this.requestUpdate();
    super.close();
  }

  async #loadVersions() {
    await Spinner.exec(async()=> {
      const versionId = `${this.source.Tree}.gver@${this.source.Forest}::${this.source.DataVersion?.G_Version}`;

      this.#selectedVersionId  = this.source.DataVersion?.G_Version;
      this.#selectedVersions = await this.#ref.forestClient.nodeVersionList(this.source.Id);
      this.#selectedVersionDetails = await this.#ref.forestClient.nodeInfoVersion(versionId);
      this.#versionOptions = this.#selectedVersions.map(this.#optToOption);

      this.selVersions.requestUpdate();
      this.objectInspector.requestUpdate();
      this.requestUpdate();

    }, "Loading versions...");
  }


  async #loadVersionDetails(versionId) {
    versionId = `${this.source.Tree}.gver@${this.source.Forest}::${versionId}`;
    this.#selectedVersionId  = this.source.DataVersion?.G_Version;
    this.#selectedVersionDetails = await this.#ref.forestClient.nodeInfoVersion(versionId);
    this.#versionOptions = this.#selectedVersions.map(this.#optToOption);

    this.selVersions.requestUpdate();
    this.objectInspector.requestUpdate();
    this.requestUpdate();
  }



  #optToOption = (opt) => ({ title: `${opt.State} ${opt.Utc} - ${opt.G_Version}`, value: opt.G_Version });

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

window.customElements.define("az-forest-node-version-dialog", CForestNodeVersions);
