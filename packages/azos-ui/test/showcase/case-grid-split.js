/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, css } from "../../ui";
import { CaseBase } from "./case-base";

import STL_CARD from "../../styles/card.js";
import "../../parts/grid-split";
import STL_INLINE_GRID from "../../styles/grid.js";

export class CaseGridSplit extends CaseBase {

  static styles = [ this.styles, STL_INLINE_GRID, STL_CARD];

  #validConfigs = [
    { id: "6:6", splitLeftCols: 6, splitRightCols: 6},
    { id: "9:3", splitLeftCols: 9, splitRightCols: 3},
    { id: "1:3", splitLeftCols: 1, splitRightCols: 3},
    { id: "2:2", splitLeftCols: 2, splitRightCols: 2},
    { id: "3:1", splitLeftCols: 3, splitRightCols: 1}];

  #invalidConfigs = [
    { id: "12:0", splitLeftCols: 12, splitRightCols: 0, msg: "This is an invalid 12:0 split layout. Fallbacks back to 3:9" },
    { id: "0:12", splitLeftCols: 0, splitRightCols: 12, msg: "This is an invalid 0:12 split layout. Fallbacks back to 3:9" },
    { id: "1:1", splitLeftCols: 1, splitRightCols: 1, msg: "This is an invalid 1:1 split layout. Fallbacks back to 3:9" }];


  #buildSplitConfigs(configs){
    return configs.map(config => html`
      <h3>${config.id} Split</h3>
      ${config.msg ? html`<p>${config.msg}</p>`: ""}
      <az-grid-split style="--grid-splitter-col-border: 1px dashed rgba(0, 145, 255, 0.5);" scope="this" splitLeftCols="${config.splitLeftCols}" splitRightCols="${config.splitRightCols}">
        <div slot="left-top"><div class="card">Left Top Content</div></div>
        <div slot="right-bottom"><div class="card">Right Bottom Content</div></div>
      </az-grid-split>
    `);
  }


  renderControl() {
    return html`
      <h2>Grid Split</h2>
      <p>
        This example demonstrates a resizable grid layout with two columns. The left column can contain content in the "left-top" slot, and the right column can contain content in the "right-bottom" slot.
        The number of columns on the left and right can be configured using the <code>splitLeftCols</code> and <code>splitRightCols</code> properties.
      </p>
      <p> The splitter can be dragged to adjust the width of the left and right columns. The left column is set to 3 columns, and the right column is set to 9 columns by default.</p>

      <code><pre>
&lt;az-grid-split scope="this" splitLeftCols="3" splitRightCols="9"&gt;
  &lt;div slot="left-top"&gt;
    &lt;div class="card"&gt;Left Top Content&lt;/div&gt;
  &lt;/div&gt;
  &lt;div slot="right-bottom"&gt;
    &lt;div class="card"&gt;Right Bottom Content&lt;/div&gt;
  &lt;/div&gt;
&lt;/az-grid-split&gt;
      </pre></code>

      <h3>3:9 Split</h3>
      <az-grid-split scope="this" splitLeftCols="3" splitRightCols="3">
        <div slot="left-top"><div class="card">Left Top Content</div></div>
        <div slot="right-bottom"><div class="card">Right Bottom Content</div></div>
      </az-grid-split>

      <h3>Nested Split Grid</h3>
      <p>
        This example shows a nested grid split layout. The outer grid has a 3:9 split, and the inner grid has a 3:3 split.
        The left column of the outer grid contains a nested grid split layout.
      </p>

      <az-grid-split scope="this" splitLeftCols="3" splitRightCols="9">
        <div slot="left-top"><div class="card">Outer Left Top Content</div></div>
        <div slot="right-bottom">
          <az-grid-split scope="this" splitLeftCols="3" splitRightCols="3">
            <div slot="left-top"><div class="card">Inner Left Top Content</div></div>
            <div slot="right-bottom"><div class="card">Inner Right Bottom Content</div></div>
          </az-grid-split>
        </div>
      </az-grid-split>


      <h3>Valid Split Configuration Examples</h3>
      <p>
        The following examples demonstrate various split configurations with different left and right column ratios.
        The left and right columns can be resized by dragging the splitter.
      </p>
      ${this.#buildSplitConfigs(this.#validConfigs)}


      <h3 status="error">Invalid Split Configurations</h3>
      <p>
        The following examples demonstrate invalid split configurations that do not meet the minimum requirements.
        These configurations will fallback to a default 3:9 split layout.
      </p>
      ${this.#buildSplitConfigs(this.#invalidConfigs)}
    `;
  }
}

window.customElements.define("az-case-grid-split", CaseGridSplit);
