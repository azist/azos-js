/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { dflt, dfltObject, trim, isEmpty, isNullOrWhiteSpace } from "azos/strings";
import { asInt, isIntValue, isNumber } from "azos/types";
import * as log from "azos/log";

import { html } from "../ui.js";
import { Bit } from "../bit.js";

import STL_INLINE_GRID from "../styles/grid.js";

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

  //TODO: Add data validation after creating parse, parseComponent, parseMinute from C#
  renderDetailContent() {

    log.writeConsole(validateHourList("9am-12pm, 1:00pm-7:45pm"));

    return html`
    <div class="row cols1">
      <az-text
        id="tbName"
        scope="this"
        name="Name"
        .isReadonly="${this.isReadOnly}"
        title="${dflt(this.captionName, "Name")}"
      ></az-text>

      <az-nls-map-bit
        id="nlsBit"
        scope="this"
        name="lclCode"
        title="Localized Name"
        description="Localized name of the Span"
        .isReadonly="${this.isReadOnly}"
        class="span4"
      ></az-nls-map-bit>
    </div>

    <div class="row cols1">
    <az-date-range
        id="drRange"
        scope="this"
        .isReadonly="${this.isReadOnly}"
        title="${this.captionRange, "Range"}"
      ></az-date-range>

      <az-text
        id="tbMonday"
        scope="this"
        name="Monday"
        title="Monday"
        titlePosition="mid-left"
        titleWidth="25"
        contentWidth="85"
        placeholder="9am-12pm, 1:00pm-7:45pm, ..."
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbTuesday"
        scope="this"
        name="Tuesday"
        title="Tuesday"
        titlePosition="mid-left"
        titleWidth="25"
        contentWidth="85"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbWednesday"
        scope="this"
        name="Wednesday"
        title="Wednesday"
        titlePosition="mid-left"
        titleWidth="25"
        contentWidth="85"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbThursday"
        scope="this"
        name="Thursday"
        title="Thursday"
        titlePosition="mid-left"
        titleWidth="25"
        contentWidth="85"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbFriday"
        scope="this"
        name="Friday"
        title="Friday"
        titlePosition="mid-left"
        titleWidth="25"
        contentWidth="85"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbSaturday"
        scope="this"
        name="Saturday"
        title="Saturday"
        titlePosition="mid-left"
        titleWidth="25"
        contentWidth="85"
        .isReadonly="${this.isReadOnly}"
      ></az-text>

      <az-text
        id="tbSunday"
        scope="this"
        name="Sunday"
        title="Sunday"
        titlePosition="mid-left"
        titleWidth="25"
        contentWidth="85"
        .isReadonly="${this.isReadOnly}"
      ></az-text>
      </div>
    `;
  }
}

window.customElements.define("az-span-bit", SpanBit);

const MINUTES_PER_DAY = 24*60;
const MINUTES_PER_HALFDAY = 12*60;
const DELIMS = /[,;]+/;

function validateHourList(content)
{
  if (isEmpty(content)) return null;

  var kvps = content.replace(' ', '')
                  .split(DELIMS)
                  .filter(p => !isEmpty(dflt(p, "")))
                  .map(p=>p.split('-'));

  let data = [];
  for (let kvp of kvps)
  {
    var rawStart = parseComponent(kvp[0]);
    if (rawStart < 0) return null;

    var rawFinish = parseComponent(kvp[1]);
    if (rawFinish < 0) return null;

    var duration = rawFinish >= rawStart ? rawFinish - rawStart : (MINUTES_PER_DAY - rawStart) + rawFinish;
    // finish minute is the start + duration - 1 minute as the start minute is included as part of the range.
    var span = { startMinute:rawStart , durationMinutes: duration, finishMinute: duration > 0 ? rawStart + duration - 1 : -1, rawData:kvp };

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

  if (str.toLowerCase().endsWith("am"))
  {
    str = str.substring(0, str.length - 2);
    result = parseMinutes(str);

    if (result > MINUTES_PER_HALFDAY) return -1;
    if (result == MINUTES_PER_HALFDAY) result = 0;
  }
  else if(str.toLowerCase().endsWith("pm"))
  {
    str = str.substring(0, str.length - 2);
    result = parseMinutes(str);

    if (result>=MINUTES_PER_HALFDAY) result -= MINUTES_PER_HALFDAY;//#713 20220628 JPK
    if (result>=0) result += MINUTES_PER_HALFDAY;//PM
  }
  else result = parseMinutes(str);

  return result;
}

function parseMinutes(str)
{
  if (isNullOrWhiteSpace(str)) return -1;

  var i = str.indexOf(':');

  if (i === -1)//whole hour, no minute divider found
  {
    if (isIntValue(str)) return asInt(str) * 60;
    return -1;
  }

  if (i == 0 || i == str.Length) return -1;

  var h = str.substring(0, i);
  if(isIntValue(h)) h = asInt(h);
  else return -1;

  var m = str.substring(i+1);
  if(isIntValue(m)) m = asInt(m);
  else return -1;

  if (h < 0 || h > 23) return -1;
  if (m < 0 || m > 59) return -1;

  return (h * 60) + m;
}
