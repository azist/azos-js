/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

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

  //get[TIME_ZONE_PROP]() { return TZ_UTC; }

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

      <az-nls-map-bit
        id="nlsBit"
        scope="this"
        name="lclCode"
        title="Local Schedule Name"
        description="Localized Name of the Schedule"
        .isReadonly="${this.isReadOnly}"
        class="span4"
        rank="small"
      ></az-nls-map-bit>

      <az-span-bit
        id="bitSpan"
        scope="this"
        name="Span"
        class="span4"
        title="${dflt(this.captionSpan, "Time Span")}"
      ></az-span-bit>

      <az-day-override-item
        id="bitDayOverride"
        scope="this"
        class="span3"
      ></az-day-override-item>

      <az-adlib-tag-bit
        id="bitTag"
        scope="this"
        class="span1"
      ></az-adlib-tag-bit>

    </div>

  `;
  }

}

window.customElements.define("az-schedule-bit", ScheduleBit);
