/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html as lit_html, css as lit_css, svg as lit_svg, LitElement } from "lit";

/** CSS template processing pragma: css`p{color: blue}` */
export const css = lit_css;
//export function css(content, ...values){
//  return lit_css(content, values);
//}
/** Html template processing pragma, use in `render()` e.g. "return html`<p>Hello ${this.name}!</p>`;" */
export const html = lit_html;
//export function html(content, values){
//  return lit_html(content, values);
//}
/** Svg template processing pragma */
export const svg = lit_svg;
//export function svg(content, ...values){
//  return lit_svg(content, values);
//}

/** Provides uniform base derivation point for `AzosElements` - all elements must derive from here */
export class AzosElement extends LitElement {
  constructor() {   super();   }
  render() { return html`>>AZOS ELEMENT<<`; }
}
