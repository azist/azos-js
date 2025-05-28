/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import * as aver from "azos/aver";
import * as apps from "azos/application";
import { TimeZone, TZ_UTC, UsStandardTimeZone } from "../time.js";
import { AzosError, doUsing } from "../types.js";


class TeztTimeZone extends TimeZone {
  //Custom time zone for testing
}


unit("Time", function () {

  //$npm test "*TimeZoneManager*"
  unit("Localizer", function () {

    cs("try-get-named", function () {
      doUsing(apps.application({
      }), (app) => {
        const localizer = app.localizer;

        const utc = localizer.getTimeZone(TZ_UTC);
        aver.isOf(utc, TimeZone, "UTC is a TimeZone");//even when it is not declared, it is always present

        const tryFake = localizer.tryGetTimeZone("fake-zone");
        aver.isNull(tryFake, "fake-zone is not present");

        try{
          localizer.getTimeZone("fake-zone");
          throw aver.AVERMENT_FAILURE("getZone should have thrown");
        } catch (e) {
          aver.isOf(e, AzosError, "getZone should have thrown AzosError");
        }
      });
    });


    cs("default-utc-timezone", function () {
      doUsing(apps.application({
      }), (app) => {
        const localizer = app.localizer

        const utc = localizer.getTimeZone(TZ_UTC);
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
        localizer: {name: "localizer",
          zones: [
            {type: TeztTimeZone, name: "t1", description: "Tezt zone 1", iana: "Tezt/TimeZone1", windows: "Tezt Windows Time1", baseOffsetMs: 2 * 60 * 60 * 1000},
            {type: TeztTimeZone, name: "t2", description: "Tezt zone 2", iana: "Tezt/TimeZone2", windows: "Tezt Windows Time2", baseOffsetMs: -1 * 60 * 60 * 1000}
          ]
        }
      }), (app) => {
        const localizer = app.localizer

        const utc = localizer.getTimeZone(TZ_UTC);
        aver.isOf(utc, TimeZone, "UTC is a TimeZone");//even when it is not declared, it is always present

        const tz1 = localizer.getTimeZone("t1");
        aver.isOf(tz1, TeztTimeZone, "UTC is a TimeZone");

        const tz2 = localizer.getTimeZone("t2");
        aver.isOf(tz2, TeztTimeZone, "UTC is a TimeZone");

        const allZones = localizer.getAllTimeZones();
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


    cs("us-standard-timezones-and-daylight-savings", function () {
      doUsing(apps.application({
        localizer: {name: "localizer",
          zones: [
            {type: UsStandardTimeZone, name: "et", description: "Eastern Time", iana: "America/New_York", windows: "Eastern Standard", baseOffsetMs: -5 * 60 * 60 * 1000},
            {type: UsStandardTimeZone, name: "ct", description: "Central Time", iana: "America/Indiana/Knox", windows: "Central Standard", baseOffsetMs: -6 * 60 * 60 * 1000}
          ]
        }
      }), (app) => {
        const localizer = app.localizer;

        const utc = localizer.getTimeZone(TZ_UTC);
        const et = localizer.getTimeZone("et");
        const ct = localizer.getTimeZone("ct");

        const stdOriginal = Date.UTC(1980, 0, 1, 14, 23, 41, 345);
        const dstOriginal = Date.UTC(1980, 6, 4, 14, 23, 41, 345);

        const gotStdUtc = utc.extractComponents(stdOriginal);

        aver.areEqual(1980, gotStdUtc.year, "year");
        aver.areEqual(1,    gotStdUtc.month, "month");
        aver.areEqual(1,    gotStdUtc.day, "day");
        aver.areEqual(14,   gotStdUtc.hour, "hour");
        aver.areEqual(23,   gotStdUtc.minute, "minute");
        aver.areEqual(41,   gotStdUtc.second, "second");
        aver.areEqual(345,  gotStdUtc.millisecond, "millisecond");

        aver.areEqual(stdOriginal, utc.combineComponents({ year: 1980, month: 1, day: 1, hour: 14,  minute: 23, second: 41, millisecond: 345}));

        const gotStdEt = et.extractComponents(stdOriginal);

        aver.areEqual(1980, gotStdEt.year, "year");
        aver.areEqual(1,    gotStdEt.month, "month");
        aver.areEqual(1,    gotStdEt.day, "day");
        aver.areEqual(9,    gotStdEt.hour, "hour");
        aver.areEqual(23,   gotStdEt.minute, "minute");
        aver.areEqual(41,   gotStdEt.second, "second");
        aver.areEqual(345,  gotStdEt.millisecond, "millisecond");

        aver.areEqual(stdOriginal, et.combineComponents({ year: 1980, month: 1, day: 1, hour: 9,  minute: 23, second: 41, millisecond: 345}));

        const gotStdCt = ct.extractComponents(stdOriginal);

        aver.areEqual(1980, gotStdCt.year, "year");
        aver.areEqual(1,    gotStdCt.month, "month");
        aver.areEqual(1,    gotStdCt.day, "day");
        aver.areEqual(8,    gotStdCt.hour, "hour");
        aver.areEqual(23,   gotStdCt.minute, "minute");
        aver.areEqual(41,   gotStdCt.second, "second");
        aver.areEqual(345,  gotStdCt.millisecond, "millisecond");

        aver.areEqual(stdOriginal, ct.combineComponents({ year: 1980, month: 1, day: 1, hour: 8,  minute: 23, second: 41, millisecond: 345}));

        //DST======================================================

        const gotDstUtc = utc.extractComponents(dstOriginal);

        aver.areEqual(1980, gotDstUtc.year, "year");
        aver.areEqual(7,    gotDstUtc.month, "month");
        aver.areEqual(4,    gotDstUtc.day, "day");
        aver.areEqual(14,   gotDstUtc.hour, "hour");
        aver.areEqual(23,   gotDstUtc.minute, "minute");
        aver.areEqual(41,   gotDstUtc.second, "second");
        aver.areEqual(345,  gotDstUtc.millisecond, "millisecond");

        aver.areEqual(dstOriginal, utc.combineComponents({ year: 1980, month: 7, day: 4, hour: 14,  minute: 23, second: 41, millisecond: 345}));

        const gotDstEt = et.extractComponents(dstOriginal);

        aver.areEqual(1980, gotDstEt.year, "year");
        aver.areEqual(7,    gotDstEt.month, "month");
        aver.areEqual(4,    gotDstEt.day, "day");
        aver.areEqual(10,   gotDstEt.hour, "hour");
        aver.areEqual(23,   gotDstEt.minute, "minute");
        aver.areEqual(41,   gotDstEt.second, "second");
        aver.areEqual(345,  gotDstEt.millisecond, "millisecond");

        aver.areEqual(dstOriginal, et.combineComponents({ year: 1980, month: 7, day: 4, hour: 10,  minute: 23, second: 41, millisecond: 345}));

        const gotDstCt = ct.extractComponents(dstOriginal);

        aver.areEqual(1980, gotDstCt.year, "year");
        aver.areEqual(7,    gotDstCt.month, "month");
        aver.areEqual(4,    gotDstCt.day, "day");
        aver.areEqual(9,    gotDstCt.hour, "hour");
        aver.areEqual(23,   gotDstCt.minute, "minute");
        aver.areEqual(41,   gotDstCt.second, "second");
        aver.areEqual(345,  gotDstCt.millisecond, "millisecond");

        aver.areEqual(dstOriginal, ct.combineComponents({ year: 1980, month: 7, day: 4, hour: 9,  minute: 23, second: 41, millisecond: 345}));

      });
    });



  });
});
