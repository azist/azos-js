/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import * as aver from "azos/aver";
import * as conf from "azos/conf";
import * as apps from "azos/application";
import { TimeZone, TimeZoneManager, TZ_UTC } from "../time.js";
import { AzosError, doUsing } from "../types.js";


class TeztTimeZone extends TimeZone {
  getOffsetMsAsOfUtc(ts){ return 0; }
  getOffsetMsAsOfLocal(ts, isDST){ return 0; }
}


unit("Time", function () {

  //$ npm test "*TimeZoneManager*"
  unit("TimeZoneManager", function () {

    cs("default-try-get", function () {
      doUsing(apps.application({
        modules: [{name: "tzm", type: TimeZoneManager}]
      }), (app) => {
        const tzm = app.moduleLinker.tryResolve(TimeZoneManager);
        aver.isOf(tzm, TimeZoneManager, "TimeZoneManager is of the right type");

        const utc = tzm.getZone(TZ_UTC);
        aver.isOf(utc, TimeZone, "UTC is a TimeZone");//even when it is not declared, it is always present

        const tryFake = tzm.tryGetZone("fake-zone");
        aver.isNull(tryFake, "fake-zone is not present");

        try{
          tzm.getZone("fake-zone");
          throw aver.AVERMENT_FAILURE("getZone should have thrown");
        } catch (e) {
          aver.isOf(e, AzosError, "getZone should have thrown AzosError");
        }
      });
    });


    cs("default-utc-timezone", function () {
      doUsing(apps.application({
        modules: [{name: "tzm", type: TimeZoneManager}]
      }), (app) => {
        const tzm = app.moduleLinker.tryResolve(TimeZoneManager);
        aver.isOf(tzm, TimeZoneManager, "TimeZoneManager is of the right type");

        const utc = tzm.getZone(TZ_UTC);
        aver.isOf(utc, TimeZone, "UTC is a TimeZone");

        const originalTs = Date.UTC(1980, 0, 1, 14, 23, 41, 345);

        const got = utc.extractComponents(originalTs);

        aver.areEqual(1980, got.year, "year");
        aver.areEqual(1, got.month, "month");
        aver.areEqual(1, got.day, "day");
        aver.areEqual(14, got.hour, "hour");
        aver.areEqual(23, got.minute, "minute");
        aver.areEqual(41, got.second, "second");
        aver.areEqual(345, got.millisecond, "millisecond");

        aver.areEqual(originalTs, utc.combineComponents({ year: 1980, month: 1, day: 1, hour: 14,  minute: 23, second: 41, millisecond: 345}));

      });
    });


  });

});
