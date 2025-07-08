import { ForestSetupClient } from "azos/sysvc/cforest/forest-setup-client";
import { html, css, verbatimHtml } from "azos-ui/ui";
import { Block } from "azos-ui/blocks";
import "azos-ui/vcl/util/object-inspector";
import { toast } from "azos-ui/toast";
import { writeToClipboard } from "azos-ui/vcl/util/clipboard";
import { Spinner } from "../../spinner.js";


// @todo: broke version dropdown. Data is available, need to check the render flow (was working)


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

    // console.log("CForestNodeVersions.#loadVersions completed", this.#selectedVersionDetails);
  }

  async #loadVersionDetails(versionId) {
    versionId = `${this.source.Tree}.gver@${this.source.Forest}::${versionId}`;
    this.#selectedVersionId  = this.source.DataVersion?.G_Version;
    this.#selectedVersionDetails = await this.#ref.forestClient.nodeInfoVersion(versionId);
    this.#versionOptions = this.#selectedVersions.map(this.#optToOption);

    // console.debug("CForestNodeVersions.#loadVersionDetails",versionId, this.#selectedVersionDetails);
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

    // console.log("CForestNodeSummary.render", this.source);

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

  // async onVersionBtnClick(e) {
  //   if(!this.#versionCache.has(this.source.Id)) {
  //     const versions = await this.#ref.forestClient.nodeVersionList(this.source.Id) || [];
  //     this.#versionCache.set(this.source.Id, versions);
  //   }
  //   this.dlgNodeVersions.update();
  //   this.requestUpdate();
  //   this.dlgNodeVersions.show();
  // }

  // async onVersionDetailClick(e) {
  //   const versionId = `${this.activeTree}.gver@${this.activeForest}::${e.target.value}`;
  //   this.#selectedVersionDetails = await this.#ref.forestClient.nodeInfoVersion(versionId);
  //   this.dlgNodeVersions.update();
  //   this.requestUpdate();
  // }

  // <az-modal-dialog id="dlgNodeVersions" scope="self" title="Versions: ${this.source?.PathSegment}">
  //   <div slot="body">
  //     <az-grid cols="1" rows="auto" class="nodeVersionList">
  //       <az-select id="versionSelect" title="Select version" @change="${this.onVersionDetailClick}">
  //         ${versionOptions}
  //       </az-select>
  //       <div class="strip-h">
  //         ${this.#selectedVersionDetails
  //           ? html`<az-object-inspector id="objectInspector" scope="this" .source=${this.#selectedVersionDetails}></az-object-inspector>`
  //           : html`<span class="no-version">No version selected</span>`}
  //       </div>
  //     </az-grid>
  //     <az-button @click="${() => this.dlgNodeVersions.close()}" title="Close" style="float: right;"></az-button>
  //     <az-bit title="Node Versions" scope="this" isExpanded="true">
  //       <pre>${JSON.stringify(Array.from(this.#versionCache.entries()), null, 2) || "No node version data"}</pre>
  //     </az-bit>
  //   </div>
  // </az-modal-dialog>
