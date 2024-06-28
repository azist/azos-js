
import {AzosElement, html} from '../ui.js';
/////import {baseStyles, buttonStyles} from './styles.js';

export class AzosPart extends AzosElement{
  //////static styles=[baseStyles, buttonStyles];

  static properties = {
    isDisabled:  {type: Boolean, reflect: true},
    isNa:        {type: Boolean, reflect: true},
    isHidden:    {type: Boolean, reflect: true},
    isAbsent:    {type: Boolean, reflect: true},
    isReadonly:  {type: Boolean, reflect: true}
  };

  constructor(){
    super();
  }

 /** Programmatic accessor with reversed meaning for `isDisabled` */
 get isEnabled() { return !this.isDisabled; }

 /** Programmatic accessor with reversed meaning for `isDisabled` */
 set isEnabled(v) { this.isDisabled = !v; }

  /** Programmatic accessor with reversed meaning for `isNa` */
  get isApplicable() { return !this.isNa; }

  /** Programmatic accessor with reversed meaning for `isNa` */
  set isApplicable(v) { this.isNa = !v; }

  /** Programmatic accessor with reversed meaning for `isHidden` */
  get isVisible() { return !this.isHidden; }

  /** Programmatic accessor with reversed meaning for `isHidden` */
  set isVisible(v) { this.isHidden = !v; }





  /** Override to calculate styles based on current state, the dflt implementation emits css for invisible and non-displayed items.
   * The styles are applied to root element being rendered via a `style` which overrides the default classes
   */
  calcStyles(){
    let stl = "";
    if (this.isHidden) stl += "visibility: hidden;";
    if (this.isAbsent) stl += "display: none;";
    return stl;
  }

  //https://www.oddbird.net/2023/11/17/components/
  //https://frontendmasters.com/blog/light-dom-only/
  render(){
    const stl = this.calcStyles();
    return stl ? html`<style>:host{ ${stl}}</style> ${this.renderPart()}` : this.renderPart();
  }

  renderPart(){ return "***NOTHING***"; }
}
