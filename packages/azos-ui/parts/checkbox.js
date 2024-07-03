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
        let rank=`${parseRank(this.rank, true)}`;
        let status=`${parseStatus(this.status, true)}`;
        let disableClass = `${this.isDisabled ? 'disabled' : ''}`;
        return html`
            <div class="${rank} ${disableClass}">
                <label for="${this.id}">
                    <input type="checkbox" class="${this.check} ${rank} ${status}Bg" id="${this.id}" name="${this.id}" .disabled=${this.isDisabled}>
                    <span class="${status}Txt">${this.title}</span>
                </label>
            </div>
        `;
    }
}

window.customElements.define("az-checkbox", Checkbox);