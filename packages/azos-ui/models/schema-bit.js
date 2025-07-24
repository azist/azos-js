import { Bit } from "azos-ui/bit";
import { html, css } from "azos-ui/ui";
import STL_INLINE_GRID from "../styles/grid.js";

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
  static styles = [Bit.styles, STL_INLINE_GRID, css`

    h3, h4 { margin: 0;}
    .composite {
      margin: 1em;
      gap: 0.5em;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    .compositeTight {
      margin: 0em;
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
    const readonlyText = this.source.readonly ? "Yes" : "No"

    const subtitle = `${fieldCountDisplay}${descriptionText} - Readonly: ${readonlyText} - Handle: ${this.source.handle}`;

    return { title, subtitle, commands: [] };
  }

  renderDetailContent(){

    // pull data from the source
    const attrs = this.source?.attrs ?? [];
    const fields = this.source?.fields ?? [];

    // render only when we have the information to display
    return fields.length > 0 ? html`
      <div style="width: 100%; margin-bottom: 1em;">
        <az-text isreadonly title="Name"     value="${this.source?.name}"     style="width: 28ch"></az-text>
        <az-text isreadonly title="readonly" value="${this.source?.readonly}" style="width: 10ch"></az-text>
        <az-text isreadonly title="handle"   value="${this.source?.handle}"   style="width: 10ch"></az-text>
      </div>


      <h4>Attributes (${attrs.length})</h4>
      <div class="row">

        <div class="composite">
          ${attrs.map(attr => html`
          <az-bit scope="this" title="Target: ${attr.target}" group="schemaAttributes" rank="4" isExpanded>
            <az-text isreadonly title="Name"        value="${attr.name}"        style="width: 28ch"></az-text>
            <az-text isreadonly title="description" value="${attr.description}" style="width: 28ch"></az-text>
            <az-text isreadonly title="immutable"   value="${attr.immutable}"   style="width: 10ch"></az-text>

            <az-bit id="schemaMetadataBit" scope="this" title="Metadata" status="default" isExpanded style="margin-top:1em;" >
              <az-code-box source="${attr?.meta ? JSON.stringify(attr.meta, null, 2) : ""}"></az-code-box>
            </az-bit>

          </az-bit>
        </div>

        `)}
      </div>

      <h4>Fields (${fields.length})</h4>
      <div class="composite">

      ${fields
        ? fields.map( (field,i) => html`
        <az-bit id="schemaFieldBit-${i}" scope="this" title="${field.name}" description="Order: ${field.order} - type: ${field.type}${field.getOnly ? " : GetOnly" : ""}" group="schemaFields" rank="4">

          <div style="width: 100%;">
            <az-text isreadonly title="Name"    value="${field.name}"></az-text>
            <az-text isreadonly title="Order"   value="${field.order}"   style="width: 10ch"></az-text>
            <az-text isreadonly title="Type"    value="${field.type}"    style="width: 10ch"></az-text>
            <az-text isreadonly title="GetOnly" value="${field.getOnly}" style="width: 10ch"></az-text>
          </div>

          <h3 style="margin: 1em 0;">Attributes (${(field?.attributes ?? []).length})</h3>

          <div class="compositeTight">

            ${(field?.attributes ?? []).map((attr,ii) => html`
              <az-bit scope="this" id="fieldAttributeBit-${ii}" title="Target: ${attr.target}" description="${attr.description}" group="schemaAttributes" isExpanded>
                <az-text isreadonly title="Target"      value="${attr.target}"></az-text>
                <az-text isreadonly title="Description" value="${attr.description}"></az-text>
                <az-text isreadonly title="BackName"    value="${attr.backName}"></az-text>
                <br>
                <az-text isreadonly title="maxLen"      value="${attr.maxLen}"      style="width: 10ch"></az-text>
                <az-text isreadonly title="required"    value="${attr.required}"    style="width: 10ch"></az-text>


                <az-bit scope="this" id="fieldAttributeBit-${ii}" title="Metadata" status="default" isExpanded style="margin-top:1em;" >
                  <az-code-box source="${attr?.meta ? JSON.stringify(attr.meta, null, 2) : ""}"></az-code-box>
                </az-bit>

              </az-bit>
            </div>`)}
          </div>
        </az-bit>`)
        : html`<li>No fields available</li>`}
    </div>`
  : html`<p>No schema data available</p>`;
  }
}

window.customElements.define("az-schema-bit", SchemaBit);
