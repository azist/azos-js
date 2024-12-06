/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, css } from "../ui.js";
import { Applet } from "../applet.js";
import { Command } from "../cmd.js";
import { ChronicleApplet } from "../vcl/chron/chron-applet.js";
import "../modal-dialog.js";
import "../parts/button.js";
import "./xyz-dialog.js";
import "./showcase.js";
import { AdlibApplet } from "../vcl/adlib/adlib-applet.js";
import { CLOSE_QUERY_METHOD } from "azos/types";


//import { APPLET_STYLES } from "./applet.css.js";
//import * as DEFAULT_HTML from "./applet.htm.js";

/**
 * Defines a root UI element which represents an Applet - a part of application.
 * Applets run inside of arenas. Arena is akin to a "desktop" while applets are akin to "applications" running in such desktop
 *
 *
 * =======================================================================================================
 *
 *  NOTE: This iteration has gotten out of control. Each of these controls need to be separated into new
 *     components and those controls imported. This will keep logic and code out of the global showcase
 *     scope files and in the controls file where it belongs.
 *
 *     Follow the ways of XYZ Applet 2 and Showcase 2.
 *
 * =======================================================================================================
 */
export class XyzApplet extends Applet {

  static styles = css`
:host{ display: block; padding: 1ch 2ch; }

.controls{ display: flex; align-items:center; gap: 1ch; }
.controls az-button{ margin:0; }
  `;

  static properties = {
    name: { type: String },
    displayMethod: { type: Number },
  };

  constructor() {
    super();
    this.name = 'Somebody';
  }

  #cmdAbout = new Command(this, {
    uri: "Test.Cmd1",
    //active: false,
    title: "About",
    handler: function () { alert("Command 1 activated"); }
  });

  #cmdHelp = new Command(this, {
    uri: "Test.Cmd2",
    //active: false,
    title: "Help",
    icon: `<svg width="28px" height="28px" viewBox="0 0 24 24">
            <path d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z"/>
            <path d="M10 9H14L10 13H14" stroke-linejoin="round"/>
            <path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" />
          </svg>`,
    handler: function () { alert("Command 2 activated"); }
  });

  connectedCallback() {
    super.connectedCallback();
    // FIXME: This automatically navs to Adlib page.
    // setTimeout(()=>this.btnAdlibClick(), 100);
    this.arena.installToolbarCommands([this.#cmdAbout, this.#cmdHelp]);
  }

  async [CLOSE_QUERY_METHOD]() {
    return true;//await confirm("We will close the form. Yes/no?")
  }


  #x = 0;
  get title() { return `XYZ Applet / x = ${this.#x}` }

  btnUpdateArenaValues() {
    this.#x++;
    this.arena.requestUpdate();

    this.#cmdAbout.title += "a";
    this.arena.updateToolbar();
  }

  btnToggleToolbarCommandInstalled() {
    this.arena.installToolbarCommands([this.#cmdHelp]);
  }

  btnCloseApplet() {
    this.arena.appletClose();
  }

  async btnShowAdhocModal() {
    const dr = (await this.dlgTest1.show()).modalResult;
    console.info("Dialog result is: " + dr);
  }

  async btnShowMarkupModal() {
    const dlgXyz = this.shadowRoot.getElementById("dlgXyz");
    const dr = (await dlgXyz.show()).modalResult;
    console.info("Small Dialog result is: " + dr);
  }

  async btnChronicleClick() {
    this.arena.appletOpen(ChronicleApplet);
  }

  async btnAdlibClick() {
    this.arena.appletOpen(AdlibApplet);
  }



  render() {
    return html`

     <div class="controls">
      <h3>Navigate to:</h3>
      <az-button id="btnChronicle" scope="this" title="Chronicle" @click="${this.btnChronicleClick}"> </az-button>
      <az-button id="btnAdlib" scope="this" title="Adlib" @click="${this.btnAdlibClick}"> </az-button>
     </div>

     <div class="controls">
      <h3>Applet controls:</h3>

      <div><button @click="${this.btnUpdateArenaValues}"> Change Arena Values </button></div>
      <div><button @click="${this.btnToggleToolbarCommandInstalled}"> Toggle Toolbar Command </button></div>
      <div><button @click="${this.btnCloseApplet}"> Close XYZ Applet </button></div>
      <div><button @click="${this.btnShowAdhocModal}"> Open Adhoc Modal </button></div>
      <div><button @click="${this.btnShowMarkupModal}"> Open Modal in Markup </button></div>
    </div>

    <az-modal-dialog id="dlgTest1" scope="self" title="My Dialog Box for Users" rank="normal" status="info">
      <style>
        h1{margin: 6px;}
        h2{margin: 4px;}
      </style>
      <div slot="body">
      <az-test-showcase-2></az-test-showcase-2>
      <az-test-showcase></az-test-showcase>
      Long line
        <button @click="${this.btnShowMarkupModal}"> HOOK HARD!!! </button>
        <h2>This is header two</h2>
      </div>
     </az-modal-dialog>

     <xyz-dialog id="dlgXyz" title="Confirm the TOad" rank="medium">

       I want to kiss my own ass if this works!!
       <button>Call Gurariy Hard!!</button>

     </xyz-dialog>

     <az-test-showcase .displayMethod=${this.displayMethod}></az-test-showcase>

    `;
  }//render

}//XyzApplet

window.customElements.define("xyz-applet", XyzApplet);
