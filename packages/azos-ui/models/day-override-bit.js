import { TIME_ZONE_PROP } from "azos/types";
import { dflt, dfltObject } from "azos/strings"
import { TZ_UTC } from "azos/time";
import { DATE_FORMAT, TIME_DETAILS } from "azos/localization";

import { getEffectiveTimeZone, html } from "../ui.js";
import { Bit } from "../bit.js";
import { STL_INLINE_GRID } from "../styles";

export class DayOverrideBit extends Bit {
  static styles = [...Bit.styles, STL_INLINE_GRID];

  static properties = {
    captionName: { type: String },
    captionHours: { type: String },
  }

  get[TIME_ZONE_PROP]() { return TZ_UTC; }

  _getSummaryData() {
    const summary = dfltObject(this.tbName?.value, html`<span style="color: var(--ghost)">Day Override</span>`);
    // Always localize the DATE to UTC since we don't want that to be altered during localization elsewhere.
    // As the UTC date is a statutory date that will be compared against the application date in EVERY PARTICULAR LOCAL TIMEZONE
    const subSummary = this.arena.app
                          .localizer
                          .formatDateTime(
                            {
                              dt:this.tbDate?.value, 
                              dtFormat:DATE_FORMAT.NUM_DATE, 
                              tmDetails: TIME_DETAILS.NONE, 
                              timeZone: TZ_UTC
                            });
    return {
      title: summary,
      subtitle: subSummary,
    }
  }

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
        .isReadonly="${this.isReadOnly}"
        class="span4"
      ></az-text>

      <az-text
        id="tbDate"
        scope="this"
        name="Date"
        class="span2"
        title="Override Date"
        .isReadonly="${this.isReadOnly}"
        displayFormat='<<v::ld{"dtFormat":"LongDate", "tmDetails":"NONE"}>>'
        dataKind="datetime"
        dataType="date"
      ></az-text>

      <az-text
        id="tbHours"
        scope="this"
        name="Hours"
        title="${dflt(this.captionHours, "Scheduled Hours")}"
        class="span2"
      ></az-text>
    </div>`;
  }
}

window.customElements.define("az-day-override-bit", DayOverrideBit);