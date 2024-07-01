import { html, parseRank, parseStatus } from '../ui.js';
import { AzosPart } from './part.js';
import { baseStyles, checkStyles, switchStyles } from './styles.js';

export class Checkbox extends AzosPart{
    static properties={
        checked:{},
        title:{type: String}
    };
    static styles=[baseStyles,checkStyles,switchStyles];
    constructor(){
        super();
        this.checked=false;
        (!this.getAttribute('type')||this.getAttribute('type')=='check') ? this.check='check' : this.check='switch';
    }
    renderPart(){
        let cls = `${parseRank(this.rank, true)} ${parseStatus(this.status, true)}`;
        return html`
            <div class="${cls}">
                <label for="${this.id}">
                    <input type="checkbox" class="${this.check}" id="${this.id}" name="${this.id}" .disabled=${this.isDisabled}>
                    ${this.title}
                </label>
            </div>
        `;
    }
}

window.customElements.define("az-checkbox", Checkbox);