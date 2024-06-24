/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html as lit_html, css as lit_css, svg as lit_svg, render as lit_render, LitElement } from "lit";
import { unsafeHTML as lit_unsafe_html } from "lit/directives/unsafe-html";
import { ref as lit_ref, createRef as lit_create_ref } from "lit/directives/ref";


/** CSS template processing pragma: css`p{color: blue}` */
export const css = lit_css;

/** Html template processing pragma, use in `render()` e.g. "return html`<p>Hello ${this.name}!</p>`;" */
export const html = lit_html;

/** Svg template processing pragma */
export const svg = lit_svg;

/** Adds ability to include direct HTML snippets like so: html` This is ${verbatimHtml(raw)}` */
export const verbatimHtml = lit_unsafe_html;

/** Directive to get DOM reference to rendered elements. Use like so: html` This is ${domRef(refOrCallback)}` */
export const domRef = lit_ref;

/** Helper method which creates a ref object which you can pass into `domRef(ref)` directive */
export const domCreateRef = lit_create_ref;

/** Helper method which renders template content into a specified root element e.g.: `renderInto(htmlResult, document.body)`*/
export const renderInto = lit_render;

/** Ranks define the "importance"/size of the element. 1 is the biggest/highest rank aka 'RANK.HUGE', 6 is the smallest aka 'RANK.TINY' */
export const RANK = Object.freeze({
  UNDEFINED:       0,
  HUGE:        1,
  LARGE:       2,
  NORMAL:      3,
  MEDIUM:      4,
  SMALL:       5,
  TINY:        6
});
const ALL_RANK_NAMES = ["undefined","huge","large","normal","medium","small","tiny"];

/**
 * Returns a numeric 0..6 rank representation of numeric or string specifier
 * @param {Number|string} v number or string value
 * @returns {Number} an integer specified 0..6. O denotes "UNSET"
 */
export function parseRank(v){
  if (typeof v ==="undefined" || v===null || v===undefined) return RANK.UNDEFINED;
  if (v >= 0 && v <= 6) return v | 0;
  const sv = v.toString().toLowerCase();
  const i = ALL_RANK_NAMES.indexOf(sv);
  if (i>=0) return i;
  return RANK.UNSET;
}


/** Provides uniform base derivation point for `AzosElements` - all elements must derive from here */
export class AzosElement extends LitElement {

  static properties = {
    status: {
      type: String,
      reflect: true,
      converter: {
        fromAttribute: (v) => {
          return v;
        },
        toAttribute: (v) => {
          return v;
        }
      }
    },
    rank:   {
      type: Number,
      reflect: true,
      converter: { fromAttribute: (v) => parseRank(v) }
    }
  };

  #arena = null;
  constructor() {
     super();
     this.status = null;
     this.rank = RANK.NORMAL;
  }

  /** Returns {@link Arena} instance from the first (great/grand)parent element that defines arena ref
   * @returns {Arena}
  */
  get arena(){
    if (this.#arena === null){
      let n = this.parentNode;
      while(typeof n.arena === 'undefined'){
        n =  (n.parentNode ?? n.host);
      }
      this.#arena =  n.arena;
    }
    return this.#arena;
  }

  /** Returns custom HTML element tag name for this element type registered with `customElements` collection */
  get customElementTagName() { return customElements.getName(this.constructor); }

  render() { return html`>>AZOS ELEMENT<<`; }
}
