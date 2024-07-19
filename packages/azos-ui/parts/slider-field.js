import { html, css, noContent, POSITION } from '../ui.js';
import { FieldPart } from "./field-part";
import { baseStyles, sliderStyles } from './styles.js';

export class SliderField extends FieldPart{
  static properties={
    /** Displays slider's value & valueLabel (if defined) */
    displayValue:  {type: Boolean, reflect: true},

    /** Allowed width of input field as "%" when titlePosition = mid-left | mid-right.
     *  MUST BE BETWEEN 0 and 100 & less than (100 - titleWidth) - otherwise defaults to 40.
     */
    inputWidth: {type: Number},

    /** Number of evenly-spaced tick marks on slider */
    numTicks: {type: Number},

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



  renderInput(){

    /** Set the slider's width based on the titleWidth property */
    let stlInputWidth = '';
    if(this.titlePosition === POSITION.MIDDLE_LEFT || this.titlePosition === POSITION.MIDDLE_RIGHT){
      if(this.inputWidth !== undefined){
        if(0 <= this.inputWidth <= 100){
          stlInputWidth = (this.inputWidth < (100 - this.titleWidth)) ? css`width: ${this.inputWidth}%;` : css`width: ${(100 - this.titleWidth)}%;`;
        }else{
          stlInputWidth = (this.titleWidth !== undefined) ? css`width: ${(100 - this.titleWidth)}%;` : css`width: 40%;`;
        }
      }else{
        stlInputWidth = (this.titleWidth !== undefined) ? css`width: ${(100 - this.titleWidth)}%;` : css`width: 40%;`;
      }
    }

    const range=this.rangeMax - this.rangeMin;
    const tickArray=[];
    for(var i=0; i<=this.numTicks; i++){ tickArray.push((((this.rangeMax - this.rangeMin) / this.numTicks) * i) + this.rangeMin); }
    const ticks = html`${tickArray.map((tick) => html`
      <option value="${tick}"></option>
    `)}`;

    const tickList = (this.numTicks !== undefined && this.numTicks > 0) ? html`<datalist class="sliderList" id="${this.id}_list">${ticks}</datalist>` : noContent ;

    return html`
      <input
        class="slider"
        type="range"
        style="${stlInputWidth}"
        id="${this.id}"
        min="${this.rangeMin ? this.rangeMin : noContent}"
        max="${this.rangeMax ? this.rangeMax : noContent}"
        step="${this.rangeStep ? this.rangeStep : noContent}"
        value="${this.value ? this.value : range / 2}"
        list="${(this.numTicks !== '') ? `${this.id}_list` : noContent }"
        .disabled=${this.isDisabled}
        .required=${this.isRequired}
        ?readonly=${this.isReadonly}
      >
      ${tickList}
    `;
    //${this.displayValue ? html`<span>${this.valueLabel ? this.valueLabel : noContent} ${this.querySelector(`#${this.id}`).addEventListener('input', (e) =>{ return e.target.value; })}</span>` : noContent}
  }
}

window.customElements.define("az-slider", SliderField);
