/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

//import { describe, it } from "mocha";
import { defineUnit as describe, defineCase as it } from "../run.js";
import * as aver from "azos/aver";
import {ABSTRACT} from "azos/coreconsts";
import * as conf from "azos/conf";
import * as apps from "azos/application";
//import * as cmp from "azos/components";
import * as mod from "azos/modules";
import * as sut from "azos/linker";


class IWeather extends mod.Module{
  constructor(dir, cfg){ super(dir, cfg); }
  // eslint-disable-next-line no-unused-vars
  getWeather(code){ throw ABSTRACT("IWeather.getWeather()"); }
}

class LocalWeather extends IWeather{
  constructor(dir, cfg){ super(dir, cfg); }
  getWeather(code){ return "Local weather is cloudy: " + (code ?? "none"); }
}

class NationWeather extends IWeather{
  constructor(dir, cfg){ super(dir, cfg); }
  getWeather(code){ return "Nationwide weather is fair; 75F: "+ (code ?? "none");  }
}


describe("Linker Additional Tests", function() {

  describe("ModuleLinker", function() {

    /**
     * When multiple services are registered under the same name (or name=null), use the first
     *  registered service.
     */
    it("uses-first-registered-service",   function() {
      const linker = new mod.ModuleLinker();
      const cfg = conf.config({}).root;

      const modLocal = new LocalWeather(apps.NopApplication.instance, cfg);
      const modNational = new NationWeather(apps.NopApplication.instance, cfg);

      aver.isTrue(  linker.register(modNational)  );
      aver.isTrue(  linker.register(modLocal)  );

      const ref = {
        weather: IWeather
      };

      sut.link(linker, ref);

      aver.areEqual(ref.weather, modNational);
      aver.areNotEqual(ref.weather, modLocal);
    });

    /**
     * When multiple services are attempted to be registered under the same name, throws an
     *  exception giving developer advanced notice of an unlikely (unexpected) outcome.
     */
    it("throws-when-registering-second-service", function() {
      const linker = new mod.ModuleLinker();
      const cfg = conf.config({}).root;

      const modLocal = new LocalWeather(apps.NopApplication.instance, cfg);
      const modNational = new NationWeather(apps.NopApplication.instance, cfg);

      aver.isTrue(  linker.register(modLocal)  );
      aver.throws(  ()=> linker.register(modNational), "register"  );

    });

  });

});
