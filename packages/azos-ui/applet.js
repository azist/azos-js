/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, AzosElement } from "./ui.js";

//import { APPLET_STYLES } from "./applet.css.js";
//import * as DEFAULT_HTML from "./applet.htm.js";

/**
 * Defines a root UI element which represents an Applet - a part of application.
 * Applets run inside of arenas.
 * Applets expose "Areas" which show in arena sidebars
 */
export class Applet extends AzosElement {

  static styles = [];//APPLET_STYLES; //[ARENA_STYLES, css`p { color: blue }`];

  static properties = {
    name: {type: String},
  };

  constructor() {
    super();
    this.name = 'Somebody';
  }

  /** Returns the name of the applet displayed in the Arena title bar */
  get title() { return this.constructor.name; }

  /** Returns short description */
  get description() { return ""; }

  /** Override to prompt the user on Close, e.g. if your Applet is "dirty"/contains unsaved changes
   * you may pop-up a confirmation box. Return "true" to allow close, false to prevent it.
   * The method is called by arena before evicting this applet and replacing it with a new one
   */
  closeQuery(){
    return true;
  }


  onClick(){
    //alert("Ura!!!");
    this.arena.name+="a";
    //this.arena.requestUpdate();
  }


  render() {
    return html` applet
     <button @click="${this.onClick}"> Click me </button>
    `;
  }//render

}//Applet

window.customElements.define("az-applet", Applet);
