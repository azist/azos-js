
import { html, css, parseRank, parseStatus } from '../ui.js';
import { AzosPart } from './part.js';
import { baseStyles } from './styles.js';

/** Defines a simple button exposed as `az-button` tag */
export class Button extends AzosPart{
  static styles = [baseStyles, css`
  button{
    border: 1px solid gray;
    padding: 0.5lh 1ch 0.5lh 1ch;
    margin: 0.5lh 0.5ch 0.5lh 0.5ch;
    min-width: 10ch;
  }
    button:hover{
      filter:  brightness(1.15);
    }
  `];

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
