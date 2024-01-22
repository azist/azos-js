/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
import { isSubclassOf, AzosError } from "azos/types";
import { html, AzosElement } from "./ui.js";
import { Application } from "azos/application.js";

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

  #app;
  constructor() {
    super();
    this.name = 'Somebody';
  }

  /** Must override */
  get tagName(){ return "az-applet";}

  render() {
    const app = this.#app;
    if (!app) return "";
    //---------------------------

    return html` applet `;
  }//render

}//Arena


