/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui.js";
import { CaseBase } from "./case-base.js";
import { TextField } from "../../parts/text-field.js";
import "../../bit.js";
import { Command } from "../../cmd.js";
import { DATA_BLOCK_PROP, DATA_VALUE_PROP } from "azos/types";
import { showMsg } from "../../msg-box.js";

export class CaseBitLists extends CaseBase {

  #cmdAddFood = new Command(this, {
      icon: "svg://azos.ico.add",
    handler: function(){
      this.ctx.bitFoods.upsert("My food");
    }
  });


  #btnShowDataClick(){
    const data = this.bitFoods[DATA_VALUE_PROP];
    showMsg("ok", "List Data", "The following is obtained \n by calling [DATA_VALUE_PROP/blockData]: \n\n" + JSON.stringify(data, null, 2), 3, true);
  }


  #btnShowBlockClick(){
    const data = this.bitFoods[DATA_BLOCK_PROP].map(one => ({tag: one.tagName, val: one.value}));
    showMsg("ok", "Data block", "The following is in the DATA_BLOCK: \n\n" + JSON.stringify(data, null, 2), 3, true);
  }

  #btnSetListClick(){
    this.bitFoods[DATA_VALUE_PROP] = ["fake cake", "steak", "goat", "toad"];
  }



  renderControl() {
    return html`

<h2> UI List Bits (Collections)</h2>

<p> This is a sample content which is placed outside of bits. </p>

<az-bit id="bitAboutus" scope="this" title="About Us" description="A line describing this title">
  <p>
  About us paragraph content goes here. It is really
  slotted into the bit. You can use the az-bit tag to place
  content inside the bit. The az-bit tag is a custom element
  that is used to create a bit. And this content is placed in a default slot.
  </p>

  <p>
  Notice, that you can place any content into the bit. For example, you can surround a
  block of data fields with a bit, or surround other bits with this bit, this way you can create a hierarchical
  structure of bits.
  </p>
</az-bit>

<br>

<az-button id="btnShowBlock" scope="this" @click="${this.#btnShowBlockClick}" title="Show Block"></az-button>
<az-button id="btnShowData" scope="this" @click="${this.#btnShowDataClick}" title="Show Data"></az-button>
<az-button id="btnSetList" scope="this" @click="${this.#btnSetListClick}" title="Set List"></az-button>

<az-list-bit id="bitFoods" scope="this"
  .getSummaryDataHandler="${() => ({title: `${this.bitFoods.count} foods`, commands: [this.#cmdAddFood]})}"
  .makeOrMapElementHandler="${(bit, elmData) => bit.indexOf(elmData) >=0 ? elmData : Object.assign(new TextField(), { title: "A food", value: elmData})}"
  >

</az-list-bit>


    `;
  }
}

window.customElements.define("az-case-bit-lists", CaseBitLists);
