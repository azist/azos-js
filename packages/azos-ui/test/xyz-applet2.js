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
import "./showcase.js";
import "./showcase2.js";
import "../vcl/time/timeline.js";
import { toast } from "../toast.js";


//import { APPLET_STYLES } from "./applet.css.js";
//import * as DEFAULT_HTML from "./applet.htm.js";

/**
 * Defines a root UI element which represents an Applet - a part of application.
 * Applets run inside of arenas. Arena is akin to a "desktop" while applets are akin to "applications" running in such desktop
 */
export class XyzApplet2 extends Applet {

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

  constructor() {
    super();
    this.name = 'Somebody2Love';
  }

  #onPressMe(e) {
    toast(e.target.id);
  }

  render() {
    return html`
<div class="h-strip">
  <az-button id="btn1" title="Press me" @click="${this.#onPressMe}"></az-button>
  <az-button id="btn2" title="Press me harder" @click="${this.#onPressMe}"></az-button>
  <az-button id="btn3" title="Press me hardest" @click="${this.#onPressMe}"></az-button>
</div>

<br><br>

<div class="h-strip">
  <az-button id="btn4" title="Huge" @click="${this.#onPressMe}" rank="huge"></az-button>
  <az-button id="btn5" title="Large" @click="${this.#onPressMe}" rank="large"></az-button>
  <az-button id="btn6" title="Normal" @click="${this.#onPressMe}" rank="normal"></az-button>
  <az-button id="btn7" title="Medium" @click="${this.#onPressMe}" rank="medium"></az-button>
  <az-button id="btn8" title="Small" @click="${this.#onPressMe}" rank="small"></az-button>
  <az-button id="btn9" title="Tiny" @click="${this.#onPressMe}" rank="tiny"></az-button>
</div>

<br><br>

<div class="h-strip">
  <az-button id="btn10" title="Ok" @click="${this.#onPressMe}" status="ok"></az-button>
  <az-button id="btn11" title="Cancel" @click="${this.#onPressMe}" status="error"></az-button>
  <az-button id="btn12" title="Error Details..." @click="${this.#onPressMe}" status="alert"></az-button>
</div>

<br><hr><br>

<div class="h-strip">
  <az-text id="text1" title="Name" value="Borland" style="width: 70ch"></az-text>
  <az-text id="text2" title="Zip Code" value="48911"></az-text>
</div>

<br><br>

<div class="h-strip">
  <az-text id="text3" title="Huge" value="W_i\`@." rank="huge"></az-text>
  <az-text id="text4" title="Large" value="W_i\`@." rank="large"></az-text>
  <az-text id="text5" title="Normal" value="W_i\`@." rank="normal"></az-text>
  <az-text id="text6" title="Medium" value="W_i\`@." rank="medium"></az-text>
  <az-text id="text7" title="Small" value="W_i\`@." rank="small"></az-text>
  <az-text id="text8" title="Tiny" value="W_i\`@." rank="tiny"></az-text>
</div>

<br><br>

<div class="h-strip">
  <az-text id="text9" title="Huge" value="W_i\`@." rank="huge" message="Field value is required"></az-text>
  <az-text id="text10" title="Large" value="W_i\`@." rank="large" message="Field value is required"></az-text>
  <az-text id="text11" title="Normal" value="W_i\`@." rank="normal" message="Field value is required"></az-text>
  <az-text id="text12" title="Medium" value="W_i\`@." rank="medium" message="Field value is required"></az-text>
  <az-text id="text13" title="Small" value="W_i\`@." rank="small" message="Field value is required"></az-text>
  <az-text id="text14" title="Tiny" value="W_i\`@." rank="tiny" message="Field value is required"></az-text>
</div>

<br><hr><br>

<div class="h-strip">
  <az-text id="text15" itemType="multiline" resize="none" title="Huge" value="W_i\`@." rank="huge" message="Field value is required"></az-text>
  <az-text id="text16" itemType="multiline" resize="horizontal" title="Large" value="W_i\`@." rank="large" message="Field value is required"></az-text>
  <az-text id="text17" itemType="multiline" resize="vertical" title="Normal" value="W_i\`@." rank="normal" message="Field value is required"></az-text>
  <az-text id="text18" itemType="multiline" title="Medium" value="W_i\`@." rank="medium" message="Field value is required"></az-text>
  <az-text id="text19" itemType="multiline" title="Small" value="W_i\`@." rank="small" message="Field value is required"></az-text>
  <az-text id="text20" itemType="multiline" title="Tiny" value="W_i\`@." rank="tiny" message="Field value is required"></az-text>
</div>

<az-text id="text16" resize="none" style="width: 50vw;" itemType="multiline" title="Large" value="W_i\`@." rank="large" message="Field value is required"></az-text>

    `;
  }//render

}//XyzApplet2

window.customElements.define("xyz-applet2", XyzApplet2);
