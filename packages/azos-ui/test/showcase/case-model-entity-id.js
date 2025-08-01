/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, UiInputValue } from "../../ui.js";
import { CaseBase } from "./case-base.js";
import "../../bit.js";
import "../../../azos-ui/models/entity-id-bit.js";
import { showMsg } from "../../msg-box.js";
import { DATA_VALUE_PROP, VALIDATE_METHOD } from "azos/types";

export class CaseEntityId extends CaseBase {
 #btnGetClick(){
    showMsg("ok", "EntityID Data", "The following is obtained \n by calling [DATA_VALUE_PROP]: \n\n"  +this.bitEntityId[DATA_VALUE_PROP], 3, true);
  }

  #btnGetListClick(){
    showMsg("ok", "EntityID List Data", "The following is obtained \n by calling [DATA_VALUE_PROP]: \n\n" + JSON.stringify(this.bitEntityIdList[DATA_VALUE_PROP], null, 2), 3, true);
  }

  #btnSetClick(){
    this.bitEntityId[DATA_VALUE_PROP] = new UiInputValue("fda.zxcv@asdf::zxcv");
  }
  
  #btnValidateClick(){
    this.bitEntityId[VALIDATE_METHOD](null, "", true);
  }

  renderControl() {
    return html`
    <h2> Entity ID Bit </h2>
    <p>
     This is an example of the Entity ID Bit component. 
     This is a common element across many different system types, 
     there will be various different implementations across more complex objects. 
    </p>
    <az-button id="btnGet" scope="this" @click="${this.#btnGetClick}" title="Get EntityID Data"></az-button>
    <az-button id="btnSet" scope="this" @click="${this.#btnSetClick}" title="Set EntityID Data"></az-button>
    <az-button id="btnValidate" scope="this" @click="${this.#btnValidateClick}" title="Validate Schedule Data"></az-button>

    <az-entity-id-bit
    id="bitEntityId"
    scope="this"
    class="span1"
    title="Entity ID Bit"
    ></az-entity-id-bit>

    <az-entity-id-bit-list
    id="bitEntityIdList"
    scope="this"
    class="span1"
    title="Entity ID Bit List"
    ></az-entity-id-bit-list>
    `;
  }
}

window.customElements.define("az-case-model-entity-id", CaseEntityId);