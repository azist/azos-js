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
  padding: 50px 0;
  border-bottom: 1px dotted black;
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

<div class="h-strip">
  <az-button id="btn4" title="Huge" @click="${this.#onPressMe}" rank="huge"></az-button>
  <az-button id="btn5" title="Large" @click="${this.#onPressMe}" rank="large"></az-button>
  <az-button id="btn6" title="Normal" @click="${this.#onPressMe}" rank="normal"></az-button>
  <az-button id="btn7" title="Medium" @click="${this.#onPressMe}" rank="medium"></az-button>
  <az-button id="btn8" title="Small" @click="${this.#onPressMe}" rank="small"></az-button>
  <az-button id="btn9" title="Tiny" @click="${this.#onPressMe}" rank="tiny"></az-button>
</div>

<div class="h-strip">
  <az-button id="btn10" title="Ok" @click="${this.#onPressMe}" status="ok"></az-button>
  <az-button id="btn11" title="Cancel" @click="${this.#onPressMe}" status="error"></az-button>
  <az-button id="btn12" title="Error Details..." @click="${this.#onPressMe}" status="alert"></az-button>
</div>

<div class="h-strip">
  <az-text id="text1" title="Name" value="Borland" style="width: 70ch"></az-text>
  <az-text id="text2" title="Zip Code" value="48911"></az-text>
  <az-text id="password" itemtype="pass" title="Password" value="48911"></az-text>
  <az-text id="date" itemtype="date" title="Date" value="2000-01-01"></az-text>
</div>

<div class="h-strip">
  <az-text id="text3" title="Huge" value="W_i\`@." rank="huge"></az-text>
  <az-text id="text4" title="Large" value="W_i\`@." rank="large"></az-text>
  <az-text id="text5" title="Normal" value="W_i\`@." rank="normal"></az-text>
  <az-text id="text6" title="Medium" value="W_i\`@." rank="medium"></az-text>
  <az-text id="text7" title="Small" value="W_i\`@." rank="small"></az-text>
  <az-text id="text8" title="Tiny" value="W_i\`@." rank="tiny"></az-text>
</div>

<div class="h-strip">
  <az-text id="text9" title="Huge" value="W_i\`@." rank="huge" message="Field value is required"></az-text>
  <az-text id="text10" title="Large" value="W_i\`@." rank="large" message="Field value is required"></az-text>
  <az-text id="text11" title="Normal" value="W_i\`@." rank="normal" message="Field value is required"></az-text>
  <az-text id="text12" title="Medium" value="W_i\`@." rank="medium" message="Field value is required"></az-text>
  <az-text id="text13" title="Small" value="W_i\`@." rank="small" message="Field value is required"></az-text>
  <az-text id="text14" title="Tiny" value="W_i\`@." rank="tiny" message="Field value is required"></az-text>
</div>

<div class="h-strip">
  <az-text id="text15" itemType="multiline" resize="none" title="Huge" value="W_i\`@." rank="huge" message="Field value is required"></az-text>
  <az-text id="text16" itemType="multiline" resize="horizontal" title="Large" value="W_i\`@." rank="large" message="Field value is required"></az-text>
  <az-text id="text17" itemType="multiline" resize="vertical" title="Normal" value="W_i\`@." rank="normal" message="Field value is required"></az-text>
  <az-text id="text18" itemType="multiline" title="Medium" value="W_i\`@." rank="medium" message="Field value is required"></az-text>
  <az-text id="text19" itemType="multiline" title="Small" value="W_i\`@." rank="small" message="Field value is required"></az-text>
  <az-text id="text20" itemType="multiline" title="Tiny" value="W_i\`@." rank="tiny" message="Field value is required"></az-text>
</div>

