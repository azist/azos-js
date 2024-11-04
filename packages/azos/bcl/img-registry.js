/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isNonEmptyString, isOf } from "../aver.js";
import { ConfigNode, makeNew } from "../conf.js";
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

    if (!cfg) return;
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
