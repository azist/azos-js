import {html} from '../ui.js';
import { AzosPart } from './part.js';
import {baseStyles,radioStyles,switchStyles} from './styles.js';

export class Radio extends AzosPart{
    static properties={
        title:{type: String}
    };
    static styles=[baseStyles,radioStyles,switchStyles];
    constructor(){
        super();
        (!this.getAttribute('type')||this.getAttribute('type')=='radio') ? this.check='radio' : this.check='switch';
    }
    renderPart(){
        //feed in from parent "RadioGroup":
        //1. Rank
        //2. Status
        //3. Type (radio or switch)
        //4. Title
        //5. ID
        return html`
            <div>
                <label>
                    <input type="radio" class="${this.check}" id="${this.id}_${i}" name="${this.id}" ?disabled=${this.disabled}>
                    <span>${option}</span>
                </label>
            </div>
        `;
    }
}
