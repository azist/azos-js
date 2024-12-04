/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { toast } from "../../toast";
import { html, POSITION, RANK, STATUS } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseToasts extends CaseBase {

  #toastCount = 0;

  async #btnToastMe(multiple = false) {
    const toasts = multiple ? 5 : 1;
    for (let i = 0; i < toasts; i++) {
      temp(++this.#toastCount);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    function temp(id) {
      const randomRank = false;
      const randomStatus = false;
      const randomPosition = false;
      const timeout = undefined; //1_000;

      const rank = randomRank ? Math.floor(Math.random() * Object.keys(RANK).length) : RANK.DEFAULT;
      const status = randomStatus ? ["ok", "info", "warning", "alert", "error"][Math.floor(Math.random() * Object.keys(STATUS).length)] : STATUS.DEFAULT;
      const position = randomPosition ? [...Object.values(POSITION)][Math.floor(Math.random() * Object.keys(POSITION).length)] : POSITION.DEFAULT;

      toast(`Your file 'c:\\windows\\junk\\text${id}.txt' has been saved!`, { timeout, rank, status, position });
    }
  }
  renderControl() {
    return html`
<h2>Toasts</h2>
<az-button @click="${() => this.#btnToastMe(false)}" title="Toast Me..."></az-button>
<az-button @click="${() => this.#btnToastMe(true)}" title="Toast Me Many..."></az-button>
    `;
  }
}

window.customElements.define("az-case-toasts", CaseToasts);
