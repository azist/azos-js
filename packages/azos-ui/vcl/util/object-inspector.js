/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { describeTypeOf, isArray, isAssigned, isNonEmptyString, isObject, isObjectOrArray } from "azos/types";
import { TreeView } from "../tree-view/tree-view";
import { css, html, noContent, parseRank, parseStatus } from "../../ui";

export class ObjectInspector extends TreeView {
  static properties = {
    source: { type: Object | Array },
  }

  static styles = [TreeView.styles, css`
.treeView{
  font-family: var(--vcl-codebox-ffamily);
  word-break: break-all;
  overflow: auto;
  color: var(--vcl-codebox-fg);
  background: var(--vcl-codebox-bg);
  min-height: inherit;
  max-height: inherit;
  padding: 0.6em;
  margin: 0;
}
ol{
  max-width:100%;
  width: 720px;
}
.treeNodeHeader{ align-items: center }
.treeNodeHeader:hover{ background: none }
.treeNodeHeader:focus{
  filter: hue-rotate(90deg);
  background: #f0f0f010;
}
.key{ padding: 0 0.75em }
.key::after{ content: ":" }
.value .preview{
  display: inline-block;
  max-width: 50ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.value-key     { color: var(--vcl-codebox-hi-key); }
.value-string  { color: var(--vcl-codebox-hi-string); } .value-string:hover{  color: var(--vcl-codebox-hi-string-hover); transition: 0.5s; }
.value-number  { color: var(--vcl-codebox-hi-number); }
.value-boolean { color: var(--vcl-codebox-hi-boolean); }
.value-null    { color: var(--vcl-codebox-hi-null); }
.value-array   { color: #aaaaaa; }
.value-object  { color: #aaaaaa; }
.icon.fas.chevron{
  stroke: var(--vcl-codebox-hi-key);
  fill: var(--vcl-codebox-hi-key);
  stroke-width: 4ch;
}
  `];

  #source = null;
  get source() { return this.#source; }
  set source(source) {
    this.#source = source;
    this.convertObjToTree();
    this.requestUpdate();
  }

  constructor(source) {
    super();
    this.source = source;
  }

  convertObjToTree() {
    if (!this.source) return;
    this.#populateTree(this.source);
  }

  #populateTree(source) {
    this.root.removeAllChildren();
    createChild(null, source, this.root);
    this.requestUpdate();

    function createChild(key, value, parent) {
      // console.log(...arguments, describeTypeOf(value));
      let node;
      if (key === null) node = parent;
      else {
        const objectOrArray = isObjectOrArray(value);
        const options = {
          canOpen: objectOrArray ? true : false,
          icon: null, // {open: svg://azos.ico.folder-open, close: svg://azos.ico.folder-close}
          showPath: false,
          data: {
            key,
            value,
            parent,
          },
        };
        node = parent.addChild(null, options);
      }

      if (isArray(value))
        value.forEach((item, idx) => createChild(idx, item, node));
      else if (isObject(value))
        Object.entries(value).forEach(([k, v]) => createChild(k, v, node));

      return node;
    }
  }

  printJsonCustom(obj) {
    return '{ ' + Object.entries(obj).map(([key, value]) => {
      if (isArray(value)) return `${key}: [${value.length}]`;
      if (typeof value === 'object' && value !== null) return `${key}: {...}`;
      return `${key}: ${JSON.stringify(value)}`;
    }).join(', ') + ' }';
  }

  renderTitle() {
    return isAssigned(this.title) ? html`<span class="title">${this.title}</span>` : noContent;
  }

  renderControl() {
    if (!this.root) return html`${this.renderTitle()}<div>Nothing to display.</div>`;

    const elmId = `tv${this.sid}`;
    const cls = [
      parseRank(this.rank, true),
      parseStatus(this.status, true)
    ].filter(isNonEmptyString).join(" ");

    return html`
${this.renderTitle()}
<ol id="${elmId}" scope="this" part="tree" role="tree" class="treeView ${cls}" tabIndex=0 @keydown="${this._onKeyDown}" @focus="${this._onTreeFocus}">
  ${this.showRoot
        ? this.renderNode(this.root)
        : this.root.children.map(child => this.renderNode(child))}
</ol>`;
  }

  renderNode(node) {
    const _isArray = isArray(node.data.value);
    const _isObject = isObject(node.data.value);
    const cls = [
      _isArray && "array",
      _isObject && "object",
    ].filter(isNonEmptyString).join(" ");

    return html`
<li role="treeitem" class="treeNode ${cls}">
  ${this.renderHeader(node)}
  ${this.renderChildren(node)}
</li>
    `;
  }

  renderHeaderContent(node) {
    const data = node.data;
    const valueType = describeTypeOf(data.value);

    let value;
    switch (valueType) {
      case "object":
        if (node.isOpened) value = "{...}";
        else {
          value = !this.showValuesWhileClosed ? html`<span class="preview">${this.printJsonCustom(data.value)}</span>` : '';
        }
        break;
      case "array":
        value = html`[${data.value.length}]`;
        break;
      case "string":
        value = `"${data.value}"`;
        break;
      default:
        value = data.value;
        break;
    }
    return html`
<span class="key value-key">${data.key}</span>
<span class="value value-${valueType}">${value}</span>

    `;
  }

  renderChildren(node) {
    if (node.isOpened && node.children.length) {
      return html`
      <ol role="group" class="treeNodeChildren">
        ${node.children.map(child => this.renderNode(child))}
      </ol>
      `
    } else return '';
  }

}

customElements.define("az-object-inspector", ObjectInspector);
