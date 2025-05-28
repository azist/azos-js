/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AzosElement, html, css, POSITION, parseRank, parseStatus, parsePosition, RANK } from "./ui.js";
import { isString } from "azos/aver";

/**
 * Toasts are popover AzosElement messages that self-destruct after a timeout period (default 10s).
 */
export class Toast extends AzosElement {

  static styles = css`
:host([popover]){
  display: block;
  border: 1px solid var(--s-default-bor-hcontrast);
  border-radius: 0.25em;
  background: rgba(from var(--s-default-bg-hcontrast) r g b / 0.85);
  color:  var(--s-default-fg-hcontrast);
  overflow: hidden;
  padding: 1em;
  box-shadow: 2px 2px 14px var(--s-default-bg-hcontrast);
  transition: 0.2s ease-in;
  transition-behavior: allow-discrete;
  opacity: 0;
}

:host(:popover-open), :host([open]){
  opacity: 1;
  inset: unset;
  margin: 0.5em;
}

:host(:focus-visible), :host(:hover){ outline: none; }

@starting-style{:host(:popover-open), :host([open]){ opacity: 0; }}

:host(.r1) { font-size: var(--r1-fs); }
:host(.r2) { font-size: var(--r2-fs); }
:host(.r3) { font-size: var(--r3-fs); }
:host(.r4) { font-size: var(--r4-fs); }
:host(.r5) { font-size: var(--r5-fs); }
:host(.r6) { font-size: var(--r6-fs); }

:host(.ok) { background: var(--s-ok-bg-hcontrast); color: var(--s-ok-fg-hcontrast); border-color: var(--s-ok-bor-hcontrast); box-shadow: 2px 2px 14px var(--s-ok-bg-hcontrast) }
:host(.info) { background: var(--s-info-bg-hcontrast); color: var(--s-info-fg-hcontrast); border-color: var(--s-info-bor-hcontrast); ; box-shadow: 2px 2px 14px var(--s-info-bg-hcontrast)  }
:host(.warning) { background: var(--s-warn-bg-hcontrast); color: var(--s-warn-fg-hcontrast); border-color: var(--s-warn-bor-hcontrast); ; box-shadow: 2px 2px 14px var(--s-warn-bg-hcontrast)  }
:host(.alert) { background: var(--s-alert-bg-hcontrast); color: var(--s-alert-fg-hcontrast); border-color: var(--s-alert-bor-hcontrast); ; box-shadow: 2px 2px 14px var(--s-alert-bg-hcontrast)  }
:host(.error) { background: var(--s-error-bg-hcontrast); color: var(--s-error-fg-hcontrast); border-color: var(--s-error-bor-hcontrast); ; box-shadow: 2px 2px 14px var(--s-error-bg-hcontrast)  }
`;

  static #instances = [];

  /** Start the next toast's timer */
  static #nextToast() {
    if (Toast.instances.length > 0)
      Toast.instances[0].#play();
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
   * @param {string | null} msg The message to display in the toast
   * @param {object} options - optional object with the following properties:
   * @param {number} [options.timeout] The length of time to display the toast (default: 1000 + 180ms per word)
   * @param {RANK} [options.rank] The rank of the toast (default: RANK.NORMAL)
   * @param {STATUS} [options.status] The status of the toast (default: STATUS.DEFAULT)
   * @param {POSITION} [options.position] The position for where to display on the screen (default: POSITION.DEFAULT)
   * @param {number} timeout The length of time to display the toast (default: 1000 + 180ms per word)
   * @returns {Toast} The constructed toast added to Toast.#instances
   */
  static toast(msg = null, { timeout, rank, status, position } = {}) {
    isString(msg);
    const toast = new Toast();

    timeout = timeout ?? 1_000 + (msg.split(' ').length) * 180; // 1s + 180ms per word
    status = parseStatus(status);
    position = parsePosition(position);
    rank = parseRank(rank);
    if (rank === RANK.UNDEFINED) rank = RANK.NORMAL;

    toast.#message = msg;
    toast.#timeout = timeout;
    toast.#position = position;

    toast.rank = rank;
    toast.status = status;

    toast.#show();

    if (Toast.#instances.length > 1) Toast.#cascadeToasts();
    if (Toast.#instances.length > 0) Toast.#instances[0].#play(); // ensure the top-most toast is running
    return toast;
  }

  #toastCountBeforeMe = 0; // How many toasts were shown before this one, used for positioning when multiple toasts are shown
  #tmr = null;
  #message = null;
  #timeout = null;
  #position = null;
  #shownPromise = null;
  #shownPromiseResolve = null;

  get isShown() { return this.#shownPromise !== null; }
  get shownPromise() { return this.#shownPromise; }

  /**
   * Calculates the CSS styles for positioning the toast based on its `#position` and `#toastCountBeforeMe`.
   * @returns {string} The CSS styles for positioning the toast based on its position and count
   */
  #getPositionalStyles() {
    let offset = this.#toastCountBeforeMe * 5;
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

  // Clear the timer
  #clearTimer() {
    if (!this.#tmr) return;
    clearTimeout(this.#tmr);
    this.#tmr = undefined;
  }

  // If not already started, start a timer to destroy this toast
  #play() {
    if (this.#tmr) return;
    this.#tmr = setTimeout(() => this.destroy(), this.#timeout);
  }

  /**
   * Hide/Show popover element. Helper to reset z-index of visible toasts.
   */
  #toggle() {
    if (!this.isShown) return;

    // Hide on DOM
    this.hidePopover();

    // Show on DOM
    this.showPopover();
  }

  /**
   * Add the toast to the DOM.
   * @returns {Promise} A promise that resolves when the toast is destroyed.
   */
  #show() {
    if (this.isShown) return false;

    this.#toastCountBeforeMe = Toast.#instances.length > 0
      ? Toast.#instances[Toast.#instances.length - 1].#toastCountBeforeMe + 1
      : 0;

    this.setAttribute("role", "status");
    this.setAttribute("popover", "manual");
    this.classList.add(`r${this.rank}`, this.status);
    this.style.cssText = this.#getPositionalStyles();

    // Add to DOM
    document.body.appendChild(this);

    // Redraw DOM
    this.update();

    // Show on DOM
    this.showPopover();

    Toast.#instances.push(this);

    return this.#shownPromise = new Promise(res => this.#shownPromiseResolve = res);
  }

  /**
   * Destroy the toast message, removing it from the DOM and clearing any timers.
   * @returns {boolean} Returns false if the toast is not shown, otherwise cleans up.
   */
  destroy() {
    if (!this.isShown) return false;
    this.#clearTimer();

    // Hide from DOM
    this.hidePopover();
    this.#shownPromiseResolve();
    this.#shownPromise = null;

    // Allow time for the CSS transition to complete
    setTimeout(() => {
      // Remove from DOM
      document.body.removeChild(this);

      // Remove instances from cache
      Toast.#instances.shift();

      // Trigger next
      Toast.#nextToast();
    }, 200);

  }

  /** Draw the toast message */
  render() { return html`${this.#message}`; }
}

/**
 * Shortcut method to {@link Toast.toast}.
 */
export const toast = Toast.toast.bind(Toast);

window.customElements.define("az-toast", Toast);
