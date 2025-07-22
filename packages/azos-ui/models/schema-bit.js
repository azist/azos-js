import { Bit } from "azos-ui/bit";
import { html } from "azos-ui/ui";

export class SchemaBit extends Bit {
  static properties = {
    source: { type: Object }
  }

  render() {
    return this.source?.fields ? html`
      <div class="schemaBit">
        ${this.source?.attrs && this.source.attrs.length > 0 ? html`

          ${ this.source.attrs.map( attrGrp => html`
              <ul>
                ${Object.entries(attrGrp).map(([key, value]) => html`
                  <li><strong>${key}</strong>: ${value}</li>
                `)}
              </ul>
          `)}
        ` : html`<p>No attributes available</p>`}

      <az-bit id="schemaBitFields" scope="this" title="Schema Fields (${this.source?.fields?.length || 0})" status="default" rank="5">
        ${this.source?.fields ? this.source.fields.map( (field,i) => html`
          <az-bit id="schemaBit${i}" scope="this" title="${field.name}" status="default">
            <div class="schemaField">
              <ul>
                <li><strong>Name:</strong> ${field.name}</li>
                <li><strong>Order:</strong> ${field.order || 0}</li>
                <li><strong>Get Only:</strong> ${field.getOnly ? "Yes" : "No"}</li>
                <li><strong>Type:</strong> ${field.type || "Unknown"}</li>
              </ul>

              ${ field.attributes && field.attributes.length > 0 ? field.attributes.map( attr => html`

              <az-bit id="schemaFieldAttributes" scope="this" title="Attributes" status="default">
                <ul>
                  ${Object.entries(attr).map(([key, value]) => html`
                    <li><strong>${key}:</strong> ${value}</li>
                  `)}
                </ul>
              </az-bit>
              `) : html`<p>No attributes available</p>`}

            </div>
          </az-bit>
        `) : this.source?.fields === undefined ? html`<p>Loading Fields...</p>`
        : html`<li>No fields available</li>`}
      </az-bit>
    </div>` : html`<p>No schema data available</p>`;
  }
}

window.customElements.define("az-schema-bit", SchemaBit);
