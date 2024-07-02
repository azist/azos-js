import { html } from "../../ui";
import { ModalDialog } from "../../modal-dialog";

export class ChronicleFilterDialog extends ModalDialog{
  constructor(){
    super();
  }

  #btnApplyClick(){
    this.modalResult = true;
    this.close();
  }

  #btnCancelClick(){
    this.modalResult = false;
    this.close();
  }

  renderBody(){
    return html`<div class="dlg-body">

       Set filter parameters below

      <az-button id="btnApply" scope="this" title="Apply" @click="${this.#btnApplyClick}"> </az-button>
      <az-button id="btnCancel" scope="this" title="Cancel" @click="${this.#btnCancelClick}"> </az-button>
    </div>  `;
  }

}

window.customElements.define("az-sky-chronicle-filter-dialog", ChronicleFilterDialog);
