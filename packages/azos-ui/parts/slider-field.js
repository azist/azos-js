import { isOneOf } from 'azos/strings';
import { html, css, noContent, parseRank, parseStatus } from '../ui.js';
import { FieldPart } from "./field-part";
import { baseStyles, sliderStyles } from './styles.js';

/* What's still needed:
    - rank sizing
    - status coloring
    - displayValue shows valueLabel and live-updated current value
    - tick marks using generated datalist (custom styles overrides kill default tick marks)
*/

export class SliderField extends FieldPart{
  static properties={
    /** Displays slider's value & valueLabel (if defined) */
    displayValue:  {type: Boolean, reflect: true},

    /** Defines height in "em" of vertical slider (ignored if slider is horizontal) */
    height: {type: Number},

    /** Allowed width of input field as "%" when titlePosition = mid-left | mid-right.
     *  MUST BE BETWEEN 0 and 100 & less than (100 - titleWidth) - otherwise defaults to 40.
     */
    inputWidth: {type: Number},

    /** Number of evenly-spaced tick marks on slider */
    //numTicks: {type: Number},

    /** Determines if slider is vertical or horizontal */
    orientation: {type: String},

    /** Maximum allowed value */
    rangeMax: {type: Number},

    /** Minimum allowed value */
    rangeMin: {type: Number},

    /** Interval that controls the slider's granularity */
    rangeStep: {type: Number},

    /** Description of value when displayValue=true */
    valueLabel: {type: String}
  };

  static styles=[baseStyles, sliderStyles];

  constructor(){ super(); }

  /** True if orientation is vertical */
  get isVertical(){ return isOneOf(this.orientation,["v","vertical","tall"]); }

  renderInput(){
    const clsRank     = `${parseRank(this.rank, true)}`;
    const clsStatusBg = `${parseStatus(this.status,true,"Bg")}`;

    const range=this.rangeMax - this.rangeMin;

    let stlVertical='';
    if(this.isVertical){
      (this.height !== undefined)
      ? stlVertical = css`writing-mode: vertical-lr; height:${this.height}em;`
      : stlVertical = css`writing-mode: vertical-lr; height:25em;`
    }

    /*const tickArray=[];
    for(var i=0; i<=this.numTicks; i++){ tickArray.push((((this.rangeMax - this.rangeMin) / this.numTicks) * i) + this.rangeMin); }
    const ticks = html`${tickArray.map((tick) => html`
      <option value="${tick}"></option>
    `)}`;

    const tickList = (this.numTicks !== undefined && this.numTicks > 0) ? html`<datalist class="sliderList" id="${this.id}_list">${ticks}</datalist>` : noContent ;*/
    //${tickList}
    //list="${(this.numTicks !== '') ? `${this.id}_list` : noContent }"
    return html`
      <input
        class="${clsRank} ${clsStatusBg}"
        type="range"
        id="${this.id}"
        min="${this.rangeMin ? this.rangeMin : noContent}"
        max="${this.rangeMax ? this.rangeMax : noContent}"
        step="${this.rangeStep ? this.rangeStep : noContent}"
        value="${this.value ? this.value : range / 2}"
        style="${stlVertical}"
        .disabled=${this.isDisabled}
        .required=${this.isRequired}
        ?readonly=${this.isReadonly}
      >
    `;
    //${this.displayValue ? html`<span>${this.valueLabel ? this.valueLabel : noContent} ${this.querySelector(`#${this.id}`).addEventListener('input', (e) =>{ return e.target.value; })}</span>` : noContent}
  }
}

window.customElements.define("az-slider", SliderField);
