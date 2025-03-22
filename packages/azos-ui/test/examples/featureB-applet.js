import { Applet } from "../../applet";
import { html } from "../../ui";


export class ExampleFeatureBApplet extends Applet{

  get title(){ return "Feature B"; }

  render(){
   return html`
     This is feature B
   `;
  }
}

window.customElements.define("examples-home-applet", ExampleFeatureBApplet);
