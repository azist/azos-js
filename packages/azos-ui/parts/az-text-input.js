import {AzosElement, html} from '../ui.js';
import {baseStyles,inputStyles} from './styles.js';

export class AzTextInput extends AzosElement{
    static styles=[baseStyles,inputStyles];
    constructor(){
        super();
        !this.getAttribute('type') ? this.inputType='text' : this.inputType=this.getAttribute('type');
    }
    render(){
        const ranks=['','xl','lg','md','sm','xs'];
        const rank=ranks[!this.getAttribute('rank') ? 3 : this.getAttribute('rank')];
        this.status='';
        !this.getAttribute('status') ? this.status='text_dark' : this.getAttribute('status')=='disabled' ? this.status='text_disabled' : this.status=`text_${this.getAttribute('status')}`;
        this.getAttribute('status')=='disabled' ? this.disabled=true : this.disabled=false;
        let compArea='';
        this.inputType=='multiline' ?
            compArea=html`<textarea id="${this.id}" minLength="${this.getAttribute('min')}" maxLength="${this.getAttribute('max')}" placeholder="${this.getElementsByTagName('az-text-input-placeholder')[0].innerText}" rows="4" ?disabled=${this.disabled}></textarea>` :
            compArea=html`<input type="${this.inputType}" id="${this.id}" minLength="${this.getAttribute('min')}" maxLength="${this.getAttribute('max')}" placeholder="${this.getElementsByTagName('az-text-input-placeholder')[0].innerText}" ?disabled=${this.disabled}>`;
        return html`
            <div class="text_${rank} ${this.status}">
                <label for="${this.id}">
                    ${this.getElementsByTagName('az-text-input-label')[0]}
                </label>
                ${compArea}
            </div>
        `;
    }
}