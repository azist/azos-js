import { html } from "../ui.js";
import { Bit } from "../bit.js";

import { STL_INLINE_GRID } from "../styles";
import { dflt, dfltObject } from "azos/strings"

import "../models/span-bit.js";

export class ScheduleBit extends Bit {
  static styles = [...Bit.styles, STL_INLINE_GRID];

  static properties = {
    captionTitle: { type: String },
    captionName: { type: String },
    captionSpan: { type: String },
  }

  get[TIME_ZONE_PROP]() { return TZ_UTC; }

  renderDetailContent() {
    return html`
    <div class="row cols4">
      <az-text
        id="tbName"
        scope="this"
        name="Name"
        class="span4"
        .isReadonly="${this.isReadOnly}"
        title="${dflt(this.captionName, "Name")}"
      ></az-text>

      <az-text
        id="tbTitle"
        scope="this"
        name="NLSMap"
        title="NLSMap Placeholder"
        class="span4"
      ></az-text>

      <az-span-bit
        id="bitSpan"
        scope="this"
        name="Span"
        class="span4"
        title="${dflt(this.captionSpan, "Time Span")}"
      ></az-span-bit>

      <az-day-override-bit
        id="bitDayOverride"
        scope="this"
      ></az-day-override-bit>

    </div>
    
  `;
  }

}

window.customElements.define("az-schedule-bit", ScheduleBit);