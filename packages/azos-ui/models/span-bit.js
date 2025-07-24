/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { asInt, DATA_VALUE_PROP, isIntValue, isNumber, TIME_ZONE_PROP } from "azos/types"; 
import { dflt, dfltObject, trim, isEmpty, isNullOrWhiteSpace } from "azos/strings";

import { TZ_UTC } from "azos/time";
import { DATE_FORMAT, TIME_DETAILS } from "azos/localization";

import { html, css, UiInputValue } from "../ui.js";
import { Bit, ListBit } from "../bit.js";

import STL_INLINE_GRID from "../styles/grid.js";
import { writeConsole } from "azos/log";

export class SpanItem extends Bit {
  static styles = [...Bit.styles, STL_INLINE_GRID, css`
.composite {
  margin: 1em;
  gap: 0.5em;
  display: flex;
  flex-wrap: wrap;
  align-items: left;
  flex-direction: column;
}

az-bit{
 width: 60ch;
 transition: 1s;
}

az-bit:not([isexpanded]){
 transition-delay: .25s;
}

XXXaz-bit[isexpanded]{ width: 80ch; }
az-bit.wide[isexpanded]{ width: 100%; }`];

  static properties = {
    captionName: { type: String },
    captionRange: { type: String },
    captionTitle: { type: String },
    captionMon: { type: String },
    captionTue: { type: String },
    captionWed: { type: String },
    captionThu: { type: String },
    captionFri: { type: String },
    captionSat: { type: String },
    captionSun: { type: String },
  }

  //TODO: Figure out how to set this value programmatically,
  // might be the wrong approach... should probably pull the
  // value from the drRange field. Ask about it 20250527 zwh
  #dateRange = { start: "10/06/1989", end: "10/26/1992" }

  _getSummaryData() {
    const summary = this.tbName?.value;
    const start = this.arena.app.localizer.formatDateTime({
                                  dt:this.drRange?.value?.start, 
                                  dtFormat:DATE_FORMAT.NUM_DATE, 
                                  tmDetails: TIME_DETAILS.NONE, 
                                  timeZone: TZ_UTC
                                });
    
    const end = this.arena.app.localizer.formatDateTime({
                                  dt:this.drRange?.value?.end, 
                                  dtFormat:DATE_FORMAT.NUM_DATE, 
                                  tmDetails: TIME_DETAILS.NONE, 
                                  timeZone: TZ_UTC
                                });

    const subSummary = this.drRange?.value?.start === undefined
                    || this.drRange?.value?.end === undefined ? "" 
                    : start + " - " + end;
    return {
      title: dfltObject(summary, html`<span style="color: var(--ghost)">Span</span>`),
      subtitle: subSummary,
    }
  }

