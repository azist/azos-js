import { AzosElement, css, html } from "../../ui";
import "../../parts/check-field.js";
import "../../parts/text-field.js";
import JSONToForm from "./json-to-form.js";

export class JsonFormTranslator extends AzosElement {

  static properties = {
    data: {
      type: Object,
      attribute: 'data',
      converter: JSON.parse
    }
  };

  static styles = css`
    fieldset{
      border: 1px solid #ccc;
      padding: 10px;
      margin: 10px 0;
    }
    legend{
      font-weight: bold;
    }
  `;

  constructor() {
    super();
    this.data = {};
  }

  render() {
    const formFields = JSONToForm(this.data);

    return html`
      <div class="form-container">
        ${formFields
        ? html`${html([formFields])}`
        : html`<p>No data available to render the form.</p>`
      }
      </div>
    `;
  }
}

customElements.define('az-json-to-form', JsonFormTranslator);
