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


import { isNonEmptyString, isOf, isStringOrNull } from "../aver.js";
import { config, ConfigNode, makeNew } from "../conf.js";
import { CONTENT_TYPE } from "../coreconsts.js";
import { Module } from "../modules.js";
import { isBool, isNumber, isString } from "../types.js";

/** Contains a registry of {@link ImageRecord} instances which describe images.
 * The registry keeps images by their logical URI strings, resolving each request
 * by selecting the most appropriate image record for the requested URI.
 * Image records are image data record variations containing: `format`, `theme`, `media`, `isoLanguage`.
 * Use {@link resolveSpec} method to get images from string spec like `jpg://welcome-banner-hello1?iso=deu&theme=bananas&media=print`
  */
export class ImageRegistry extends Module {

  //stores mappings of: URI -> [bucket] , bucket contains records that we get the best by score
  #map;

  constructor(app, cfg) {
    super(app, cfg);

    this.#map = new Map();

    cfg = cfg.get("images", "imgs");

    if (!cfg) {
      cfg = config({ imgs: STOCK_IMAGES }).root;
      cfg = cfg.get("imgs");
    }
    for (const cfgRec of cfg.getChildren(false)) {
      const uri = isNonEmptyString(cfgRec.getString("uri"));
      const rec = makeNew(ImageRecord, cfgRec, null, ImageRecord);
      this.register(uri, rec);
    }
  }

  /**
   * Tries to resolve a request for an image identified by the specified URI (id) of specific image format (e.g. `svg`|`png`)
   * and optionally matching on `isoLanguage`, `theme`, and `media` specifiers.
   * The system tries to return the BEST matching image record as determined by the pattern match based on record scoring system.
   * @returns {ImageRecord | null} a best matching ImageRecord or null if not found
   */
  resolve(uri, format, { media, isoLang, theme } = {}) {
    isNonEmptyString(uri);
    isNonEmptyString(format);

    // optional props: if null, don't factor prop for resolution
    media = isStringOrNull(media);
    isoLang = isStringOrNull(isoLang);
    theme = isStringOrNull(theme);

    const bucket = this.#map.get(uri);
    if (!bucket) return null;

    //RECORD SCORE algorithm:
    //while linear search is slow, in reality you would rarely get more than 2-3 records per bucket array
    let bestRec = null;
    for (const rec of bucket) {
      if (format !== rec.format) continue;//hard match on format

      if (media   && rec.media   && media !== rec.media) continue;
      if (isoLang && rec.isoLang && isoLang !== rec.isoLang) continue;
      if (theme   && rec.theme   && theme !== rec.theme) continue;

      if (bestRec === null || rec.score > bestRec.score) bestRec = rec;
    }

    return bestRec;
  }

  /**
   * Tries to resolve an image specifier - a convoluted URL string containing a request for an image identified by the specified URI (id) of specific image format (e.g. `svg`|`png`)
   * and optionally matching on `isoLanguage`, `theme`, and `media` specifiers.
   * The specifier format is that of URL having the form:  `format://uri?iso=isoLangCode&theme=themeId&media=mediaId`, where query params are optional.
   * The system tries to return the BEST matching image record as determined by the pattern match based on record scoring system.
   * @param {string | null} [iso=null] Pass language ISO code which will be used as a default when the spec does not contain a specific code. You can also set `$session` in the spec to override it with this value
   * @param {string | null} [theme=null] Pass theme id which will be used as a default when the spec does not contain a specific theme. You can also set `$session` in the spec to override it with this value
   * @returns {ImageRecord | null} a best matching ImageRecord or null if not found
   * @example
   *  resolveSpec("svg://file-open");
   *  resolveSpec("png://business-logo?media=print");
   *  resolveSpec("jpg://welcome-banner-hello1?iso=deu&theme=bananas&media=print");
   *  resolveSpec("jpg://welcome-banner-hello1?iso=$session&theme=$session&media=print");// take ISO and theme from user session
   */
  resolveSpec(spec, iso = null, theme = null){
    const url = new URL(isNonEmptyString(spec));
    let imgUri     = url.host;
    let imgFormat  = url.protocol.slice(0, -1); //`svg`, not `svg:`
    const sp = url.searchParams;
    let imgMedia = sp.get("media") ?? sp.get("m") ?? null;
    let imgIsoLang = sp.get("iso") ?? sp.get("lang") ?? sp.get("isoLang") ?? sp.get("i") ?? null;
    let imgTheme = sp.get("theme") ?? sp.get("t") ?? null;

    if (!imgIsoLang || imgIsoLang === "$session") imgIsoLang = iso ?? this.app.session.isoLang;
    if (!imgTheme || imgTheme === "$session") imgTheme = theme ?? this.app.session.theme;

    const resolved = this.resolve(imgUri, imgFormat, { media: imgMedia, isoLang: imgIsoLang, theme: imgTheme });
    return resolved;
  }

