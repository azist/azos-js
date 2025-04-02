/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseCheckboxes extends CaseBase {

  renderControl() {
    return html`
<h2>Checkboxes</h2>

<h3>checkType</h3>
<div class="strip-h" style="gap:2em;">
  <az-check checkType="checkmark" title="default 'checkMark'" titlePosition="mid-right" status="default"></az-check>
  <az-check checkType="cross" title="checkType='cross'" titlePosition="mid-right" status="default"></az-check>
</div>

<h3>Statuses</h3>
<div class="strip-h" style="gap:2em;">
  <az-check title="Default" titlePosition="mid-right" status="default"></az-check>
  <az-check title="Ok" titlePosition="mid-right" status="ok"></az-check>
  <az-check title="Info" titlePosition="mid-right" status="info"></az-check>
  <az-check title="Warning" titlePosition="mid-right" status="warning"></az-check>
  <az-check title="Alert" titlePosition="mid-right" status="alert"></az-check>
  <az-check title="Error" titlePosition="mid-right" status="error"></az-check>
  <az-check title="Brand1" titlePosition="mid-right" status="brand1" value="true"></az-check>
  <az-check title="Brand2" titlePosition="mid-right" status="brand2" value="true"></az-check>
  <az-check title="Brand3" titlePosition="mid-right" status="brand3" value="true"></az-check>
</div>
<h3>Disabled</h3>
<div class="strip-h" style="gap:2em;">
  <az-check title="Default" titlePosition="mid-right" status="default" value="true" isdisabled></az-check>
  <az-check title="Disabled" titlePosition="mid-right" status="default" value="true" isdisabled></az-check>
  <az-check title="Ok" titlePosition="mid-right" status="ok" value="true"isdisabled></az-check>
  <az-check title="Info" titlePosition="mid-right" status="info" value="true" isdisabled></az-check>
  <az-check title="Warning" titlePosition="mid-right" status="warning" value="true" isdisabled></az-check>
  <az-check title="Alert" titlePosition="mid-right" status="alert" value="true" isdisabled></az-check>
  <az-check title="Error" titlePosition="mid-right" status="error" value="true" isdisabled></az-check>
  <az-check title="Brand1" titlePosition="mid-right" status="brand1" value="true" isdisabled></az-check>
  <az-check title="Brand2" titlePosition="mid-right" status="brand2" value="true" isdisabled></az-check>
  <az-check title="Brand3" titlePosition="mid-right" status="brand3" value="true" isdisabled></az-check>
</div>
<h3>Read Only</h3>
<div class="strip-h" style="gap:2em;">
  <az-check title="Default" titlePosition="mid-right" status="default" value="true"  isreadonly></az-check>
  <az-check title="Disabled" titlePosition="mid-right" status="default" value="true" isreadonly></az-check>
  <az-check title="Ok" titlePosition="mid-right" status="ok" value="true"      isreadonly></az-check>
  <az-check title="Info" titlePosition="mid-right" status="info" value="true"  isreadonly></az-check>
  <az-check title="Warning" titlePosition="mid-right" status="warning" value="true" isreadonly></az-check>
  <az-check title="Alert" titlePosition="mid-right" status="alert" value="true"   isreadonly></az-check>
  <az-check title="Error" titlePosition="mid-right" status="error" value="true"   isreadonly></az-check>
  <az-check title="Brand1" titlePosition="mid-right" status="brand1" value="true" isreadonly></az-check>
  <az-check title="Brand2" titlePosition="mid-right" status="brand2" value="true" isreadonly></az-check>
  <az-check title="Brand3" titlePosition="mid-right" status="brand3" value="true" isreadonly></az-check>
</div>

<h3>Ranks</h3>
<div class="strip-h" style="gap:2em;">
  <az-check title="Tiny" titlePosition="mid-right" rank="tiny"></az-check>
  <az-check title="Small" titlePosition="mid-right" rank="small"></az-check>
  <az-check title="Medium" titlePosition="mid-right" rank="medium"></az-check>
  <az-check title="Normal" titlePosition="mid-right" rank="normal"></az-check>
  <az-check title="Large" titlePosition="mid-right" rank="large"></az-check>
  <az-check title="Huge" titlePosition="mid-right" rank="huge"></az-check>
</div>
<div class="strip-h" style="gap:2em;">
  <az-check title="Tiny" titlePosition="mid-right" rank="tiny"  value="true"isdisabled></az-check>
  <az-check title="Small" titlePosition="mid-right" rank="small"  value="true" isdisabled></az-check>
  <az-check title="Medium" titlePosition="mid-right" rank="medium" isdisabled></az-check>
  <az-check title="Normal" titlePosition="mid-right" rank="normal" isdisabled></az-check>
  <az-check title="Large" titlePosition="mid-right" rank="large"  value="true" isdisabled></az-check>
  <az-check title="Huge" titlePosition="mid-right" rank="huge"  value="true" isdisabled></az-check>
</div>
<div class="strip-h" style="gap:2em;">
  <az-check checkType="cross" title="Tiny" titlePosition="mid-right" rank="tiny"></az-check>
  <az-check checkType="cross" title="Small" titlePosition="mid-right" rank="small"></az-check>
  <az-check checkType="cross" title="Medium" titlePosition="mid-right" rank="medium"></az-check>
  <az-check checkType="cross" title="Normal" titlePosition="mid-right" rank="normal"></az-check>
  <az-check checkType="cross" title="Large" titlePosition="mid-right" rank="large"></az-check>
  <az-check checkType="cross" title="Huge" titlePosition="mid-right" rank="huge"></az-check>
</div>

<h3>Title Positioning</h3>
<p>Clockwise, the following titlePositions are: <strong>top-left, top-center, top-right, mid-left, mid-right, bottom-left, bottom-center, bottom-right</strong>. The default titlePosition is <strong>top-left</strong>.</p>

<div class="strip-h" style="gap: 4em;">
  <div>
    <h4>Not Required</h4>
    <div class="strip-h">
      <az-check title="The Top Left"></az-check>
      <az-check title="The Top Center" titlePosition="top-center"></az-check>
      <az-check title="The Top Right" titlePosition="top-right"></az-check>
    </div>
    <div class="strip-h">
      <az-check title="Middle Left" titlePosition="mid-left" titleWidth="75"></az-check>
      <az-check title="Middle Right" titlePosition="mid-right" titleWidth="75"></az-check>
    </div>
    <div class="strip-h">
      <az-check title="Bottom Left" titlePosition="bottom-left"></az-check>
      <az-check title="Bottom Center" titlePosition="bottom-center"></az-check>
      <az-check title="Bottom Right" titlePosition="bottom-right"></az-check>
    </div>
  </div>
  <div>
    <h4>Required</h4>
    <div class="strip-h">
      <az-check title="The Top Left" isRequired></az-check>
      <az-check title="The Top Center" isRequired titlePosition="top-center"></az-check>
      <az-check title="The Top Right" isRequired titlePosition="top-right"></az-check>
    </div>
    <div class="strip-h">
      <az-check title="Middle Left" isRequired titlePosition="mid-left" titleWidth="75"></az-check>
      <az-check title="Middle Right" isRequired titlePosition="mid-right" titleWidth="75"></az-check>
    </div>
    <div class="strip-h">
      <az-check title="Bottom Left" isRequired titlePosition="bottom-left"></az-check>
      <az-check title="Bottom Center" isRequired titlePosition="bottom-center"></az-check>
      <az-check title="Bottom Right" isRequired titlePosition="bottom-right"></az-check>
    </div>
  </div>
</div>
    `;
  }
}

window.customElements.define("az-case-checkboxes", CaseCheckboxes);
