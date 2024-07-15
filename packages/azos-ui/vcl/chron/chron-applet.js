/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { ChronicleClient } from "azos/sysvc/chron/chron-client";

import { html, css, STATUS } from "azos-ui/ui";
import { Command } from "azos-ui/cmd";
import { Applet } from "azos-ui/applet";
import { Spinner } from "azos-ui/spinner";

import "azos-ui/modal-dialog";
import "azos-ui/parts/button";
import "azos-ui/vcl/util/code-box";

import "./filter-dialog.js";
import "./grid.js";

/** Provides Azos SKY Chronicle log viewer functionality  */
export class ChronicleApplet extends Applet{
  constructor(){ super(); }

  static styles = css`
  :host{ display: block; padding: 1ch 1ch; }
  .full-screen{
    display: block;
    width: calc(100vw - calc(100vw - 100%));
    height: calc(100vh - var(--arn-hdr-height) - 2ch);
    overflow: scroll;
    box-sizing: border-box;
  }`;

  #ref = {svcChronicle: ChronicleClient};

  #cmdFilter = new Command(this, {
    uri: "cmdChronicleFilter",
    //active: false,
    title: "Help",
    icon: `<svg width="28px" height="28px" viewBox="0 0 24 24">
           <path d="M22 3.58002H2C1.99912 5.28492 2.43416 6.96173 3.26376 8.45117C4.09337 9.94062 5.29 11.1932 6.73999 12.09C7.44033 12.5379 8.01525 13.1565 8.41062 13.8877C8.80598 14.6189 9.00879 15.4388 9 16.27V21.54L15 20.54V16.25C14.9912 15.4188 15.194 14.599 15.5894 13.8677C15.9847 13.1365 16.5597 12.5178 17.26 12.07C18.7071 11.175 19.9019 9.92554 20.7314 8.43988C21.5608 6.95422 21.9975 5.28153 22 3.58002Z" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>`,
    handler: async function(){
      const filter = (await this.ctx.dlgFilter.show()).modalResult;
      if (!filter) return;
      await this.ctx.#loadData(filter);
    }
  });

  get title(){ return "Log Chronicle Viewer"; }

  async connectedCallback(){
    super.connectedCallback();
    this.arena.hideFooter(true);
    this.link(this.#ref);
    this.arena.installToolbarCommands([this.#cmdFilter]);
    await this.#loadData();
  }


  async #loadData(filter){
    Spinner.exec(async () => {
      const response = await this.#ref.svcChronicle.getLogList({filter: filter ?? {}});
      //console.dir(response.data.data);
      this.grdData.data = response.data.data;
    });
  }


  render(){
    return html`
     <az-sky-chronicle-filter-dialog id="dlgFilter" scope="this" title="Chronicle Filter">
     </az-sky-chronicle-filter-dialog>

     <div class="full-screen">
      <az-sky-chronicle-grid id="grdData" scope="this" showFullGuids showChannel @showRowData=${this.onShowRowData}>
      </az-sky-chronicle-grid>
     </div>

     <!-- Another popup for details -->
     <az-modal-dialog id="dlgData" scope="this" title="Data" status="normal">
     <div slot="body">
        <az-code-box id="codeBox" scope="this"  highlight="js" style="max-width: 120ch; max-height: 55vh"></az-code-box>
        <br>
        <az-button @click="${this.onDlgDataClose}" title="Close" style="float: right;"></az-button>
      </div>
     </az-modal-dialog>
    `;
  }

  onDlgDataClose(){ this.dlgData.close();  }

  onShowRowData(e){

    this.codeBox.highlight = "json";

    if (e.detail.what==="error"){
      this.dlgData.status = STATUS.ERROR;
      this.dlgData.title = `Error Details`;
      this.codeBox.source = JSON.stringify({ gdid: e.detail.row.Gdid, error: e.detail.row.ExceptionData}, null, 2);
      this.dlgData.show();
    } else if (e.detail.what==="pars"){
      //e.detail.row.Pars
      this.dlgData.status = STATUS.INFO;

      try{
        const jsp = JSON.parse(e.detail.row.Parameters);
        this.dlgData.title = `Parameters of (${e.detail.row.Gdid}) as JSON`;
        this.codeBox.source = JSON.stringify(jsp, null, 2);
      }catch{
        this.dlgData.title = `Parameters of (${e.detail.row.Gdid})`;
        this.codeBox.source = e.detail.row.Parameters;
      }
      this.dlgData.show();
    } else if (e.detail.what==="text"){
      this.dlgData.status = STATUS.OK;
      this.dlgData.title = `Log Text`;
      this.codeBox.highlight = "text";
      this.codeBox.source = e.detail.row.Text;
      this.dlgData.show();
    } else {
      //whole row json
      this.dlgData.status = STATUS.DEFAULT;
      this.dlgData.title = `Log Message JSON`;
      this.codeBox.source = JSON.stringify(e.detail.row, null, 2);
      this.dlgData.show();
    }
  }

}

window.customElements.define("az-sky-chronicle-applet", ChronicleApplet);
