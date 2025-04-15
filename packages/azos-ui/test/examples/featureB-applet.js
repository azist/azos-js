//import { Permission } from "azos/security";
import { Applet } from "../../applet.js";
import { html } from "../../ui.js";

export class ExampleFeatureBApplet extends Applet{

 ////Uncommenting this will require user principal to have that permission
  //static permissions = [ new Permission("test", "Master", 5), {ns: "System", name: "UserManager", level: 500}];

  get title(){ return "Feature B"; }

  render(){
   return html`
     This is feature B
   `;
  }
}

window.customElements.define("examples-featureb-applet", ExampleFeatureBApplet);
