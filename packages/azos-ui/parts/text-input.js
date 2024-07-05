import { html, parseRank, parseStatus } from '../ui.js';
import { AzosPart } from './part.js';
import { baseStyles, textInputStyles } from './styles.js';

/** Defines a text input/textarea component exposed as `az-text-input` tag */
export class TextInput extends AzosPart {
  static styles = [baseStyles, textInputStyles];

  static properties = {
    type: { type: String }, // 'input' or 'textarea'
    title: { type: String },
    placeholder: { type: String },
    value: { type: String }
  };

  constructor() {
    super();
    this.type = 'input'; // default to input
    this.title = '';
    this.placeholder = '';
    this.value = '';
  }

  renderPart() {
    let rank=`${parseRank(this.rank, true)}`;
    let status=`${parseStatus(this.status, true)}`;
    
    if (this.type === 'textarea') {
      return html`
        <div>
          <label for="${this.id}" class="${rank} ${status}Txt">${this.title}</label>
          <textarea id="${this.id}" class="${rank} ${status}Bg ${status}Txt" placeholder="${this.placeholder}" .disabled=${this.isDisabled}>${this.value}</textarea>
        </div>
      `;
    } else {
      return html`
        <div>
          <label for="${this.id}" class="${rank} ${status}Txt">${this.title}</label>
          <input type="text" id="${this.id}" class="${rank} ${status}Bg ${status}Txt" placeholder="${this.placeholder}" .value="${this.value}" .disabled=${this.isDisabled} />
        </div>
      `;
    }
  }
}

window.customElements.define('az-text-input', TextInput);
