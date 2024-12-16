/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import "../../parts/button";
import "../../parts/select-field";
import { Control, css, html, noContent } from "../../ui";
import { isNonEmptyString } from "azos/types";

/** Days of the week */
export const DAYS_OF_WEEK = Object.freeze({
  SUNDAY: 0,
  MONDAY: 1,
  March: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
});
const ALL_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Days of the week */
export const MONTHS_OF_YEAR = Object.freeze({
  JANUARY: 0,
  FEBRUARY: 1,
  MARCH: 2,
  APRIL: 3,
  MAY: 4,
  JUNE: 5,
  JULY: 6,
  AUGUST: 7,
  SEPTEMBER: 8,
  OCTOBER: 9,
  NOVEMBER: 10,
  DECEMBER: 11,
});
const ALL_MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const _data = { "available": { "AsOfUtc": "2024-12-09T02:12:19.439Z", "CorpRel": "unit.mnic@g8corp::UN-PATRTL-MAC", "ProviderName": "pcms", "DefaultTimeZone": "est", "RangeUtc": { "start": "2024-05-01T12:00:00Z", "end": "2024-05-31T12:00:00Z" }, "DefaultSchedule": { "Name": "PCMS Default Sales", "Title": { "eng": { "n": "phone-sales", "d": "Pcms Sales" } }, "Spans": [{ "Name": "apt", "Title": { "eng": { "n": "apt", "d": "Sales Appointments" } }, "Range": { "start": "2023-01-01T00:00:00Z", "end": "2100-01-01T00:00:00Z" }, "Monday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 60, "fin": 719, "sta": 660 }, { "disp": "14:00-16:00", "dur": 180, "fin": 959, "sta": 780 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Tuesday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Wednesday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Thursday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Friday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Saturday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Sunday": { "data": "10am-12pm; 2pm-4pm;", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }] } }], "Overrides": [{ "Name": "j4th2025", "Title": { "eng": { "n": "ind", "d": "Independence Day 2025" } }, "Date": "2025-07-04T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "j4th2026", "Title": { "eng": { "n": "ind", "d": "Independence Day 2026" } }, "Date": "2026-07-04T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "j4th2027", "Title": { "eng": { "n": "ind", "d": "Independence Day 2027" } }, "Date": "2027-07-04T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "xmas2025", "Title": { "eng": { "n": "xmas", "d": "Christmas Day 2025" } }, "Date": "2025-12-25T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "xmas2026", "Title": { "eng": { "n": "xmas", "d": "Christmas Day 2026" } }, "Date": "2026-12-25T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "xmas2027", "Title": { "eng": { "n": "xmas", "d": "Christmas Day 2027" } }, "Date": "2027-12-25T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "newyr2025", "Title": { "eng": { "n": "nyr", "d": "New Years Day 2025" } }, "Date": "2025-01-01T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "newyr2026", "Title": { "eng": { "n": "nyr", "d": "New Years Day 2026" } }, "Date": "2026-01-01T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "newyr2027", "Title": { "eng": { "n": "nyr", "d": "New Years Day 2027" } }, "Date": "2027-01-01T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }] }, "Agents": [] }, "general": { "AsOfUtc": "2024-12-09T02:12:19.439Z", "CorpRel": "unit.mnic@g8corp::UN-PATRTL-MAC", "ProviderName": "pcms", "DefaultTimeZone": "est", "RangeUtc": { "start": "2024-05-01T12:00:00Z", "end": "2024-05-31T12:00:00Z" }, "DefaultSchedule": { "Name": "PCMS Default Sales", "Title": { "eng": { "n": "phone-sales", "d": "Pcms Sales" } }, "Spans": [{ "Name": "apt", "Title": { "eng": { "n": "apt", "d": "Sales Appointments" } }, "Range": { "start": "2023-01-01T00:00:00Z", "end": "2100-01-01T00:00:00Z" }, "Monday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Tuesday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Wednesday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Thursday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Friday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Saturday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Sunday": { "data": "10am-12pm; 2pm-4pm;", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }] } }], "Overrides": [{ "Name": "j4th2025", "Title": { "eng": { "n": "ind", "d": "Independence Day 2025" } }, "Date": "2025-07-04T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "j4th2026", "Title": { "eng": { "n": "ind", "d": "Independence Day 2026" } }, "Date": "2026-07-04T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "j4th2027", "Title": { "eng": { "n": "ind", "d": "Independence Day 2027" } }, "Date": "2027-07-04T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "xmas2025", "Title": { "eng": { "n": "xmas", "d": "Christmas Day 2025" } }, "Date": "2025-12-25T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "xmas2026", "Title": { "eng": { "n": "xmas", "d": "Christmas Day 2026" } }, "Date": "2026-12-25T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "xmas2027", "Title": { "eng": { "n": "xmas", "d": "Christmas Day 2027" } }, "Date": "2027-12-25T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "newyr2025", "Title": { "eng": { "n": "nyr", "d": "New Years Day 2025" } }, "Date": "2025-01-01T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "newyr2026", "Title": { "eng": { "n": "nyr", "d": "New Years Day 2026" } }, "Date": "2026-01-01T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "newyr2027", "Title": { "eng": { "n": "nyr", "d": "New Years Day 2027" } }, "Date": "2027-01-01T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }] }, "Agents": [] }, "reserved": { "AsOfUtc": "2024-12-09T02:12:19.439Z", "CorpRel": "unit.mnic@g8corp::UN-PATRTL-MAC", "DefaultTimeZone": "est", "ProviderName": "pcms", "RangeUtc": { "start": "2024-05-01T12:00:00Z", "end": "2024-05-31T12:00:00Z" }, "Reservations": [] } };
const _week_data = _data.available.DefaultSchedule.Spans[0];
const sunday_data = _week_data.Sunday;
const monday_data = _week_data.Monday;
const tuesday_data = _week_data.Tuesday;
const wednesday_data = _week_data.Wednesday;
const thursday_data = _week_data.Thursday;
const friday_data = _week_data.Friday;
const saturday_data = _week_data.Monday;
const week_data = [sunday_data, monday_data, tuesday_data, wednesday_data, thursday_data, friday_data, saturday_data];

