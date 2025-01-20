/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Control, css, html, noContent, renderInto } from "../ui";
import { Command } from "../cmd";
import { asInt, isIntValue } from "azos/types";

import "../vcl/tabs/tab-view";
import "../vcl/slides/slide-deck";

import "../vcl/tabs/tab-view";
import "./showcase/case-buttons";
import "./showcase/case-text-fields";
import "./showcase/case-radios";
import "./showcase/case-switches";
import "./showcase/case-checkboxes";
import "./showcase/case-selects";
import "./showcase/case-input-tests";
import "./showcase/case-code-box";
import "./showcase/case-modals";
import "./showcase/case-accordion";
import "./showcase/case-sliders";
import "./showcase/case-toasts";
import "./showcase/case-slide-deck";
import "./showcase/case-tree-view";
import "./showcase/case-scheduler";
import "./showcase/case-lookup";

const DISPLAY_MODES = Object.freeze({
  LONG_FORM: 0,
  TABBED: 1,
  SLIDES: 2,
  ACCORDION: 3,
});

const ALL_DISPLAY_MODES = ["long_form", "tabbed", "slides", "accordion"];

/** Test element used as a showcase of various parts and form elements in action */
export class Showcase2 extends Control {
  static styles = css`
:host{ display:block; }
.strip-h{ display:flex;flex-wrap:wrap;align-items:center;margin-bottom:0.5em;gap:1ch; }
#toc, #content > div{ scroll-margin-top: 50px; }
`;

  static properties = {
    tocSections: { type: Array },
    displayMode: { type: DISPLAY_MODES },
  }

  constructor() {
    super();
    this.tocSections = [];
    this.displayMode = DISPLAY_MODES.LONG_FORM;
  }

