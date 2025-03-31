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

/*
  Another source of icons can be found here:
  https://www.svgrepo.com/
*/


import { isNonEmptyString, isOf } from "../aver.js";
import { config, ConfigNode, makeNew } from "../conf.js";
import { CONTENT_TYPE } from "../coreconsts.js";
import { Module } from "../modules.js";
import { dflt, isEmpty } from "../strings.js";
import { isBool, isNumber, isString } from "../types.js";

/** Default media type is 'i32' = 'ICON 32x32' where 32 is a level of detail based on virtual pixels 32x32 default icon */
export const DEFAULT_MEDIA = "i32";

/** Some images may need to be language-dependent. This defines default "eng" */
export const DEFAULT_ISO_LANG = "eng";

/** Default theme name is "azos" */
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

    this.#contentType = cfg.getString(["contentType", "ctp"], CONTENT_TYPE.TEXT_HTML);
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
export const STOCK_IMAGES = Object.freeze([
 {
   // svg://azos.ico.none
   uri: "azos.ico.none",
   f: "svg",
   c: "<svg></svg>",
 },
 {
   uri: "azos.ico.arrowLeft",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="m276.85-460 231.69 231.69L480-200 200-480l280-280 28.54 28.31L276.85-500H760v40H276.85Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.arrowRight",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M683.15-460H200v-40h483.15L451.46-731.69 480-760l280 280-280 280-28.54-28.31L683.15-460Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.calendarToday",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M360-335.38q-35.08 0-59.85-24.77-24.77-24.77-24.77-59.85t24.77-59.85q24.77-24.77 59.85-24.77t59.85 24.77q24.77 24.77 24.77 59.85t-24.77 59.85q-24.77 24.77-59.85 24.77ZM160-120v-640h135.38v-89.23h43.08V-760h286.16v-89.23h40V-760H800v640H160Zm40-40h560v-375.38H200V-160Zm0-415.39h560V-720H200v144.61Zm0 0V-720v144.61Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.caretUp",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="m480-555.69-184 184L267.69-400 480-612.31 692.31-400 664-371.69l-184-184Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.caretRight",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="m531.69-480-184-184L376-692.31 588.31-480 376-267.69 347.69-296l184-184Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.caretDown",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M480-371.69 267.69-584 296-612.31l184 184 184-184L692.31-584 480-371.69Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.caretLeft",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M560-267.69 347.69-480 560-692.31 588.31-664l-184 184 184 184L560-267.69Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.checkmark",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M382-267.69 183.23-466.46 211.77-495 382-324.77 748.23-691l28.54 28.54L382-267.69Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.copy",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M300-280v-560h440v560H300Zm40-40h360v-480H340v480ZM180-160v-535.38h40V-200h375.38v40H180Zm160-160v-480 480Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.edit",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M200-200h43.92l427.93-427.92-43.93-43.93L200-243.92V-200Zm-40 40v-100.77l555-556.08 101.62 102.54L260.77-160H160Zm600-555.54L715.54-760 760-715.54ZM649.5-649.5l-21.58-22.35 43.93 43.93-22.35-21.58Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.filter",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M440-200v-253.85L198-760h564L520-453.85V-200h-80Zm40-268 198-252H282l198 252Zm0 0Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.folder",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M120-200v-560h263.85l80 80H840v480H120Zm40-40h640v-400H447.77l-80-80H160v480Zm0 0v-480 480Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.folderOpen",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M120-200v-560h263.85l80 80h369.23v40H447.77l-80-80H160v478.46l90.62-303.08h664L811.54-200H120Zm81.69-40h579.85l78.92-264.62H280.62L201.69-240Zm0 0 78.93-264.62L201.69-240ZM160-640v-80 80Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.home",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M240-200h147.69v-235.38h184.62V-200H720v-360L480-741.54 240-560v360Zm-40 40v-420l280-211.54L760-580v420H532.31v-235.38H427.69V-160H200Zm280-310.77Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.hamburger",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M160-269.23v-40h640v40H160ZM160-460v-40h640v40H160Zm0-190.77v-40h640v40H160Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.label",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M120-200v-560h505.38L840-480 625.38-200H120Zm40-40h445.38L790-480 605.38-720H160v480Zm315.38-240Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.openInNew",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M160-160v-640h289.23v40H200v560h560v-249.23h40V-160H160Zm229.54-201.23-28.31-28.31L731.69-760H560v-40h240v240h-40v-171.69L389.54-361.23Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.refresh",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M483.08-200q-117.25 0-198.63-81.34-81.37-81.34-81.37-198.54 0-117.2 81.37-198.66Q365.83-760 483.08-760q71.3 0 133.54 33.88 62.23 33.89 100.3 94.58V-760h40v209.23H547.69v-40h148q-31.23-59.85-87.88-94.54Q551.15-720 483.08-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h42.46Q725.08-310.15 651-255.08 576.92-200 483.08-200Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.user",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M480-504.62q-49.5 0-84.75-35.25T360-624.62q0-49.5 35.25-84.75T480-744.62q49.5 0 84.75 35.25T600-624.62q0 49.5-35.25 84.75T480-504.62ZM200-215.38v-65.85q0-24.77 14.42-46.35 14.43-21.57 38.81-33.5 56.62-27.15 113.31-40.73 56.69-13.57 113.46-13.57 56.77 0 113.46 13.57 56.69 13.58 113.31 40.73 24.38 11.93 38.81 33.5Q760-306 760-281.23v65.85H200Zm40-40h480v-25.85q0-13.31-8.58-25-8.57-11.69-23.73-19.77-49.38-23.92-101.83-36.65-52.45-12.73-105.86-12.73t-105.86 12.73Q321.69-349.92 272.31-326q-15.16 8.08-23.73 19.77-8.58 11.69-8.58 25v25.85Zm240-289.24q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0-80Zm0 369.24Z"/></svg>`,
   attrs: { fas: true, scale: 1.35 },
 },
 {
   uri: "azos.ico.userGroup",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M103.85-215.38v-65.85q0-27.85 14.42-47.89 14.42-20.03 38.76-32.02 52.05-24.78 103.35-39.51 51.31-14.73 123.47-14.73 72.15 0 123.46 14.73 51.31 14.73 103.35 39.51 24.34 11.99 38.76 32.02 14.43 20.04 14.43 47.89v65.85h-560Zm640 0v-67.7q0-34.77-14.08-65.64-14.07-30.87-39.92-52.97 29.46 6 56.77 16.65 27.3 10.66 54 23.96 26 13.08 40.77 33.47 14.76 20.4 14.76 44.53v67.7h-112.3Zm-360-289.24q-49.5 0-84.75-35.25t-35.25-84.75q0-49.5 35.25-84.75t84.75-35.25q49.5 0 84.75 35.25t35.25 84.75q0 49.5-35.25 84.75t-84.75 35.25Zm290.77-120q0 49.5-35.25 84.75t-84.75 35.25q-2.54 0-6.47-.57-3.92-.58-6.46-1.27 20.33-24.9 31.24-55.24 10.92-30.34 10.92-63.01t-11.43-62.44q-11.42-29.77-30.73-55.62 3.23-1.15 6.46-1.5 3.23-.35 6.47-.35 49.5 0 84.75 35.25t35.25 84.75ZM143.85-255.38h480v-25.85q0-14.08-7.04-24.62-7.04-10.53-25.27-20.15-44.77-23.92-94.39-36.65-49.61-12.73-113.3-12.73-63.7 0-113.31 12.73-49.62 12.73-94.39 36.65-18.23 9.62-25.27 20.15-7.03 10.54-7.03 24.62v25.85Zm240-289.24q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0 289.24Zm0-369.24Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.search",
   f: "svg",
   c: `
   <svg viewBox="0 -960 960 960"><path d="M779.38-153.85 528.92-404.31q-30 25.54-69 39.54t-78.38 14q-96.1 0-162.67-66.53-66.56-66.53-66.56-162.57 0-96.05 66.53-162.71 66.53-66.65 162.57-66.65 96.05 0 162.71 66.56Q610.77-676.1 610.77-580q0 41.69-14.77 80.69t-38.77 66.69l250.46 250.47-28.31 28.3ZM381.54-390.77q79.61 0 134.42-54.81 54.81-54.8 54.81-134.42 0-79.62-54.81-134.42-54.81-54.81-134.42-54.81-79.62 0-134.42 54.81-54.81 54.8-54.81 134.42 0 79.62 54.81 134.42 54.8 54.81 134.42 54.81Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.add",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M460-460H240v-40h220v-220h40v220h220v40H500v220h-40v-220Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.delete",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M240-160v-560h-40v-40h160v-30.77h240V-760h160v40h-40v560H240Zm40-40h400v-520H280v520Zm112.31-80h40v-360h-40v360Zm135.38 0h40v-360h-40v360ZM280-720v520-520Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.settings",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="m405.38-120-14.46-115.69q-19.15-5.77-41.42-18.16-22.27-12.38-37.88-26.53L204.92-235l-74.61-130 92.23-69.54q-1.77-10.84-2.92-22.34-1.16-11.5-1.16-22.35 0-10.08 1.16-21.19 1.15-11.12 2.92-25.04L130.31-595l74.61-128.46 105.93 44.61q17.92-14.92 38.77-26.92 20.84-12 40.53-18.54L405.38-840h149.24l14.46 116.46q23 8.08 40.65 18.54 17.65 10.46 36.35 26.15l109-44.61L829.69-595l-95.31 71.85q3.31 12.38 3.7 22.73.38 10.34.38 20.42 0 9.31-.77 19.65-.77 10.35-3.54 25.04L827.92-365l-74.61 130-107.23-46.15q-18.7 15.69-37.62 26.92-18.92 11.23-39.38 17.77L554.62-120H405.38ZM440-160h78.23L533-268.31q30.23-8 54.42-21.96 24.2-13.96 49.27-38.27L736.46-286l39.77-68-87.54-65.77q5-17.08 6.62-31.42 1.61-14.35 1.61-28.81 0-15.23-1.61-28.81-1.62-13.57-6.62-29.88L777.77-606 738-674l-102.08 42.77q-18.15-19.92-47.73-37.35-29.57-17.42-55.96-23.11L520-800h-79.77l-12.46 107.54q-30.23 6.46-55.58 20.81-25.34 14.34-50.42 39.42L222-674l-39.77 68L269-541.23q-5 13.46-7 29.23t-2 32.77q0 15.23 2 30.23t6.23 29.23l-86 65.77L222-286l99-42q23.54 23.77 48.88 38.12 25.35 14.34 57.12 22.34L440-160Zm38.92-220q41.85 0 70.93-29.08 29.07-29.07 29.07-70.92t-29.07-70.92Q520.77-580 478.92-580q-42.07 0-71.04 29.08-28.96 29.07-28.96 70.92t28.96 70.92Q436.85-380 478.92-380ZM480-480Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.save",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M800-663.08V-160H160v-640h503.08L800-663.08ZM760-646 646-760H200v560h560v-446ZM479.82-298.46q33.26 0 56.72-23.28T560-378.28q0-33.26-23.28-56.72t-56.54-23.46q-33.26 0-56.72 23.28T400-378.64q0 33.26 23.28 56.72t56.54 23.46ZM270.77-569.23h296.92v-120H270.77v120ZM200-646v446-560 114Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.download",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M480-336.92 338.46-478.46l28.31-28.77L460-414v-346h40v346l93.23-93.23 28.31 28.77L480-336.92ZM200-200v-161.54h40V-240h480v-121.54h40V-200H200Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.upload",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M460-336.92v-346l-93.23 93.23-28.31-28.77L480-760l141.54 141.54-28.31 28.77L500-682.92v346h-40ZM200-200v-161.54h40V-240h480v-121.54h40V-200H200Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.notification",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M200-209.23v-40h64.62v-316.92q0-78.39 49.61-137.89 49.62-59.5 125.77-74.11V-840h80v61.85q76.15 14.61 125.77 74.11 49.61 59.5 49.61 137.89v316.92H760v40H200Zm280-286.15Zm-.14 390.76q-26.71 0-45.59-18.98-18.89-18.98-18.89-45.63h129.24q0 26.85-19.03 45.73-19.02 18.88-45.73 18.88ZM304.62-249.23h350.76v-316.92q0-72.93-51.23-124.16-51.23-51.23-124.15-51.23-72.92 0-124.15 51.23-51.23 51.23-51.23 124.16v316.92Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.close",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.favorite",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="m480-173.85-30.31-27.38q-97.92-89.46-162-153.15-64.07-63.7-101.15-112.35-37.08-48.65-51.81-88.04Q120-594.15 120-634q0-76.31 51.85-128.15Q223.69-814 300-814q52.77 0 99 27t81 78.54Q514.77-760 561-787q46.23-27 99-27 76.31 0 128.15 51.85Q840-710.31 840-634q0 39.85-14.73 79.23-14.73 39.39-51.81 88.04-37.08 48.65-100.77 112.35Q609-290.69 510.31-201.23L480-173.85Zm0-54.15q96-86.77 158-148.65 62-61.89 98-107.39t50-80.61q14-35.12 14-69.35 0-60-40-100t-100-40q-47.77 0-88.15 27.27-40.39 27.27-72.31 82.11h-39.08q-32.69-55.61-72.69-82.5Q347.77-774 300-774q-59.23 0-99.62 40Q160-694 160-634q0 34.23 14 69.35 14 35.11 50 80.61t98 107q62 61.5 158 149.04Zm0-273Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.star",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143Zm-61 83.92 49.62-212.54-164.93-142.84 217.23-18.85L480-777.69l85.08 200.38 217.23 18.85-164.93 142.84L667-203.08 480-315.92 293-203.08ZM480-470Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.moreVertical",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M480-218.46q-16.5 0-28.25-11.75T440-258.46q0-16.5 11.75-28.25T480-298.46q16.5 0 28.25 11.75T520-258.46q0 16.5-11.75 28.25T480-218.46ZM480-440q-16.5 0-28.25-11.75T440-480q0-16.5 11.75-28.25T480-520q16.5 0 28.25 11.75T520-480q0 16.5-11.75 28.25T480-440Zm0-221.54q-16.5 0-28.25-11.75T440-701.54q0-16.5 11.75-28.25T480-741.54q16.5 0 28.25 11.75T520-701.54q0 16.5-11.75 28.25T480-661.54Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.moreHorizontal",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M258.46-440q-16.5 0-28.25-11.75T218.46-480q0-16.5 11.75-28.25T258.46-520q16.5 0 28.25 11.75T298.46-480q0 16.5-11.75 28.25T258.46-440ZM480-440q-16.5 0-28.25-11.75T440-480q0-16.5 11.75-28.25T480-520q16.5 0 28.25 11.75T520-480q0 16.5-11.75 28.25T480-440Zm221.54 0q-16.5 0-28.25-11.75T661.54-480q0-16.5 11.75-28.25T701.54-520q16.5 0 28.25 11.75T741.54-480q0 16.5-11.75 28.25T701.54-440Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.apps",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M240-190.77q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm240 0q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm240 0q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm-480-240q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm240 0q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm240 0q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm-480-240q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm240 0q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm240 0q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.lock",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M200-120v-480h120v-80q0-66.85 46.58-113.42Q413.15-840 480-840t113.42 46.58Q640-746.85 640-680v80h120v480H200Zm40-40h480v-400H240v400Zm240-140q25.31 0 42.65-17.35Q540-334.69 540-360t-17.35-42.65Q505.31-420 480-420t-42.65 17.35Q420-385.31 420-360t17.35 42.65Q454.69-300 480-300ZM360-600h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>`,
   attrs: { fas: true },
 }
 ,
 {
   uri: "azos.ico.lockOpen",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M200-120v-480h400v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85h-40q0-66.85 46.58-113.42Q413.15-840 480-840t113.42 46.58Q640-746.85 640-680v80h120v480H200Zm40-40h480v-400H240v400Zm240-140q25.31 0 42.65-17.35Q540-334.69 540-360t-17.35-42.65Q505.31-420 480-420t-42.65 17.35Q420-385.31 420-360t17.35 42.65Q454.69-300 480-300ZM240-160v-400 400Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.key",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M280-430.77q-20.69 0-34.96-14.27T230.77-480q0-20.69 14.27-34.96T280-529.23q20.69 0 34.96 14.27T329.23-480q0 20.69-14.27 34.96T280-430.77ZM280-280q-83.08 0-141.54-58.46Q80-396.92 80-480q0-83.08 58.46-141.54Q196.92-680 280-680q61.62 0 111.12 33.38 49.5 33.39 72.26 86.62h368.16l80 80-127.69 126.15-68.47-51.53-72.3 53.07L571.92-400H463.38q-22.76 52.46-72.26 86.23T280-280Zm0-40q59.08 0 100.81-35.54 41.73-35.54 53.42-84.46h150.39l57.23 38.69 74.3-53.31L781-405.77 855.23-480l-40-40h-381q-11.69-48.92-53.42-84.46Q339.08-640 280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.userSupervisor",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M675.38-415.38q-32.76 0-56.38-23.62-23.62-23.62-23.62-56.38 0-32.77 23.62-56.39 23.62-23.61 56.38-23.61 32.77 0 56.39 23.61 23.61 23.62 23.61 56.39 0 32.76-23.61 56.38-23.62 23.62-56.39 23.62Zm-180 200v-36q0-18.62 9.3-33.76 9.29-15.14 26.4-21.78 33.79-14.23 69.93-21.35 36.14-7.11 74.37-7.11 36.68 0 72.88 7.11 36.2 7.12 71.43 21.35 17.1 6.64 26.4 21.78 9.29 15.14 9.29 33.76v36h-360ZM384.62-504.62q-49.5 0-84.75-35.25t-35.25-84.75q0-49.5 35.25-84.75t84.75-35.25q49.5 0 84.75 35.25t35.25 84.75q0 49.5-35.25 84.75t-84.75 35.25Zm0-120Zm-280 409.24v-65.85q0-25.95 14.3-47.71 14.31-21.75 38.93-32.14 53.07-26.92 110.23-40.61 57.16-13.69 116.54-13.69 24.23 0 48.46 2.53 24.23 2.54 48.46 6.7l-17.08 17.84q-8.54 8.93-17.08 17.85-15.69-3.08-31.38-4-15.69-.92-31.38-.92-54.16 0-106.97 11.69Q224.85-352 176.92-326q-13.07 7.31-22.69 18.23-9.61 10.92-9.61 26.54v25.85h240v40h-280Zm280-40Zm0-289.24q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.monitoring",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M140-140v-51.54l40-40V-140h-40Zm160 0v-211.54l40-40V-140h-40Zm160 0v-251.54l40 41V-140h-40Zm160 0v-210.54l40-40V-140h-40Zm160 0v-371.54l40-40V-140h-40ZM140-375.46v-56.08l260-260 160 160 260-260v56.08l-260 260-160-160-260 260Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.cloud",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M260-200q-74.85 0-127.42-52.23Q80-304.46 80-379.31q0-68.77 47-122.07 47-53.31 116.85-57.24Q257.31-646 324.23-703q66.92-57 155.77-57 100.08 0 170.04 69.96T720-520v40h24.62q57.46 1.85 96.42 42.19Q880-397.46 880-340q0 58.85-40.58 99.42Q798.85-200 740-200H260Zm0-40h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-240Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.lan",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M140-100v-240h120v-160h200v-120H340v-240h280v240H500v120h200v160h120v240H540v-240h120v-120H300v120h120v240H140Zm240-560h200v-160H380v160ZM180-140h200v-160H180v160Zm400 0h200v-160H580v160ZM480-660ZM380-300Zm200 0Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.tenancy",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M154.62-140q-42.31 0-71.93-29.62-29.61-29.61-29.61-71.92t29.61-71.92q29.62-29.62 71.93-29.62 10.33 0 20.08 1.89 9.76 1.88 19.3 6.19l180.46-247.62q-17-18.69-26.5-43.21-9.5-24.51-9.5-51.86 0-59.08 41.23-100.31 41.23-41.23 100.31-41.23 59.08 0 100.31 41.23 41.23 41.23 41.23 100.31 0 27.35-10 51.86-10 24.52-27 43.21l180.69 248.39q9.54-4.31 19.55-6.58 10.01-2.27 20.6-2.27 42.31 0 71.93 29.62 29.61 29.61 29.61 71.92t-29.61 71.92Q847.69-140 805.38-140q-42.3 0-71.92-29.62-29.61-29.61-29.61-71.92 0-20.54 7.8-38.42 7.81-17.89 20.89-31.89L553.62-557.92q-11.93 8.15-25.27 13-13.35 4.84-28.35 7.13v196.33q35 6.61 58.27 34.54 23.27 27.92 23.27 64.61 0 42.31-29.62 71.93-29.61 29.61-71.92 29.61t-71.92-29.61q-29.62-29.62-29.62-71.93 0-36.69 23.27-64.5Q425-334.62 460-341.46v-196.33q-15-2.29-28.35-7.13-13.34-4.85-25.27-13L226.69-311.85q13.08 14 21.27 31.89 8.19 17.88 8.19 38.42 0 42.31-29.61 71.92Q196.92-140 154.62-140Zm0-40q25.46 0 43.5-18.04 18.03-18.04 18.03-43.5t-18.03-43.5q-18.04-18.04-43.5-18.04-25.47 0-43.5 18.04-18.04 18.04-18.04 43.5t18.04 43.5Q129.15-180 154.62-180ZM480-677.69Zm0 496.92q25.46 0 43.5-18.04t18.04-43.5q0-25.46-18.04-43.5T480-303.85q-25.46 0-43.5 18.04t-18.04 43.5q0 25.46 18.04 43.5t43.5 18.04Zm325.38.77q25.47 0 43.5-18.04 18.04-18.04 18.04-43.5t-18.04-43.5q-18.03-18.04-43.5-18.04-25.46 0-43.5 18.04-18.03 18.04-18.03 43.5t18.03 43.5Q779.92-180 805.38-180Zm-650.76-61.54Zm325.38-.77Zm325.38.77ZM480-576.15q41.88 0 71.71-29.83 29.83-29.83 29.83-71.71 0-41.89-29.83-71.71-29.83-29.83-71.71-29.83-41.88 0-71.71 29.83-29.83 29.82-29.83 71.71 0 41.88 29.83 71.71 29.83 29.83 71.71 29.83Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.filterOff",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M563.54-509.46 535-538l143-182H353l-40-40h449L563.54-509.46Zm229.77 399.61L520-383.15V-200h-80v-263.15L109.85-793.31l28.3-28.54 683.7 683.7-28.54 28.3ZM535-538Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.draft",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M200-120v-720h380l180 180v540H200Zm360-520v-160H240v640h480v-480H560ZM240-800v160-160 640-640Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.attach",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M693.85-338.46q0 90.88-62.62 154.67Q568.62-120 478.08-120t-153.54-63.79q-63-63.79-63-154.67v-349.23q0-63.46 43.65-107.89Q348.85-840 412.31-840q63.46 0 107.11 44.42 43.66 44.43 43.66 107.89v330.77q0 35.23-24.59 60.69-24.58 25.46-59.92 25.46t-60.8-25.06q-25.46-25.06-25.46-61.09v-332.31h40v332.31q0 19.15 13.11 32.65 13.12 13.5 32.27 13.5 19.16 0 32.27-13.5 13.12-13.5 13.12-32.65v-331.54q-.23-46.62-32.06-79.08Q459.2-800 412.31-800q-46.53 0-78.65 32.85-32.12 32.84-32.12 79.46v349.23q-.23 74.08 51.31 126.27Q404.38-160 478.36-160q72.92 0 123.97-52.19t51.52-126.27v-350.77h40v350.77Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.category",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M315.38-550.77 480-821.54l164.62 270.77H315.38Zm384.62 440q-62.69 0-105.96-43.27-43.27-43.27-43.27-105.96 0-62.69 43.27-105.96 43.27-43.27 105.96-43.27 62.69 0 105.96 43.27 43.27 43.27 43.27 105.96 0 62.69-43.27 105.96-43.27 43.27-105.96 43.27Zm-549.23-20v-258.46h258.46v258.46H150.77Zm549.21-20q45.87 0 77.56-31.67 31.69-31.67 31.69-77.54 0-45.87-31.67-77.56-31.67-31.69-77.54-31.69-45.87 0-77.56 31.67-31.69 31.67-31.69 77.54 0 45.87 31.67 77.56 31.67 31.69 77.54 31.69Zm-509.21-20h178.46v-178.46H190.77v178.46Zm194.31-420h189.84L480-742.92l-94.92 152.15Zm94.92 0ZM369.23-349.23ZM700-260Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.mail",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M120-200v-560h720v560H120Zm360-275.38L160-684.62V-240h640v-444.62L480-475.38Zm0-44.62 307.69-200H172.31L480-520ZM160-684.62V-720v480-444.62Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.mailUnread",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M120-200v-560h462.46q-1.69 10-2.08 19.62-.38 9.61.54 20.38H172.31L480-520l142.92-93.31q7.08 6.85 14.35 13.27t15.27 11.89L480-475.38 160-684.62v420q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h590.76q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7V-554q11.46-2.69 21.08-6.31 9.61-3.61 18.92-8.92V-200H120Zm40-520v480-480Zm600 90.77q-41.54 0-70.77-29.23Q660-687.69 660-729.23q0-41.54 29.23-70.77 29.23-29.23 70.77-29.23 41.54 0 70.77 29.23Q860-770.77 860-729.23q0 41.54-29.23 70.77-29.23 29.23-70.77 29.23Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.accountBalance",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M260-280v-320h40v320h-40Zm200 0v-320h40v320h-40ZM141.54-160v-40h676.92v40H141.54ZM660-280v-320h40v320h-40ZM141.54-680v-33.85L480-875.38l338.46 161.53V-680H141.54Zm105.69-40h465.54-465.54Zm0 0h465.54L480-830 247.23-720Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.database",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M480-160q-140.23 0-230.12-35.73Q160-231.46 160-287.69V-680q0-49.85 93.58-84.92Q347.15-800 480-800t226.42 35.08Q800-729.85 800-680v392.31q0 56.23-89.88 91.96Q620.23-160 480-160Zm0-444.38q85.92 0 173.23-23.97 87.31-23.96 104.46-52.19-16.38-29.77-102.81-54.61Q568.46-760 480-760q-87.15 0-174.65 23.96t-104.58 52.42q16.31 30 103.04 54.62 86.73 24.62 176.19 24.62Zm0 201.3q41.23 0 81-4t76.04-11.88q36.27-7.89 67.38-19.66 31.12-11.76 55.58-26.53V-629q-24.46 14.77-55.58 26.54-31.11 11.77-67.38 19.65-36.27 7.89-76.04 11.89-39.77 4-81 4-42.77 0-83.15-4.39-40.39-4.38-76.27-12.27-35.89-7.88-66.5-19.27Q223.46-614.23 200-629v163.85q23.46 14.77 54.08 26.15 30.61 11.38 66.5 19.27 35.88 7.88 76.27 12.27 40.38 4.38 83.15 4.38ZM480-200q51.38 0 97.73-5.85 46.35-5.84 83.27-16.57 36.92-10.73 62.77-25.62 25.85-14.88 36.23-32.19v-144.92q-24.46 14.77-55.58 26.53-31.11 11.77-67.38 19.66-36.27 7.88-76.04 11.88-39.77 4-81 4-42.77 0-83.15-4.38-40.39-4.39-76.27-12.27-35.89-7.89-66.5-19.27-30.62-11.38-54.08-26.15V-280q10.38 18.08 36.12 32.46 25.73 14.39 62.65 25.12t83.38 16.57Q428.62-200 480-200Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.dominoMask",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M312-280q-42.54 0-82.88-15.31-40.35-15.31-71.2-44.15-40.3-38.85-59.11-93.42Q80-487.46 80-545q0-59.54 28-97.27T189.77-680q9.38 0 18.81 1.73 9.42 1.73 18.57 5.19L480-577.92l252.85-95.16q9.15-3.46 18.57-5.19 9.43-1.73 18.81-1.73Q824-680 852-642.27q28 37.73 28 97.27 0 57.54-18.81 112.12-18.81 54.57-59.11 93.42-30.85 28.84-71.2 44.15Q690.54-280 648-280q-55.23 0-99.31-30l-44.07-30h-49.24l-44.07 30q-44.08 30-99.31 30Zm0-40q37 0 69-17.5t59-42.5h80q27 25 59 42.5t69 17.5q36 0 69.5-12.5T777-371q34-34 48.5-80t14.5-94q0-41-17-68.5T769-640q-3 0-22 4L480-536 213-636q-5-2-10.5-3t-11.5-1q-37 0-54 27t-17 68q0 49 14.5 95t49.5 80q26 25 59 37.5t69 12.5Zm49-72.31q30.85 0 48.38-13.04 17.54-13.03 18.31-36.65-1.54-44.38-61.81-85.04-60.26-40.65-126.88-40.65-30.85 0-48.38 13.04-17.54 13.03-18.31 36.65 1.54 44.38 61.81 85.04 60.26 40.65 126.88 40.65Zm-1.38-35.38q-50.31 0-99.04-29.23-48.73-29.23-52.89-60.62 1.93-6.61 10.35-10.81 8.42-4.19 22.34-4.19 50.31 0 99.04 29.35 48.73 29.34 52.89 60.73-1.93 6.61-10.35 10.69-8.42 4.08-22.34 4.08ZM599-391.31q66.62 0 126.88-41.15 60.27-41.16 61.81-85.54-.77-22.85-18.19-36.77-17.42-13.92-48.5-13.92-65.85 1.54-126.5 42.31-60.65 40.76-62.19 84.38.77 22.85 18.31 36.77 17.53 13.92 48.38 13.92Zm1.38-35.61q-13.15-.77-21.84-4.85t-10.62-10.69q4.16-30.62 52.89-59.85 48.73-29.23 99.04-30.77 13.15.77 21.84 4.85t10.62 10.69q-4.16 31.39-52.89 61-48.73 29.62-99.04 29.62ZM480-480Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.sell",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M519.92-93.15 120-492.31V-840h347.69l399.69 400.15-347.46 346.7Zm0-56.85 290.62-290.62-359.92-358.61H160v290.61L519.92-150ZM261.99-657.69q16.86 0 28.59-11.67t11.73-28.33q0-16.99-11.67-28.88t-28.33-11.89q-16.99 0-28.88 11.8t-11.89 28.65q0 16.86 11.8 28.59t28.65 11.73Zm223.39 183.07Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.questionMark",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M453.23-338.46q0-54.85 16.81-91.5 16.81-36.66 69.19-82.5 36.39-32.92 54.81-62.5t18.42-66.66q0-53.3-36.73-88.76-36.73-35.47-100.35-35.47-51.76 0-82.5 24.08-30.73 24.08-49.42 59.92l-43-20.15q25.62-50.92 68.54-80.62 42.92-29.69 106.38-29.69 88.85 0 136.89 50.81 48.04 50.81 48.04 118.96 0 43.85-19.19 80.12-19.2 36.27-55.97 68.96-55.15 48.54-69.5 79.19-14.34 30.65-14.34 75.81h-48.08ZM475.38-120q-16.07 0-28.03-11.96-11.97-11.96-11.97-28.04t11.97-28.04Q459.31-200 475.38-200q16.08 0 28.04 11.96T515.38-160q0 16.08-11.96 28.04T475.38-120Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.play",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M360-272.31v-415.38L686.15-480 360-272.31ZM400-480Zm0 134 211.54-134L400-614v268Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.pause",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M540-240v-480h180v480H540Zm-300 0v-480h180v480H240Zm340-40h100v-400H580v400Zm-300 0h100v-400H280v400Zm0-400v400-400Zm300 0v400-400Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.stop",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M320-640v320-320Zm-40 360v-400h400v400H280Zm40-40h320v-320H320v320Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.fastForward",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M163.85-295.38v-369.24L440.77-480 163.85-295.38Zm355.38 0v-369.24L796.15-480 519.23-295.38ZM203.85-480Zm355.38 0ZM203.85-370l165.23-110-165.23-110v220Zm355.38 0 165.23-110-165.23-110v220Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.fastRewind",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M796.15-295.38 519.23-480l276.92-184.62v369.24Zm-355.38 0L163.85-480l276.92-184.62v369.24Zm-40-184.62Zm355.38 0ZM400.77-370v-220L235.54-480l165.23 110Zm355.38 0v-220L590.92-480l165.23 110Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.speed",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M430.31-352.31q18.61 18.62 47.77 16.96 29.15-1.65 42.54-20.96l210.15-292.92-294.46 208.61q-20.08 13.39-22.35 41.54-2.27 28.16 16.35 46.77ZM480-760q55.15 0 100.42 13.42 45.27 13.43 90.2 41.04l-36.77 24.92q-35.31-19.3-73.12-29.34T480-720q-133 0-226.5 93.5T160-400q0 42 11.5 83t32.5 77h552q23-38 33.5-79t10.5-85q0-36-9.27-75.77-9.27-39.77-29.35-74.08l24.93-36.77q29.23 50.08 41.34 94.24 12.12 44.15 12.35 91.92.23 51.61-11.46 96.31-11.69 44.69-36.39 90.15-4.84 8-14.61 13T756-200H204q-11 0-20.38-5.38-9.39-5.39-15.77-15.7-19.85-35-33.85-78.96Q120-344 120-400q0-73.77 27.98-139.24 27.98-65.48 76.38-114.7 48.41-49.21 114.49-77.64Q404.92-760 480-760Zm1.62 278.38Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.locationOn",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M480.14-490.77q26.71 0 45.59-19.02 18.89-19.02 18.89-45.73 0-26.71-19.03-45.6Q506.57-620 479.86-620q-26.71 0-45.59 19.02-18.89 19.02-18.89 45.73 0 26.71 19.03 45.6 19.02 18.88 45.73 18.88ZM480-172.92q112.77-98.16 178.31-199.66t65.54-175.57q0-109.77-69.5-181.2-69.5-71.42-174.35-71.42t-174.35 71.42q-69.5 71.43-69.5 181.2 0 74.07 65.54 175.57T480-172.92Zm0 53.69Q339-243.92 267.58-351.81q-71.43-107.88-71.43-196.34 0-126.93 82.66-209.39Q361.46-840 480-840q118.54 0 201.19 82.46 82.66 82.46 82.66 209.39 0 88.46-71.43 196.34Q621-243.92 480-119.23Zm0-436.15Z"/></svg>`,
   attrs: { fas: true },
 },
 {
   uri: "azos.ico.call",
   f: "svg",
   c: `<svg viewBox="0 -960 960 960"><path d="M768-160q-108.08 0-216.73-49.77-108.65-49.77-200.19-141.31-90.77-91.54-140.93-200.84Q160-661.23 160-768v-32h177.54l33.92 163.31-107.84 100.38q27.38 47.46 56.69 86.69 29.31 39.24 61.07 70.77 32.08 33.62 72.35 62.81 40.27 29.19 91.81 57.58L650-366.77l150 30.23V-160h-32ZM244.85-573.85l83.69-76.77L305.38-760H200.23q1.15 45.77 12.31 92.19 11.15 46.43 32.31 93.96Zm338 333.39q36.92 18.54 83.57 28.92 46.66 10.39 93.58 11.08v-104.16l-95.54-19-81.61 83.16Zm-338-333.39Zm338 333.39Z"/></svg>`,
   attrs: { fas: true },
 },
]);
