/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AzosElement, html, css, POSITION, RANK, STATUS } from "../ui";
import "../modal-dialog.js";
import "../parts/button.js";
import "../parts/check-field.js";
import "../parts/radio-group-field.js";
import "../parts/text-field.js";
import "../parts/select-field.js";
import "../parts/slider-field.js";
import "../vcl/util/code-box.js";
import "../vcl/util/accordion.js";
import "../vcl/tabs/tab-view.js";
import { Spinner } from "../spinner.js";
import { Toast } from "../toast.js";
import { Tab } from "../vcl/tabs/tab.js";

/** Test element used as a showcase of various parts and form elements in action */
export class Showcase extends AzosElement {
  constructor() { super(); }

  static styles = css`
  p{ font-size: 1rem; }

  /* Temp styles for context menu - MOVE TO COMPONENT (somehow) */
  .contextMenu{
    display:block;
    position:absolute;
    background-color:white;
    border:1px solid #ccc;
    box-shadow:2px 2px 10px rgba(0,0,0,.2);
    z-index:1000;
  }
  .contextMenu ul{
    list-style:none;
    padding:0;
    margin:0;
  }
  .contextMenu ul li{
    padding:10px 20px;
    cursor:pointer;
  }
  .contextMenu ul li:hover{
    background-color:#f0f0f0;
  }
  /* END Temp Styles */
  `;


  onDlg1Open() { this.dlg1.show(); }
  onDlg1Close() { this.dlg1.close(); }
  onDlg2Open() { this.dlg2.show(); }
  onDlg2Close() { this.dlg2.close(); }

  async onSpinnerProcess() {
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

  onModalSpinnerOpen() { this.spinnerModal.show(); }
  onNonModalSpinnerOpen() { this.spinnerNonModal.show(); }
  onNonModalSpinnerClose() { this.spinnerNonModal.hide(); }

  onAutoSpinnerOpen() { Spinner.show(null, 3000); }

  #onFieldChange(e) {
    console.log("Got change event from field: ", e.target.name, e.target.value);
    this.tbLastName.status = this.chkDrinks.value ? "alert" : "default";
  }

  toastCount = 0;
  async toastMe(multiple = false) {
    const toasts = multiple ? 20 : 1;
    for (let i = 0; i < toasts; i++) {
      temp(++this.toastCount);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    function temp(id) {
      const randomRank = false;
      const randomStatus = false;
      const randomPosition = false;
      const timeout = undefined; //1_000;

      const rank = randomRank ? Math.floor(Math.random() * Object.keys(RANK).length) : RANK.DEFAULT;
      const status = randomStatus ? ["ok", "info", "warning", "alert", "error"][Math.floor(Math.random() * Object.keys(STATUS).length)] : STATUS.DEFAULT;
      const position = randomPosition ? [...Object.values(POSITION)][Math.floor(Math.random() * Object.keys(POSITION).length)] : POSITION.DEFAULT;

      Toast.toast(`Your file 'c:\\windows\\junk\\text${id}.txt' has been saved!`, { timeout, rank, status, position });
    }
  }

  #id = 0;
  #addMoreTab() {
    const before = this.tabView.activeTab.nextVisibleTab;

    this.tabView.addTab(Tab, `Tab${++this.#id}`, before);
  }

  #move(steps) { (this.manMe || this.tabView.activeTab).move(steps); }
  #showHide() { (this.manMe || this.tabView.activeTab).hidden = !(this.manMe || this.tabView.activeTab).hidden; }

