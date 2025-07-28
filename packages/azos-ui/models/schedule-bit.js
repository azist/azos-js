/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/


import { html, UiInputValue } from "../ui.js";
import { Bit, ListBit } from "../bit.js";

import { dflt, dfltObject, isEmpty, isNullOrWhiteSpace, truncate } from "azos/strings"
import { STL_INLINE_GRID } from "../styles";
import {DATA_VALUE_PROP, isArray} from "azos/types";

import "../models/span-bit.js";
import { isNull } from "azos/aver";

export class ScheduleBit extends Bit {
  static styles = [...Bit.styles, STL_INLINE_GRID];

  static properties = {
    captionTitle: { type: String },
    captionName: { type: String },
    captionSpan: { type: String },
  }

  _getSummaryData(){
    const subtitle = super[DATA_VALUE_PROP]?.spans 
      ? truncate(super[DATA_VALUE_PROP]?.spans.map(span => span.name).join(", "), 35, "...")
      : "";
    const title = !isNullOrWhiteSpace(this?.captionTitle)
      ? "\"" + this.captionTitle + "\""
      : !isNullOrWhiteSpace(this?.tbName?.value)
      ? "\"" + this.tbName?.value + "\""
      : "";
    return {
      title: "Schedule " + title,
      subtitle: subtitle,
      commands: []
    }
  }


  renderDetailContent() {
    return html`
    <div class="row cols4">
      <az-text
        id="tbName"
        scope="this"
        name="name"
        class="span4"
        isrequired
        .isReadonly="${this.isReadOnly}"
        title="${dflt(this.captionName, "Name")}"
      ></az-text>

      <az-nls-map-bit-list
        id="nlsBit"
        scope="this"
        name="title"
        title="Local Schedule Name"
        description="Localized Name of the Schedule"
        .isReadonly="${this.isReadOnly}"
        class="span4"
        rank="medium"
      ></az-nls-map-bit-list>

      <az-span-bit-list
        id="bitSpan"
        scope="this"
        name="spans"
        class="span4"
        rank="medium"
        status="info"
        title="${dflt(this.captionSpan, "Time Spans")}"
      ></az-span-bit-list>

      <az-day-override-bit-list
        id="bitDayOverride"
        scope="this"
        class="span4"
        rank="medium"
        title="Day Overrides"
        name="overrides"
        status="alert"
      ></az-day-override-bit-list>

    </div>

  `;
  }
}

window.customElements.define("az-schedule-bit", ScheduleBit);

export class ScheduleBitList extends ListBit {
  
  static styles = [ListBit.styles];

  makeOrMapElement(elmData, existingOnly = false) {
    if (this.indexOf(elmData) >= 0) return elmData;
    const existing = this.find(el => el.tbName?.value === elmData)

    if (existing) return existing;
    if (existingOnly) return null;

    const item = new ScheduleBit();
    item.rank = "medium";
    return item;
  }

  _getSummaryData(effectDisabled, effectMutable) {
    const commands = effectMutable ? [this._cmdAdd, this._cmdRemove] : [];

    const first = this.find(() => true);
    const subtitle = first ? first.tbName?.value : "";

    return {
      title: `${dflt(this.title, this.description, this.name, "")} (${this.count})`,
      subtitle: subtitle ?? "",
      commands: commands,
    };
  }
}
window.customElements.define("az-schedule-bit-list", ScheduleBitList);
