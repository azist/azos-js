import { Applet } from "../../applet";
import { MruLogic } from "../../mru";
import { html } from "../../ui";


export class ExampleHomeApplet extends Applet{

  #ref = {mru: MruLogic};

  get title(){ return "Azos Examples"; }

  connectedCallback(){
    super.connectedCallback();
    console.warn("ExampleHomeApplet CONNECTED CALLBACK HAPPENED JUST NOW");
    this.link(this.#ref);
  }

  #btnAddClick(){
    this.#ref.mru.putMruListItem(this, "files", {msg: this.tbText.value}, (a, b) => a.msg === b.msg);
    this.requestUpdate();
  }

  render(){
   var items =  this.#ref.mru.getMruList(this, "files");
   return html`
     <h1>Examples home applet content</h1>

     Here is a list of most recently used items (APPLET HOME): <br>
      ${JSON.stringify(items)}

      <az-text id="tbText" scope="this" title="Add MRU item"> </az-text>
      <az-button @click="${this.#btnAddClick}" title="Add MRU item"> </az-button>
   `;
  }
}

window.customElements.define("examples-home-applet", ExampleHomeApplet);
