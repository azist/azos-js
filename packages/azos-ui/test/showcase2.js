/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AzosElement, css, html } from "../ui";
import "../parts/button.js";
import "../parts/text-field.js";

export class Showcase2 extends AzosElement {
  constructor() { super(); }

  static styles = css`
    .row{
      display: flex;
      flex-direction: row;
      align-items: center;
      padding:1em;
      border:2px dotted pink;
      background-color:white;
      margin:2em auto;
    }
  `;

  render() {
    const showcase = this;
    return html`
      <div class="row">
        <az-text title="Something" titleposition="mid-left" status="error" contentwidth="75" rank="4"  placeholder="Type it now"></az-text>
        <az-button title="Boootttooon" rank="4" status="error"></az-button>
      </div>
    `;
  }
}

window.customElements.define("az-test-showcase-2", Showcase2);
