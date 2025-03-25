/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Applet } from "../../applet";
import { css, html, noContent } from "../../ui";

import "../showcase/case-accordion";
import "../showcase/case-buttons";
import "../showcase/case-checkboxes";
import "../showcase/case-code-box";
import "../showcase/case-date-range";
import "../showcase/case-input-tests";
import "../showcase/case-lookup";
import "../showcase/case-modals";
import "../showcase/case-object-inspector";
import "../showcase/case-radios";
import "../showcase/case-scheduler";
import "../showcase/case-selects";
import "../showcase/case-slide-deck";
import "../showcase/case-switches";
import "../showcase/case-tab-view";
import "../showcase/case-toasts";
import "../showcase/case-tree-view";

export class ShowcaseApplet extends Applet{

  constructor() {
    super();
    this.selectedCase = "TabView";
  }

  static properties = {
    selectedCase: { type: String, reflect: true }
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

#caseSelect option{
  padding: 0.3em 0.35em;
}
  `];

  get title(){ return "Azos Showcase"; }

  #onCaseChanged(e) {
    this.selectedCase = e.target.value;
    console.warn("Case changed to", this.selectedCase);
  }

  render(){
  return html`
    <select id="caseSelect" @change="${this.#onCaseChanged}" .value="${this.selectedCase ?? ""}">
      <option value="">Select a showcase item...</option>
      <option value="Accordion">Accordion</option>
      <option value="Buttons">Buttons</option>
      <option value="Checkboxes">Checkboxes</option>
      <option value="CodeBox">Code Box</option>
      <option value="DateRange">Date Range</option>
      <option value="InputTests">Input Tests</option>
      <option value="Lookup">Lookup</option>
      <option value="Modals">Modals</option>
      <option value="ObjectInspector">Object Inspector</option>
      <option value="RadioButtons">Radio Buttons</option>
      <option value="Scheduler">Scheduler</option>
      <option value="Selects">Selects</option>
      <option value="SlideDeck">Slide Deck</option>
      <option value="Switches">Switches</option>
      <option value="TabView">Tab View</option>
      <option value="Toasts">Toasts</option>
      <option value="TreeView">Tree View</option>
    </select>

   ${this.renderCase()}
  `;
  }
  renderCase() {
    const showcase = this.selectedCase;
    switch(showcase) {
        case "Accordion":
          return html`<az-case-accordion></az-case-accordion>`;
        case "Buttons":
          return html`<az-case-buttons></az-case-buttons>`;
        case "Checkboxes":
          return html`<az-case-checkboxes></az-case-checkboxes>`;
        case "CodeBox":
          return html`<az-case-code-box></az-case-code-box>`;
      case "DateRange":
        return html`<az-case-date-range></az-case-date-range>`;
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
        case "SlideDeck":
          return html`<az-case-slide-deck></az-case-slide-deck>`;
        case "Switches":
          return html`<az-case-switches></az-case-switches>`;
      case "TabView":
        return html`<az-case-tab-view></az-case-tab-view>`;
        case "Toasts":
          return html`<az-case-toasts></az-case-toasts>`;
        case "TreeView":
          return html`<az-case-tree-view></az-case-tree-view>`;
        default:
          return noContent;
      }
  }
}

window.customElements.define("showcase-applet", ShowcaseApplet);
