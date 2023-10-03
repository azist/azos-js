import {Types as types} from "azos";
//import { Linq } from "azos";

import {html, css, LitElement} from "lit";

export class AzosElement extends LitElement {

  static styles = css`p { color: blue }`;

  static properties = {
    name: {type: String},
  };

  constructor() {   super();   }
  render() { return html`>>AZOS ELEMENT<<`; }
}