import {AzosElement, html} from '../ui.js';
import {baseStyles,radioStyles,switchStyles,checkStyles} from './styles.js';

export class AzRadioGroup extends AzosElement{
    static styles=[baseStyles,radioStyles,switchStyles,checkStyles];
    constructor(){
        super();
        (!this.getAttribute('type')||this.getAttribute('type')=='radio') ? this.check='radio' : this.getAttribute('type')=='check' ? this.check='check' : this.check='switch';

    }
    render(){
        const ranks=['','xl','lg','md','sm','xs'];
        const rank=ranks[!this.getAttribute('rank') ? 3 : this.getAttribute('rank')];
        this.status='';
        !this.getAttribute('status') ? this.status='text_dark' : this.getAttribute('status')=='disabled' ? this.status='text_disabled' : this.status=`text_${this.getAttribute('status')}`;
        this.getAttribute('status')=='disabled' ? this.disabled=true : this.disabled=false;

        const options=[];
        for(let i=0;i<this.getElementsByTagName('az-radio-option').length;i++){
            options.push(this.getElementsByTagName('az-radio-option')[i].innerText);
        }
        const optionList=html`${options.map((option,i)=>html`
            <div>
                <label class="padding_${rank}" style="padding-left:0px;">
                    <input type="radio" class="${this.check}" id="${this.id}_${i}" name="${this.id}" ?disabled=${this.disabled}>
                    <span>${option}</span>
                </label>
            </div>
        `)}`;

        return html`
            <div class="text_${rank} ${this.status}">
                <p>${this.getElementsByTagName('az-radio-label')[0]}</p>
                ${optionList}
            </div>
        `;
    }
}