  #btnScrollSectionIntoView(e, scrollToId) {
    e.preventDefault();
    const target = this.shadowRoot.getElementById(scrollToId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth" });
  }
  #btnPreviousSlide(force) { this.slideDeck.previousSlide(force); }
  #btnNextSlide(force) { this.slideDeck.nextSlide(force); }
  #btnStartAutoTransition() {
    this.slideDeck.startAutoTransition(asInt(this.slideDeckTransitionInterval.value));
    this.requestUpdate();
  }

  #btnStopAutoTransmission() {
    this.slideDeck.stopAutoTransition();
    this.requestUpdate();
  }

  async #updateDisplayMethod(e) {
    const params = new URLSearchParams(window.location.search);
    params.set("displayMode", asInt(e.target.value));
    window.location.search = params.toString();
  }

  connectedCallback() {
    super.connectedCallback();
    const params = new URLSearchParams(window.location.search);
    const displayModeParam = params.get("displayMode");
    if (displayModeParam) {
      if (!isIntValue(displayModeParam)) this.displayMode = ALL_DISPLAY_MODES.indexOf(displayModeParam);
      else this.displayMode = asInt(displayModeParam);
    }
  }

  firstUpdated() {
    if (this.displayMode === DISPLAY_MODES.LONG_FORM) {
      const returnToToC = html`<div style="padding-top:0.5em;"><a href="" @click="${e => this.#btnScrollSectionIntoView(e, "toc")}">Return to Menu</a></div>`;
      const sections = [...this.shadowRoot.getElementById("content").children].filter(child => child instanceof HTMLDivElement);
      this.tocSections = sections.map(section => ({ id: section.id, label: section.id.replace("Content", "").replace(/([A-Z])/g, " $1") }));
      sections.forEach(section => renderInto(returnToToC, section));
    }
    if (this.displayMode === DISPLAY_MODES.TABBED) {
      this.$("schTestTab").showCommands = true;
      const cmdRefresh = new Command(this.schTestTab, {
        uri: "refresh",
        title: "Refresh",
        handler: () => {
          console.log("Refreshing, isn't it?");
          this.$("testCaseScheduler").refresh();
        }
      });
      this.$("schTestTab").commands = [cmdRefresh];
    }
    this.requestUpdate();
  }

  render() {
    return html`
${ this.renderDisplayControls() }
${ this.displayMode === DISPLAY_MODES.LONG_FORM ? this.renderLongForm() : noContent}
${ this.displayMode === DISPLAY_MODES.TABBED ? this.renderTabbed() : noContent}
${ this.displayMode === DISPLAY_MODES.SLIDES ? this.renderSlides() : noContent}
${ this.displayMode === DISPLAY_MODES.ACCORDION ? this.renderAccordion() : noContent}
    `;
  }

  renderDisplayControls() {
    return html`
<div class="strip-h">
  <az-radio-group title="Display Method" @change="${this.#updateDisplayMethod}" value="${this.displayMode}" titlePosition="mid-left" style="width:300px">
    <item title="Long Form" value="0"></item>
    <item title="Tabbed" value="1"></item>
    <item title="Slide Deck" value="2"></item>
    <item title="Accordion" value="3"></item>
  </az-radio-group>
</div>
    `;
  }

  renderLongForm() {
    return html`
<h1 id="toc">Table of Contents</h1>
<ol>${this.tocSections.map(section => html`<li> <a href="" @click="${e => this.#btnScrollSectionIntoView(e, section.id)}"> ${section.label} </a></li>`)}</ol>
<div id="content">
  <div id="LookupContent"> <az-case-lookup></az-case-lookup> </div>
  <div id="ButtonsContent"> <az-case-buttons></az-case-buttons> </div>
  <div id="TextFieldsContent"> <az-case-text-fields schema="ShowCase.Long.TextFields"></az-case-text-fields> </div>
  <div id="InputTestsContent"> <az-case-input-tests></az-case-input-tests> </div>
  <div id="CheckboxesContent"> <az-case-checkboxes></az-case-checkboxes> </div>
  <div id="SwitchesContent"> <az-case-switches></az-case-switches> </div>
  <div id="RadiosContent"> <az-case-radios></az-case-radios> </div>
  <div id="SelectsContent"> <az-case-selects></az-case-selects> </div>
  <div id="CodeBoxContent"> <az-case-code-box></az-case-code-box> </div>
  <div id="ModalsContent"> <az-case-modals></az-case-modals> </div>
  <div id="ToastsContent"> <az-case-toasts></az-case-toasts> </div>
  <div id="SlideDeckContent"> <az-case-slide-deck></az-case-slide-deck> </div>
  <div id="TreeViewContent"> <az-case-tree-view></az-case-tree-view> </div>
  <div id="SchedulerContent"> <az-case-scheduler></az-case-scheduler> </div>
  <div id="SlidersContent"> <az-case-sliders></az-case-sliders> </div>
  <div id="AccordionContent"> <az-case-accordion></az-case-accordion> </div>
</div>
    `
  }

  renderTabbed() {
    return html`
<az-tab-view activeTabIndex=12>
  <az-tab title="Buttons"> <az-case-buttons></az-case-buttons> </az-tab>
  <az-tab title="Text Fields"> <az-case-text-fields></az-case-text-fields> </az-tab>
  <az-tab title="Input Tests"> <az-case-input-tests></az-case-input-tests> </az-tab>
  <az-tab title="Checkboxes"> <az-case-checkboxes></az-case-checkboxes> </az-tab>
  <az-tab title="Switches"> <az-case-switches></az-case-switches> </az-tab>
  <az-tab title="Radios"> <az-case-radios></az-case-radios> </az-tab>
  <az-tab title="Selects"> <az-case-selects></az-case-selects> </az-tab>
  <az-tab title="CodeBox"> <az-case-code-box></az-case-code-box> </az-tab>
  <az-tab title="Modals"> <az-case-modals></az-case-modals> </az-tab>
  <az-tab title="Toasts"> <az-case-toasts></az-case-toasts> </az-tab>
  <az-tab title="Slide Deck"> <az-case-slide-deck></az-case-slide-deck> </az-tab>
  <az-tab title="Tree View" id="tvTestTab" scope="this"> <az-case-tree-view id="testCaseTreeView" scope="this"></az-case-tree-view> </az-tab>
  <az-tab title="Scheduler (WIP)" id="schTestTab" scope="this"> <az-case-scheduler id="testCaseScheduler" scope="this"></az-case-scheduler> </az-tab>
  <az-tab title="Sliders (WIP)"> <az-case-sliders></az-case-sliders> </az-tab>
  <az-tab title="Accordion (WIP)"> <az-case-accordion></az-case-accordion> </az-tab>
</az-tab-view>
        `
  }

  renderSlides() {
    return html`
<div class="strip-h" style="align-items:flex-end;">
  <az-check id="loop" scope="this" itemType="switch" title="Loop" @change="${() => this.requestUpdate()}" value="${true}"></az-check>
  <az-text id="slideDeckTransitionInterval" scope="this" title="Slide Deck Transition Interval (ms)" placeholder="1000" value="${1000}" @change="${() => this.#btnStartAutoTransition()}"></az-text>
  <az-button title="Start AutoTransition" @click="${() => this.#btnStartAutoTransition()}"></az-button>
  <az-button title="Stop AutoTransition" .isDisabled="${!this.slideDeck?.autoTransitionInterval}" @click="${() => this.#btnStopAutoTransmission()}"></az-button>
</div>

<div class="strip-h" style="justify-content:flex-start;align-items:flex-start;">

  <div class="strip-h" style="flex-direction:column">
    <az-button title="Previous" @click="${() => this.slideDeck.activeSlideIndex -= 1}"></az-button>
  </div>

  <div class="strip-h" style="flex:1;height:100%">
    <az-slide-deck id="slideDeck" scope="this" autoTransitionInterval="0" ?loop=${this.loop?.value} activeSlideIndex=12 style="width:100%;text-align:center;border:1px solid">
      <az-slide id="ButtonsContent"> <az-case-buttons></az-case-buttons> </az-slide>
      <az-slide id="TextFieldsContent"> <az-case-text-fields></az-case-text-fields> </az-slide>
      <az-slide id="InputTestsContent"> <az-case-input-tests></az-case-input-tests> </az-slide>
      <az-slide id="CheckboxesContent"> <az-case-checkboxes></az-case-checkboxes> </az-slide>
      <az-slide id="SwitchesContent"> <az-case-switches></az-case-switches> </az-slide>
      <az-slide id="RadiosContent"> <az-case-radios></az-case-radios> </az-slide>
      <az-slide id="SelectsContent"> <az-case-selects></az-case-selects> </az-slide>
      <az-slide id="CodeBoxContent"> <az-case-code-box></az-case-code-box> </az-slide>
      <az-slide id="ModalsContent"> <az-case-modals></az-case-modals> </az-slide>
      <az-slide id="ToastsContent"> <az-case-toasts></az-case-toasts> </az-slide>
      <az-slide id="SlideDeckContent"> <az-case-slide-deck></az-case-slide-deck> </az-slide>
      <az-slide id="TreeViewContent"> <az-case-tree-view></az-case-tree-view> </az-slide>
      <az-slide id="SchedulerContent"> <az-case-scheduler></az-case-scheduler> </az-slide>
      <az-slide id="SlidersContent"> <az-case-sliders></az-case-sliders> </az-slide>
      <az-slide id="AccordionContent"> <az-case-accordion></az-case-accordion> </az-slide>
    </az-slide-deck>
  </div>

  <div class="strip-h" style="flex-direction:column">
    <az-button title="Next" @click="${() => this.slideDeck.activeSlideIndex += 1}"></az-button>
  </div>
</div>
    `
  }

  renderAccordion() {
    return html`
WIP
        `
  }
}

window.customElements.define("az-showcase2", Showcase2);
