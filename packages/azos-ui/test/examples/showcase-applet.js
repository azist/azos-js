/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

//#region IMPORTS
import { Applet } from "../../applet.js";
import { Command } from "../../cmd.js";
import { css, html, noContent } from "../../ui.js";
import { prompt } from "../../ok-cancel-modal.js";

import "../../parts/button.js";
import "./xyz-dialog.js";
import "../showcase/case-accordion.js";
import "../showcase/case-buttons.js";
import "../showcase/case-buttons-with-icons.js";
import "../showcase/case-bit.js";
import "../showcase/case-bit-lists.js";
import "../showcase/case-checkboxes.js";
import "../showcase/case-code-box.js";
import "../showcase/case-error-box.js";
import "../showcase/case-date-range.js";
import "../showcase/case-images.js";
import "../showcase/case-input-tests.js";
import "../showcase/case-lookup.js";
import "../showcase/case-modals.js";
import "../showcase/case-object-inspector.js";
import "../showcase/case-radios.js";
import "../showcase/case-scheduler.js";
import "../showcase/case-selects.js";
import "../showcase/case-slide-deck.js";
import "../showcase/case-switches.js";
import "../showcase/case-text-fields.js";
import "../showcase/case-sizing.js";
import "../showcase/case-tab-view.js";
import "../showcase/case-toasts.js";
import "../showcase/case-tree-view.js";
import "../showcase/case-tree-view-n.js";
import "../showcase/case-launcher.js";
import "../showcase/case-cards.js";
import "../showcase/case-grids.js";
import "../showcase/case-sticky-container.js";
import "../showcase/case-prose.js";
import "../showcase/case-grid-split.js";
import "../showcase/case-schema-bit.js";
import "../showcase/case-model-adlib.js"
import "../showcase/case-model-nls.js"
import "../showcase/case-model-schedule.js";
import "../showcase/case-bit-cells.js";
import "../showcase/case-model-schedule-span.js";
import { DIRTY_PROP } from "azos/types";
//#endregion IMPORTS

export class ShowcaseApplet extends Applet {

  constructor() {
    super();
    this.selectedCase = "BitCells";
    this.x = 1;
  }

  static properties = {
    selectedCase: { type: String, reflect: true },
    x: { type: Number, reflect: true },
  }

  static styles = [css`

:host { display: block; padding: 0.75em; }

#caseSelect{
  width: calc(100% - 2em);
  margin: 1em;
  padding: 0.3em 0.35em;
  font-size: var(--r3-fs);
  border: var(--s-default-bor-ctl);
  border-radius: var(--r3-brad-ctl);
  background-color: var(--s-default-bg-ctl);
  box-shadow: var(--ctl-box-shadow);
  color: var(--s-default-fg-ctl);
  box-sizing: border-box;
  line-height: 1.3em;
  transition: border-color 0.3s, box-shadow 0.3s;
}

#caseSelect option{ padding: 0.3em 0.35em; }
  `];

