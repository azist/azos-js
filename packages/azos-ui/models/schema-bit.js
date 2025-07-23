import { Bit } from "azos-ui/bit";
import { html, css } from "azos-ui/ui";

export class SchemaBit extends Bit {
  static properties = {
    source: { type: Object }
  }

  static styles = [Bit.styles, css`

    .composite {
      margin: 1em;
      gap: 0.5em;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    .composite az-bit{
      width: 28ch;
      transition: 1s;
    }

    .composite az-bit:not([isexpanded]){
     transition-delay: .25s;
    }

    .composite  az-bit[isexpanded]{ width: 100%; }
    `];

  /**
   * Schma bit will display the schema
   *   main bit:
   *     title: schema name
   *     description: {count} fields {decription if different than name}
   *     body:
   *       text Account information
   *       Metadata bit:
   *         title: Metadata
   *         description: none
   *         body: current schema metadata
   *       Repeating Field bits
   */


  render() {

    const attrs = this.source?.attrs && this.source.attrs.length > 0 ? this.source.attrs[0] : {};
    const fields = this.source?.fields || [];

    const metadataJsonString = attrs.meta ? JSON.stringify(attrs.meta, null, 2) : "";
    const description = `${fields.length || 0} fields${attrs.description !== attrs?.name ? `: ${attrs.description}` : ""}`;

    return this.source?.fields ? html`

      <az-bit
        id="schemaBit"
        scope="this"
        title="${attrs.name}"
        description="${description}"
        isExpanded=${true}
        status="default"
        rank="3">

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
                  <li>Order: ${this.source.order}</li>
                  <li>Type: ${this.source.type}</li>
                  <li>GetOnly: ${this.source.getOnly ? "Yes" : "No"  }</li>
                  <li>Required: ${attrs.required ? "Yes" : "No"}</li>
                  <li>Max Length: ${attrs.maxLen || "N/A"}</li>
                </ul>

                <az-code-box scope="this" source="${JSON.stringify(attrs.meta, null, 2)}"></az-code-box>

              </az-bit>`})
            : html`<li>No fields available</li>`
          }
        </div>

      </az-bit>
    </div>` : html`<p>No schema data available</p>`;
  }
}

window.customElements.define("az-schema-bit", SchemaBit);


/**
 * Example field:
 * {
 *    "name": "Id",
 *    "order": 0,
 *    "getOnly": false,
 *    "type": "string",
 *    "attributes": [
 *      {
 *        "target": "*",
 *        "description": "Account ID",
 *        "meta": "aggregatable=True aiPredictionField=False autoNumber=False byteLength=18 calculated=False calculatedFormula=null cascadeDelete=False caseSensitive=False compoundFieldName=null controllerName=null createable=False custom=False defaultValue=null defaultValueFormula=null defaultedOnCreate=True dependentPicklist=False deprecatedAndHidden=False digits=0 displayLocationInDecimal=False encrypted=False externalId=False extraTypeInfo=null filterable=True filteredLookupInfo=null formulaTreatNullNumberAsZero=False groupable=True highScaleNumber=False htmlFormatted=False idLookup=True inlineHelpText=null label=\"Account ID\" length=18 mask=null maskType=null name=Id nameField=False namePointing=False nillable=False permissionable=False polymorphicForeignKey=False precision=0 queryByDistance=False referenceTargetField=null relationshipName=null relationshipOrder=null restrictedDelete=False restrictedPicklist=False scale=0 searchPrefilterable=False soapType=tns:ID sortable=True type=id unique=False updateable=False writeRequiresMasterRead=False",
 *        "backName": "Id",
 *        "required": true,
 *        "maxLen": 18
 *      }
 *    ]
 *  },
 */
