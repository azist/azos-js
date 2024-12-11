/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import "../../parts/button";
import "../../parts/select-field";
import { Control, css, html, noContent } from "../../ui";

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

const _data = { "available": { "AsOfUtc": "2024-12-09T02:12:19.439Z", "CorpRel": "unit.mnic@g8corp::UN-PATRTL-MAC", "ProviderName": "pcms", "DefaultTimeZone": "est", "RangeUtc": { "start": "2024-05-01T12:00:00Z", "end": "2024-05-31T12:00:00Z" }, "DefaultSchedule": { "Name": "PCMS Default Sales", "Title": { "eng": { "n": "phone-sales", "d": "Pcms Sales" } }, "Spans": [{ "Name": "apt", "Title": { "eng": { "n": "apt", "d": "Sales Appointments" } }, "Range": { "start": "2023-01-01T00:00:00Z", "end": "2100-01-01T00:00:00Z" }, "Monday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Tuesday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Wednesday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Thursday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Friday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Saturday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Sunday": { "data": "10am-12pm; 2pm-4pm;", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }] } }], "Overrides": [{ "Name": "j4th2025", "Title": { "eng": { "n": "ind", "d": "Independence Day 2025" } }, "Date": "2025-07-04T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "j4th2026", "Title": { "eng": { "n": "ind", "d": "Independence Day 2026" } }, "Date": "2026-07-04T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "j4th2027", "Title": { "eng": { "n": "ind", "d": "Independence Day 2027" } }, "Date": "2027-07-04T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "xmas2025", "Title": { "eng": { "n": "xmas", "d": "Christmas Day 2025" } }, "Date": "2025-12-25T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "xmas2026", "Title": { "eng": { "n": "xmas", "d": "Christmas Day 2026" } }, "Date": "2026-12-25T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "xmas2027", "Title": { "eng": { "n": "xmas", "d": "Christmas Day 2027" } }, "Date": "2027-12-25T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "newyr2025", "Title": { "eng": { "n": "nyr", "d": "New Years Day 2025" } }, "Date": "2025-01-01T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "newyr2026", "Title": { "eng": { "n": "nyr", "d": "New Years Day 2026" } }, "Date": "2026-01-01T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "newyr2027", "Title": { "eng": { "n": "nyr", "d": "New Years Day 2027" } }, "Date": "2027-01-01T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }] }, "Agents": [] }, "general": { "AsOfUtc": "2024-12-09T02:12:19.439Z", "CorpRel": "unit.mnic@g8corp::UN-PATRTL-MAC", "ProviderName": "pcms", "DefaultTimeZone": "est", "RangeUtc": { "start": "2024-05-01T12:00:00Z", "end": "2024-05-31T12:00:00Z" }, "DefaultSchedule": { "Name": "PCMS Default Sales", "Title": { "eng": { "n": "phone-sales", "d": "Pcms Sales" } }, "Spans": [{ "Name": "apt", "Title": { "eng": { "n": "apt", "d": "Sales Appointments" } }, "Range": { "start": "2023-01-01T00:00:00Z", "end": "2100-01-01T00:00:00Z" }, "Monday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Tuesday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Wednesday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Thursday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Friday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Saturday": { "data": "10am-12pm; 2pm-4pm; 6pm-8pm", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }, { "disp": "18:00-20:00", "dur": 120, "fin": 1199, "sta": 1080 }] }, "Sunday": { "data": "10am-12pm; 2pm-4pm;", "parsed": [{ "disp": "10:00-12:00", "dur": 120, "fin": 719, "sta": 600 }, { "disp": "14:00-16:00", "dur": 120, "fin": 959, "sta": 840 }] } }], "Overrides": [{ "Name": "j4th2025", "Title": { "eng": { "n": "ind", "d": "Independence Day 2025" } }, "Date": "2025-07-04T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "j4th2026", "Title": { "eng": { "n": "ind", "d": "Independence Day 2026" } }, "Date": "2026-07-04T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "j4th2027", "Title": { "eng": { "n": "ind", "d": "Independence Day 2027" } }, "Date": "2027-07-04T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "xmas2025", "Title": { "eng": { "n": "xmas", "d": "Christmas Day 2025" } }, "Date": "2025-12-25T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "xmas2026", "Title": { "eng": { "n": "xmas", "d": "Christmas Day 2026" } }, "Date": "2026-12-25T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "xmas2027", "Title": { "eng": { "n": "xmas", "d": "Christmas Day 2027" } }, "Date": "2027-12-25T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "newyr2025", "Title": { "eng": { "n": "nyr", "d": "New Years Day 2025" } }, "Date": "2025-01-01T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "newyr2026", "Title": { "eng": { "n": "nyr", "d": "New Years Day 2026" } }, "Date": "2026-01-01T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }, { "Name": "newyr2027", "Title": { "eng": { "n": "nyr", "d": "New Years Day 2027" } }, "Date": "2027-01-01T00:00:00+00:00", "Hours": { "data": null, "parsed": [] } }] }, "Agents": [] }, "reserved": { "AsOfUtc": "2024-12-09T02:12:19.439Z", "CorpRel": "unit.mnic@g8corp::UN-PATRTL-MAC", "DefaultTimeZone": "est", "ProviderName": "pcms", "RangeUtc": { "start": "2024-05-01T12:00:00Z", "end": "2024-05-31T12:00:00Z" }, "Reservations": [] } };
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

.days {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

.dayColumn {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.dayCell {
  display: block;
  height: 100%;
  box-sizing: border-box;
  flex: 1;
  position: relative;
}

.dayColumn .dayLabel {
  text-align: center;
  display: flex;
  flex-direction: column;
}

.dayColumn .dayLabel .month:empty::after {
  content: '_';
  visibility: hidden;
  display: block;
}

.dayColumn.legend {
  text-align: right;
  flex: 0.5;
  }

.dayColumn.legend .timeLabel {
  padding-right: 1em;
}

.dayColumn .dayCell::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  height: calc(100% - 1px);
  width: calc(100% - 1px);
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

.dayColumn .timeSlot.inView {
  background-color: white;
}

.dayColumn .timeSlot:not(.inView) {
  background-color: #bbb;
}

z.dayColumn .timeSlot:not(.inView) {
  background-color: #ccc;
}

:not(.legend) .timeSlot.inView:hover {
  background-color: #ccc;
}

.r1 { font-size: var(--r1-fs);}
.r2 { font-size: var(--r2-fs);}
.r3 { font-size: var(--r3-fs);}
.r4 { font-size: var(--r4-fs);}
.r5 { font-size: var(--r5-fs);}
.r6 { font-size: var(--r6-fs);}

.ok-tab-btn-container { border-bottom-color: var(--s-ok-bor-color-ctl); }
.info-tab-btn-container { border-bottom-color: var(--s-info-bor-color-ctl); }
.warning-tab-btn-container { border-bottom-color: var(--s-warn-bor-color-ctl); }
.alert-tab-btn-container { border-bottom-color: var(--s-alert-bor-color-ctl); }
.error-tab-btn-container { border-bottom-color: var(--s-error-bor-color-ctl); }

.ok-tab-btn { color: var(--s-ok-fg-ctl);  border-color: var(--s-ok-bor-color-ctl);}
.info-tab-btn { color: var(--s-info-fg-ctl); border-color: var(--s-info-bor-color-ctl);}
.warning-tab-btn { color: var(--s-warn-fg-ctl); border-color: var(--s-warn-bor-color-ctl);}
.alert-tab-btn { color: var(--s-alert-fg-ctl); border-color: var(--s-alert-bor-color-ctl);}
.error-tab-btn { color: var(--s-error-fg-ctl); border-color: var(--s-error-bor-color-ctl);}
`;

  static properties = {
    currentWeekStart: { type: Date },
    weekStartDay: { type: DAYS_OF_WEEK },
    showNumDays: { type: Number },
    selectedMonth: { type: Number },
    availableSlots: { type: Array },
    selectedSlot: { type: Object },
  }

  #monthOptions = Object.values(MONTHS_OF_YEAR).map(monthIndex => html`<az-select-option value="${monthIndex}" title="${ALL_MONTH_NAMES[monthIndex]}"></az-select-option>`);
  #selectedAppointment = null;

  constructor() {
    super();
    this.weekStartDay = DAYS_OF_WEEK.MONDAY;
    this.showNumDays = 6; // default to Monday - Saturday
    this.currentWeekStart = this.#getStartOfWeek(new Date(2025, 6, 4));
    this.selectedMonth = this.currentWeekStart.getMonth();
    this.availableSlots = [];
    this.selectedSlot = null;
    this.timeViewStartTime = '10:00';
    this.timeViewEndTime = '20:00';
    this.timeViewGranularityMins = 30;
    this.timeViewRenderOffMins = 60;
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

  connectedCallback() {
    super.connectedCallback();
  }

  #btnPreviousWeek() { }
  #btnMonthChange() { }
  #btnNextWeek() { }

  get #daysView() {
    return Array.from({ length: this.showNumDays }).map((_, i) => {
      const currentDate = new Date(this.currentWeekStart);
      currentDate.setDate(this.currentWeekStart.getDate() + i);

      const name = currentDate.toLocaleDateString(undefined, { weekday: 'short' });
      const number = currentDate.getDate();
      const month = (i === 0 || number === 1) ? currentDate.toLocaleDateString(undefined, { month: "long" }) : undefined;
      return [month, name, number];
    });
  }

  #timeSlotsView = null;
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

    while (currentMins <= renderEndMins) {
      const mins = Math.floor(currentMins % 60);
      const hours = Math.floor(currentMins / 60);
      const displayTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      const available = currentMins >= startMins && currentMins < endMins;
      this.#timeSlotsView.push([displayTime, currentMins, available]);
      currentMins += this.timeViewGranularityMins;
    }
    return this.#timeSlotsView;
  }

  handleSlotSelect(slot) { if (slot.available) this.selectedSlot = slot; }

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
<div class="days">
  <div class="dayColumn legend">
    <div class="dayLabel">
      <div class="month">&nbsp;</div>
      <div class="day-name">&nbsp;</div>
      <div class="day-date">&nbsp;</div>
    </div>
    ${this.renderTimeSlotsViewLabels()}
  </div>
  ${this.renderDayColumns()}
</div>
    `;
  }

  renderTimeSlotsViewLabels() {
    return this.timeSlotsView.map(([displayTime, mins, inView]) => html`
<div class="dayCell timeLabel ${inView ? "inView" : ""}">${displayTime}</div>
    `);
  }

  renderDayColumns() {
    return this.#daysView.map(([month, dayName, dayNumber], weekIndex) => html`
<div class="dayColumn">
  <div class="dayLabel">
    <div class="month">${month}</div>
    <div class="day-name">${dayName}</div>
    <div class="day-date">${dayNumber}</div>
  </div>
  ${this.renderTimeCells(dayNumber, weekIndex)}
</div>
    `)
  }

  renderTimeCells(dayNumber, weekIndex) {
    const data = week_data[weekIndex]
    const weekAppts = data.parsed;

    let toRender = [];
    for (let i = 0; i < this.timeSlotsView.length - 1; i++) {
      let stl = null;
      const [time, mins, inView] = this.timeSlotsView[i];

      if (inView) {
        const nowApptStart = weekAppts.find(appt => appt.sta === mins);
        let rowSpan;
        if (nowApptStart) {
          rowSpan = Math.floor(nowApptStart.dur / this.timeViewGranularityMins);
          i += rowSpan - 1;
        }
        stl = rowSpan ? `flex: ${rowSpan}` : noContent;
        console.log('now', nowApptStart, rowSpan, i);
      }

      toRender.push(html`
<div class="dayCell timeSlot ${inView ? "inView" : ""}" style="${stl}" data-time="${time}" data-day="${dayNumber}"
  @mouseover="${() => this.handleSlotHover(dayNumber, time)}"
  @mouseout="${() => this.handleSlotHoverOut()}">
  &nbsp;
</div>
    `);
    }
    return toRender;
  }

}

window.customElements.define("az-weekly-scheduler", WeeklyScheduler);
