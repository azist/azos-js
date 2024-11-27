/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Control, html, css, POSITION, RANK, STATUS, renderInto } from "../ui";
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
import "../vcl/tree-view/tree-view.js";
import "../vcl/time/scheduler.js";
import "../vcl/slides/slide-deck.js";
import { Spinner } from "../spinner.js";
import { Toast } from "../toast.js";
import { Tab } from "../vcl/tabs/tab.js";
import { popupMenu } from "../popup-menu.js";
import { asBool, isObject, isObjectOrArray } from "azos/types";

/** Test element used as a showcase of various parts and form elements in action */
export class Showcase extends Control {
  static properties = {
    tocSections: { type: Array }
  };

  static styles = css`
:host{ display:block; }
p{ font-size: 1rem; }
.strip-h{ display:flex;align-items:center;margin-bottom:0.5em;gap:1ch; }
.strip-h az-button{ margin:0; }
#ToC, #Content > div{ scroll-margin-top: 50px; }
  `;

  #showTabbed = false;
  get showTabbed() { return this.#showTabbed; }
  set showTabbed(v) {
    this.#showTabbed = v;
    this.requestUpdate();
    setTimeout(() => this.#showcaseSetup(), 100);
  }


  toastCount = 0;
  #id = 0;
  constructor() {
    super();
    this.tocSections = [];
  }

  #btnDlg1Open() { this.dlg1.show(); }
  #btnDlg1Close() { this.dlg1.close(); }
  #btnDlg2Open() { this.dlg2.show(); }
  #btnDlg2Close() { this.dlg2.close(); }
  #btnIsHidden() { this.btnSave.isHidden = !this.btnSave.isHidden; }
  #btnIsAbsent() { this.btnSave.isAbsent = !this.btnSave.isAbsent; }
  #btnModalSpinnerOpen() { this.spinnerModal.show(); }
  #btnNonModalSpinnerOpen() { this.spinnerNonModal.show(); }
  #btnNonModalSpinnerClose() { this.spinnerNonModal.hide(); }
  #btnAutoSpinnerOpen() { Spinner.show(null, 3000); }

  #btnPopupMenuClick() {
    popupMenu([
      {
        title: "Dima",
        rank: 3,
        status: "default"
      }, {
        title: "Shawn",
        rank: 2,
        status: "ok",
        subMenu: [
          {
            title: "Dima",
            rank: 3,
            status: "default"
          }, {
            title: "Shawn",
            rank: 2,
            status: "ok"
          }, {
            title: "Kevin",
            rank: 3,
            status: "default"
          }, {
            title: "Shitstain Steven",
            rank: 3,
            status: "default"
          }
        ]
      }, {
        title: "Kevin",
        rank: 3,
        status: "default"
      }, {
        title: "Shitstain Steven",
        rank: 3,
        status: "default"
      }
    ], this.btnPopupMenu, "mid-right");
  }

  #btnShowHideTab() { this.tabView.tabs[0].isAbsent = !this.tabView.tabs[0].isAbsent; }
  #btnToggleTabVisibility() { this.tabView.tabs[0].isHidden = !this.tabView.tabs[0].isHidden; }
  #btnMoveTab(steps) { this.tabView.activeTab.move(steps); }

  #btnAddNewTab() {
    const before = this.tabView.activeTab.nextVisibleTab;
    this.tabView.addTab(Tab, `Tab ${++this.#id}`, before);
  }

  #btnScrollSectionIntoView(e, scrollToId) {
    e.preventDefault();
    const target = this.shadowRoot.getElementById(scrollToId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth" });
    // const headerHeight = 50;
    // const targetTop = target.getBoundingClientRect().top - headerHeight;
    // window.scrollTo({ top: targetTop, behavior: "smooth" });
  }

