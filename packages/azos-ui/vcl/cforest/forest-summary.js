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

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
  }

  async onVersionDetailClick(e) {
    const versionId = `${this.source.Tree}.gver@${this.source.Forest}::${e.target.value}`;
    this.#selectedVersionDetails = await this.#ref.forestClient.nodeInfoVersion(versionId);
    this.requestUpdate();
  }

  render(){
    if(!this.source) return html`<span class="no-version">No selected version</span>`;
    const title = this.source.PathSegment || "No selected node";

    const showVersions = this.source?.Versions && this.source?.Versions?.length > 1;
    const nodeVersionDetails = html`${(new Date(this.source?.DataVersion?.Utc ? this.source?.DataVersion?.Utc : Date.now())).toLocaleString()} (${this.source?.DataVersion?.State})`;
    const versionsBtn = showVersions ? html`<az-button id="btnNodeVersions" title="Version..." rank="6" class="selectedNodeBtn"  position="left" icon="svg://azos.ico.tenancy" @click="${ () => this.dlgNodeVersions.show()}">Versions</az-button>` : null;
    const versionOptions = showVersions ? this.source?.Versions?.map(version => `<option value="${version.G_Version}" title="${version.State} ${(new Date(version.Utc)).toLocaleString() } - ${version.G_Version}">${version.G_Version}</option>`) : null;


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
              ${showVersions
                ? html`<option value="" title="No versions available">No versions available</option>`
                : versionOptions
              }
            </az-select>
            <div class="strip-h">
              ${this.#selectedVersionDetails
                ? html`<az-object-inspector id="objectInspector" scope="this" .source=${this.#selectedVersionDetails}></az-object-inspector>`
                : html`<span class="no-version">No version selected</span>`}
            </div>
          </az-grid>
          <az-button @click="${() => this.dlgNodeVersions.close()}" title="Close" style="float: right;"></az-button>
        </div>
      </az-modal-dialog>
      `;
    }
}

window.customElements.define("az-cforest-summary", CForestNodeSummary);
