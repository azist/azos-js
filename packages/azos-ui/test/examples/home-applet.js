import { Applet } from "../../applet";
import { html } from "../../ui";


export class ExampleHomeApplet extends Applet{

  get title(){ return "Azos Examples"; }

  render(){
   return html`
     Examples home applet content
   `;
  }
}

window.customElements.define("examples-home-applet", ExampleHomeApplet);
