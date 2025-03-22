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

        aver.areEqual("about", h1.segment);
        aver.areEqual("about", h2.segment);

        aver.isOf(h1, sut.SectionHandler);
        aver.areEqual("about", h1.path);
        aver.isOf(h1.parent, sut.SectionHandler);
        aver.areEqual("help/about", h1.parent.path);
        aver.areEqual("help", h1.parent.segment);
        aver.isNull(h1.parent.parent);
      });


    });

  });//Integration

});//Router
