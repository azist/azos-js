/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { AzosElement, css, html } from "./ui";
import { STOCK_IMAGES, ICONS } from "azos/bcl/img-registry";
import "./parts/button";
import { Toast } from "./toast";

export class ImageGallery extends AzosElement {

  static styles = css`
    :host { display: block; margin-top: 1em; margin-bottom: 1em; }
    .gallery{
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: center;
      margin:2em 0;
    }
    .item{
      padding: 1em;
      text-align: center;
    }
    .item-title{
      font-size: 1.15em;
      font-weight: bold;
      opacity: .8;
    }
    svg{
      height: 1.5em;
      width: 1.5em;
      margin-bottom:.5em;
    }
  `;

  static properties = {
    gallery: { type: String } //for now, STOCK_IMAGES or ICONS
  };

  constructor() { super(); }

  #copySVG(e) {
    const dataToCopy = e.target.dataset.code;
    const dataTitle = e.target.dataset.uri;
    if (dataToCopy) {
      navigator.clipboard.writeText(dataToCopy)
        .then(() => {
          Toast.toast(`SVG Code for ${dataTitle} copied!`);
        }).catch((err) => {
          console.error('Failed to copy code for ', dataTitle, err);
        });
    } else {
      console.error('No data attribute found to copy!');
    }
  }

  render() {
    //const items = [...this.gallery]; //currently doesn't work
    const stock = [...STOCK_IMAGES];
    const icons = [...ICONS];
    const items = this.gallery === 'STOCK_IMAGES' ? stock : icons;
    console.table(items);
    return html`
      <h1>${this.gallery} Gallery</h1>
      <div class="gallery">
        ${items.map((icon) => html`
          <div class="item">
            ${icon.c}
            <p class="item-title">
              ${icon.uri}
            </p>
            <az-button
              title="Copy SVG Code"
              data-code="${icon.c}"
              data-uri="${icon.uri}"
              scope="this"
              @click="${this.#copySVG}"
            ></az-button>
          </div>
        `)}
      </div>
    `;
  }
}

window.customElements.define("az-image-gallery", ImageGallery);