export class WeeklyScheduler extends Control {

  static styles = css`
:host { display: block; margin-top: 1em; margin-bottom: 1em; }
az-select {
  margin-left: 0.25em;
  margin-right: 0.25em;
}

.header {
  display: flex;
  align-items: end;
  justify-content: center;
  margin-bottom: 0.5em;
}

.daysContainer {
  display: grid;
  grid-template-columns: 7ch repeat(calc(var(--columns, 7) - 1), minmax(0, 1fr));
  gap: 1px;
  background-color: #d0d0d0;
}

.dayColumn {
  display: grid;
  grid-auto-rows: 0.35fr;
  .gap: 1px;
}

.dayCell {
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.dayCell.inView {
  border-top: 1px dashed #d0d0d0;
}

.dayCell.dayLabel {
  text-align: center;
  display: flex;
  flex-direction: column;
}

.legend .dayCell.dayLabel {
  background-color: var(--paper);
}

.dayLabel .dayName {
  font-variant: all-small-caps;
}

.dayLabel .month {
  width: 100%;
  font-size: 1.5em;
  font-weight: bold;
  font-variant: all-small-caps;
}

.dayCell.dayLabel .month:empty {
  background-color: var(--paper)
}

.dayCell.dayLabel .month:empty::after {
  content: '.';
  display: block;
  margin-right: -1px;
  color: var(--paper);
  background-color: var(--paper);
}

.dayCell.onTheHour.inView {
  border-top: 1px solid #c0c0c0;
}

.timeLabel.onTheHour.inView, .timeLabel.onTheHour:nth-last-child(2) {
  border-top: 1px solid #a0a0a0;
}

.timeLabel:not(.onTheHour) {
  opacity: 0.2;
  font-size: 0.9em;
}

.timeLabel .meridiemIndicator {
  opacity: 0.7;
  font-size: 0.8em;
  font-variant: small-caps;
}

.timeSlot {
  background-color: #e8e8e8;
}

.timeSlot:not(.inView) {
  background-color: #bbb;
}

.timeSlot.available {
  background-color: white;
  position: relative;
}

.available.selected {
  background-color: #a0ff90;
  border-radius: 5px;
}

.available .icon {
  position: absolute;
  bottom: 0.2em;
  left: 0.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  .border: 2px solid green;
  border-radius: 50%;
  box-shadow: 0px 0px 6px #caffc5;
  background-color: green;
  height: 1.5em;
  width: 1.5em;
  color: #caffc5;
  fill: #caffc5;
  font-weight: bold;
}

:not(.legend) .timeSlot.available:hover {
  background-color: #b0f0ff;
  cursor: pointer;
}

.r1 { font-size: var(--r1-fs);}
.r2 { font-size: var(--r2-fs);}
.r3 { font-size: var(--r3-fs);}
.r4 { font-size: var(--r4-fs);}
.r5 { font-size: var(--r5-fs);}
.r6 { font-size: var(--r6-fs);}

.ok-tab-btn { color: var(--s-ok-fg-ctl);  border-color: var(--s-ok-bor-color-ctl);}
.info-tab-btn { color: var(--s-info-fg-ctl); border-color: var(--s-info-bor-color-ctl);}
.warning-tab-btn { color: var(--s-warn-fg-ctl); border-color: var(--s-warn-bor-color-ctl);}
.alert-tab-btn { color: var(--s-alert-fg-ctl); border-color: var(--s-alert-bor-color-ctl);}
.error-tab-btn { color: var(--s-error-fg-ctl); border-color: var(--s-error-bor-color-ctl);}
`;

