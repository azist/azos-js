/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isNumber, isOf, isOfOrNull, isTrue } from "azos/aver";
import { AzosElement, Control, css, html } from "../../ui";

import { Slide } from "./slide";

/**
 * This produces a slide control similar to that of a TabView but without the tabs.
 *
 * Properties:
 *  - activeSlide: the slide currently in view
 *  - autoTransitionInterval: every X ms, transition the slides automatically
 *  - loop: true to
 *
 * Events:
 *  - slideChanging: detail: {slide}
 *    - Cancelable: synchronously only! (e.preventDefault())
 *  - slideChanged: detail: {slide}
 */
export class SlideDeck extends Control {

  static styles = css`
:host { display: block; }
  `;

  static properties = {
    activeSlide: { type: Slide },
    autoTransitionInterval: { type: Number | false },
    loop: { type: Boolean },
  }

  /** The current slide being displayed */
  #activeSlide = null;
  get activeSlide() { return this.#activeSlide; }
  set activeSlide(v) {
    isTrue(isOf(v, Slide).slideDeck === this);
    let initialState = false;
    if (this.#activeSlide !== null) {
      initialState = true;
      if (!this.dispatchEvent(new CustomEvent("slideChanging", { detail: { slide: v }, bubbles: true, cancelable: true }))) return;
    }

    [...this.children].forEach(child => child.slot = undefined);
    this.#activeSlide = v;
    this.#activeSlide.slot = "body";
    this.requestUpdate();
    if (!initialState) this.dispatchEvent(new CustomEvent("slideChanged", { detail: { slide: v }, bubbles: true }));
  }

  #timer = null;

  constructor() {
    super();
    this.autoTransitionInterval = false;
    this.loop = false;
  }

  #startTimer() {
    if (this.autoTransitionInterval) this.#timer = setTimeout(() => this.nextSlide(), this.#activeSlide.autoTransitionInterval ?? this.autoTransitionInterval);
  }

  #stopTimer() {
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
  }

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
    this.#stopTimer();
    let nextIndex = currentIndex;
    if (currentIndex < children.length - 1)
      nextIndex += 1;
    else
      if (forceWrap ?? this.loop)
        nextIndex = 0;
      else {
        if (this.loop) return; // Stay on the last slide
        clearInterval(this.#timer);
      }

    this.activeSlide = children[nextIndex];
    this.#startTimer();
  }

  /**
   * Navigate to the previous slide
   * @param {Boolean|null} forceWrap overrides the component's setting
   */
  previousSlide(forceWrap = null) {
    const children = [...this.children];
    const currentIndex = children.indexOf(this.activeSlide);
    this.#stopTimer();
    let nextIndex = currentIndex;
    if (currentIndex > 0)
      nextIndex -= 1;
    else
      if (forceWrap ?? this.loop)
        nextIndex = children.length - 1;
      else {
        if (this.loop) return; // Stay on the first slide
        clearInterval(this.#timer);
      }

    this.activeSlide = children[nextIndex];
    this.#startTimer();
  }

  /**
   * Begin an interval timer to automatically transition
   * @param {Number} timeout number of milliseconds between transitions
   */
  startAutoTransition(timeout = 1_000) {
    isNumber(timeout);
    this.#stopTimer();
    this.autoTransitionInterval = timeout;
    this.#startTimer();
  }

  /**
   * Stop the interval timer
   */
  stopAutoTransition() {
    this.#stopTimer();
    this.autoTransitionInterval = null;
  }

  firstUpdated() {
    super.firstUpdated();
    this.slideDeck = this.closest("az-slide-deck");
    const children = [...this.children];
    this.activeSlide = children[0];
    if (this.autoTransitionInterval) this.#startTimer();
  }

  renderControl() {
    return html`<slot name="body"></slot>`;
  }
}

window.customElements.define("az-slide-deck", SlideDeck);
window.customElements.define("az-slide", Slide);
