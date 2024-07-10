/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AzosElement, html, css, parseRank, parseStatus, STATUS, RANK } from "./ui.js";


/**
 * Spinners indicate some kind of pending operation such as external service call
 */
export class Spinner extends AzosElement {

  /** Shows a spinner with optional title, rank, status and modal mode */
  static show(title = null, rank = RANK.NORMAL, status = STATUS.DEFAULT, isModal = false){
    const spinner = new Spinner();
    spinner.title = title;
    spinner.rank = rank;
    spinner.status = status;
    spinner.isModal = isModal | false;
    document.appendChild(spinner);
    return spinner;
  }

  /** Shows a modal spinner with optional title, rank, and status */
  static showModal(title = null, rank = RANK.NORMAL, status = STATUS.DEFAULT){ return Spinner.show(title, rank, status, true);  }

  /** Hides the specified spinner */
  static hide(spinner){
    if (spinner instanceof Spinner) document.removeChild(spinner);
  }



  static styles = css`
  `;

  static properties = {
    title: {type: String},
    isModal: {type: Boolean}
  };

  renderBody(){

  }

}

//https://loading.io/css/
window.customElements.define("az-spinner", Spinner);
