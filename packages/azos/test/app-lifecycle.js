/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import { application } from "../application.js";

import { areEqual, isTrue, isFalse, isNotNull, isOf } from "../aver.js";
import { dispose, DISPOSED_PROP } from "../types.js";
import { LOG_TYPE } from "../log.js";
import { ConLog, ILog } from "..//ilog.js";
import { Session } from "../session.js";
import { Localizer } from "../localization.js";
import { Linker } from "../linker.js";
import { AppComponent } from "../components.js";

unit("Application", function () {

  unit("BasicOperation", function () {

    cs("case01", function () {

      const app = application({
       id: "x01",
       name: "xapp01",
       description: "Uncle TOAD",
       copyright: "1980 Leslie Snakes Nielsen",
       env: "prod",
       isTest: true,
       logLevel: LOG_TYPE.DEBUG,

      });

      isNotNull(app);
      isFalse(app[DISPOSED_PROP]);

      areEqual("x01", app.id);
      areEqual("xapp01", app.name);
      areEqual("Uncle TOAD", app.description);
      areEqual("1980 Leslie Snakes Nielsen", app.copyright);
      areEqual("prod", app.envName);
      isTrue(app.isTest);
      isNotNull(app.instanceId);
      isNotNull(app.startTime);

      areEqual(1, app.components.length);
      isOf(app.components[0], ConLog);

      areEqual(1, app.rootComponents.length);
      isOf(app.rootComponents[0], ConLog);

      areEqual(1, app.modules.length);
      isOf(app.modules[0], ConLog);

      let allc = AppComponent.getAllApplicationComponents(app);
      areEqual(1,  allc.length);
      areEqual(app, allc[0].director);
      allc = AppComponent.getRootApplicationComponents(app);
      areEqual(1,  allc.length);
      areEqual(app, allc[0].director);

      isOf(app.log, ILog);
      areEqual(LOG_TYPE.DEBUG, app.logLevel);
      areEqual(LOG_TYPE.DEBUG, app.effectiveLogLevel);

      isOf(app.session, Session);

      isOf(app.localizer, Localizer);
      isOf(app.moduleLinker, Linker);

      dispose(app);
      isTrue(app[DISPOSED_PROP]);
    });
  });
});
