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
    .item[popovertarget]::after{
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

    .ok { background: var(--s-ok-bg-ctl); color: var(--s-ok-fg-ctl); border-color: var(--s-ok-bor-ctl); }
    .info { background: var(--s-info-bg-ctl); color: var(--s-info-fg-ctl); border-color: var(--s-info-bor-ctl); }
    .warning { background: var(--s-warn-bg-ctl); color: var(--s-warn-fg-ctl); border-color: var(--s-warn-bor-ctl); }
    .alert { background: var(--s-alert-bg-ctl); color: var(--s-alert-fg-ctl); border-color: var(--s-alert-bor-ctl); }
    .error { background: var(--s-error-bg-ctl); color: var(--s-error-fg-ctl); border-color: var(--s-error-bor-ctl); }
  `;

  static #instances = [];

  /** Get all menu instances */
  static get instances() { return [...PopupMenu.#instances] }

  /**
   * Construct a new menu message to display on the screen with the given styling
   *  around RANK, STATUS, and POSITION.
   * NOTE: menus do not understand rich content.
   * @param {object} menu The message to display in the menu
   * @param {number} timeout The length of time to display the menu (default: undefined)
   * @param {RANK} rank The rank
   * @param {STATUS} status The status
   * @param {POSITION} position The position for where to display on the screen
   * @returns The constructed menu added to menu.#instances
   */
  static popupMenu(menu, anchor, rank, status) {
    isObject(menu);
    const popupMenu = new PopupMenu(anchor ?? document.body);

    popupMenu.#menu = menu;
    popupMenu.#rank = rank ?? RANK.NORMAL;
    popupMenu.#status = status ?? STATUS.DEFAULT;

    PopupMenu.#instances.push(popupMenu);
    popupMenu.#show();

    return popupMenu;
  }

  #guid = null;
  #anchor = null;
  #tmr = null;
  #isShown = false;
  #menu = null;
  #rank = null;
  #status = null;

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

  /** Draw the menu message */
  render() {
    console.log(`rank is ${this.#rank}; status is ${this.#status}`);

    const rankStyle = parseRank(this.#rank, true);
    const statusStyle = parseStatus(this.#status, true);

    const anchorPos = this.#anchor.getBoundingClientRect();
    const topPos = anchorPos.top;
    const leftPos = anchorPos.left + (anchorPos.width * .75);

    console.log(`isRectInViewport? ${isRectInViewport(this.#anchor)}`);

    return html`<div id=${this.guid} popover=auto role=status class="popover" style="top: ${topPos}px; left: ${leftPos}px;">
      <button class="item ${rankStyle} ${statusStyle}">Dima</button>
      <button class="item ${rankStyle} ${statusStyle}" popovertarget="submenu">Shawn</button>
      <button class="item ${rankStyle} ${statusStyle}">Kevin</button>
      <hr class="divider" />
      <button class="item ${rankStyle} ${statusStyle}">Shitstain Steven</button>
      <div id="submenu" popover="auto"><h1 style="color:red;">Oh holy crap!</h1></div>
    </div>`;
  }
}

/**
 * Shortcut method to PopupMenu.popupMenu(...); {@link PopupMenu.popupMenu}.
 */
export const popupMenu = PopupMenu.popupMenu.bind(PopupMenu);

window.customElements.define("az-popup-menu", PopupMenu);
