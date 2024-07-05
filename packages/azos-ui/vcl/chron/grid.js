/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AzosElement, html, css, noContent } from "azos-ui/ui";
import { asBool } from "azos/types";

export class ChronicleGrid extends AzosElement{
  constructor(){ super(); }

  static styles = css`

table{
  border-collapse: collapse;
  white-space: nowrap;
  max-height: 90vh;
  font-size: .75em;
}

th{ padding: 2px;}

td{
  padding: 4px;
  border-right: 1px dotted #ddd;
}

tr{

}

tr:hover{
  box-shadow: -0px -0px 10px inset #00a0ff;
}

tr:nth-child(even) { background-color: #e8e8e8; }


thead{
 background: #e0e0e0;
 color: #676767;
 padding: 2px;
 border-bottom: 1px solid #d8d8d8;
}


.col-gdid {
  color: #1060d0;
  font-size: 0.75em;
  text-align: center;
  font-weight: bold;
  background-color: rgba(100,150,250,0.05);
}

.col-guid {
 color: #5070b8;
 background-color: rgba(100,150,250,0.05);
}

.col-rel {
 color: #9050a0;
 background-color: rgba(100,150,250,0.05);
}

.col-type {
 color: #a0a0a0;
 font-size: 0.75em;
 text-align: center;
 background-color: rgba(150,150,150,0.05);
}

.col-utc {
 color: #707070;
 font-style: italic;
 background-color: rgba(250,250,50,0.05);
}

.col-error{
 color: #f05030;
 font-weight: bold;
 background-color: rgba(250,150,700,0.08);
}

.msg-type-warning{
 background-color: #f4f4a0 !important;
}

.msg-type-error{
 background-color: #f4c0c0 !important;
}

.msg-type-emergency{
 background-color: #303030 !important;
 color: #fea000 !important;
}

.msg-type-catastrophicerror{
 background-color: #303030 !important;
 color: #fe5000 !important;
}

.snippet{
 font-family: 'Lucida Console, monospace';
 font-size: 8px;
 max-width: 30em;
 max-height: 4.25em;
 overflow: hidden;
 text-overflow: ellipsis;
}

.text{
 white-space: normal;
 max-width: 30em;
 max-height: 4.25em;
 overflow: hidden;
 text-overflow: ellipsis;
}

.text-pre{
 white-space: pre;
 max-width: 30em;
 max-height: 4.25em;
 overflow: hidden;
 text-overflow: ellipsis;
}

.wide{
  max-width: 75em;
}
  `;



  #data = null;
  #showFullGuids = false;
  #showChannel = false;


  get data(){ return this.#data;}
  set data(d){
    this.#data = d;
    this.requestUpdate();
  }

  get showFullGuids(){ return this.#showFullGuids;}
  set showFullGuids(v){
    v = asBool(v);
    if (v===this.#showFullGuids) return;
    this.#showFullGuids = v;
    this.requestUpdate();
  }

  get showChannel(){ return this.#showChannel;}
  set showChannel(v){
    v = asBool(v);
    if (v===this.#showChannel) return;
    this.#showChannel = v;
    this.requestUpdate();
  }


  render(){
    return html`
  <table id="grid">
   <thead id="gridHead">
     ${ this.renderHeader()}
   </thead>
   <tbody id="gridBody">
    ${ this.renderBody(this.#data)}
   </tbody>
  </table>`;
  }

  renderHeader(){
    return html`
<tr>
  <th>Gdid</th>
  <th>Guid</th>
  <th>Rel</th>
  <th>Type</th>
  <th>Utc</th>
  ${(this.#showChannel ? `<th>App</th>  <th>Host</th> <th>Chn</th> <th>Topic</th>` : noContent)}
  <th>From (src)</th>
  <th>Text</th>
  <th>Params</th>
  <th>Error</th>
</tr>
  `;
 }


  guid(v) {
    if (!v) return "";
    if (this.#showFullGuids || !v.length || !v.substr || v.length < 12) return v;
    return ".." + v.substr(v.length - 12)
  }

  snippet(params) {
    if (!params || !params.length) return "";
    if (params.length > 96) {
      return params.substr(0, 95) + "....";
    }
    return params;
  }

  rootError(err) {
    let result = "";
    while (err) {
      result = err.TypeName;
      err = err.InnerException;
    }
    return result;
  }

  renderBody(data){
    if (!data) return noContent;
    const result = [];
    for(let i = 0; i<data.length; i++){
      result.push(this.renderOneRow(i, data[i]))
    }
    return result;
  }

  renderOneRow(i, msg){
    let shard = noContent;
    if (msg.SrcDataShard !== undefined) {
      shard = html`<span class="shard-${msg.SrcDataShard % 3}">${msg.SrcDataShard}</span>`;
    }


    return html`
<tr class="msg-type-${msg.Type.toLowerCase()}" @dblclick="${this.showMsgJson(i)}">
  <td class="col-gdid">${shard}${msg.Gdid}</td>
  <td class="col-guid">${this.guid(msg.Guid)}</td>
  <td class="col-rel">${this.guid(msg.RelatedTo)}</td>
  <td class="col-type">${msg.Type}</td>
  <td class="col-utc">${msg.UTCTimeStamp}</td>
  ${(this.#showChannel ? `<td>${msg.App}</td> <td>${msg.Host}</td> <td>${msg.Channel}</td><td>${msg.Topic}</td>` : noContent)}
  <td>${msg.From} #${(msg.Source | 0).toString()}</td>
  <td> <div class="text${msg.Text && msg.Text.indexOf && msg.Text.indexOf('\n') < 0 ? "" : "-pre"}${this.#showChannel ? noContent : " wide"}" @click="${this.showMsgText(i)}">${msg.Text}</div></td>
  <td> <div class="snippet" @click="${this.showParams(i)}">${this.snippet(msg.Parameters)}</div></td>
  <td class="col-error"> <div onclick="showError(${i})">${this.rootError(msg.ExceptionData)}</div></td>
</tr>`;
  }

  showMsgJson(){

  }

  showMsgText(){

  }

  showParams(){

  }

}

window.customElements.define("az-sky-chronicle-grid", ChronicleGrid);
