/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { asInt } from "azos/types";
import { html } from "../../ui";
import { CaseBase } from "./case-base";
import { toast } from "../../toast";

import "../../vcl/slides/slide-deck";

export class CaseSlideDeck extends CaseBase {
  btnShowcasePreviousSlide(force) { this.showcaseSlideDeck.previousSlide(force); }
  btnShowcaseNextSlide(force) { this.showcaseSlideDeck.nextSlide(force); }
  btnShowcaseStartAutoTransition() {
    this.showcaseSlideDeck.startAutoTransition(asInt(this.showcaseSlideDeckTransitionInterval.value));
    this.requestUpdate();
  }

  btnShowcaseStopAutoTransmission() {
    this.showcaseSlideDeck.stopAutoTransition();
    this.requestUpdate();
  }

  async slideChanging(e) {
    if (this.lockSlideSwitch.value) {
      e.preventDefault();
      toast("Change canceled");
    }
  }

  renderControl() {
    return html`
<h2>Slide Deck</h2>

<div class="strip-h" style="align-items:flex-end;">
  <az-check id="lockSlideSwitch" scope="this" itemType="switch" title="Lock Slide" @change="${() => this.requestUpdate()}" value="${false}"></az-check>
  <az-check id="showcaseLoop" scope="this" itemType="switch" title="Loop" @change="${() => this.requestUpdate()}" value="${true}"></az-check>
  <az-text id="showcaseSlideDeckTransitionInterval" scope="this" title="Slide Deck Transition Interval (ms)" placeholder="1000" value="${1000}" @change="${() => this.btnShowcaseStartAutoTransition()}"></az-text>
  <az-button title="Start AutoTransition" @click="${() => this.btnShowcaseStartAutoTransition()}"></az-button>
  <az-button title="Stop AutoTransition" .isDisabled="${!this.showcaseSlideDeck?.autoTransitionInterval}" @click="${() => this.btnShowcaseStopAutoTransmission()}"></az-button>
</div>

<div class="strip-h">

  <div class="strip-h" style="flex-direction:column;">
    <h3>Previous</h3>
    <az-button title="Loop: ${this.showcaseLoop?.value}" @click="${() => this.btnShowcasePreviousSlide()}"></az-button>
    <az-button title="Force: Loop" @click="${() => this.btnShowcasePreviousSlide(true)}"></az-button>
    <az-button title="Force: No Loop" @click="${() => this.btnShowcasePreviousSlide(false)}"></az-button>
  </div>

  <div class="strip-h" style="flex:1;height:100%;justify-content:center;">
    <az-slide-deck id="showcaseSlideDeck" scope="this" @slideChanging="${this.slideChanging}" .autoTransitionInterval="${asInt(this.showcaseSlideDeckShowcase?.value)}" .loop="${this.showcaseLoop?.value}" style="width:100%;text-align:center;border:1px solid">
      <az-slide>Here's slide 1</az-slide>
      <az-slide>Here's slide 2</az-slide>
      <az-slide>Here's slide 3</az-slide>
      <az-slide>Here's slide 4</az-slide>
      <az-slide>Here's slide 5</az-slide>
    </az-slide-deck>
  </div>

  <div class="strip-h" style="flex-direction:column">
    <h3>Next</h3>
    <az-button title="Loop: ${this.showcaseLoop?.value}" @click="${() => this.btnShowcaseNextSlide()}"></az-button>
    <az-button title="Force: Loop" @click="${() => this.btnShowcaseNextSlide(true)}"></az-button>
    <az-button title="Force: No Loop" @click="${() => this.btnShowcaseNextSlide(false)}"></az-button>
  </div>

</div>
    `;
  }
}

window.customElements.define("az-case-slide-deck", CaseSlideDeck);
