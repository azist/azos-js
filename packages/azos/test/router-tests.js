/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cse } from "../run.js";
import * as aver from "azos/aver";
import { config, ConfigNode } from "azos/conf";
import * as apps from "azos/application";
import * as sut from "azos/router";
import { doUsing } from "../types.js";

unit("Router", function() {

  unit("Integration", function(){

    cse("base-functionality-01", function(){

      const cfg = config({
        errorPath: "error",
        graph: {
          help: {
            about: {}
          },
          support: "$(help)"

        }
      });

      doUsing(new sut.Router(apps.NopApplication.instance, cfg.root), router => {
        aver.areEqual("error", router.errorPath);
        aver.isOf(router.graph, ConfigNode, "graph is ConfigNode");

        const h1 = router.handleRoute("help/about");
        const h2 = router.handleRoute("support/about");

        aver.isNotNull(h1);
        aver.isNotNull(h2);

        aver.isOf(h1, sut.SectionHandler);
        aver.isOf(h2, sut.SectionHandler);

        aver.areEqual(router, h1.router);
        aver.areEqual(router, h2.router);

        aver.areEqual("about", h1.segment);
        aver.areEqual("about", h2.segment);

        aver.areEqual("about", h1.path);
        aver.areEqual("", h1.nextPath);
        aver.areEqual("/help/about", h1.rootPath);


        aver.isOf(h1.parent, sut.SectionHandler);
        aver.areEqual("help/about", h1.parent.path);
        aver.areEqual("about", h1.parent.nextPath);
        aver.areEqual("help", h1.parent.segment);
        aver.areEqual("/help", h1.parent.rootPath);

        aver.isOf(h1.parent.parent, sut.SectionHandler);
        aver.areEqual("/help/about", h1.parent.parent.path);
        aver.areEqual("help/about", h1.parent.parent.nextPath);
        aver.areEqual("/", h1.parent.parent.segment);
        aver.areEqual("/", h1.parent.parent.rootPath);
        aver.isNull(h1.parent.parent.parent);

        aver.areEqual(h1.requestContext, h1.parent.requestContext);
        aver.areEqual(h1.requestContext, h1.parent.parent.requestContext);
      });


    });

  });//Integration

});//Router
