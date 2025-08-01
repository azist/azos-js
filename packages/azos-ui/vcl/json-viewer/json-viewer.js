/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Control, html, css } from "../../ui";
import * as aver from "../../../azos/aver"
import { Block } from "../../../azos-ui/blocks"
import { isNonEmptyString, isObjectOrArray } from "azos/types";
import "../../../azos-ui/bit"

export class JsonViewer extends Block {


  connectedCallback() {
    super.connectedCallback();
    console.log("JsonViewer::connectedCallback", this.source, this.path, this.componentRegistry);
    // get all data nodes. 
    // By default well use the DATA_VALUE_PROR. 
    // This will allow us to simply build a nested az-text|select|etc... structure
    //   this will allow us to reuse the existing validation functionality/feedback
    //   though it does mean we'll need ensure that we customize the resulting view such that the inline editing is possible
    //   maybe I should just use the itsy-bit for an object
    //   an itsy-bit would be a bit that is very bare, made to mimic a simple property viewer/inline-editor in an ide or professional design software
  }

  renderControl(){
    console.log("JsonViewer::renderControl", this.source, this.path, this.componentRegistry) 
    if(!this.source) return;

    aver.isObjectOrArray(this.source, "source obj|arr");
    aver.isStringOrNull(this.path, "path str|null");

    // parse string into json
    return this.renderNode(this.source ?? [], this.path);    
  }

  getComponentForPath(path, source) {
    const exactMatch =  isNonEmptyString(path) ? this.componentRegistry[path] : null;
    if (isNonEmptyString(exactMatch)) return exactMatch;

    if (isObjectOrArray(source)) return 'az-json-branch';
    return 'az-json-leaf';
  }

  renderNode(source, currentPath) {
    // const componentClass = this.getComponentForPath(currentPath, source);
    // const src = source ?? {};
    // const pth = currentPath ?? "";
    // const renderer = () => this.renderNode();
    
    // console.log("JsonViewer::renderNode", { componentClass, src, pth, renderer });

    // return html`<${componentClass} .data=${src} .path=${pth} .renderNode=${renderer} scope="this"></${componentClass}>`;
    if(isObjectOrArray) {
      return html`<az-bit scope="this" title="${path ?? "<root>"}"></az-bit>`;
    }
  }

}

window.customElements.define("az-json-viewer", JsonViewer);

// ----------------------------------

export class JsonLeaf extends Block {
  static properties = {
    data: { type: Object },
    path: { type: String },
  };

  static styles = [ Block.styles,  css`
    :host { display: block; padding-left: 16px; color: #00bcd4; }
  `];

  connectedCallback() {
    super.connectedCallback();
    console.log("JsonLeaf::connectedCallback", this.data, this.path, this.componentRegistry);
  }

  renderControl() {
    console.log("JsonLeaf::renderControl", this.data, this.path, this.componentRegistry) 
    return html`<div><strong>${this?.path?.split('.').pop()}:</strong> ${this.data}</div>`;
  }
}

window.customElements.define('az-json-leaf', JsonLeaf);

// -----------------------------------

export class JsonBranch extends Control {
  static properties = {
    data: { type: Object },
    path: { type: String },
    renderNode: { type: Function },
    expanded: { type: Boolean },
  };

  connectedCallback(){
    this.expanded = true;
    console.log("JsonBranch::connectedCallback", this.data, this.path, this.expanded, this.renderNode);
  }

  static styles = [ Block.styles, css`
    :host { display: block; padding-left: 16px; }
    .toggle { cursor: pointer; color: #ffc107; user-select: none; }
    .children { margin-left: 8px; }
  `];

  toggleExpand() {
    this.expanded = !this.expanded;
    console.log("JsonBranch::toggleExpand", this.data, this.path, this.expanded, ) 
  }

  renderControl() {
    console.log("JsonBranch::renderControl", this.data, this.path, this.expanded, ) 

    const keys = Array.isArray(this.data) ? this.data.map((_, idx) => idx) : Object.keys(this.data);
    const label = Array.isArray(this.data) ? 'Array' : 'Object';

    return html`
      <div @click=${this.toggleExpand} class="toggle">
        ${this.expanded ? '▾' : '▸'} ${label} [${keys.length}]
      </div>
      ${this.expanded ? html`
        <div class="children">
          ${keys.map(key => {
            const childPath = this.path ? `${this.path}.${key}` : `${key}`;
            return this.renderNode(this.data[key], childPath);
          })}
        </div>` : ''}
    `;
  }
}

window.customElements.define('az-json-branch', JsonBranch);