<div class="h-strip">
    <az-select id="select0" title="Huge Select" rank="huge">
      <option value="One" title="One"></option>
      <option value="Two" title="2222"></option>
      <option value="Three" title="Three"</option>
      <option value="Four" title="And this is a long option. A very long option that has a large amount of text."></option>
    </az-select>
    <az-select id="select1" title="Large Select" rank="large">
      <option value="One" title="One"></option>
      <option value="Two" title="2222"></option>
      <option value="Three" title="Three"</option>
      <option value="Four" title="And this is a long option. A very long option that has a large amount of text."></option>
    </az-select>
    <az-select id="select2" title="Normal Select" rank="Normal">
      <option value="One" title="One"></option>
      <option value="Two" title="2222"></option>
      <option value="Three" title="Three"</option>
      <option value="Four" title="And this is a long option. A very long option that has a large amount of text."></option>
    </az-select>
    <az-select id="select3" title="Medium Select" rank="medium">
      <option value="One" title="One"></option>
      <option value="Two" title="2222"></option>
      <option value="Three" title="Three"</option>
      <option value="Four" title="And this is a long option. A very long option that has a large amount of text."></option>
    </az-select>
    <az-select id="select4" title="Small Select" rank="small">
      <option value="One" title="One"></option>
      <option value="Two" title="2222"></option>
      <option value="Three" title="Three"</option>
      <option value="Four" title="And this is a long option. A very long option that has a large amount of text."></option>
    </az-select>
    <az-select id="select5" title="Tiny Select" rank="tiny">
      <option value="One" title="One"></option>
      <option value="Two" title="2222"></option>
      <option value="Three" title="Three"</option>
      <option value="Four" title="And this is a long option. A very long option that has a large amount of text."></option>
    </az-select>
</div>

<div class="h-strip">
    <az-check id="check0" title="Huge Checkbox" rank="1"></az-check>
    <az-check id="check1" title="Large Checkbox" rank="2"></az-check>
    <az-check id="check2" title="Normal Checkbox" rank="3"></az-check>
    <az-check id="check3" title="Medium Checkbox" rank="4"></az-check>
    <az-check id="check4" title="Small Checkbox" rank="5"></az-check>
    <az-check id="check5" title="Tiny Checkbox" rank="tiny"></az-check>
</div>

<div class="h-strip">
    <az-check id="check6" title="Huge Checkbox" rank="1" titleposition="mid-right" titlewidth="75"></az-check>
    <az-check id="check7" title="Large Checkbox" rank="2" titleposition="mid-right" titlewidth="75"></az-check>
    <az-check id="check8" title="Normal Checkbox" rank="3" titleposition="mid-right" titlewidth="75"></az-check>
    <az-check id="check9" title="Medium Checkbox" rank="4" titleposition="mid-right" titlewidth="75"></az-check>
    <az-check id="check10" title="Small Checkbox" rank="5" titleposition="mid-right" titlewidth="75"></az-check>
    <az-check id="check11" title="Tiny Checkbox" rank="tiny" titleposition="mid-right" titlewidth="75"></az-check>
</div>

<div class="h-strip">
    <az-check id="switch0" title="Huge Switch" itemtype="switch" rank="1"></az-check>
    <az-check id="switch1" title="Large Switch" itemtype="switch" rank="2"></az-check>
    <az-check id="switch2" title="Normal Switch" itemtype="switch" rank="3"></az-check>
    <az-check id="switch3" title="Medium Switch" itemtype="switch" rank="4"></az-check>
    <az-check id="switch4" title="Small Switch" itemtype="switch" rank="5"></az-check>
    <az-check id="switch5" title="Tiny Switch" itemtype="switch" rank="tiny"></az-check>
</div>

<div class="h-strip">
    <az-check id="switch6" title="Huge Switch" itemtype="switch" rank="1" titleposition="mid-right" titlewidth="75"></az-check>
    <az-check id="switch7" title="Large Switch" itemtype="switch" rank="2" titleposition="mid-right" titlewidth="75"></az-check>
    <az-check id="switch8" title="Normal Switch" itemtype="switch" rank="3" titleposition="mid-right" titlewidth="75"></az-check>
    <az-check id="switch9" title="Medium Switch" itemtype="switch" rank="4" titleposition="mid-right" titlewidth="75"></az-check>
    <az-check id="switch10" title="Small Switch" itemtype="switch" rank="5" titleposition="mid-right" titlewidth="75"></az-check>
    <az-check id="switch11" title="Tiny Switch" itemtype="switch" rank="tiny" titleposition="mid-right" titlewidth="75"></az-check>
