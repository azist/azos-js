import { isOneOf } from "azos/strings";
import { AzosElement, css, html, verbatimHtml, escHtml, parseRank, parseStatus } from "../../ui";

/** Provides code display functionality with optional syntax highlighting */
export class CodeBox extends AzosElement{

  static styles = css`
  .r1 { font-size: var(--r1-fs); }
  .r2 { font-size: var(--r2-fs); }
  .r3 { font-size: var(--r3-fs); }
  .r4 { font-size: var(--r4-fs); }
  .r5 { font-size: var(--r5-fs); }
  .r6 { font-size: var(--r6-fs); }

  .codebox{
    font-family: var(--vcl-codebox-ffamily);
    white-space: pre;
    overflow: auto;
    color: var(--vcl-codebox-fg);
    background: var(--vcl-codebox-bg);
    padding: 0.25lh 1ch;
  }

  .code-key     { color: var(--vcl-codebox-hi-key); }
  .code-string  { color: var(--vcl-codebox-hi-string); }
  .code-number  { color: var(--vcl-codebox-hi-number); }
  .code-boolean { color: var(--vcl-codebox-hi-boolean); }
  .code-null    { color: var(--vcl-codebox-hi-null); }
  `;

  static properties = {
    source:     {type: String},
    highlight:  {type: String}
  };

  constructor(){
    super();
  }

  hiJson(json) {
    if (!json) return "";
    json = escHtml(json);
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
            cls = 'key';
        } else {
            cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span class="code-${cls}">${match}</span>`;
    });
  }

  render(){
    const src = this.source ? this.source : this.innerHTML;
    let cls = `codebox ${parseRank(this.rank, true)} ${parseStatus(this.status, true)}`;

    if (isOneOf(this.highlight, ["js", "json"])){
      const hs = this.hiJson(src);
      return html` <div class="${cls}" .disabled=${this.isDisabled}> ${verbatimHtml(hs)} </div>`;
    }
   return html`<div class="${cls}" .disabled=${this.isDisabled}> ${src} </div>`;
  }

}

window.customElements.define("az-code-box", CodeBox);
