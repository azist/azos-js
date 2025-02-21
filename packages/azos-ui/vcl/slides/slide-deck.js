/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOf, isOfOrNull, isTrue } from "azos/aver";
import { isNumber, asInt, isString } from "azos/types";
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
    activeSlide: { type: Object | String },
    activeSlideIndex: { type: Number, reflect: true },
    autoTransitionInterval: { type: Number, reflect: true },
    loop: { type: Boolean, reflect: true },
  }

  #elementFirstRendered = false;

  get slides() { return [...this.children].filter(child => child instanceof Slide); }

  /** The current slide being displayed */
  #activeSlide = null;
  get activeSlide() { return this.#activeSlide; }
  set activeSlide(v) {
    if (isString(v)) v = this.slides[v];
    isTrue(isOf(v, Slide).slideDeck === this);
    if (this.#activeSlide === v) return;
    if (this.#elementFirstRendered && !this.dispatchEvent(new CustomEvent("slideChanging", { detail: { slide: v }, bubbles: true, cancelable: true }))) return;

    const oldSlide = this.#activeSlide;
    const oldIndex = this.activeSlideIndex;

    this.slides.forEach(child => child.slot = undefined);
    v.slot = "body";
    this.#activeSlide = v;
    this.update({ "activeSlide": oldSlide, "activeSlideIndex": oldIndex });
    if (this.#elementFirstRendered) this.dispatchEvent(new CustomEvent("slideChanged", { detail: { slide: v }, bubbles: true }));
  }

  /** Set the active slide by index; atRender, this needs to be delayed until firstUpdate */
  #pendingActiveSlideIndex = null;
  get activeSlideIndex() { return this.slides.indexOf(this.#activeSlide); }

  /**
   * Slide.slideDeck is null until it is rendered in the DOM. Because of this, <az-slide-deck activeSlideIndex=2...> would
   *  fail to set the active slide due to the averment failure (@see set activeSlide). activeSlideIndex setter
   *  typically does not set #activeSlideIndex except for this edge case. #activeSlideIndex is only set via
   *  activeSlide setter.
   */
  set activeSlideIndex(v) {
    if (!this.#elementFirstRendered) {
      this.#pendingActiveSlideIndex = v;
      return;
    }

    const childCount = this.slides.length;

    if (!this.loop && (v > childCount - 1 || v < 0)) return;
    const step = (v < 0) ? childCount : 0;
    v = (v + step) % childCount; // handles forward and backward wrapping

    this.activeSlide = this.slides[v];
    this.requestUpdate();
  }

  /** Set to 0 to stop auto-transitioning */
  #autoTransitionInterval = 0;
  get autoTransitionInterval() { return this.#autoTransitionInterval; }
  set autoTransitionInterval(v) {
    this.#stopTimer();
    this.#autoTransitionInterval = isNumber(v) ? asInt(v) : 0;
    if (this.#autoTransitionInterval > 0) this.#startTimer();
    this.requestUpdate();
  }

  constructor() { super(); }

  #timer = null;
  #startTimer() { if (this.autoTransitionInterval) this.#timer = setTimeout(() => this.nextSlide(), this.#activeSlide?.autoTransitionInterval ?? this.autoTransitionInterval); }
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
    this.addSlide(slide);
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

  transitionBy(count, forceWrap = null) {
    const lastChildIndex = this.slides.length - 1;
    let nextIndex;
    if (forceWrap) nextIndex = (this.activeSlideIndex + count) % lastChildIndex;
    else if (this.activeSlideIndex + count > lastChildIndex) nextIndex = lastChildIndex - 1;
    else nextIndex = this.activeSlideIndex + count;

    this.#stopTimer();
    if (this.activeSlideIndex === nextIndex) return;
    this.activeSlide = this.slides[nextIndex];
    this.#startTimer();
  }

  /**
   * Navigate to the next slide
   * @param {Boolean|null} forceWrap overrides the component's setting
   */
  nextSlide(forceWrap = null) {
    const currentIndex = this.slides.indexOf(this.activeSlide);
    this.#stopTimer();
    let nextIndex = currentIndex;
    if (currentIndex < this.slides.length - 1)
      nextIndex += 1;
    else
      if (forceWrap ?? this.loop)
        nextIndex = 0;
      else {
        if (this.loop) return; // Stay on the last slide
        this.#stopTimer();
      }

    this.activeSlide = this.slides[nextIndex];
    this.#startTimer();
  }

  /**
   * Navigate to the previous slide
   * @param {Boolean|null} forceWrap overrides the component's setting
   */
  previousSlide(forceWrap = null) {
    const currentIndex = this.slides.indexOf(this.activeSlide);
    this.#stopTimer();
    let nextIndex = currentIndex;
    if (currentIndex > 0)
      nextIndex -= 1;
    else
      if (forceWrap ?? this.loop)
        nextIndex = this.slides.length - 1;
      else {
        if (this.loop) return; // Stay on the first slide
        clearInterval(this.#timer);
      }

    this.activeSlide = this.slides[nextIndex];
    this.#startTimer();
  }

  /**
   * Begin an interval timer to automatically transition
   * @param {Number} timeout number of milliseconds between transitions
   */
  startAutoTransition(timeout = 1_000) { this.autoTransitionInterval = timeout; }

  /** Stop the interval timer */
  stopAutoTransition() { this.autoTransitionInterval = 0; }

  firstUpdated() {
    super.firstUpdated();
    // @see set activeSlideIndex for details about this edge case
    if (this.slides.length && this.#pendingActiveSlideIndex) this.activeSlide = this.slides[this.#pendingActiveSlideIndex ?? 0];
    this.#pendingActiveSlideIndex = null;
    if (this.autoTransitionInterval) this.#startTimer();
    this.#elementFirstRendered = true;
    this.update();
  }

  renderControl() {
    return html`<slot name="body"></slot>`;
  }
}

window.customElements.define("az-slide-deck", SlideDeck);
window.customElements.define("az-slide", Slide);
