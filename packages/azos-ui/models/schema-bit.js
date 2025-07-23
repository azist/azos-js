import { Bit } from "azos-ui/bit";
import { html, css } from "azos-ui/ui";


/**
 * Example schema:
 * {
 *   "data": {
 *   "handle": "#0",
 *   "name": "Account",
 *   "readonly": false,
 *   "attrs": [
 *     {
 *       "target": "*",
 *       "name": "Account",
 *       "description": "Account",
 *       "immutable": false,
 *       "meta": "..."}"
 *     }
 *   ],
 *   "fields": [...]
 *  }
 */

export class SchemaBit extends Bit {
  static properties = {
    source: { type: Object }
  }

  static styles = [Bit.styles, css`
    .strip-h {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 0.5em;
      gap: 1ch;
      justify-content: space-between;
      margin-top: 1em;
    }
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
          <az-code-box highlight="js" source="${metadataJsonString}"></az-code-box>
        </az-bit>

        <div class="strip-h">
          ${fields
            ? fields.map( (field,i) => html`
              <az-schema-field-bit id="schemaFieldBit-${i}" scope="this" .source="${field}"></az-schema-field-bit>`)
            : html`<li>No fields available</li>`}
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

export class SchemaFieldBit extends Bit {
  static properties = { source: { type: Object } };

  render() {
    const attrs = this.source?.attributes?.length > 0 ? this.source.attributes[0] || {} : {};
    const fldDescription = attrs.description !== this.source.name ? `${attrs.description}` : undefined;
    const description = [`${this.source.order}`, fldDescription, `${this.source.type}`].filter(d=>d).join(" :: ");

    return this.source ? html`
      <az-bit
        id="schemaFieldBit"
        scope="this"
        title="${this.source.name}"
        description="${description}"
        status="default"
        rank="4">

        <ul>
          <li>Order: ${this.source.order}</li>
          <li>Type: ${this.source.type}</li>
          <li>GetOnly: ${this.source.getOnly ? "Yes" : "No"  }</li>
          <li>Required: ${attrs.required ? "Yes" : "No"}</li>
          <li>Max Length: ${attrs.maxLen || "N/A"}</li>
        </ul>
<!--
        <az-bit id="schemaFieldMetadataBit" scope="this" title="Metadata" status="default">
          <az-code-box highlight="js" scope="this" source="${JSON.stringify(attrs.meta, null, 2)}"></az-code-box>
        </az-bit>
 !-->
      </az-bit>
    ` : html`<p>No field data available</p>`;
  }
}

window.customElements.define("az-schema-field-bit", SchemaFieldBit);
