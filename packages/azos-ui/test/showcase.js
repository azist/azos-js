import { AzosElement, html, css } from "../ui";
import "../modal-dialog.js";
import "../parts/button.js";
import "../parts/check-field.js";
import "../parts/radio-group-field.js";
import "../parts/text-field.js";
import "../parts/select-field.js";
import "../parts/slider-field.js";
import "../vcl/util/code-box.js";
import { Spinner } from "../spinner.js";

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

  async onSpinnerProcess(){
    Spinner.exec(async sp => {
     sp.message = `Prepping DB...`;
     await new Promise(resolve => setTimeout(resolve, 1070));
     sp.message = `Exec DDL 1 of 5 ...`;
     await new Promise(resolve => setTimeout(resolve, 1500));
     sp.message = `Exec DDL 2 of 5 ...`;
     await new Promise(resolve => setTimeout(resolve, 890));
     sp.message = `Exec DDL 3 of 5 ...`;
     await new Promise(resolve => setTimeout(resolve, 1232));
     sp.status = "error";
     sp.message = `Recovering DDL error...`;
     await new Promise(resolve => setTimeout(resolve, 2370));
     sp.status = "warning";
     sp.message = `Exec DDL 4 of 5 ...`;
     await new Promise(resolve => setTimeout(resolve, 1870));
     sp.message = `Exec DDL 5 of 5 ...`;
     sp.status = "ok";
     await new Promise(resolve => setTimeout(resolve, 2360));
    });
  }

  onModalSpinnerOpen(){ this.spinnerModal.show(); }
  onNonModalSpinnerOpen(){ this.spinnerNonModal.show(); }
  onNonModalSpinnerClose(){ this.spinnerNonModal.hide(); }

  onAutoSpinnerOpen(){ Spinner.show(null, 3000); }

  #onFieldChange(e){
    console.log("Got change event from field: ", e.target.name, e.target.value);
    this.tbLastName.status = this.chkDrinks.value ? "alert" : "default";
  }



  render(){
    return html`

<h1>Showcase of Azos Controls</h1>

<h2>Modal dialog</h2>
<p>
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
</p>

<az-button @click="${this.onDlg1Open}" title="Open..."></az-button>
<az-button @click="${this.onDlg2Open}" title="Open Code..." status="info"></az-button>

<az-button @click="${this.onModalSpinnerOpen}" title="Open Modal Spinner..." status="alert"></az-button>
<az-button @click="${this.onSpinnerProcess}" title="Run Spinner Process..." status="info"></az-button>

<az-button @click="${this.onNonModalSpinnerOpen}" title="Open NM Spinner..." status="info"></az-button>
<az-button @click="${this.onNonModalSpinnerClose}" title="Close NM Spinner..." status="info"></az-button>

<az-button @click="${this.onAutoSpinnerOpen}" title="Auto Spinner..." status="info"></az-button>

<az-spinner id="spinnerModal" scope="this" status="alert" timeout="5000" isModal></az-spinner>
<az-spinner id="spinnerNonModal" scope="this" status="info" timeout="10000" message="Dill helps to expel what you propel"></az-spinner>

<az-text-field id="tbFirstName" scope="this" name="FN" title="First Name" placeholder="Patient First Name" @change="${this.#onFieldChange}"></az-text-field>
<az-text-field id="tbLastName" scope="this" name="LN" title="Last Name" placeholder="Patient Last Name" @change="${this.#onFieldChange}"></az-text-field>

<az-checkbox id="chkSmokes" scope="this" name="Smokes" title="He smokes" @change="${this.#onFieldChange}"></az-checkbox>
<az-checkbox id="chkDrinks"scope="this"  name="Drinks" title="He drinks hard liquor" @change="${this.#onFieldChange}"></az-checkbox>


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
    <az-code-box highlight="js" source="">//this is my json object
{
  "a": 1, "b": 2, "c": true,
  d: ["string1", null, true, false, {"name": "string2", "salary": 100.67}],
  "c": "string message",
  "d": [{"a": -123.032, "b": +45}, false, null, null, "ok"]
}
</az-code-box> <br>
    <az-button @click="${this.onDlg2Close}" title="Close" style="float: right;"></az-button>
  </div>
</az-modal-dialog>

<h2> VCL / Codebox</h2>

<az-code-box highlight="js" source="">//this is my json object
{
  "a": 1, "b": 2, "c": true,
  d: ["string1", null, true, false, {"name": "string2", "salary": 100.67}],
  "c": "string message",
  "d": [{"a": -123.032, "b": +45}, false, null, null, "ok"]
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

      <az-radio-group id="baseGroup" value="choiceOption" title="Group of radios (choose only 1)">
        <az-radio-option title="Option 1" value="value0"></az-radio-option>
        <az-radio-option title="Second Choice" value="anotherValue"></az-radio-option>
        <az-radio-option title="Choice number 3" value="choiceOption"></az-radio-option>
      </az-radio-group>

<h2>Checkboxes and switches</h2>
  <div class="strip-h">
    <az-checkbox id="normalCheckbox" title="This is a checkbox" titleWidth="60"></az-checkbox>
    <az-checkbox id="errorCheckbox" title="Required checkbox!" status="error" titlePosition="mid-left" isRequired></az-checkbox>
    <az-checkbox id="infoCheckbox" title="This is a checkbox" status="info" titlePosition="mid-left"></az-checkbox>
    <az-checkbox id="disabledCheckbox" title="Disabled checkbox" titlePosition="mid-left" isdisabled></az-checkbox>
  </div>
  <div class="strip-h">
    <az-checkbox id="switch" title="Is this a switch?" itemType="switch" titlePosition="mid-right"></az-checkbox>
    <az-checkbox id="warnSwitch" title="This is a warning switch" itemType="switch" status="warning" titlePosition="mid-right"></az-checkbox>
    <az-checkbox id="okSwitch" title="This is an OK switch" itemType="switch" status="ok" titlePosition="mid-right"></az-checkbox>
    <az-checkbox id="disabledSwitch" title="This switch is disabled" itemType="switch" titlePosition="mid-right" isdisabled></az-checkbox>
  </div>
  <h3>Title Positioning</h3>
  <p>Clockwise, the following titlePositions are: <strong>top-left, top-center, top-right, mid-left, mid-right, bottom-left, bottom-center, bottom-right</strong>. The default titlePosition is <strong>top-left</strong>.</p>
  <div class="strip-h">
    <az-checkbox id="topLeftSwitch" title="aAa" itemType="switch" titlePosition="top-left"></az-checkbox>
    <az-checkbox id="topCenterSwitch" title="aAa" itemType="switch" titlePosition="top-center"></az-checkbox>
    <az-checkbox id="topRightSwitch" title="aAa" itemType="switch" titlePosition="top-right"></az-checkbox>
  </div>
  <div class="strip-h">
    <az-checkbox id="midLeftSwitch" title="aAa" itemType="switch" titlePosition="mid-left" titleWidth="25"></az-checkbox>
    <az-checkbox id="midRightSwitch" title="aAa" itemType="switch" titlePosition="mid-right" titleWidth="25"></az-checkbox>
  </div>
  <div class="strip-h">
    <az-checkbox id="botLeftSwitch" title="aAa" itemType="switch" titlePosition="bottom-left"></az-checkbox>
    <az-checkbox id="botCenterSwitch" title="aAa" itemType="switch" titlePosition="bottom-center"></az-checkbox>
    <az-checkbox id="botRightSwitch" title="aAa" itemType="switch" titlePosition="bottom-right"></az-checkbox>
  </div>
<h2>Text boxes</h2>
  <div class="strip-h">
    <az-text-field id="basicTextInput" title="Basic text input" placeholder="Type something here&hellip;"></az-text-field>
    <az-text-field id="basicPasswordInput" itemType="password" title="Basic password input" placeholder="Type something here&hellip;"></az-text-field>
    <az-text-field id="requiredInput" title="This is a required field" placeholder="Type something here&hellip;" isRequired></az-text-field>
    <az-text-field id="readOnlyInput" title="Read Only field" value="Read-only value" isReadonly></az-text-field>
    <az-text-field id="disabledInput" title="This is a disabled field" value="Disabled value" isDisabled></az-text-field>
    <az-text-field id="basicTextArea" itemType="long" title="Basic textarea input" placeholder="Type something here&hellip;"></az-text-field>
  </div>
  <hr>
  <div class="strip-h">
    <az-text-field id="defaultTextInput" title="Top Left" placeholder="Type something here&hellip;"></az-text-field>
    <az-text-field id="topCenterTextInput" title="Top Center" placeholder="Type something here&hellip;" titlePosition="top-center"></az-text-field>
    <az-text-field id="topRightTextInput" title="Top Right" placeholder="Type something here&hellip;" titlePosition="top-right"></az-text-field>
  </div>
  <div class="strip-h">
    <az-text-field id="midLeftTextInput" title="Middle Left" placeholder="Type something here&hellip;" titlePosition="mid-left"></az-text-field>
    <az-text-field id="midRightTextInput" title="Middle Right" placeholder="Type something here&hellip;" titlePosition="mid-right"></az-text-field>
  </div>
  <div class="strip-h">
    <az-text-field id="botLeftTextInput" title="Bottom Left" placeholder="Type something here&hellip;" titlePosition="bottom-left"></az-text-field>
    <az-text-field id="botCenterTextInput" title="Bottom Center" placeholder="Type something here&hellip;" titlePosition="bottom-center"></az-text-field>
    <az-text-field id="botRightTextInput" title="Bottom Right" placeholder="Type something here&hellip;" titlePosition="bottom-right"></az-text-field>
  </div>
  <hr>
  <div class="strip-h">
    <az-text-field id="rankOneInput" title="Rank Huge" placeholder="Type something here&hellip;" rank="1"></az-text-field>
    <az-text-field id="rankTwoInput" title="Rank Large" placeholder="Type something here&hellip;" rank="2" message="Don&apos;t skip this required field" isRequired></az-text-field>
    <az-text-field id="rankThreeInput" title="Rank Default" placeholder="Type something here&hellip;"></az-text-field>
    <az-text-field id="rankFourInput" title="Rank Medium" placeholder="Type something here&hellip;" rank="4"></az-text-field>
    <az-text-field id="rankFiveInput" title="Rank Small" placeholder="Type something here&hellip;" rank="5"></az-text-field>
    <az-text-field id="rankSixInput" title="Rank Tiny" placeholder="Type something here&hellip;" rank="6"></az-text-field>
  </div>
  <hr>
  <div class="strip-h">
    <az-text-field id="okSimple" title="OK Status" placeholder="Type something here&hellip;" message="All good!" status="ok"></az-text-field>
    <az-text-field id="infoSimple" title="Info Status" placeholder="Type something here&hellip;" message="Do your research" status="info"></az-text-field>
    <az-text-field id="warningSimple" title="Warning Status" placeholder="Type something here&hellip;" message="Crap! You ran over a damn skunk!" status="warning"></az-text-field>
    <az-text-field id="alertSimple" title="Alert Status" placeholder="Type something here&hellip;" message="Shit hit the fan!" status="alert"></az-text-field>
    <az-text-field id="errorSimple" title="Error Status" placeholder="Type something here&hellip;" message="Now go clean it up" status="error"></az-text-field>
  </div>
  <div class="strip-h">
    <az-text-field id="defaultTextArea" title="Default Status" placeholder="Type something here&hellip;" itemType="long"></az-text-field>
    <az-text-field id="okTextArea" title="OK Status" placeholder="Type something here&hellip;" itemType="long" status="ok"></az-text-field>
    <az-text-field id="infoTextArea" title="Info Status" placeholder="Type something here&hellip;" itemType="long" status="info"></az-text-field>
    <az-text-field id="warningTextArea" title="Warning Status" placeholder="Type something here&hellip;" itemType="long" status="warning"></az-text-field>
    <az-text-field id="alertTextArea" title="Alert Status" placeholder="Type something here&hellip;" itemType="long" status="alert"></az-text-field>
    <az-text-field id="errorTextArea" title="Error Status" placeholder="Type something here&hellip;" itemType="long" status="error"></az-text-field>
  </div>
  <hr>
<h2>Selects/Combos</h2>
  <div class="strip-h">
    <az-select id="defaultSelect" title="Select one of the following from the dropdown">
      <az-select-option>Select an option&hellip;</az-select-option>
      <az-select-option value="valueOne">Selected first value</az-select-option>
      <az-select-option value="secondValue">Select second option</az-select-option>
      <az-select-option value="thirdOption">This is an option</az-select-option>
      <az-select-option value="opt4">Option #4</az-select-option>
      <az-select-option value="fifthValue">OPTION FIVE</az-select-option>
      <az-select-option value="value6">Yet another option</az-select-option>
      <az-select-option value="numberSeven">Are you losing count yet?</az-select-option>
      <az-select-option value="eighthOption">Maybe chose this one</az-select-option>
      <az-select-option value="optionNine">Almost done</az-select-option>
      <az-select-option value="finalValue">Last test option</az-select-option>
    </az-select>
    <az-select id="selectedSelect" title="Select with a predetermined value" value="eighthOption">
      <az-select-option>Select an option&hellip;</az-select-option>
      <az-select-option value="valueOne">Selected first value</az-select-option>
      <az-select-option value="secondValue">Select second option</az-select-option>
      <az-select-option value="thirdOption">This is an option</az-select-option>
      <az-select-option value="opt4">Option #4</az-select-option>
      <az-select-option value="fifthValue">OPTION FIVE</az-select-option>
      <az-select-option value="value6">Yet another option</az-select-option>
      <az-select-option value="numberSeven">Are you losing count yet?</az-select-option>
      <az-select-option value="eighthOption">Maybe chose this one</az-select-option>
      <az-select-option value="optionNine">Almost done</az-select-option>
      <az-select-option value="finalValue">Last test option</az-select-option>
    </az-select>
    <az-select id="alertSelect" title="Alert! Select something!" status="alert" isRequired>
      <az-select-option>Select an option&hellip;</az-select-option>
      <az-select-option value="valueOne">Selected first value</az-select-option>
      <az-select-option value="secondValue">Select second option</az-select-option>
      <az-select-option value="thirdOption">This is an option</az-select-option>
      <az-select-option value="opt4">Option #4</az-select-option>
      <az-select-option value="fifthValue">OPTION FIVE</az-select-option>
      <az-select-option value="value6">Yet another option</az-select-option>
      <az-select-option value="numberSeven">Are you losing count yet?</az-select-option>
      <az-select-option value="eighthOption">Maybe chose this one</az-select-option>
      <az-select-option value="optionNine">Almost done</az-select-option>
      <az-select-option value="finalValue">Last test option</az-select-option>
    </az-select>
    <az-select id="disabledSelect" title="This select is disabled" isDisabled>
      <az-select-option>Select an option&hellip;</az-select-option>
      <az-select-option value="valueOne">Selected first value</az-select-option>
      <az-select-option value="secondValue">Select second option</az-select-option>
      <az-select-option value="thirdOption">This is an option</az-select-option>
      <az-select-option value="opt4">Option #4</az-select-option>
      <az-select-option value="fifthValue">OPTION FIVE</az-select-option>
      <az-select-option value="value6">Yet another option</az-select-option>
      <az-select-option value="numberSeven">Are you losing count yet?</az-select-option>
      <az-select-option value="eighthOption">Maybe chose this one</az-select-option>
      <az-select-option value="optionNine">Almost done</az-select-option>
      <az-select-option value="finalValue">Last test option</az-select-option>
    </az-select>
    <az-select id="multiSelect" title="Choose one or more (CTRL+Click or CMD+Click to select multiple options). **NOT RECOMMENDED FOR MOBILE USE**" itemType="multiple">
      <az-select-option>Select an option&hellip;</az-select-option>
      <az-select-option value="valueOne">Selected first value</az-select-option>
      <az-select-option value="secondValue">Select second option</az-select-option>
      <az-select-option value="thirdOption">This is an option</az-select-option>
      <az-select-option value="opt4">Option #4</az-select-option>
      <az-select-option value="fifthValue">OPTION FIVE</az-select-option>
      <az-select-option value="value6">Yet another option</az-select-option>
      <az-select-option value="numberSeven">Are you losing count yet?</az-select-option>
      <az-select-option value="eighthOption">Maybe chose this one</az-select-option>
      <az-select-option value="optionNine">Almost done</az-select-option>
      <az-select-option value="finalValue">Last test option</az-select-option>
    </az-select>
  </div>
  <hr>
<h2>Sliders</h2>
  <p>This az-slider renders as an &lt;input type="range"&gt; element. These are the available properties/attributes:</p>
  <ol>
    <li>General attributes: id, title, titlePosition, titleWidth, inputWidth rank, status, isDisabled, isRequired</li>
    <li>rangeMin, rangeMax - slider's extremes</li>
    <li>rangeStep - Interval that controls the slider's granularity. Default is 1.</li>
    <li>value - if not defined, defaults to median of rangeMin & rangeMax</li>
    <li>valueLabel - value's description</li>
    <li>displayValue - Boolean treated as "isDisabled," "isRequired," or "isReadonly". Displays valueLabel followed by value.</li>
    <li>orientation - determines if slider is horizontal or vertical</li>
    <li>numTicks - Number of evenly-spaced tick marks displayed on the slider</li>
  </ol>
  <br>
  <az-slider
    id="basicSlider"
    title="Basic Slider"
    rangeMin="0"
    rangeMax="10"
    rangeStep="1"
    numTicks="5"
    status="alert"
    displayValue
    valueLabel="Number of tomatoes: "
  ></az-slider>
<h2> Various elements combined</h2>
..tbd

`;
  }
}

window.customElements.define("az-test-showcase", Showcase);
