/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import { application } from "../application.js";

import { ImageRegistry } from "../bcl/img-registry.js";
import { areEqual, isTrue } from "../aver.js";
import { CONTENT_TYPE } from "../coreconsts.js";

unit("ImgRegistry", function () {

  unit("construction(app, cfg)", function () {

    cs("adds-icons-from-config", function () {

      const app = application({
        icons: [
          { uri: "test", f: "svg", i: null, t: null, m: "ico64", c: `<svg>1</svg>` },
          { uri: "test", f: "svg", i: "eng", t: "gdi", m: "ico16", c: `<svg>2</svg>` },
          { uri: "test", f: "svg", i: "eng", t: "patio", m: null, c: `<svg>3</svg>` },
          { uri: "test", f: "svg", i: "eng", t: "any", m: null, c: `<svg>4</svg>` },
        ]
      });
      isTrue(app.imgRegistry instanceof ImageRegistry);

      let icon = app.imgRegistry.resolve("test", "svg", { media: "ico64" });
      areEqual(icon.produceContent().content, "<svg>1</svg>");
      areEqual(icon.produceContent().ctp, CONTENT_TYPE.IMG_SVG);

      icon = app.imgRegistry.resolve("test", "svg", { media: "ico16" });
      areEqual(icon.produceContent().content, "<svg>4</svg>");
      areEqual(icon.produceContent().ctp, CONTENT_TYPE.IMG_SVG);

      icon = app.imgRegistry.resolve("test", "svg"); // "any"
      areEqual(icon.produceContent().content, "<svg>1</svg>");
      areEqual(icon.produceContent().ctp, CONTENT_TYPE.IMG_SVG);
    });
  });
});
