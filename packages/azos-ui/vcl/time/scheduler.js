/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Control, css, html, noContent } from "../../ui";
import * as types from "azos/types";
import * as aver from "azos/aver";

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

/** The scheduling item belonging on the schedule */
class SchedulingItem {
  static #seed = 0;

  #id = ++SchedulingItem.#seed;
  #day = null;
  #caption = null;
  #startTimeMins = 0;
  #endTimeMins = 0;
  #durationMins = 0;
  #agent = null;

  get id() { return this.#id; }
  get day() { return this.#day; }
  get caption() { return this.#caption; }
  get startTimeMins() { return this.#startTimeMins; }
  get endTimeMins() { return this.#endTimeMins; }
  get durationMins() { return this.#durationMins; }
  get agent() { return this.#agent; }

  constructor({ caption, day, startTimeMins, endTimeMins, agent, durationMins } = {}) {
    if (caption !== null && !types.isNonEmptyString(caption) && !types.isFunction(caption)) aver.isNonEmptyString(caption);
    this.#caption = caption;
    this.#day = aver.isDate(day);
    this.#startTimeMins = aver.isNumber(startTimeMins);
    this.#endTimeMins = aver.isNumber(endTimeMins);
    this.#durationMins = aver.isNumber(durationMins);
    this.#agent = aver.isObject(agent);
  }
}

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
  grid-template-rows: repeat(var(--rows, 31), minmax(3ch, 0.35fr));
  gap: 1px;
  .background-color: #d0d0d0;
}

.dayColumn {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: 1 / span max;
  background-color: #d0d0d0;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
}

.dayLabel {
  text-align: center;
  display: flex;
  flex-direction: column;
  grid-row: span 3;
}

.legend .dayLabel {
  background-color: var(--paper);
}

.dayLabel .dayName {
  font-variant: all-small-caps;
}

.dayLabel .year {
  width: 100%;
  font-weight: bold;
}

.dayLabel .month {
  width: 100%;
  font-weight: bold;
  font-variant: all-small-caps;
}

.dayLabel .month:empty,
.dayLabel .year:empty {
  background-color: var(--paper)
}

.dayLabel .month:empty::after,
.dayLabel .year:empty::after {
  content: '.';
  display: block;
  margin-right: -1px;
  color: var(--paper);
  background-color: var(--paper);
}

.timeCell {
  container-type: size;
  grid-row: span 1;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  overflow: hidden;
}

.timeCell.inView {
  border-top: 1px dashed #d0d0d0;
}

.timeCell.onTheHour.inView {
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
  padding: 0 4px 4px 0;
  overflow: hidden;
}

.timeSlot:not(.inView) {
  background-color: #bbb;
}

.timeSlot.available .item {
  position: relative;
  height: 100%;
  width: 100%;
  background: linear-gradient(0deg, #f0f8f0, white);
  border-left: 4px solid green;
  border-radius: 5px;
  box-shadow: 0 0 6px  #a0a0a0;
  font-size: clamp(10px, 15cqmin, 18px);
  text-align: center;
}

.available .item.selected {
  background-color: #a0ff90;
  border-radius: 5px;
}

.available .item.selected .icon {
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
  height: 1.2em;
  width: 1.2em;
  color: #caffc5;
  fill: #caffc5;
  font-weight: bold;
  opacity: 0.75;
}

.timeSlot.available:hover .item {
  background: #b0f0ff;
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

  /**
   * Effective Dates: If null, provides the start/end dates of the provided data.
   * Enabled Dates: If null, defaults to effective date range. Limits item selection to this range.
   * View Dates: The range of time for where to view items. Defaults to "Work Week" (i.e., Monday - Saturday)
   */
  static properties = {
    effectiveStartDate: { type: Date },
    effectiveEndDate: { type: Date },

    enabledStartDate: { type: Date },
    enabledEndDate: { type: Date },

    viewStartDay: { type: DAYS_OF_WEEK },
    viewNumDays: { type: Number },
    viewStartDate: { type: Date },
    viewEndDate: { type: Date },

    maxSelectedItems: { type: Number },
    selectedItems: { type: Object },

    use24hourTime: { type: Boolean },
    timeViewGranularityMins: { type: Number },
  }

  #timeViewGranularityMins = null;
  get timeViewGranularityMins() { return this.#timeViewGranularityMins; }
  set timeViewGranularityMins(v) { throw Error("Unimplemented--anything outside of 30 min causes infinite loop.") }

  /** The date of the first scheduling item or "today" if no items. */
  #effectiveStartDate = null;
  get effectiveStartDate() {
    if (this.#effectiveStartDate) return this.#effectiveStartDate;
    return this.#effectiveStartDate = this.schedulingItemsByDay.length ? this.schedulingItemsByDay[0].day : new Date();
  }

  set effectiveStartDate(v) {
    const oldViewValue = this.viewStartDate;
    const oldValue = this.effectiveStartDate;
    this.#effectiveStartDate = aver.isDate(v);
    this.requestUpdate("effectiveStartDate", oldValue);
    this.requestUpdate("viewStartDate", oldViewValue);
  }

  /** The date of the last scheduling item or "today" if no items. */
  #effectiveEndDate = null;
  get effectiveEndDate() {
    if (this.#effectiveEndDate) return this.#effectiveEndDate;
    return this.#effectiveEndDate = this.schedulingItemsByDay.length ? this.schedulingItemsByDay[this.schedulingItemsByDay.length - 1].day : new Date();
  }

  set effectiveEndDate(v) {
    const oldViewValue = this.viewEndDate;
    const oldValue = this.#effectiveEndDate;
    this.#effectiveEndDate = aver.isDate(v);
    this.requestUpdate("effectiveEndDate", oldValue);
    this.requestUpdate("viewEndDate", oldViewValue);
  }

  #viewStartDay = null;
  get viewStartDay() { return this.#viewStartDay; }
  set viewStartDay(v) {
    aver.isTrue(v >= 0 && v <= 7);
    const oldValue = this.#viewStartDay;
    this.#viewStartDay = v;
    this.requestUpdate("viewStartDay", oldValue);
  }

  /** The View's Starting Date Taking into account effect start date beginning mid-week */
  get viewStartDate() {
    const startOfWeek = new Date(this.effectiveStartDate);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + this.viewStartDay);
    return startOfWeek;
  }

  /** The View's Ending Date Taking into account effect end date ending mid-week */
  get viewEndDate() {
    const endOfWeek = new Date(this.viewStartDate);
    endOfWeek.setHours(23, 59, 59, 99);
    endOfWeek.setDate(this.viewStartDate.getDate() + this.viewNumDays);
    return endOfWeek;
  }

  #monthOptions = null;
  get monthOptions() {
    if (this.#monthOptions) return this.#monthOptions;
    this.#monthOptions = Object.values(MONTHS_OF_YEAR).map(monthIndex => html`<option value="${monthIndex}" title="${ALL_MONTH_NAMES[monthIndex]}"></option>`)
    return this.#monthOptions;
  }

  #daysView = null;
  get daysView() {
    if (this.#daysView) return this.#daysView;

    let prevYear, prevMonthNumber;
    this.#daysView = Array.from({ length: this.viewNumDays }).map((_, i) => {
      const date = new Date(this.viewStartDate);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + i);

      const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
      const dayNumber = date.getDate();
      const dayNumberOfWeek = date.getDay();
      const monthNumber = date.getMonth();

      let monthName, year;
      if (prevMonthNumber === undefined || prevMonthNumber !== monthNumber) {
        prevMonthNumber = monthNumber;
        monthName = date.toLocaleDateString(undefined, { month: "long" });
      }
      if (prevYear === undefined || prevYear !== date.getFullYear()) {
        year = date.getFullYear();
        prevYear = year;
      }
      return { date, dayName, dayNumber, dayNumberOfWeek, monthNumber, monthName, year, };
    });
    return this.#daysView;
  }

  #timeSlotsView = null;
  get timeSlotsView() {
    if (this.#timeSlotsView) return this.#timeSlotsView;

    this.#timeSlotsView = [];
    const renderStartMins = this.timeViewStartMins - this.timeViewRenderOffMins;
    const renderEndMins = this.timeViewEndMins + this.timeViewRenderOffMins;

    let currentMins = renderStartMins;

    while (currentMins < renderEndMins) {
      const mins = Math.floor(currentMins % 60);
      const hours = Math.floor(currentMins / 60);
      const displayTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      const available = currentMins >= this.timeViewStartMins && currentMins < this.timeViewEndMins;
      this.#timeSlotsView.push([displayTime, currentMins, available]);
      currentMins += this.timeViewGranularityMins;
    }

    // console.table(this.#timeSlotsView);
    return this.#timeSlotsView;
  }

  /** The schedule's item dataset */
  #schedulingItemsByDay = [];
  get schedulingItemsByDay() { return this.#schedulingItemsByDay; }
  set schedulingItemsByDay(v) {
    const oldValue = this.#schedulingItemsByDay;
    v.forEach(({ day: schDay, items }) => {
      items.forEach((item) => {
        const { sta, fin, dur, agent } = item;
        this.addItem(schDay, {
          caption: null, // auto-generate at time of render
          startTimeMins: sta,
          endTimeMins: fin,
          durationMins: dur,
          day: schDay,
          agent
        });
      });
    });
    console.log("schedulingItemsByDay", v, this.#schedulingItemsByDay);
    // this.#updateViewProperties(); // FIXME: Set view properties to null
    this.requestUpdate("schedulingItemsByDay", oldValue);
  }

  constructor() {
    super();
    this.viewStartDay = DAYS_OF_WEEK.MONDAY;
    this.viewNumDays = 6; // default to Monday - Saturday
    this.selectedItems = [];

    this.#updateViewProperties();

    this.use24hourTime = false;
    this.timeViewRenderOffMins = 60;
    this.#timeViewGranularityMins = 30;
    this.maxSelectedItems = 2;
  }

  #updateViewProperties() {
    this.timeViewStartMins = this.#calculateMinStartTime() ?? 9 * 60;
    this.timeViewEndMins = this.#calculateMaxEndTime() ?? 17 * 60;
  }

  #calculateMinStartTime() {
    let minTime = Infinity;
    this.schedulingItemsByDay.forEach(({ items }) => {
      if (!items.length) return;
      const startTime = items[0].sta;
      if (startTime < minTime) minTime = startTime;
    });
    return minTime === Infinity ? null : minTime;
  }

  #calculateMaxEndTime() {
    let maxTime = 0;
    this.schedulingItemsByDay.forEach(({ items }) => {
      if (!items.length) return;
      const endTime = items[items.length - 1].fin;
      if (endTime > maxTime) maxTime = endTime;
    });
    return maxTime === 0 ? null : maxTime;
  }

  calculateViewStartDate(startDate) {
    const startOfWeek = new Date(startDate);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + this.viewStartDay);
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

  #handleSelectItem(item) {
    const itemIndex = this.selectedItems.indexOf(item);
    if (itemIndex > -1) this.selectedItems.splice(itemIndex, 1);
    else {
      if (this.selectedItems.length >= this.maxSelectedItems) {
        if (this.maxSelectedItems > 1) return;
        else this.selectedItems.length = 0;
      }
      this.selectedItems.push(item);
    }

    this.requestUpdate();
  }

  #handleSlotHover(dayIndex, time) { }
  #handleSlotHoverOut() { }

  addItem(schedulingDay, item) {
    // FIXME: Finish this :)
    aver.isDate(schedulingDay);
    if (types.isObjectOrArray(item)) item = new SchedulingItem(item);
    aver.isOf(item, SchedulingItem);
    console.log(item);

    let found = this.schedulingItemsByDay.find(d => schedulingDay.toLocaleDateString() === d.day.toLocaleDateString());
    if (!found) {
      found = {
        day: schedulingDay,
        items: [],
      };
      this.schedulingItemsByDay.push(found);
      this.schedulingItemsByDay.sort((a, b) => new Date(a.day) - new Date(b.day));
    }

    if (!types.isArray(found.items)) found.items = [];
    found.items.push(item);
    this.#updateViewProperties(null)
    this.requestUpdate();
  }

  renderControl() {
    return html`
<div class="scheduler">
  ${this.renderHeader()}
  ${this.renderTimeSlots()}
</div>
    `;
  }

  renderHeader() {
    return html``;
    /*{ <div class="header">
      <az-button title="Previous" @click="${this.#btnPreviousWeek}"></az-button>
      <az-select id="monthSelector" scope="this" @change="${this.#btnMonthChange}" value="${this.inViewMonth}">${this.#monthOptions}</az-select>
      <az-button title="Next" @click="${this.#btnNextWeek}"></az-button>
    </div>
        `; }*/
  }

  renderTimeSlots() {
    return html`
<div class="daysContainer" style="--columns:${this.viewNumDays + 1};--rows:${this.timeSlotsView.length + 3}">
  <div class="dayColumn legend">
    <div class="dayLabel">
      <div class="year">&nbsp;</div>
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
        "timeCell",
        "timeLabel",
        inView ? "inView" : "",
        onTheHour ? "onTheHour" : "",
      ];
      let timeString = noContent;
      if (inView) {
        if (this.use24hourTime) {
          const time24Split = time24.split(":");
          timeString = time24Split[0];
          if (!onTheHour) timeString += `:${time24Split[1]}`;
        } else timeString = this.#formatMeridianTime(time24, { omitMinutesForWholeHours: onTheHour, omitMeridianSuffix: !onTheHour });
      }
      return html`<div class="${cls.filter(types.isNonEmptyString).join(" ")}">${timeString}</div>`
    });
  }

  renderDayColumns() {
    // {dayName, dayNumber, dayNumberOfWeek, monthNumber, monthName, year, date}
    return this.daysView.map(({ dayName, dayNumber, monthName, year, date }) => html`
<div class="dayColumn">
  <div class="dayLabel">
    <div class="year">${year}</div>
    <div class="month">${monthName}</div>
    <div class="dayName">${dayName}</div>
    <div class="dayDate">${dayNumber}</div>
  </div>
  ${this.renderTimeCells(date)}
</div>
    `)
  }

  calculateTheDaysItems(date) {
    const found = this.schedulingItemsByDay.find(day => day.day.toDateString() === date.toDateString());
    console.log("found day:", found, this.schedulingItemsByDay);
    return found?.items;
  }

  formatMins(minutes) {
    minutes = Math.round(minutes / 10) * 10;
    const mins = minutes % 60;
    const hours = Math.floor(minutes / 60);
    const time24 = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    // console.log(minutes, mins, hours, time24);
    if (this.use24hourTime) return time24;
    return this.#formatMeridianTime(time24);
  }

  renderTimeCells(date) {
    const todayOrAfter = true; // FIXME: Where is this data?
    const thisDayItems = this.calculateTheDaysItems(date);

    let toRender = [];
    for (let i = 0; i < this.timeSlotsView.length; i++) {
      const [time24, slotMins, inView] = this.timeSlotsView[i];
      let cellContent = noContent;
      let stl = noContent;
      let cls = ["timeCell", "timeSlot"];
      let rowSpan;
      let foundItem;

      if (inView && todayOrAfter) {
        cls.push("inView");
        if (slotMins % 60 === 0) cls.push("onTheHour");

        foundItem = thisDayItems?.find(item => item.startTimeMins === slotMins);
        if (foundItem) {
          console.log("found:", foundItem);
          rowSpan = Math.floor(foundItem.durationMins / this.timeViewGranularityMins);
          i += rowSpan - 1;
          stl = `grid-row: span ${rowSpan};`;
          cls.push("available");
          if (rowSpan > 1) cls.push("spanned");
          cellContent = this.renderSchedulingItem(foundItem);
        }
      }

      toRender.push(html`
<div class="${cls.filter(types.isNonEmptyString).join(' ')}" style="${stl}" data-time="${time24}" data-day="${date}"
  @click="${foundItem ? () => this.#handleSelectItem(foundItem) : () => { }}"
  @mouseover="${() => this.#handleSlotHover(date, time24)}"
  @mouseout="${() => this.#handleSlotHoverOut()}">
  ${cellContent}
</div>
    `);
    }
    return toRender;
  }

  renderSchedulingItem(schItem) {
    let iconContent = noContent;
    let cls = ["item"];
    const eventSelectedIndex = this.selectedItems.indexOf(schItem);
    if (eventSelectedIndex > -1) {
      cls.push("selected");
      iconContent = html`
            <div class="icon">
            ${this.selectedItems.length === 1 ?
          html`<svg viewBox="0 -960 960 960"><path d="M378-222 130-470l68-68 180 180 383-383 68 68-451 451Z"/></svg>`
          : html`<span>${eventSelectedIndex + 1}</span>`
        }
            </div>`;
    }
    return html`
<div class="${cls.filter(types.isNonEmptyString).join(" ")}">
  ${this.renderCaption(schItem)}
  ${iconContent}
</div>
    `;
  }

  renderCaption(schItem) {
    let caption = noContent;
    const [startTime, endTime] = this.#formatStartEndTimes(schItem);

    if (types.isFunction(schItem.caption)) caption = schItem.caption(startTime, endTime);
    else if (types.isNonEmptyString(schItem.caption)) caption = schItem.caption;
    else caption = this.renderDefaultCaption(schItem);

    return html`
  <div class="caption">
    ${caption}
  </div>
    `;
  }

  renderDefaultCaption(schItem) {
    const [startTime, endTime] = this.#formatStartEndTimes(schItem);
    return html`${startTime} <span class="sep">-</span> ${endTime}`;
  }

  #formatStartEndTimes(schItem) {
    const startTime = this.formatMins(schItem.startTimeMins);
    const endTime = this.formatMins(schItem.startTimeMins + schItem.durationMins);
    return [startTime, endTime];
  }

}

window.customElements.define("az-weekly-scheduler", WeeklyScheduler);