  static properties = {
    weekStartDay: { type: DAYS_OF_WEEK },
    showNumDays: { type: Number },
    currentWeekStart: { type: Date },
    selectedMonth: { type: Number },
    availableSlots: { type: Array },
    use24hourTime: { type: Boolean },
    maxSelected: { type: Number },
    selected: { type: Object },
  }

  #monthOptions = Object.values(MONTHS_OF_YEAR).map(monthIndex => html`<option value="${monthIndex}" title="${ALL_MONTH_NAMES[monthIndex]}"></option>`);
  #timeSlotsView = null;

  get daysView() {
    return Array.from({ length: this.showNumDays }).map((_, i) => {
      const currentDate = new Date(this.currentWeekStart);
      currentDate.setDate(this.currentWeekStart.getDate() + i);

      const name = currentDate.toLocaleDateString(undefined, { weekday: 'short' });
      const number = currentDate.getDate();
      const month = (i === 0 || number === 1) ? currentDate.toLocaleDateString(undefined, { month: "long" }) : undefined;
      return [month, name, number];
    });
  }

  get timeSlotsView() {
    if (this.#timeSlotsView) return this.#timeSlotsView;

    this.#timeSlotsView = [];
    let [startHour, startMinutes] = this.timeViewStartTime.split(':').map(Number);
    let [endHour, endMinutes] = this.timeViewEndTime.split(':').map(Number);

    const startMins = (startHour * 60) + startMinutes;
    const endMins = (endHour * 60) + endMinutes;

    const renderStartMins = startMins - this.timeViewRenderOffMins;
    const renderEndMins = endMins + this.timeViewRenderOffMins;

    let currentMins = renderStartMins;

    while (currentMins < renderEndMins) {
      const mins = Math.floor(currentMins % 60);
      const hours = Math.floor(currentMins / 60);
      const displayTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      const available = currentMins >= startMins && currentMins < endMins;
      this.#timeSlotsView.push([displayTime, currentMins, available]);
      currentMins += this.timeViewGranularityMins;
    }

    console.log(this.#timeSlotsView);
    return this.#timeSlotsView;
  }

  constructor() {
    super();
    this.weekStartDay = DAYS_OF_WEEK.MONDAY;
    this.showNumDays = 6; // default to Monday - Saturday
    this.currentWeekStart = this.#getStartOfWeek(new Date(2025, 6, 4));
    this.selectedMonth = this.currentWeekStart.getMonth();
    this.availableSlots = [];
    this.selectedEvents = [];
    this.timeViewStartTime = '10:00';
    this.timeViewEndTime = '20:00';
    this.timeViewGranularityMins = 30;
    this.timeViewRenderOffMins = 60;
    this.use24hourTime = false;
    this.maxSelected = 2;
  }

  #getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    const currentDay = startOfWeek.getDay();
    const dayDifference = (currentDay - this.weekStartDay + 7) % 7;

    startOfWeek.setDate(startOfWeek.getDate() - dayDifference);
    startOfWeek.setHours(0, 0, 0, 0);

    // console.log(date, this.weekStartDay, currentDay, dayDifference, startOfWeek,);

    return startOfWeek;
  }

  /**
   * Given (23:00, omitMinutesForWholeHours, omitMeridianSuffix), yields:
   *  - (23:00, true, false) => 11 pm
   *  - (23:00, false, false) => 11:00 pm
   *  - (23:00, true, true) => 11
   *  - (23:00, false, true) => 11:00
   * @param {string} time24 24-hour time HH:MM
   * @param {Object} options when omitMinutesForWholeHours=true omits minutes when 0, when omitMeridianSuffix=true, omits am/pm
   * @returns a formatted time string
   */
  #formatMeridianTime(time24, { omitMinutesForWholeHours = false, omitMeridianSuffix = false } = {}) {
    let [hour, mins] = time24.split(":").map(Number);
    const meridiemInd = hour < 12 ? "am" : "pm";
    const hour12 = hour % 12 || 12;

    let timeString = `${hour12}`;
    if (!(omitMinutesForWholeHours && mins === 0)) timeString += `:${mins.toString().padStart(2, "0")}`;
    if (!omitMeridianSuffix) timeString = html`${timeString}&nbsp;<span class="meridiemIndicator">${meridiemInd}</span>`

    return timeString;
  }

  #btnPreviousWeek() { }
  #btnMonthChange() { }
  #btnNextWeek() { }

