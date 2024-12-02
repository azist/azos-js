/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Applet } from "../applet";
import { css, html } from "../ui";
import "../image-gallery";

export class XyzAppletGallery extends Applet {

  static styles = css`
    :host { display: block; padding: 1ch 2ch; }
  `;

  //static properties={}

  constructor() {
    super();
  }

  render() {
    return html`
      <az-image-gallery gallery="STOCK_IMAGES"></az-image-gallery>
      <hr style="margin-top:50px;margin-bottom:50px;">
      <az-image-gallery gallery="ICONS"></az-image-gallery>
    `
  }
}

window.customElements.define("xyz-applet-gallery", XyzAppletGallery);
