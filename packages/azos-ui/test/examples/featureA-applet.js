/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Applet } from "../../applet";
import { html } from "../../ui";
import "../../parts/check-field";
import { CLOSE_QUERY_METHOD, DIRTY_PROP } from "azos/types";
import { MruLogic } from "../../mru";


export class ExampleFeatureAApplet extends Applet{

 #ref = {mru: MruLogic};


  get title(){ return "Feature A"; }

  get [DIRTY_PROP](){
    return this.chkDirty.value;
  }

  [CLOSE_QUERY_METHOD](){
    if (this[DIRTY_PROP]){
      console.warn("Prevented by CLOSE QUERY");
      return false;
    }

    return true;
  }

  connectedCallback(){
    super.connectedCallback();
    console.warn("ExampleFeatureAApplet CONNECTED CALLBACK HAPPENED JUST NOW");
    this.link(this.#ref);
  }

  #btnAddClick(){
    this.#ref.mru.putMruListItem(this, "files", {msg: this.tbText.value}, (a, b) => a.msg === b.msg);
    this.requestUpdate();
  }

  #btnClearClick(){
    this.#ref.mru.clearAll(this, "files");
    this.requestUpdate();
  }

  render(){
   var items =  this.#ref.mru.getMruList(this, "files");
   return html`
     This is feature A applet
     <pre>
        AAAA
       A    A
       AAAAAA
       A    A
       A    A
     </pre>
     <p>
     <az-check id="chkDirty" scope="this" title="Dirty"> </az-check>
     </p>

     Here is a list of most recently used items (APPLET A): <br>
      ${JSON.stringify(items)}

      <az-text id="tbText" scope="this" title="Add MRU item"> </az-text>
      <az-button @click="${this.#btnAddClick}" title="Add MRU item"> </az-button>
      <az-button @click="${this.#btnClearClick}" title="Clear items"> </az-button>
   `;
  }
}

window.customElements.define("examples-featurea-applet", ExampleFeatureAApplet);
