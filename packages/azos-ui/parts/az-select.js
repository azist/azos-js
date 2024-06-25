import {AzosElement, html,css} from '../../../../azos-js/packages/azos-ui/ui.js';
//import {selectStyles,colorStyles,iconStyles} from './styles.js';

export class AzSelect extends AzosElement{
    static properties={ listItems:{} };
    //static styles=[selectStyles,colorStyles,iconStyles,css`.addPadding{padding:5px 15px;}`];
    constructor(){
        super();
        this.listItems=this.getAttribute('choices').split('|');
        this.disable=false; this.require=false;
        if(this.getAttribute('state')){
            this.getAttribute('state')=='disable' ? this.disable=true :
            this.require=true;
        }
        !this.getAttribute('color')||this.getAttribute('color')=='' ? this.colorChoice='text_dark' : this.colorChoice=this.getAttribute('color');
        this.icon='';
        this.addPadding='';
        if(this.colorChoice.includes('bg_')||this.colorChoice.includes('border_')) this.addPadding='addPadding';
        if(this.getAttribute('status')&&this.getAttribute('status')!=''){
            this.addPadding='addPadding';
            if(this.getAttribute('status').includes('danger')){
                this.icon=html`<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path class="fill_light" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>`;
                this.colorChoice='bg_danger';
            }
            if(this.getAttribute('status').includes('warning')){
                this.icon=html`<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path class="fill_dark" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>`;
                this.colorChoice='bg_warning';
            }
            if(this.getAttribute('status').includes('info')){
                this.icon=html`<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512"><!--!Font Awesome Pro 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc.--><path class="fill_dark" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216 192V224h24 48 24v24 88h8 24v48H296 216 192V336h24zm72-144H224V128h64v64z"/></svg>`;
                this.colorChoice='bg_info';
            }
            if(this.getAttribute('status').includes('success')){
                this.icon=html`<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 35 35"><polygon class="fill_light" points=".1 22.5 6.1 18.1 14.5 27.8 26.7 0 35 6.6 14.4 35 .1 22.5"/></svg>`;
                this.colorChoice='bg_success';
            }
        }
    }
    render(){
        return html`<div class="${this.colorChoice} ${this.addPadding}">
            <label>
            ${this.icon} ${this.getAttribute('label')}</label>
                <select id="${this.id}" name="${this.id}" ?disabled=${this.disable} ?required=${this.require} >
                    <option>${this.getAttribute('placeholder') ? this.getAttribute('placeholder') : html`Select&hellip;`}</option>
                    ${this.listItems.map(
                        (i) => html`<option value="${i}">${i}</option>`
                    )}
                </select></div>
        `;
    }
}
