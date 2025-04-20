/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/


//import { Permission } from "azos/security";
import { Applet } from "../../applet.js";
import { html } from "../../ui.js";
import { DATA_VALUE_PROP, VALIDATE_METHOD } from "azos/types";

import "./person-blocks.js";
import "../../parts/button.js";
import "../../modal-dialog.js";
import { showMsg } from "../../msg-box.js";

export class ExampleFeatureBApplet extends Applet{

 ////Uncommenting this will require user principal to have that permission
  //static permissions = [ new Permission("test", "Master", 5), {ns: "System", name: "UserManager", level: 500}];

  get title(){ return "Feature B"; }


  #btnGetClick(){
    showMsg("ok", "Person Block Data", "The following is obtained \n by calling [DATA_VALUE_PROP]: \n\n" +JSON.stringify(this.blockPerson[DATA_VALUE_PROP], null, 2), 3, true);
  }

  #btnSetClick(){
    this.blockPerson[DATA_VALUE_PROP] = {
      FirstName: "James",
      MiddleName: "L",
      LastName: "Cooper Fraud",
      Registered: false,
      Smoker: true,
      ProcessStatus: {
        Status: "Extern",
        Description: "Set externally",
        Approved: null
      },
      PayoutStatus: undefined
    };
  }

  #btnValidateClick(){
    this.blockPerson[VALIDATE_METHOD](null, "", true);
  }

  async #btnModalClick(){
    this.blockPerson2[DATA_VALUE_PROP] = this.blockPerson[DATA_VALUE_PROP];
    await this.dlgPerson.show();
    this.blockPerson[DATA_VALUE_PROP] = this.blockPerson2[DATA_VALUE_PROP];
  }

  render(){
   return html`
     <h2>This is feature B</h2>
     <p>
     There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form,
     by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of
     Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.
     </p>

     <examples-person-block scope="this" id="blockPerson"></examples-person-block>

     <az-button id="btnGet" scope="this" @click="${this.#btnGetClick}" title="Get Block Data"></az-button>
     <az-button id="btnSet" scope="this" @click="${this.#btnSetClick}" title="Set block"></az-button>
     <az-button id="btnValidate" scope="this" @click="${this.#btnValidateClick}" title="Validate block"></az-button>
     <az-button id="btnValidate" scope="this" @click="${this.#btnModalClick}" title="Show Modal"></az-button>

 <az-modal-dialog id="dlgPerson" scope="self" title="Person Data">
  <div slot="body">
    <p>
     It is a long established fact that <strong>a reader will be distracted</strong> by the readable content of a page when looking at its layout.
     The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here',
     making it look like readable English.
     </p>
     <examples-person-block scope="this" id="blockPerson2"></examples-person-block>
     <p>
     Many desktop publishing packages and web page editors now use <strong>Lorem Ipsum</strong> as their default model text,
     and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident,
     sometimes on purpose (injected humour and the like).
    </p>
    <az-button @click="${() => this.dlgPerson.close()}" title="Close" style="float: right;"></az-button>
  </div>
</az-modal-dialog>

   `;
  }
}

window.customElements.define("examples-featureb-applet", ExampleFeatureBApplet);
