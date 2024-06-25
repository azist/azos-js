import {AzosElement, html} from '../../../../azos-js/packages/azos-ui/ui.js';
import {baseStyles,buttonStyles} from './styles.js';

export class AzButton extends AzosElement{
    static styles=[baseStyles,buttonStyles];
    constructor(){
        super();
    }
    render(){
        const ranks=['','xl','lg','md','sm','xs'];
        return html`
            <button class="btn_${ranks[!this.getAttribute('rank') ? 3 : this.getAttribute('rank')]} ${!this.getAttribute('status') ? 'border_dark text_dark' : this.getAttribute('status')=='disabled' ? 'border_disabled text_disabled' : `bg_${this.getAttribute('status')} border_none`}" id="${this.id}">
                ${this.innerHTML}
            </button>
        `;
    }
}
