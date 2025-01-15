/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { okMsg, infoMsg, warningMsg, alertMsg, errorMsg } from "../../msg-box";
import { prompt } from "../../ok-cancel-modal";
import { Spinner } from "../../spinner";
import { html } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseModals extends CaseBase {
  #btnDlg1Open() { this.dlg1.show(); }
  #btnDlg1Close() { this.dlg1.close(); }
  #btnDlg2Open() { this.dlg2.show(); }
  #btnDlg2Close() { this.dlg2.close(); }
  #btnModalSpinnerOpen() { this.spinnerModal.show(); }
  #btnNonModalSpinnerOpen() { this.spinnerNonModal.show(); }
  #btnNonModalSpinnerClose() { this.spinnerNonModal.hide(); }
  #btnAutoSpinnerOpen() { Spinner.show(null, 3000); }
  async #btnSpinnerProcess() {
    await Spinner.exec(async sp => {
      sp.message = `Prepping DB...`;
      await new Promise(resolve => setTimeout(resolve, 1070));
      sp.message = `Exec DDL 1 of 5 ...`;
      await new Promise(resolve => setTimeout(resolve, 1500));
      sp.message = `Exec DDL 2 of 5 ...`;
      await new Promise(resolve => setTimeout(resolve, 890));
      sp.message = `Exec DDL 3 of 5 ...`;
      await new Promise(resolve => setTimeout(resolve, 1232));
      sp.status = "error";
      sp.message = `Recovering DDL error...`;
      await new Promise(resolve => setTimeout(resolve, 2370));
      sp.status = "warning";
      sp.message = `Exec DDL 4 of 5 ...`;
      await new Promise(resolve => setTimeout(resolve, 1870));
      sp.message = `Exec DDL 5 of 5 ...`;
      sp.status = "ok";
      await new Promise(resolve => setTimeout(resolve, 2360));
    });
  }

  renderControl() {
    return html`
<h2>Modal Dialogs</h2>
<az-button @click="${this.#btnDlg1Open}" title="Open..."></az-button>
<az-button @click="${this.#btnDlg2Open}" title="Open Code..." status="info"></az-button>

<az-button @click="${this.#btnModalSpinnerOpen}" title="Open Modal Spinner..." status="alert"></az-button>
<az-button @click="${this.#btnSpinnerProcess}" title="Run Spinner Process..." status="info"></az-button>

<az-button @click="${this.#btnNonModalSpinnerOpen}" title="Open NM Spinner..." status="info"></az-button>
<az-button @click="${this.#btnNonModalSpinnerClose}" title="Close NM Spinner..." status="info"></az-button>

<az-button @click="${this.#btnAutoSpinnerOpen}" title="Auto Spinner..." status="info"></az-button>

<az-spinner id="spinnerModal" scope="this" status="alert" timeout="5000" isModal></az-spinner>
<az-spinner id="spinnerNonModal" scope="this" status="info" timeout="10000" message="Dill helps to expel what you propel"></az-spinner>


<az-button @click="${() => okMsg("All ok!", "My ok message content line") }" title="OK Message"></az-button>
<az-button @click="${() => infoMsg("Info title", "Information message content line") }" title="Info Message"></az-button>
<az-button @click="${() => warningMsg("Warning title", "Warning message content line") }" title="Warning msg"></az-button>
<az-button @click="${() => alertMsg("Alert title", "Alert message content line ") }" title="Alert msg"></az-button>
<az-button @click="${() => errorMsg("Error title", "Error message content line") }" title="Error msg"></az-button>

<az-button @click="${() => prompt("Please confirm you ownership of this vehicle", {title: "Ownership"})}" title="Prompt user"></az-button>

<az-modal-dialog id="dlg1" scope="self" title="Dialog 1" rank="normal" status="default">
  <div slot="body">
    <p>
     It is a long established fact that <strong>a reader will be distracted</strong> by the readable content of a page when looking at its layout.
     The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here',
     making it look like readable English. Many desktop publishing packages and web page editors now use <strong>Lorem Ipsum</strong> as their default model text,
     and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident,
     sometimes on purpose (injected humour and the like). Yes
    </p>
    <az-button @click="${this.#btnDlg1Close}" title="Close" style="float: right;"></az-button>
  </div>
</az-modal-dialog>

<az-modal-dialog id="dlg2" scope="self" title="Code Box Snippet" status="info">
  <div slot="body">
    <az-code-box highlight="js" source="">//this is my json object
      {
        "a": 1, "b": 2, "c": true,
        d: ["string1", null, true, false, {"name": "string2", "salary": 100.67}],
        "c": "string message",
        "d": [{"a": -123.032, "b": +45}, false, null, null, "ok"]
      }
    </az-code-box>
    <br>
    <az-button @click="${this.#btnDlg2Close}" title="Close" style="float: right;"></az-button>
  </div>
</az-modal-dialog>
    `;
  }
}

window.customElements.define("az-case-modals", CaseModals);
