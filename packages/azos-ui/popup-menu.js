/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { genGuid } from "azos/types";
import { AzosElement, html, css, STATUS, RANK, POSITION, parseRank, parseStatus, isRectInViewport } from "./ui.js";
import { isObject } from "azos/aver";

export class PopupMenu extends AzosElement {

  static styles = css`
    .popover{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content:center;
      border: var(--s-default-bor-ctl);
      overflow: hidden;
      box-shadow: var(--modal-shadow);
      opacity: 0;
    }

    .popover:popover-open, .popover[open]{
      opacity: 1;
      transition: 0.2s ease-in;
      inset: unset;
      margin: 0.5em;
      padding:0;
    }

    .item{
      text-align: left;
      cursor: pointer;
      width: 100%;
      margin: 0;
      padding: .33em .5em;
      border: none;
      background: var(--s-default-bg-ctl);
      color:  var(--s-default-fg-ctl);
      filter: brightness(1);
      transition: filter .2s ease;
    }
    .item:hover{
      filter: brightness(.85);
    }
    .hasSubMenu::after{
      content:">";
      margin-left:1ch;
      font-weight:bold;
    }
    .divider{
      border-color: var(--ghost);
      width:90%;
      margin: .25em 0;
    }

    @starting-style{.popover:popover-open, .popover[open]{opacity: 0;}}

    .popover:focus-visible, .popover:hover{ outline: none; }

    .r1 { font-size: var(--r1-fs); }
    .r2 { font-size: var(--r2-fs); }
    .r3 { font-size: var(--r3-fs); }
    .r4 { font-size: var(--r4-fs); }
    .r5 { font-size: var(--r5-fs); }
    .r6 { font-size: var(--r6-fs); }

    .ok { background: var(--s-ok-bg-ctl); color: var(--s-ok-fg-ctl); }
    .info { background: var(--s-info-bg-ctl); color: var(--s-info-fg-ctl); }
    .warning { background: var(--s-warn-bg-ctl); color: var(--s-warn-fg-ctl); }
    .alert { background: var(--s-alert-bg-ctl); color: var(--s-alert-fg-ctl); }
    .error { background: var(--s-error-bg-ctl); color: var(--s-error-fg-ctl); }
  `;

  static #instances = [];

  /** Get all menu instances */
  static get instances() { return [...PopupMenu.#instances] }

  /**
   * Construct a new context menu to display on the screen.
   * RANK and STATUS should be tied to individual items instead of the whole menu.
   * POSITION is tied to the anchor positioning and should react to edges of the viewport.
   * NOTE: Menus do not understand rich content.
   * @param {object} menu The message to display in the menu
   * @param {string} anchor The DOM element that anchors the menu
   * @returns The constructed menu added to menu.#instances
   */
  static popupMenu(menu, anchor, position, rank, status) {
    isObject(menu);
    /* menu is object of objects that follow the pattern:
    { title, rank, status, submenu: none|submenu name } */
    const popupMenu = new PopupMenu(anchor ?? document.body);

    popupMenu.#menu = menu;
    popupMenu.#rank = rank ?? RANK.NORMAL;
    popupMenu.#status = status ?? STATUS.DEFAULT;

    popupMenu.#position = position ?? POSITION.DEFAULT;
    console.log(popupMenu.#position);

    PopupMenu.#instances.push(popupMenu);
    popupMenu.#show();

    return popupMenu;
  }

  #anchor = null;
  #guid = null;
  #isShown = false;
  #menu = null;
  #position = null;
  #rank = null;
  #status = null;
  #tmr = null;

  get #positionStyles() {
    // Need to define position AFTER menu is rendered USING menu.getBoundingClientRect()
    const anchorPos = this.#anchor.getBoundingClientRect();
    switch (this.#position) {
      case POSITION.TOP_LEFT:
        return `top: ${anchorPos.top - anchorPos.height}px; left: ${anchorPos.left}px;`;
      case POSITION.TOP_CENTER:
        return `top: ${anchorPos.top - anchorPos.height}px; left: ${(anchorPos.left + (anchorPos.width * .45))}px;`;
      case POSITION.TOP_RIGHT:
        return `top: ${anchorPos.top - anchorPos.height}px; left: ${(anchorPos.left + (anchorPos.width * .8))}px;`;
      case POSITION.MIDDLE_LEFT:
        return `top: ${anchorPos.top}px; left: ${anchorPos.left - (anchorPos.width * .7)}px;`;
      case POSITION.MIDDLE_RIGHT:
        return `top: ${anchorPos.top}px; left: ${(anchorPos.left + (anchorPos.width * .8))}px;`;
      case POSITION.BOTTOM_LEFT:
        return `top: ${anchorPos.top + (anchorPos.height * .8)}px; left: ${anchorPos.left}px;`;
      case POSITION.BOTTOM_CENTER:
        return `top: ${anchorPos.top + (anchorPos.height * .8)}px; left: ${(anchorPos.left + (anchorPos.width * .45))}px;`;
      case POSITION.BOTTOM_RIGHT:
        return `top: ${anchorPos.top + (anchorPos.height * .8)}px; left: ${(anchorPos.left + (anchorPos.width * .8))}px;`;
      case POSITION.DEFAULT: //fall-through
      default:
        return `top: ${anchorPos.top + (anchorPos.height * .8)}px; left: ${(anchorPos.left + (anchorPos.width * .8))}px;`;
    }
  }

  get guid() { return this.#guid; }

  constructor(anchor) {
    super();
    this.#guid = genGuid();
    this.#anchor = anchor;
  }

  // Clear the timer
  #clearTimer() {
    if (!this.#tmr) return;
    clearTimeout(this.#tmr);
    this.#tmr = undefined;
  }

  // If not already started, start a timer to destroy this menu
  #play() {
    return;
  }

  // Add element to dom and show
  #show() {
    if (this.#isShown) return false;

    // Add to DOM
    document.body.appendChild(this);

    // Redraw DOM
    this.update();

    // Show on DOM
    this.$(this.guid).showPopover();
    this.#isShown = true;
  }

  firstUpdated() {
    const builtMenu = this.shadowRoot.querySelector(`#${this.guid}`);
    if (builtMenu) {
      console.table(builtMenu.id);
    }
  }

  /** Draw the menu */
  render() {
    const rankStyle = parseRank(this.#rank, true);
    const statusStyle = parseStatus(this.#status, true);

    return html`<div id=${this.guid} popover=auto class="popover" style="${this.#positionStyles}">
      <button class="item ${rankStyle} ${statusStyle}">Dima</button>
      <button
        id="btnPopupSubmenu"
        scope="this"
        class="item hasSubMenu ${rankStyle} ${statusStyle}"
        @click="${() => { popupMenu({}, this.btnPopupSubmenu) }}">
          Shawn
      </button>
      <button class="item ${rankStyle} ${statusStyle}">Kevin</button>
      <hr class="divider" />
      <button class="item ${rankStyle} ${statusStyle}">Shitstain Steven</button>
    </div>`;
  }
}
// <div id="submenu" popover="auto"><h1 style="color:red;">Oh holy crap!</h1></div>

/**
 * Shortcut method to PopupMenu.popupMenu(...); {@link PopupMenu.popupMenu}.
 */
export const popupMenu = PopupMenu.popupMenu.bind(PopupMenu);

window.customElements.define("az-popup-menu", PopupMenu);
