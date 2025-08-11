/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

import STL_CARD from "../../styles/card";
import "../../parts/grid-split";
import STL_INLINE_GRID from "../../styles/grid";
import "../../vcl/util/sticky-container";

export class CaseStickyContainer extends CaseBase {

  static styles = [ this.styles, STL_INLINE_GRID, STL_CARD];

  renderControl() {
    return html`
      <h3>Sticky Container in Grid Split</h3>
      <az-grid-split scope="this" splitLeftCols="1" splitRightCols="3">
        <div slot="left-top">
          <az-sticky-container top="60" minWidth="600">
            <div class="card">Left Top Content</div>
          </az-sticky-container>
        </div>
        <div slot="right-bottom">
          <div class="card">Tall Right Bottom Content</div>
          <div style="height: 200vh; overflow: auto;"></div>
        </div>
      </az-grid-split>
    `;
  }
}

window.customElements.define("az-case-sticky-container", CaseStickyContainer);
