/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Control, css, html, parseRank, noContent } from "../../ui";
import { CLIENT_MESSAGE_PROP, ERROR_PROP, isArray, isString } from "azos/types";

/** Provides error/exception display functionality with optional details */
export class ErrorBox extends Control {

  static styles = css`
  :host{ display: block; }

  .r1 { font-size: var(--r1-fs); border-radius: var(--r1-brad-ctl);}
  .r2 { font-size: var(--r2-fs); border-radius: var(--r2-brad-ctl);}
  .r3 { font-size: var(--r3-fs); border-radius: var(--r3-brad-ctl);}
  .r4 { font-size: var(--r4-fs); border-radius: var(--r4-brad-ctl);}
  .r5 { font-size: var(--r5-fs); border-radius: var(--r5-brad-ctl);}
  .r6 { font-size: var(--r6-fs); border-radius: var(--r6-brad-ctl);}

  .errorbox{
    display: block;
    padding: 0.5em;
  }

  .level{
    margin: 0.5lh 0em 0.5lh 0em;
    display: block;
    padding: 0.25em;
  }

  .num{
   display: inline-block;
   border: none;
   color: var(--s-error-fg);
   background: var(--s-error-bg);
   padding: 0.4em;
   border-radius: 0.2em;
  }

  .exception{
    display: inline;
    padding-left: 0.5em;
    color: var(--s-error-bg);
  }

  .message{
    display: inline;
    padding-left: 0.5em;
    color: var(--s-error-bg);
  }

  .unspecified{
    display: inline;
    padding-left: 0.5em;
    color: var(--s-alert-bg);
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
  `;

  static properties = {
    data:  {type: Object}
  };

  renderControl(){
    let content = this.renderLevel(this.data, 0);
    return html`<div class="errorbox ${parseRank(this.rank, true)}">   ${content}   </div>`;
  }

  renderLevel(data, indent, num = 1){
    if (!data) return noContent;

    let content;
    if (isArray(data)){
      content = [];
      for(const one of data){
        content.push(this.renderLevel(one, indent + 1, num++));
      }
    } else {
      content = this.renderObject(data, indent + 1);
    }

    const numTag = indent > 1 ? html`<div class="num">${num}</div>` : noContent;

    return html`<div class="level" style="padding-left: ${2 * indent}px"> ${numTag} ${content}  </div>`;
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
    return html`
    <div class="exception">
      Error: ${data.name} ${data.message}
      ${this.renderLevel(data?.cause, indent+1, 0)}
    </div>`;
  }

}

window.customElements.define("az-error-box", ErrorBox);
