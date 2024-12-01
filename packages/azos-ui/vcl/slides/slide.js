/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Block } from "../../blocks";
import { html } from "../../ui";

export class Slide extends Block {
  static properties = {
    slot: { type: String, reflect: true },
  }

  get slideDeck() { return this.parentNode; }

  renderControl() {
    return html`<slot></slot>`;
  }
}
