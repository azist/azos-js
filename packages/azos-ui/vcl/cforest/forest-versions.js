import { ForestSetupClient } from "azos/sysvc/cforest/forest-setup-client";
import { html, css } from "azos-ui/ui";
import { Block } from "azos-ui/blocks";
import "azos-ui/vcl/util/object-inspector";
import { Spinner } from "../../spinner.js";

class CForestNodeVersions extends Block {

  static properties = {
    source: { type: Object },
    activeForest: { type: String },
    activeTree: { type: String },
  }

  static styles = [ Block.styles, css`
    h4, h5, h6 {
      margin: 0;
    }

    .buttonBar {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 0.5em;
      margin-bottom: 0;
    }

    .btnSettings {
      display: block;
      padding: 0;
      margin: 0;
    }

    .buttonBar> :last-child {
      margin-left: auto;
    }

    .selectedNodeBtn{}

  `];

  #ref = { forestClient: ForestSetupClient };

  #selectedVersions = null;
  #selectedVersionDetails = null;
  #selectedVersionId = null;
  #versionOptions = [];

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
  }

  async #loadVersions(){
    await Spinner.exec(async()=> {
      const versionId = `${this.source.Tree}.gver@${this.source.Forest}::${this.source.DataVersion?.G_Version}`;

      this.#selectedVersionId  = this.source.DataVersion?.G_Version;
      this.#selectedVersions = await this.#ref.forestClient.nodeVersionList(this.source.Id);
      this.#selectedVersionDetails = await this.#ref.forestClient.nodeInfoVersion(versionId);
      this.#versionOptions = this.#selectedVersions.map(this.#optToOption);

      this.selVersions.requestUpdate();
      this.objectInspector.requestUpdate();
      this.requestUpdate();
      await this.dlgNodeVersions.show();

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

  #optToOption = (opt) => ({
    title: `${opt.State} ${opt.Utc} - ${opt.G_Version}`,
    value: opt.G_Version
  });

  render(){
    if(!this.source) return null;

    return html`
      <az-button id="btnNodeVersions" title="Version..." rank="6" class="selectedNodeBtn"  position="left" icon="svg://azos.ico.tenancy" @click="${ () => this.#loadVersions(this.source.Id)}">Versions</az-button>

      <az-modal-dialog id="dlgNodeVersions" scope="self" title="Versions: ${this.source?.PathSegment}">
        <div slot="body">

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
            <az-button @click="${() => this.dlgNodeVersions.close()}" title="Close" style="float: right;"></az-button>
          </div>

        </div>
      </az-modal-dialog>
      `;
    }
}

window.customElements.define("az-cforest-versions", CForestNodeVersions);