  async #btnSpinnerProcess() {
    await Spinner.exec(async sp => {
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

  async #btnToastMe(multiple = false) {
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

  #onFieldChange(e) {
    console.log("Got change event from field: ", e.target.name, e.target.value);
    this.tbLastName.status = this.chkDrinks.value ? "alert" : "default";
  }

  #populateTree(results, root) {
    if (!results) results = [{ key1: "value" }, { key2: { childKey1: true, childKey2: 5 } }, { key3: [{ childKey3: false, childKey4: 85 }] }];
    if (!root) root = this.treeView.root;

    if (this.treeView.initiated) return;
    this.treeView.initiated = true;

    results.forEach((result, index) => createChild(`${index + 1}`, result, root));
    this.treeView.requestUpdate();

    function createChild(key, value, parent) {
      const objectOrArray = isObjectOrArray(value);
      const options = {
        canOpen: objectOrArray ? true : false,
        opened: objectOrArray ? true : false,
        showPath: false,
        data: { key, value, parent },
      };
      const title = key + (objectOrArray ? (isObject(value) ? " {}" : " []") : `: ${value}`);
      const node = parent.addChild(title, options);
      if (isObjectOrArray(value)) Object.entries(value).forEach(([k, v]) => createChild(k, v, node));
    }
  }

