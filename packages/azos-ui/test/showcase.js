import { AzosElement, html, css } from "../ui";
import "../modal-dialog.js";
import "../parts/button.js";
import "../parts/checkbox.js";
import "../parts/radio-group.js";
import "../parts/text-input.js";
import "../vcl/util/code-box.js"

/** Test element used as a showcase of various parts and form elements in action */
export class Showcase extends AzosElement{
  constructor(){ super(); }

  static styles = css`
  .strip-h{
    display: flex;
    flex-wrap: wrap;
    margin: 0.5em 0em 1em 0em;
  }

  p{ font-size: 1rem; }
  `;


  onDlg1Open(){ this.dlg1.show(); }
  onDlg1Close(){ this.dlg1.close(); }
  onDlg2Open(){ this.dlg2.show(); }
  onDlg2Close(){ this.dlg2.close(); }

  render(){
    return html`

<h1>Showcase of Azos Controls</h1>

<h2>Modal dialog</h2>
<p>
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
</p>

<az-button @click="${this.onDlg1Open}" title="Open..."></az-button>
<az-button @click="${this.onDlg2Open}" title="Open Code..." status="info"></az-button>


<az-modal-dialog id="dlg1" scope="self" title="Dialog 1" rank="normal" status="default">
  <div slot="body">
    <style>p{width: 60vw; min-width: 300px; text-align: left;}</style>
    <p>
     It is a long established fact that <strong>a reader will be distracted</strong> by the readable content of a page when looking at its layout.
     The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here',
     making it look like readable English. Many desktop publishing packages and web page editors now use <strong>Lorem Ipsum</strong> as their default model text,
     and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident,
     sometimes on purpose (injected humour and the like). Yes
    </p>
    <az-button @click="${this.onDlg1Close}" title="Close" style="float: right;"></az-button>
  </div>
</az-modal-dialog>


<az-modal-dialog id="dlg2" scope="self" title="Code Box Snippet" status="info">
  <div slot="body">
    <az-code-box highlight="js" source="">
//this is my json object
{
  "a": 1, "b": 2, "c": true,
  d: ["string1", null, true, false, {"name": "string2", "salary": 100.67}]
}
</az-code-box> <br>
    <az-button @click="${this.onDlg2Close}" title="Close" style="float: right;"></az-button>
  </div>
</az-modal-dialog>

<h2> VCL / Codebox</h2>

<az-code-box highlight="js" source="">
//this is my json object
{
  "a": 1, "b": 2, "c": true,
  d: ["string1", null, true, false, {"name": "string2", "salary": 100.67}]
}
</az-code-box>

<h2>Buttons</h2>
  Regular buttons of default status:
  <div class="strip-h">
    <az-button title="Button 1"></az-button>
    <az-button title="OK"></az-button>
    <az-button title="Cancel"></az-button>
    <az-button title="Details..."></az-button>
  </div>

  Buttons with specific statuses:
  <div class="strip-h">
    <az-button title="Regular"></az-button>
    <az-button title="Success" status="ok"></az-button>
    <az-button title="Information" status="info"></az-button>
    <az-button title="Warning" status="warning"></az-button>
    <az-button title="Alert" status="alert"></az-button>
    <az-button title="Error" status="error"></az-button>
  </div>

  Disabled buttons:
  <div class="strip-h">
    <az-button title="Regular" isdisabled></az-button>
    <az-button title="Success" status="ok" isdisabled></az-button>
    <az-button title="Information" status="info" isdisabled></az-button>
    <az-button title="Warning" status="warning" isdisabled></az-button>
    <az-button title="Alert" status="alert" isdisabled></az-button>
    <az-button title="Error" status="error" isdisabled></az-button>
  </div>

<h2>Radios</h2>
<p>A long-used form of placeholder text in design mockups and more, the standard use of dummy text has come under fire in recent years as web design grows (and the internet makes the spread of opinions much more efficient).</p>
  <div class="strip-h">
      <az-radio-group id="baseGroup" title="Group of radios (choose only 1)">
        <az-radio-option>Option 1</az-radio-option>
        <az-radio-option>Second Choice</az-radio-option>
        <az-radio-option>Choice number 3</az-radio-option>
      </az-radio-group>

      <az-radio-group id="baseGroupOk" title="Radio Group OK" status="ok">
        <az-radio-option>Option 1</az-radio-option>
        <az-radio-option>Second Choice</az-radio-option>
        <az-radio-option>Choice number 3</az-radio-option>
      </az-radio-group>

      <az-radio-group id="baseGroupInfo" title="Radio Group Info" status="info">
        <az-radio-option>Option 1</az-radio-option>
        <az-radio-option>Second Choice</az-radio-option>
        <az-radio-option>Choice number 3</az-radio-option>
      </az-radio-group>

      <az-radio-group id="disabledGroup" title="Group of radios with disabled choices" isDisabled>
        <az-radio-option>isDisabled cannot be applied to an az-radio-option</az-radio-option>
        <az-radio-option>Second Choice</az-radio-option>
        <az-radio-option>Choice number 3</az-radio-option>
      </az-radio-group>

      <az-radio-group id="middleLeftGroup" title="Group of radios with middle_left position" position="middle_left">
        <az-radio-option>Position attribute is applied to the AZRadioGroup</az-radio-option>
        <az-radio-option>At this point, position attribute cannot be applied separately to individual options</az-radio-option>
        <az-radio-option>Choice number 3</az-radio-option>
      </az-radio-group>
  </div>


  <div class="strip-h">
      <az-radio-group id="switchGroup" title="Group of switch radios" itemType="switch">
        <az-radio-option>This should be a good switch</az-radio-option>
        <az-radio-option>Second Choice</az-radio-option>
        <az-radio-option>Choice number 3</az-radio-option>
      </az-radio-group>

      <az-radio-group id="switchGroupOK" title="Group of switch radios" itemType="switch" status="ok">
        <az-radio-option>This should be a good switch</az-radio-option>
        <az-radio-option>Second Choice</az-radio-option>
        <az-radio-option>Choice number 3</az-radio-option>
      </az-radio-group>

      <az-radio-group id="switchGroupInfo" title="Group of switch radios" itemType="switch" status="info">
        <az-radio-option>This should be a good switch</az-radio-option>
        <az-radio-option>Second Choice</az-radio-option>
        <az-radio-option>Choice number 3</az-radio-option>
      </az-radio-group>

       <az-radio-group id="switchGroupWarning" title="Group of switch radios" itemType="switch" status="warning">
        <az-radio-option>This should be a good switch</az-radio-option>
        <az-radio-option>Second Choice</az-radio-option>
        <az-radio-option>Choice number 3</az-radio-option>
      </az-radio-group>

      <az-radio-group id="switchGroupAlert" title="Group of switch radios" itemType="switch" status="alert">
        <az-radio-option>This should be a good switch</az-radio-option>
        <az-radio-option>Second Choice</az-radio-option>
        <az-radio-option>Choice number 3</az-radio-option>
      </az-radio-group>

      <az-radio-group id="switchGroupError" title="Group of switch radios" itemType="switch" status="error">
        <az-radio-option>This should be a good switch</az-radio-option>
        <az-radio-option>Second Choice</az-radio-option>
        <az-radio-option>Choice number 3</az-radio-option>
      </az-radio-group>

      <az-radio-group id="disabledSwitchGroup" title="Disabled Group of switches" itemType="switch" isDisabled>
        <az-radio-option>This should be a good switch</az-radio-option>
        <az-radio-option>Second Choice</az-radio-option>
        <az-radio-option>Choice number 3</az-radio-option>
      </az-radio-group>
 </div>

<h2>Checkboxes and switches</h2>
  <div class="strip-h">
    <az-checkbox id="normalCheckbox" title="This is a checkbox"></az-checkbox>
    <az-checkbox id="errorCheckbox" title="This is a checkbox" status="error"></az-checkbox>
    <az-checkbox id="infoCheckbox" title="This is a checkbox" status="info"></az-checkbox>
    <az-checkbox id="disabledCheckbox" title="Disabled checkbox" isdisabled></az-checkbox>
  </div>
  <div class="strip-h">
    <az-checkbox id="switch" title="Is this a switch?" itemType="switch"></az-checkbox>
    <az-checkbox id="warnSwitch" title="This is a warning switch" itemType="switch" status="warning"></az-checkbox>
    <az-checkbox id="okSwitch" title="This is an OK switch" itemType="switch" status="ok"></az-checkbox>
    <az-checkbox id="disabledSwitch" title="This switch is disabled" itemType="switch" isdisabled></az-checkbox>
  </div>
  <h3>Label Positioning</h3>
  <p>Clockwise, the following positions are: <strong>top_center, top_right, middle_right, bottom_right, bottom_center, bottom_left, middle_left, top_left</strong>. The default position for checkboxes, switches, and radio groups is <strong>middle_right</strong> (set in radio-group.js and checkbox.js). Default position for text boxes should be <strong>top_left</strong>.</p>
  <div class="strip-h">
    <az-checkbox id="topLeftSwitch" title="aAa" itemType="switch" position="top_left"></az-checkbox>
    <az-checkbox id="topCenterSwitch" title="aAa" itemType="switch" position="top_center"></az-checkbox>
    <az-checkbox id="topRightSwitch" title="aAa" itemType="switch" position="top_right"></az-checkbox>
  </div>
  <div class="strip-h">
    <az-checkbox id="middleLeftSwitch" title="aAa" itemType="switch" position="middle_left"></az-checkbox>
    <az-checkbox id="middleRightSwitch" title="aAa" itemType="switch" position="middle_right"></az-checkbox>
  </div>
  <div class="strip-h">
    <az-checkbox id="bottomLeftSwitch" title="aAa" itemType="switch" position="bottom_left"></az-checkbox>
    <az-checkbox id="bottomCenterSwitch" title="aAa" itemType="switch" position="bottom_center"></az-checkbox>
    <az-checkbox id="bottomRightSwitch" title="aAa" itemType="switch" position="bottom_right"></az-checkbox>
  </div>
<h2>Text boxes</h2>
  <div class="strip-h">
    <az-text-input id="basicTextInput" title="Basic text input" placeholder="Type something here&hellip;"></az-text-input>
    <az-text-input id="basicPasswordInput" itemType="password" title="Basic password input" placeholder="Type something here&hellip;"></az-text-input>
    <az-text-input id="basicTextArea" itemType="long" title="Basic textarea input" placeholder="Type something here&hellip;"></az-text-input>
  </div>
  <hr>
  <div class="strip-h">
    <az-text-input id="defaultTextInput" title="Top Left" placeholder="Type something here&hellip;"></az-text-input>
    <az-text-input id="topCenterTextInput" title="Top Center" placeholder="Type something here&hellip;" position="top_center"></az-text-input>
    <az-text-input id="topRightTextInput" title="Top Right" placeholder="Type something here&hellip;" position="top_right"></az-text-input>
  </div>
  <div class="strip-h">
    <az-text-input id="middleLeftTextInput" title="Middle Left" placeholder="Type something here&hellip;" position="middle_left"></az-text-input>
    <az-text-input id="middleRightTextInput" title="Middle Right" placeholder="Type something here&hellip;" position="middle_right"></az-text-input>
  </div>
  <div class="strip-h">
    <az-text-input id="bottomLeftTextInput" title="Bottom Left" placeholder="Type something here&hellip;" position="bottom_left"></az-text-input>
    <az-text-input id="bottomCenterTextInput" title="Bottom Center" placeholder="Type something here&hellip;" position="bottom_center"></az-text-input>
    <az-text-input id="bottomRightTextInput" title="Bottom Right" placeholder="Type something here&hellip;" position="bottom_right"></az-text-input>
  </div>
  <hr>
  <div class="strip-h">
    <az-text-input id="rankOneInput" title="Rank Huge" placeholder="Type something here&hellip;" rank="1"></az-text-input>
    <az-text-input id="rankTwoInput" title="Rank Large" placeholder="Type something here&hellip;" rank="2"></az-text-input>
    <az-text-input id="rankThreeInput" title="Rank Default" placeholder="Type something here&hellip;"></az-text-input>
    <az-text-input id="rankFourInput" title="Rank Medium" placeholder="Type something here&hellip;" rank="4"></az-text-input>
    <az-text-input id="rankFiveInput" title="Rank Small" placeholder="Type something here&hellip;" rank="5"></az-text-input>
    <az-text-input id="rankSixInput" title="Rank Tiny" placeholder="Type something here&hellip;" rank="6"></az-text-input>
  </div>
  <hr>
  <div class="strip-h">
    <az-text-input id="defaultTextArea" title="Default Status" placeholder="Type something here&hellip;" itemType="long"></az-text-input>
    <az-text-input id="okTextArea" title="OK Status" placeholder="Type something here&hellip;" itemType="long" status="ok"></az-text-input>
    <az-text-input id="infoTextArea" title="Info Status" placeholder="Type something here&hellip;" itemType="long" status="info"></az-text-input>
    <az-text-input id="warningTextArea" title="Warning Status" placeholder="Type something here&hellip;" itemType="long" status="warning"></az-text-input>
    <az-text-input id="alertTextArea" title="Alert Status" placeholder="Type something here&hellip;" itemType="long" status="alert"></az-text-input>
    <az-text-input id="errorTextArea" title="Error Status" placeholder="Type something here&hellip;" itemType="long" status="error"></az-text-input>
  </div>
<h2>Selects/Combos</h2>
..tbd
<h2> Various elements combined</h2>
..tbd

`;
  }
}

window.customElements.define("az-test-showcase", Showcase);
