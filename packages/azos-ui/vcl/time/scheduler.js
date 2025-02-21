/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
import * as types from "azos/types";

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

export class TimeBlockPicker extends Control {

  static styles = css`
:host{display:block;margin-top:1em;margin-bottom:1em;}
.nav {
  grid-row: 1;
  grid-column: 2 / span max;
  display: flex;
  align-items: center;
  gap: 1ch;
  margin-bottom: 0.5ch;
}
.todayBtn, .viewBtn{
  margin: 0;
  padding: 0.5cap;
  box-sizing: content-box;
}
.todayBtn, .todayBtn svg, .viewBtn, .viewBtn svg{
  height: var(--height);
  line-height: var(--height);
}
.viewBtn.prev svg{margin-left:-0.2ch;margin-right:0.2ch;}
.viewBtn.next svg{margin-left:0.2ch;margin-right:-0.2ch;}
.todayBtn {
  --height: 2.25cap;
  font-size: 0.8em;
  font-weight: bolder;
  display: inline-flex;
  align-items: center;
  border-radius: 8px;
  color: var(--ink);
  border: 1px solid #ccc;
  padding: 0.75ch 2ch 0.75ch 1.4ch;
  gap: 0.5ch;
}
.viewBtn {
  --height: 3cap;
  border-radius: 50%;
  background-color: hsl(from var(--paper) h s max(calc(l - 10), 10));
  color: var(--ink);
  border: none;
}
.todayBtn:hover, .viewBtn:hover {
  filter: brightness(90%);
  cursor: pointer;
}

.daysContainer {
  display: grid;
  grid-template-columns: 6ch repeat(calc(var(--columns, 7) - 1), minmax(0, 1fr));
  grid-template-rows: auto auto repeat(var(--rows, 31), minmax(3ch, 0.35fr));
  column-gap: 1px;
}

.dayColumn {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: 2 / span max;
  overflow: hidden;
}

/** background */
:not(.legend) > .dayLabel div, .timeLabel.inView { background-color: #d0d0d0; }
.timeSlot { background-color: #e8e8e8; }
.timeSlot:not(.inView) { background-color: #bbb; }

/** column-gap handles vertical lines, these are the horizontal */
.timeCell { border-top: 1px dashed #ccc; }
.timeCell:not(.inView) { border-top-color: #ccc; }
.timeCell.onTheHour { border-top: 1px solid #aaa; }
.timeCell.onTheHour:not(.inView) { border-top-color: #aaa; }
.timeLabel.inView { border-left: 1px solid #aaa; }
.timeLabel:not(.onTheHour) { border-top-color: #e5e5e5; }
.timeLabel:not(.inView), .dayLabel + .timeCell { border-top: revert; }
.timeLabel:nth-last-child(3) { border-bottom: 1px solid #aaa; }

.dayLabel {
  text-align: center;
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: end;
  user-select
  : none;
}

.dayLabel .year {
  font-weight: bold;
  writing-mode: tb;
  rotate: 180deg;
  position: absolute;
  left: 0.2em;
  bottom: 0.1em;
  background: none!important;
  color: #989898;
}

.dayLabel .month {
  width: 100%;
  font-weight: bold;
  font-variant: all-small-caps;
  border-radius: 10px 10px 0 0;
}

.dayLabel .dayDate {
  font-variant: all-small-caps;
  padding-bottom: 0.2em;
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

.timeLabel:not(.onTheHour) {
  color: #bebebe;
  font-size: 0.9em;
}

.timeLabel .meridiemIndicator {
  color: #929292;
  font-size: 0.8em;
  font-variant: small-caps;
}

.timeSlot.available {
  padding: 0 4px 4px 0;
  overflow: hidden;
}

.timeSlot.available .item {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
  width: 100%;
  background: linear-gradient(0deg, #10a0ff, #20ceff);
  color: #fff;
  border-left: 4px solid #2080e8;
  border-radius: 5px;
  box-shadow: 0 0 6px  #a0a0a0;
  font-size: clamp(10px, 15cqmin, 18px);
  text-align: center;
}

.available .item.selected {
  background: #30d000;
  border-radius: 5px;
}

.available .item.selected .icon {
  position: absolute;
  bottom: 0.2em;
  left: 0.2em;
  display: flex;
  align-items: center;
  justify-content: center;
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
  cursor: pointer;
  filter: brightness(1.1);
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

@media only screen and (max-width: 700px) {
  .timeLabel:not(.onTheHour) { color: #d0d0d0 !important; }
  .year { display: none; }
  .month { border-radius: 5px 5px 0 0 !important;}
}
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
    selectedItems: { type: Array },

    use24HourTime: { type: Boolean },
    timeViewGranularityMins: { type: Number },
  }

  #timeViewGranularityMins = null;
  get timeViewGranularityMins() { return this.#timeViewGranularityMins; }
  set timeViewGranularityMins(v) { throw Error("Unimplemented--anything outside of 30 min causes infinite loop.") }

  /** The date of the first scheduling item or "today" if no items. */
  #effectiveStartDate = null;
  get effectiveStartDate() {
    if (this.#effectiveStartDate) return this.#effectiveStartDate;
    this.#effectiveStartDate = this.itemsByDay.length ? this.itemsByDay[0].day : new Date();
    this.#viewStartDate = null;
    this.requestUpdate();
    return this.#effectiveStartDate;
  }
  set effectiveStartDate(v) {
    this.#effectiveStartDate = aver.isDate(v);
    this.#viewStartDate = null;
    this.requestUpdate();
  }

  #enabledStartDate = null;
  get enabledStartDate() {
    if (this.#enabledStartDate) return this.#enabledStartDate;
    this.#enabledStartDate = new Date();
    this.requestUpdate();
    return this.#enabledStartDate;
  }
  set enabledStartDate(v) {
    if (types.isString(v)) v = this.#formatStrToDate(v);
    this.#enabledStartDate = aver.isDate(v);
    this.requestUpdate();
  }

  #enabledEndDate = null;
  get enabledEndDate() {
    if (this.#enabledEndDate) return this.#enabledEndDate;
    this.#enabledEndDate = this.itemsByDay.length ? this.itemsByDay[this.itemsByDay.length - 1].day : null;
    this.requestUpdate();
    return this.#enabledEndDate;
  }
  set enabledEndDate(v) {
    if (types.isString(v)) v = this.#formatStrToDate(v);
    this.#enabledEndDate = aver.isDate(v);
    this.requestUpdate();
  }

  /** The date of the last scheduling item or "today" if no items. */
  #effectiveEndDate = null;
  get effectiveEndDate() {
    if (this.#effectiveEndDate) return this.#effectiveEndDate;
    return this.#effectiveEndDate = this.itemsByDay.length ? this.itemsByDay[this.itemsByDay.length - 1].day : new Date();
  }
  set effectiveEndDate(v) {
    this.#effectiveEndDate = aver.isDate(v);
    this.requestUpdate();
  }

  #viewStartDay = null;
  get viewStartDay() { return this.#viewStartDay; }
  set viewStartDay(v) {
    aver.isTrue(v >= 0 && v < 7);
    this.#viewStartDay = v;
    this.requestUpdate();
  }

  #viewStartDate = null;
  get viewStartDate() {
    if (this.#viewStartDate) return this.#viewStartDate;
    /** First-time logic: The View's Starting Date Taking into account effect start date beginning mid-week */
    this.#viewStartDate = this.#calculateViewStartDate(this.effectiveStartDate);
    this.requestUpdate();
    return this.#viewStartDate;
  }
  set viewStartDate(v) {
    aver.isDate(v);
    v.setHours(0, 0, 0, 0);
    aver.isTrue(v.getDay() === this.viewStartDay, `Start Date should start on ${this.viewStartDay}, but was ${v.getDay()}`);
    this.#setViewPropertiesForRecompute();

    this.#viewStartDate = v;
    this.requestUpdate();
  }

  /** The View's Ending Date Taking into account effect end date ending mid-week */
  get viewEndDate() {
    const endOfWeek = new Date(this.viewStartDate);
    endOfWeek.setHours(23, 59, 59, 99);
    endOfWeek.setDate(this.viewStartDate.getDate() + this.viewNumDays - 1);
    return endOfWeek;
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

    const viewStartTimeMins = this.#calculateViewStartTime() ?? 9 * 60;
    const viewEndTimeMins = this.#calculateViewEndTime() ?? 17 * 60;

    this.#timeSlotsView = [];
    const renderStartMins = viewStartTimeMins - this.timeViewRenderOffMins;
    const renderEndMins = viewEndTimeMins + this.timeViewRenderOffMins;

    let currentMins = renderStartMins;

    while (currentMins < renderEndMins) {
      const available = currentMins >= viewStartTimeMins && currentMins < viewEndTimeMins;
      this.#timeSlotsView.push([currentMins, available]);
      currentMins += this.timeViewGranularityMins;
    }

    // console.table(this.#timeSlotsView);
    return this.#timeSlotsView;
  }

  /** The schedule's dataset */
  #itemsByDay = [];
  get itemsByDay() { return this.#itemsByDay; }
  get items() { return this.#itemsByDay.flatMap(({ items }) => items); }

  constructor() {
    super();
    this.viewStartDay = DAYS_OF_WEEK.MONDAY;
    this.viewNumDays = 6; // default to Monday - Saturday
    this.selectedItems = [];

    this.use24HourTime = false;
    this.timeViewRenderOffMins = 60;
    this.#timeViewGranularityMins = 30;
    this.maxSelectedItems = 2;

    this.#setViewPropertiesForRecompute();
  }

  #setViewPropertiesForRecompute() {
    this.#daysView = null;
    this.#timeSlotsView = null;
    this.#effectiveStartDate = null;
    this.#effectiveEndDate = null;
    this.#viewStartDate = null;
  }

  /** Calculate the day starting this week based on `viewStartDay` */
  #calculateViewStartDate(startDate) {
    const startOfWeek = new Date(startDate);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + this.viewStartDay);
    return startOfWeek;
  }

  #calculateViewStartTime() {
    let minTime = Infinity;
    const viewDays = this.itemsByDay.filter(d => d.day.getTime() >= this.viewStartDate.getTime() && d.day.getTime() <= this.viewEndDate.getTime());

    viewDays.forEach(({ items }) => {
      if (!items.length) return;
      const startTime = items[0].startTimeMins;
      if (startTime < minTime) minTime = startTime;
    });
    return minTime === Infinity ? null : minTime;
  }

  #calculateViewEndTime() {
    let maxTime = 0;
    const viewDays = this.itemsByDay.filter(d => d.day.getTime() >= this.viewStartDate.getTime() && d.day.getTime() <= this.viewEndDate.getTime());

    viewDays.forEach(({ items }) => {
      if (!items.length) return;
      const endTime = items[items.length - 1].endTimeMins;
      if (endTime > maxTime) maxTime = endTime;
    });
    return maxTime === 0 ? null : maxTime;
  }

  #isDateWithinEnabledRange(date) {
    return date.getTime() >= this.enabledStartDate.getTime() && date.getTime() <= this.enabledEndDate?.getTime();
  }

  #formatStrToDate(v) {
    const [year, month, day] = v.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  /**
   * Given (23:00, omitMinutesForWholeHours, omitMeridianSuffix), yields:
   *  - (1380, true, false) => 11 pm
   *  - (1380, false, false) => 11:00 pm
   *  - (1380, true, true) => 11
   *  - (1380, false, true) => 11:00
   * @param {Number} mins, mins time of day
   * @param {Object} options
   *          -> when omitMinutesForWholeHours=true omits minutes when 0
   *          -> when omitMeridianSuffix=true, omits am/pm
   *          -> when use24HourTime=true, uses 23:00; 11:00 otherwise
   * @returns a formatted time string
   */
  #formatTime(minsOfDay, { omitMinutesForWholeHours = false, omitMeridianSuffix = false, use24HourTime = false } = {}) {
    let mins = minsOfDay % 60;
    let hour = Math.floor(minsOfDay / 60);
    let timeString;

    if (use24HourTime) {
      timeString = `${hour.toString().padStart(2, "0")}`;
      if (!(omitMinutesForWholeHours && mins === 0)) timeString += `:${mins.toString().padStart(2, "0")}`;
    } else {
      timeString = `${hour % 12 || 12}`;
      if (!(omitMinutesForWholeHours && mins === 0)) timeString += `:${mins.toString().padStart(2, "0")}`;
      if (!omitMeridianSuffix) timeString = html`${timeString}&nbsp;<span class="meridiemIndicator">${hour < 12 ? "am" : "pm"}</span>`
    }

    return timeString;
  }

  /* TODO: Implement highlighting of rows and columns */
  // eslint-disable-next-line no-unused-vars
  #onSlotHover(dayIndex, timeMins) { }

  /* TODO: Undo what you just did */
  #onSlotHoverOut() { }

  #onSelectItem(item) {
    const itemIndex = this.selectedItems.indexOf(item);
    if (itemIndex > -1) this.selectedItems.splice(itemIndex, 1);
    else {
      if (this.selectedItems.length >= this.maxSelectedItems) {
        if (this.maxSelectedItems > 1) return;
        else this.selectedItems.length = 0;
      }
      this.selectedItems.push(item);
    }

    this.dispatchEvent(new CustomEvent("selected", { detail: { selectedItems: this.selectedItems }, cancelable: false, bubbles: true }));

    this.requestUpdate();
  }

  #onKeyDown(e) {
    if (e.key === " " && this.itemInFocus) {
      this.#onSelectItem(this.itemInFocus);
      e.preventDefault();
    }
  }

  /**
   * Given {startTimeMins, durationMins}, calculate [startTime, endTime] formatted with {@link use24HourTime}.
   *  NOTE: endTime is calculated from start + duration since endTime from server is typically endTime - 1 inclusive,
   *    rather than endTime exclusive (2:29 inclusive, 2:30 exclusive)
   */
  formatStartEndTimes({ startTimeMins, durationMins } = {}) {
    const startTime = this.#formatTime(startTimeMins, { use24HourTime: this.use24HourTime });
    const endTime = this.#formatTime(startTimeMins + durationMins, { use24HourTime: this.use24HourTime });
    return [startTime, endTime];
  }

  /**
   * Creates a scheduling item to put on the TimeBlockPicker control.
   * @param {Object} item An object with keys aligned with {@link SchedulingItem}
   * @returns a {@link SchedulingItem}
   */
  addItem(item) {
    if (!this.editMode) {
      this.writeLog("Error", "Please call `beginChanges()` before editing dataset.");
      return;
    }

    if (types.isObjectOrArray(item)) item = new SchedulingItem(item);
    aver.isOf(item, SchedulingItem);

    if (item.startTimeMins % this.timeViewGranularityMins > 0) {
      this.writeLog("Error", `The item must start on a time block in intervals of ${this.timeViewGranularityMins} mins.`);
      return;
    }

    let found = this.itemsByDay.find(d => item.day.toLocaleDateString() === d.day.toLocaleDateString());
    if (!found) {
      found = {
        day: item.day,
        items: [],
      };
      this.itemsByDay.push(found);
      this.itemsByDay.sort((a, b) => new Date(a.day) - new Date(b.day));
    }

    if (!types.isArray(found.items)) found.items = [];

    const timeFoundIndex = found.items.findIndex(one => (item.startTimeMins >= one.startTimeMins && item.startTimeMins <= one.endTimeMins) || (item.endTimeMins >= one.startTimeMins && item.endTimeMins <= one.endTimeMins));
    if (timeFoundIndex > -1) {
      const [startTime, endTime] = this.formatStartEndTimes(found.items[timeFoundIndex]).map(t => types.isString(t) ? t : t.values.join(""));
      this.writeLog("Error", `An item already exists from ${startTime} - ${endTime} on ${found.items[timeFoundIndex].day.toLocaleDateString()}.`);
      return;
    }

    found.items.push(item);
    return item;
  }

  removeItem(idOrItem) {
    if (!this.editMode) {
      this.writeLog("Error", "Please call `beginChanges()` before editing dataset.");
      return;
    }
    if (types.isString(idOrItem) || types.isNumber(idOrItem)) idOrItem = this.findItemById(idOrItem);
    const item = aver.isOf(idOrItem, SchedulingItem);

    const foundDay = this.itemsByDay.find(one => one.day === item.day);

    const foundIndex = foundDay.items.findIndex(one => one.id === item.id);
    if (foundIndex === -1) throw types.AzosError(`Unable to find item{${item.id}}`);
    foundDay.items.splice(foundIndex, 1);
  }

  findItemById(id) { return this.items.find(one => one.id === id); }

  /**
   * Show Scheduling items {@link count} week(s) prior to or after current view.
   * @param {Number} > 0 moves next, < 0 move previous
   */
  changeViewPage(count = 1, force = false) {
    let newViewStartDate;
    if (count === 0)
      newViewStartDate = this.#calculateViewStartDate(new Date());
    else {
      newViewStartDate = new Date(this.viewStartDate);
      newViewStartDate.setDate(newViewStartDate.getDate() + (7 * count));

      if (!force) {
        let filter;
        if (count < 0)
          filter = ({ day }) => day.getTime() <= this.viewStartDate.getTime() && day.getTime() >= this.enabledStartDate.getTime();
        else
          filter = ({ day }) => day.getTime() >= newViewStartDate.getTime() && day.getTime() <= this.#enabledEndDate.getTime();

        if (!this.itemsByDay.some(filter)) return;
      }
    }

    this.#setViewPropertiesForRecompute();
    this.viewStartDate = newViewStartDate;
  }

  /** Remove all items and reset view */
  purge() {
    this.beginChanges();
    this.#itemsByDay.length = 0;
    this.endChanges();
  }

  /** Call before making edits that would cause recalculation */
  beginChanges() {
    this.editMode = true;
  }

  /** Commit the edits and re-render the view */
  endChanges() {
    this.editMode = false;
    this.#setViewPropertiesForRecompute();
    this.requestUpdate();
  }

  renderControl() {
    return html`
<div class="scheduler" @keydown="${this.#onKeyDown}">
  ${this.renderTimeSlots()}
</div>
    `;
  }

  get todaySymbol() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let rec;
    if (today > this.viewEndDate) rec = this.renderImageSpec("svg://azos.ico.arrowRight");
    else if (today < this.viewStartDate) rec = this.renderImageSpec("svg://azos.ico.arrowLeft");
    else rec = this.renderImageSpec("svg://azos.ico.calendarToday");
    return rec.html;
  }

  renderNavigationControls() {
    return html`
<div class="nav">
  <button @click="${() => this.changeViewPage(-1, false)}" class="prev viewBtn">${this.renderImageSpec("svg://azos.ico.caretLeft").html}</button>
  <button @click="${() => this.changeViewPage(0)}" class="viewing todayBtn">${this.todaySymbol} Today</button>
  <button @click="${() => this.changeViewPage(1, false)}" class="next viewBtn">${this.renderImageSpec("svg://azos.ico.caretRight").html}</button>
  ${this.renderViewSpanLabel(this.viewStartDate, this.viewEndDate, true)}
</div>
    `;
  }

  renderViewSpanLabel(startDate, endDate, short = false) {
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    const startMonthName = startDate.toLocaleDateString(undefined, { month: short ? "short" : "long" });
    const endMonthName = endDate.toLocaleDateString(undefined, { month: short ? "short" : "long" });

    const startDateDay = startDate.getDate();
    const endDateDay = endDate.getDate();

    let viewSpanLabel = `${startMonthName} ${startDateDay}`;
    if (startYear !== endYear) viewSpanLabel += `, ${startYear}`;
    viewSpanLabel += ` — `;

    if (startMonthName !== endMonthName) viewSpanLabel += `${endMonthName} `;
    viewSpanLabel += `${endDateDay}, ${endYear}`;

    return viewSpanLabel;
  }

  renderTimeSlots() {
    return html`
<div class="daysContainer" style="--columns:${this.viewNumDays + 1};--rows:${this.timeSlotsView.length}">
  ${this.renderNavigationControls()}
  <div class="dayColumn legend">
    <div class="dayLabel">
      <div class="year">&nbsp;</div>
      <div class="month">&nbsp;</div>
      <div class="dayDate">&nbsp;</div>
    </div>
    ${this.renderTimeSlotsViewLabels()}
  </div>
  ${this.renderDayColumns()}
</div>
    `;
  }

  renderTimeSlotsViewLabels() {
    return this.timeSlotsView.map(([mins, inView]) => {
      const onTheHour = mins % 60 === 0;
      const cls = [
        "timeCell",
        "timeLabel",
        inView ? "inView" : "",
        onTheHour ? "onTheHour" : "",
      ];
      let timeString = noContent;
      if (inView) timeString = this.#formatTime(mins, { omitMinutesForWholeHours: onTheHour, omitMeridianSuffix: !onTheHour, use24HourTime: this.use24HourTime });
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
    <div class="dayDate">${dayName} ${dayNumber}</div>
  </div>
  ${this.renderTimeCells(date)}
</div>
    `)
  }

  renderTimeCells(day) {
    const thisDayItems = this.itemsByDay.find(one => one.day.toLocaleDateString() === day.toLocaleDateString())?.items;

    let toRender = [];
    for (let i = 0; i < this.timeSlotsView.length; i++) {
      const [slotMins, inView] = this.timeSlotsView[i];
      let cellContent = noContent;
      let stl = noContent;
      let cls = ["timeCell", "timeSlot"];
      let rowSpan;
      let foundItem;

      if (slotMins % 60 === 0) cls.push("onTheHour");
      if (inView && this.#isDateWithinEnabledRange(day)) {
        cls.push("inView");

        foundItem = thisDayItems?.find(item => item.startTimeMins === slotMins);
        if (foundItem) {
          // console.log("found:", foundItem);
          rowSpan = Math.floor(foundItem.durationMins / this.timeViewGranularityMins);
          i += rowSpan - 1;
          stl = `grid-row: span ${rowSpan};`;
          cls.push("available");
          if (rowSpan > 1) cls.push("spanned");
          cellContent = this.renderSchedulingItem(foundItem, rowSpan);
        }
      }

      toRender.push(html`
<div class="${cls.filter(types.isNonEmptyString).join(' ')}" style="${stl}" data-time="${this.#formatTime(slotMins, { use24HourTime: true })}" data-day="${day}"
  @click="${foundItem ? () => this.#onSelectItem(foundItem) : () => { }}"
  @mouseover="${() => this.#onSlotHover(day, slotMins)}"
  @mouseout="${() => this.#onSlotHoverOut()}">
  ${cellContent}
</div>
    `);
    }
    return toRender;
  }

  renderSchedulingItem(schItem, rowSpan) {
    let iconContent = noContent;
    let cls = ["item"];
    const eventSelectedIndex = this.selectedItems.indexOf(schItem);
    if (eventSelectedIndex > -1) {
      cls.push("selected");
      iconContent = html`
            <div class="icon">
            ${this.selectedItems.length === 1 ?
        html`${this.renderImageSpec("svg://azos.ico.checkmark?m=i32").html}`
          : html`<span>${eventSelectedIndex + 1}</span>`
        }
            </div>`;
    }
    return html`
<div class="${cls.filter(types.isNonEmptyString).join(" ")}" tabIndex="0" @focus="${() => this.itemInFocus = schItem}" @blur="${() => this.itemInFocus = null}" data-id="${schItem.id}">
  ${this.renderCaption(schItem, rowSpan)}
  ${iconContent}
</div>
    `;
  }

  renderCaption(schItem, rowSpan) {
    let caption = noContent;
    if (rowSpan > 1 && schItem.caption)
      caption = html`<div class="custom">${schItem.caption}</div>`;

    return html`
  <div class="caption">
    <div class="timeSpan">${this.renderDefaultCaption(schItem)}</div>
    ${caption}
  </div>
    `;
  }

  renderDefaultCaption(schItem) {
    const [startTime, endTime] = this.formatStartEndTimes(schItem);
    return html`${startTime} <span class="sep">-</span> ${endTime}`;
  }
}

