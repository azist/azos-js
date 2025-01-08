/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import { application } from "../application.js";

import { ImageRegistry } from "../bcl/img-registry.js";
import { areEqual, isNull, isTrue } from "../aver.js";
import { CONTENT_TYPE } from "../coreconsts.js";
import { dispose } from "../types.js";

function using(resource, callback) {
  try {
    callback(resource);
  } finally {
    if (typeof resource.dispose === 'function') resource.dispose();
    else dispose(resource);
  }
}

unit("ImgRegistry", function () {

  unit("construction(app, cfg)", function () {

    cs("constructor()- add images", function () {
      function expecting(icon, eContent, eContentType, eScore, from) {
        const { content, ctp } = icon.produceContent();
        const score = icon.score;
        areEqual(content, eContent, from);
        areEqual(ctp, eContentType, from);
        areEqual(score, eScore, from);
      }
      using(application({
        modules: [
          {
            name: "ir",
            type: ImageRegistry,
            images: [
              { uri: "test", f: "svg", m: "i16", i: "can", t: "patio", c: `<svg>1</svg>` },   // score: 1101
              { uri: "test", f: "svg", m: "i16", i: "can", t: null, c: `<svg>2</svg>` },    // score: 1100
              { uri: "test", f: "svg", m: "i16", i: null, t: "patio", c: `<svg>3</svg>` },  // score: 1001
              { uri: "test", f: "svg", m: "i16", i: null, t: null, c: `<svg>4</svg>` },     // score: 1000
              { uri: "test", f: "svg", m: null, i: "can", t: "patio", c: `<svg>5</svg>` },  // score: 101
              { uri: "test", f: "svg", m: null, i: "can", t: null, c: `<svg>6</svg>` },     // score: 100
              { uri: "test", f: "svg", m: null, i: null, t: "patio", c: `<svg>7</svg>` },   // score: 1
              { uri: "test", f: "svg", m: null, i: null, t: null, c: `<svg>8</svg>` },      // score: 0
            ]
          }
        ]
      }),
        (app) => {

          const ireg = app.moduleLinker.resolve(ImageRegistry);

          // Default values for ease (aligned with image registry defaults)
          // const media = "i64";
          // const isoLang = "eng";
          // const theme = "any";

          let icon = ireg.resolve("test", "svg", { media: "i16", isoLang: "can", theme: "gdi" });
          expecting(icon, "<svg>1</svg>", CONTENT_TYPE.IMG_SVG, 1101, "Capture SVG1a");

          icon = ireg.resolve("test", "svg", { media: "i16", isoLang: "can" });
          expecting(icon, "<svg>2</svg>", CONTENT_TYPE.IMG_SVG, 1100, "Capture SVG2a");

          icon = ireg.resolve("test", "svg", { media: "i16", t: "patio" });
          expecting(icon, "<svg>3</svg>", CONTENT_TYPE.IMG_SVG, 1001, "Capture SVG3a");

          icon = ireg.resolve("test", "svg", { theme: "patio" });
          expecting(icon, "<svg>5</svg>", CONTENT_TYPE.IMG_SVG, 101, "Capture SVG5a");

          icon = ireg.resolve("test", "svg", { theme: "patio" }); // Highest score matching
          expecting(icon, "<svg>5</svg>", CONTENT_TYPE.IMG_SVG, 101, "Capture SVG5b");

          icon = ireg.resolve("test", "svg", {}); // highest score matching
          expecting(icon, "<svg>6</svg>", CONTENT_TYPE.IMG_SVG, 100, "Capture SVG6a");

          icon = ireg.resolve("test", "svg", {}); // Highest score matching
          expecting(icon, "<svg>6</svg>", CONTENT_TYPE.IMG_SVG, 100, "Capture SVG6b");

        });
    }, () => false);

    cs("resolve()", () => {

      using(application({ modules: [{ name: "ir", type: ImageRegistry }] }),
        (app) => {
          const ireg = app.moduleLinker.resolve(ImageRegistry);

          isNull(ireg.resolve("azos.ico.filter", "svg"));
          isNull(ireg.resolve("azos.ico.filter", "svg", { i: "eng" }));
          isNull(ireg.resolve("azos.ico.filter", "svg", { t: "azos" }));
          isNull(ireg.resolve("azos.ico.filter", "svg", { m: "i64" }));

          let icon = ireg.resolve("azos.ico.filter", "svg", { media: "i32" });
          areEqual(icon.produceContent().ctp, CONTENT_TYPE.IMG_SVG);
          isTrue(icon.produceContent().content.startsWith("<svg"));
          areEqual(icon.score, 1000);

        });
    });
  });
});
