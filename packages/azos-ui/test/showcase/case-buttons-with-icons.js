/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

import "../../parts/button";
import { BREAKPOINT_SM } from "../../styles/breakpoints";

export class CaseButtons extends CaseBase {
  renderControl() {
    return html`
<h2>Buttons With Icons</h2>

<h4>Differing icons</h4>
<div class="strip-h">
  <az-button icon="svg://azos.ico.checkmark" iconOpts='{"scale": 1.5, "ox": -5, "wrapImage": false}' title="Check!"></az-button>
  <az-button icon="svg://azos.ico.calendarToday" iconOpts='{"scale": 1.25, "ox": -5}' title="Today?"></az-button>
  <az-button icon="svg://azos.ico.dominoMask" iconOpts='{"scale": 1.25, "ox": -5}' title="Masked..."></az-button>
  <az-button icon="svg://azos.ico.delete" iconOpts='{"scale": 1.25, "ox": -5}' title="Delete"></az-button>
</div>

<h4>Alignment with other fields</h4>
<div class="strip-h">
  <az-text title="Type 'delete' then press Delete"></az-text>
  <az-button title="Delete"></az-button>
  <az-button icon="svg://azos.ico.delete" title="Delete"></az-button>
</div>

<div class="strip-h">
  <h4>Buttons with specific statuses</h4>
  <az-button icon="svg://azos.ico.checkmark"  title="Regular"></az-button>
  <az-button icon="svg://azos.ico.delete" title="Success" status="ok"></az-button>
  <az-button icon="svg://azos.ico.user" title="Information" status="info"></az-button>
  <az-button icon="svg://azos.ico.add" title="Warning" status="warning"></az-button>
  <az-button icon="svg://azos.ico.arrowLeft" title="Alert" status="alert"></az-button>
  <az-button icon="svg://azos.ico.key" title="Error" status="error"></az-button>
  <az-button icon="svg://azos.ico.lock" title="Brand 1" status="brand1"></az-button>
  <az-button icon="svg://azos.ico.folder" title="Brand 2" status="brand2"></az-button>
  <az-button icon="svg://azos.ico.play" title="Brand 3" status="brand3"></az-button>
</div>

<div class="strip-h">
  <h4>Buttons with specific ranks</h4>
  <az-button icon="svg://azos.ico.checkmark" title="Tiny" rank="tiny"></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Small" rank="small"></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Medium" rank="medium"></az-button>
  <az-button icon="svg://azos.ico.play" title="Normal" rank="normal"></az-button>
  <az-button icon="svg://azos.ico.add" title="Large" rank="large"></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Huge" rank="huge"></az-button>
</div>

<div class="strip-h">
<h4>Shrink Button</h4>
<p>Lower window size to less than ${BREAKPOINT_SM}px</p>
  <az-button shrink icon="svg://azos.ico.search" title="Search"></az-button>
  <az-button shrink icon="svg://azos.ico.filter" title="Filter"></az-button>
  <az-button shrink icon="svg://azos.ico.close" title="Clear"></az-button>
  <az-button shrink icon="svg://azos.ico.category" title="View"></az-button>
</div>


<div class="strip-h">
  <h4>Disabled buttons</h4>
  <az-button icon="svg://azos.ico.checkmark" title="Regular" isDisabled></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Success" status="ok" isDisabled></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Information" status="info" isDisabled></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Warning" status="warning" isDisabled></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Alert" status="alert" isDisabled></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Error" status="error" isDisabled></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Brand 1" status="brand1" isDisabled></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Brand 2" status="brand2" isDisabled></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Brand 3" status="brand3" isDisabled></az-button>
</div>

<div class="strip-h">
  <h4>Readonly buttons</h4>
  <az-button icon="svg://azos.ico.checkmark" title="Regular" isReadonly></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Success" status="ok" isReadonly></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Information" status="info" isReadonly></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Warning" status="warning" isReadonly></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Alert" status="alert" isReadonly></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Error" status="error" isReadonly></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Brand 1" status="brand1" isReadonly></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Brand 2" status="brand2" isReadonly></az-button>
  <az-button icon="svg://azos.ico.checkmark" title="Brand 3" status="brand3" isReadonly></az-button>
</div>
    `;
  }
}

window.customElements.define("az-case-buttons-with-icons", CaseButtons);
