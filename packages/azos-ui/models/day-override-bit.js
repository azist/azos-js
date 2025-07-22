/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/


import { DATA_VALUE_PROP, TIME_ZONE_PROP } from "azos/types";
import { dflt, dfltObject, isNullOrWhiteSpace } from "azos/strings"
import { TZ_UTC } from "azos/time";
import { DATE_FORMAT, TIME_DETAILS } from "azos/localization";

import { css, getEffectiveTimeZone, html, UiInputValue } from "../ui.js";
import { Bit, ListBit } from "../bit.js";
import { STL_INLINE_GRID } from "../styles";

export class DayOverrideItem extends Bit {
  //TODO: Update this styling, this is just example pulled from NlsMapItem 20250610 zwh
  static styles = [...Bit.styles, css`
      .item{
        display: flex;
      }
      #tbName{ min-width: 10ch; max-width: 10ch; }
      #tbDate{ min-width: 12ch; width: 20%; }
      #nlsBit{ min-width: 20ch; width: 40%; }
      #tbHours{ width: 40%; }
    `];

  static properties = {
    captionName: { type: String },
    captionHours: { type: String },
  }

  get[TIME_ZONE_PROP]() { return TZ_UTC; }

  _getSummaryData() {
    const summary = dfltObject(this.tbName?.value, html`<span style="color: var(--ghost)">Day Override</span>`);
    // Always localize the DATE to UTC since we don't want that to be altered during localization elsewhere.
    // As the UTC date is a statutory date that will be compared against the application date in EVERY PARTICULAR LOCAL TIMEZONE
    const subSummary = isNullOrWhiteSpace(this.tbDate?.value) 
                        ? "" 
                        : this.arena.app
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
    <div class="item">
      <az-text
        id="tbName"
        scope="this"
        name="Name"
        .isReadonly="${this.isReadOnly}"
        title="${dflt(this.captionName, "Name")}"
      ></az-text>

      <az-text
        id="tbDate"
        scope="this"
        name="Date"
        contentWidth="50"
        titleWidth="50"
        title="Date"
        .isReadonly="${this.isReadOnly}"
        displayFormat='<<v::ld{"dtFormat":"LongDate", "tmDetails":"NONE"}>>'
        dataKind="datetime"
        dataType="date"
      ></az-text>

      <az-text
        id="tbHours"
        scope="this"
        name="Hours"
        title="${dflt(this.captionHours, "Hours")}"
      ></az-text>

      <az-nls-map-bit
        id="nlsBit"
        scope="this"
        name="lclCode"
        title="Localized Day"
        description="Localized Name of the Day to be overridden"
        .isReadonly="${this.isReadOnly}"
        rank="small"
      ></az-nls-map-bit>
      
    </div>`;
  }
}

window.customElements.define("az-day-override-item", DayOverrideItem);

export class DayOverrideBit extends ListBit {
  static styles = [ListBit.styles];

  makeOrMapElement(elmData, existingOnly = false)
  {
    if (this.indexOf(elmData) >= 0) return elmData;
    const existing = this.find(el => el.tbName?.value === elmData)

    if (existing) return existing;
    if (existingOnly) return null;

    const item = new DayOverrideItem();
    item.rank = "medium";
    item.noSummary = true;
    return item;
  }

  _getSummaryData(effectDisabled, effectMutable){
    const commands = effectMutable ? [this._cmdAdd, this._cmdRemove] : [];

    const first = this.find(() => true);
    const subtitle = first ? first.tbName?. value : "";

    return {
      title: `${dflt(this.title, this.description, this.name, "")} (${this.count})`,
      subtitle: subtitle ?? "",
      commands: commands
    };
  }

  get [DATA_VALUE_PROP]() {
    const result = {};
    const array = super[DATA_VALUE_PROP];
    for (const item of array){
      result[item.name] = {d: item.d, h: item.h, c: item.c};
    }
    return result;
  }

  set [DATA_VALUE_PROP](v) {
    if (v) {
      let isUiInput = false;
      if (v instanceof UiInputValue) {
        isUiInput = true;
        v = v.value();
      }

      if (!isArray(v)) {
        let result = [];
        for (const [ik, iv] of Object.entries(v)) {
          result.push({name: ik, d: iv?.d, h: iv?.h, c: iv?.c});
        }
        v = isUiInput ? new UiInputValue(result) : result;
      }
    }

    super[DATA_VALUE_PROP] = v;

    queueMicrotask(async () => { await this.updateComplete; this.requestUpdate(); });
  }
}

window.customElements.define("az-day-override-bit", DayOverrideBit);