import { html, css } from "../../ui";
import { ModalDialog } from "../../modal-dialog";

import "../../parts/button";

export class ChronicleFilterDialog extends ModalDialog{
  constructor(){
    super();
  }

  static styles = [ModalDialog.styles, css`
.strip-h{
  display: flex;
  flex-wrap: nowrap;
  margin: 0.5em 0em 1em 0em;
}
 `];

  #btnApplyClick(){
    this.modalResult = true;
    this.close();
  }

  #btnCancelClick(){
    this.modalResult = false;
    this.close();
  }

  renderBodyContent(){
    return html`
<form id="frmFilter" autocomplete="off" onsubmit="return false">
 <div class="form-block">
   <label for="fldGdid">Gdid</label>       <input type=text id="fldGdid" placeholder="0:0:0">
   <label for="fldId">Id</label>           <input type=text id="fldId" placeholder="guid:00000000-0000-0000-0000-000000000000" value="[:FILTER-ID:]">
   <label for="fldRelId">RelId</label>     <input type=text id="fldRelId" placeholder="guid:00000000-0000-0000-0000-000000000000" value="[:FILTER-REL:]">
   <label for="fldChannel">Channel</label> <input type=text id="fldChannel" placeholder="A(8)">
   <label for="fldApplication">Application</label> <input type=text id="fldApplication" placeholder="A(8)">
 </div>

 <div class="form-block">
   <label for="fldStartUtc">Start Utc</label>   <input type=text id="fldStartUtc" placeholder="ISO8601: YYYY-MM-DDThh:mm:ss.fffZ">
   <label for="fldEndUtc">End Utc</label>     <input type=text id="fldEndUtc" placeholder="ISO8601: YYYY-MM-DDThh:mm:ss.fffZ">

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
 <div class="form-block">
   <label for="fldAdvancedFilter">Advanced</label> <textarea id="fldAdvancedFilter" rows=7 placeholder="json expression"></textarea>

   <label for="chkFullGuids">Full Guids</label> <input type="checkbox" id="chkFullGuids" checked onclick="buildGrid(serverResponse.data)">
   <label for="chkChannel">Channel</label> <input type="checkbox"  id="chkChannel" checked onclick="buildGrid(serverResponse.data)">
   <br>
   <label for="chkAdims">Archive dims</label> <input type="checkbox"  id="chkAdims" onclick="buildGrid(serverResponse.data)">
   <label for="chkShards">Shards</label> <input type="checkbox"  id="chkShards" checked>
   <select id="cboSave">
     <option value="" disabled selected>..Select saved filter..</option>
   </select>
   <button class="apply" onclick="apply()">&#8623; apply</button>
   <button class="save" onclick="save()">&#8667; save</button>
 </div>
</form>

      <div class="strip-h">
        <az-button id="btnApply" scope="this" title="Apply" @click="${this.#btnApplyClick}"> </az-button>
        <az-button id="btnCancel" scope="this" title="Cancel" @click="${this.#btnCancelClick}"> </az-button>
      </div>
`;
  }

}

window.customElements.define("az-sky-chronicle-filter-dialog", ChronicleFilterDialog);
