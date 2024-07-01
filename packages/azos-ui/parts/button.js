
import { html, parseRank, parseStatus } from '../ui.js';
import { AzosPart } from './part.js';
import { baseStyles, buttonStyles } from './styles.js';

/** Defines a simple button exposed as `az-button` tag */
export class Button extends AzosPart{
  static styles = [baseStyles, buttonStyles];

  static properties = {
    title:   {type: String}
  };


  constructor(){ super(); }

  renderPart(){
    let cls = `${parseRank(this.rank, true)} ${parseStatus(this.status, true)}`;
    return html`<button class="${cls}" .disabled=${this.isDisabled}>  ${this.title}</button>`;
  }
}

window.customElements.define("az-button", Button);
