/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

//#region IMPORTS
import { Applet } from "../../applet";
import { Command } from "../../cmd";
import { css, html, noContent } from "../../ui";
import { prompt } from "../../ok-cancel-modal";

import "../../parts/button";
import "./xyz-dialog";
import "../showcase/case-accordion";
import "../showcase/case-buttons";
import "../showcase/case-buttons-with-icons";
import "../showcase/case-checkboxes";
import "../showcase/case-code-box";
import "../showcase/case-date-range";
import "../showcase/case-images";
import "../showcase/case-input-tests";
import "../showcase/case-lookup";
import "../showcase/case-modals";
import "../showcase/case-object-inspector";
import "../showcase/case-radios";
import "../showcase/case-scheduler";
import "../showcase/case-selects";
import "../showcase/case-slide-deck";
import "../showcase/case-switches";
import "../showcase/case-text-fields";
import "../showcase/case-sizing";
import "../showcase/case-tab-view";
import "../showcase/case-toasts";
import "../showcase/case-tree-view";
import "../showcase/case-launcher"
//#endregion IMPORTS

export class ShowcaseApplet extends Applet {

  constructor() {
    super();
    this.selectedCase = "Launcher";
    this.x = 1;
  }

  static properties = {
    selectedCase: { type: String, reflect: true },
    x: { type: Number, reflect: true },
  }

  static styles = [css`
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

  render() {
    return html`
    <az-button title="Toggle Toolbar Button" @click="${this.#toggleToolbarButton}"></az-button>
    <az-button title="Increase X to ${this.x + 1}" @click="${() => { ++this.x }}"></az-button>
    <az-button title="Complex Dialog" @click="${() => this.xyzDialog.show()}"></az-button>
    <select id="caseSelect" @change="${this.#onCaseChanged}" .value="${this.selectedCase ?? ""}">
      <option value="">Select a showcase item...</option>
      <option value="Accordion">Accordion</option>
      <option value="Buttons">Buttons</option>
      <option value="ButtonsWithIcons">Buttons With Icons</option>
      <option value="Checkboxes">Checkboxes</option>
      <option value="CodeBox">Code Box</option>
      <option value="DateRange">Date Range</option>
      <option value="Images">Images</option>
      <option value="InputTests">Input Tests</option>
      <option value="Lookup">Lookup</option>
      <option value="Modals">Modals</option>
      <option value="ObjectInspector">Object Inspector</option>
      <option value="RadioButtons">Radio Buttons</option>
      <option value="Scheduler">Scheduler</option>
      <option value="Selects">Selects</option>
      <option value="Sizing">Sizing</option>
      <option value="SlideDeck">Slide Deck</option>
      <option value="Switches">Switches</option>
      <option value="TabView">Tab View</option>
      <option value="TextFields">Text Fields</option>
      <option value="Toasts">Toasts</option>
      <option value="TreeView">Tree View</option>
      <option value="Launcher">Launcher</option>
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
    switch (showcase) {
      case "Accordion":
        return html`<az-case-accordion></az-case-accordion>`;
      case "Buttons":
        return html`<az-case-buttons></az-case-buttons>`;
      case "ButtonsWithIcons":
        return html`<az-case-buttons-with-icons></az-case-buttons-with-icons>`;
      case "Checkboxes":
        return html`<az-case-checkboxes></az-case-checkboxes>`;
      case "CodeBox":
        return html`<az-case-code-box></az-case-code-box>`;
      case "DateRange":
        return html`<az-case-date-range></az-case-date-range>`;
      case "Images":
        return html`<az-case-images></az-case-images>`;
      case "InputTests":
        return html`<az-case-input-tests></az-case-input-tests>`;
      case "Lookup":
        return html`<az-case-lookup></az-case-lookup>`;
      case "Modals":
        return html`<az-case-modals></az-case-modals>`;
      case "ObjectInspector":
        return html`<az-case-object-inspector></az-case-object-inspector>`;
      case "RadioButtons":
        return html`<az-case-radios></az-case-radios>`;
      case "Scheduler":
        return html`<az-case-scheduler></az-case-scheduler>`;
      case "Selects":
        return html`<az-case-selects></az-case-selects>`;
      case "Sizing":
        return html`<az-case-sizing></az-case-sizing>`;
      case "SlideDeck":
        return html`<az-case-slide-deck></az-case-slide-deck>`;
      case "Switches":
        return html`<az-case-switches></az-case-switches>`;
      case "TabView":
        return html`<az-case-tab-view></az-case-tab-view>`;
      case "TextFields":
        return html`<az-case-text-fields></az-case-text-fields>`;
      case "Toasts":
        return html`<az-case-toasts></az-case-toasts>`;
      case "TreeView":
        return html`<az-case-tree-view></az-case-tree-view>`;
      case "Launcher":
          return html`<az-case-launcher></az-case-launcher>`;
      default:
        return noContent;
    }
  }
}

window.customElements.define("showcase-applet", ShowcaseApplet);
