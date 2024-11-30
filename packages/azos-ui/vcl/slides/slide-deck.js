import { isOf, isTrue } from "azos/aver";
import { Control, html } from "../../ui";

import { Slide } from "./slide";

export class SlideDeck extends Control {

  static properties = {
    activeSlide: { type: Slide },
    timeout: { type: Number },
  }

  _activeSlide = null;
  get activeSlide() { return this._activeSlide; }
  set activeSlide(v) {
    isTrue(isOf(v, Slide).slideDeck === this);
    [...this.children].forEach(child => child.slot = undefined);
    this._activeSlide = v;
    this._activeSlide.slot = "body";
    this.requestUpdate();
  }

  constructor() {
    super();
    this.timeout = 30_000;
  }

  addSlide(slide, atIndex = null) {
    isOf(slide, Slide);
    this.insertChild(slide, atIndex);
  }

  removeSlide(slide) {
    isTrue(isOf(slide, Slide).slideDeck === this);
    this.removeChild(slide);
  }

  firstUpdated() {
    super.firstUpdated();
    this.slideDeck = this.closest("az-slide-deck");
    const children = [...this.children];
    this.activeSlide = children[0];
    if (this.timeout) {
      setInterval(() => {
        const currentIndex = children.indexOf(this.activeSlide);
        const nextIndex = currentIndex < children.length - 1 ? currentIndex + 1 : 0;
        this.activeSlide = children[nextIndex];
      }, this.timeout);
    }
  }

  renderControl() {
    return html`<slot name="body"></slot>`;
  }
}

window.customElements.define("az-slide-deck", SlideDeck);
window.customElements.define("az-slide", Slide);