  #cmdHelp = new Command(this, {
    uri: "Showcase.PromptFor.CmdHelp",
    icon: "svg://azos.ico.questionMark",
    title: "Help",
    handler: async () => console.log((await prompt("Do you need help?", { title: "Help!", ok: "Yes", cancel: "No", okBtnStatus: "ok" })).modalResult?.response)
  });

  #x = 0;
  get x() { return this.#x; }
  set x(v) {
    const oldValue = this.#x;
    this.#x = v;
    queueMicrotask(() => this.arena?.requestUpdate("x", oldValue));
  }
  get title() { return `Azos Showcase / x = ${this.x}`; }

  #onCaseChanged(e) { this.selectedCase = e.target.value; }
  #toggleToolbarButton() { this.arena.installToolbarCommands([this.#cmdHelp]); }

  connectedCallback() {
    super.connectedCallback();
    this.#toggleToolbarButton();
  }

  get [DIRTY_PROP](){ return false; }

  render() {
    return html`
    <az-button title="Toggle Toolbar Button" @click="${this.#toggleToolbarButton}"></az-button>
    <az-button title="Increase X to ${this.x + 1}" @click="${() => { ++this.x }}"></az-button>
    <az-button title="Complex Dialog" @click="${() => this.xyzDialog.show()}"></az-button>
    <select id="caseSelect" @change="${this.#onCaseChanged}" .value="${this.selectedCase ?? ""}">
      <option value="">Select a showcase item...</option>
      <option value="Accordion">Accordion</option>
      <option value="AdlibTag">Adlib Tag Model</option>
      <option value="Buttons">Buttons</option>
      <option value="ButtonsWithIcons">Buttons With Icons</option>
      <option value="Bits">Bits</option>
      <option value="BitLists">Bit Lists</option>
      <option value="SchemaBit">Schema Bit</option>
      <option value="BitCells">Bit Cells</option>
      <option value="Checkboxes">Checkboxes</option>
      <option value="CodeBox">Code Box</option>
      <option value="ErrorBox">Error Box</option>
      <option value="DateRange">Date Range</option>
      <option value="Images">Images</option>
      <option value="InputTests">Input Tests</option>
      <option value="Lookup">Lookup</option>
      <option value="Modals">Modals</option>
      <option value="NlsMap">Nls Map Model</option>
      <option value="ObjectInspector">Object Inspector</option>
      <option value="RadioButtons">Radio Buttons</option>
      <option value="Schedule">Schedule Model</option>
      <option value="ScheduleSpan">Schedule Span Model</option>
      <option value="Scheduler">Scheduler</option>
      <option value="Selects">Selects</option>
      <option value="Sizing">Sizing</option>
      <option value="SlideDeck">Slide Deck</option>
      <option value="StickyContainer">Sticky Container</option>
      <option value="Switches">Switches</option>
      <option value="TabView">Tab View</option>
      <option value="TextFields">Text Fields</option>
      <option value="Toasts">Toasts</option>
      <option value="TreeView">Tree View</option>
      <option value="TreeViewN">Tree ViewN - wip</option>
      <option value="Launcher">Launcher</option>
      <option value="Cards">Cards</option>
      <option value="Grids">Grids</option>
      <option value="GridSplit">Grid Split</option>
      <option value="Prose">Prose</option>
    </select>

   ${this.renderCase()}
   <xyz-dialog id="xyzDialog" scope="this" toad="Baby Toad">
    <p>I say, if you didn't wash your hands, you're going to bed early!</p>
    <p>Hit 'x' or press Escape key to close (confirm "ok")</p>
   </xyz-dialog>
  `;
  }
  renderCase() {
    const showcase = this.selectedCase;
    const showcaseMap = {
      Accordion: html`<az-case-accordion></az-case-accordion>`,
      AdlibTag: html`<az-case-model-adlib></az-case-model-adlib>`,
      Buttons: html`<az-case-buttons></az-case-buttons>`,
      ButtonsWithIcons: html`<az-case-buttons-with-icons></az-case-buttons-with-icons>`,
      Bits: html`<az-case-bit></az-case-bit>`,
      BitLists: html`<az-case-bit-lists></az-case-bit-lists>`,
      SchemaBit: html`<az-case-schema-bit></az-case-schema-bit>`,
      BitCells: html`<az-case-bit-cells></az-case-bit-cells>`,
      Checkboxes: html`<az-case-checkboxes></az-case-checkboxes>`,
      CodeBox: html`<az-case-code-box></az-case-code-box>`,
      ErrorBox: html`<az-case-error-box></az-case-error-box>`,
      DateRange: html`<az-case-date-range></az-case-date-range>`,
      Images: html`<az-case-images></az-case-images>`,
      InputTests: html`<az-case-input-tests></az-case-input-tests>`,
      Lookup: html`<az-case-lookup></az-case-lookup>`,
      NlsMap: html`<az-case-model-nls-map></az-case-model-nls-map>`,
      Modals: html`<az-case-modals></az-case-modals>`,
      ObjectInspector: html`<az-case-object-inspector></az-case-object-inspector>`,
      RadioButtons: html`<az-case-radios></az-case-radios>`,
      Schedule: html`<az-case-model-schedule></az-case-model-schedule>`,
      Scheduler: html`<az-case-scheduler></az-case-scheduler>`,
      Selects: html`<az-case-selects></az-case-selects>`,
      Sizing: html`<az-case-sizing></az-case-sizing>`,
      SlideDeck: html`<az-case-slide-deck></az-case-slide-deck>`,
      ScheduleSpan: html`<az-case-model-schedule-span></az-case-model-schedule-span>`,
      StickyContainer: html`<az-case-sticky-container></az-case-sticky-container>`,
      Switches: html`<az-case-switches></az-case-switches>`,
      TabView: html`<az-case-tab-view></az-case-tab-view>`,
      TextFields: html`<az-case-text-fields></az-case-text-fields>`,
      Toasts: html`<az-case-toasts></az-case-toasts>`,
      TreeView: html`<az-case-tree-view></az-case-tree-view>`,
      TreeViewN: html`<az-case-tree-view-n></az-case-tree-view-n>`,
      Launcher: html`<az-case-launcher></az-case-launcher>`,
      Cards: html`<az-case-cards></az-case-cards>`,
      Grids: html`<az-case-grids></az-case-grids>`,
      GridSplit: html`<az-case-grid-split></az-case-grid-split>`,
      Prose: html`<az-case-prose></az-case-prose>`,
    };

    return showcaseMap[showcase] || noContent;

  }
}

window.customElements.define("showcase-applet", ShowcaseApplet);
