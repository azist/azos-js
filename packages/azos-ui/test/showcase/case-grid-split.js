/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, css } from "../../ui";
import { CaseBase } from "./case-base";

import STL_CARD from "../../styles/card.js";
import "../../parts/grid-split";

export class CaseGridSplit extends CaseBase {

  static styles = [STL_CARD];

  #buildAssortedSplitConfigs(){
    return [
      { id: "6:6", splitLeftCols: 6, splitRightCols: 6, msg: "This is a 6:6 split layout." },
      { id: "9:3", splitLeftCols: 9, splitRightCols: 3, msg: "This is a 9:3 split layout." },
      { id: "12:0", splitLeftCols: 12, splitRightCols: 0, msg: "This is an invalid 12:0 split layout. Fallbacks back to 3:9" },
      { id: "0:12", splitLeftCols: 0, splitRightCols: 12, msg: "This is an invalid 0:12 split layout. Fallbacks back to 3:9" },

      { id: "1:3", splitLeftCols: 1, splitRightCols: 3, msg: "This is a 1:3 split layout." },
      { id: "2:2", splitLeftCols: 2, splitRightCols: 2, msg: "This is a 2:2 split layout." },
      { id: "3:1", splitLeftCols: 3, splitRightCols: 1, msg: "This is a 3:1 split layout." },
      { id: "1:1", splitLeftCols: 1, splitRightCols: 1, msg: "This is a 1:1 split layout." },
    ];
  }

  renderControl() {
    return html`
      <h2>Grid Split</h2>
      <p>
        This example demonstrates a resizable grid layout with two columns. The left column can contain content in the "left-top" slot, and the right column can contain content in the "right-bottom" slot.
        The number of columns on the left and right can be configured using the <code>splitLeftCols</code> and <code>splitRightCols</code> properties.
      </p>
      <p> The splitter can be dragged to adjust the width of the left and right columns. The left column is set to 3 columns, and the right column is set to 9 columns by default.</p>
      <h3>3:9 Split</h3>

      <az-grid-split scope="this" splitLeftCols="3" splitRightCols="9">
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


      <h3>Assorted Split Configurations</h3>
      ${this.#buildAssortedSplitConfigs().map(config => html`
        <h3>${config.id} Split</h3>
        <p>${config.msg}</p>
        <az-grid-split style="--grid-splitter-col-border: 1px dashed rgba(0, 145, 255, 0.5);" scope="this" splitLeftCols="${config.splitLeftCols}" splitRightCols="${config.splitRightCols}">
          <div slot="left-top"><div class="card">Left Top Content</div></div>
          <div slot="right-bottom"><div class="card">Right Bottom Content</div></div>
        </az-grid-split>
      `)}
    `;
  }
}

window.customElements.define("az-case-grid-split", CaseGridSplit);
