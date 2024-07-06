/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "azos-ui/ui.js";
import { Command } from "azos-ui/cmd.js";
import { Applet } from "azos-ui/applet.js";
import { ChronicleClient } from "azos/sysvc/chron/chron-client";

import "./filter-dialog.js";
import "./grid.js";

/** Provides Azos SKY Chronicle log viewer functionality  */
export class ChronicleApplet extends Applet{
  constructor(){ super(); }

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
     const response = await this.ctx.#ref.svcChronicle.getLogList({filter: filter});
     //console.dir(response.data.data);
     this.ctx.grdData.data = response.data.data;
    }
  });

  get title(){ return "Log Chronicle Viewer"; }

  connectedCallback(){
    super.connectedCallback();
    this.link(this.#ref);
    this.arena.installToolbarCommands([this.#cmdFilter]);
  }


  render(){
    return html`
     <az-sky-chronicle-filter-dialog id="dlgFilter" scope="this" title="Chronicle Filter">
     </az-sky-chronicle-filter-dialog>

     <az-sky-chronicle-grid id="grdData" scope="this" showFullGuids showChannel>
     </az-sky-chronicle-grid>

     <!-- Another popup for details -->
    `;
  }
}

window.customElements.define("az-sky-chronicle-applet", ChronicleApplet);
