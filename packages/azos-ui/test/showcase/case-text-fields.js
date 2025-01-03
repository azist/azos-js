/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseTextFields extends CaseBase {

  renderControl() {
    // TODO: test button click to increment/decrement counter
    return html`
<h2>Text Fields</h2>

<p>Lorem ipsum odor amet, consectetuer adipiscing elit. Neque laoreet vitae et maximus ornare non senectus. Vivamus maecenas pulvinar enim pretium bibendum accumsan libero justo. Torquent fringilla nam vivamus vel; lectus magna sapien. Praesent vivamus efficitur aliquam massa consectetur senectus. Consequat torquent hac ultrices malesuada; potenti condimentum. Urna pretium luctus taciti justo feugiat nulla nulla praesent bibendum.</p>

<div class="strip-h">
  <div class="strip-h">
    <az-text id="defaultTextInput" title="Top Left" placeholder="Type something here&hellip;"></az-text>
    <az-text id="topCenterTextInput" title="Top Center" placeholder="Type something here&hellip;" titlePosition="top-center"></az-text>
    <az-text id="topRightTextInput" title="Top Right" placeholder="Type something here&hellip;" titlePosition="top-right"></az-text>
  </div>
  <div class="strip-h">
    <az-text id="midLeftTextInput" title="Middle Left" placeholder="Type something here&hellip;" titlePosition="mid-left"></az-text>
    <az-text id="midRightTextInput" title="Middle Right" placeholder="Type something here&hellip;" titlePosition="mid-right"></az-text>
  </div>
  <div class="strip-h">
    <az-text id="botLeftTextInput" title="Bottom Left" placeholder="Type something here&hellip;" titlePosition="bottom-left"></az-text>
    <az-text id="botCenterTextInput" title="Bottom Center" placeholder="Type something here&hellip;" titlePosition="bottom-center"></az-text>
    <az-text id="botRightTextInput" title="Bottom Right" placeholder="Type something here&hellip;" titlePosition="bottom-right"></az-text>
  </div>
</div>
<hr>
<div class="strip-h">
  <az-text id="okSimple" title="OK Status" placeholder="Type something here&hellip;" message="Go for driving!" status="ok"></az-text>
  <az-text id="infoSimple" title="Info Status" placeholder="Type something here&hellip;" message="Know your surroundings!" status="info"></az-text>
  <az-text id="warningSimple" title="Warning Status" placeholder="Type something here&hellip;" message="You ran over a skunk!" status="warning"></az-text>
  <az-text id="alertSimple" title="Alert Status" placeholder="Type something here&hellip;" message="It got all over&hellip;" status="alert"></az-text>
  <az-text id="errorSimple" title="Error Status" placeholder="Type something here&hellip;" message="Clean up, everywhere!" status="error"></az-text>
</div>
<hr>
<div class="strip-h">
  <az-text id="defaultTextArea" title="Default Status" placeholder="Type something here&hellip;" multiline></az-text>
  <az-text id="okTextArea" title="OK Status" placeholder="Type something here&hellip;" multiline status="ok"></az-text>
  <az-text id="infoTextArea" title="Info Status" placeholder="Type something here&hellip;" multiline status="info"></az-text>
  <az-text id="warningTextArea" title="Warning Status" placeholder="Type something here&hellip;" multiline status="warning"></az-text>
  <az-text id="alertTextArea" title="Alert Status" placeholder="Type something here&hellip;" multiline status="alert"></az-text>
  <az-text id="errorTextArea" title="Error Status" placeholder="Type something here&hellip;" multiline status="error"></az-text>
</div>
<hr>
<div class="strip-h">
  <az-text id="rankOneInput" title="Rank Huge" placeholder="Type something here&hellip;" rank="1"></az-text>
  <az-text id="rankTwoInput" title="Rank Large" placeholder="Type something here&hellip;" rank="2" message="Don&apos;t skip this required field" isRequired></az-text>
  <az-text id="rankThreeInput" title="Rank Default" placeholder="Type something here&hellip;"></az-text>
  <az-text id="rankFourInput" title="Rank Medium" placeholder="Type something here&hellip;" rank="4"></az-text>
  <az-text id="rankFiveInput" title="Rank Small" placeholder="Type something here&hellip;" rank="5"></az-text>
  <az-text id="rankSixInput" title="Rank Tiny" placeholder="Type something here&hellip;" rank="6"></az-text>
</div>
<hr>
<div class="strip-h">
  <az-text id="basicTextInput" title="Basic text input" placeholder="Type something here&hellip;" titlePosition="mid-left" titleWidth="25" contentWidth="75"></az-text>
  <az-text id="basicPasswordInput" itemType="password" title="Basic password input" placeholder="Type something here&hellip;"></az-text>
  <az-text id="requiredInput" title="This is a required field" placeholder="Type something here&hellip;" isRequired></az-text>
  <az-text id="readOnlyInput" title="Read Only field" value="Read-only value" isReadonly></az-text>
  <az-text id="disabledInput" title="This is a disabled field" value="Disabled value" isDisabled></az-text>
  <az-text id="basicTextArea" multiline title="Basic textarea input" placeholder="Type something here&hellip;"></az-text>
</div>


<hr>
<p> Here we test the validation and reformatting of values per DATA_KIND enumeration</p>
<div class="strip-h">
  <az-text id="tbPhone"  scope="window"
                         name="phone_1"
                         title="Phone"
                         placeholder="Your Phone"
                         dataKind="TEL"
                         @change="${e => { console.info(`*** Control: '${e.target.id}'   Raw: '${e.target.rawValue}'   Value: '${e.target.value}'`);}}"
                         value="123"></az-text>

  <az-text id="tbEmail"  scope="window"    title="Email" placeholder="Your Email Address" dataKind="EMAIL"></az-text>
  <az-text id="tbScreenName" scope="window" name="user_id" title="ScreenName" placeholder="Your Id"  dataKind="SCREENNAME"></az-text>

  <az-text id="tbScreenName2"  scope="window" name="screenName2" title="Screen Name With Len" dataKind="SCREENNAME" minLength=5 maxLength=10></az-text>


  <az-text id="tbAirTemperature"  scope="window" name="airTemperature" title="Temperature C" datatype="int" minValue="-90" maxValue="60"></az-text>

  <az-text id="tbScorePercent"  scope="window" name="scorePercent" title="Score Percent" datatype="real" minValue="0" maxValue="100"></az-text>

  <az-text id="tbAdmissionCode" scope="window" name="admitCode" title="Admission Code" valueList='{"adm": "Admitted", "dis": "Discharged", "oth": "Other"}'></az-text>
</div>


    `;
  }
}

window.customElements.define("az-case-text-fields", CaseTextFields);
