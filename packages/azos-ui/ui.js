/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html as lit_html,  css as lit_css, svg as lit_svg, LitElement } from "lit";
import { unsafeHTML as lit_unsafe_html } from "lit/directives/unsafe-html";

/** CSS template processing pragma: css`p{color: blue}` */
export const css = lit_css;

/** Html template processing pragma, use in `render()` e.g. "return html`<p>Hello ${this.name}!</p>`;" */
export const html = lit_html;

/** Svg template processing pragma */
export const svg = lit_svg;

/** Adds ability to include direct HTML snippets like so: html` This is ${verbatimHtml(raw)}` */
export const verbatimHtml = lit_unsafe_html;

/** Provides uniform base derivation point for `AzosElements` - all elements must derive from here */
export class AzosElement extends LitElement {
  constructor() {   super();   }


  /** Returns {@link Arena} instance from the first (great/grand)parent element that defines arena ref
   * @returns {Arena}
  */
  get arena(){
    let n = this.parentNode;
    while(typeof n.arena === 'undefined'){
      n =  (n.parentNode ?? n.host);
    }

    return n.arena;
  }

  render() { return html`>>AZOS ELEMENT<<`; }
}
