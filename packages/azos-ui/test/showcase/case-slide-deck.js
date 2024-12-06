/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { asBool, asInt } from "azos/types";
import { html } from "../../ui";
import { CaseBase } from "./case-base";
import { toast } from "../../toast";

import "../../vcl/slides/slide-deck";

export class CaseSlideDeck extends CaseBase {
  btnPreviousSlide(force) { this.slideDeck.previousSlide(force); }
  btnNextSlide(force) { this.slideDeck.nextSlide(force); }
  btnStartAutoTransition() {
    this.slideDeck.startAutoTransition(asInt(this.#transitionInterval));
    this.requestUpdate();
  }

  btnStopAutoTransmission() {
    this.slideDeck.stopAutoTransition();
    this.requestUpdate();
  }

  async slideChanging(e) {
    if (this.lockSlideSwitch.value) {
      e.preventDefault();
      toast("Change canceled");
    }
  }

  #loop = true;
  loopSwitched(e) {
    this.#loop = e.target.value || null;
    this.requestUpdate();
  }

  #transitionInterval = 0;//1_000;
  changeTransitionInterval(e) {
    this.#transitionInterval = e.target.value;
    this.btnStartAutoTransition();
    this.requestUpdate();
  }

  firstUpdated() {
    this.btnStopAutoTransition.isDisabled = !this.slideDeck.autoTransitionInterval;
  }

  renderControl() {
    return html`
<h2>Slide Deck</h2>

<div class="strip-h" style="align-items:flex-end;">
  <az-check id="lockSlideSwitch" scope="this" itemType="switch" title="Lock Slide" @change="${() => this.requestUpdate()}" value="${false}"></az-check>
  <az-check id="loopSwitch" scope="this" itemType="switch" title="Loop" @change="${this.loopSwitched}" value="${this.#loop}"></az-check>
  <az-text id="slideDeckTransitionInterval" scope="this" title="Slide Deck Transition Interval (ms)" placeholder="1000" value="${this.#transitionInterval}" @change="${this.changeTransitionInterval}"></az-text>
  <az-button title="Start AutoTransition" @click="${() => this.btnStartAutoTransition()}"></az-button>
  <az-button id="btnStopAutoTransition" scope="this" title="Stop AutoTransition" .isDisabled="${!this.slideDeck?.autoTransitionInterval || 0}" @click="${() => this.btnStopAutoTransmission()}"></az-button>
</div>

<div class="strip-h">

  <div class="strip-h" style="flex-direction:column;">
    <h3>Previous</h3>
    <az-button title="Loop: ${!!this.#loop}" @click="${() => this.btnPreviousSlide()}"></az-button>
    <az-button title="Force: Loop" @click="${() => this.btnPreviousSlide(true)}"></az-button>
    <az-button title="Force: No Loop" @click="${() => this.btnPreviousSlide(false)}"></az-button>
  </div>

  <div class="strip-h" style="flex:1;height:100%;justify-content:center;">
    <az-slide-deck id="slideDeck" scope="this" activeSlideIndex="2" @slideChanging="${this.slideChanging}" ?loop="${this.#loop}" autoTransitionInterval="0" style="width:100%;text-align:center;border:1px solid">
      <az-slide id="Slide1"><h2>Slide 1 (Index 0)</h2><p>Lorem ipsum odor amet, consectetuer adipiscing elit. Sed volutpat magnis sapien vehicula pellentesque suscipit justo? Porttitor mus quam phasellus lorem dis penatibus. Lectus ullamcorper risus vivamus ridiculus quisque sem aliquet felis ultricies. Pharetra habitasse urna id iaculis faucibus finibus mollis? Ut vivamus primis vulputate hendrerit nascetur morbi dui elementum. Vivamus erat dolor feugiat inceptos eget purus eget sapien ipsum. Libero dictum faucibus ornare senectus neque posuere parturient, dictum amet.</p></az-slide>
      <az-slide id="Slide2"><h2>Slide 2 (Index 1)</h2><p>Felis sollicitudin nam odio convallis in vehicula elementum. Cursus mauris ad donec dis nulla eros quisque. Ridiculus elementum lacinia risus massa praesent gravida, suscipit hendrerit. Tellus vitae cras ullamcorper faucibus neque venenatis. Vulputate vel iaculis quis pulvinar egestas maximus. Cursus odio habitant; quam feugiat mollis sociosqu.</p></az-slide>
      <az-slide id="Slide3"><h2>Slide 3 (Index 2)</h2><p>Lectus erat rhoncus risus aliquet felis torquent. Nisi suspendisse mollis sem augue; facilisi phasellus. Posuere efficitur himenaeos quam tincidunt; suspendisse morbi integer semper. Libero libero ligula feugiat suscipit torquent scelerisque. At quis varius ad tristique eros fringilla et felis praesent. Mi facilisis vel porta sollicitudin cubilia. Varius sollicitudin himenaeos ad leo auctor. Non viverra per odio nascetur habitant malesuada. Fringilla vivamus ullamcorper dis habitant scelerisque. Parturient libero suspendisse magnis fusce aliquet?</p></az-slide>
      <az-slide id="Slide4"><h2>Slide 4 (Index 3)</h2><p>Montes mus leo mattis; ut odio dictumst justo metus. Tempus mattis maximus molestie fames himenaeos dolor quam nullam. Eleifend cubilia lacinia viverra himenaeos purus fermentum montes maximus. Aliquam hendrerit sollicitudin pharetra nostra odio; faucibus dui vulputate. Sapien fermentum ut nulla; ligula facilisis senectus nisi. Mauris iaculis montes inceptos facilisi fusce eleifend volutpat condimentum. Ac suspendisse tortor nulla fames sapien fusce phasellus. Per montes varius consectetur tristique morbi hendrerit integer. Quis ac sem class phasellus nisi efficitur sodales nostra.</p></az-slide>
      <az-slide id="Slide5"><h2>Slide 5 (Index 4)</h2><p>Himenaeos per maecenas eu conubia nascetur aliquet curae aliquet. Mattis consectetur mus netus nibh sodales dignissim. Malesuada laoreet fusce eget cursus senectus proin. Tellus conubia faucibus eleifend risus venenatis. Aliquam hac aliquam lectus pulvinar nisi proin nostra mauris. Maximus convallis pulvinar netus nibh torquent habitasse fusce dictumst sociosqu. Mollis purus porta massa maximus ante nisl. Integer duis est ante proin cras; dapibus suspendisse praesent. Efficitur nisi id morbi ultricies ex commodo. In tortor gravida mus metus sem.</p></az-slide>
    </az-slide-deck>
  </div>

  <div class="strip-h" style="flex-direction:column">
    <h3>Next</h3>
    <az-button title="Loop: ${!!this.#loop}" @click="${() => this.btnNextSlide()}"></az-button>
    <az-button title="Force: Loop" @click="${() => this.btnNextSlide(true)}"></az-button>
    <az-button title="Force: No Loop" @click="${() => this.btnNextSlide(false)}"></az-button>
  </div>

</div>
    `;
  }
}

window.customElements.define("az-case-slide-deck", CaseSlideDeck);
