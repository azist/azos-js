import { Bit } from "azos-ui/bit";
import { html, css } from "azos-ui/ui";
import { isBool } from "azos/types";

/**
 * SchemaBit is a custom bit that displays schema information
 */
export class SchemaBit extends Bit {
  static properties = {
    source: { type: Object },
    expandedOnLoad: { type: Boolean, default: true }, // whether the bit should be expanded on load, defaults to true
    titleOverride: { type: String }, // allows overriding the title - defaults to the schema name from the source.data.name
  }

  /**
   * Composite styles to render fields in a grid-like manner
   */
  static styles = [Bit.styles, css`

    .composite {
      margin: 1em;
      gap: 0.5em;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    .composite az-bit{
      width: 22ch;
      transition: 1s;
    }

    .composite az-bit:not([isexpanded]){
     transition-delay: .25s;
    }

    .composite  az-bit[isexpanded]{
      width: 100%;
    }
  `];

  _getSummaryData(){


    // pull data from the source
    const attrs = this.source?.attrs && this.source.attrs.length > 0 ? this.source.attrs[0] : {};
    const fields = this.source?.fields || [];

    // prepare description for the bit description
    const subtitle = `${fields.length ?? 0} fields${attrs.description !== attrs?.name ? `: ${attrs.description}` : ""}`;

    return {
      title: `${ this.title !== this.source?.name && this.title !== this.constructor.name ? this.title : this.source?.name}`,
      subtitle,
      commands: []
    };
  }

  renderDetailContent(){

    // pull data from the source
    const attrs = this.source?.attrs && this.source.attrs.length > 0 ? this.source.attrs[0] : {};
    const fields = this.source?.fields || [];

    // prepare metadata string for display
    const metadataJsonString = attrs.meta ? JSON.stringify(attrs.meta, null, 2) : "";

    // render only when we have the information to display
    return fields.length > 0 ? html`
      <ul>
        <li>Schema: ${this.source.name}</li>
        <li>handle: ${this.source.handle}</li>
        <li>Readonly: ${this.source.readonly ? "Yes" : "No"}</li>
        <li>Fields: ${fields.length}</li>
        <li>Attributes:
          <ul>
            ${attrs.target ? html`<li>Target: ${attrs.target}</li>` : ""}
            ${attrs.name ? html`<li>Name: ${attrs.name}</li>` : ""}
            ${attrs.description ? html`<li>Description: ${attrs.description}</li>` : ""}
            ${attrs.immutable ? html`<li>Immutable: Yes</li>` :  html`<li>Immutable: No</li>`}
          </ul>
        </li>
      </ul>

      <az-bit id="schemaMetadataBit" scope="this" title="Metadata" status="default" rank="5">
        <az-code-box source="${metadataJsonString}"></az-code-box>
      </az-bit>

      <div class="composite">
        ${fields ? fields.map( (field,i) => {
            const attrs = field.attributes?.length > 0 ? field.attributes[0] || {} : {};
            const fldDescription = attrs.description !== field.name ? `${attrs.description}` : undefined;
            const description = [`${field.order}`, fldDescription, `${field.type}`].filter(d=>d).join(" :: ");

            return html`<az-bit id="schemaFieldBit-${i}" scope="this" title="${field.name}" group="schemaFields" rank="5">
              <ul>
                <li>Order: ${field.order}</li>
                <li>Type: ${field.type}</li>
                <li>GetOnly: ${field.getOnly ? "Yes" : "No"  }</li>
                <li>Required: ${attrs.required ? "Yes" : "No"}</li>
                <li>Max Length: ${attrs.maxLen || "N/A"}</li>
              </ul>

              <az-code-box scope="this" source="${JSON.stringify(attrs.meta, null, 2)}"></az-code-box>

            </az-bit>`})
          : html`<li>No fields available</li>`
        }
      </div>
    ` : html`<p>No schema data available</p>`;
  }
}

window.customElements.define("az-schema-bit", SchemaBit);
