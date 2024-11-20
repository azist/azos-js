/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Control, css, html } from "../../ui";
import "../../parts/button";
import "../../parts/select-field";

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
  flex-direction: row;
  justify-content: space-between;
}

.day-column {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.day-column .day-label {
  width: 100%;
  text-align: center;
}

.day-column .time-slot {
  display: block;
}

:not(.legend) .time-slot:hover {
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
    this.currentWeekStart = this.#getStartOfWeek(new Date());
    this.selectedMonth = this.currentWeekStart.getMonth();
    this.availableSlots = this.#getAvailableSlots();
    this.selectedSlot = null;
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

  #getAvailableSlots() { return []; }

  connectedCallback() {
    super.connectedCallback();
  }

  #handlePreviousWeek() { }
  #handleMonthChange() { }
  #handleNextWeek() { }

  get #daysView() {
    return Array.from({ length: this.showNumDays }).map((_, i) => {
      const currentDate = new Date(this.currentWeekStart);
      currentDate.setDate(this.currentWeekStart.getDate() + i);

      const name = currentDate.toLocaleDateString(undefined, { weekday: 'short' });
      const number = currentDate.getDate();
      return [name, number];
    });
  }

  startTime = '09:00';
  endTime = '17:00';
  incrementMinutes = 30;
  get timeSlotsView() {

    const slots = [];
    let [startHour, startMinute] = this.startTime.split(':').map(Number);
    let [endHour, endMinute] = this.endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push(timeString);

      currentMinute += this.incrementMinutes;
      if (currentMinute >= 60) {
        currentMinute -= 60;
        currentHour += 1;
      }
    }
    return slots;
  }

  handleSlotSelect(slot) {
    if (slot.available) {
      this.selectedSlot = slot;
    }
  }

  handleSlotHover(number, time) { }
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
  <az-button title="Previous" @click="${this.#handlePreviousWeek}"></az-button>
  <az-select id="monthSelector" scope="this" @change="${this.#handleMonthChange}" value="${this.selectedMonth}">${this.#monthOptions}</az-select>
  <az-button title="Next" @click="${this.#handleNextWeek}"></az-button>
</div>
    `;
  }

  renderTimeSlots() {
    return html`
    <div class="days">
      <div class="day-column legend">
        <div class="day-label">
          <div class="day-name">&nbsp;</div>
          <div class="day-date">&nbsp;</div>
        </div>
        ${this.timeSlotsView.map(time => html`
        <div class="time-label">${time}</div>
        `)}
      </div>
      ${this.#daysView.map(([name, number]) => html`
      <div class="day-column">
        <div class="day-label">
          <div class="day-name">${name}</div>
          <div class="day-date">${number}</div>
        </div>
        ${this.timeSlotsView.map(time => html`
        <div class="time-slot" data-time="${time}" data-day="${number}"
          @mouseover="${() => this.handleSlotHover(number, time)}"
          @mouseout="${() => this.handleSlotHoverOut()}">
          &nbsp;
        </div>
        `)}
      </div>
      `)}
    </div>
    `;
  }

}

window.customElements.define("az-weekly-scheduler", WeeklyScheduler);
