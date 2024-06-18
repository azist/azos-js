/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../ui.js";
import { Applet } from "../applet.js";
import { Command } from "../cmd.js";

//import { APPLET_STYLES } from "./applet.css.js";
//import * as DEFAULT_HTML from "./applet.htm.js";

/**
 * Defines a root UI element which represents an Applet - a part of application.
 * Applets run inside of arenas.
 * Applets expose "Areas" which show in arena sidebars
 */
export class XyzApplet extends Applet {

  static styles = [];//APPLET_STYLES; //[ARENA_STYLES, css`p { color: blue }`];

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

  firstUpdated(){
    this.arena.installToolbarCommands([this.#cmdAbout, this.#cmdHelp]);
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


  render() {
    return html` applet
     <button @click="${this.onClick1}"> Click me </button>
     <button @click="${this.onClick2}"> Click me </button>
    `;
  }//render

}//XyzApplet

window.customElements.define("xyz-applet", XyzApplet);
