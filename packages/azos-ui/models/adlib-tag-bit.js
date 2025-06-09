/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { dflt, dfltObject } from "azos/strings";

import { html } from "../ui.js";
import { Bit } from "../bit.js";
import { STL_INLINE_GRID } from "../styles";
import { asAtom } from "azos/types";

export class AdlibTagBit extends Bit {
  static styles = [...Bit.styles, STL_INLINE_GRID];

  static properties = {
    captionTitle: { type: String },
    captionProperty: { type: String },
    captionValue: { type: String },
    boundsMin: { type: Number },
    boundsMax: { type: Number },
    isNumeric: { type: Boolean },
  };

  _getSummaryData() {
    const summary = this?.captionTitle;
    const subSummary = [asAtom(this.tbProp?.value), this.tbValue?.value].filter(a => !!a).join(":");

    return {
      title: dfltObject(summary, html`<span style="color: var(--ghost)">Tag</span>`),
      subtitle: subSummary,
    }
  }

  renderDetailContent() {
    const minValue = dflt(this.boundsMin, 0);
    const maxValue = dflt(this.boundsMax, 1000);

    var valueTb = this.isNumeric ? html`<az-text
        id="tbValue"
        scope="this"
        name="Value"
        class="span2"
        title="${dflt(this.captionValue, "Value")}"
        .isReadonly="${this.isReadOnly}"
        placeholder="Range: ${minValue + "-" + maxValue}"
        dataType="real"
        minValue="${minValue}"
        maxValue="${maxValue}"
      ></az-text>`
      : html`<az-text
        id="tbValue"
        scope="this"
        name="Value"
        class="span2"
        title="${dflt(this.captionValue, "Value")}"
        .isReadonly="${this.isReadOnly}"
        minLength="${minValue}"
        maxLength="${maxValue}"
      ></az-text>`;


    return html`
    <div class="row cols2">
      <az-text
        id="tbProp"
        scope="this"
        name="PName"
        class="span2"
        dataType="atom"
        title="${dflt(this.captionProperty, "Property Name")}"
        .isReadonly="${this.isReadOnly}"
      ></az-text>
      ${valueTb}
    </div>
    `;
  }
}

window.customElements.define("az-adlib-tag-bit", AdlibTagBit)
