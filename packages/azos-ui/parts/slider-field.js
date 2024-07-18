import { html, css, noContent, POSITION } from '../ui.js';
import { FieldPart } from "./field-part";
import { baseStyles, sliderStyles } from './styles.js';

export class SliderField extends FieldPart{
  static properties={
    /** Displays slider's value & valueLabel (if defined) */
    displayValue:  {type: Boolean, reflect: true},

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
    let inputWidth = '';
    if (this.titleWidth !== undefined) {
      if(this.titlePosition === POSITION.MIDDLE_LEFT || this.titlePosition === POSITION.MIDDLE_RIGHT){
        if(0 <= this.titleWidth <= 100) inputWidth = css`width: ${100 - this.titleWidth}%;`
      }else{
        inputWidth = css`width: 100%;`;
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
        style="${inputWidth}"
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
