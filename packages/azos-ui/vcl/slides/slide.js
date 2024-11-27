import { Block } from "../../blocks";
import { html } from "../../ui";

export class Slide extends Block {
  static properties = {
    slot: { type: String, reflect: true },
  }

  get slideDeck() { return this.parentNode; }

  renderControl() {
    return html`<slot></slot>`;
  }
}