  /** "Show Using Tabs" toggle switch */
  async #updateUsingTabs(e) {
    this.showTabbed = asBool(e.target.value);
  }

  async firstUpdated() {
    super.firstUpdated();
    queueMicrotask(() => this.#showcaseSetup());
  }

  /** Setup instructions for firstUpdated and toggling `Show Using Tabs` */
  #showcaseSetup() {
    this.#populateTree();
    if (!this.showTabbed) {
      const returnToToC = html`<div style="padding-top:0.5em;"><a href="" @click="${e => this.#btnScrollSectionIntoView(e, "ToC")}">Return to Menu</a></div>`;

      const sections = [...this.shadowRoot.getElementById("Content").children].filter(child => child instanceof HTMLDivElement);
      this.tocSections = sections.map(section => ({ id: section.id, label: section.id.replace("Content", " Content") }));
      sections.forEach(section => renderInto(returnToToC, section));
    }
    this.requestUpdate();
  }

  renderControl() {
    return html`
<h1>Showcase of Azos Controls</h1>
<p>
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
</p>

<az-check title="Show Using Tabs" @change="${this.#updateUsingTabs}" titleWidth="85" titlePosition="mid-right" value="${this.showTabbed}"></az-check>
${this.showTabbed ? html`
<div class="strip-h">
  <h3>Tab View Controls:</h3>
  <az-button @click=${this.#btnShowHideTab} title="Show/Hide" rank="small"></az-button>
  <az-button @click=${this.#btnToggleTabVisibility} title="In/Visible" rank="small"></az-button>
  <az-button @click=${this.#btnAddNewTab} title="Add more..." rank="small"></az-button>

  <h4>Active Tab Left</h4>
  <az-button @click=${() => this.#btnMoveTab(-1)} title="1x" rank="small"></az-button>
  <az-button @click=${() => this.#btnMoveTab(-2)} title="2x" rank="small"></az-button>
  <h4>Right</h4>
  <az-button @click=${() => this.#btnMoveTab(1)} title="1x" rank="small"></az-button>
  <az-button @click=${() => this.#btnMoveTab(2)} title="2x" rank="small"></az-button>
</div>

<az-tab-view id="tabView" scope="this" .isModern="${false}" @tabClosing="${(tab) => console.log(tab)}" .isDraggable="${true}">
  <az-tab title="Slide Deck (WIP)" .canClose=${false} iconPath="https://www.shareicon.net/download/2015/12/12/204044_angel.ico"> ${this.renderSlideDeckContent()} </az-tab>
  <az-tab title="Scheduler (WIP)" .canClose=${false}> ${this.renderSchedulerContent()} </az-tab>
  <az-tab title="Popup Menu (WIP)" .canClose=${false}> ${this.renderPopupMenuContent()} </az-tab>
  <az-tab title="Accordion (WIP)" .canClose=${false}> ${this.renderAccordionContent()} </az-tab>
  <az-tab title="Sliders (WIP)" .canClose=${false} status="error"> ${this.renderSliderContent()} </az-tab>
  <az-tab title="Tree View" .canClose=${false}> ${this.renderTreeViewContent()} </az-tab>
  <az-tab title="Buttons" .canClose=${false} iconPath="https://www.shareicon.net/download/2015/12/12/204044_angel.ico"> ${this.renderButtonContent()} </az-tab>
  <az-tab title="Input Test" .canClose=${false}> ${this.renderInputContent()} </az-tab>
  <az-tab title="VCL / Codebox" .canClose=${false} status="ok"> ${this.renderCodeboxContent()} </az-tab>
  <az-tab title="Radios" .canClose=${false}> ${this.renderRadiosContent()} </az-tab>
  <az-tab title="Switches" .canClose=${false} status="info"> ${this.renderSwitchContent()} </az-tab>
  <az-tab title="Checkboxes" .canClose=${false} status="info"> ${this.renderCheckboxContent()} </az-tab>
  <az-tab title="Text Fields" .canClose=${false}> ${this.renderTextFieldContent()} </az-tab>
  <az-tab title="Select Field" .canClose=${false} status="warning"> ${this.renderSelectFieldContent()} </az-tab>
  <az-tab title="Modal Dialogs" .canClose=${false}> ${this.renderModalDialogContent()} </az-tab>
  <az-tab title="Toasts" .canClose=${false}> ${this.renderToastContent()} </az-tab>
</az-tab-view>
  ` : html`
<h1 id="ToC">Table of Contents</h1>
<ol>
  ${this.tocSections.map(section => html`<li> <a href="" @click="${e => this.#btnScrollSectionIntoView(e, section.id)}"> ${section.label} </a></li>`)}
</ol>
<div id="Content">
  <div id="SlideDeckContent"> ${this.renderSlideDeckContent()} </div>
  <div id="SchedulerContent"> ${this.renderSchedulerContent()} </div>
  <div id="PopupMenuContent"> ${this.renderPopupMenuContent()} </div>
  <div id="AccordionContent"> ${this.renderAccordionContent()} </div>
  <div id="SliderContent"> ${this.renderSliderContent()} </div>
  <div id="TreeViewContent"> ${this.renderTreeViewContent()} </div>
  <div id="ButtonContent"> ${this.renderButtonContent()} </div>
  <div id="InputContent"> ${this.renderInputContent()} </div>
  <div id="CodeboxContent"> ${this.renderCodeboxContent()} </div>
  <div id="RadiosContent"> ${this.renderRadiosContent()} </div>
  <div id="SwitchContent"> ${this.renderSwitchContent()} </div>
  <div id="CheckboxContent"> ${this.renderCheckboxContent()} </div>
  <div id="TextFieldContent"> ${this.renderTextFieldContent()} </div>
  <div id="SelectFieldContent"> ${this.renderSelectFieldContent()} </div>
  <div id="ModalDialogContent"> ${this.renderModalDialogContent()} </div>
  <div id="ToastContent"> ${this.renderToastContent()} </div>
</div>
  `}

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
    <az-button @click="${this.#btnDlg1Close}" title="Close" style="float: right;"></az-button>
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
    <az-button @click="${this.#btnDlg2Close}" title="Close" style="float: right;"></az-button>
  </div>
</az-modal-dialog>
`;
  }

  renderSlideDeckContent() {
    return html`
<h2>Slide Deck</h2>
<az-slide-deck timeout="${60_000}">
  <az-slide>Here's a slide</az-slide>
  <az-slide>Here's a another slide</az-slide>
</az-slide-deck>
    `;
  }

  renderSchedulerContent() {
    return html`
<h2>Scheduler</h2>
<az-weekly-scheduler></az-weekly-scheduler>
    `;
  }

  renderPopupMenuContent() {
    return html`
<h2>Popup Menu</h2>
<az-button id="btnPopupMenu" scope="this" @click="${this.#btnPopupMenuClick}" title="Show the Popup Menu" status="ok"></az-button>
    `;
  }

  renderAccordionContent() {
    return html`
<h2>Accordion</h2>
<az-accordion name="accordion" width="75%" align="center" activeItemIndex="0">
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
</az-accordion>`
  }

  renderTreeViewContent() {
    return html`
<h2>Tree View</h2>
<az-tree-view id="treeView" scope="this"></az-tree-view>
    `;
  }

  renderButtonContent() {
    return html`
<h2>Buttons</h2>

<div class="strip-h">
  <div><button @click="${this.#btnIsHidden}"> btnSave.isHidden </button></div>
  <div><button @click="${this.#btnIsAbsent}"> btnSave.isAbsent </button></div>

  <az-button id="btnSave"    scope="this" title="Save" status="ok"> </az-button>
  <az-button id="btnCancel"  scope="this" title="Cancel" status="warning"> </az-button>
  <az-button id="btnDetails" scope="this" title="Details..."> </az-button>
</div>

<az-button @click="${this.#btnSpinnerProcess}" title="Run Spinner Process..." status="info"></az-button>

<h4>Regular buttons of default status</h4>
<az-button title="Button 1"></az-button>
<az-button title="OK"></az-button>
<az-button title="Cancel"></az-button>
<az-button title="Details..."></az-button>

<h4>Buttons with specific statuses</h4>
<az-button title="Regular"></az-button>
<az-button title="Success" status="ok"></az-button>
<az-button title="Information" status="info"></az-button>
<az-button title="Warning" status="warning"></az-button>
<az-button title="Alert" status="alert"></az-button>
<az-button title="Error" status="error"></az-button>

<h4>Buttons with specific ranks</h4>
<az-button title="Tiny" rank="tiny"></az-button>
<az-button title="Small" rank="small"></az-button>
<az-button title="Medium" rank="medium"></az-button>
<az-button title="Normal" rank="normal"></az-button>
<az-button title="Large" rank="large"></az-button>
<az-button title="Huge" rank="huge"></az-button>


<h4>Disabled buttons</h4>
<az-button title="Regular" isdisabled></az-button>
<az-button title="Success" status="ok" isdisabled></az-button>
<az-button title="Information" status="info" isdisabled></az-button>
<az-button title="Warning" status="warning" isdisabled></az-button>
<az-button title="Alert" status="alert" isdisabled></az-button>
<az-button title="Error" status="error" isdisabled></az-button>
    `;
  }

  renderInputContent() {
    return html`
<h2>Testing @change with az-text and az-check</h2>

<az-text id="tbNasa" scope="window" name="Nasa" title="Nasa Experimentation" placeholder="Hatch diameter inches" @change="${this.#onFieldChange}" datatype="int" value="10"></az-text>

<az-text id="tbFirstName" scope="this" name="FN" title="First Name" placeholder="Patient First Name" @change="${this.#onFieldChange}" value="SHITTERESSS"></az-text>
<az-text id="tbLastName" scope="this" name="LN" title="Last Name" placeholder="Patient Last Name" @change="${this.#onFieldChange}"></az-text>

<az-text id="getADate" scope="this" name="getADate" title="Get a Date" placeholder="2024/01/01" itemtype="date"></az-text>

<az-check id="chkSmokes" scope="this" name="Smokes" title="He smokes" @change="${this.#onFieldChange}"></az-check>
<az-check id="chkDrinks" scope="this" name="Drinks" title="He drinks hard liquor" @change="${this.#onFieldChange}"></az-check>
    `;
  }

  renderCodeboxContent() {
    return html`
<h2> VCL / Codebox</h2>
<az-code-box highlight="js" source="">//this is my json object
{
  "a": 1, "b": 2, "c": true,
  d: ["string1", null, true, false, {"name": "string2", "salary": 100.67}],
  "c": "string message",
  "d": [{"a": -123.032, "b": +45}, false, null, null, "ok"]
}
</az-code-box>
    `;
  }

  renderRadiosContent() {
    return html`
<h2>Radios</h2>
<p>A long-used form of placeholder text in design mockups and more, the standard use of dummy text has come under fire in recent years as web design grows (and the internet makes the spread of opinions much more efficient).</p>
<az-radio-group id="baseGroup" value="choiceOption" title="Group of radios (choose only 1)">
  <item title="Option 1" value="v1"></item>
  <item title="Option 2" value="v2"></item>
  <item title="Another"  value="v3"></item>
  <item title="Snake Number Four"  value="v4"></item>
</az-radio-group>
    `;
  }

  renderSwitchContent() {
    return html`
<h2>Switches</h2>

<h3>Statuses</h3>
<div class="strip-h" style="gap:2em;">
  <az-check itemType="switch" title="Default" titlePosition="mid-right" status="default"></az-check>
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

  renderCheckboxContent() {
    return html`
<h2>Checkboxes</h2>

<h3>Statuses</h3>
<div class="strip-h" style="gap:2em;">
  <az-check title="Default" titlePosition="mid-right" status="default"></az-check>
  <az-check title="Ok" titlePosition="mid-right" status="ok"></az-check>
  <az-check title="Info" titlePosition="mid-right" status="info"></az-check>
  <az-check title="Warning" titlePosition="mid-right" status="warning"></az-check>
  <az-check title="Alert" titlePosition="mid-right" status="alert"></az-check>
  <az-check title="Error" titlePosition="mid-right" status="error"></az-check>
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

  renderTextFieldContent() {
    return html`
<h2>Text Fields</h2>
<div class="strip-h">
  <az-text id="basicTextInput" title="Basic text input" placeholder="Type something here&hellip;" titlePosition="mid-left" titleWidth="25" contentWidth="75"></az-text>
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
    `;
  }

  renderSelectFieldContent() {
    return html`
<h2>Selects/Combos</h2>
<az-select id="defaultSelect" title="Select one of the following from the dropdown">
  <option value="" title="Select an option&hellip;"></option>
  <option value="valueOne" title="Selected first value"></option>
  <option value="secondValue" title="Select second option"></option>
  <option value="thirdOption" title="This is an option"></option>
  <option value="opt4" title="Option #4"></option>
  <option value="fifthValue" title="OPTION FIVE"></option>
  <option value="value6" title="Yet another option"></option>
  <option value="numberSeven" title="Are you losing count yet?"></option>
  <option value="eighthOption" title="Maybe chose this one"></option>
  <option value="optionNine" title="Almost done"></option>
  <option value="finalValue" title="Last test option"></option>
</az-select>
    `;
  }

  renderSliderContent() {
    return html`
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
<az-slider id="basicSlider" title="Basic Slider" rangeMin="0" rangeMax="10" rangeStep="1" numTicks="5" status="alert" displayValue valueLabel="Number of tomatoes: "></az-slider>
    `;
  }

  renderModalDialogContent() {
    return html`
<h2>Modal Dialogs</h2>
<az-button @click="${this.#btnDlg1Open}" title="Open..."></az-button>
<az-button @click="${this.#btnDlg2Open}" title="Open Code..." status="info"></az-button>

<az-button @click="${this.#btnModalSpinnerOpen}" title="Open Modal Spinner..." status="alert"></az-button>
<az-button @click="${this.#btnSpinnerProcess}" title="Run Spinner Process..." status="info"></az-button>

<az-button @click="${this.#btnNonModalSpinnerOpen}" title="Open NM Spinner..." status="info"></az-button>
<az-button @click="${this.#btnNonModalSpinnerClose}" title="Close NM Spinner..." status="info"></az-button>

<az-button @click="${this.#btnAutoSpinnerOpen}" title="Auto Spinner..." status="info"></az-button>
    `;
  }

  renderToastContent() {
    return html`
<h2>Toasts</h2>
<az-button @click="${() => this.#btnToastMe(false)}" title="Toast Me..."></az-button>
<az-button @click="${() => this.#btnToastMe(true)}" title="Toast Me Many..."></az-button>
    `;
  }
}

window.customElements.define("az-test-showcase", Showcase);
