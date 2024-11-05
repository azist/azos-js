/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isNonEmptyString, isOf } from "../aver.js";
import { config, ConfigNode, makeNew } from "../conf.js";
import { CONTENT_TYPE } from "../coreconsts.js";
import { dflt } from "../strings.js";
import { Module } from "../modules.js";


export class ImageRegistry extends Module {

  //stores mappings of: URI -> [bucket] , bucket contains keys that we search by and record score
  #map;

  constructor(app, cfg) {
    super(app, cfg);

    this.#map = new Map();

    cfg = cfg.get("icons", "images", "imgs");

    if (!cfg) cfg = config(STOCK_IMAGES).root;
    for (const cfgRec of cfg.getChildren(false)) {
      const uri = isNonEmptyString(cfgRec.getString("uri"));
      const rec = makeNew(ImageRecord, cfgRec, null, ImageRecord);
      this.register(uri, rec);
    }
  }

  resolve(uri, format, { isoLang, theme, media } = {}) {
    isNonEmptyString(uri);
    isNonEmptyString(format);
    isoLang = dflt(isoLang, "eng");
    theme = dflt(theme, "any"); // theme agnostic
    media = dflt(media, "ico64");

    const bucket = this.#map.get(uri);
    if (!bucket) return null;

    let bestRec = null;
    for (const rec of bucket) {

      if (rec.format !== format) continue;
      if (rec.isoLang && rec.isoLang !== isoLang) continue;
      if (rec.theme && rec.theme !== theme) continue;
      if (rec.media && rec.media !== media) continue;

      if (bestRec === null || rec.score > bestRec.score) bestRec = rec;
    }

    return bestRec;
  }

  register(uri, iRec) {
    isNonEmptyString(uri);
    isOf(iRec, ImageRecord);

    ///will put into existing bucket or a new one into map
    let bucket = this.#map.get(uri);
    if (!bucket) {
      bucket = [];
      this.#map.set(uri, bucket);
    }
    bucket.push(iRec);
  }

  unregister() {
    ///will take out of existing bucket
  }

}

export class ImageRecord {

  #format;
  #isoLang;
  #theme;
  #media;
  #score = 0;
  #contentType;
  #content;

  /** @param {ConfigNode} cfg */
  constructor(cfg) {
    isOf(cfg, ConfigNode);

    // required
    this.#format = isNonEmptyString(cfg.getString(["format", "fmt", "f"], null));

    this.#isoLang = cfg.getString(["isoLang", "lang", "iso", "i"], null);
    this.#theme = cfg.getString(["theme", "t"], null);
    this.#media = cfg.getString(["media", "m"], null);

    this.#contentType = cfg.getString(["contentType", "ctp"], CONTENT_TYPE.IMG_SVG);
    this.#content = cfg.getString(["content", "img", "image", "c"]);

    if (this.#media) this.#score += 1_000;
    if (this.#isoLang) this.#score += 100;
    if (this.#theme) this.#score += 1;
  }

  get format() { return this.#format; }
  get isoLang() { return this.#isoLang; }
  get theme() { return this.#theme; }
  get media() { return this.#media; }
  get score() { return this.#score; }
  get content() { return this.#content; }
  get contentType() { return this.#contentType; }

  produceContent() { return { ctp: this.#contentType, content: this.#content }; }
}

/** Configuration snippet provides base stock system icons/images. */
export const STOCK_IMAGES = Object.freeze([
  {
    uri: "xyz-test-cmd2", f: "svg", c: `<svg width="28px" height="28px" viewBox="0 0 24 24">
      <path d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z"/>
      <path d="M10 9H14L10 13H14" stroke-linejoin="round"/>
      <path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" />
    </svg>`
  }, {
    uri: "adlib-new-query", f: "svg", c: `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
        <rect width="6" height="28" x="11" y="0" fill="white"/>
        <rect width="28" height="6" x="0" y="11" fill="white"/>
      </svg>`
  }, {
    uri: "adlib-prefill-query", f: "svg", c: `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 20.5V25h4.5l13.3-13.3-4.5-4.5L3 20.5zM24.7 8.3c.4-.4.4-1 0-1.4l-3.6-3.6c-.4-.4-1-.4-1.4 0L17 5.6l4.5 4.5 3.2-3.3z" fill="white"/>
        <rect x="18" y="18" width="2" height="8" fill="white"/>
        <rect x="15" y="21" width="8" height="2" fill="white"/>
      </svg>`
  }, {
    uri: "cmd-chronicle-filter", f: "svg", c: `<svg width="28px" height="28px" viewBox="0 0 24 24">
        <path d="M22 3.58002H2C1.99912 5.28492 2.43416 6.96173 3.26376 8.45117C4.09337 9.94062 5.29 11.1932 6.73999 12.09C7.44033 12.5379 8.01525 13.1565 8.41062 13.8877C8.80598 14.6189 9.00879 15.4388 9 16.27V21.54L15 20.54V16.25C14.9912 15.4188 15.194 14.599 15.5894 13.8677C15.9847 13.1365 16.5597 12.5178 17.26 12.07C18.7071 11.175 19.9019 9.92554 20.7314 8.43988C21.5608 6.95422 21.9975 5.28153 22 3.58002Z" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
  },
]);
