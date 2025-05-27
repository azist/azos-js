import { html } from "../ui.js";
import { Bit } from "../bit.js";

import {STL_INLINE_GRID} from "../styles";
import { dflt, dfltObject } from "azos/strings";

export class LatLngBit extends Bit {
  static styles = [...Bit.styles, STL_INLINE_GRID];

  static properties = {
    captionLat:   { type: String },
    captionLng:   { type: String },
    captionName:  { type: String },
  }

  _getSummaryData(){
    const summary = this.title;
    const subSummary = [this.tbLat?.value, this.tbLng?.value].filter(a => !!a).join(", ");
    return {
      title:    dfltObject(summary, html`<span style="color: var(--ghost)">Latitude/Longitude</span>`),
      subtitle: subSummary,
    }
  }

  renderDetailContent() {
    return html`
    <div class ="row cols4">
      <az-text
        id="tbName"
        scope="this"
        name="Name"
        class="span4"
        title="Name"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbLat"
        scope="this"
        name="Latitude"
        class="span2"
        title="Latitude"
        .isReadonly="${this.isReadOnly}"
        dataType="real"
        minValue="-90"
        maxValue="90"
      ></az-text>

      <az-text
        id="tbLng"
        scope="this"
        name="Longitude"
        class="span2"
        title="Longitude"
        .isReadonly="${this.isReadOnly}"
        dataType="real"
        minValue="-180"
        maxValue="180"
      ></az-text>
    </div>
    `;
  }
}

window.customElements.define("az-lat-lng-bit", LatLngBit)