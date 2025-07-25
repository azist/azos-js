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

  get[DATA_VALUE_PROP](){
    const result = {};
    const array = super[DATA_VALUE_PROP];
    for (const item of array) {
      result[item.name] = {title:item?.title, 
                          spans:{
                            monday:item?.spans?.monday?.mon,
                            tuesday:item?.spans?.tuesday?.tue,
                            wednesday:item?.spans?.wednesday?.wed,
                            thursday:item?.spans?.thursday?.thu,
                            friday:item?.spans?.friday?.fri,
                            saturday:item?.spans?.saturday?.sat,
                            sunday:item?.spans?.sunday?.sun
                          }
                          , overrides:item?.overrides}
    }
    return result;
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
          result.push({name: ik, 
                       title:iv?.title, 
                       spans:{
                            monday:iv?.spans?.mon?.value,
                            tuesday:iv?.spans?.tue?.value,
                            wednesday:iv?.spans?.wed?.value,
                            thursday:iv?.spans?.thu?.value,
                            friday:iv?.spans?.fri?.value,
                            saturday:iv?.spans?.sat?.value,
                            sunday:iv?.spans?.sun?.value
                          }, 
                       overrides:iv?.overrides})
        }
      }
    }
    super[DATA_VALUE_PROP] = v;

    queueMicrotask(async () => { await this.updateComplete; this.requestUpdate(); });
  }
}
window.customElements.define("az-schedule-bit-list", ScheduleBitList);
