/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseSwitches extends CaseBase {

  renderControl() {
    return html`
<h2>Switches</h2>

<p>A long-used form of placeholder text in design mockups and more, the standard use of dummy text has come under fire in recent years as web design grows (and the internet makes the spread of opinions much more efficient).</p>

<h3>Statuses</h3>
<div class="strip-h" style="gap:2em;">
  <az-check itemType="switch" title="Default" titlePosition="mid-right" status="default"></az-check>
  <az-check itemType="switch" title="Default" titlePosition="mid-right" status="default" isdisabled></az-check>
  <az-check itemType="switch" title="Ok" titlePosition="mid-right" status="ok"></az-check>
  <az-check itemType="switch" title="Info" titlePosition="mid-right" status="info"></az-check>
  <az-check itemType="switch" title="Warning" titlePosition="mid-right" status="warning"></az-check>
  <az-check itemType="switch" title="Alert" titlePosition="mid-right" status="alert"></az-check>
  <az-check itemType="switch" title="Error" titlePosition="mid-right" status="error"></az-check>
</div>

<h3>Ranks</h3>
<div class="strip-h" style="gap:2em;">
  <az-check itemType="switch" title="Tiny" titlePosition="mid-right" rank="tiny"></az-check>
  <az-check itemType="switch" title="Small" titlePosition="mid-right" rank="small"></az-check>
  <az-check itemType="switch" title="Medium" titlePosition="mid-right" rank="medium"></az-check>
  <az-check itemType="switch" title="Normal" titlePosition="mid-right" rank="normal"></az-check>
  <az-check itemType="switch" title="Large" titlePosition="mid-right" rank="large"></az-check>
  <az-check itemType="switch" title="Huge" titlePosition="mid-right" rank="huge"></az-check>
</div>

<h3>Title Positioning</h3>
<p>Clockwise, the following titlePositions are: <strong>top-left, top-center, top-right, mid-left, mid-right, bottom-left, bottom-center, bottom-right</strong>. The default titlePosition is <strong>top-left</strong>.</p>
<div class="strip-h" style="gap: 4em;">
  <div>
    <h4>Not Required</h4>
    <div class="strip-h">
      <az-check itemType="switch" title="The Top Left"></az-check>
      <az-check itemType="switch" title="The Top Center" titlePosition="top-center"></az-check>
      <az-check itemType="switch" title="The Top Right" titlePosition="top-right"></az-check>
    </div>
    <div class="strip-h">
      <az-check itemType="switch" title="Middle Left" titlePosition="mid-left" titleWidth="75"></az-check>
      <az-check itemType="switch" title="Middle Right" titlePosition="mid-right" titleWidth="75"></az-check>
    </div>
    <div class="strip-h">
      <az-check itemType="switch" title="Bottom Left" titlePosition="bottom-left"></az-check>
      <az-check itemType="switch" title="Bottom Center" titlePosition="bottom-center"></az-check>
      <az-check itemType="switch" title="Bottom Right" titlePosition="bottom-right"></az-check>
    </div>
  </div>
  <div>
    <h4>Required</h4>
    <div class="strip-h">
      <az-check itemType="switch" isRequired title="The Top Left"></az-check>
      <az-check itemType="switch" isRequired title="The Top Center" titlePosition="top-center"></az-check>
      <az-check itemType="switch" isRequired title="The Top Right" titlePosition="top-right"></az-check>
    </div>
    <div class="strip-h">
      <az-check itemType="switch" isRequired title="Middle Left" titlePosition="mid-left" titleWidth="75"></az-check>
      <az-check itemType="switch" isRequired title="Middle Right" titlePosition="mid-right" titleWidth="75"></az-check>
    </div>
    <div class="strip-h">
      <az-check itemType="switch" isRequired title="Bottom Left" titlePosition="bottom-left"></az-check>
      <az-check itemType="switch" isRequired title="Bottom Center" titlePosition="bottom-center"></az-check>
      <az-check itemType="switch" isRequired title="Bottom Right" titlePosition="bottom-right"></az-check>
    </div>
  </div>
</div>
    `;
  }
}

window.customElements.define("az-case-switches", CaseSwitches);
