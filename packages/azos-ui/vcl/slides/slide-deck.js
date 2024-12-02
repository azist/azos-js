/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isNumber, isOf, isOfOrNull, isTrue } from "azos/aver";
import { AzosElement, Control, css, html } from "../../ui";

import { Slide } from "./slide";

export class SlideDeck extends Control {

  static styles = css`
:host { display: block; }
  `;

  static properties = {
    activeSlide: { type: Slide },
    autoTransition: { type: Number | false },
    autoWrap: { type: Boolean },
  }

  /** The current slide being displayed */
  #activeSlide = null;
  get activeSlide() { return this.#activeSlide; }
  set activeSlide(v) {
    isTrue(isOf(v, Slide).slideDeck === this);
    [...this.children].forEach(child => child.slot = undefined);
    this.#activeSlide = v;
    this.#activeSlide.slot = "body";
    this.requestUpdate();
  }

  #intervalTimer = null;

  constructor() {
    super();
    this.autoTransition = false;
    this.autoWrap = false;
  }

  #startIntervalTimer() { if (this.autoTransition) this.#intervalTimer = setInterval(() => this.nextSlide(), this.autoTransition); }

  /**
   * Add the element as a slide to the slide deck.
   * @param {AzosElement} element The element to add to a az-slide to be added to this SlideDeck
   */
  addAsSlide(element) {
    isOf(element, AzosElement);
    const slide = new Slide();
    slide.insertBefore(element);
    this.addSlide(slide, null);
  }

  /**
   *
   * @param {Slide} slide The slide to add to this SlideDeck
   * @param {Slide|null} child Position slide before child or at end if null.
   */
  addSlide(slide, child = null) {
    isOf(slide, Slide);
    isOfOrNull(child);
    this.insertBefore(slide, child);
  }

  /**
   *
   * @param {Slide} slide The slide to remove from this SlideDeck
   */
  removeSlide(slide) {
    isTrue(isOf(slide, Slide).slideDeck === this);
    this.removeChild(slide);
  }

  /**
   * Navigate to the next slide
   * @param {Boolean|null} forceWrap overrides the component's setting
   */
  nextSlide(forceWrap = null) {
    const children = [...this.children];
    const currentIndex = children.indexOf(this.activeSlide);
    let nextIndex = currentIndex;
    if (currentIndex < children.length - 1)
      nextIndex += 1;
    else
      if (forceWrap ?? this.autoWrap)
        nextIndex = 0;
      else {
        if (this.autoWrap) return; // Stay on the last slide
        clearInterval(this.#intervalTimer);
      }

    this.activeSlide = children[nextIndex];
  }

  /**
   * Navigate to the previous slide
   * @param {Boolean|null} forceWrap overrides the component's setting
   */
  previousSlide(forceWrap = null) {
    const children = [...this.children];
    const currentIndex = children.indexOf(this.activeSlide);
    let nextIndex = currentIndex;
    if (currentIndex > 0)
      nextIndex -= 1;
    else
      if (forceWrap ?? this.autoWrap)
        nextIndex = children.length - 1;
      else {
        if (this.autoWrap) return; // Stay on the first slide
        clearInterval(this.#intervalTimer);
      }

    this.activeSlide = children[nextIndex];
  }

  /**
   * Begin an interval timer to automatically transition
   * @param {Number} timeout number of milliseconds between transitions
   */
  startAutoTransition(restart = false, timeout = 1_000) {
    if (this.#intervalTimer) {
      if (!restart) return;
      clearInterval(this.#intervalTimer);
    }
    isNumber(timeout);
    this.autoTransition = timeout;
    this.#startIntervalTimer();
  }

  /**
   * Stop the interval timer
   */
  stopAutoTransition() {
    clearInterval(this.#intervalTimer);
    this.autoTransition = null;
  }

  firstUpdated() {
    super.firstUpdated();
    this.slideDeck = this.closest("az-slide-deck");
    const children = [...this.children];
    this.activeSlide = children[0];
    if (this.autoTransition) this.#startIntervalTimer(true);
  }

  renderControl() {
    return html`<slot name="body"></slot>`;
  }
}

window.customElements.define("az-slide-deck", SlideDeck);
window.customElements.define("az-slide", Slide);
