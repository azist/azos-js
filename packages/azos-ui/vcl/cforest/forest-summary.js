import { ForestSetupClient } from "azos/sysvc/cforest/forest-setup-client";
import { html, css } from "azos-ui/ui";
import { Block } from "azos-ui/blocks";
import "azos-ui/vcl/util/object-inspector";
import { toast } from "azos-ui/toast";
import { writeToClipboard } from "azos-ui/vcl/util/clipboard";
import "azos-ui/vcl/cforest/forest-versions";

// @todo: broke version dropdown. Data is available, need to check the render flow (was working)


class CForestNodeSummary extends Block {

  static properties = {
    source: { type: Object }
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

  connectedCallback() {
    super.connectedCallback();
    this.link(this.#ref);
  }

  render(){
    if(!this.source) return html`<span class="no-version">No selected version</span>`;
    const title = this.source.PathSegment || "No selected node";

    const copyBtn = html`<az-button
      id="btnCopyPath"
      rank="6"
      icon="svg://azos.ico.copy"
      @click="${(e) => {
        writeToClipboard(this.source.Id);
        toast(`Copied '${this.source.Id}' to clipboard`, { timeout: 1_000, status: "ok", position: "top-center" });
      }}"></az-button>`;

    return html`
      <div class="buttonBar row cols2">
        <div>
          <h4>${title === "/" ? "/ (root of tree)" : title}</h4>
          <h5>${this.source.Id}${copyBtn}</h5>
          <h6>${this.source?.DataVersion?.Utc} (${this.source?.DataVersion?.State})</h6>
        </div>
        <div>
          <az-cforest-versions .source=${this.source}></az-cforest-versions>
          <az-button id="addNode"   title="Add Node"   rank="6" class="selectedNodeBtn"  position="left" icon="svg://azos.ico.add"     @click="${(e) => {}}">Add</az-button>
          <az-button id="editNode"  title="Edit Node"  rank="6" class="selectedNodeBtn"  position="left" icon="svg://azos.ico.edit"    @click="${(e) => {}}">Edit</az-button>
        </div>
      </div>
      `;
    }
}

window.customElements.define("az-cforest-summary", CForestNodeSummary);
