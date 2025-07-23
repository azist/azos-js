/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { SelectField } from "../../parts/select-field.js";
import { html, css } from "../../ui";
import { CaseBase } from "./case-base";
import "azos-ui/models/schema-bit";
import schemaAccountDemo from "./_schema_account_example.json" assert { type: "json" };
export class CaseSchemaBit extends CaseBase {

  renderControl() {
    return html`
      <h2>Schema Bit</h2>
      <az-schema-bit scope="this" .source="${schemaAccountDemo.data}"></az-schema-bit>
   `;
  }


}

window.customElements.define("az-case-schema-bit", CaseSchemaBit);
