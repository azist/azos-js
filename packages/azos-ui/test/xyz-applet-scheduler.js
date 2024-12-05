/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, css } from "../ui.js";
import { Applet } from "../applet.js";
import "../modal-dialog.js";
import "../parts/button.js";
import "./xyz-dialog.js";
import "../vcl/time/timeline.js";


//import { APPLET_STYLES } from "./applet.css.js";
//import * as DEFAULT_HTML from "./applet.htm.js";

/**
 * Defines a root UI element which represents an Applet - a part of application.
 * Applets run inside of arenas. Arena is akin to a "desktop" while applets are akin to "applications" running in such desktop
 */
export class XyzAppletScheduler extends Applet {

  static styles = [css`
:host { display: block; padding: 1ch 2ch; }

xaz-button {
  border:1px solid red;
}

xaz-text {
  border: 1px solid red;
}

.h-strip {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
  flex-wrap: wrap;
}

  `];

  static properties = {
    name: { type: String },
  };

  constructor() { super(); }

  get title() { return `Weekly Scheduling Control` }

  render() {
    return html`
<az-weekly-scheduler></az-weekly-scheduler>
    `;
  }//render

}//XyzAppletScheduler

window.customElements.define("xyz-applet-scheduler", XyzAppletScheduler);
