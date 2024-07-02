import { html, parseRank, parseStatus } from '../ui.js';
import { AzosPart } from './part.js';
import { baseStyles, radioStyles, switchStyles } from './styles.js';

export class RadioGroup extends AzosPart{
    static properties={
        checked:{},
        title:{type: String}
    };
    static styles=[baseStyles,radioStyles,switchStyles];
    constructor(){
        super();
        (!this.getAttribute('type')||this.getAttribute('type')=='radio') ? this.check='radio' : this.check='switch';
    }
    render(){
        let cls = `${parseRank(this.rank, true)} ${parseStatus(this.status, true)} ${this.isDisabled ? 'disabled' : ''}`;
        const options=[];
        for(let i=0;i<this.getElementsByTagName('az-radio-option').length;i++){
            options.push(this.getElementsByTagName('az-radio-option')[i].innerText);
        }
        const optionList=html`${options.map((option,i)=>html`
            <div>
                <label>
                    <input type="radio" class="${this.check} ${parseRank(this.rank, true)}" id="${this.id}_${i}" name="${this.id}" .disabled=${this.isDisabled}>
                    <span>${option}</span>
                </label>
            </div>
        `)}`;

        return html`
            <div class="${cls}">
                <p>${this.title}</p>
                ${optionList}
            </div>
        `;
    }
}

window.customElements.define("az-radio-group", RadioGroup);
