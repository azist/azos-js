/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AzosElement, css, parseRank, parseStatus } from "../../ui";

export class MenuItem extends AzosElement {
  /** A simple UI component that builds individual menu items.
   * Parent Menu component will pass Command object PLUS Status & Rank into this
  */
  constructor() { super(); }

  static properties = {
    command: { type: Object },
    /* hasSubmenu:    {type:Boolean},
    submenuTarget: {type:String} */
  }

  static styles = css`
    div{
      cursor: pointer;
      font-size: var(--r3-fs);
      background: var(--s-default-bg-ctl);
      color: var(--s-default-fg-ctl);
      border: var(--s-default-bor-ctl);
      padding: .8em;
    }
    div:hover{ filter: brightness(1.25); }

    .hasSubMenu::after{
      content: ">";
      font-weight: bold;
    }

    .ok    { background: var(--s-ok-bg-ctl);    color: var(--s-ok-fg-ctl);    border: var(--s-ok-bor-ctl); }
    .info  { background: var(--s-info-bg-ctl);  color: var(--s-info-fg-ctl);  border: var(--s-info-bor-ctl); }
    .warn  { background: var(--s-warn-bg-ctl);  color: var(--s-warn-fg-ctl);  border: var(--s-warn-bor-ctl); }
    .alert { background: var(--s-alert-bg-ctl); color: var(--s-alert-fg-ctl); border: var(--s-alert-bor-ctl); }
    .error { background: var(--s-error-bg-ctl); color: var(--s-error-fg-ctl); border: var(--s-error-bor-ctl); }

    .r1{ font-size: var(--r1-fs); }
    .r2{ font-size: var(--r2-fs); }
    .r3{ font-size: var(--r3-fs); }
    .r4{ font-size: var(--r4-fs); }
    .r5{ font-size: var(--r5-fs); }
    .r6{ font-size: var(--r6-fs); }
  `;

  async onCommandClick(e) {
    await this.command.exec(this);
  }

  render() {
    const clsStatus = `${parseStatus(this.status, true)}`;
    const clsRank = `${parseRank(this.rank, true)}`;
    return html`
      <div
        class="menuItem ${clsStatus} ${clsRank}"
        @click="${this.onCommandClick}"
      >
        ${this.command.icon
        ? html`<span style="margin-right:.75em;">${this.command.icon}</span>${this.command.title}`
        : this.command.title
      }
      </div>
    `;
  }
}

window.customElements.define("az-menu-item", MenuItem);