  handleSelectEvent(event) {
    const eventIndex = this.selectedEvents.indexOf(event);
    if (eventIndex > -1) this.selectedEvents.splice(eventIndex, 1);
    else if (this.selectedEvents.length >= this.maxSelected) return;
    else this.selectedEvents.push(event);
    this.requestUpdate();
  }

  handleSlotHover(dayIndex, time) { }
  handleSlotHoverOut() { }

  renderControl() {
    return html`
<div class="scheduler">
  ${this.renderHeader()}
  ${this.renderTimeSlots()}
</div>
    `;
  }

  renderHeader() {
    return html`
<div class="header">
  <az-button title="Previous" @click="${this.#btnPreviousWeek}"></az-button>
  <az-select id="monthSelector" scope="this" @change="${this.#btnMonthChange}" value="${this.selectedMonth}">${this.#monthOptions}</az-select>
  <az-button title="Next" @click="${this.#btnNextWeek}"></az-button>
</div>
    `;
  }

  renderTimeSlots() {
    return html`
<div class="daysContainer">
  <div class="dayColumn legend">
    <div class="dayCell dayLabel">
      <div class="month">&nbsp;</div>
      <div class="dayName">&nbsp;</div>
      <div class="dayDate">&nbsp;</div>
    </div>
    ${this.renderTimeSlotsViewLabels()}
  </div>
  ${this.renderDayColumns()}
</div>
    `;
  }

  renderTimeSlotsViewLabels() {
    return this.timeSlotsView.map(([time24, mins, inView]) => {
      const onTheHour = mins % 60 === 0;
      const cls = [
        "dayCell",
        "timeLabel",
        inView ? "inView" : "",
        onTheHour ? "onTheHour" : "",
      ];
      let timeString = noContent;
      if (inView) {
        let hour = time24.split(":").map(Number)[0];
        if (this.use24hourTime) {
          timeString = hour.toString().padStart(2, "0");
          if (!onTheHour) timeString += `:${time24.split(":")[1]}`;
        } else timeString = this.#formatMeridianTime(time24, { omitMinutesForWholeHours: onTheHour, omitMeridianSuffix: !onTheHour });
      }
      return html`<div class="${cls.filter(isNonEmptyString).join(" ")}">${timeString}</div>`
    });
  }

  renderDayColumns() {
    return this.daysView.map(([month, dayName, dayNumber], weekIndex) => html`
<div class="dayColumn">
  <div class="dayCell dayLabel">
    <div class="month">${month}</div>
    <div class="dayName">${dayName}</div>
    <div class="dayDate">${dayNumber}</div>
  </div>
  ${this.renderTimeCells(dayNumber, weekIndex)}
</div>
    `)
  }

  renderTimeCells(dayNumber, weekIndex) {
    const todayOrAfter = true; // FIXME: Where is this data?
    const data = week_data[weekIndex]; // FIXME: data for the day
    const thisDayEvents = data.parsed;

    let toRender = [];
    for (let i = 0; i < this.timeSlotsView.length; i++) {
      const [time24, slotMins, inView] = this.timeSlotsView[i];
      let cellContent = noContent;
      let stl = noContent;
      let cls = ["dayCell", "timeSlot"];
      let rowSpan;
      let event;

      if (inView && todayOrAfter) {
        event = thisDayEvents.find(event => event.sta === slotMins);
        cls.push("inView");
        if (slotMins % 60 === 0) cls.push("onTheHour");
        if (event) {
          cellContent = html`<div>${event.disp.replace('-', ' - ')}</div>`;
          rowSpan = Math.floor(event.dur / this.timeViewGranularityMins);
          i += rowSpan - 1;
          stl = `grid-row: span ${rowSpan};`;
          cls.push("available");
          if (rowSpan > 1) cls.push("spanned");
        }
        const eventSelectedIndex = this.selectedEvents.indexOf(event);
        if (eventSelectedIndex > -1) {
          cls.push("selected");
          if (this.selectedEvents.length === 1) cellContent = html`${cellContent} <div class="icon"><svg viewBox="0 -960 960 960"><path d="M378-222 130-470l68-68 180 180 383-383 68 68-451 451Z"/></svg></div>`;
          else cellContent = html`${cellContent} <div class="icon"><span>${eventSelectedIndex + 1}</span></div>`
        }
      }

      toRender.push(html`
<div class="${cls.filter(isNonEmptyString).join(' ')}" style="${stl}" data-time="${time24}" data-day="${dayNumber}"
  @click="${event ? () => this.handleSelectEvent(event) : () => { }}"
  @mouseover="${() => this.handleSlotHover(dayNumber, time24)}"
  @mouseout="${() => this.handleSlotHoverOut()}">
${cellContent}
</div>
    `);
    }
    return toRender;
  }

}

window.customElements.define("az-weekly-scheduler", WeeklyScheduler);