  renderDetailContent() {
    return html`
    <div class="row cols1">
      <az-text
        id="tbName"
        scope="this"
        name="name"
        .isReadonly="${this.isReadOnly}"
        title="${dflt(this.captionName, "Name")}"
      ></az-text>

      <az-nls-map-bit
        id="nlsBit"
        scope="this"
        name="nls"
        title="Localized Name"
        description="Localized name of the Span"
        .isReadonly="${this.isReadOnly}"
        class="span4"
        status="alert"
      ></az-nls-map-bit>
    </div>

    <div class="row">
      <az-date-range
          id="drRange"
          scope="this"
          name="dr"
          titlePosition="top-left"
          .isReadonly="${this.isReadOnly}"
          title="${dflt(this.captionRange, "Range")}"
        ></az-date-range>
        <div class="composite">
        <az-bit title="Monday" description="${dflt(this?.tbMonday?.value, "")}" rank="normal" status="alert" group="weekdays">
          <az-text
            id="tbMonday"
            scope="this"
            name="mon"
            title="Monday"
            titlePosition="mid-left"
            titleWidth="25"
            contentWidth="85"
            placeholder="9am-12pm, 1:00pm-7:45pm, ..."
            .isReadonly="${this.isReadOnly}"
          ></az-text>
        </az-bit>
        <az-bit title="Tuesday" description="${dflt(this?.tbTuesday?.value, "")}" "rank="normal" status="alert" group="weekdays">
          <az-text
            id="tbTuesday"
            scope="this"
            name="tue"
            title="Tuesday"
            titlePosition="mid-left"
            titleWidth="25"
            contentWidth="85"
            placeholder="9am-12pm, 1:00pm-7:45pm, ..."
            .isReadonly="${this.isReadOnly}"
          ></az-text>
        </az-bit>
        <az-bit title="Wednesday" description="${dflt(this?.tbWednesday?.value, "")}" rank="normal" status="alert" group="weekdays">
          <az-text
            id="tbWednesday"
            scope="this"
            name="wed"
            title="Wednesday"
            titlePosition="mid-left"
            titleWidth="30"
            contentWidth="150"
            placeholder="9am-12pm, 1:00pm-7:45pm, ..."
            .isReadonly="${this.isReadOnly}"
          ></az-text>
        </az-bit>
        <az-bit title="Thursday" description="${dflt(this?.tbThursday?.value, "")}" rank="nromal" status="alert" group="weekdays">
          <az-text
            id="tbThursday"
            scope="this"
            name="thu"
            title="Thursday"
            titlePosition="mid-left"
            titleWidth="25"
            contentWidth="85"
            placeholder="9am-12pm, 1:00pm-7:45pm, ..."
            .isReadonly="${this.isReadOnly}"
          ></az-text>
        </az-bit>
        <az-bit title="Friday" description="${dflt(this?.tbFriday?.value, "")}" rank="normal" status="alert" group="weekdays">
          <az-text
            id="tbFriday"
            scope="this"
            name="fri"
            title="Friday"
            titlePosition="mid-left"
            titleWidth="25"
            contentWidth="85"
            placeholder="9am-12pm, 1:00pm-7:45pm, ..."
            .isReadonly="${this.isReadOnly}"
          ></az-text>
        </az-bit>
        <az-bit title="Saturday" description="${dflt(this?.tbSaturday?.value, "")}" rank="normal" status="alert" group="weekdays">
          <az-text
            id="tbSaturday"
            scope="this"
            name="sat"
            title="Saturday"
            titlePosition="mid-left"
            titleWidth="25"
            contentWidth="85"
            placeholder="9am-12pm, 1:00pm-7:45pm, ..."
            .isReadonly="${this.isReadOnly}"
          ></az-text>
        </az-bit>
        <az-bit title="Sunday" description="${dflt(this?.tbSunday?.value, "")}" rank="normal" status="alert" group="weekdays">
          <az-text
            id="tbSunday"
            scope="this"
            name="sun"
            title="Sunday"
            titlePosition="mid-left"
            titleWidth="25"
            contentWidth="85"
            placeholder="9am-12pm, 1:00pm-7:45pm, ..."
            .isReadonly="${this.isReadOnly}"
          ></az-text>
        </az-bit>
      </div>
      </div>
    `;
  }
}

window.customElements.define("az-span-item", SpanItem);


export class SpanBit extends ListBit {
  static styles = [ListBit.styles];

  makeOrMapElement(elemData, existingOnly = false) {
    if (this.indexOf(elemData) >= 0) return elemData;
    const existing = this.find(el => el.tbName?.value === elemData);

    if (existing) return existing;
    if (existingOnly) return null;

    const item = new SpanItem();
    item.rank = "medium";
    //item.noSummary = true;
    return item;
  }

  _getSummaryData(effectDisabled, effectMutable) {
    const commands = effectMutable ? [this._cmdAdd, this._cmdRemove] : [];

    const first = this.find(() => true);
    const subtitle = first ? first.drRange?.text : "";

    return {
      title: `${dflt(this.title, this.description, this.name, "")} (${this.count})`,
      subtitle: subtitle ?? "",
      commands: commands
    }
  }

