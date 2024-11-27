import { AzosElement } from "../../ui";
import "../../parts/text-field";

export class Repeater extends AzosElement {

  static properties = {
    /*
      items={
        {
          "id":"",
          "title":"",
          "value":""
        },{
          "id":"",
          "title":"",
          "value":""
        }
      }
    */
    items: { type: Object }
  }

  constructor() { super(); }

  render() {
    const itemList = html`${this.items.map((item) => {
      return html`
        <az-text
          id="${item.id}"
          scope="this"
          name="${item.id}"
          title="${item.title}"
          value="${item.value}"
        >
        </az-text>
      `;
    })}`;
    return html`${itemList}`;
  }
}

window.customElements.define("az-repeater", Repeater);
