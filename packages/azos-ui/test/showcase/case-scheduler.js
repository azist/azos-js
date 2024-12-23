/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";
import * as types from "azos/types";

import "../../vcl/time/scheduler";
import { combineAgentSchedulesPerDay, getDailyAvailable } from "./fetch-scheduling-data";

const rangeData = combineAgentSchedulesPerDay(getDailyAvailable("2024-12-24T00:00:00+00:00", { mangleAgentHours: false, earliestTime: 9 * 60, latestTime: 20 * 60 }), 5);
export class CaseScheduler extends CaseBase {

  firstUpdated() {
    super.firstUpdated();
    // this.schTest.schedulingItemsByDay = rangeData.sort((a, b) => new Date(a.day) - new Date(b.day));
    rangeData.forEach(({ day, items }) => {
      day = new Date(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate());
      day.setHours(0, 0, 0, 0);
      items.forEach(({ sta, fin, dur, agent }) => this.schTest.addItem(day, {
        caption: null, //(formattedStartTime, formattedEndTime) => this.#renderCaption(formattedStartTime, formattedEndTime, agent),
        startTimeMins: sta,
        endTimeMins: fin,
        durationMins: dur,
        day,
        agent,
      }));
    });
  }

  #formatAgentName({ First, Last, Middle, Title, Suffix } = {}) {
    return [Title, First, Middle, Last, Suffix].filter(types.isNonEmptyString).join(" ");
  }

  #renderCaption(formattedStartTime, formattedEndTime, agent) {
    return html`
<div class="time">${formattedStartTime} - ${formattedEndTime}</div>
<div class="agent">Agent: ${this.#formatAgentName(agent)} <small>(${agent.Id.split('@')[1]})</small></div>`;
  }

  renderControl() {
    return html`
<h2>Scheduler</h2>
<az-weekly-scheduler id="schTest" scope="this"></az-weekly-scheduler>
    `;
  }
}

window.customElements.define("az-case-scheduler", CaseScheduler);
