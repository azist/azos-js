
import {AzosElement} from '../ui.js';
/////import {baseStyles, buttonStyles} from './styles.js';

export class AzosPart extends AzosElement{
  //////static styles=[baseStyles, buttonStyles];

  static properties = {
    enabled:    {type: Boolean},
    applicable: {type: Boolean},
    visible:    {type: Boolean},
    displayed:  {type: Boolean},
    readonly:   {type: Boolean}
  };

  constructor(){
    super();
    this.enabled = true;
    this.applicable = true;
    this.visible = true;
    this.displayed = true;
    this.readonly = false;
  }

  /** Override to calculate styles based on current state, the dflt implementation emits css for invisible and non-displayed items.
   * The styles are applied to root element being rendered via a `style` which overrides the default classes
   */
  calcStyles(){
    let stl = "";
    if (!this.visible) stl += "visibility: hidden;";
    if (!this.displayed) stl += "display: none;";
    return stl;
  }

}
