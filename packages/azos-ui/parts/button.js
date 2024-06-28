
import { html, css} from '../ui.js';
import { AzosPart } from './part.js';
import {baseStyles} from './styles.js';

/** Defines a simple button exposed as `az-button` tag */
export class Button extends AzosPart{
  static styles = [baseStyles, css`
  button{
  }
  `];

  static properties = {
    title:   {type: String}
  };


  constructor(){
      super();
  }


  render(){
    const cls = "none";
    const stl = this.calcStyles();

//https://frontendmasters.com/blog/light-dom-only/
// we should consider using light dom for parts


    return html`<button class="${cls}" style="${stl}">${this.title}</button>`;
  }
}

window.customElements.define("az-button", Button);
