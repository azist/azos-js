
import { html, css, parseRank, parseStatus } from '../ui.js';
import { AzosPart } from './part.js';
import { baseStyles } from './styles.js';

/** Defines a simple button exposed as `az-button` tag */
export class Button extends AzosPart{
  static styles = [baseStyles, css`
  button{
    border: 1px solid gray;
    background: linear-gradient(180deg, white, #e8e8e8);
    box-shadow: 0px 0px 2px rgba(25, 25, 25, .25);
    padding: 0.5lh 1ch 0.5lh 1ch;
    margin: 0.5lh 0.5ch 0.5lh 0.5ch;
    min-width: 10ch;
    transition: 0.2s;
  }

  button:focus{
    outline: 1px solid rgba(10, 128, 255, 0.55);
    box-shadow: 0px 0px 8px rgba(10, 128, 255, .9);
  }

  button:hover{
    filter:  brightness(1.08);
  }

  button:active{
    transform: translateY(2px);
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
