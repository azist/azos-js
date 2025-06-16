/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import { ABSTRACT } from "../coreconsts.js"
import { dispose } from "../types.js";
import * as aver from "../aver.js";
import { application } from "../application.js";
import { Module } from "../modules.js";


class IWeather extends Module{
  constructor(dir, cfg){ super(dir, cfg); }
  // eslint-disable-next-line no-unused-vars
  getWeather(location){ throw ABSTRACT("getWeather"); }
}

class INews extends Module{
  constructor(dir, cfg){  super(dir, cfg); }
  // eslint-disable-next-line no-unused-vars
  getNews(location){ throw ABSTRACT("getNews"); }
}
// ===========================================================

class ClevelandWeather extends IWeather{
  constructor(dir, cfg){  super(dir, cfg); }
  getWeather(location){ return `CLE, OH: It is now sunny in ${location}`; }
}

class UsNews extends INews{
  #ref = {
    /** Weather service @type {IWeather} */
    weather: IWeather
  };
  constructor(dir, cfg){  super(dir, cfg); }
  _appAfterLoad(){ this.link(this.#ref); }
  getNews(location){ return `US News:  1. Election 2. Sports 3. Weather: ${this.#ref.weather.getWeather(location)}`; }
}

class OhioNews extends INews{
  constructor(dir, cfg){  super(dir, cfg); }
  getNews(location){ return `OHIO News:  1. Summit county: Cuyahoga river is full  2. It is always windy in ${location}`; }
}



unit("#AppModule", function() {

  cs("UsNews needs weather",   function() {

    const app = application({
      modules: [
        {name: "news", type: UsNews},
        {name: "weather", type: ClevelandWeather}
      ]
    });

    const news = app.moduleLinker.resolve(INews);
    const got = news.getNews("Stow");

    console.info(got);
    aver.areEqual("US News:  1. Election 2. Sports 3. Weather: CLE, OH: It is now sunny in Stow", got);

    dispose(app);
  });

  cs("UsNews fail wo weather",   function() {
    aver.throws(() =>{
        application({
          modules: [
            {name: "news", type: UsNews},
            // {name: "weather", type: ClevelandWeather}
          ]
        });
    }, "link dependency");
  });


  cs("OhioNews",   function() {

    const app = application({
      modules: [
        {name: "news", type: OhioNews},
      ]
    });

    const news = app.moduleLinker.resolve(INews);
    const got = news.getNews("Hudson");

    console.info(got);
    aver.areEqual("OHIO News:  1. Summit county: Cuyahoga river is full  2. It is always windy in Hudson", got);

    dispose(app);
  });


});
