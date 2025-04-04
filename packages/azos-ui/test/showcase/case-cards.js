/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/
import { STL_CARD } from "../../styles";
import { html, css } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseCards extends CaseBase {

  static styles = [...this.styles, STL_CARD, css`.card {
    margin-bottom: 1em;
  }`];

toggleActiveClass() {
    const card = this.shadowRoot.querySelector('#toggleCard');
    if (card) {
      card.classList.toggle('active');
    }
  
}

  renderControl() {
    return html`

    <h2>Cards</h2>
    <div class="card">
      <h2 class="card-title">Card Title</h2>
      <p class="card-id">Card ID: 12345</p>
      <p>Classes .card</p>
    </div>

    <button @click=${() => this.toggleActiveClass()}>Toggle Active Class</button>
    <div id="toggleCard" class="card">
      <h2 class="card-title">Card Title</h2>
      <p class="card-id">Card ID: 12345</p>
      <p>Classes .card .active</p>
    </div>

    <div class="card highlight">
      <h2 class="card-title">Card Title</h2>
      <p class="card-id">Card ID: 12345</p>
      <p>Classes .card .hightlight</p>
    </div>
    `;
  }
}

window.customElements.define("az-case-cards", CaseCards);
