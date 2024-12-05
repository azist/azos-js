/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, css } from "../ui.js";
import { Applet } from "../applet.js";
import { CLOSE_QUERY_METHOD } from "azos/types";
import { prompt } from "../ok-cancel-modal.js";

import "./showcase2.js";

//import { APPLET_STYLES } from "./applet.css.js";
//import * as DEFAULT_HTML from "./applet.htm.js";

/**
 * Defines a root UI element which represents an Applet - a part of application.
 * Applets run inside of arenas. Arena is akin to a "desktop" while applets are akin to "applications" running in such desktop
 */
export class XyzApplet2 extends Applet {

  static styles = css`
:host{ display: block; padding: 1ch 2ch; }
  `;

  static properties = {};

  constructor() { super(); }

  async [CLOSE_QUERY_METHOD]() {
    return await prompt();
  }

  get title() { return `New XYZ Applet` }

  render() {
    return html`
  <az-showcase2></az-showcase2>
    `;
  }//render

}//XyzApplet2

window.customElements.define("xyz-applet2", XyzApplet2);
