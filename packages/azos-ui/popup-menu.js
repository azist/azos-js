/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { genGuid } from "azos/types";
import { AzosElement, html, css, STATUS, RANK, POSITION, parseRank, parseStatus, isRectInViewport } from "./ui.js";
import { isObjectOrArray } from "azos/aver";

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
   * @param {POSITION} position Defines where the menu appears in relation to its anchor
   * @returns The constructed menu added to menu.#instances
   */
  static popupMenu(menu, anchor, position) {
    isObjectOrArray(menu);
    /* menu is object of objects that follow the pattern:
    { title, rank, status, submenu: none|submenu array } */

    const popupMenu = new PopupMenu(anchor ?? document.body);

    popupMenu.#menu = menu;

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
  #heightOfItems = null

  get #positionStyles() {
    const anchorPos = this.#anchor.getBoundingClientRect();
    this.#heightOfItems = 0;
    this.#menu.forEach((item) => {
      let curRank = parseRank(item.rank, true);
      //convert em to px when 1em = 16px
      switch (curRank) {
        case "r1":
          this.#heightOfItems += (2.26 * 16);
          break;
        case "r2":
          this.#heightOfItems += (2.06 * 16);
          break;
        case "r3":
          this.#heightOfItems += (1.66 * 16);
          break;
        case "r4":
          this.#heightOfItems += (1.51 * 16);
          break;
        case "r5":
          this.#heightOfItems += (1.31 * 16);
          break;
        case "r6":
          this.#heightOfItems += (1.16 * 16);
          break;
        default:
          this.#heightOfItems += (1.66 * 16);
      }
    });
    switch (this.#position) {
      case POSITION.TOP_LEFT:
        return `top: ${anchorPos.top - (anchorPos.height + this.#heightOfItems)}px; left: ${anchorPos.left}px;`;
      case POSITION.TOP_CENTER:
        return `top: ${anchorPos.top - (anchorPos.height + this.#heightOfItems)}px; left: ${(anchorPos.left + (anchorPos.width * .45))}px;`;
      case POSITION.TOP_RIGHT:
        return `top: ${anchorPos.top - (anchorPos.height + this.#heightOfItems)}px; left: ${(anchorPos.left + (anchorPos.width * .8))}px;`;
      case POSITION.MIDDLE_LEFT:
        return `top: ${anchorPos.top - (this.#heightOfItems * .5)}px; left: ${anchorPos.left - (anchorPos.width * .7)}px;`;
      case POSITION.MIDDLE_RIGHT:
        return `top: ${anchorPos.top - (this.#heightOfItems * .5)}px; left: ${(anchorPos.left + (anchorPos.width * .8))}px;`;
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

  //Connected Callback to get menu after it is built?

  get guid() { return this.#guid; }

  constructor(anchor) {
    super();
    this.#guid = genGuid();
    this.#anchor = anchor;
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

  // Draw the menu
  render() {
    return html`<div id=${this.guid} popover=auto class="popover" style="${this.#positionStyles}">
      ${this.#menu.map((item) => html`
        <button class="item ${parseRank(item.rank, true)} ${parseStatus(item.status, true)}">
          ${item.title}
        </button>
      `)}
    </div>`;
  }
}
/* <button
  id="btnPopupSubmenu"
  scope="this"
  class="item hasSubMenu ${rankStyle} ${statusStyle}"
  @click="${() => { popupMenu({}, this.btnPopupSubmenu) }}">
    Shawn
</button> */
/**
 * Shortcut method to PopupMenu.popupMenu(...); {@link PopupMenu.popupMenu}.
 */
export const popupMenu = PopupMenu.popupMenu.bind(PopupMenu);

window.customElements.define("az-popup-menu", PopupMenu);
