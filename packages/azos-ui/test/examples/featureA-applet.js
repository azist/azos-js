import { Applet } from "../../applet";
import { html } from "../../ui";


export class ExampleFeatureAApplet extends Applet{

  get title(){ return "Feature A"; }

  render(){
   return html`
     THis is feature A
   `;
  }
}

window.customElements.define("examples-home-applet", ExampleFeatureAApplet);
