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

    it("tinterface-thandler",   function() {
      const linker = new mod.ModuleLinker();
      aver.areEqual(mod.Module, linker.TInterface);
      aver.areEqual(mod.Module, linker.THandler);
    });

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

    it("register-unregister-dump",   function() {
      const linker = new mod.ModuleLinker();
      const cfg = conf.config({name: null}).root;

      const modLocal = new LocalWeather(apps.NopApplication.instance, cfg);
      const modNational = new NationWeather(apps.NopApplication.instance, cfg);

      let watch = linker.dump();
      aver.areEqual(0, Object.keys(watch).length);

      aver.isTrue(  linker.register(modLocal) );//<<++++++++++++++++++

      watch = linker.dump();
      aver.areEqual(2, Object.keys(watch).length);

      aver.areEqual(1, Object.keys(watch["LocalWeather"]).length);
      aver.areEqual(1, Object.keys(watch["IWeather"]).length);

      aver.isTrue(  linker.register(modNational) );//<<+++++++++++++++++++

      watch = linker.dump();
      aver.areEqual(3, Object.keys(watch).length);
      aver.areEqual(1, Object.keys(watch["LocalWeather"]).length);
      aver.areEqual(2, Object.keys(watch["IWeather"]).length);
      aver.areEqual(1, Object.keys(watch["NationWeather"]).length);

      //already registered
      aver.isFalse(  linker.register(modLocal)  );//<++++++++++++++++++++ already registered without a name

      watch = linker.dump();
      aver.areEqual(3, Object.keys(watch).length);
      aver.areEqual(1, Object.keys(watch["LocalWeather"]).length);
      aver.areEqual(2, Object.keys(watch["IWeather"]).length);
      aver.areEqual(1, Object.keys(watch["NationWeather"]).length);

      aver.isTrue(  linker.register(modLocal, null, "specialName")  );//<+++++++++++++++ registration under a new name

      watch = linker.dump();
      aver.areEqual(3, Object.keys(watch).length);
      aver.areEqual(2, Object.keys(watch["LocalWeather"]).length);
      aver.areEqual(3, Object.keys(watch["IWeather"]).length);
      aver.areEqual(1, Object.keys(watch["NationWeather"]).length);

/* Object graph now looks like this, notice NAMED LocalWeatherInstances:
{
  LocalWeather: {
    'e93c399e-8bf2-4774-b09a-23e2e393e323': '(LocalWeather) [object Object]',
    specialName: '(LocalWeather) [object Object]'
  },
  IWeather: {
    'e93c399e-8bf2-4774-b09a-23e2e393e323': '(LocalWeather) [object Object]',
    '32fb99e4-3c3f-4cc0-9339-b405fdc7f5da': '(NationWeather) [object Object]',
    specialName: '(LocalWeather) [object Object]'
  },
  NationWeather: {
    '32fb99e4-3c3f-4cc0-9339-b405fdc7f5da': '(NationWeather) [object Object]'
  }
}
*/
      aver.isTrue(linker.unregister(modLocal)); //<------- UNREGISTER LOCAL!

      watch = linker.dump();
      aver.areEqual(2, Object.keys(watch).length);
      aver.areEqual(undefined, watch["LocalWeather"]);
      aver.areEqual(1, Object.keys(watch["IWeather"]).length);
      aver.areEqual(1, Object.keys(watch["NationWeather"]).length);

/* Object graph after unregistration of ALL references to modLocal:
{
  IWeather: {
    'a777a2df-048f-4431-955f-dca09f0063af': '(NationWeather) [object Object]'
  },
  NationWeather: {
    'a777a2df-048f-4431-955f-dca09f0063af': '(NationWeather) [object Object]'
  }
}
*/

      aver.isTrue(linker.register(modLocal)); //<+++++++++ register without name again
      watch = linker.dump();
      aver.areEqual(3, Object.keys(watch).length);
      aver.areEqual(1, Object.keys(watch["LocalWeather"]).length);
      aver.areEqual(2, Object.keys(watch["IWeather"]).length);
      aver.areEqual(1, Object.keys(watch["NationWeather"]).length);


      aver.isFalse(linker.register(modLocal));//<+++++ reg fails for duplication

      aver.isTrue(linker.unregister(modLocal));//<--------------
      watch = linker.dump();
      aver.areEqual(2, Object.keys(watch).length);
      aver.areEqual(undefined, watch["LocalWeather"]);
      aver.areEqual(1, Object.keys(watch["IWeather"]).length);
      aver.areEqual(1, Object.keys(watch["NationWeather"]).length);

    // console.debug(watch);

      aver.isTrue(linker.unregister(modNational));//<--------------
      watch = linker.dump();

      //EMPTY
      aver.areEqual(0, Object.keys(watch).length);
    });

    it("link()",   function() {
      const linker = new mod.ModuleLinker();
      const cfg = conf.config({}).root;

      const modLocal = new LocalWeather(apps.NopApplication.instance, cfg);
      const modNational = new NationWeather(apps.NopApplication.instance, cfg);

      aver.isTrue(  linker.register(modLocal)  );
      aver.isTrue(  linker.register(modNational)  );
      aver.isTrue(  linker.register(modNational, null, "specialNameForNationalWeather")  );
      aver.isTrue(  linker.register(modNational, null, "presidential_services")  );

      const ref = {
        a: 1,
        b: "ok",
        weather: IWeather
      };

      sut.link(linker, ref);

      aver.areEqual(1, ref.a);
      aver.areEqual("ok", ref.b);
      aver.areEqual(modLocal, ref.weather);

      const ref2 = {
        weather: IWeather,
        weather_presidential_services: IWeather,
        weather_specialNameForNationalWeather: IWeather,
      };

      sut.link(linker, ref2);
      aver.areEqual(modLocal, ref2.weather);
      aver.areEqual(modNational, ref2.weather_presidential_services);
      aver.areEqual(modNational, ref2.weather_specialNameForNationalWeather);

      const ref3 = {
        weather: IWeather,
        weather_XXX: IWeather
      };

      //sut.link(linker, ref3);

      aver.throws(() => sut.link(linker, ref3), "dependency 'XXX' of type 'IWeather'");


    });

  });

});
