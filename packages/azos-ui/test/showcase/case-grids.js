/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/
import { STL_CARD, STL_INLINE_GRID } from "../../styles";
import { html } from "../../ui.js";
import { CaseBase } from "./case-base.js";

export class CaseGrids extends CaseBase {

  static styles = [...this.styles, STL_INLINE_GRID, STL_CARD];
  renderControl() {
    return html`
    <h2>Grids</h2>

    <h3>Basic 1-Column Grid</h3>
    <div class="row cols1">
      <div class="card">Item 1</div>
      <div class="card">Item 2</div>
      <div class="card">Item 3</div>
    </div>

    <h3>2-Column Grid</h3>
    <div class="row cols2">
      <div class="card">Item 1</div>
      <div class="card">Item 2</div>
      <div class="card">Item 3</div>
      <div class="card">Item 4</div>
    </div>

    <h3>3-Column Grid</h3>
    <div class="row cols3">
      <div class="card">Item 1</div>
      <div class="card">Item 2</div>
      <div class="card">Item 3</div>
      <div class="card">Item 4</div>
      <div class="card">Item 5</div>
      <div class="card">Item 6</div>
    </div>

    <h3>4-Column Grid</h3>
    <div class="row cols4">
      <div class="card">Item 1</div>
      <div class="card">Item 2</div>
      <div class="card">Item 3</div>
      <div class="card">Item 4</div>
      <div class="card">Item 5</div>
      <div class="card">Item 6</div>
      <div class="card">Item 7</div>
      <div class="card">Item 8</div>
    </div>

    <h3>Grid with Spanning Items</h3>
    <div class="row cols4">
      <div class="card span2">Span 2 columns</div>
      <div class="card">Normal item</div>
      <div class="card">Normal item</div>
      <div class="card span3">Span 3 columns</div>
      <div class="card">Normal item</div>
      <div class="card span4">Span all 4 columns</div>
    </div>

    <h3>Grid with Spanning Items NOM (No Media Query/As-is/Unresponsive)</h3>
    <div class="row cols4 nom">
      <div class="card span2">Span 2 columns</div>
      <div class="card">Normal item</div>
      <div class="card">Normal item</div>
      <div class="card span3">Span 3 columns</div>
      <div class="card">Normal item</div>
      <div class="card span4">Span all 4 columns</div>
    </div>

    <h3>Form-like Layout</h3>
    <div class="row cols2">
      <az-text title="First Name"></az-text>
      <az-text title="Last Name"></az-text>
      <az-text class="span2" title="Address"></az-text>
      <az-text title="City"></az-text>
      <az-text title="State/Province"></az-text>
    </div>
    `;
  }
}

window.customElements.define("az-case-grids", CaseGrids);
