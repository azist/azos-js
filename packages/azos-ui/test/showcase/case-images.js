/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { css, html, noContent, renderImageSpec } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseImages extends CaseBase {

  static styles = [css`
.case-images{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1em;
  padding: 1em;
}
.case-images h3,
.case-images p {
  grid-column: 1 / -1;
  padding: 0;
  margin: 0;
}
figure{
  margin: 0;
  border: 1px solid transparent;
  overflow: hidden;
  box-sizing: border-box;
  overflow-wrap: break-word;
  padding: 5px;
}
figure > *{ width: 100% }
figcaption strong{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.examples{display: contents;}
.case-images .examples.jpg figure{ border-color: green }
.case-images .examples.png figure{ border-color: purple }
.case-images .examples.svg figure{ border-color: orange }
.case-images .examples.gif figure{ border-color: blue }
  `];

  renderControl() {
    return html`
<h2>Images</h2>

<div class="case-images">
  <h3>JPG Images</h3>
  <p>Rendered JPG images are shown below.</p>
  <div class="examples jpg">
    ${this.renderFigure("jpg://azos.ico.testJpg", { wrapImage: false })}
    ${this.renderFigure("@https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Surgeon_Vice-Admiral_Alasdair_Walker.jpg/800px-Surgeon_Vice-Admiral_Alasdair_Walker.jpg", { wrapImage: false })}
    ${this.renderFigure("jpg://azos.ico.testDataJpg", { wrapImage: false })}
    ${this.renderFigure("@data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAHklEQVR4nGIxnrGZgRTARJLqUQ2jGoaUBkAAAAD//8vgAaHiwRyJAAAAAElFTkSuQmCC", { wrapImage: false })}
  </div>

  <h3>PNG Images</h3>
  <p>Rendered PNG images are shown below.</p>
  <div class="examples png">
    ${this.renderFigure("png://azos.ico.testPng", { wrapImage: false })}
    ${this.renderFigure("@https://upload.wikimedia.org/wikipedia/commons/2/21/Nhonlam.png", { wrapImage: false })}
    ${this.renderFigure("png://azos.ico.testDataPng", { wrapImage: false })}
    ${this.renderFigure("@data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAHklEQVR4nGJZ/sSPgRTARJLqUQ2jGoaUBkAAAAD//+LCAfxEW7qOAAAAAElFTkSuQmCC", { wrapImage: false })}
  </div>

  <h3>GIF Images</h3>
  <p>Rendered GIF images are shown below.</p>
  <div class="examples gif">
    ${this.renderFigure("gif://azos.ico.testGif", { wrapImage: false })}
    ${this.renderFigure("@https://upload.wikimedia.org/wikipedia/commons/c/c8/132C_trans.gif", { wrapImage: false })}
    ${this.renderFigure("gif://azos.ico.testDataGif", { wrapImage: false })}
    ${this.renderFigure("@data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAHklEQVR4nGJZWfadgRTARJLqUQ2jGoaUBkAAAAD//5yAAjmnWq4+AAAAAElFTkSuQmCC", { wrapImage: false })}
  </div>

  <h3>SVG Images</h3>
  <p>Rendered SVG images are shown below.</p>
  <div class="examples svg">
    ${this.renderFigure("svg://azos.ico.testSvg", { wrapImage: false })}
    ${this.renderFigure("@https://upload.wikimedia.org/wikipedia/commons/3/35/%281%2B2%29_Dimensional_SC_lattice.svg", { wrapImage: false })}
    ${this.renderFigure("svg://azos.ico.testDataSvg", { wrapImage: false })}
    ${this.renderFigure("svg://azos.ico.testSvgUrl", { wrapImage: false })}
    ${this.renderFigure("@data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTEwIj48bWFya2VyIGlkPSJhIiBtYXJrZXJIZWlnaHQ9IjgiIG1hcmtlcldpZHRoPSI4IiByZWZYPSIzIiByZWZZPSIzIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMi45Ii8+PC9tYXJrZXI+PGcgZmlsbD0ibm9uZSIgbWFya2VyLW1pZD0idXJsKCNhKSIgc3Ryb2tlPSIjMDAwIj48ZyBzdHJva2U9IiMzNWEiPjxwYXRoIGQ9Im00MiA1NWg3NCIvPjxwYXRoIGQ9Im03OSA2NSA3NiA0MG0tMzgtNTB2MzAiIHN0cm9rZS1kYXNoYXJyYXk9IjUsMiIvPjwvZz48cGF0aCBkPSJtMTE3IDU1LTM4LTE5LTM3IDE5djMwbDM3LTQ5IDM4IDQ5bS0zOC04MHY2MGwtMzcgMjBoNzVsLTM4IDIwLTM3LTIwLTM3IDIwIiBzdHJva2UtZGFzaGFycmF5PSI1LDIiLz48cGF0aCBkPSJtMTE3IDU1LTM4IDUwLTM3LTUwbS0zNyA1MCA3NC0xMDAgNzYgMTAwaC0xNTAgMiIvPjwvZz48L3N2Zz4=", { wrapImage: false })}
  </div>

  <h3>Alternate Examples</h3>
  <p>Alt use-cases for images are shown below.</p>
  <div class="examples">
    ${this.renderFigure(null, undefined, "No Image Specified")}
    ${this.renderFigure("png://nonesistent")}
    ${this.renderFigure("No Image Registry", null, null, renderImageSpec(null, "jpg://azos.ico.testJpg", this.writeLog.bind(this)))}
  </div>
</div>
    `;
  }

  renderFigure(spec, options, optionalText, altRec = null) {
    const rec = altRec ?? this.renderImageSpec(spec, options);
    return html`
<figure>
  ${rec.html}
  <figcaption><i>Specificiation:</i> <strong>${spec}</strong>${optionalText ? html`<br>${optionalText}` : noContent}</figcaption>
</figure>
    `;
  }
}

window.customElements.define("az-case-images", CaseImages);
