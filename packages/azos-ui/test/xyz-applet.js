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
import "../vcl/time/timeline.js";
import { AdlibApplet } from "../vcl/adlib/adlib-applet.js";


//import { APPLET_STYLES } from "./applet.css.js";
//import * as DEFAULT_HTML from "./applet.htm.js";

/**
 * Defines a root UI element which represents an Applet - a part of application.
 * Applets run inside of arenas. Arena is akin to a "desktop" while applets are akin to "applications" running in such desktop
 */
export class XyzApplet extends Applet {

  static styles = [css`:host{ display: block; padding: 1ch 2ch; }`];

  static properties = {
    name: {type: String},
  };

  constructor() {
    super();
    this.name = 'Somebody';
  }

  #cmdAbout = new Command(this, {
    uri: "Test.Cmd1",
    //active: false,
    title: "About",
    handler: function(){ alert("Command 1 activated"); }
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
    handler: function(){ alert("Command 2 activated"); }
  });

  connectedCallback(){
    super.connectedCallback();
    // FIXME: This automatically navs to Adlib page.
    // setTimeout(()=>this.btnAdlibClick(), 100);
    this.arena.installToolbarCommands([this.#cmdAbout, this.#cmdHelp]);
  }

  async closeQuery(){
    return true;//await confirm("We will close the form. Yes/no?")
  }


  #x = 0;
  get title(){ return `XYZ Applet / x = ${this.#x}`}

  onClick1(){
    //alert("Ura!!!");
    //this.arena.name+="a";
    this.#x++;
    this.arena.requestUpdate();

    this.#cmdAbout.title += "a";
    this.arena.updateToolbar();
  }

  onClick2(){
    this.arena.uninstallToolbarCommands([this.#cmdHelp]);
  }

  onClick3(){
    this.arena.appletClose();
  }

  async onClick4(){
    //const dlgTest1 = this.dlgTest1;// this.shadowRoot.getElementById("dlgTest1");
    const dr = (await this.dlgTest1.show()).modalResult;
    console.info("Dialog result is: " + dr);
  }

  async onClick5(){
    const dlgXyz = this.shadowRoot.getElementById("dlgXyz");
    const dr = (await dlgXyz.show()).modalResult;
    console.info("Small Dialog result is: " + dr);
  }

  async onClick6(){
    //this.$("btnSave").isHidden = !this.$("btnSave").isHidden;
    //this.$("btnSave").isVisible = !this.$("btnSave").isVisible;
    //console.dir(this);
    this.btnSave.isVisible = !this.btnSave.isVisible;
  }

  async onClickTimeline(){
    const dr = (await this.dlgTimeline.show()).modalResult;
    console.info(`Showing ${dr} dialog`);
  }

  async btnChronicleClick(){
    this.arena.appletOpen(ChronicleApplet);
  }

  async btnAdlibClick(){
    this.arena.appletOpen(AdlibApplet);
  }



  render() {
    return html` applet
     <button @click="${this.onClick1}"> Click me </button>
     <button @click="${this.onClick2}"> Click me </button>
     <button @click="${this.onClick3}"> Close This Applet </button>
     <button @click="${this.onClick4}"> Open Dialog Box </button>
     <button @click="${this.onClick5}"> Did you wash your hands? </button>
     <button @click="${this.onClick6}"> btnSave.isVisible </button>

     <az-button id="btnChronicle" scope="this" title="Chronicle" @click="${this.btnChronicleClick}"> </az-button>
     <az-button id="btnAdlib" scope="this" title="Adlib" @click="${this.btnAdlibClick}"> </az-button>
     <az-button id="btnSave"    scope="this" title="Save" status="ok"> </az-button>
     <az-button id="btnCancel"  scope="this" title="Cancel" status="warning"> </az-button>
     <az-button id="btnDetails" scope="this" title="Details..."> </az-button>


     <az-button id="btnTimeline" scope="this" title="Git yer fuchurr 4told!" status="info" @click="${this.onClickTimeline}"></az-button>



     <az-modal-dialog id="dlgTest1" scope="self" title="My Dialog Box for Users" rank="normal" status="info">
      <style>
        h1{margin: 6px;}
        h2{margin: 4px;}
      </style>
      <div slot="body">
        <az-test-showcase></az-test-showcase>
        Long line
        <button @click="${this.onClick5}"> HOOK HARD!!! </button>
        <h2>This is header two</h2>
      </div>
     </az-modal-dialog>

     <xyz-dialog id="dlgXyz" title="Confirm the TOad" rank="medium">

       I want to kiss my own ass if this works!!
       <button>Call Gurariy Hard!!</button>

     </xyz-dialog>

     <az-modal-dialog status="error" id="dlgTimeline" scope="self" title="Timeline tester">
      <div slot="body">
        <az-flow-container status="info" currentStepIndex="1">
          <az-timeline status="info" currentStepIndex="1">
            <az-timeline-step title="start"></az-timeline-step>
            <az-timeline-step title="outline"></az-timeline-step>
            <az-timeline-step title="rough draft"></az-timeline-step>
            <az-timeline-step title="proofread"></az-timeline-step>
            <az-timeline-step title="revise"></az-timeline-step>
            <az-timeline-step title="finalize"></az-timeline-step>
            <az-timeline-step title="publish"></az-timeline-step>
            <az-timeline-step title="finish"></az-timeline-step>
          </az-timeline>
          <az-form-container>
            <az-form>
              <h1>Start</h1>
              <p>Starting Form screen/panel (stepIndex 0)</p>
            </az-form>
            <az-form>
              <h1>Outline</h1>
              <p>Form screen/panel for 2. Outline (stepIndex 1)</p>
            </az-form>
            <az-form>
              <h1>Rough Draft</h1>
              <p>Form screen/panel for 3. Rough Draft (stepIndex 2)</p>
            </az-form>
            <az-form>
              <h1>Proofread</h1>
              <p>Form screen/panel for 4. Proofread (stepIndex 3)</p>
            </az-form>
            <az-form>
              <h1>Revise</h1>
              <p>Form screen/panel for 5. Revise (stepIndex 4)</p>
            </az-form>
            <az-form>
              <h1>Finalize</h1>
              <p>Form screen/panel for 6. Finalize (stepIndex 5)</p>
            </az-form>
            <az-form>
              <h1>Publish</h1>
              <p>Form screen/panel for 7. Publish (stepIndex 6)</p>
            </az-form>
            <az-form>
              <h1>Finish</h1>
              <p>Final Form screen/panel (stepIndex 7)</p>
            </az-form>
          </az-form-container>
        </az-flow-container>
      </div>
     </az-modal-dialog>

     <az-test-showcase></az-test-showcase>

    `;
  }//render

}//XyzApplet

window.customElements.define("xyz-applet", XyzApplet);
