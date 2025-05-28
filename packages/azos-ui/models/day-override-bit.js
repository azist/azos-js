import { html } from "../ui.js";
import { Bit } from "../bit.js";

import { STL_INLINE_GRID } from "../styles";
import { dflt, dfltObject } from "azos/strings"

export class DayOverrideBit extends Bit {
  static styles = [...Bit.styles, STL_INLINE_GRID];

  static properties = {
    captionName: { type: String },
    captionHours: { type: String },
  }

  _getSummaryData() {
    const summary = dfltObject(this.tbName?.value, html`<span style="color: var(--ghost)">Day Override</span>`);
    const subSummary = this.tbDate?.value;
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
        title="Date"
        .isReadonly="${this.isReadOnly}"
        dataKind="date"
        dataValue="date"
      ></az-text>

      <az-text
        id="tbHours"
        scope="this"
        name="Hours"
        title="${dflt(this.captionHours, "Hour Range")}"
        class="span2"
      ></az-text>
    </div>`;
  }
}

window.customElements.define("az-day-override-bit", DayOverrideBit);