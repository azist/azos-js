import { html } from "../../ui.js";
import "../../bit.js";

export class LatLngBit extends Bit {
  renderControl() {
    return html`
      <az-text
      
      ></az-text>
    `;
  }
}

window.customElements.define("az-lat-lng-bit", LatLngBit)