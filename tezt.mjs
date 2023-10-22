/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

//MANUAL TESTING
//$ node tezt.mjs

import * as conf from "azos/conf";
import * as apps from "azos/application";
import * as cmp from "azos/components";
import * as mod from "azos/modules";


class IWeather extends mod.Module{
  constructor(dir, cfg){ super(dir, cfg); }

  getWeather(code){ return null; }
}

class LocalWeather extends IWeather{
  constructor(dir, cfg){ super(dir, cfg); }

  getWeather(code){ return "Local weather is cloudy"; }
}

class NationWeather extends IWeather{
  constructor(dir, cfg){ super(dir, cfg); }

  getWeather(code){ return "Nationwide weather is fair; 75F"; }
}

class MainLogic extends mod.Module{

  #ref = {
    weather_nation: IWeather,
    weather_local: IWeather
  };

  constructor(dir, cfg){
    super(dir, cfg);
    this.link(this.#ref); //dep injection
  }

  run(){
     return `Local weather is: ${this.#ref.weather_local.getWeather()}, County weather is: ${this.#ref.weather_nation.getWeather()} `;
}
}

const app = apps.application({
  modules:[
    {name: "local", type: LocalWeather},
    {name: "nation", type: NationWeather},
    {name: "main", type: MainLogic},
  ]
});


const main = app.moduleLinker.resolve(MainLogic, "main");
main.run();

process.exit(0);
