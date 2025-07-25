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

export class ScheduleBit extends Bit {
  static styles = [...Bit.styles, STL_INLINE_GRID];

  static properties = {
    captionTitle: { type: String },
    captionName: { type: String },
    captionSpan: { type: String },
  }

  _getSummaryData(){
    return {
      title: this?.captionTitle ?? this?.tbName?.value ?? "Schedule",
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
        title="${dflt(this.captionSpan, "Time Span")}"
      ></az-span-bit-list>

      <az-day-override-bit-list
        id="bitDayOverride"
        scope="this"
        class="span4"
        rank="medium"
        name="overrides"
      ></az-day-override-bit-list>

    </div>

  `;
  }

  get[DATA_VALUE_PROP](){
    const result = {};
    const obj = super[DATA_VALUE_PROP];
     const innerSpans = {};
     for (const span of obj.spans) {
                              innerSpans[span?.name] = {
                                monday:span?.monday?.mon,
                                tuesday:span?.tuesday?.tue,
                                wednesday:span?.wednesday?.wed,
                                thursday:span?.thursday?.thu,
                                friday:span?.friday?.fri,
                                saturday:span?.saturday?.sat,
                                sunday:span?.sunday?.sun};
                            };
      result[obj.name] = {title:obj?.title, 
                          spans:innerSpans, 
                          overrides:obj?.overrides};
    
    return result;
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
