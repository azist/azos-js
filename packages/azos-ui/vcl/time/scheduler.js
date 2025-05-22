/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
import * as types from "azos/types";
import { isOneOf } from "azos/strings";

import { Control, css, getCssPaletteSpec, html, noContent } from "../../ui.js";

export class TimeBlockPicker extends Control {

  constructor() {
    super();
    this.selectedItems = [];

    this.use24HourTime = false;
    this.timeViewGranularityMins = 30;
    this.maxSelectedItems = 2;
  }

  static styles = [css`
:host{ display: block; margin-top: 1em; margin-bottom: 1em; }
.nav{
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
  color: var(--ink);

  &, svg{
    height: var(--height);
    line-height: var(--height);
  }

  &:hover{
    filter: brightness(90%);
    cursor: pointer;
  }
}

.todayBtn{
  --height: 2.25cap;
  font-size: 0.8em;
  font-weight: bolder;
  display: inline-flex;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.75ch 2ch 0.75ch 1.4ch;
  gap: 0.5ch;
}

.viewBtn{
  --height: 3cap;
  border: none;
  border-radius: 50%;
  background-color: hsl(from var(--paper) h s max(calc(l - 10), 10));

  &.prev svg{ margin-right: 0.2ch; }
  &.next svg{ margin-left: 0.2ch; }
}

.daysContainer{
  display: grid;
  grid-template-columns: 6ch repeat(calc(var(--columns, 7) - 1), minmax(0, 1fr));
  grid-template-rows: auto auto repeat(var(--rows, 31), minmax(3ch, 0.35fr));
  column-gap: 1px;
}

.dayColumn{
  display: grid;
  grid-template-rows: subgrid;
  grid-row: 2 / span max;
  overflow: hidden;
}

/** background */
:not(.legend) > .dayLabel div, .timeLabel.inView{ background-color: #d0d0d0; }

.dayLabel{
  text-align: center;
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: end;
  user-select: none;

  .year{
    font-weight: bold;
    writing-mode: tb;
    rotate: 180deg;
    position: absolute;
    left: 0.2em;
    bottom: 0.1em;
    background: none!important;
    color: #989898;
  }

  .month{
    width: 100%;
    font-weight: bold;
    font-variant: all-small-caps;
    border-radius: 10px 10px 0 0;
  }

  .dayDate{
    font-variant: all-small-caps;
    padding-bottom: 0.2em;
  }
}

.timeSlot, .timeLabel{
  container-type: size;
  grid-row: span 1;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  overflow: hidden;
}

.timeLabel{
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #aaa;

  /** column-gap handles vertical lines, these are the horizontal */
  &.inView{ border-left: 1px solid #aaa; }
  &:not(.onTheHour){ border-top-color: #e5e5e5; }
  &:nth-last-child(3){ border-bottom: 1px solid #aaa; }

  &:not(.onTheHour){
    color: #bebebe;
    font-size: 0.9em;
  }

  .meridiemIndicator{
    color: #929292;
    font-size: 0.8em;
    font-variant: small-caps;
  }
}


.timeLabel:not(.inView), .dayLabel + .timeSlot{ border-top: revert !important; }

.timeSlot{
  background-color: #e8e8e8;
  border-top: 1px dashed #ccc;
  padding: 1px 4px 4px 1px;

  &:not(.inView){ background-color: #bbb; border-top-color: #ccc; }
  &.onTheHour{ border-top: 1px solid #aaa; }
  &.onTheHour:not(.inView){ border-top-color: #aaa; }

  .item{
    padding: 2px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    background: var(--vcl-scheduler-default-item-bg-color);
    color: var(--vcl-scheduler-default-item-fg-color);
    box-shadow: var(--vcl-scheduler-default-item-box-shadow);
    font-size: clamp(10px, 15cqmin, 18px);
    text-align: center;
    border-left: var(--vcl-scheduler-default-item-bor-ctl);
    border-radius: 4px;

    &.ok      { border-left-color: var(--vcl-scheduler-ok-bor-color-ctl); }
    &.info    { border-left-color: var(--vcl-scheduler-info-bor-color-ctl); }
    &.warning { border-left-color: var(--vcl-scheduler-warn-bor-color-ctl); }
    &.alert   { border-left-color: var(--vcl-scheduler-alert-bor-color-ctl); }
    &.error   { border-left-color: var(--vcl-scheduler-error-bor-color-ctl); }
    &.brand1  { border-left-color: var(--vcl-scheduler-brand1-bor-color-ctl); }
    &.brand2  { border-left-color: var(--vcl-scheduler-brand2-bor-color-ctl); }
    &.brand3  { border-left-color: var(--vcl-scheduler-brand3-bor-color-ctl); }

    .caption .timeSpan{
      .startTime::after{
        content: "-";
        display: inline-block;
        margin: 0 0.2em;
      }
    }

    &:hover{
      cursor: pointer;
      filter: brightness(1.1);
    }

    &.selected{
      background: var(--vcl-scheduler-selected-item-bg-color);
      color: var(--vcl-scheduler-selected-item-fg-color);

      .icon{
        position: absolute;
        bottom: 0.2em;
        left: 0.2em;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        box-shadow: var(--vcl-scheduler-selected-badge-box-shadow);
        background-color: var(--vcl-scheduler-selected-badge-bg-color);
        height: 1.2em;
        width: 1.2em;
        color: var(--vcl-scheduler-selected-badge-fg-color);
        fill: var(--vcl-scheduler-selected-badge-fg-color);
        font-weight: bold;
        opacity: 0.75;
      }
    }
  }
}

@media only screen and (max-width: 700px) {
  .timeLabel:not(.onTheHour){ color: #d0d0d0 !important; }
  .year{ display: none; }
  .month{ border-radius: 4px 4px 0 0 !important;}
}
  `];

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

