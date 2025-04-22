/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/


//import { Permission } from "azos/security";
import { Applet } from "../../applet.js";
import { html } from "../../ui.js";
import { DATA_MODE, DATA_MODE_PROP, DATA_VALUE_PROP, VALIDATE_METHOD } from "azos/types";

import "./person-blocks.js";
import "../../parts/button.js";
import "../../modal-dialog.js";
import { showMsg } from "../../msg-box.js";

export class ExampleFeatureCApplet extends Applet{

 ////Uncommenting this will require user principal to have that permission
  //static permissions = [ new Permission("test", "Master", 5), {ns: "System", name: "UserManager", level: 500}];

  get title(){ return "Feature C- Data Forms"; }

  #btnNewClick(){
    this.frmMain[DATA_MODE_PROP] = DATA_MODE.INSERT;
  }

  #btnEditClick(){
    this.frmMain[DATA_MODE_PROP] = DATA_MODE.UPDATE;
  }

  #btnSaveClick(){
    const errors = this.frmMain[VALIDATE_METHOD]({}, null, true);

    if (errors) {
       showMsg("error", "Validation Errors", "Error list: \n\n" +JSON.stringify(errors, null, 2), 3, true);
       return;
    }

    showMsg("ok", "Saved Data", "The following is obtained \n by calling [DATA_VALUE_PROP]: \n\n" +JSON.stringify(this.blockPerson[DATA_VALUE_PROP], null, 2), 3, true);

    this.frmMain[DATA_MODE_PROP] = DATA_MODE.UNSPECIFIED;
  }

  #btnCancelClick(){
    this.frmMain[DATA_MODE_PROP] = DATA_MODE.UNSPECIFIED;
  }


  render(){
   return html`
     <h2>This is Data Form (Feature C)</h2>
     <p>
     Below is a data entry form with block inside. We could also extend the form itself
     </p>

     <az-form id="frmMain" scope="this">

       <examples-person-block scope="this" id="blockPerson"> </examples-person-block>

       <az-button id="btnNew" scope="this" @click="${this.#btnNewClick}" title="New"></az-button>
       <az-button id="btnEdit" scope="this" @click="${this.#btnEditClick}" title="Edit"></az-button>
       <az-button id="btnSave" scope="this" @click="${this.#btnSaveClick}" title="Save"></az-button>
       <az-button id="btnCancel" scope="this" @click="${this.#btnCancelClick}" title="Cancel"></az-button>
     </az-form>
   `;
  }
}

window.customElements.define("examples-featurec-applet", ExampleFeatureCApplet);
