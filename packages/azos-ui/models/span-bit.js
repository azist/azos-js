import { html } from "../ui.js";
import { Bit } from "../bit.js";

import STL_INLINE_GRID from "../styles/grid.js";
import { dflt, dfltObject } from "azos/strings";

export class SpanBit extends Bit {
  static styles = [...Bit.styles, STL_INLINE_GRID];

  static properties = {
    captionName:  { type: String },
    captionRange: { type: String },
    captionTitle: { type: String },
  }
  //TODO: Figure out how to set this value programmatically, 
  // might be the wrong approach... should probably pull the 
  // value from the drRange field. Ask about it 20250527 zwh

  #dateRange = { start: "10/06/1989", end: "10/26/1992" }

  _getSummaryData() {
    const summary = this.tbName?.value;
    const subSummary = this.#dateRange.start + " - " + this.#dateRange.end;
    return {
      title: dfltObject(summary, html`<span style="color: var(--ghost)">Span</span>`),
      subtitle: subSummary,
    }
  }

  renderDetailContent() {
    return html`
    <div class="row cols7">
      <az-text
        id="tbName"
        scope="this"
        name="Name"
        class="span7"
        .isReadonly="${this.isReadOnly}"
        title="${dflt(this.captionName, "Name")}"
      ></az-text>
      
      <az-date-range
        id="drRange"
        scope="this"
        class="span14"
        .isReadonly="${this.isReadOnly}"
        title="${this.captionRange, "Range"}"
        
      ></az-date-range>

      <az-text
        id="tbTitle"
        scope="this"
        name="NLSMap"
        title="NLSMap Placeholder"
        class="span7"
      ></az-text>

      <az-text
        id="tbMonday"
        scope="this"
        name="Monday"
        title="Monday"
        titlePosition="top-center"
        class="span1"
        .isReadonly="${this.isReadOnly}"
      ></az-text>
      
      <az-text
        id="tbTuesday"
        scope="this"
        name="Tuesday"
        title="Tuesday"
        titlePosition="top-center"
        class="span1"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbWednesday"
        scope="this"
        name="Wednesday"
        title="Wednesday"
        titlePosition="top-center"
        class="span1"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbThursday"
        scope="this"
        name="Thursday"
        title="Thursday"
        titlePosition="top-center"
        class="span1"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbFriday"
        scope="this"
        name="Friday"
        title="Friday"
        titlePosition="top-center"
        class="span1"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbSaturday"
        scope="this"
        name="Saturday"
        title="Saturday"
        titlePosition="top-center"
        class="span1"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbSunday"
        scope="this"
        name="Sunday"
        title="Sunday"
        titlePosition="top-center"
        class="span1"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

    </div>
    `;
  }
}

window.customElements.define("az-span-bit", SpanBit);