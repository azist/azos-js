/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Control, css, html } from "../../ui";

/** Provides a container that "sticks" when scrolling */
export class StickyContainer extends Control {

  static styles = css` :host { padding:0; margin:0; }`;
  static properties = {
    top: { type: Number },
    minWidth: { type: Number }, // below this width sticky is disabled
    selector: { type: String }
  };

  #placeholder = null;
  #resizeObserver = null;
  #isFixed = false;
  #startingOffset = 0;

  _scrollListener(){
    if(window.scrollY >= this.#startingOffset) {
      if(!this.#isFixed && window.innerWidth >= this.minWidth) this.fix();
    } else if(this.#isFixed) {
      this.unfix();
    }
  };

  _resizeListener() {
    if(!this.#isFixed) return;
    const r = this.#placeholder.getBoundingClientRect();
    this.style.left = `${Math.floor(r.left)}px`;
    this.style.width = `${Math.floor(r.width)}px`;
  };

  constructor() {
    super();
    this._scrollListener = this._scrollListener.bind(this);
    this._resizeListener = this._resizeListener.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if(this.top === undefined) this.top = 0;
    if(this.minWidth === undefined) this.minWidth = 600; // default min width for sticky
    // create a placeholder to retain the current layout
    this.#placeholder = document.createElement("div");
    window.addEventListener("scroll", this._scrollListener);
    window.addEventListener("resize", this._resizeListener);
  }

  firstUpdated() {
    this.#startingOffset = this.getBoundingClientRect().top + window.scrollY - (this.top ?? 0);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("scroll", this._scrollListener);
    window.removeEventListener("resize", this._resizeListener);
    this.stopResizeListener();
    this.#placeholder = null;
  }

  // fix into place
  fix(){
    const rect = this.getBoundingClientRect();
    // reduce jumping of the layout
    this.#placeholder.style.height = `${rect.height}px`;
    if(!this.#placeholder.parentElement) this.parentElement.insertBefore(this.#placeholder, this);

    this.style.position = "fixed";
    this.style.top = `${Math.floor(this.top)}px`;
    this.style.left = `${Math.floor(rect.left)}px`;
    this.style.width = `${Math.floor(rect.width)}px`;
    this.style.zIndex = "99"; // ensure it's above other elements but below the menu

    this.#isFixed = true;

    this.startResizeListener();
  }

  // unfix and restore
  unfix() {
    this.stopResizeListener();
    if(this.#placeholder.parentElement)  this.#placeholder.remove();
    this.style.position = "";
    this.style.top = "";
    this.style.left = "";
    this.style.width = "";
    this.style.zIndex = "";
    this.#isFixed = false;
  }

  startResizeListener(){
    if(!this.#placeholder || this.#resizeObserver) return;
    this.#resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        // If the placeholder is resized, adjust the sticky container width
        if(entry.target === this.#placeholder) {
          const r = this.#placeholder.getBoundingClientRect();
          this.style.width = `${Math.floor(r.width)}px`;
        }
      }
    });
    this.#resizeObserver.observe(this.#placeholder);
  }

  stopResizeListener(){
    if(!this.#resizeObserver) return;
    this.#resizeObserver.disconnect();
    this.#resizeObserver = null;
  }

  renderControl() {
    return html`<slot></slot>`;
  }
}

window.customElements.define("az-sticky-container", StickyContainer);
