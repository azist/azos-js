/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/


/*
  SVG Stock Images provided by

  GOOGLE FONTS Project https://fonts.google.com/icons
  under Apache 2.0 License https://www.apache.org/licenses/LICENSE-2.0.html

Copyright 2024 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/*
 Image source settings
 =====================

 Google Fonts
    https://fonts.google.com/icons?icon.set=Material+Symbols&selected=Material+Symbols+Outlined:close:FILL@0;wght@200;GRAD@0;opsz@24&icon.size=24&icon.color=%23e8eaed&icon.style=Sharp

 Google Fonts Icon Parameters:
    Weight: 200
    Grade: 0
    Optical Size: 24
    Style: Material Symbols (New), Sharp
*/


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
// TODO: Remove "fill" attribute from paths, rects, etc. INSTEAD Control color with CSS styles/classes (forces default SVG fill color to 0x00000)
export const STOCK_IMAGES = Object.freeze([
  {
    uri: "xyz-test-cmd2",
    f: "svg",
    c: `<svg width="28px" height="28px" viewBox="0 0 24 24"><path d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z"/><path d="M10 9H14L10 13H14" stroke-linejoin="round"/><path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" /></svg>`
  }, {
    uri: "adlib-new-query",
    f: "svg",
    c: `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><rect width="6" height="28" x="11" y="0" fill="white"/><rect width="28" height="6" x="0" y="11" fill="white"/></svg>`
  }, {
    uri: "adlib-prefill-query",
    f: "svg",
    c: `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><path d="M3 20.5V25h4.5l13.3-13.3-4.5-4.5L3 20.5zM24.7 8.3c.4-.4.4-1 0-1.4l-3.6-3.6c-.4-.4-1-.4-1.4 0L17 5.6l4.5 4.5 3.2-3.3z" fill="white"/><rect x="18" y="18" width="2" height="8" fill="white"/><rect x="15" y="21" width="8" height="2" fill="white"/></svg>`
  }, {
    uri: "cmd-chronicle-filter",
    f: "svg",
    c: `<svg width="28px" height="28px" viewBox="0 0 24 24"><path d="M22 3.58002H2C1.99912 5.28492 2.43416 6.96173 3.26376 8.45117C4.09337 9.94062 5.29 11.1932 6.73999 12.09C7.44033 12.5379 8.01525 13.1565 8.41062 13.8877C8.80598 14.6189 9.00879 15.4388 9 16.27V21.54L15 20.54V16.25C14.9912 15.4188 15.194 14.599 15.5894 13.8677C15.9847 13.1365 16.5597 12.5178 17.26 12.07C18.7071 11.175 19.9019 9.92554 20.7314 8.43988C21.5608 6.95422 21.9975 5.28153 22 3.58002Z" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
]);

/** Library of GDI brand logos as SVG icons */
export const GDI_BRANDS = Object.freeze([
  {
    uri: "brand-gdi",
    f: "svg",
    c: ``
  }, {
    uri: "brand-patio",
    f: "svg",
    c: ``
  }, {
    uri: "brand-stanek",
    f: "svg",
    c: ``
  }, {
    uri: "brand-hcc",
    f: "svg",
    c: ``
  }, {
    uri: "brand-apex",
    f: "svg",
    c: ``
  }, {
    uri: "brand-uwd",
    f: "svg",
    c: ``
  }, {
    uri: "brand-tba",
    f: "svg",
    c: ``
  }, {
    uri: "brand-champ",
    f: "svg",
    c: ``
  }, {
    uri: "brand-yhic",
    f: "svg",
    c: ``
  }, {
    uri: "brand-kd",
    f: "svg",
    c: ``
  }, {
    uri: "brand-hpa",
    f: "svg",
    c: ``
  }, {
    uri: "brand-leafguard",
    f: "svg",
    c: ``
  }, {
    uri: "brand-englert",
    f: "svg",
    c: ``
  },
]);

/** Library of Common Material Icons (filled standard style) */
export const ICONS = Object.freeze([
  {
    uri: "icon-bolt",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M11 15H6L13 1V9H18L11 23V15Z" /></svg>`
  }, {
    uri: "icon-arrow-down",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z" /></svg>`
  }, {
    uri: "icon-arrow-down-left",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M19,6.41L17.59,5L7,15.59V9H5V19H15V17H8.41L19,6.41Z" /></svg>`
  }, {
    uri: "icon-arrow-down-right",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M5,6.41L6.41,5L17,15.59V9H19V19H9V17H15.59L5,6.41Z" /></svg>`
  }, {
    uri: "icon-arrow-left",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>`
  }, {
    uri: "icon-arrow-right",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" /></svg>`
  }, {
    uri: "icon-arrow-up",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" /></svg>`
  }, {
    uri: "icon-arrow-up-left",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M19,17.59L17.59,19L7,8.41V15H5V5H15V7H8.41L19,17.59Z" /></svg>`
  }, {
    uri: "icon-arrow-up-right",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z" /></svg>`
  }, {
    uri: "icon-check",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" /></svg>`
  }, {
    uri: "icon-check-circle",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg>`
  }, {
    uri: "icon-close",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>`
  }, {
    uri: "icon-close-circle",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg>`
  }, {
    uri: "icon-delete",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>`
  }, {
    uri: "icon-download",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M2 12H4V17H20V12H22V17C22 18.11 21.11 19 20 19H4C2.9 19 2 18.11 2 17V12M12 15L17.55 9.54L16.13 8.13L13 11.25V2H11V11.25L7.88 8.13L6.46 9.55L12 15Z" /></svg>`
  }, {
    uri: "icon-filter",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" /></svg>`
  }, {
    uri: "icon-grid",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M12 16C13.1 16 14 16.9 14 18S13.1 20 12 20 10 19.1 10 18 10.9 16 12 16M12 10C13.1 10 14 10.9 14 12S13.1 14 12 14 10 13.1 10 12 10.9 10 12 10M12 4C13.1 4 14 4.9 14 6S13.1 8 12 8 10 7.1 10 6 10.9 4 12 4M6 16C7.1 16 8 16.9 8 18S7.1 20 6 20 4 19.1 4 18 4.9 16 6 16M6 10C7.1 10 8 10.9 8 12S7.1 14 6 14 4 13.1 4 12 4.9 10 6 10M6 4C7.1 4 8 4.9 8 6S7.1 8 6 8 4 7.1 4 6 4.9 4 6 4M18 16C19.1 16 20 16.9 20 18S19.1 20 18 20 16 19.1 16 18 16.9 16 18 16M18 10C19.1 10 20 10.9 20 12S19.1 14 18 14 16 13.1 16 12 16.9 10 18 10M18 4C19.1 4 20 4.9 20 6S19.1 8 18 8 16 7.1 16 6 16.9 4 18 4Z" /></svg>`
  }, {
    uri: "icon-heart",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" /></svg>`
  }, {
    uri: "icon-home",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" /></svg>`
  }, {
    uri: "icon-login",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7M20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z" /></svg>`
  }, {
    uri: "icon-logout",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12M4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" /></svg>`
  }, {
    uri: "icon-menu",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" /></svg>`
  }, {
    uri: "icon-more-h",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" /></svg>`
  }, {
    uri: "icon-more-v",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" /></svg>`
  }, {
    uri: "icon-open-in-new",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" /></svg>`
  }, {
    uri: "icon-refresh",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" /></svg>`
  }, {
    uri: "icon-search",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" /></svg>`
  }, {
    uri: "icon-star",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>`
  }, {
    uri: "icon-star-half",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27V2Z" /></svg>`
  }, {
    uri: "icon-upload",
    f: "svg",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 28 28"><path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" /></svg>`
  },
]);
