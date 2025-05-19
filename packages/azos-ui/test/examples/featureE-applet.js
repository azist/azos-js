/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/


//import { Permission } from "azos/security";
import { Applet } from "../../applet.js";
import { css, html } from "../../ui.js";
import { Command } from "../../cmd.js";

import "./person-blocks.js";
import "../../parts/button.js";
import "../../modal-dialog.js";
import "../../crud-form.js";
import "../../modal-dialog.js";
import { showMsg } from "../../msg-box.js";
//import { Permission } from "azos/security";

let COUNTER = 0;


export class ExampleFeatureEApplet extends Applet{

 ////Uncommenting this will require user principal to have that permission
  //static permissions = [ new Permission("test", "Master", 5), {ns: "System", name: "UserManager", level: 500}];

  static styles = css`:host{ padding: 1ch 2ch; display: block; }`;

  get title(){ return "Feature E - CRUD Data with Bits"; }


  #cmdModal = new Command(this, {
    icon: "svg://azos.ico.openInNew",
    handler: function(arena, cmd){
      cmd.ctx.dlgPerson.show();
    }
  });


  connectedCallback(){
    super.connectedCallback();
    this.arena.installToolbarCommands([this.#cmdModal]);
  }

  async #handleLoadAsync(frm, isRefresh){
    console.log(`LOADING DATA.... ${COUNTER}  Refresh: ${isRefresh}`);
    console.dir(frm);
    return {
      first: {LastName: `Abramovich_${COUNTER}`, FirstName: `Snaker_${10 * COUNTER++}`, OtherStatuses: [ {Status: "8", Description: "Eats mice"} ]},
      second: {LastName: `Bramovich_${COUNTER}`, FirstName: `Baker_${10 * COUNTER++}`, OtherStatuses: [ {Status: "9", Description: "Eats lard"} ]}
    };
  }

  async #handleSaveAsync(frm){
    console.dir(frm);
    showMsg("ok", "Saved Data", "The following is obtained \n by calling [DATA_VALUE_PROP/blockData]: \n\n" + JSON.stringify(frm.blockData, null, 2), 3, true);
  }

  render(){
   return html`
    <az-crud-form id="frmMain" scope="this" toolbar="above"
      .loadAsyncHandler=${this.#handleLoadAsync}
      .saveAsyncHandler=${this.#handleSaveAsync}
      .data=${{first: { LastName: "Camefrom", FirstName: "Server" }, second: { LastName: "Stackman", FirstName: "Queue" }}}
      @datachange=${(e) => console.log(`CRUD FORM @datachange EVENT: ${e.detail.sender.name} = ${e.detail.sender.value}`)}
      >

<az-bit id="bitFirst" scope="this">
<az-bit id="bitFirst" scope="this">
<az-bit id="bitFirst" scope="this">

      <az-bit id="bitFirst" scope="this">
        <examples-person-block scope="this" id="blockPerson" name="first" @datachange=${(e) => console.log(`INNER SLOTTED BLOCK @datachange EVENT: ${e.detail.sender.name}`)}  > </examples-person-block>
      </az-bit>
      </az-bit>
      </az-bit>
      </az-bit>

      <br>

      <az-bit id="bitSecond" scope="this">
        <examples-person-block scope="this" id="blockPerson" name="second" @datachange=${(e) => console.log(`INNER SLOTTED BLOCK @datachange EVENT: ${e.detail.sender.name}`)}  > </examples-person-block>
      </az-bit>

    </az-crud-form>


    <az-modal-dialog id="dlgPerson" scope="self" title="Person Data">
      <div slot="body">
        <az-crud-form id="frmDlg" scope="this" sticky toolbar="above" .loadAsyncHandler=${this.#handleLoadAsync} .saveAsyncHandler=${this.#handleSaveAsync} .data=${{person: { LastName: "Camefrom", FirstName: "Server" }}} >
          <examples-person-block scope="this" id="blockModalPerson" name="person"> </examples-person-block>
        </az-crud-form>
      </div>
    </az-modal-dialog>
   `;
  }
}

window.customElements.define("examples-featuree-applet", ExampleFeatureEApplet);