  render() {
    const showcase = this;

    return html`
<h1>Showcase of Azos Controls</h1>
<p>
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
</p>

<div style="display:flex;align-items:center;">
  <az-button style="display:unset;" @click=${this.#showHide} title="Show/Hide"></az-button>
  <az-button @click=${this.#addMoreTab} title="Add more..."></az-button>
</div>
<div style="display:flex;align-items:center;">
  <strong>Move Active Tab Left</strong>
  <az-button @click=${() => this.#move(-1)} title="1x"></az-button>
  <az-button @click=${() => this.#move(-2)} title="2x"></az-button>
  <strong>Right</strong>
  <az-button @click=${() => this.#move(1)} title="1x"></az-button>
  <az-button @click=${() => this.#move(2)} title="2x"></az-button>
</div>
<az-tab-view id="tabView" scope="this" @tabClosing="${(tab) => console.log(tab)}" .isDraggable="${true}">
  <az-tab title="Buttons" .canClose="${false}" iconPath="https://www.shareicon.net/download/2015/12/12/204044_angel.ico">
    <h2>az-button</h2>

    <az-button @click="${showcase.onSpinnerProcess}" title="Run Spinner Process..." status="info"></az-button>

    <p>Regular buttons of default status</p>
    <az-button title="Button 1"></az-button>
    <az-button title="OK"></az-button>
    <az-button title="Cancel"></az-button>
    <az-button title="Details..."></az-button>

    <p>Buttons with specific statuses</p>
    <az-button title="Regular"></az-button>
    <az-button title="Success" status="ok"></az-button>
    <az-button title="Information" status="info"></az-button>
    <az-button title="Warning" status="warning"></az-button>
    <az-button title="Alert" status="alert"></az-button>
    <az-button title="Error" status="error"></az-button>

    <p>Disabled buttons</p>
    <az-button title="Regular" isdisabled></az-button>
    <az-button title="Success" status="ok" isdisabled></az-button>
    <az-button title="Information" status="info" isdisabled></az-button>
    <az-button title="Warning" status="warning" isdisabled></az-button>
    <az-button title="Alert" status="alert" isdisabled></az-button>
    <az-button title="Error" status="error" isdisabled></az-button>
  </az-tab>

  <az-tab title="Input Test">
    <h2>Testing @change with az-text and az-check</h2>

    <az-text id="tbNasa" scope="window" name="Nasa" title="Nasa Experimentation" placeholder="Hatch diameter inches" @change="${this.#onFieldChange}" datatype="int" value="10"></az-text>

    <az-text id="tbFirstName" scope="this" name="FN" title="First Name" placeholder="Patient First Name" @change="${this.#onFieldChange}" value="SHITTERESSS"></az-text>
    <az-text id="tbLastName" scope="this" name="LN" title="Last Name" placeholder="Patient Last Name" @change="${this.#onFieldChange}"></az-text>

    <az-check id="chkSmokes" scope="this" name="Smokes" title="He smokes" @change="${this.#onFieldChange}"></az-check>
    <az-check id="chkDrinks"scope="this"  name="Drinks" title="He drinks hard liquor" @change="${this.#onFieldChange}"></az-check>
  </az-tab>

  <az-tab title="VCL / Codebox" status="ok">
    <h2> VCL / Codebox</h2>

    <az-code-box highlight="js" source="">//this is my json object
    {
      "a": 1, "b": 2, "c": true,
      d: ["string1", null, true, false, {"name": "string2", "salary": 100.67}],
      "c": "string message",
      "d": [{"a": -123.032, "b": +45}, false, null, null, "ok"]
    }
    </az-code-box>
  </az-tab>

  <az-tab title="Radios">
    <h2>Radios</h2>
    <p>A long-used form of placeholder text in design mockups and more, the standard use of dummy text has come under fire in recent years as web design grows (and the internet makes the spread of opinions much more efficient).</p>
    <az-radio-group id="baseGroup" value="choiceOption" title="Group of radios (choose only 1)">
      <item title="Option 1" value="v1"></item>
      <item title="Option 2" value="v2"></item>
      <item title="Another"  value="v3"></item>
      <item title="Snake Number Four"  value="v4"></item>
    </az-radio-group>
  </az-tab>

  <az-tab title="Checkboxes &amp; Switches" status="info">
    <h2>Checkboxes and switches</h2>
    <div class="strip-h">
      <az-check id="normalCheckbox" title="This is a checkbox" titleWidth="60"></az-check>
      <az-check id="errorCheckbox" title="Required checkbox!" status="error" titlePosition="mid-left" isRequired></az-check>
      <az-check id="infoCheckbox" title="This is a checkbox" status="info" titlePosition="mid-left"></az-check>
      <az-check id="disabledCheckbox" title="Disabled checkbox" titlePosition="mid-left" isdisabled></az-check>
    </div>
    <div class="strip-h">
      <az-check id="switch" title="Is this a switch?" itemType="switch" titlePosition="mid-right"></az-check>
      <az-check id="warnSwitch" title="This is a warning switch" itemType="switch" status="warning" titlePosition="mid-right"></az-check>
      <az-check id="okSwitch" title="This is an OK switch" itemType="switch" status="ok" titlePosition="mid-right"></az-check>
      <az-check id="disabledSwitch" title="This switch is disabled" itemType="switch" titlePosition="mid-right" isdisabled></az-check>
    </div>
    <h3>Title Positioning</h3>
    <p>Clockwise, the following titlePositions are: <strong>top-left, top-center, top-right, mid-left, mid-right, bottom-left, bottom-center, bottom-right</strong>. The default titlePosition is <strong>top-left</strong>.</p>
    <div class="strip-h">
      <az-check id="topLeftSwitch" title="aAa" itemType="switch" titlePosition="top-left"></az-check>
      <az-check id="topCenterSwitch" title="aAa" itemType="switch" titlePosition="top-center"></az-check>
      <az-check id="topRightSwitch" title="aAa" itemType="switch" titlePosition="top-right"></az-check>
    </div>
    <div class="strip-h">
      <az-check id="midLeftSwitch" title="aAa" itemType="switch" titlePosition="mid-left" titleWidth="25"></az-check>
      <az-check id="midRightSwitch" title="aAa" itemType="switch" titlePosition="mid-right" titleWidth="25"></az-check>
    </div>
    <div class="strip-h">
      <az-check id="botLeftSwitch" title="aAa" itemType="switch" titlePosition="bottom-left"></az-check>
      <az-check id="botCenterSwitch" title="aAa" itemType="switch" titlePosition="bottom-center"></az-check>
      <az-check id="botRightSwitch" title="aAa" itemType="switch" titlePosition="bottom-right"></az-check>
    </div>
  </az-tab>

  <az-tab title="Text Fields">
    <h2>Text boxes</h2>
    <div class="strip-h">
      <az-text id="basicTextInput" title="Basic text input" placeholder="Type something here&hellip;"></az-text>
      <az-text id="basicPasswordInput" itemType="password" title="Basic password input" placeholder="Type something here&hellip;"></az-text>
      <az-text id="requiredInput" title="This is a required field" placeholder="Type something here&hellip;" isRequired></az-text>
      <az-text id="readOnlyInput" title="Read Only field" value="Read-only value" isReadonly></az-text>
      <az-text id="disabledInput" title="This is a disabled field" value="Disabled value" isDisabled></az-text>
      <az-text id="basicTextArea" itemType="long" title="Basic textarea input" placeholder="Type something here&hellip;"></az-text>
    </div>
    <hr>
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
      <az-text id="okSimple" title="OK Status" placeholder="Type something here&hellip;" message="All good!" status="ok"></az-text>
      <az-text id="infoSimple" title="Info Status" placeholder="Type something here&hellip;" message="Do your research" status="info"></az-text>
      <az-text id="warningSimple" title="Warning Status" placeholder="Type something here&hellip;" message="Crap! You ran over a damn skunk!" status="warning"></az-text>
      <az-text id="alertSimple" title="Alert Status" placeholder="Type something here&hellip;" message="Shit hit the fan!" status="alert"></az-text>
      <az-text id="errorSimple" title="Error Status" placeholder="Type something here&hellip;" message="Now go clean it up" status="error"></az-text>
    </div>
    <div class="strip-h">
      <az-text id="defaultTextArea" title="Default Status" placeholder="Type something here&hellip;" itemType="long"></az-text>
      <az-text id="okTextArea" title="OK Status" placeholder="Type something here&hellip;" itemType="long" status="ok"></az-text>
      <az-text id="infoTextArea" title="Info Status" placeholder="Type something here&hellip;" itemType="long" status="info"></az-text>
      <az-text id="warningTextArea" title="Warning Status" placeholder="Type something here&hellip;" itemType="long" status="warning"></az-text>
      <az-text id="alertTextArea" title="Alert Status" placeholder="Type something here&hellip;" itemType="long" status="alert"></az-text>
      <az-text id="errorTextArea" title="Error Status" placeholder="Type something here&hellip;" itemType="long" status="error"></az-text>
    </div>
  </az-tab>

  <az-tab title="Select Field" status="warning">
    <h2>Selects/Combos</h2>
    <az-select id="defaultSelect" title="Select one of the following from the dropdown">
      <az-select-option value="" title="Select an option&hellip;"></az-select-option>
      <az-select-option value="valueOne" title="Selected first value"></az-select-option>
      <az-select-option value="secondValue" title="Select second option"></az-select-option>
      <az-select-option value="thirdOption" title="This is an option"></az-select-option>
      <az-select-option value="opt4" title="Option #4"></az-select-option>
      <az-select-option value="fifthValue" title="OPTION FIVE"></az-select-option>
      <az-select-option value="value6" title="Yet another option"></az-select-option>
      <az-select-option value="numberSeven" title="Are you losing count yet?"></az-select-option>
      <az-select-option value="eighthOption" title="Maybe chose this one"></az-select-option>
      <az-select-option value="optionNine" title="Almost done"></az-select-option>
      <az-select-option value="finalValue" title="Last test option"></az-select-option>
    </az-select>
  </az-tab>

  <az-tab title="Sliders (WIP)" status="error">
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
  </az-tab>

  <az-tab title="Accordion">
    <az-accordion name="accordion" width="75%" align="center" activeItemIndex="2">
      <az-accordion-item title="First accordion item">
        <p>Eu culpa dolore adipisicing qui cillum duis incididunt consequat amet. <strong><em>Non ipsum nostrud</em></strong> culpa nulla quis dolor culpa commodo anim labore sit fugiat culpa minim. Adipisicing et qui ex cupidatat excepteur anim laborum eiusmod aute amet cupidatat et. Eiusmod qui eiusmod Lorem amet cupidatat esse aliqua ipsum ex laborum officia reprehenderit incididunt adipisicing. Sint quis cupidatat commodo aliquip mollit enim voluptate dolore consectetur.</p>
        <h3>Irure minim qui esse dolor. Reprehenderit culpa minim reprehenderit Lorem exercitation cillum magna laboris. Ea in dolor ut ipsum officia commodo sit. Veniam ut nulla culpa veniam tempor duis aliquip in velit consequat incididunt enim reprehenderit.</h3>
        <blockquote>Magna pariatur reprehenderit ullamco labore. Ullamco deserunt enim irure ex Lorem ex. Est proident nulla fugiat fugiat non incididunt dolore pariatur. Commodo do quis nulla elit non id in est esse est anim adipisicing id. Culpa eu fugiat qui et et. Culpa esse occaecat aliqua nostrud et cupidatat. Aute ipsum voluptate exercitation quis labore exercitation aliquip ad exercitation non irure.</blockquote>
        <p>Laboris sint elit incididunt sit consectetur consectetur aliquip consequat nostrud eu nostrud ullamco ad. Aliquip laboris adipisicing Lorem quis occaecat reprehenderit. Nostrud voluptate sunt est commodo. Lorem eiusmod laboris non non.</p>
      </az-accordion-item>
      <az-accordion-item title="Item #2 going #2 all over the fkin place">
        <h1 style="text-decoration:strikethrough;"><em>Tempor quis sit eu laborum velit enim irure velit quis.</em></h1>
      </az-accordion-item>
      <az-accordion-item title="Open when parent's activeItemIndex is 2">
        <h3><em>It's-a me! Maaahhhhhreeeooo</em></h3>
        <img src="https://shawntgray.com/preNov2023/img/img/180612.png" alt="mahrio" style="width:75%;" />
      </az-accordion-item>
    </az-accordion>
  </az-tab>

  <az-tab title="Modal Dialogs">
    <p>@click action buttons</p>
    <az-button @click="${this.onDlg1Open}" title="Open..."></az-button>
    <az-button @click="${this.onDlg2Open}" title="Open Code..." status="info"></az-button>

    <az-button @click="${this.onModalSpinnerOpen}" title="Open Modal Spinner..." status="alert"></az-button>
    <az-button @click="${this.onSpinnerProcess}" title="Run Spinner Process..." status="info"></az-button>

    <az-button @click="${this.onNonModalSpinnerOpen}" title="Open NM Spinner..." status="info"></az-button>
    <az-button @click="${this.onNonModalSpinnerClose}" title="Close NM Spinner..." status="info"></az-button>

    <az-button @click="${this.onAutoSpinnerOpen}" title="Auto Spinner..." status="info"></az-button>

    <az-menu-sg></az-menu-sg>

  </az-tab>

  <az-tab title="Toasts">
    <az-button @click="${() => this.toastMe(false)}" title="Toast Me..."></az-button>
    <az-button @click="${() => this.toastMe(true)}" title="Toast Me Many..."></az-button>
  </az-tab>

  <az-tab title="Tab 1">
    <p>Eu culpa dolore adipisicing qui cillum duis incididunt consequat amet. <strong><em>Non ipsum nostrud</em></strong> culpa nulla quis dolor culpa commodo anim labore sit fugiat culpa minim. Adipisicing et qui ex cupidatat excepteur anim laborum eiusmod aute amet cupidatat et. Eiusmod qui eiusmod Lorem amet cupidatat esse aliqua ipsum ex laborum officia reprehenderit incididunt adipisicing. Sint quis cupidatat commodo aliquip mollit enim voluptate dolore consectetur.</p>
    <h3>Irure minim qui esse dolor. Reprehenderit culpa minim reprehenderit Lorem exercitation cillum magna laboris. Ea in dolor ut ipsum officia commodo sit. Veniam ut nulla culpa veniam tempor duis aliquip in velit consequat incididunt enim reprehenderit.</h3>
    <blockquote>Magna pariatur reprehenderit ullamco labore. Ullamco deserunt enim irure ex Lorem ex. Est proident nulla fugiat fugiat non incididunt dolore pariatur. Commodo do quis nulla elit non id in est esse est anim adipisicing id. Culpa eu fugiat qui et et. Culpa esse occaecat aliqua nostrud et cupidatat. Aute ipsum voluptate exercitation quis labore exercitation aliquip ad exercitation non irure.</blockquote>
    <p>Laboris sint elit incididunt sit consectetur consectetur aliquip consequat nostrud eu nostrud ullamco ad. Aliquip laboris adipisicing Lorem quis occaecat reprehenderit. Nostrud voluptate sunt est commodo. Lorem eiusmod laboris non non.</p>
  </az-tab>

  <az-tab title="Second Tab">
    <h1 style="text-decoration:strikethrough;"><em>Tempor quis sit eu laborum velit enim irure velit quis.</em></h1>
  </az-tab>

  <az-tab title="This is a very long title, yes a long long title that is still going on. Is this long enough?">
    <img src="https://shawntgray.com/preNov2023/img/img/180613.jpg" alt="Yahshee" />
  </az-tab>

</az-tab-view>



<az-spinner id="spinnerModal" scope="this" status="alert" timeout="5000" isModal></az-spinner>
<az-spinner id="spinnerNonModal" scope="this" status="info" timeout="10000" message="Dill helps to expel what you propel"></az-spinner>

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
    </az-code-box>
    <br>
    <az-button @click="${this.onDlg2Close}" title="Close" style="float: right;"></az-button>
  </div>
</az-modal-dialog>
`;
  }
}

window.customElements.define("az-test-showcase", Showcase);