  get [DATA_VALUE_PROP]() {
    const result = [];
    const array = super[DATA_VALUE_PROP];
    for (const item of array) {
      result[item.name] = {
        nsl: item.nls, dr: item.dr,
        mon: item.mon, tue: item.tue,
        wed: item.wed, thu: item.thu,
        fri: item.fri, sat: item.sat, sun: item.sun
      }
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
          result.push({
            name: ik, nls: iv.nls, dr: iv.dr,
            mon: iv.mon, tue: iv.tue,
            wed: iv.wed, thu: iv.thu,
            fri: iv.fri, sat: iv.sat, sun: iv.sun
          });
        }
      }
    }
    super[DATA_VALUE_PROP] = v;

    queueMicrotask(async () => { await this.updateComplete; this.requestUpdate(); });
  }
}

window.customElements.define("az-span-bit", SpanBit);


//#region Date logic

const MINUTES_PER_DAY = 24 * 60;
const MINUTES_PER_HALFDAY = 12 * 60;
const DELIMS = /[,;]+/;

function validateHourList(content) {
  if (isEmpty(content)) return null;

  var kvps = content.replace(' ', '')
    .split(DELIMS)
    .filter(p => !isEmpty(dflt(p, "")))
    .map(p => p.split('-'));

  let data = [];
  for (let kvp of kvps) {
    var rawStart = parseComponent(kvp[0]);
    if (rawStart < 0) return null;

    var rawFinish = parseComponent(kvp[1]);
    if (rawFinish < 0) return null;

    var duration = rawFinish >= rawStart ? rawFinish - rawStart : (MINUTES_PER_DAY - rawStart) + rawFinish;
    // finish minute is the start + duration - 1 minute as the start minute is included as part of the range.
    var span = { startMinute: rawStart, durationMinutes: duration, finishMinute: duration > 0 ? rawStart + duration - 1 : -1, rawData: kvp };

    data.push(span);
  }

  //order in time
  var result = data.sort(s => s.startMinute);

  //check for overlap
  var start = 0;

  for (let span of result)
    if (span.startMinute < start)
      return null;
    else
      start = span.finishMinute;
  return result;
}

//`2025-11-02 02:20:00`

// 8:00    12:00  12:30pm 4:45pm 22:15
// 8       12pm 14   18.5  2
function parseComponent(str) {
  if (isEmpty(str)) return -1;

  str = trim(str);
  var result = 0;

  if (str.toLowerCase().endsWith("am")) {
    str = str.substring(0, str.length - 2);
    result = parseMinutes(str);

    if (result > MINUTES_PER_HALFDAY) return -1;
    if (result == MINUTES_PER_HALFDAY) result = 0;
  }
  else if (str.toLowerCase().endsWith("pm")) {
    str = str.substring(0, str.length - 2);
    result = parseMinutes(str);

    if (result >= MINUTES_PER_HALFDAY) result -= MINUTES_PER_HALFDAY;//#713 20220628 JPK
    if (result >= 0) result += MINUTES_PER_HALFDAY;//PM
  }
  else result = parseMinutes(str);

  return result;
}

function parseMinutes(str) {
  if (isNullOrWhiteSpace(str)) return -1;

  var i = str.indexOf(':');

  if (i === -1)//whole hour, no minute divider found
  {
    if (isIntValue(str)) return asInt(str) * 60;
    return -1;
  }

  if (i == 0 || i == str.Length) return -1;

  var h = str.substring(0, i);
  if (isIntValue(h)) h = asInt(h);
  else return -1;

  var m = str.substring(i + 1);
  if (isIntValue(m)) m = asInt(m);
  else return -1;

  if (h < 0 || h > 23) return -1;
  if (m < 0 || m > 59) return -1;

  return (h * 60) + m;
}
//#endregion