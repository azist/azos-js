/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isNonEmptyString } from "../aver.js";
import { Module } from "./modules.js";


function getScore(rec){
  if (!rec) return 0;

  let result = 0;

  if (rec.format) result += 1_000_000;
  if (rec.resolution) result += 1_000;
  if (rec.isoLang) result += 100;
  if (rec.theme) result += 1;

  return result;
}


export class ImageRegistry extends Module {

  //stores mappings of: URI -> [bucket] , bucket contains keys that we search by and record score
  #map;

  constructor(app, cfg){
    super(app, cfg);
    this.#map = Map();
  }

  resolve(uri, isoLang = null, theme = null, resolution = null, format = null){
    const bucket = this.#map.get(isNonEmptyString(uri));
    if (!bucket) return null;


  }

  register(){
    ///will put into existing bucket or a new one into map
    const bucket = [];
    let rec = { isoLang, theme, res, format, score, data  };
    rec.score = getScore(rec);
    bucket.push(rec);
  }

  unregister(){
    ///will take out of existing bucket
  }

}

