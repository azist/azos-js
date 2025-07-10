/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { css, html, Part } from "azos-ui/ui";
import STL_INLINE_GRID from "azos-ui/styles/grid";

export class GridSplit extends Part {

  static #sidSeed = 0;
  static #pidPrefix = "sgv";
  static styles = [  STL_INLINE_GRID, css`
    .resizable-cols {
      display: grid;
      grid-template-columns: repeat(var(--grid-splitter-left-cols), 1fr) 1ch repeat(var(--grid-splitter-right-cols), 1fr);
      gap: 0px;
      position: relative;
      margin-bottom: 0;
    }

    .resizable-col-left-top, .resizable-col-right-bottom {
      padding: 0.5em;
      overflow: auto;
      box-shadow: inset 0 0 0 rgba(0,0,0,0.05);
    }

    .resizable-col-left-top {
      border-right: 1px solid rgba(0,0,0,0.05);
    }

    .resizable-col-right-bottom {
      border-left: 1px solid rgba(0,0,0,0.05);
    }

    .resizable-cols .resizable-col-splitter {
      display: flex;
      cursor: col-resize;
      background: linear-gradient(to bottom, rgba(0,0,0,0.03), rgba(0,0,0,0.01));
      align-items: center;
      justify-content: center;
    }

    .resizable-cols .resizable-col-splitter:before {
      content: "⁝";
      display: block;
      text-align: center;
      color: rgba(0,0,0,0.3);
      line-height: 100%;
    }

    @media (max-width: 600px) {
      .resizable-col-splitter { display: none !important; }

      .resizable-cols { grid-template-columns: 1fr !important; }

      .resizable-col-left-top, .resizable-col-right-bottom {
        grid-column: span 1 !important;
        border: none !important;
      }
    }

  `];

  static properties = {
    sid: { type: Number },
    splitLeftCols: { type: Number },
    splitRightCols: { type: Number }
  };

  #row = null;
  #splitter = null;
  #startX = 0;
  #startLeftCols = 0;

