/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, css } from "../../ui";
import { CaseBase } from "./case-base";
import "azos-ui/models/schema-bit";
import schemaAccountDemo from "./_schema_account_example.json" assert { type: "json" };
export class CaseSchemaBit extends CaseBase {


  static styles = [...this.styles, css`
    .composite {
      margin: 1em;
      gap: 0.5em;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    .composite az-schema-bit{
      width: 22ch;
      transition: 1s;
    }

    .composite az-schema-bit:not([isexpanded]){
     transition-delay: .25s;
    }

    .composite az-schema-bit[isexpanded]{
      width: 100%;
    }
  `]

  renderControl() {
    return html`
      <h2>Schema Bit</h2>
      <az-schema-bit scope="this" .source="${schemaAccountDemo.data}" isExpanded></az-schema-bit>

      <h3>8 Nested Schema Bits</h3>
      <div class="composite">
        ${Array.from({ length: 8 }, (_, i) => html`
        <az-schema-bit scope="this" id="nested-schema-bit-${i}" .source="${schemaAccountDemo.data}" title="${schemaAccountDemo.data.name} (${i + 1})"></az-schema-bit>
        `)}
      </div>
   `;
  }
}

window.customElements.define("az-case-schema-bit", CaseSchemaBit);
