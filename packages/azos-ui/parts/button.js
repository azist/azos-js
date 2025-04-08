/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, noContent, parseRank, parseStatus, Part } from '../ui.js';
import { baseStyles, buttonStyles, iconStyles } from './styles.js';

/** Defines a simple button exposed as `az-button` tag */
export class Button extends Part {
  static styles = [baseStyles, buttonStyles, iconStyles];

  static properties = {
    title: { type: String },
    type: { type: String },
    icon: { type: String },
    iconOpts: { type: Object },
    compact: { type: Boolean }
  };

  constructor() {
    super();
    this.type = "";
    this.compact = false;
  }

  renderPart() {
    let cls = `${parseRank(this.rank, true)} ${parseStatus(this.status, true)} ${this.compact ? "compact" : ""}`;

    return html`<button class="${cls}" type="${this.type}" .disabled=${this.isDisabled}>
      ${this.renderIcon()}
      <span class="title">${this.title}</span>
    </button>`;
  }

  renderIcon() {
    if (!this.icon) return noContent;
    return this.arena.renderImageSpec(this.icon, { ...this.iconOpts }).html;
  }
}

window.customElements.define("az-button", Button);
