/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/


import { html, UiInputValue } from "../ui.js";
import { Bit, ListBit } from "../bit.js";

import { dflt, dfltObject } from "azos/strings"
import { STL_INLINE_GRID } from "../styles";
import {DATA_VALUE_PROP, isArray} from "azos/types";

import "../models/span-bit.js";

export class ScheduleItem extends Bit {
  static styles = [...Bit.styles, STL_INLINE_GRID];

  static properties = {
    captionTitle: { type: String },
    captionName: { type: String },
    captionSpan: { type: String },
  }

  //get[TIME_ZONE_PROP]() { return TZ_UTC; }
//TODO: convert to the bit list

  _getSummaryData(){
    return {
      title: this?.captionTitle ?? this?.tbName?.value,
      subtitle: '',
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
        .isReadonly="${this.isReadOnly}"
        title="${dflt(this.captionName, "Name")}"
      ></az-text>

      <az-nls-map-bit
        id="nlsBit"
        scope="this"
        name="nlsMap"
        title="Local Schedule Name"
        description="Localized Name of the Schedule"
        .isReadonly="${this.isReadOnly}"
        class="span4"
        rank="medium"
      ></az-nls-map-bit>

      <az-span-bit
        id="bitSpan"
        scope="this"
        name="weekdays"
        class="span4"
        rank="medium"
        status="info"
        title="${dflt(this.captionSpan, "Time Span")}"
      ></az-span-bit>

      <az-day-override-item
        id="bitDayOverride"
        scope="this"
        class="span4"
        rank="medium"
        name="dayOverrides"
      ></az-day-override-item>

    </div>

  `;
  }

}

window.customElements.define("az-schedule-bit-item", ScheduleItem);

export class ScheduleBit extends ListBit {
  
  static styles = [ListBit.styles];

  makeOrMapElement(elmData, existingOnly = false) {
    if (this.indexOf(elmData) >= 0) return elmData;
    const existing = this.find(el => el.tbName?.value === elmData)

    if (existing) return existing;
    if (existingOnly) return null;

    const item = new ScheduleItem();
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

  get[DATA_VALUE_PROP](){
    const result = {};
    const array = super[DATA_VALUE_PROP];
    for (const itme of array) {
      result[item.name] = {}
    }
  }

  set[DATA_VALUE_PROP](v){
    if (v) {
      let isUiInput = false;
      if (v instanceof UiInputValue){
        isUiInput = true;
        v = v.value();
      }

      if (!isArray(v)){
        let result = [];
        for (const [ik, iv] of Object.entries(v)){
          result.push({name: ik, nls:iv.nlsMap, wkd:iv.weekdays, ovd:iv.dayOverrides})
        }
      }
    }
  }
}
window.customElements.define("az-schedule-bit", ScheduleBit);
