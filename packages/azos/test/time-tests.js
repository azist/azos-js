/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import * as aver from "azos/aver";
import * as apps from "azos/application";
import { TimeZone, TimeZoneManager, TZ_UTC } from "../time.js";
import { AzosError, doUsing } from "../types.js";


class TeztTimeZone extends TimeZone {
  //Custom time zone for testing
}


unit("Time", function () {

  //$npm test "*TimeZoneManager*"
  unit("TimeZoneManager", function () {

    cs("try-get-named", function () {
      doUsing(apps.application({
        modules: [{name: "tzm", type: TimeZoneManager }]
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


    cs("tezt-zones", function () {
      doUsing(apps.application({
        modules: [{name: "tzm", type: TimeZoneManager,
          zones: [
            {type: TeztTimeZone, name: "t1", description: "Tezt zone 1", iana: "Tezt/TimeZone1", windows: "Tezt Windows Time1", baseOffsetMs: 2 * 60 * 60 * 1000},
            {type: TeztTimeZone, name: "t2", description: "Tezt zone 2", iana: "Tezt/TimeZone2", windows: "Tezt Windows Time2", baseOffsetMs: -1 * 60 * 60 * 1000}
          ]
        }]
      }), (app) => {
        const tzm = app.moduleLinker.resolve(TimeZoneManager);

        const utc = tzm.getZone(TZ_UTC);
        aver.isOf(utc, TimeZone, "UTC is a TimeZone");//even when it is not declared, it is always present

        const tz1 = tzm.getZone("t1");
        aver.isOf(tz1, TeztTimeZone, "UTC is a TimeZone");

        const tz2 = tzm.getZone("t2");
        aver.isOf(tz2, TeztTimeZone, "UTC is a TimeZone");

        const allZones = tzm.getAllZones();
        aver.isArray(allZones, "getAllZones");
        aver.areEqual(3, allZones.length, "getAllZones has more than 2 zones");

        aver.isTrue(allZones.indexOf(utc) >= 0, "getAllZones has UTC");
        aver.isTrue(allZones.indexOf(tz1) >= 0, "getAllZones has tz1");
        aver.isTrue(allZones.indexOf(tz2) >= 0, "getAllZones has tz2");


        const originalTs = Date.UTC(1980, 0, 1, 14, 23, 41, 345);

        const got1 = tz1.extractComponents(originalTs);
        const got2 = tz2.extractComponents(originalTs);

        aver.areEqual(1980, got1.year,  "year");
        aver.areEqual(1,    got1.month, "month");
        aver.areEqual(1,    got1.day,  "day");
        aver.areEqual(16,   got1.hour, "hour");
        aver.areEqual(23,   got1.minute, "minute");
        aver.areEqual(41,   got1.second, "second");
        aver.areEqual(345,  got1.millisecond, "millisecond");

        aver.areEqual(1980, got2.year,  "year");
        aver.areEqual(1,    got2.month, "month");
        aver.areEqual(1,    got2.day,  "day");
        aver.areEqual(13,   got2.hour, "hour");
        aver.areEqual(23,   got2.minute, "minute");
        aver.areEqual(41,   got2.second, "second");
        aver.areEqual(345,  got2.millisecond, "millisecond");

        aver.areEqual(originalTs, tz1.combineComponents({ year: 1980, month: 1, day: 1, hour: 16,  minute: 23, second: 41, millisecond: 345}));
        aver.areEqual(originalTs, tz2.combineComponents({ year: 1980, month: 1, day: 1, hour: 13,  minute: 23, second: 41, millisecond: 345}));
      });
    });

  });
});
