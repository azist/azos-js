/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import * as sut from "../localization.js";
import * as aver from "../aver.js";
import { GLOBALS } from "../coreconsts.js";
import { TimeZone } from "../time.js";
import { config } from "../conf.js";

unit("Localization", function() {

  unit("#Localizer", function() {

    const dloc = GLOBALS.DEFAULT_INVARIANT;//Default Localizer


    unit("#getCurrencySymbols()", function() {
      cs("returns object", function(){
        let got = dloc.getCurrencySymbols(sut.CULTURE_INVARIANT);
        console.log( got );
        aver.areEqual("$", got.sym);
        aver.areEqual(",", got.ts);
        aver.areEqual(".", got.ds);
      });
    });

    unit("#getPrimaryLanguageIso()", function() {
      cs("returns ENG", function(){
        let got = dloc.getPrimaryLanguageIso(sut.CULTURE_INVARIANT);
        console.log( got );
        aver.areEqual(sut.ISO_LANG_ENG, got);
      });
    });

    unit("#getLanguageIsos()", function() {
      cs("returns ENG", function(){
        let got = dloc.getLanguageIsos(sut.CULTURE_INVARIANT);
        aver.isArray(got);
        aver.areEqual(sut.ISO_LANG_ENG, got[0]);
      });
    });

    unit("#getStringLocalizationIsos()", function() {
      cs("returns ENG", function(){
        let got = dloc.getStringLocalizationIsos();
        aver.isArray(got);
        aver.areEqual(5, got.length);
        aver.areEqual(sut.ISO_LANG_ENG, got[0]);
        aver.areEqual(sut.ISO_LANG_ESP, got[4]);
      });
    });

    unit("#localizeString()", function() {
      cs("passthrough", function(){   aver.areEqual("doesnotexist", dloc.localizeString("doesnotexist", sut.ISO_LANG_ENG));   });
      cs("yes",  function(){   aver.areEqual("да",   dloc.localizeString("yes", sut.ISO_LANG_RUS));   });
      cs("no",   function(){   aver.areEqual("нет",  dloc.localizeString("no", sut.ISO_LANG_RUS));    });
      cs("abra", function(){   aver.areEqual("abra", dloc.localizeString("abra", sut.ISO_LANG_RUS));  });

      cs("yes",  function(){   aver.areEqual("ja",   dloc.localizeString("yes", sut.ISO_LANG_DEU));   });
      cs("no",   function(){   aver.areEqual("nein", dloc.localizeString("no", sut.ISO_LANG_DEU));    });
      cs("abra", function(){   aver.areEqual("abra", dloc.localizeString("abra", sut.ISO_LANG_DEU));  });

      cs("yes in schema",  function(){   aver.areEqual("так",   dloc.localizeString("yes", sut.ISO_LANG_RUS, sut.ANY_FIELD, "tezt"));   });
      cs("no in schema",   function(){   aver.areEqual("неа",   dloc.localizeString("no", sut.ISO_LANG_RUS, sut.ANY_FIELD, "tezt"));   });
      cs("yes in n/a filed n/a schema",  function(){   aver.areEqual("да",   dloc.localizeString("yes", sut.ISO_LANG_RUS, "fieldX", "schemaX"));   });
      cs("yes in anyf/anys",  function(){   aver.areEqual("да",   dloc.localizeString("yes", sut.ISO_LANG_RUS, sut.ANY_FIELD, sut.ANY_SCHEMA));   });
    });


    unit("#formatDateTime()", function() {

      const dt = new Date(Date.UTC(2017, 5, 12,  15, 43, 19, 89));// UTC 12/june/2017 = Monday

      cs("arg0s", function(){
        let got = dloc.formatDateTime(dt);
        console.log( got );
        aver.areEqual("06/12/2017", got);
      });

      cs("LONG_WEEK_DATE", function(){
        let got = dloc.formatDateTime({dt: dt, dtFormat: sut.DATE_FORMAT.LONG_WEEK_DATE});
        console.log( got );
        aver.areEqual("Monday, 12 June 2017", got);
      });

      cs("SHORT_WEEK_DATE", function(){
        let got = dloc.formatDateTime({dt: dt, dtFormat: sut.DATE_FORMAT.SHORT_WEEK_DATE});
        console.log( got );
        aver.areEqual("Mon, 12 Jun 2017", got);
      });

      cs("LONG_DATE", function(){
        let got = dloc.formatDateTime({dt: dt, dtFormat: sut.DATE_FORMAT.LONG_DATE});
        console.log( got );
        aver.areEqual("12 June 2017", got);
      });

      cs("SHORT_DATE", function(){
        let got = dloc.formatDateTime({dt: dt, dtFormat: sut.DATE_FORMAT.SHORT_DATE});
        console.log( got );
        aver.areEqual("12 Jun 2017", got);
      });

      cs("NUM_DATE", function(){
        let got = dloc.formatDateTime({dt: dt, dtFormat: sut.DATE_FORMAT.NUM_DATE});
        console.log( got );
        aver.areEqual("06/12/2017", got);
      });

      cs("LONG_MONTH", function(){
        let got = dloc.formatDateTime({dt: dt, dtFormat: sut.DATE_FORMAT.LONG_MONTH});
        console.log( got );
        aver.areEqual("June 2017", got);
      });

      cs("SHORT_MONTH", function(){
        let got = dloc.formatDateTime({dt: dt, dtFormat: sut.DATE_FORMAT.SHORT_MONTH});
        console.log( got );
        aver.areEqual("Jun 2017", got);
      });

      cs("NUM_MONTH", function(){
        let got = dloc.formatDateTime({dt: dt, dtFormat: sut.DATE_FORMAT.NUM_MONTH});
        console.log( got );
        aver.areEqual("06/2017", got);
      });

      cs("LONG_DAY_MONTH", function(){
        let got = dloc.formatDateTime({dt: dt, dtFormat: sut.DATE_FORMAT.LONG_DAY_MONTH});
        console.log( got );
        aver.areEqual("12 June", got);
      });

      cs("SHORT_DAY_MONTH", function(){
        let got = dloc.formatDateTime({dt: dt, dtFormat: sut.DATE_FORMAT.SHORT_DAY_MONTH});
        console.log( got );
        aver.areEqual("12 Jun", got);
      });


      cs("LONG_WEEK_DATE+HM", function(){
        let got = dloc.formatDateTime({dt: dt, dtFormat: sut.DATE_FORMAT.LONG_WEEK_DATE, tmDetails: sut.TIME_DETAILS.HM});
        console.log( got );
        aver.areEqual("Monday, 12 June 2017 15:43", got);
      });

      cs("LONG_WEEK_DATE+HMS", function(){
        let got = dloc.formatDateTime({dt: dt, dtFormat: sut.DATE_FORMAT.LONG_WEEK_DATE, tmDetails: sut.TIME_DETAILS.HMS});
        console.log( got );
        aver.areEqual("Monday, 12 June 2017 15:43:19", got);
      });

      cs("LONG_WEEK_DATE+HMSM", function(){
        let got = dloc.formatDateTime({dt: dt, dtFormat: sut.DATE_FORMAT.LONG_WEEK_DATE, tmDetails: sut.TIME_DETAILS.HMSM});
        console.log( got );
        aver.areEqual("Monday, 12 June 2017 15:43:19:089", got);
      });

      cs("LONG_WEEK_DATE+HMSM in TIme zone", function(){
        const tzXXX = new TimeZone(config({name: "xxx",   description: "XXX Fake timezone", iana: "xxx", windows: "xxx", baseOffsetMs: -1 * 60 * 60 * 1000}).root);
        let got = dloc.formatDateTime({dt: dt, dtFormat: sut.DATE_FORMAT.LONG_WEEK_DATE, tmDetails: sut.TIME_DETAILS.HMSM, timeZone: tzXXX});
        console.log( got );
        aver.areEqual("Monday, 12 June 2017 14:43:19:089", got);// -1 hr per the fake zone above
      });


    });


    unit("#formatCurrency()", function() {
      cs("fun args1", function(){
        let got = dloc.formatCurrency(9123750000, "usd");
        aver.areEqual("$9,123,750,000.00", got);
      });

      cs("fun args2", function(){
        let got = dloc.formatCurrency(-9123750000, "usd");
        aver.areEqual("-$9,123,750,000.00", got);
      });

      cs("obj1", function(){
        let got = dloc.formatCurrency({amt: -9123750000, iso: "usd"});
        aver.areEqual("-$9,123,750,000.00", got);
      });

      cs("obj1 - no decimals", function(){
        let got = dloc.formatCurrency({amt: -9123750000, iso: "usd", precision: 0});
        aver.areEqual("-$9,123,750,000", got);
      });

      cs("obj2", function(){
        let got = dloc.formatCurrency({amt: -3123750000.123456, iso: "usd", thousands: false, precision: 4});
        aver.areEqual("-$3123750000.1234", got);
      });

      cs("obj3", function(){
        let got = dloc.formatCurrency({amt: -3123750000.123456, iso: "usd", thousands: false, precision: 2, sign: false});
        aver.areEqual("($3123750000.12)", got);
      });

      cs("obj4", function(){
        let got = dloc.formatCurrency({amt: -3123750000.123456, iso: "usd", thousands: false, precision: 2, sign: false, symbol: false});
        aver.areEqual("(3123750000.12)", got);
      });

      cs("obj5", function(){
        let got = dloc.formatCurrency({amt: -3123750000.123456, iso: "usd", thousands: true, precision: 2, sign: true, symbol: false});
        aver.areEqual("-3,123,750,000.12", got);
      });

      cs("large amount", function(){
        let got = dloc.formatCurrency({amt: -25978123750321.18, iso: "usd", thousands: true, precision: 2, sign: true, symbol: true});
        aver.areEqual("-$25,978,123,750,321.18", got);
      });

      cs("large amount.00", function(){
        let got = dloc.formatCurrency({amt: -125978123750321.00, iso: "usd", thousands: true, precision: 2, sign: true, symbol: true});
        aver.areEqual("-$125,978,123,750,321.00", got);
      });

      cs("large amount - no decimals", function(){
        let got = dloc.formatCurrency({amt: -25978123750321.18, iso: "usd", thousands: true, precision: 0, sign: true, symbol: true});
        aver.areEqual("-$25,978,123,750,321", got);
      });


    });

  });

});
