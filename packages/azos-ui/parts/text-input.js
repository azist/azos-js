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
    const rank=`${parseRank(this.rank, true)}`;
    const status=`${parseStatus(this.status, true)}` || 'default';
    const disableClass = `${this.isDisabled ? 'disabled' : ''}`;

    const inputElement = html`${this.type === 'textarea'
      ? html`
        <textarea id="${this.id}" class="${rank} ${status}Bg ${status}Txt" placeholder="${this.placeholder}" .disabled=${this.isDisabled}>${this.value}</textarea>
      ` : html`
        <input type="text" id="${this.id}" class="${rank} ${status}Bg ${status}Txt" placeholder="${this.placeholder}" .value="${this.value}" .disabled=${this.isDisabled} />
      `
    }`;

    return html`
      <div class="${disableClass}">
        <label for="${this.id}" class="${rank} ${status}Txt">${this.title}</label>
        ${inputElement}
      </div>
    `;
  }
}

window.customElements.define('az-text-input', TextInput);