</div>

<div class="h-strip">
    <az-radio-group id="radios0" value="" title="Huge Group of radios" rank="1">
      <item title="Option 1" value="v1"></item>
      <item title="Option 2" value="v2"></item>
      <item title="Another" value="v3"></item>
      <item title="Snake Number Four" value="v4"></item>
    </az-radio-group>
    <az-radio-group id="radios1" value="" title="Large Group of radios" rank="2">
      <item title="Option 1" value="v1"></item>
      <item title="Option 2" value="v2"></item>
      <item title="Another" value="v3"></item>
      <item title="Snake Number Four" value="v4"></item>
    </az-radio-group>
    <az-radio-group id="radios2" value="" title="Normal Group of radios" rank="3">
      <item title="Option 1" value="v1"></item>
      <item title="Option 2" value="v2"></item>
      <item title="Another" value="v3"></item>
      <item title="Snake Number Four" value="v4"></item>
    </az-radio-group>
    <az-radio-group id="radios3" value="" title="Medium Group of radios" rank="4">
      <item title="Option 1" value="v1"></item>
      <item title="Option 2" value="v2"></item>
      <item title="Another" value="v3"></item>
      <item title="Snake Number Four" value="v4"></item>
    </az-radio-group>
    <az-radio-group id="radios4" value="" title="Small Group of radios" rank="5">
      <item title="Option 1" value="v1"></item>
      <item title="Option 2" value="v2"></item>
      <item title="Another" value="v3"></item>
      <item title="Snake Number Four" value="v4"></item>
    </az-radio-group>
    <az-radio-group id="radios5" value="" title="Tiny Group of radios" rank="6">
      <item title="Option 1" value="v1"></item>
      <item title="Option 2" value="v2"></item>
      <item title="Another" value="v3"></item>
      <item title="Snake Number Four" value="v4"></item>
    </az-radio-group>
</div>

<div class="h-strip">
    <az-radio-group id="radios0" itemtype="switch" value="" title="Huge Group of radios" rank="1">
      <item title="Option 1" value="v1"></item>
      <item title="Option 2" value="v2"></item>
      <item title="Another" value="v3"></item>
      <item title="Snake Number Four" value="v4"></item>
    </az-radio-group>
    <az-radio-group id="radios1" itemtype="switch" value="" title="Large Group of radios" rank="2">
      <item title="Option 1" value="v1"></item>
      <item title="Option 2" value="v2"></item>
      <item title="Another" value="v3"></item>
      <item title="Snake Number Four" value="v4"></item>
    </az-radio-group>
    <az-radio-group id="radios2" itemtype="switch" value="" title="Normal Group of radios" rank="3">
      <item title="Option 1" value="v1"></item>
      <item title="Option 2" value="v2"></item>
      <item title="Another" value="v3"></item>
      <item title="Snake Number Four" value="v4"></item>
    </az-radio-group>
    <az-radio-group id="radios3" itemtype="switch" value="" title="Medium Group of radios" rank="4">
      <item title="Option 1" value="v1"></item>
      <item title="Option 2" value="v2"></item>
      <item title="Another" value="v3"></item>
      <item title="Snake Number Four" value="v4"></item>
    </az-radio-group>
    <az-radio-group id="radios4" itemtype="switch" value="" title="Small Group of radios" rank="5">
      <item title="Option 1" value="v1"></item>
      <item title="Option 2" value="v2"></item>
      <item title="Another" value="v3"></item>
      <item title="Snake Number Four" value="v4"></item>
    </az-radio-group>
    <az-radio-group id="radios5" itemtype="switch" value="" title="Tiny Group of radios" rank="6">
      <item title="Option 1" value="v1"></item>
      <item title="Option 2" value="v2"></item>
      <item title="Another" value="v3"></item>
      <item title="Snake Number Four" value="v4"></item>
    </az-radio-group>
</div>

    `;
  }//render

}//XyzApplet2

window.customElements.define("xyz-applet2", XyzApplet2);
