/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AzosElement, css, html } from "../../ui";
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

export class WeeklyScheduler extends AzosElement {

  static styles = css`
:host { display: block; margin-top: 1em; margin-bottom: 1em; }

.header {
  display: flex;
  align-items: end;
  justify-content: center;
}

.header az-select {
// display:block;
}

.week-days {
  display: flex;
  align-items: middle;
}

.week-days .day {
  display: flex;
  align-items: middle;
  flex-direction: column;
}

.week-days .day > div { text-align: center; }


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

    console.log(date, this.weekStartDay, currentDay, dayDifference, startOfWeek, );

    return startOfWeek;
  }

  #getAvailableSlots() { return []; }


  connectedCallback() {
    super.connectedCallback();
  }

  #monthOptions = Object.values(MONTHS_OF_YEAR).map(monthIndex => html`<az-select-option value="${monthIndex}" title="${ALL_MONTH_NAMES[monthIndex]}"></az-select-option>`);

  render() {
    return html`
<div class="scheduler">
  ${this.renderHeader()}
  ${this.renderWeekDays()}
  ${this.renderTimeSlots()}
</div>
    `;
  }

  renderHeader() {
    return html`
<div class="header">
  <az-button title="Previous" @click="${this.handlePreviousWeek}"></az-button>
  <az-select id="monthSelector" scope="this" @change="${this.handleMonthChange}" value="${this.selectedMonth}">
    ${this.#monthOptions}
  </az-select>
  <az-button title="Next" @click="${this.handleNextWeek}"></az-button>
</div>
    `;
  }

  renderWeekDays() {
    const daysHtml = [];

    // loop through week start + showNumDays
    for (let i = 0; i < this.showNumDays; i++) {
      // Create a new date for each day in the week
      const currentDate = new Date(this.currentWeekStart);
      currentDate.setDate(this.currentWeekStart.getDate() + i);

      // Get the day name and date in a user-friendly format
      const dayName = currentDate.toLocaleDateString(undefined, { weekday: 'short' });  // e.g., "Mon"
      const dateNumber = currentDate.getDate();  // e.g., "1" for Oct 1

      // Add the day to the daysHtml array
      daysHtml.push(html`
        <div class="day">
          <div class="day-name">${dayName}</div>
          <div class="day-date">${dateNumber}</div>
        </div>
      `);
    }

    // Return all days wrapped in a container
    return html`
      <div class="week-days">
        ${daysHtml}
      </div>
    `;
  }

  renderTimeSlots() {
    return html`
<div class="time-slots">
  ${this.availableSlots.map(slot => html`
    <div class="time-slot ${slot.available ? 'available' : 'unavailable'}"
          @click="${() => this.handleSlotSelect(slot)}">
      ${slot.date} ${slot.time}
    </div>
  `)}
</div>
    `;
  }

  handleSlotSelect(slot) {
    if (slot.available) {
      this.selectedSlot = slot;
    }
  }

}


window.customElements.define("az-weekly-scheduler", WeeklyScheduler);
