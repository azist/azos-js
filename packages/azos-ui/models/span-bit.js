import { html } from "../ui.js";
import { Bit } from "../bit.js";

import STL_INLINE_GRID from "../styles/grid.js";
import { dflt } from "azos/strings";

export class SpanBit extends Bit {
  static styles = [...Bit.styles, STL_INLINE_GRID];

  static properties = {
    captionName:  { type: String },
    captionRange: { type: String },
  }

  renderDetailContent() {
    return html`
    <div class="row cols8">
      <az-text
        id="tbName"
        scope="this"
        name="Name"
        class="span8"
        .isReadonly="${this.isReadOnly}"
        title="${dflt(this.captionName, "Name")}"
      ></az-text>

      <az-text
        id="tbTitle"
        scope="this"
        name="NLSMap"
        title="NLSMap Placeholder"
        class="span8"
      ></az-text>

      <az-date-range
        id="drRange"
        scope="this"
        class="span1"
        .isReadonly="${this.isReadOnly}"
        title="${this.captionRange, "Range"}"
      ></az-date-range>

      <az-text
        id="tbMonday"
        scope="this"
        name="Monday"
        title="Monday"
        class="span1"
        .isReadonly="${this.isReadOnly}"
      ></az-text>
      
      <az-text
        id="tbTuesday"
        scope="this"
        name="Tuesday"
        title="Tuesday"
        class="span1"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbWednesday"
        scope="this"
        name="Wednesday"
        title="Wednesday"
        class="span1"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbThursday"
        scope="this"
        name="Thursday"
        title="Thursday"
        class="span1"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbFriday"
        scope="this"
        name="Friday"
        title="Friday"
        class="span1"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbSaturday"
        scope="this"
        name="Saturday"
        title="Saturday"
        class="span1"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbSunday"
        scope="this"
        name="Sunday"
        title="Sunday"
        class="span1"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

    </div>
    `;
  }
}

window.customElements.define("az-span-bit", SpanBit);