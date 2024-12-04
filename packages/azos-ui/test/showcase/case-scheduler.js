/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

import "../../vcl/time/scheduler";

export class CaseScheduler extends CaseBase {

  renderControl() {
    return html`
<h2>Scheduler</h2>
<az-weekly-scheduler></az-weekly-scheduler>
    `;
  }
}

window.customElements.define("az-case-scheduler", CaseScheduler);
