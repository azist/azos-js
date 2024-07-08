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
    <az-checkbox id="disabledCheckbox" title="Disabled checkbox" isdisabled></az-checkbox>
  </div>
  <div class="strip-h">
    <az-checkbox id="switch" title="Is this a switch?" type="switch"></az-checkbox>
    <az-checkbox id="disabledSwitch" title="This switch is disabled" type="switch" isdisabled></az-checkbox>
  </div>
<h2>Text boxes</h2>
  <div class="strip-h">
    <az-text-input id="single-line-input" type="input" title="Single Line Input" placeholder="Enter text here"></az-text-input>
    <az-text-input id="multiline-input" type="textarea" title="Multiline Input" placeholder="Enter multiline text here"></az-text-input>
  </div>
  <div class="strip-h">
    <az-text-input id="single-line-input" type="input" title="Single Line Input" placeholder="Enter text here" status="ok"></az-text-input>
    <az-text-input id="multiline-input" type="textarea" title="Multiline Input" placeholder="Enter multiline text here" status="ok"></az-text-input>
  </div>
  <div class="strip-h">
    <az-text-input id="single-line-input" type="input" title="Single Line Input" placeholder="Enter text here" status="error"></az-text-input>
    <az-text-input id="multiline-input" type="textarea" title="Multiline Input" placeholder="Enter multiline text here" status="error"></az-text-input>
  </div>
  <div class="strip-h">
    <az-text-input id="disabled-input" type="input" title="Disabled Input" placeholder="Disabled input" status="alert" isdisabled></az-text-input>
    <az-text-input id="disabled-textarea" type="textarea" title="Disabled Textarea" placeholder="Disabled textarea" status="alert" isdisabled></az-text-input>
  </div>
<h2>Selects/Combos</h2>
..tbd
<h2> Various elements combined</h2>
..tbd

`;
  }
}

window.customElements.define("az-test-showcase", Showcase);
