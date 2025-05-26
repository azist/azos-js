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
import { SecurityManager } from "../secman.js";

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

      areEqual(3, app.components.length);
      isOf(app.components[0], ConLog);

      areEqual(3, app.rootComponents.length);
      isOf(app.rootComponents[0], ConLog);
      isOf(app.rootComponents[1], SecurityManager);

      areEqual(1, app.modules.length);
      isOf(app.modules[0], ConLog);

      let clist = AppComponent.getAllApplicationComponents(app);
      areEqual(3,  clist.length);
      areEqual(app, clist[0].director);
      isTrue(clist[0].isDirectedByApp);
      areEqual(app, clist[1].director);
      isTrue(clist[1].isDirectedByApp);
      areEqual(app, clist[2].director);
      isTrue(clist[2].isDirectedByApp);

      clist = AppComponent.getRootApplicationComponents(app);
      areEqual(3,  clist.length);
      areEqual(app, clist[0].director);
      isTrue(clist[0].isDirectedByApp);
      areEqual(app, clist[1].director);
      isTrue(clist[1].isDirectedByApp);
      areEqual(app, clist[2].director);
      isTrue(clist[2].isDirectedByApp);

      isOf(app.log, ILog);
      areEqual(LOG_TYPE.DEBUG, app.logLevel);
      areEqual(LOG_TYPE.DEBUG, app.effectiveLogLevel);

      isOf(app.session, Session);

      isOf(app.localizer, Localizer);
      isOf(app.moduleLinker, Linker);

      dispose(app);
      isTrue(app[DISPOSED_PROP]);

      //all cleaned up after dispose
      clist = AppComponent.getRootApplicationComponents(app);
      areEqual(0,  clist.length);

    });
  });
});
