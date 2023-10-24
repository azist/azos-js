/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { describe, it } from "mocha";
import * as aver from "azos/aver";
import {ABSTRACT} from "azos/coreconsts";
import * as conf from "azos/conf";
import * as apps from "azos/application";
//import * as cmp from "azos/components";
import * as mod from "azos/modules";
import * as sut from "azos/linker";


class IWeather extends mod.Module{
  constructor(dir, cfg){ super(dir, cfg); }
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



describe("Linker", function() {

  describe("ModuleLinker", function() {

    it("no-name",   function() {
      const linker = new mod.ModuleLinker();
      const cfg = conf.config({}).root;
      aver.isTrue(  linker.register(new LocalWeather(apps.NopApplication.instance, cfg))  );
      aver.isTrue(  linker.register(new NationWeather(apps.NopApplication.instance, cfg))  );


      const weather = linker.tryResolve(IWeather);
      aver.isNotNull(weather);
      aver.isNull(linker.tryResolve(IWeather, "nat"));


      aver.isOf(weather, IWeather);
      aver.isOf(weather, LocalWeather);
      aver.areEqual("Local weather is cloudy: Z567", weather.getWeather("Z567"));
    });


    it("with name",   function() {
      const linker = new mod.ModuleLinker();
      const cfg = conf.config({}).root;
      aver.isTrue(  linker.register(new LocalWeather(apps.NopApplication.instance, cfg), null, "loc")  );
      aver.isTrue(  linker.register(new NationWeather(apps.NopApplication.instance, cfg), null, "nat")  );

      const localWeather = linker.resolve(IWeather, "loc");
      const nationWeather = linker.resolve(IWeather, "nat");

      aver.isNotNull(localWeather);
      aver.isNotNull(nationWeather);

      aver.isOf(localWeather, IWeather);
      aver.isOf(localWeather, LocalWeather);

      aver.isOf(nationWeather, IWeather);
      aver.isOf(nationWeather, NationWeather);

      aver.areEqual("Local weather is cloudy: Z890", localWeather.getWeather("Z890"));
      aver.areEqual("Nationwide weather is fair; 75F: 123", nationWeather.getWeather(123));
    });

    it("concrete type",   function() {
      const linker = new mod.ModuleLinker();
      const cfg = conf.config({}).root;
      aver.isTrue(  linker.register(new LocalWeather(apps.NopApplication.instance, cfg), IWeather)  );
      aver.isTrue(  linker.register(new NationWeather(apps.NopApplication.instance, cfg), NationWeather)  );

      const localWeather = linker.resolve(IWeather);
      const nationWeather = linker.resolve(NationWeather);

      aver.isNotNull(localWeather);
      aver.isNotNull(nationWeather);

      aver.isOf(localWeather, IWeather);
      aver.isOf(localWeather, LocalWeather);

      aver.isOf(nationWeather, IWeather);
      aver.isOf(nationWeather, NationWeather);

      aver.areEqual("Local weather is cloudy: Z891", localWeather.getWeather("Z891"));
      aver.areEqual("Nationwide weather is fair; 75F: 122", nationWeather.getWeather(122));
    });

    it("concrete type with name",   function() {
      const linker = new mod.ModuleLinker();
      const cfg = conf.config({}).root;
      aver.isTrue(  linker.register(new LocalWeather(apps.NopApplication.instance, cfg), IWeather, "loc")  );
      aver.isTrue(  linker.register(new NationWeather(apps.NopApplication.instance, cfg), NationWeather, "nat")  );

      const localWeather = linker.resolve(IWeather, "loc");
      const nationWeather = linker.resolve(NationWeather, "nat");

      aver.isNotNull(localWeather);
      aver.isNotNull(nationWeather);

      aver.isOf(localWeather, IWeather);
      aver.isOf(localWeather, LocalWeather);

      aver.isOf(nationWeather, IWeather);
      aver.isOf(nationWeather, NationWeather);

      aver.areEqual("Local weather is cloudy: Z8900", localWeather.getWeather("Z8900"));
      aver.areEqual("Nationwide weather is fair; 75F: 1225", nationWeather.getWeather(1225));

      aver.isNotNull(linker.tryResolve(IWeather, "loc"));
      aver.isNull(linker.tryResolve(LocalWeather, "loc"));//because of concrete type
      aver.isNull(linker.tryResolve(LocalWeather, "nat"));//because of name mismatch

      aver.isNull(linker.tryResolve(IWeather, "nat"));//because of concrete type
      aver.isNotNull(linker.tryResolve(NationWeather, "nat"));
      aver.isNull(linker.tryResolve(NationWeather, "loc"));//because of name mismatch

    });

  });

});