  constructor() {
    super();
    this.sid = GridSplit.#sidSeed++;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#splitter) {
      this.#splitter.removeEventListener('mousedown', this.#onSplitterMouseDown);
      this.#splitter.removeEventListener('touchstart', this.#onSplitterTouchStart);
      document.removeEventListener('mousemove', this.#onSplitterMouseMove);
      document.removeEventListener('mouseup', this.#onSplitterMouseUp);
      document.removeEventListener('touchmove', this.#onSplitterTouchMove);
      document.removeEventListener('touchend', this.#onSplitterTouchEnd);
    }
  }

  firstUpdated() {
    this.#setupSplitter();
  }

  /**
   * Fallback method to handle invalid splitLeftCols and splitRightCols values.
   * Logs a warning and sets default values.
   * @param {string} fallbackWarning - The reason for the fallback.
   */
  #useFallback(fallbackWarning) {
    console.warn(`GridView: splitLeftCols + splitRightCols ${fallbackWarning}, got ${this.splitLeftCols} + ${this.splitRightCols}`);
    this.splitLeftCols = 3; // fallback to default
    this.splitRightCols = 9; // fallback to default
  }

  /**
   * Sets up the splitter element and its event listeners.
   * Validates the splitLeftCols and splitRightCols properties.
   * If they are invalid, it calls #useFallback to set default values.
   */
  #setupSplitter() {
    if(this.splitLeftCols+this.splitRightCols > 12) {
      this.#useFallback("exceeds 12");
    } else if(this.splitLeftCols < 1 || this.splitRightCols < 1) {
      this.#useFallback("must be at least 1");
    } else if(this.splitLeftCols + this.splitRightCols < 3) {
      this.#useFallback(" must be at least 3");
    }

    const pid = `${GridSplit.#pidPrefix}${this.sid}`;
    this.#row = this.shadowRoot.querySelector(`#${pid}`);
    this.#splitter = this.shadowRoot.querySelector(`#${pid} .resizable-col-splitter`);
    this.#splitter.addEventListener('mousedown', this.#onSplitterMouseDown);
    this.#splitter.addEventListener('touchstart', this.#onSplitterTouchStart, { passive: false });
  }

  /**
   * Handles the mouse down event for the splitter.
   * Initializes the starting position and left column count.
   * Adds mousemove and mouseup event listeners to handle resizing.
   */
  #onSplitterMouseDown = (e) => {
    e.preventDefault();
    this.#startX = e.clientX;
    this.#startLeftCols = parseInt(getComputedStyle(this.#row).getPropertyValue('--grid-splitter-left-cols'), 10);
    document.addEventListener('mousemove', this.#onSplitterMouseMove);
    document.addEventListener('mouseup', this.#onSplitterMouseUp);
  };

  /**
   * Handles the mouse move event for the splitter.
   * Calls #doResize with the current mouse position.
   */
  #onSplitterMouseMove = (e) => {
    e.preventDefault();
    this.#doResize(e.clientX);
  };

  /**
   * Handles the mouse up event for the splitter.
   * Removes the mousemove and mouseup event listeners to stop resizing.
   */
  #onSplitterMouseUp = () => {
    document.removeEventListener('mousemove', this.#onSplitterMouseMove);
    document.removeEventListener('mouseup', this.#onSplitterMouseUp);
  };

  /**
   * Handles the touch start event for the splitter.
   * Initializes the starting position and left column count.
   * Adds touchmove and touchend event listeners to handle resizing.
   */
  #onSplitterTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    this.#startX = e.touches[0].clientX;
    this.#startLeftCols = parseInt(getComputedStyle(this.#row).getPropertyValue('--grid-splitter-left-cols'), 10);
    document.addEventListener('touchmove', this.#onSplitterTouchMove, { passive: false });
    document.addEventListener('touchend', this.#onSplitterTouchEnd);
  };

  /**
   * Handles the touch move event for the splitter.
   * Calls #doResize with the current touch position.
   */
  #onSplitterTouchMove = (e) => {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    this.#doResize(e.touches[0].clientX);
  };

  /**
   * Handles the touch end event for the splitter.
   * Removes the touchmove and touchend event listeners to stop resizing.
   * This is necessary to clean up after the touch interaction ends.
   */
  #onSplitterTouchEnd = () => {
    document.removeEventListener('touchmove', this.#onSplitterTouchMove);
    document.removeEventListener('touchend', this.#onSplitterTouchEnd);
  };

  /**
   * Resizes the grid columns based on the current mouse position.
   * Calculates the new number of left columns based on the mouse movement.
   * Updates the CSS variables for left and right columns accordingly.
   * @param {number} currentX - The current X position of the mouse or touch event.
   */
  #doResize(currentX) {
    const delta = currentX - this.#startX;
    const totalWidth = this.#row.offsetWidth;
    const leftCols = parseInt(getComputedStyle(this.#row).getPropertyValue('--grid-splitter-left-cols'), 10);
    const rightCols = parseInt(getComputedStyle(this.#row).getPropertyValue('--grid-splitter-right-cols'), 10);
    const cols = leftCols + rightCols;
    const colWidth = totalWidth / cols;
    let newLeftCols = Math.round(this.#startLeftCols + delta / colWidth);
    newLeftCols = Math.max(1, Math.min(newLeftCols, cols - 1));
    this.#row.style.setProperty('--grid-splitter-left-cols', newLeftCols);
    this.#row.style.setProperty('--grid-splitter-right-cols', cols - newLeftCols);
    this.#row.style.gridTemplateColumns = `repeat(${newLeftCols}, 1fr) 1ch repeat(${cols - newLeftCols}, 1fr)`;
  }

  render() {
    return html`
      <div id="${GridSplit.#pidPrefix}${this.sid}" class="row resizable-cols" style="--grid-splitter-left-cols: ${this.splitLeftCols}; --grid-splitter-right-cols: ${this.splitRightCols};">
        <div class="resizable-col-left-top" style="grid-column: span var(--grid-splitter-left-cols);">
          <slot name="left-top"></slot>
        </div>
        <div class="resizable-col-splitter" title="Resize"></div>
        <div class="resizable-col-right-bottom" style="grid-column: span var(--grid-splitter-right-cols);">
          <slot name="right-bottom"></slot>
        </div>
      </div>
    `;
  }

}

customElements.define("az-grid-split", GridSplit);
