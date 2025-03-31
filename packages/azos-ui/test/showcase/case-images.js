/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { css, html } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseImages extends CaseBase {

  static styles = [css`
.case-images{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1em;
  padding: 1em;
}
.case-images > *{
  width: 100%;
  border: 3px solid transparent;
}
.case-images .jpg{ border-color: green }
.case-images .png{ border-color: purple }
.case-images .svg{ border-color: orange }
  `];

  renderControl() {
    return html`
<h2>Images</h2>

<div class="case-images">
  ${this.renderImageSpec("jpg://azos.ico.testJpg", { cls: "the-admiral jpg", wrapImage: false }).html}
  ${this.renderImageSpec("@https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Surgeon_Vice-Admiral_Alasdair_Walker.jpg/800px-Surgeon_Vice-Admiral_Alasdair_Walker.jpg", {cls: "the-admiral jpg", wrapImage: false}).html}
  ${this.renderImageSpec("png://azos.ico.testPng", { cls: "the-admiral png", wrapImage: false }).html}
  ${this.renderImageSpec("@https://upload.wikimedia.org/wikipedia/commons/2/21/Nhonlam.png", { cls: "the-admiral png", wrapImage: false }).html}

</div>
    `;
  }
}

window.customElements.define("az-case-images", CaseImages);
