
import { html, css} from '../ui.js';
import { AzosPart } from './part.js';
import {baseStyles} from './styles.js';

/** Defines a simple button exposed as `az-button` tag */
export class Button extends AzosPart{
  static styles = [baseStyles, css`
  button{
    background: red;
    border: 1px solid lime;
    padding: 4px 4px 4px 4px;
    margin: 1px 1px 1px 1px;
    transform: rotate(5deg);
    box-shadow: 1px 1px 3px rgba(100,100,100,0.5);
  }
  `];

  static properties = {
    title:   {type: String}
  };


  constructor(){ super(); }

  renderPart(){
    const cls = "none";
    return html`<button class="${cls}" .disabled=${this.isDisabled}>  ${this.title}</button>`;
  }
}

window.customElements.define("az-button", Button);
