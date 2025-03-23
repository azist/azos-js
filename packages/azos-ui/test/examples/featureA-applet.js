import { Applet } from "../../applet";
import { html } from "../../ui";
import "../../parts/check-field";
import { CLOSE_QUERY_METHOD, DIRTY_PROP } from "azos/types";


export class ExampleFeatureAApplet extends Applet{

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

  render(){
   return html`
     THis is feature A
     <az-check id="chkDirty" scope="this" title="Dirty"> </az-check>
   `;
  }
}

window.customElements.define("examples-featurea-applet", ExampleFeatureAApplet);
