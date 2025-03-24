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
   `;
  }
}

window.customElements.define("examples-featurea-applet", ExampleFeatureAApplet);
