/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

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
  margin: 0.5em 0em 0em 0em;
}

form{
 width: 80vw;
 max-width: 450px;
 min-width: 320px;
}

*{
 text-align: left;
}

label{
  margin: .5em;
  border: none;
  float: inline-start;
  padding-top: .35em;
  color: #828282;
}

input, select, textarea{
  margin: .5em;
  width: 38ch;
  border: 1px solid #545454;
  border-radius: 4px;
  padding: .45em;
  background: #fff;
  color: #424242;
  float: inline-end;
}

textarea{
 width: 85%;
 resize: none;
}

.field-block{
  display: block;
  width: 100%;
  clear: both;
  box-sizing: border-box;
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
    result["CrossShard"] = this.$("chkShards").checked;
    return result;
  }

  renderBodyContent(){
    return html`
<form id="frmFilter" autocomplete="off" onsubmit="return false">
<div class="field-block">
   <label for="fldGdid">Gdid</label>       <input type=text id="fldGdid" placeholder="0:0:0">
</div>
<div class="field-block">
   <label for="fldId">Id</label>           <input type=text id="fldId" placeholder="guid:00000000-0000-0000-0000-000000000000" value="">
</div>
<div class="field-block">
   <label for="fldRelId">RelId</label>     <input type=text id="fldRelId" placeholder="guid:00000000-0000-0000-0000-000000000000" value="">
</div>
<div class="field-block">
   <label for="fldChannel">Channel</label> <input type=text id="fldChannel" placeholder="A(8)">
</div>
<div class="field-block">
   <label for="fldApplication">Application</label> <input type=text id="fldApplication" placeholder="A(8)">
</div>

<div class="field-block">
   <label for="fldStartUtc">Start Utc</label>   <input type=text id="fldStartUtc" placeholder="ISO8601: YYYY-MM-DDThh:mm:ss.fffZ">
</div>
<div class="field-block">
   <label for="fldEndUtc">End Utc</label>     <input type=text id="fldEndUtc" placeholder="ISO8601: YYYY-MM-DDThh:mm:ss.fffZ">
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

<div class="field-block">
   <label for="chkFullGuids">Full Guids</label> <input type="checkbox" id="chkFullGuids" checked onclick="buildGrid(serverResponse.data)">
</div>
<div class="field-block">
   <label for="chkChannel">Channel</label> <input type="checkbox"  id="chkChannel" checked onclick="buildGrid(serverResponse.data)">
</div>
<div class="field-block">
   <label for="chkAdims">Archive dims</label> <input type="checkbox"  id="chkAdims" onclick="buildGrid(serverResponse.data)">
</div>
<div class="field-block">
<label for="chkShards">Shards</label> <input type="checkbox"  id="chkShards" checked>
</div>
<div class="field-block"></div>
</form>

<div class="strip-h" style="float: right;">
  <az-button id="btnApply" scope="this" title="&#8623; Apply" @click="${this.#btnApplyClick}" status="ok"> </az-button>
  <az-button id="btnCancel" scope="this" title="Cancel" @click="${this.#btnCancelClick}"> </az-button>
</div>
`;
  }

}

window.customElements.define("az-sky-chronicle-filter-dialog", ChronicleFilterDialog);
