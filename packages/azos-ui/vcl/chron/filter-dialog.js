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

export class ChronicleFilterDialog extends ModalDialog{
  constructor(){
    super();
  }

  static styles = [ModalDialog.styles, css`
.strip-h{
  display: flex;
  flex-wrap: wrap;
  margin: 0.5em 0em 0em 0em;
}

form{
 width: 80vw;
 max-width: 450px;
 min-width: 320px;
}

az-text, az-check{
 display: block;
}

az-check{
  min-width: 12ch;
}


 `];

  #btnApplyClick(){
    this.modalResult = this.#buildFilter();
    this.close();
  }

  #btnCancelClick(){
    this.modalResult = null;
    this.close();
  }

  //Build filter out of the form
  #buildFilter() {
    const result = {};

    function fld(name) {
      const elm = this.$("fld"+name);
      if (!elm) return;
      const val = elm.value;
      if (!val) return;
      result[name] = val;
    }

    ["Gdid", "Id", "RelId", "Channel", "Application", "MinType", "MaxType", "AdvancedFilter"].forEach(f => fld.call(this, f));

    const sd = this.$("fldStartUtc").value;
    const ed = this.$("fldEndUtc").value;
    if (sd || ed) {
      let range = {};
      if (sd) range["start"] = sd;
      if (ed) range["end"] = ed;
      result["TimeRange"] = range;
    }

    result["PagingCount"] = this.$("fldCount").value | 0;
    result["CrossShard"] = this.$("chkShards").value;
    return result;
  }

  renderBodyContent(){
    return html`
<form id="frmFilter" autocomplete="off" onsubmit="return false">

  <az-text id="fldGdid" scope="this" title="Gdid" placeholder="0:0:0"></az-text>
  <az-text id="fldId" scope="this" title="Id (guid)" placeholder="guid:00000000-0000-0000-0000-000000000000"></az-text>
  <az-text id="fldRelId" scope="this" title="Related Id (guid)" placeholder="guid:00000000-0000-0000-0000-000000000000" status="info"></az-text>

<div class="strip-h">
  <az-text id="fldChannel" scope="this" title="Channel (atom)" placeholder="A(8)" style="width: 50%"></az-text>
  <az-text id="fldApplication" scope="this" title="Application (atom)" placeholder="A(8)" style="width: 50%"></az-text>
</div>

<div class="strip-h">
  <az-text id="fldStartUtc" scope="this" title="Start Utc" placeholder="YYYY-MM-DDThh:mm:ss.fffZ" style="width: 50%"></az-text>
  <az-text id="fldEndUtc" scope="this" title="End Utc" placeholder="YYYY-MM-DDThh:mm:ss.fffZ" style="width: 50%"></az-text>
</div>

<div class="field-block">
  <label for="fldMinType">Min Type</label>
  <select id="fldMinType">
     <option value="">-- unset --</option>
     <option value="Debug">Debug</option>
     <option value="DebugA">DebugA</option>
     <option value="DebugB">DebugB</option>
     <option value="DebugC">DebugC</option>
     <option value="DebugD">DebugD</option>
     <option value="DebugError">DebugError</option>
     <option value="DebugSQL">DebugSQL</option>
     <option value="DebugGlue">DebugGlue</option>
     <option value="DebugZ">DebugZ</option>
     <option value="Trace">Trace</option>
     <option value="TraceA">TraceA</option>
     <option value="TraceB">TraceB</option>
     <option value="TraceC">TraceC</option>
     <option value="TraceD">TraceD</option>
     <option value="TraceErrors">TraceErrors</option>
     <option value="TraceSQL">TraceSQL</option>
     <option value="TraceNetGlue">TraceNetGlue</option>
     <option value="TraceZ">TraceZ</option>
     <option value="PerformanceInstrumentation">PerformanceInstrumentation</option>
     <option value="Info">Info</option>
     <option value="InfoA">InfoA</option>
     <option value="InfoB">InfoB</option>
     <option value="InfoC">InfoC</option>
     <option value="InfoD">InfoD</option>
     <option value="InfoZ">InfoZ</option>
     <option value="Aggregate">Aggregate</option>
     <option value="SecurityAudit">SecurityAudit</option>
     <option value="Notice">Notice</option>
     <option value="Warning">Warning</option>
     <option value="WarningExpectation">WarningExpectation</option>
     <option value="Error">Error</option>
     <option value="ErrorInfo">ErrorInfo</option>
     <option value="Critical">Critical</option>
     <option value="CriticalAlert">CriticalAlert</option>
     <option value="Emergency">Emergency</option>
     <option value="CatastrophicError">CatastrophicError</option>
   </select>
</div>

<div class="field-block">
 <label for="fldMaxType">Max Type</label>
 <select id="fldMaxType">
     <option value="">-- unset --</option>
     <option value="Debug">Debug</option>
     <option value="DebugA">DebugA</option>
     <option value="DebugB">DebugB</option>
     <option value="DebugC">DebugC</option>
     <option value="DebugD">DebugD</option>
     <option value="DebugError">DebugError</option>
     <option value="DebugSQL">DebugSQL</option>
     <option value="DebugGlue">DebugGlue</option>
     <option value="DebugZ">DebugZ</option>
     <option value="Trace">Trace</option>
     <option value="TraceA">TraceA</option>
     <option value="TraceB">TraceB</option>
     <option value="TraceC">TraceC</option>
     <option value="TraceD">TraceD</option>
     <option value="TraceErrors">TraceErrors</option>
     <option value="TraceSQL">TraceSQL</option>
     <option value="TraceNetGlue">TraceNetGlue</option>
     <option value="TraceZ">TraceZ</option>
     <option value="PerformanceInstrumentation">PerformanceInstrumentation</option>
     <option value="Info">Info</option>
     <option value="InfoA">InfoA</option>
     <option value="InfoB">InfoB</option>
     <option value="InfoC">InfoC</option>
     <option value="InfoD">InfoD</option>
     <option value="InfoZ">InfoZ</option>
     <option value="Aggregate">Aggregate</option>
     <option value="SecurityAudit">SecurityAudit</option>
     <option value="Notice">Notice</option>
     <option value="Warning">Warning</option>
     <option value="WarningExpectation">WarningExpectation</option>
     <option value="Error">Error</option>
     <option value="ErrorInfo">ErrorInfo</option>
     <option value="Critical">Critical</option>
     <option value="CriticalAlert">CriticalAlert</option>
     <option value="Emergency">Emergency</option>
     <option value="CatastrophicError">CatastrophicError</option>
 </select>
</div>

<div class="field-block">
 <label for="fldCount">Results Count</label>
 <select id="fldCount">
     <option value="25">25</option>
     <option value="50">50</option>
     <option value="100">100</option>
     <option value="250" selected="selected">250</option>
     <option value="500">500</option>
     <option value="750">750</option>
 </select>
 </div>

<div class="field-block">
   <label for="fldAdvancedFilter">Advanced</label> <textarea id="fldAdvancedFilter" rows=4 placeholder="json expression"></textarea>
</div>

<div class="strip-h">
  <az-check id="chkFullGuids" scope="this" title="Full Guids" itemtype="switch" ></az-check>
  <az-check id="chkChannel" scope="this" title="Channel" itemtype="switch" ></az-check>
  <az-check id="chkAdims" scope="this" title="Archive dims" itemtype="switch" ></az-check>
  <az-check id="chkShards" scope="this" title="Shards"itemtype="switch" ></az-check>
</div>

</form>

<div class="strip-h" style="float: right;">
  <az-button id="btnApply" scope="this" title="&#8623; Apply" @click="${this.#btnApplyClick}" status="ok"> </az-button>
  <az-button id="btnCancel" scope="this" title="Cancel" @click="${this.#btnCancelClick}"> </az-button>
</div>
`;
  }

}

window.customElements.define("az-sky-chronicle-filter-dialog", ChronicleFilterDialog);
