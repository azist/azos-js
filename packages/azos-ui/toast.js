/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AzosElement, html, css, STATUS, RANK, POSITION, parseRank, parseStatus } from "./ui.js";

/**
 * Toasts are popover AzosElement messages that self-destruct after a timeout period (default 10s).
 */
export class Toast extends AzosElement {

  static styles = css`
dialog{
  display: block;
  border: none;
  border-radius: 0.25em;
  background: rgba(from var(--s-default-bg) r g b / 0.85);
  color:  var(--s-default-fg);
  overflow: hidden;
  padding: 1em;
  box-shadow: 2px 2px 14px #5f5f5fa5;
  opacity: 0;
}

dialog.modal::backdrop{
  background: var(--modal-spin-backdrop-bg);
  backdrop-filter: var(--modal-spin-backdrop-filter);
}

dialog:popover-open, dialog[open]{
  opacity: 1;
  transition: 0.2s ease-in;
  inset: unset;
  margin: 0;
}

@starting-style{dialog:popover-open, dialog[open]{opacity: 0;}}


dialog:focus-visible, dialog:hover{ outline: none; }

.r1 { font-size: var(--r1-fs); }
.r2 { font-size: var(--r2-fs); }
.r3 { font-size: var(--r3-fs); }
.r4 { font-size: var(--r4-fs); }
.r5 { font-size: var(--r5-fs); }
.r6 { font-size: var(--r6-fs); }
.ok      { background: rgba(from var(--s-ok-bg-ctl) r g b / 8);     color: var(--s-ok-fg-ctl);    text-shadow: 0px 0px 6px hsl(from var(--s-ok-fg-ctl) h s 85% / .95);}
.info    { background: rgba(from var(--s-info-bg-ctl) r g b / .85);   color: var(--s-info-fg-ctl);  text-shadow: 0px 0px 6px hsl(from var(--s-info-fg-ctl) h s 85% / .95);}
.warning { background: rgba(from var(--s-warn-bg-ctl) r g b / .85);   color: var(--s-warn-fg-ctl);  text-shadow: 0px 0px 6px hsl(from var(--s-warn-fg-ctl) h s 85% / .95);}
.alert   { background: rgba(from var(--s-alert-bg-ctl) r g b / .85);  color: var(--s-alert-fg-ctl); text-shadow: 0px 0px 6px hsl(from var(--s-alert-fg-ctl) h s 85% / .95);}
.error   { background: rgba(from var(--s-error-bg-ctl) r g b / .85);  color: var(--s-error-fg-ctl); text-shadow: 0px 0px 6px hsl(from var(--s-error-fg-ctl) h s 85% / .95);}
`;

  static #instances = [];

  /** Start the next toast's timer */
  static #nextToast() {
    if (Toast.instances.length > 0) {
      Toast.instances[0].play();
    }
  }

  /** New toasts naturally are popped over old toasts. Fix that by cascading by FIFO */
  static #cascadeToasts() {
    Toast.instances.reverse().forEach(toast => toast.toggle());
  }

  /** Get all toast instances */
  static get instances() { return [...Toast.#instances] }

  /** Get total toasts in queue */
  static get toastCount() { return Toast.#instances.length || 0; }

  /**
   * Construct a new toast message to display on the screen with the given styling
   *  around RANK, STATUS, and POSITION. I
   * @param {string|null} msg The message to display in the toast
   * @param {number} timeout The length of time to display the toast (default: 10s)
   * @param {RANK} rank The rank
   * @param {STATUS} status The status
   * @param {POSITION} position The position for where to display on the screen
   * @returns The constructed toast added to Toast.#instances
   */
  static toast(msg = null, timeout = 10_000, rank = RANK.NORMAL, status = STATUS.DEFAULT, position = POSITION.DEFAULT) {
    const toast = new Toast();
    toast.#message = msg;
    toast.#timeout = timeout;
    toast.#rank = rank;
    toast.#status = status;
    toast.#position = position;

    Toast.#instances.push(toast);
    toast.show();

    this.#cascadeToasts();
    this.#instances[0]?.play(); // ensure the top-most toast is running
    return toast;
  }

  #tmr = null;
  #isShown = false;
  #message = null;
  #timeout = null;
  #rank = null;
  #status = null;
  #position = null;

  /** Calculate the position styles for this rendered Toast */
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

  constructor() { super(); }

  /** Clear the timer */
  #clearTimer() {
    if (!this.#tmr) return;
    clearTimeout(this.#tmr);
    this.#tmr = undefined;
  }

  /** If not already started, start a timer to destroy this toast */
  play() {
    if (this.#tmr) return;
    this.#tmr = setTimeout(() => this.destroy(), this.#timeout);
  }

  /** Hide/Show popover element. Helper to reset z-index of visible toasts. */
  toggle() {
    const t = this.$("toast");

    // Hide on DOM
    t.hidePopover();

    // Show on DOM
    t.showPopover();
  }

  /** Add element to dom and show */
  show() {
    if (this.#isShown) return false;

    // Add to DOM
    document.body.appendChild(this);

    // Redraw DOM
    this.update();

    // Show on DOM
    this.$("toast").showPopover();
    this.#isShown = true;
  }

  /** Destroy and clean up the toast element. Trigger next toast. */
  destroy() {
    if (!this.#isShown) return false;
    this.#clearTimer();

    // Hide from DOM
    this.$("toast").hidePopover();
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
    return html`<dialog id=toast popover=manual class="${rankStyle} ${statusStyle}" style="${positionStyle}">${this.#message}</dialog>`;
  }
}

window.customElements.define("az-toast", Toast);
