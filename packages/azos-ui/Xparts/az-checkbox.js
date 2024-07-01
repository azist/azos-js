import {AzosElement, html} from '../ui.js';
import {baseStyles,checkStyles,switchStyles} from './styles.js';

export class AzCheckbox extends AzosElement{
    static properties={ checked:{} };
    static styles=[baseStyles,checkStyles,switchStyles];
    constructor(){
        super();
        this.checked=false;
        (!this.getAttribute('type')||this.getAttribute('type')=='check') ? this.check='check' : this.check='switch';
    }
    render(){
        const ranks=['','xl','lg','md','sm','xs'];
        const rank=ranks[!this.getAttribute('rank') ? 3 : this.getAttribute('rank')];
        this.status='';
        !this.getAttribute('status') ? this.status='text_dark' : this.getAttribute('status')=='disabled' ? this.status='text_disabled' : this.status=`text_${this.getAttribute('status')}`;
        this.getAttribute('status')=='disabled' ? this.disabled=true : this.disabled=false;
        return html`
            <div class="text_${rank} ${this.status}">
                <label class="padding_${rank}" style="padding-left:0px;" for="${this.id}">
                    <input type="checkbox" class="${this.check}" id="${this.id}" name="${this.id}" ?disabled=${this.disabled}>
                    <span>${this.innerHTML}</span>
                </label>
            </div>
        `;
    }
}