window.customElements.define("az-time-block-picker", TimeBlockPicker);

/** The scheduling item belonging on the schedule */
class SchedulingItem {
  static #seed = 0;

  #id = null;
  get id() { return this.#id; }

  #day = null;
  get day() { return this.#day; }
  set day(v) { this.#day = v; }

  #caption = null;
  get caption() { return this.#caption; }
  set caption(v) { this.#caption = v; }

  #startTimeMins = 0;
  get startTimeMins() { return this.#startTimeMins; }
  set startTimeMins(v) { this.#startTimeMins = v; }

  get endTimeMins() { return this.#startTimeMins + this.durationMins - 1; }
  set endTimeMins(v) { this.durationMins = v - this.#startTimeMins + 1; }

  #durationMins = 0;
  get durationMins() { return this.#durationMins; }
  set durationMins(v) { this.#durationMins = aver.isNumber(v); }

  #data = null;
  get data() { return this.#data; }
  set data(v) { this.#data = aver.isObject(v); }

  constructor({ id, caption, day, startTimeMins, endTimeMins, durationMins, data = {} } = {}) {
    if (caption !== null && !types.isNonEmptyString(caption) && !types.isObject(caption)) aver.isNonEmptyString(caption);
    this.#caption = caption;
    this.#day = aver.isDate(day);
    this.#startTimeMins = aver.isNumber(startTimeMins);
    if (types.isAssigned(durationMins))
      this.#durationMins = aver.isNumber(durationMins);
    else
      this.endTimeMins = aver.isNumber(endTimeMins);
    this.#data = aver.isObject(data);
    this.#id = aver.isStringOrNull(id) ?? ++SchedulingItem.#seed;
  }
}
