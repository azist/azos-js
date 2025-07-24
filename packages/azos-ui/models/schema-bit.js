import { Bit } from "azos-ui/bit";
import { html, css } from "azos-ui/ui";

/**
 * SchemaBit is a custom bit that displays schema information
 */
export class SchemaBit extends Bit {
  static properties = {
    source: { type: Object }
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

    
    // prepare title for the bit
    const isUniqueTitle = this.title !== this.source?.name && this.title !== this.constructor.name;
    const title = `${ isUniqueTitle ? this.title : this.source?.name }`;
    
    // prepare subtitle for the bit
    const attrs = this.source?.attrs && this.source.attrs.length > 0 ? this.source.attrs[0] : {};
    // todo: check if there is any data where there are multiple attributes
    //  if multiple attributes are there, which do we choose for the initial description?
    //  do we choose the initial based on the target?
    //   target === connection ?? target === `*` <-- leaning this way but need to confirm
    const descriptionText = attrs?.description && attrs?.description !== title ? `: ${attrs.description}` : "";
    const fieldCountDisplay = `${this.source?.fields?.length ?? 0} fields`;
    const subtitle = `${fieldCountDisplay}${descriptionText}`;

    return { title, subtitle, commands: [] };
  }

  renderDetailContent(){

    // pull data from the source
    const attrs = this.source?.attrs ?? [];
    const fields = this.source?.fields ?? [];

    // render only when we have the information to display
    return fields.length > 0 ? html`
      <ul>
        <li>Schema: ${this.source.name}</li>
        <li>handle: ${this.source.handle}</li>
        <li>Readonly: ${this.source.readonly ? "Yes" : "No"}</li>
        <li>Fields: ${fields.length}</li>
        ${attrs.map(attr => html`
          <li>Attributes:
            <ul>
              ${attr.target ? html`<li><strong>Target: ${attr.target}</strong></li>` : ""}
              ${attr.name ? html`<li>Name: ${attr.name}</li>` : ""}
              ${attr.description ? html`<li>Description: ${attr.description}</li>` : ""}
              ${attr.immutable ? html`<li>Immutable: Yes</li>` :  html`<li>Immutable: No</li>`}
            </ul>
            <az-bit id="schemaMetadataBit" scope="this" title="Metadata" status="default" rank="5">
              <az-code-box source="${attr.meta ? JSON.stringify(attr.meta, null, 2) : ""}"></az-code-box>
            </az-bit>
          </li>
        `)}
      </ul>

      <div class="composite">
        ${fields ? fields.map( (field,i) => {
            return html`<az-bit id="schemaFieldBit-${i}" scope="this" title="${field.name}" group="schemaFields" rank="5">
              <ul>
                <li>Order: ${field.order}</li>
                <li>Type: ${field.type}</li>
                <li>GetOnly: ${field.getOnly ? "Yes" : "No"  }</li>
                ${(field?.attributes ?? []).map(attr => html`
                  <li>Attributes:
                    <ul>
                      <li>Description: ${attr.description}</li>
                      <li>Required: ${attr.required ? "Yes" : "No"}</li>
                      <li>Max Length: ${attr.maxLen || "N/A"}</li>
                    </ul>
                    <az-bit id="schemaMetadataBit" scope="this" title="Metadata" status="default" rank="5">
                      <az-code-box source="${attr.meta ? JSON.stringify(attr.meta, null, 2) : ""}"></az-code-box>
                    </az-bit>
                  </li>
                `)}
              </ul>
            </az-bit>`})
          : html`<li>No fields available</li>`
        }
      </div>

      <az-bit title="View Raw JSON">
        <az-code-box source="${JSON.stringify( (this?.source ?? {}) , null, 2)}"></az-code-box>
      </az-bit>
    ` : html`<p>No schema data available</p>`;
  }
}

window.customElements.define("az-schema-bit", SchemaBit);