  /** Returns an iterable of all image URIs loaded.
   * To go through all images you can loop through this result and the call {@link getRecords} for each
   */
  getUris(){ return this.#map.keys(); }

  /** Returns an array of {@link ImageRecord}s for the specified URI (empty array if does not exist)
   * @returns {ImageRecord[]}
  */
  getRecords(uri){
    isNonEmptyString(uri);
    return this.#map.get(uri) ?? [];
  }

  /**
   * Puts an image record in the registry, creating necessary data structures internally
   * @param {string} uri - non-empty uri string identifier
   * @param {ImageRecord} iRec - non-null `ImageRecord` instance to register
   */
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

  /** Deletes all records for the URI bucket returning true, or false if such URI is not found
   * @returns {boolean} true if found and deleted
  */
  unregisterRecords(uri) {
    isNonEmptyString(uri);
    return this.#map.delete(uri);
  }

}//ImageRegistry class

/** Provides information about a single image representation: (format, iso, theme, media) */
export class ImageRecord {

  #media;
  #format;
  #isoLang;
  #theme;
  #score = 0;
  #contentType;
  #content;
  #attrs = null;

  /** @param {ConfigNode} cfg */
  constructor(cfg) {
    isOf(cfg, ConfigNode);

    // required
    this.#format = isNonEmptyString(cfg.getString(["format", "fmt", "f"], null));

    this.#media = cfg.getString(["media", "m"], null);
    this.#isoLang = cfg.getString(["isoLang", "lang", "iso", "i"], null);
    this.#theme = cfg.getString(["theme", "t"], null);

    this.#contentType = cfg.getString(["contentType", "ctp"], CONTENT_TYPE.IMG_SVG);
    this.#content = cfg.getString(["content", "img", "image", "c"]);


    const ca = cfg.get(["attrs","attr","atrs","atr"]);
    if (ca instanceof ConfigNode){
      const attrs = { };
      for(const kvp in ca) {
        if (isString(kvp.val) || isNumber(kvp.val) || isBool(kvp.val)){
          attrs[kvp.key] = kvp.val;
        }
      }
      this.#attrs = Object.freeze(attrs);
    }

    if (this.#media) this.#score += 1_000_000;
    if (this.#isoLang) this.#score += 1_000;
    if (this.#theme) this.#score += 100;
  }

  /** Required image format, such as `svg`, `png`, `jpg` etc. */
  get format() { return this.#format; }

  /** Optional language ISO string code or null, e.g. `eng`, */
  get isoLang() { return this.#isoLang; }

  /** Optional theme string specifier or null */
  get theme() { return this.#theme; }

  /** Optional media specifier or null, e.g. `print` */
  get media() { return this.#media; }

  /** Records score. It is higher the more fields are populated. Importance: (media = 1000, isoLang = 100, theme = 1) */
  get score() { return this.#score; }

  /** Image content: string or custom binary array, or an instruction how to get content. Use {@link produceContent} method to get actual image script/bytes */
  get content() { return this.#content; }

  /** Image content MIME type e.g. `image/png` */
  get contentType() { return this.#contentType; }

  /** Returns optional attributes for this record. Empty object for no attributes */
  get attrs() { return this.#attrs ?? {};}

  /** Call this method to get the actual image content such as PNG byte[] or SVG text.
   * Keep in mind, the {@link content} property may only contain a reference (in future version) to the image stored elsewhere.
   * You need to call this method to get the actual materialized content, e.g. fetched from network (and cached) by first calling async {@link materialize}
   */
  produceContent() { return { sc: 200, ctp: this.#contentType, content: this.#content, attrs: this.attrs }; }

  /** Async method which materializes the referenced content. This is reserved for future */
  async materialize(){ return true; }

  toString() { return JSON.stringify(this.toJSON(), null, 2); }

  toJSON() {
    return {
      format: this.format,
      isoLang: this.isoLang,
      theme: this.theme,
      media: this.media,
      score: this.score,
      contentType: this.contentType,
      content: `${this.content.substring(0, 10)}...`,
    };
  }
}




/** Configuration snippet provides base stock system icons/images. */
// TODO: Remove "fill" attribute from paths, rects, etc. INSTEAD Control color with CSS styles/classes (forces default SVG fill color to 0x00000)
export const STOCK_IMAGES = Object.freeze([
  {
    uri: "azos.ico.none", //  svg://azos.ico.none
    f: "svg",
    c: "<svg></svg>",
  }, {
    uri: "azos.ico.checkmark",  //  svg://azos.ico.checkmark&m=i32
    f: "svg",
    m: "i32",
    c: `<svg viewBox="0 -960 960 960"><path d="M378-222 130-470l68-68 180 180 383-383 68 68-451 451Z"/></svg>`,
  }, {
    uri: "azos.ico.testCmd2",  //  svg://azos.ico.testCmd2&m=i32
    f: "svg",
    m: "i32",
    c: `<svg viewBox="0 0 24 24"><path d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z"/><path d="M10 9H14L10 13H14" stroke-linejoin="round"/><path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" /></svg>`,
  }, {
    uri: "azos.ico.user",  //  svg://azos.ico.user&m=i32
    f: "svg",
    m: "i32",
    c: `<svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="4"/><path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"/></svg>`,
  }, {
    uri: "azos.ico.hamburger",  //  svg://azos.ico.hamburger&m=i32
    f: "svg",
    m: "i32",
    c: `<svg viewBox="0 -960 960 960" fill="#e8eaed"><path d="M92-199v-105.33h776.67V-199H92Zm0-228.67v-104.66h776.67v104.66H92Zm0-228V-761h776.67v105.33H92Z"/></svg>`,
  }, {
    uri: "azos.ico.plus",  //  svg://azos.ico.plus&m=i32
    f: "svg",
    m: "i32",
    c: `<svg viewBox="0 -960 960 960" fill="#e8eaed"><path d="M463.08-463.08H240v-33.84h223.08V-720h33.84v223.08H720v33.84H496.92V-240h-33.84v-223.08Z"/></svg>`,
  }, {
    uri: "azos.ico.edit",  //  svg://azos.ico.edit&m=i32
    f: "svg",
    m: "i32",
    c: `<svg viewBox="0 -960 960 960" fill="#e8eaed"><path d="M193.85-193.85h39.87l452.69-452.54-39.87-39.87-452.69 452.54v39.87ZM160-160v-87.64l541.64-542.69q5.02-4 11.4-6.76 6.37-2.76 13.3-2.76 6.78 0 12.95 2.31 6.17 2.31 11.74 7.28l39.46 39.54q5.13 5.05 7.32 11.55 2.19 6.49 2.19 12.99 0 6.85-2.59 13.3-2.58 6.45-6.92 11.47L247.64-160H160Zm606.77-566.51-40.1-39.59 40.1 39.59Zm-100.09 60.5-20.14-20.25 39.87 39.87-19.73-19.62Z"/></svg>`,
  }, {
    uri: "azos.ico.filter", //  svg://azos.ico.filter&m=i32
    f: "svg",
    m: "i32",
    c: `<svg viewBox="0 0 24 24"><path d="M22 3.58002H2C1.99912 5.28492 2.43416 6.96173 3.26376 8.45117C4.09337 9.94062 5.29 11.1932 6.73999 12.09C7.44033 12.5379 8.01525 13.1565 8.41062 13.8877C8.80598 14.6189 9.00879 15.4388 9 16.27V21.54L15 20.54V16.25C14.9912 15.4188 15.194 14.599 15.5894 13.8677C15.9847 13.1365 16.5597 12.5178 17.26 12.07C18.7071 11.175 19.9019 9.92554 20.7314 8.43988C21.5608 6.95422 21.9975 5.28153 22 3.58002Z" stroke-linecap="round" stroke-linejoin="round"></svg>`
  }, {
    uri: "azos.ico.copy", //  svg://azos.ico.filter&m=i32
    f: "svg",
    m: "i32",
    c: `<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M346.15-267.69q-24.57 0-41.52-16.94-16.94-16.95-16.94-41.52v-455.39q0-24.58 16.94-41.52Q321.58-840 346.15-840h335.39q24.58 0 41.52 16.94Q740-806.12 740-781.54v455.39q0 24.57-16.94 41.52-16.94 16.94-41.52 16.94H346.15Zm0-33.85h335.39q9.23 0 16.92-7.69 7.69-7.69 7.69-16.92v-455.39q0-9.23-7.69-16.92-7.69-7.69-16.92-7.69H346.15q-9.23 0-16.92 7.69-7.69 7.69-7.69 16.92v455.39q0 9.23 7.69 16.92 7.69 7.69 16.92 7.69ZM238.46-160q-24.58 0-41.52-16.94Q180-193.88 180-218.46v-489.23h33.85v489.23q0 9.23 7.69 16.92 7.69 7.69 16.92 7.69h369.23V-160H238.46Zm83.08-141.54v-504.61 504.61Z"/></svg>`
  },
]);

/** Library of Common Material Icons (filled standard style) */
export const ICONS = Object.freeze([


]);
