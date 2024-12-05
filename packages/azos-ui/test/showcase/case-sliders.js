/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseSliders extends CaseBase {

  renderControl() {
    return html`
<h2>Sliders</h2>
<p>This az-slider renders as an &lt;input type="range"&gt; element. These are the available properties/attributes:</p>
<ol>
  <li>General attributes: id, title, titlePosition, titleWidth, inputWidth rank, status, isDisabled, isRequired</li>
  <li>rangeMin, rangeMax - slider's extremes</li>
  <li>rangeStep - Interval that controls the slider's granularity. Default is 1.</li>
  <li>value - if not defined, defaults to median of rangeMin & rangeMax</li>
  <li>valueLabel - value's description</li>
  <li>displayValue - Boolean treated as "isDisabled," "isRequired," or "isReadonly". Displays valueLabel followed by value.</li>
  <li>orientation - determines if slider is horizontal or vertical</li>
  <li>numTicks - Number of evenly-spaced tick marks displayed on the slider</li>
</ol>
<br>
<az-slider id="basicSlider" title="Basic Slider" rangeMin="0" rangeMax="10" rangeStep="1" numTicks="5" status="alert" displayValue valueLabel="Number of tomatoes: "></az-slider>
    `;
  }
}

window.customElements.define("az-case-sliders", CaseSliders);
