import { AzosElement, html } from "../ui.js";
import "../parts/button.js";
import "../parts/check-field.js";
import "../parts/radio-group-field.js";
import "../parts/text-field.js";
import "../parts/select-field.js";
import "../parts/slider-field.js";
import "../vcl/util/code-box.js";

/** Test element used as a showcase of various parts and form elements in action */
export class DefineParts extends AzosElement{
  constructor(){ super(); }

  render(){
    return html`

<h1>Azos Parts Definitions</h1>

<h2>Button</h2>

<az-button title="Button 1"></az-button>

<az-code-box highlight="html">
  <az-button title="Button 1"></az-button>
</az-code-box>

<p>Properties / Attributes:</p>
<ul>
  <li>ID - Unique identifier for data collecting and proper UI.</li>
  <li>isDisabled - If listed, disables the part, removing all interactivity.</li>
  <li>Rank - (1 | 2 | 3 | 4 | 5) Determines part's size. <strong>Default: 3</strong></li>
  <li>Status - (ok | info | warning | alert | error) If defined, determines part's color-coded status.</li>
  <li>Title - Part's label</li>
</ul>

<hr>

<h2>Radio Group</h2>

<az-radio-group id="baseGroup" title="Group of radios (choose only 1)">
  <az-radio-option>Option 1</az-radio-option>
  <az-radio-option>Second Choice</az-radio-option>
  <az-radio-option>Choice number 3</az-radio-option>
</az-radio-group>

<az-code-box highlight="html">
  <az-radio-group id="baseGroup" title="Group of radios (choose only 1)">
    <az-radio-option>Option 1</az-radio-option>
    <az-radio-option>Second Choice</az-radio-option>
    <az-radio-option>Choice number 3</az-radio-option>
  </az-radio-group>
</az-code-box>

<p>Properties / Attributes - NOTE: These can only be applied to &lt;az-radio-group&gt;, NOT the individual &lt;az-radio-option&gt;</p>
<ul>
  <li>ID - Unique identifier for data collecting and proper UI.</li>
  <li>isDisabled - If listed, disables the part, removing all interactivity.</li>
  <li>isRequired - For validation purposes. If listed, a choice must be made before the form can be submitted.</li>
  <li>itemType - (radio | switch) Determines if group utilizes radio buttons or switches. Default: radio.</li>
  <li>Rank - (1 | 2 | 3 | 4 | 5) Determines part's size. <strong>Default: 3</strong></li>
  <li>Status - (ok | info | warning | alert | error) If defined, determines part's color-coded status.</li>
  <li>Title - Part's label</li>
  <li>titlePosition - (top-left | top-center | top-right | mid-left | mid-right | bottom-left | bottom-center | bottom-right) Determines the title's position in relation to the input element. Applies uniformly to all &lt;az-radio-option&gt;. Default: mid-right.</li>
  <li>titleWidth - If titlePosition is mid-left or mid-right, uniformly determines the width of the title for each choice.</li>
</ul>

<hr>

<h2>Checkbox</h2>

<az-checkbox id="normalCheckbox" title="This is a checkbox" titlePosition="mid-left"></az-checkbox>

<az-code-box highlight="html">
  <az-checkbox id="normalCheckbox" title="This is a checkbox" titlePosition="mid-left"></az-checkbox>
</az-code-box>

<p>Properties / Attributes:</p>
<ul>
  <li>ID - Unique identifier for data collecting and proper UI.</li>
  <li>isDisabled - If listed, disables the part, removing all interactivity.</li>
  <li>isRequired - For validation purposes. If listed, this part must be checked before the form can be submitted.</li>
  <li>itemType - (check | switch) Determines if part utilizes a checkbox or switch. Default: check.</li>
  <li>Rank - (1 | 2 | 3 | 4 | 5) Determines part's size. <strong>Default: 3</strong></li>
  <li>Status - (ok | info | warning | alert | error) If defined, determines part's color-coded status.</li>
  <li>Title - Part's label</li>
  <li>titlePosition - (top-left | top-center | top-right | mid-left | mid-right | bottom-left | bottom-center | bottom-right) Determines the title's position in relation to the input element. Applies uniformly to all &lt;az-radio-option&gt;. Default: top-left.</li>
  <li>titleWidth - If titlePosition is mid-left or mid-right, determines the width of the title.</li>
</ul>

<hr>

<h2>Text Input</h2>

<az-text-input id="basicTextInput" title="Basic text input" placeholder="Type something here&hellip;"></az-text-input>

<az-code-box highlight="html">
  <az-text-input id="basicTextInput" title="Basic text input" placeholder="Type something here&hellip;"></az-text-input>
</az-code-box>

<p>Properties / Attributes:</p>
<ul>
  <li>Height - If itemType is long, defines how tall a textarea is in rows. Default: 4.</li>
  <li>ID - Unique identifier for data collecting and proper UI.</li>
  <li>isDisabled - If listed, disables the part, removing all interactivity.</li>
  <li>isReadonly - If listed, disables the part while allowing the user to highlight it's value.</li>
  <li>isRequired - For validation purposes. If listed, this part must have a value before the form can be submitted.</li>
  <li>itemType - (text | pass | long) Determines if part is a single-line text input, password field, or a multi-line text input. Default: text.</li>
  <li>maxChar - If defined, defines the maximum limit of allowed characters.</li>
  <li>minChar - For validation purposes. If defined, defines the minimum limit of allowed characters.</li>
  <li>Placeholder - If defined, provides semi-transparent text within the input field.</li>
  <li>Rank - (1 | 2 | 3 | 4 | 5) Determines part's size. <strong>Default: 3</strong></li>
  <li>Status - (ok | info | warning | alert | error) If defined, determines part's color-coded status.</li>
  <li>Title - Part's label</li>
  <li>titlePosition - (top-left | top-center | top-right | mid-left | mid-right | bottom-left | bottom-center | bottom-right) Determines the title's position in relation to the input element. Applies uniformly to all &lt;az-radio-option&gt;. Default: top-left.</li>
  <li>titleWidth - If titlePosition is mid-left or mid-right, determines the width of the title.</li>
  <li>Value - Part's default/starting value.</li>
</ul>

<hr>

<h2>Select</h2>

<az-select id="defaultSelect" title="Select one of the following from the dropdown">
  <az-select-option>Select an option&hellip;</az-select-option>
  <az-select-option value="valueOne">Selected first value</az-select-option>
  <az-select-option value="secondValue">Select second option</az-select-option>
  <az-select-option value="thirdOption">This is an option</az-select-option>
  <az-select-option value="opt4">Option #4</az-select-option>
  <az-select-option value="fifthValue">OPTION FIVE</az-select-option>
  <az-select-option value="value6">Yet another option</az-select-option>
  <az-select-option value="numberSeven">Are you losing count yet?</az-select-option>
  <az-select-option value="eighthOption">Maybe chose this one</az-select-option>
  <az-select-option value="optionNine">Almost done</az-select-option>
  <az-select-option value="finalValue">Last test option</az-select-option>
</az-select>

<az-code-box highlight="html">
  <az-select id="defaultSelect" title="Select one of the following from the dropdown">
    <az-select-option>Select an option&hellip;</az-select-option>
    <az-select-option value="valueOne">Selected first value</az-select-option>
    <az-select-option value="secondValue">Select second option</az-select-option>
    <az-select-option value="thirdOption">This is an option</az-select-option>
    <az-select-option value="opt4">Option #4</az-select-option>
    <az-select-option value="fifthValue">OPTION FIVE</az-select-option>
    <az-select-option value="value6">Yet another option</az-select-option>
    <az-select-option value="numberSeven">Are you losing count yet?</az-select-option>
    <az-select-option value="eighthOption">Maybe chose this one</az-select-option>
    <az-select-option value="optionNine">Almost done</az-select-option>
    <az-select-option value="finalValue">Last test option</az-select-option>
  </az-select>
</az-code-box>

<p>Properties / Attributes:</p>
<ul>
  <li>ID - Unique identifier for data collecting and proper UI.</li>
  <li>isDisabled - If listed, disables the part, removing all interactivity.</li>
  <li>isMultiple - If listed, allows user to select multiple options. <strong>Not recommended for mobile use.</strong></li>
  <li>isReadonly - If listed, disables the part while allowing the user to highlight it's value.</li>
  <li>isRequired - For validation purposes. If listed, this part must have a value selected before the form can be submitted.</li>
  <li>Rank - (1 | 2 | 3 | 4 | 5) Determines part's size. <strong>Default: 3</strong></li>
  <li>Status - (ok | info | warning | alert | error) If defined, determines part's color-coded status.</li>
  <li>Title - Part's label</li>
  <li>titlePosition - (top-left | top-center | top-right | mid-left | mid-right | bottom-left | bottom-center | bottom-right) Determines the title's position in relation to the input element. Applies uniformly to all &lt;az-radio-option&gt;. Default: top-left.</li>
  <li>titleWidth - If titlePosition is mid-left or mid-right, determines the width of the title.</li>
  <li>Value - Part's default/starting value - must match the value of an &lt;az-select-option&gt;.</li>
</ul>

<hr>

<h2>Slider</h2>

<az-slider id="markedSlider" title="Slider with tick marks" titlePosition="top-left" orientation="horizontal" rangeMin="0" rangeMax="10" numTicks="5" displayValue valueLabel="Number of tomatoes: "></az-slider>

<az-code-box highlight="html">
  <az-slider id="markedSlider" title="Slider with tick marks" titlePosition="top-left" orientation="horizontal" rangeMin="0" rangeMax="10" numTicks="5" displayValue valueLabel="Number of tomatoes: "></az-slider>
</az-code-box>

<p>Properties / Attributes:</p>
<ul>
  <li>displayValue - If listed, displays the current numerical value of the slider.</li>
  <li>ID - Unique identifier for data collecting and proper UI.</li>
  <li>isDisabled - If listed, disables the part, removing all interactivity.</li>
  <li>isRequired - For validation purposes. If listed, this part must have a value selected before the form can be submitted.</li>
  <li>numTicks - Number of evenly-spaced tick marks displayed on the slider.</li>
  <li>orientation - (horizontal | vertical) Determines slider's orientation</li>
  <li>rangeMax - Slider's maximum boundary.</li>
  <li>rangeMin - Slider's minimum boundary.</li>
  <li>rangeStep - Interval that controls the slider's granularity. Default: 1.</li>
  <li>Rank - (1 | 2 | 3 | 4 | 5) Determines part's size. <strong>Default: 3</strong></li>
  <li>Status - (ok | info | warning | alert | error) If defined, determines part's color-coded status.</li>
  <li>Title - Part's label</li>
  <li>titlePosition - (top-left | top-center | top-right | mid-left | mid-right | bottom-left | bottom-center | bottom-right) Determines the title's position in relation to the input element. Applies uniformly to all &lt;az-radio-option&gt;. Default: top-left.</li>
  <li>titleWidth - If titlePosition is mid-left or mid-right, determines the width of the title.</li>
  <li>Value - Part's default/starting value. Default: median of rangeMin & rangeMax</li>
  <li>valueLabel - Description for value to be displayed when displayValue is listed as an attribute.</li>
</ul>

`;
  }
}

window.customElements.define("define-parts", DefineParts);
