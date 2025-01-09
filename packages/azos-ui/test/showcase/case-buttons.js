/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseButtons extends CaseBase {

  renderControl() {
    // TODO: test button click to increment/decrement counter
    return html`
<h2>Buttons</h2>

<p>Lorem ipsum odor amet, consectetuer adipiscing elit. Neque laoreet vitae et maximus ornare non senectus. Vivamus maecenas pulvinar enim pretium bibendum accumsan libero justo. Torquent fringilla nam vivamus vel; lectus magna sapien. Praesent vivamus efficitur aliquam massa consectetur senectus. Consequat torquent hac ultrices malesuada; potenti condimentum. Urna pretium luctus taciti justo feugiat nulla nulla praesent bibendum.</p>

<div class="strip-h">
  <h4>Regular buttons of default status</h4>
  <az-button title="Button 1"></az-button>
  <az-button title="OK"></az-button>
  <az-button title="Cancel"></az-button>
  <az-button title="Details..."></az-button>
</div>

<div class="strip-h">
  <h4>Buttons with specific statuses</h4>
  <az-button title="Regular"></az-button>
  <az-button title="Success" status="ok"></az-button>
  <az-button title="Information" status="info"></az-button>
  <az-button title="Warning" status="warning"></az-button>
  <az-button title="Alert" status="alert"></az-button>
  <az-button title="Error" status="error"></az-button>
  <az-button title="Brand 1" status="brand1"></az-button>
  <az-button title="Brand 2" status="brand2"></az-button>
  <az-button title="Brand 3" status="brand3"></az-button>
</div>

<div class="strip-h">
  <h4>Buttons with specific ranks</h4>
  <az-button title="Tiny" rank="tiny"></az-button>
  <az-button title="Small" rank="small"></az-button>
  <az-button title="Medium" rank="medium"></az-button>
  <az-button title="Normal" rank="normal"></az-button>
  <az-button title="Large" rank="large"></az-button>
  <az-button title="Huge" rank="huge"></az-button>
</div>

<div class="strip-h">
  <h4>Disabled buttons</h4>
  <az-button title="Regular" isdisabled></az-button>
  <az-button title="Success" status="ok" isdisabled></az-button>
  <az-button title="Information" status="info" isdisabled></az-button>
  <az-button title="Warning" status="warning" isdisabled></az-button>
  <az-button title="Alert" status="alert" isdisabled></az-button>
  <az-button title="Error" status="error" isdisabled></az-button>
  <az-button title="Brand 1" status="brand1" isdisabled></az-button>
  <az-button title="Brand 2" status="brand2" isdisabled></az-button>
  <az-button title="Brand 3" status="brand3" isdisabled></az-button>
</div>
    `;
  }
}

window.customElements.define("az-case-buttons", CaseButtons);
