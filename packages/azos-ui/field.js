import {Types as types} from "azos";
//import { Linq } from "azos";
import { AzosElement } from "./azos-element.js";

import {html, css} from "lit";

export class Field extends AzosElement {

  static styles = css`p { color: blue }`;


  static properties = {
    name: {type: String},
  };


  constructor() {
    super();  
      //Linq.$(null)
      //if (types.isAssigned(this))
      this.name = 'Somebody';
  }


  render() {
    return html
`
    <p>
    Hello, ${this.name}!
    </p>
`;
  }

}

customElements.define('az-field', Field);