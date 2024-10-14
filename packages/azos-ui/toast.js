/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { genGuid } from "azos/types";
import { AzosElement, html, css, STATUS, RANK, POSITION, parseRank, parseStatus } from "./ui.js";
import { isString } from "azos/aver";

/**
 * Toasts are popover AzosElement messages that self-destruct after a timeout period (default 10s).
 */
export class Toast extends AzosElement {

  static styles = css`
.popover{
  display: block;
  border: 1px solid var(--s-default-bor-hcontrast);
  border-radius: 0.25em;
  background: rgba(from var(--s-default-bg-hcontrast) r g b / 0.85);
  color:  var(--s-default-fg-hcontrast);
  overflow: hidden;
  padding: 1em;
  box-shadow: 2px 2px 14px var(--s-default-bg-hcontrast);
  opacity: 0;
}

.popover:popover-open, .popover[open]{
  opacity: 1;
  transition: 0.2s ease-in;
  inset: unset;
  margin: 0.5em;
}

@starting-style{.popover:popover-open, .popover[open]{opacity: 0;}}


.popover:focus-visible, .popover:hover{ outline: none; }

.r1 { font-size: var(--r1-fs); }
.r2 { font-size: var(--r2-fs); }
.r3 { font-size: var(--r3-fs); }
.r4 { font-size: var(--r4-fs); }
.r5 { font-size: var(--r5-fs); }
.r6 { font-size: var(--r6-fs); }

.ok { background: var(--s-ok-bg-hcontrast); color: var(--s-ok-fg-hcontrast); border-color: var(--s-ok-bor-hcontrast); box-shadow: 2px 2px 14px var(--s-ok-bg-hcontrast) }
.info { background: var(--s-info-bg-hcontrast); color: var(--s-info-fg-hcontrast); border-color: var(--s-info-bor-hcontrast); ; box-shadow: 2px 2px 14px var(--s-info-bg-hcontrast)  }
.warning { background: var(--s-warn-bg-hcontrast); color: var(--s-warn-fg-hcontrast); border-color: var(--s-warn-bor-hcontrast); ; box-shadow: 2px 2px 14px var(--s-warn-bg-hcontrast)  }
.alert { background: var(--s-alert-bg-hcontrast); color: var(--s-alert-fg-hcontrast); border-color: var(--s-alert-bor-hcontrast); ; box-shadow: 2px 2px 14px var(--s-alert-bg-hcontrast)  }
.error { background: var(--s-error-bg-hcontrast); color: var(--s-error-fg-hcontrast); border-color: var(--s-error-bor-hcontrast); ; box-shadow: 2px 2px 14px var(--s-error-bg-hcontrast)  }
`;

  static #instances = [];

  /** Start the next toast's timer */
  static #nextToast() {
    if (Toast.instances.length > 0) {
      Toast.instances[0].#play();
    }
  }

  /** New toasts naturally are popped over old toasts. Fix that by cascading by FIFO */
  static #cascadeToasts() {
    Toast.instances.reverse().forEach(toast => toast.#toggle());
  }

  /** Get all toast instances */
  static get instances() { return [...Toast.#instances] }

  /** Get total toasts in queue */
  static get toastCount() { return Toast.#instances.length || 0; }

  /**
   * Construct a new toast message to display on the screen with the given styling
   *  around RANK, STATUS, and POSITION.
   * NOTE: Toasts do not understand rich content.
   * @param {string|null} msg The message to display in the toast
   * @param {number} timeout The length of time to display the toast (default: undefined)
   * @param {RANK} rank The rank
   * @param {STATUS} status The status
   * @param {POSITION} position The position for where to display on the screen
   * @returns The constructed toast added to Toast.#instances
   */
  static toast(msg = null, options = { timeout: Number, rank: RANK, status: STATUS, position: POSITION }) {
    isString(msg);
    const toast = new Toast();

    // 1s + 180ms per word
    const timeout = options.timeout ?? 1_000 + (msg.split(' ').length) * 180;
    const rank = options.rank ?? RANK.NORMAL;
    const status = options.status ?? STATUS.DEFAULT;
    const position = options.position ?? POSITION.DEFAULT;

    toast.#message = msg;
    toast.#timeout = timeout;
    toast.#rank = rank;
    toast.#status = status;
    toast.#position = position;

    Toast.#instances.push(toast);
    toast.#show();

    this.#cascadeToasts();
    this.#instances[0] && this.#instances[0].#play(); // ensure the top-most toast is running
    return toast;
  }

  #guid = null;
  #tmr = null;
  #isShown = false;
  #message = null;
  #timeout = null;
  #rank = null;
  #status = null;
  #position = null;

  // Calculate the position styles for this rendered Toast
  get #positionStyles() {
    let offset = (Toast.toastCount - 1) * 5;
    switch (this.#position) {
      case POSITION.TOP_LEFT:
        return `top:${offset}px;left:0;`;
      case POSITION.TOP_CENTER:
        return `top:${offset}px;left:50%;transform:translateX(-50%);`;
      case POSITION.TOP_RIGHT:
        return `top:${offset}px;right:0;`;
      case POSITION.MIDDLE_LEFT:
        return `top:calc(50% + ${offset}px);left:0;transform:translateY(-50%);`;
      case POSITION.MIDDLE_RIGHT:
        return `top:calc(50% + ${offset}px);right:0;transform:translateY(-50%);`;
      case POSITION.BOTTOM_LEFT:
        return `bottom:${offset}px;left:0;`;
      case POSITION.BOTTOM_CENTER:
        return `bottom:${offset}px;left:50%;transform:translateX(-50%);`;
      case POSITION.BOTTOM_RIGHT:
        return `bottom:${offset}px;right:0;`;
      case POSITION.DEFAULT: // fall-through
      default:
        return `top:calc(50% + ${offset}px);left:50%;transform:translate(-50%,-50%);`;
    }
  }

  get guid() { return this.#guid; }

  constructor() {
    super();
    this.#guid = genGuid();
  }

  // Clear the timer
  #clearTimer() {
    if (!this.#tmr) return;
    clearTimeout(this.#tmr);
    this.#tmr = undefined;
  }

  // If not already started, start a timer to destroy this toast
  #play() {
    if (this.#tmr) return;
    this.#tmr = setTimeout(() => this.#destroy(), this.#timeout);
  }

  // Hide/Show popover element. Helper to reset z-index of visible toasts.
  #toggle() {
    const t = this.$(this.guid);

    // Hide on DOM
    t.hidePopover();

    // Show on DOM
    t.showPopover();
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

  // Destroy and clean up the toast element. Trigger next toast.
  #destroy() {
    if (!this.#isShown) return false;
    this.#clearTimer();

    // Hide from DOM
    this.$(this.guid).hidePopover();
    this.#isShown = false;

    // Remove from DOM
    document.body.removeChild(this);

    // Remove from instances
    Toast.#instances.shift();

    // Trigger next
    Toast.#nextToast();
  }

  /** Draw the toast message */
  render() {
    const rankStyle = parseRank(this.#rank, true);
    const statusStyle = parseStatus(this.#status, true);
    const positionStyle = this.#positionStyles;
    return html`<div id=${this.guid} popover=manual role=status class="popover ${rankStyle} ${statusStyle}" style="${positionStyle}">${this.#message}</div>`;
  }
}

/**
 * Shortcut method to Toast.toast(...); {@link Toast.toast}.
 */
export const toast = Toast.toast.bind(Toast);

window.customElements.define("az-toast", Toast);
