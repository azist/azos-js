/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import { application } from "../application.js";

import { ImageRecord, ImageRegistry } from "../bcl/img-registry.js";
import { areArraysEquivalent, areEqual, isFalse, isNull, isTrue } from "../aver.js";
import { CONTENT_TYPE } from "../coreconsts.js";
import { doUsing } from "../types.js";
import { config } from "../conf.js";

unit("ImgRegistry", function () {

  unit("construction(app, cfg)", function () {

    function expecting(icon, eContent, eContentType, eScore, from) {
      const { content, ctp } = icon.produceContent();
      const score = icon.score;
      areEqual(content, eContent, from);
      areEqual(ctp, eContentType, from);
      areEqual(score, eScore, from);
    }

    cs("resolve()- all combos of options", () => {
      doUsing(application({
        modules: [
          {
            name: "ir",
            type: ImageRegistry,
            images: [
              { uri: "test", f: "svg", m: "i16", i: "can", t: "patio", c: `<svg>1</svg>` }, // score: 1101
              { uri: "test", f: "svg", m: "i16", i: "can", t: null, c: `<svg>2</svg>` },    // score: 1100
              { uri: "test", f: "svg", m: "i16", i: null, t: "patio", c: `<svg>3</svg>` },  // score: 1001
              { uri: "test", f: "svg", m: "i16", i: null, t: null, c: `<svg>4</svg>` },     // score: 1000
              { uri: "test", f: "svg", m: null, i: "can", t: "patio", c: `<svg>5</svg>` },  // score:  101
              { uri: "test", f: "svg", m: null, i: "can", t: null, c: `<svg>6</svg>` },     // score:  100
              { uri: "test", f: "svg", m: null, i: null, t: "patio", c: `<svg>7</svg>` },   // score:    1
              { uri: "test", f: "svg", m: null, i: null, t: null, c: `<svg>8</svg>` },      // score:    0
            ]
          }
        ]
      }),
        ({ moduleLinker }) => {

          const ireg = moduleLinker.resolve(ImageRegistry);

          let icon = ireg.resolve("test", "svg", { m: "i16", i: "can", t: "patio" });
          expecting(icon, "<svg>1</svg>", CONTENT_TYPE.IMG_SVG, 1101, "#1 Capture SVG1a");

          icon = ireg.resolve("test", "svg", { m: "i16", i: "can" });
          expecting(icon, "<svg>2</svg>", CONTENT_TYPE.IMG_SVG, 1100, "#2 Capture SVG2a");

          icon = ireg.resolve("test", "svg", { m: "i16", t: "patio" });
          expecting(icon, "<svg>3</svg>", CONTENT_TYPE.IMG_SVG, 1001, "#3 Capture SVG3a");

          icon = ireg.resolve("test", "svg", { m: "i16" });
          expecting(icon, "<svg>4</svg>", CONTENT_TYPE.IMG_SVG, 1000, "#4 Capture SVG4a");

          icon = ireg.resolve("test", "svg", { i: "can", t: "patio" });
          expecting(icon, "<svg>5</svg>", CONTENT_TYPE.IMG_SVG, 101, "#5 Capture SVG5a");

          icon = ireg.resolve("test", "svg", { i: "can" });
          expecting(icon, "<svg>6</svg>", CONTENT_TYPE.IMG_SVG, 100, "#6 Capture SVG6a");

          icon = ireg.resolve("test", "svg", { t: "patio" });
          expecting(icon, "<svg>7</svg>", CONTENT_TYPE.IMG_SVG, 1, "#7 Capture SVG7a");

          icon = ireg.resolve("test", "svg");
          expecting(icon, "<svg>8</svg>", CONTENT_TYPE.IMG_SVG, 0, "#8 Capture SVG8a");
        });
    }, () => false);

    cs("resolve()- media, m", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [{ uri: "test", f: "svg", m: "i128", i: null, t: null, c: `<svg>1</svg>` }]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let icon = ireg.resolve("test", "svg", { media: "i128" });
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 1000, "Capture SVG1a");

          icon = ireg.resolve("test", "svg", { m: "i128" });
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 1000, "Capture SVG1b");
        });
    }, () => false);

    cs("resolve()- isoLang, iso, lang, i", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [{ uri: "test", f: "svg", m: null, i: "can", t: null, c: `<svg>1</svg>` }]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let icon = ireg.resolve("test", "svg", { i: "can" });
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 100, "Capture SVG1a");

          icon = ireg.resolve("test", "svg", { iso: "can" });
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 100, "Capture SVG1b");

          icon = ireg.resolve("test", "svg", { lang: "can" });
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 100, "Capture SVG1c");

          icon = ireg.resolve("test", "svg", { isoLang: "can" });
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 100, "Capture SVG1d");
        });
    }, () => false);

    cs("resolve()- theme, t", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [{ uri: "test", f: "svg", m: null, i: null, t: "patio", c: `<svg>1</svg>` }]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let icon = ireg.resolve("test", "svg", { theme: "patio" });
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 1, "Capture SVG1a");

          icon = ireg.resolve("test", "svg", { t: "patio" });
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 1, "Capture SVG1b");
        });
    }, () => false);

    cs("resolve()- STOCK", () => {
      doUsing(application({ modules: [{ name: "ir", type: ImageRegistry }] }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          isNull(ireg.resolve("azos.ico.filter", "svg"));
          isNull(ireg.resolve("azos.ico.filter", "svg", { isoLang: "eng" }));
          isNull(ireg.resolve("azos.ico.filter", "svg", { theme: "azos" }));
          isNull(ireg.resolve("azos.ico.filter", "svg", { media: "i64" }));

          let icon = ireg.resolve("azos.ico.filter", "svg", { media: "i32" });
          expecting(icon,
            `<svg viewBox="0 0 24 24"><path d="M22 3.58002H2C1.99912 5.28492 2.43416 6.96173 3.26376 8.45117C4.09337 9.94062 5.29 11.1932 6.73999 12.09C7.44033 12.5379 8.01525 13.1565 8.41062 13.8877C8.80598 14.6189 9.00879 15.4388 9 16.27V21.54L15 20.54V16.25C14.9912 15.4188 15.194 14.599 15.5894 13.8677C15.9847 13.1365 16.5597 12.5178 17.26 12.07C18.7071 11.175 19.9019 9.92554 20.7314 8.43988C21.5608 6.95422 21.9975 5.28153 22 3.58002Z" stroke-linecap="round" stroke-linejoin="round"></svg>`
            , CONTENT_TYPE.IMG_SVG, 1000, "Capture azos.ico.filter");
        });
    }, () => false);

    cs("resolveSpec()- all combos of options", () => {
      doUsing(application({
        modules: [
          {
            name: "ir",
            type: ImageRegistry,
            images: [
              { uri: "test", f: "svg", m: "i16", i: "can", t: "patio", c: `<svg>1</svg>` }, // score: 1101
              { uri: "test", f: "svg", m: "i16", i: "can", t: null, c: `<svg>2</svg>` },    // score: 1100
              { uri: "test", f: "svg", m: "i16", i: null, t: "patio", c: `<svg>3</svg>` },  // score: 1001
              { uri: "test", f: "svg", m: "i16", i: null, t: null, c: `<svg>4</svg>` },     // score: 1000
              { uri: "test", f: "svg", m: null, i: "can", t: "patio", c: `<svg>5</svg>` },  // score:  101
              { uri: "test", f: "svg", m: null, i: "can", t: null, c: `<svg>6</svg>` },     // score:  100
              { uri: "test", f: "svg", m: null, i: null, t: "patio", c: `<svg>7</svg>` },   // score:    1
              { uri: "test", f: "svg", m: null, i: null, t: null, c: `<svg>8</svg>` },      // score:    0
            ]
          }
        ]
      }),
        ({ moduleLinker }) => {

          const ireg = moduleLinker.resolve(ImageRegistry);

          let icon = ireg.resolveSpec("svg://test?m=i16&i=can&t=patio");
          expecting(icon, "<svg>1</svg>", CONTENT_TYPE.IMG_SVG, 1101, "#1 Capture SVG1a");

          icon = ireg.resolveSpec("svg://test?m=i16&i=can");
          expecting(icon, "<svg>2</svg>", CONTENT_TYPE.IMG_SVG, 1100, "#2 Capture SVG2a");

          icon = ireg.resolveSpec("svg://test?m=i16&t=patio");
          expecting(icon, "<svg>3</svg>", CONTENT_TYPE.IMG_SVG, 1001, "#3 Capture SVG3a");

          icon = ireg.resolveSpec("svg://test?m=i16");
          expecting(icon, "<svg>4</svg>", CONTENT_TYPE.IMG_SVG, 1000, "#4 Capture SVG4a");

          icon = ireg.resolveSpec("svg://test?i=can&t=patio");
          expecting(icon, "<svg>5</svg>", CONTENT_TYPE.IMG_SVG, 101, "#5 Capture SVG5a");

          icon = ireg.resolveSpec("svg://test?i=can");
          expecting(icon, "<svg>6</svg>", CONTENT_TYPE.IMG_SVG, 100, "#6 Capture SVG6a");

          icon = ireg.resolveSpec("svg://test?t=patio");
          expecting(icon, "<svg>7</svg>", CONTENT_TYPE.IMG_SVG, 1, "#7 Capture SVG7a");

          icon = ireg.resolveSpec("svg://test");
          expecting(icon, "<svg>8</svg>", CONTENT_TYPE.IMG_SVG, 0, "#8 Capture SVG8a");
        });
    }, () => false);

    cs("resolveSpec()- media, m", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [{ uri: "test", f: "svg", m: "i128", i: null, t: null, c: `<svg>1</svg>` }]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let icon = ireg.resolveSpec("svg://test?media=i128");
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 1000, "Capture SVG1a");

          icon = ireg.resolveSpec("svg://test?m=i128");
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 1000, "Capture SVG1b");
        });
    }, () => false);

    cs("resolveSpec()- isoLang, iso, lang, i", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [{ uri: "test", f: "svg", m: null, i: "can", t: null, c: `<svg>1</svg>` }]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let icon = ireg.resolveSpec("svg://test?i=can");
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 100, "Capture SVG1a");

          icon = ireg.resolveSpec("svg://test?iso=can");
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 100, "Capture SVG1b");

          icon = ireg.resolveSpec("svg://test?lang=can");
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 100, "Capture SVG1c");

          icon = ireg.resolveSpec("svg://test?isoLang=can");
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 100, "Capture SVG1d");
        });
    }, () => false);

    cs("resolveSpec()- theme, t", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [{ uri: "test", f: "svg", m: null, i: null, t: "patio", c: `<svg>1</svg>` }]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let icon = ireg.resolveSpec("svg://test?theme=patio");
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 1, "Capture SVG1a");

          icon = ireg.resolveSpec("svg://test?t=patio");
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 1, "Capture SVG1b");
        });
    }, () => false);

    cs("resolveSpec()- STOCK", () => {
      doUsing(application({ modules: [{ name: "ir", type: ImageRegistry }] }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          isNull(ireg.resolveSpec("svg://azos.ico.filter"));
          isNull(ireg.resolveSpec("svg://azos.ico.filter?isoLang=eng"));
          isNull(ireg.resolveSpec("svg://azos.ico.filter?theme=azos"));
          isNull(ireg.resolveSpec("svg://azos.ico.filter?media=i64"));

          let icon = ireg.resolveSpec("svg://azos.ico.filter?media=i32");
          expecting(icon,
            `<svg viewBox="0 0 24 24"><path d="M22 3.58002H2C1.99912 5.28492 2.43416 6.96173 3.26376 8.45117C4.09337 9.94062 5.29 11.1932 6.73999 12.09C7.44033 12.5379 8.01525 13.1565 8.41062 13.8877C8.80598 14.6189 9.00879 15.4388 9 16.27V21.54L15 20.54V16.25C14.9912 15.4188 15.194 14.599 15.5894 13.8677C15.9847 13.1365 16.5597 12.5178 17.26 12.07C18.7071 11.175 19.9019 9.92554 20.7314 8.43988C21.5608 6.95422 21.9975 5.28153 22 3.58002Z" stroke-linecap="round" stroke-linejoin="round"></svg>`
            , CONTENT_TYPE.IMG_SVG, 1000, "Capture azos.ico.filter");
        });
    }, () => false);

    cs("getUris()", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [{ uri: "test", f: "svg", m: "i128", i: null, t: null, c: `<svg>1</svg>` }]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);
          areArraysEquivalent([...ireg.getUris()], ["test"]);
        });
    }, () => false);

    cs("getRecords()", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [
            { uri: "test", f: "svg", m: "i16", i: "can", t: "patio", c: `<svg>1</svg>` }, // score: 1101
            { uri: "test", f: "svg", m: "i16", i: "can", t: null, c: `<svg>2</svg>` },    // score: 1100
            { uri: "test", f: "svg", m: "i16", i: null, t: "patio", c: `<svg>3</svg>` },  // score: 1001
            { uri: "test", f: "svg", m: "i16", i: null, t: null, c: `<svg>4</svg>` },     // score: 1000
            { uri: "test", f: "svg", m: null, i: "can", t: "patio", c: `<svg>5</svg>` },  // score:  101
            { uri: "test", f: "svg", m: null, i: "can", t: null, c: `<svg>6</svg>` },     // score:  100
            { uri: "test", f: "svg", m: null, i: null, t: "patio", c: `<svg>7</svg>` },   // score:    1
            { uri: "test", f: "svg", m: null, i: null, t: null, c: `<svg>8</svg>` },      // score:    0
          ]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          isNull(ireg.getRecords("non-existent"));

          const records = ireg.getRecords("test");
          areEqual(records.length, 8);

          const record = records[0];
          areEqual(record.format, "svg");
          areEqual(record.media, "i16");
          areEqual(record.isoLang, "can");
          areEqual(record.theme, "patio");
          areEqual(record.content, "<svg>1</svg>");
          areEqual(record.contentType, CONTENT_TYPE.IMG_SVG);
        });
    }, () => false);

    cs("register()", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [{ uri: "test", f: "svg", m: null, i: null, t: "patio", c: `<svg>1</svg>` }]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);
          areEqual([...ireg.getUris()].length, 1);
          ireg.register("test2", new ImageRecord(config({ f: "svg", c: "<svg>2</svg>" }).root));
          areArraysEquivalent([...ireg.getUris()], ["test", "test2"]);
        });
    }, () => false);

    cs("unregisterRecords()", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [{ uri: "test", f: "svg", m: null, i: null, t: "patio", c: `<svg>1</svg>` }]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);
          isTrue(ireg.unregisterRecords("test"));
          // Well, you can only remove something once, right? :)
          isFalse(ireg.unregisterRecords("test"));
          areEqual([...ireg.getUris()].length, 0);
        });
    }, () => false);

  });
});
