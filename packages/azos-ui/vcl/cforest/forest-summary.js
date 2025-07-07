import { ForestSetupClient } from "azos/sysvc/cforest/forest-setup-client";
import { html, css } from "azos-ui/ui";
import { Block } from "azos-ui/blocks";
import "azos-ui/vcl/util/object-inspector";
import { toast } from "azos-ui/toast";
import { writeToClipboard } from "azos-ui/vcl/util/clipboard";


// @todo: broke version dropdown. Data is available, need to check the render flow (was working)


class CForestNodeSummary extends Block {

  static properties = {
    source: { type: Object | Array },
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
  #selectedVersionDetails = null;
  #versionCache = new Map();

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
  }

  async onVersionBtnClick(e) {
    if(!this.#versionCache.has(this.source.Id)) {
      const versions = await this.#ref.forestClient.nodeVersionList(this.source.Id) || [];
      this.#versionCache.set(this.source.Id, versions);
    }
    this.dlgNodeVersions.update();
    this.requestUpdate();
    this.dlgNodeVersions.show();
  }

  async onVersionDetailClick(e) {
    const versionId = `${this.activeTree}.gver@${this.activeForest}::${e.target.value}`;
    this.#selectedVersionDetails = await this.#ref.forestClient.nodeInfoVersion(versionId);
    this.dlgNodeVersions.update();
    this.requestUpdate();
  }

  render(){
    if(!this.source) return html`<span class="no-version">No selected version</span>`;
    const title = this.source.PathSegment || "No selected node";

    const nodeVersionDetails = html`${(new Date(this.source?.DataVersion?.Utc ? this.source?.DataVersion?.Utc : Date.now())).toLocaleString()} (${this.source?.DataVersion?.State})`;
    const versionsBtn = html`<az-button id="btnNodeVersions" title="Version..." rank="6" class="selectedNodeBtn"  position="left" icon="svg://azos.ico.tenancy" @click="${ () => this.onVersionBtnClick()}">Versions</az-button>`;
    const versionOptions = this.source?.Versions?.map(version => html`<option value="${version.G_Version}" title="${version.State} ${(new Date(version.Utc)).toLocaleString() } - ${version.G_Version}">${version.G_Version}</option>`);


    const copyBtn = html`<az-button id="btnCopyPath" rank="6" icon="svg://azos.ico.copy" @click="${(e) => {
        writeToClipboard(this.source.Id);
        toast(`Copied '${this.source.Id}' to clipboard`, { timeout: 1_000, status: "ok", position: "top-center" });
    }}"></az-button>`;

    console.debug("CForestNodeSummary.render", versionOptions, this.source);

    return html`
      <div class="buttonBar row cols2">
        <div>
          <h4>${title === "/" ? "/ (root of tree)" : title}</h4>
          <h5>${this.source.Id}${copyBtn}</h5>
          <h6> ${nodeVersionDetails}</h6>
        </div>
        <div>
          ${versionsBtn}
          <az-button id="addNode"   title="Add Node"   rank="6" class="selectedNodeBtn"  position="left" icon="svg://azos.ico.add"     @click="${(e) => {}}">Add</az-button>
          <az-button id="editNode"  title="Edit Node"  rank="6" class="selectedNodeBtn"  position="left" icon="svg://azos.ico.edit"    @click="${(e) => {}}">Edit</az-button>
        </div>
      </div>

      <az-modal-dialog id="dlgNodeVersions" scope="self" title="Versions: ${this.source?.PathSegment}">
        <div slot="body">
          <az-grid cols="1" rows="auto" class="nodeVersionList">
            <az-select id="versionSelect" title="Select version" @change="${this.onVersionDetailClick}">
              ${versionOptions}
            </az-select>
            <div class="strip-h">
              ${this.#selectedVersionDetails
                ? html`<az-object-inspector id="objectInspector" scope="this" .source=${this.#selectedVersionDetails}></az-object-inspector>`
                : html`<span class="no-version">No version selected</span>`}
            </div>
          </az-grid>
          <az-button @click="${() => this.dlgNodeVersions.close()}" title="Close" style="float: right;"></az-button>
          <az-bit title="Node Versions" scope="this" isExpanded="true">
            <pre>${JSON.stringify(Array.from(this.#versionCache.entries()), null, 2) || "No node version data"}</pre>
          </az-bit>
        </div>
      </az-modal-dialog>
      `;
    }
}

window.customElements.define("az-cforest-summary", CForestNodeSummary);
