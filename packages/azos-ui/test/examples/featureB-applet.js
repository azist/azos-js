/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/


//import { Permission } from "azos/security";
import { Applet } from "../../applet.js";
import { html } from "../../ui.js";

import "./person-data.js";
import "../../parts/button.js";
import { DATA_VALUE_PROP, VALIDATE_METHOD } from "azos/types";

export class ExampleFeatureBApplet extends Applet{

 ////Uncommenting this will require user principal to have that permission
  //static permissions = [ new Permission("test", "Master", 5), {ns: "System", name: "UserManager", level: 500}];

  get title(){ return "Feature B"; }


  #btnGetClick(){
    console.dir(this.blockPerson[DATA_VALUE_PROP]);
  }

  #btnValidateClick(){
    console.dir(this.blockPerson[VALIDATE_METHOD]());
  }


  #btnSetClick(){
    this.blockPerson[DATA_VALUE_PROP] = {
      FirstName: "Sam",
      MiddleName: "X",
      LastName: "Popoff"
    };
  }

  render(){
   return html`
     This is feature B
     <examples-person-block scope="this" id="blockPerson"></examples-person-block>
     <az-button id="btnGet" scope="this" @click="${this.#btnGetClick}" title="Get Block Data"></az-button>
     <az-button id="btnSet" scope="this" @click="${this.#btnSetClick}" title="Fill block"></az-button>
     <az-button id="btnValidate" scope="this" @click="${this.#btnValidateClick}" title="Validate block"></az-button>
   `;
  }
}

window.customElements.define("examples-featureb-applet", ExampleFeatureBApplet);
