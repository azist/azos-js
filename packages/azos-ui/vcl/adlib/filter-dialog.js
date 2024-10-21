/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, css } from "../../ui";
import { ModalDialog } from "../../modal-dialog";

import "../../parts/button";
import "../../parts/text-field";
import "../../parts/check-field";

export class AdlibFilterDialog extends ModalDialog{
  constructor(){
    super();
  }

  static styles = [ModalDialog.styles, css`
.strip-h{
  display: flex;
  flex-wrap: wrap;
  margin: 0.5em 0em 0em 0em;
}

 `];

  #selectedContext;

  #btnApplyClick(){
    this.modalResult = this.#selectedContext;
    this.close();
  }

  #btnCancelClick(){
    this.modalResult = null;
    this.close();
  }

  renderBodyContent(){
    return html`
<az-tree-view id=treeView scope=this></az-tree-view>

<div class="strip-h" style="float: right;">
  <az-button id="btnApply" scope="this" title="&#8623; Apply" @click="${this.#btnApplyClick}" status="ok"> </az-button>
  <az-button id="btnCancel" scope="this" title="Cancel" @click="${this.#btnCancelClick}"> </az-button>
</div>
    `;
  }

}

window.customElements.define("az-sky-adlib-filter-dialog", AdlibFilterDialog);
