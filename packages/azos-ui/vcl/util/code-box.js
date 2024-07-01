import { isOneOf } from "azos/strings";
import { AzosElement, css, html, verbatimHtml, escHtml } from "../../ui";

/** Provides code display functionality with optional syntax highlighting */
export class CodeBox extends AzosElement{

  static styles = css`
  .codebox{
    font-family: var(--ctl-codebox-ffamily);
    font-size: 1em;
    white-space: pre;
    overflow: auto;
    color: var(--ctl-codebox-fg);
    background: var(--ctl-codebox-bg);
    padding: 0.25lh 1ch;
  }

  .code-key     { color: #949494; }
  .code-string  { color: #20d4ff; }
  .code-number  { color: #70f010; }
  .code-boolean { color: #f0d090; }
  .code-null    { color: #f48080; }
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
    if (isOneOf(this.highlight, ["js", "json"])){
      const hs = this.hiJson(src);
      return html` <div class="codebox"> ${verbatimHtml(hs)} </div>`;
    }
   return html`<div class="codebox"> ${src} </div>`;
  }

}

window.customElements.define("az-code-box", CodeBox);
