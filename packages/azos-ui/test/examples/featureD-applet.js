/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/


//import { Permission } from "azos/security";
import { Applet } from "../../applet.js";
import { css, html } from "../../ui.js";

import "./person-blocks.js";
import "../../parts/button.js";
import "../../modal-dialog.js";
import "../../crud-form.js";

export class ExampleFeatureDApplet extends Applet{

 ////Uncommenting this will require user principal to have that permission
  //static permissions = [ new Permission("test", "Master", 5), {ns: "System", name: "UserManager", level: 500}];

  static styles = css`:host{ padding: 1ch 2ch; display: block; }`;

  get title(){ return "Feature D - CRUD Data Forms"; }


  async #handleSaveAsync(frm){
    alert("SAVING FORM");
  }

  render(){
   return html`
     <az-crud-form id="frmMain" scope="this" toolbar="above" .saveAsyncHandler=${this.#handleSaveAsync} .data=${{person: { LastName: "Camefrom", FirstName: "Server" }}} >

       <examples-person-block scope="this" id="blockPerson" name="person"> </examples-person-block>

     </az-crud-form>
   `;
  }
}

window.customElements.define("examples-featured-applet", ExampleFeatureDApplet);
