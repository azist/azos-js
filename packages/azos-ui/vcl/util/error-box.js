/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { dflt } from "azos/strings";
import { Control, css, html, parseRank, noContent } from "../../ui";
import { CLIENT_MESSAGE_PROP, DATA_NAME_PROP, ERROR_PROP, isArray, isString } from "azos/types";

/** Provides error/exception display functionality with optional details */
export class ErrorBox extends Control {

  static styles = css`
  :host{ display: block; }

  .errorbox{
    display: block;
    padding: 0.5em;
    transition: 0.5s ease-out;
    opacity: 1;
    @starting-style{
      opacity: 0;
      transform: rotateX(-15deg);
      font-size: 0.99em!important;
    }
  }

  .away{
    opacity: 0;
    transform: rotateX(-15deg);
    font-size: 0.99em!important;
  }

  .level{
    margin: 0.25lh 0em 0.25lh 0.75em;
    display: block;
  }

  .errorbox > .level{
    margin: 0.25lh 0em 0.25lh 0em;
  }

  .num{
   display: inline-block;
   border: none;
   color: var(--s-error-fg);
   background: var(--s-error-bg);
   padding: 0.4em;
   border-radius: 0.2em;
   font-size: 0.75em;
  }

  .exception{
    display: inline;
    padding-left: 0.15em;
    color: var(--s-error-bg);
  }

  .message{
    display: inline;
    padding-left: 0.15em;
    color: var(--ink);
  }

  .unspecified{
    display: inline;
    padding-left: 0.15em;
    color: var(--s-ink);
  }

  .schema{
    display: inline;
    font-family: var(--vcl-codebox-ffamily);
    font-size: 0.75em;
    color: var(--s-warn-fg);
    background: var(--s-warn-bg);
    padding: 0.35em;
    border-radius: 4px;
    box-shadow: 0px 1px 4px #2020204E;
    opacity: 0.85;
    vertical-align: middle;
  }

  .code{
    margin: 1.5em;
    font-family: var(--vcl-codebox-ffamily);
    font-size: 0.75em;
    white-space: pre-wrap;
    word-break: break-all;
    overflow: auto;
    color: var(--vcl-codebox-fg);
    background: var(--vcl-codebox-bg);
    padding: 1.0em;
    border-radius: 0.25em;
  }

  .r1 { font-size: var(--r1-fs); border-radius: var(--r1-brad-ctl);}
  .r2 { font-size: var(--r2-fs); border-radius: var(--r2-brad-ctl);}
  .r3 { font-size: var(--r3-fs); border-radius: var(--r3-brad-ctl);}
  .r4 { font-size: var(--r4-fs); border-radius: var(--r4-brad-ctl);}
  .r5 { font-size: var(--r5-fs); border-radius: var(--r5-brad-ctl);}
  .r6 { font-size: var(--r6-fs); border-radius: var(--r6-brad-ctl);}
  `;

  static properties = {
    data:  {type: Object },
    verbosity: {type: Number}
  };

  #data;
  #dataJustSet;
  #itemNum;

  get data(){ return this.#data; }
  set data(v){
    this.#data = v;
    this.#dataJustSet = true;
    setTimeout(() => {
      this.#dataJustSet = false;
      this.requestUpdate();
    }, 350);
  }

  renderControl(){
    this.#itemNum = 0;
    let content = this.renderLevel(this.data, 0);
    return html`<div class="errorbox ${parseRank(this.rank, true)} ${this.#dataJustSet ? "away" : ""}">   ${content}   </div>`;
  }

  renderLevel(data, indent){
    if (!data) return noContent;

    if (isArray(data)){
      const content = [];
      for(const one of data){
        content.push(this.renderLevel(one, indent));
      }
      return html`<div class="level"> ${content} </div>`;
    }

    const numTag = html`<div class="num">${indent}.${this.#itemNum++}</div>`;
    const content = this.renderObject(data, indent);
    const result = html`<div class="level"> ${numTag} ${content}  </div>`;
    return result;
  }

  renderObject(data, indent){
    if (!data) return noContent;

    if (isString(data)) return html`<div class="message">${data}</div>`;

    if (data instanceof Error) return this.renderError(data, indent);

    if (CLIENT_MESSAGE_PROP in data) return html`<div class="message">${data[CLIENT_MESSAGE_PROP]}</div>`;

    if (ERROR_PROP in data) return this.renderObject(data[ERROR_PROP], indent);

    return html`<div class="unspecified"> Unspecified <div class="code">${JSON.stringify(data, null, 2)}</div> </div>`;
  }

  renderError(data, indent){

    const nm = this.verbosity > 2 ? data.name : noContent;
    const msg = dflt(data[CLIENT_MESSAGE_PROP], data.message);
    const fldTag = DATA_NAME_PROP in data ? html`<div class="schema">${data[DATA_NAME_PROP]}:</div>` : null;

    return html`
    <div class="exception">
      <strong>${data.constructor.name}</strong> ${nm} ${fldTag} &nbsp;&nbsp; ${msg}
      ${this.renderLevel(data?.cause, indent + 1)}
    </div>`;
  }

}

window.customElements.define("az-error-box", ErrorBox);