    viewStartDay: { type: Number },
    viewNumDays: { type: Number },
    viewStartDate: { state: true },
    viewEndDate: { state: true },

    maxSelectedItems: { type: Number },
    selectedItems: { type: Array },

    use24HourTime: { type: Boolean },
    timeViewGranularityMins: { type: Number },

    itemBgColor: { type: String, reflect: true },
    itemFgColor: { type: String, reflect: true },
    itemSelectedBgColor: { type: String, reflect: true },
    itemSelectedFgColor: { type: String, reflect: true },
    itemSelectedBadgeBgColor: { type: String, reflect: true },
    itemSelectedBadgeFgColor: { type: String, reflect: true },
  }

  #timeViewGranularityMins = null;
  get timeViewGranularityMins() { return this.#timeViewGranularityMins; }
  set timeViewGranularityMins(v) {
    this.#timeViewGranularityMins = isOneOf(aver.isNumber(v), [15, 30, 60]) ? v : 30;
    this.timeViewRenderOffMins = this.#timeViewGranularityMins * 2;
    if (this.hasUpdated) this.#recomputeViewProperties();
  }

  /** The date of the first scheduling item or "today" if no items. */
  #effectiveStartDate = null;
  get effectiveStartDate() { return this.#effectiveStartDate ?? this.#defaultEffectiveStartDate; }
  set effectiveStartDate(v) {
    this.#effectiveStartDate = aver.isDate(v);
    if (this.hasUpdated) this.#recomputeViewProperties();
  }

  #enabledStartDate = null;
  get enabledStartDate() { return this.#enabledStartDate ?? this.#defaultEnabledStartDate; }
  set enabledStartDate(v) {
    if (types.isString(v)) v = this.#formatStrToDate(v);
    this.#enabledStartDate = aver.isDate(v);
    if (this.hasUpdated) this.#recomputeViewProperties();
  }

  #enabledEndDate = null;
  get enabledEndDate() { return this.#enabledEndDate ?? this.#defaultEnabledEndDate; }
  set enabledEndDate(v) {
    if (types.isString(v)) v = this.#formatStrToDate(v);
    this.#enabledEndDate = aver.isDate(v);
    if (this.hasUpdated) this.#recomputeViewProperties();
  }

  /** The date of the last scheduling item or "today" if no items. */
  #effectiveEndDate = null;
  get effectiveEndDate() { return this.#effectiveEndDate ?? this.#defaultEffectiveEndDate; }
  set effectiveEndDate(v) {
    this.#effectiveEndDate = aver.isDate(v);
    if (this.hasUpdated) this.#recomputeViewProperties();
  }

  #viewNumDays = null;
  get viewNumDays() { return this.#viewNumDays ?? this.#defaultViewNumDays; }
  set viewNumDays(v) {
    aver.isTrue(v >= 5 && v <= 7, "viewNumDays should be between 5 and 7");
    this.#viewNumDays = v;
    if (this.hasUpdated) this.#recomputeViewProperties();
  }

  #viewStartDay = null;
  get viewStartDay() { return this.#viewStartDay ?? this.#defaultViewStartDay; }
  set viewStartDay(v) {
    aver.isTrue(v >= 0 && v < 7, "viewStartDay should be between 0 (Sunday) and 6 (Saturday)");
    this.#viewStartDay = v;
    if (this.hasUpdated) this.#recomputeViewProperties();
  }

  #viewStartDate = null;
  get viewStartDate() { return this.#viewStartDate; }

  /** The View's Ending Date Taking into account effect end date ending mid-week */
  get viewEndDate() {
    const endOfWeek = new Date(this.viewStartDate);
    endOfWeek.setHours(23, 59, 59, 99);
    // 2/16/25 + 7 days = 2/23/25; however, view range should exclude 2/23/25, hence - 1.
    const LAST_DAY_EXCLUSIVE = 1;
    endOfWeek.setDate(this.viewStartDate.getDate() + this.viewNumDays - LAST_DAY_EXCLUSIVE);
    return endOfWeek;
  }

  #daysView = null;
  get daysView() { return this.#daysView; }

  #timeSlotsView = null;
  get timeSlotsView() { return this.#timeSlotsView; }

  /** The schedule's dataset */
  #itemsByDay = [];
  get itemsByDay() { return this.#itemsByDay; }
  get items() { return this.#itemsByDay.flatMap(({ items }) => items); }

  /** These values represent the defaults when a user-provided value is not set */
  #defaultEffectiveStartDate; // #effectiveStartDate could be set by the user
  #defaultEffectiveEndDate;   // #effectiveEndDate could be set by the user
  #defaultEnabledStartDate;   // #enabledStartDate could be set by the user
  #defaultEnabledEndDate;     // #enabledEndDate could be set by the user
  #defaultViewNumDays;        // #viewNumDays could be set by the user
  #defaultViewStartDay;       // #viewStartDay could be set by the user

  #recomputeViewProperties(viewStartDate = null) {
    this.#defaultEffectiveStartDate = this.itemsByDay.length ? this.itemsByDay[0].day : new Date();
    this.#defaultEffectiveEndDate = this.itemsByDay.length ? this.itemsByDay[this.itemsByDay.length - 1].day : new Date();

    this.#defaultEnabledStartDate = this.itemsByDay.length ? this.itemsByDay[0].day : new Date();
    this.#defaultEnabledEndDate = this.itemsByDay.length ? this.itemsByDay[this.itemsByDay.length - 1].day : null;

    this.#defaultViewNumDays = 7;
    this.#defaultViewStartDay = types.DAYS_OF_WEEK.MONDAY;

    this.#viewStartDate = viewStartDate ?? this.#calculateViewStartDate(this.effectiveStartDate);
    this.#daysView = this.#calculateDaysView();
    this.#timeSlotsView = this.#calculateTimeSlotsView();
    this.update();
  }

  /** Calculate the day starting this week based on `viewStartDay` */
  #calculateViewStartDate(startDate) {
    const startOfWeek = new Date(startDate);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + this.viewStartDay);
    return startOfWeek;
  }

  #calculateDaysView() {
    let prevYear, prevMonthNumber;
    return Array.from({ length: this.viewNumDays }).map((_, i) => {
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
  }

  #calculateTimeSlotsView() {
    const timeSlotsView = [];

    const viewStartTimeMins = this.#calculateViewStartTime() ?? 9 * 60;
    const viewEndTimeMins = this.#calculateViewEndTime() ?? 17 * 60;

    const renderStartMins = viewStartTimeMins - this.timeViewRenderOffMins;
    const renderEndMins = viewEndTimeMins + this.timeViewRenderOffMins;

    let currentMins = renderStartMins;

    while (currentMins < renderEndMins) {
      const available = currentMins >= viewStartTimeMins && currentMins < viewEndTimeMins;
      timeSlotsView.push([currentMins, available]);
      currentMins += this.timeViewGranularityMins;
    }

    // console.table(this.#timeSlotsView);
    return timeSlotsView;
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
   * If use24HourTime is true, formats 1380 as 23:00.
   * Otherwise, given (23:00, omitMinutesForWholeHours, omitMeridianSuffix), yields:
   *  - (1380, false, false) => 11:00 pm
   *  - (1380, true, false) => 11 pm
   *  - (1380, false, true) => 11:00
   *  - (1380, true, true) => 11 (bad practice, but supported)
   * @param {number} mins, mins time of day
   * @param {object} [options={}] (optional) The options for formatting the time
   * @property {boolean} [options.use24HourTime=false] (optional) If true, formats 1380 as 23:00 (force-omits meridian suffix, forces minutes for whole hours)
   * @property {boolean} [options.omitMinutesForWholeHours=false] (optional) If true, omits minutes when 0 (e.g., 11:00 becomes 11)
   * @property {boolean} [options.omitMeridianSuffix=false] (optional) If true, omits am/pm suffix (e.g., 11:00 becomes 11:00)
   * @returns a formatted time string
   */
  #formatTime(minsOfDay, { use24HourTime = false, omitMinutesForWholeHours = false, omitMeridianSuffix = false, asString = false } = {}) {
    let mins = minsOfDay % 60;
    let hour = Math.floor(minsOfDay / 60);
    let hourString, minString, meridiemIndicatorString;

    if (use24HourTime) {
      hourString = `${hour.toString().padStart(2, "0")}`;
      omitMeridianSuffix = true; // 24-hour time does not use am/pm
      omitMinutesForWholeHours = false; // 24-hour time always shows minutes
    } else {
      hourString = `${hour % 12 || 12}`;
    }

    if (!omitMinutesForWholeHours) minString = `:${mins.toString().padStart(2, "0")}`;
    if (!omitMeridianSuffix) meridiemIndicatorString = `${hour < 12 ? "am" : "pm"}`;

    if (asString) return `${hourString}${minString}${meridiemIndicatorString ?? ""}`;
    return html`${hourString}${minString} ${meridiemIndicatorString ? html`<span class="meridiemIndicator">${meridiemIndicatorString}</span>` : ""}`;
  }

  /* TODO: Implement highlighting of rows and columns */
  // eslint-disable-next-line no-unused-vars
  #onSlotHover(dayIndex, timeMins) { }

  /* TODO: Undo what you just did */
  #onSlotHoverOut() { }

  #onSelectItem(item) {
    if (this.maxSelectedItems === 0) return;
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
  formatStartEndTimes({ startTimeMins, durationMins } = {}, asString = false) {
    const startTime = this.#formatTime(startTimeMins, { use24HourTime: this.use24HourTime, asString });
    const endTime = this.#formatTime(startTimeMins + durationMins, { use24HourTime: this.use24HourTime, asString });
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
      // this.itemsByDay.sort((a, b) => new Date(a.day) - new Date(b.day));
    }

    if (!types.isArray(found.items)) found.items = [];

    const timeFoundIndex = found.items.findIndex(one => (item.startTimeMins >= one.startTimeMins && item.startTimeMins <= one.endTimeMins) || (item.endTimeMins >= one.startTimeMins && item.endTimeMins <= one.endTimeMins));
    if (timeFoundIndex > -1) {
      const [startTime, endTime] = this.formatStartEndTimes(found.items[timeFoundIndex], true);
      this.writeLog("Error", `An item already exists from ${startTime} - ${endTime} on ${found.items[timeFoundIndex].day.toLocaleDateString()}.`);
      return;
    }

    found.items.push(item);
    // found.items.sort((a, b) => a.startTimeMins - b.startTimeMins);
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
    let nextViewStartDate;
    if (count === 0)
      nextViewStartDate = this.#calculateViewStartDate(new Date());
    else {
      nextViewStartDate = new Date(this.viewStartDate);
      let nextStartDate;
      switch (true) {
        case this.viewStartDay === types.DAYS_OF_WEEK.SUNDAY: nextStartDate = 7; break;
        case this.viewStartDay === types.DAYS_OF_WEEK.MONDAY && this.viewNumDays >= 5: nextStartDate = 7; break;
        default: nextStartDate = this.viewNumDays; break;
      }
      nextStartDate *= count;
      nextViewStartDate.setDate(nextViewStartDate.getDate() + nextStartDate);

      if (!force) {
        let filter;
        if (count < 0)
          filter = ({ day }) => day.getTime() <= this.viewStartDate.getTime() && day.getTime() > this.enabledStartDate.getTime();
        else
          filter = ({ day }) => day.getTime() >= nextViewStartDate.getTime() && day.getTime() <= this.enabledEndDate.getTime();

        if (!this.itemsByDay.some(filter)) return;
      }
    }

    this.#recomputeViewProperties(nextViewStartDate);
  }

  /** Remove all items and reset view */
  purge() {
    if (!this.editMode) {
      this.writeLog("Error", "Please call `beginChanges()` before editing dataset.");
      return;
    }
    this.#itemsByDay.length = 0;
  }

  /** Call before making edits that would cause recalculation */
  beginChanges() {
    this.editMode = true;
  }

  /** Commit the edits and re-render the view */
  endChanges() {
    this.editMode = false;
    // console.dir(this.itemsByDay);
    this.#itemsByDay.sort((a, b) => new Date(a.day) - new Date(b.day));
    this.itemsByDay.forEach(({ items }) => items.sort((a, b) => a.startTimeMins - b.startTimeMins));
    console.dir(this.itemsByDay);
    this.#recomputeViewProperties();
  }

  renderControl() {
    return html`
<div class="scheduler" @keydown="${this.#onKeyDown}">
  ${this.renderDaysContainer()}
</div>
    `;
  }

  get todaySymbol() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let rec;
    if (today > this.viewEndDate) rec = this.renderImageSpec("svg://azos.ico.arrowRight", { wrapImage: false });
    else if (today < this.viewStartDate) rec = this.renderImageSpec("svg://azos.ico.arrowLeft", { wrapImage: false });
    else rec = this.renderImageSpec("svg://azos.ico.calendarToday", { wrapImage: false });
    return rec.html;
  }

  renderNavigationControls() {
    return html`
<div class="nav">
  <button @click="${() => this.changeViewPage(-1, false)}" class="prev viewBtn">${this.renderImageSpec("svg://azos.ico.caretLeft", { wrapImage: false }).html}</button>
  <button @click="${() => this.changeViewPage(0)}" class="viewing todayBtn">${this.todaySymbol} <span>Today</span></button>
  <button @click="${() => this.changeViewPage(1, false)}" class="next viewBtn">${this.renderImageSpec("svg://azos.ico.caretRight", { wrapImage: false }).html}</button>
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

  renderDaysContainer() {
    let stl = this.getSchedulingStyles(this);
    return html`
<div class="daysContainer" style="--columns:${this.viewNumDays + 1};--rows:${this.timeSlotsView.length};${stl}">
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
  ${this.renderTimeSlots(date)}
</div>
    `)
  }

  renderTimeSlots(day) {
    const thisDayItems = this.itemsByDay.find(one => one.day.toLocaleDateString() === day.toLocaleDateString())?.items;

    let toRender = [];
    for (let i = 0; i < this.timeSlotsView.length; i++) {
      const [slotMins, inView] = this.timeSlotsView[i];
      let timeSlotContent = noContent;
      let stl = noContent;
      let cls = ["timeSlot"];
      let rowSpan;
      let foundItem;

      if (slotMins % 60 === 0) cls.push("onTheHour");
      if (inView && thisDayItems?.length > 0 && this.#isDateWithinEnabledRange(day)) {
        cls.push("inView");

        foundItem = thisDayItems.find(item => item.startTimeMins === slotMins);
        if (foundItem) {
          // console.log("found:", foundItem);
          rowSpan = Math.floor(foundItem.durationMins / this.timeViewGranularityMins);
          i += rowSpan - 1;
          stl = `grid-row: span ${rowSpan};`;
          timeSlotContent = this.renderSchedulingItem(foundItem, rowSpan);
        }
      }

      toRender.push(html`
<div class="${cls.filter(types.isNonEmptyString).join(' ')}" style="${stl}" data-time="${this.#formatTime(slotMins, { use24HourTime: true })}" data-day="${day}"
  @click="${foundItem ? () => this.#onSelectItem(foundItem) : () => { }}"
  @mouseover="${() => this.#onSlotHover(day, slotMins)}"
  @mouseout="${() => this.#onSlotHoverOut()}">
  ${timeSlotContent}
</div>
    `);
    }
    return toRender;
  }

  renderSchedulingItem(schItem, rowSpan) {
    const [startTime, endTime] = this.formatStartEndTimes(schItem);
    let selectedIcon = noContent;
    let stl = this.getSchedulingStyles(schItem.data);
    let cls = ["item"];
    if (schItem.data.status) cls.push(`${schItem.data.status}`);
    // console.log("renderSchedulingItem", schItem);
    const eventSelectedIndex = this.selectedItems.indexOf(schItem);
    if (eventSelectedIndex > -1) {
      cls.push("selected");
      selectedIcon = this.selectedItems.length === 1
        ? html`${this.renderImageSpec("svg://azos.ico.checkmark").html}`
        : html`<span class="icon">${eventSelectedIndex + 1}</span>`;
    }
    cls = cls.filter(types.isNonEmptyString).join(" ");
    return html`
<div class="${cls}" style="${stl}" tabIndex="0" @focus="${() => this.itemInFocus = schItem}" @blur="${() => this.itemInFocus = null}" data-id="${schItem.id}">
  <div class="caption">
    <div class="timeSpan"><span class="startTime">${startTime}</span><span class="endTime">${endTime}</span></div>
    ${rowSpan > 1 && schItem.caption ? html`<div class="custom">${schItem.caption}</div>` : noContent}
  </div>
  ${selectedIcon}
</div>
    `;
  }

  getSchedulingStyles(itemOrScheduler) {
    const createStyle = (styleProp, value) => value ? `${styleProp}: ${value}` : undefined;

    const styles = [
      createStyle("--vcl-scheduler-default-item-fg-color", getCssPaletteSpec(itemOrScheduler.itemFgColor)),
      createStyle("--vcl-scheduler-default-item-bg-color", getCssPaletteSpec(itemOrScheduler.itemBgColor)),
      createStyle("--vcl-scheduler-selected-item-fg-color", getCssPaletteSpec(itemOrScheduler.itemSelectedFgColor)),
      createStyle("--vcl-scheduler-selected-item-bg-color", getCssPaletteSpec(itemOrScheduler.itemSelectedBgColor)),
      createStyle("--vcl-scheduler-selected-badge-fg-color", getCssPaletteSpec(itemOrScheduler.itemSelectedBadgeFgColor)),
      createStyle("--vcl-scheduler-selected-badge-bg-color", getCssPaletteSpec(itemOrScheduler.itemSelectedBadgeBgColor)),
    ].filter(types.isNonEmptyString);

    return styles.length ? styles.join(";") : "";
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
