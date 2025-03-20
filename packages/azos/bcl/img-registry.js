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
import { Module } from "../modules.js";
import { dflt, isEmpty } from "../strings.js";
import { isBool, isNumber, isString } from "../types.js";
import { WEB_APP_ICONS } from "./icons.js";



export const DEFAULT_MEDIA = "i32";
export const DEFAULT_ISO_LANG = "eng";
export const DEFAULT_THEME = "azos";


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

    // when context is not specified, it is DEFAULTED
    media = dflt(media, DEFAULT_MEDIA);
    isoLang = dflt(isoLang, this.app.session.isoLang, DEFAULT_ISO_LANG);
    theme = dflt(theme, this.app.session.theme, DEFAULT_ISO_LANG);

    const bucket = this.#map.get(uri);
    if (!bucket) return null;

    //RECORD SCORE algorithm:
    //while linear search is slow, in reality you would rarely get more than 2-3 records per bucket array
    let bestRec = null;
    for (const rec of bucket) {
      if (format !== rec.format) continue;//hard match on format

      if (rec.media  && media !== rec.media) continue;
      if (rec.isoLang && isoLang !== rec.isoLang) continue;
      if (rec.theme   && theme !== rec.theme) continue;

      if (bestRec === null || rec.score > bestRec.score) bestRec = rec;
    }

    return bestRec;
  }

  /**
   * Tries to resolve an image specifier - a convoluted URL string containing a request for an image identified by the specified URI (id) of specific image format (e.g. `svg`|`png`)
   * and optionally matching on `isoLanguage`, `theme`, and `media` specifiers.
   * The specifier format is that of URL having the form:  `format://uri?iso=isoLangCode&theme=themeId&media=mediaId`, where query params are optional.
   * The system tries to return the BEST matching image record as determined by the pattern match based on record scoring system.
   * @param {string | null} [iso=null] Pass language ISO code which will be used as a default when the spec does not contain a specific code
   * @param {string | null} [theme=null] Pass theme id which will be used as a default when the spec does not contain a specific theme
   * @returns {ImageRecord | null} a best matching ImageRecord or null if not found
   * @example
   *  resolveSpec("svg://file-open");
   *  resolveSpec("png://business-logo?media=print");// take ISO and theme from user session
   *  resolveSpec("jpg://welcome-banner-hello1?iso=deu&theme=bananas&media=print");
   */
  resolveSpec(spec, iso = null, theme = null){
    const url = new URL(isNonEmptyString(spec));
    let imgUri = url.host;
    if (isEmpty(imgUri)) imgUri = isNonEmptyString(url.pathname?.substring(2), "M$Edge plfl"); // M$EDGE Polyfill
    let imgFormat  = url.protocol.slice(0, -1); //`svg`, not `svg:`
    const sp = url.searchParams;
    let imgMedia = sp.get("media") ?? sp.get("m") ?? null;
    let imgIsoLang = sp.get("iso") ?? sp.get("lang") ?? sp.get("isoLang") ?? sp.get("i") ?? iso;
    let imgTheme = sp.get("theme") ?? sp.get("t") ?? theme;

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


    const ca = cfg.get("attrs","attr","atrs","atr");
    if (ca instanceof ConfigNode){
      const attrs = { };
      for(const kvp of ca) {
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
      attrs: this.attrs
    };
  }
}




/** Configuration snippet provides base stock system icons/images. */
// TODO: Remove "fill" attribute from paths, rects, etc. INSTEAD Control color with CSS styles/classes (forces default SVG fill color to 0x00000)
export const STOCK_IMAGES = WEB_APP_ICONS;

/** Library of Common Material Icons (filled standard style) */
export const ICONS = Object.freeze([


]);
