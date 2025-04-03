/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/
import { STL_PROSE } from "../../styles";
import { html } from "../../ui";
import { CaseBase } from "./case-base";
import '../../parts/check-field.js';

export class CaseProse extends CaseBase {
  static styles = [...this.styles, STL_PROSE];
  
  renderControl() {
    return html`
    <h2>Prose</h2>

    <div class="prose">
      <div class="category">
        <h4>Introduction</h4>
        <p>This is an example of prose content styled using the <code>.prose</code></p>
      </div>

      <div class="category">
        <h4>List Example</h4>
        <ul>
          <li>First item</li>
          <li>Second item</li>
          <li>Third item</li>
        </ul>
      </div>

      <div class="category">
        <h4>Definition List</h4>
        <dl>
          <dt>Term 1</dt>
          <dd>Definition for term 1</dd>
          <dt>Term 2</dt>
          <dd>Definition for term 2</dd>
        </dl>
      </div>

      <div class="category">
        <h4>Tip Section</h4>
        <div class="tip">
          This is a helpful tip styled with the <code>.tip</code> class.
        </div>
      </div>

      <div class="category">
        <h4>Code Example</h4>
        <div class="example">
          <code>const example = "This is a code example";</code>
        </div>
      </div>

      <hr />

      <div class="category">
        <h1>Header 1</h1>
        <h2>Header 2</h2>
        <h3>Header 3</h3>
        <h4>Header 4</h4>
        <h5>Header 5</h5>
        <h6>Header 6</h6>
      </div>

    </div>
    `;
  }
}

window.customElements.define("az-case-prose", CaseProse);
