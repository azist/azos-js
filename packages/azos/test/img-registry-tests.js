/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs} from "../run.js";
import { application } from "../application.js";

import { ImageRecord, ImageRegistry } from "../bcl/img-registry.js";
import { areArraysEquivalent, areEqual, isFalse, isTrue } from "../aver.js";
import { CONTENT_TYPE } from "../coreconsts.js";
import { doUsing } from "../types.js";
import { config } from "../conf.js";

unit("ImgRegistry", function () {

  unit("construction(app, cfg)", function () {

    function expecting(icon, eContent, eContentType, eScore, from) {
      const { content, ctp } = icon.produceContent();
      const score = icon.score;
      isTrue(content.includes(eContent), `${from} got: ${content}`);
      areEqual(ctp, eContentType, from);
      areEqual(score, eScore, from);
    }

    cs("resolve()- case1", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [
            { uri: "composer", f: "svg", m: null, i: null, t: null, c: `<svg>typical composer silhouette</svg>` },

            { uri: "composer", f: "svg", m: null, i: null, t: "rap", c: `<svg>snoop icon</svg>` },
            { uri: "composer", f: "svg", m: "print", i: null, t: "rap", c: `<svg>snoop print page</svg>` },
            { uri: "composer", f: "svg", m: null, i: "deu", t: "rap", c: `<svg>snoop Hund icon</svg>` },
            { uri: "composer", f: "svg", m: "print", i: "deu", t: "rap", c: `<svg>snoop Hund print page</svg>` },

            { uri: "composer", f: "svg", m: null, i: null, t: "classical", c: `<svg>bach icon</svg>` },
            { uri: "composer", f: "svg", m: "print", i: null, t: "classical", c: `<svg>bach print page</svg>` },
            { uri: "composer", f: "svg", m: null, i: "rus", t: "classical", c: `<svg>BAX icon</svg>` },
            { uri: "composer", f: "svg", m: "print", i: "rus", t: "classical", c: `<svg>BAX print page</svg>` },
          ]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let rec = ireg.resolve("composer", "svg");//i32 eng azos
          areEqual("<svg>typical composer silhouette</svg>", rec.produceContent().content);

          rec = ireg.resolve("composer", "svg", { media: "tshirt", isoLang: "esp", theme: "lemon" });
          areEqual("<svg>typical composer silhouette</svg>", rec.produceContent().content);

          rec = ireg.resolve("composer", "svg", { isoLang: "esp", theme: "rap" });
          areEqual("<svg>snoop icon</svg>", rec.produceContent().content);

          rec = ireg.resolve("composer", "svg", { isoLang: "esp", theme: "rap", media: "print" });
          areEqual("<svg>snoop print page</svg>", rec.produceContent().content);

          rec = ireg.resolve("composer", "svg", { isoLang: "deu", theme: "rap", media: "print" });
          areEqual("<svg>snoop Hund print page</svg>", rec.produceContent().content);
        });
    });

    cs("resolve()- media", () => {
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
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 1000000, "Capture SVG1a");
        });
    }, () => false);

    cs("resolve()- isoLang", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [{ uri: "test", f: "svg", m: null, i: "can", t: null, c: `<svg>1</svg>` }]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let icon = ireg.resolve("test", "svg", { isoLang: "can" });
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 1000, "Capture SVG1a");
        });
    }, () => false);

    cs("resolve()- theme", () => {
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
          expecting(icon, `<svg>1</svg>`, CONTENT_TYPE.IMG_SVG, 100, "Capture SVG1a");
        });
    }, () => false);

    cs("resolve()- STOCK", () => {
      doUsing(application({ modules: [{ name: "ir", type: ImageRegistry }] }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let icon = ireg.resolve("azos.ico.filter", "svg");
          expecting(icon, `<path d="M22 3.58002H2C1`, CONTENT_TYPE.IMG_SVG, 0, "Capture azos.ico.filter");

          icon = ireg.resolve("azos.ico.filter", "svg", { media: "i32" });
          expecting(icon, `<path d="M22 3.58002H2C1`, CONTENT_TYPE.IMG_SVG, 0, "Capture azos.ico.filter");

          icon = ireg.resolve("azos.ico.filter", "svg", { isoLang: "eng" });
          expecting(icon, `<path d="M22 3.58002H2C1`, CONTENT_TYPE.IMG_SVG, 0, "Capture azos.ico.filter");

          icon = ireg.resolve("azos.ico.filter", "svg", { theme: "azos" });
          expecting(icon, `<path d="M22 3.58002H2C1`, CONTENT_TYPE.IMG_SVG, 0, "Capture azos.ico.filter");
        });
    }, () => false);

    cs("resolveSpec()- case1", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [
            { uri: "composer", f: "svg", m: null, i: null, t: null, c: `<svg>typical composer silhouette</svg>` },

            { uri: "composer", f: "svg", m: null, i: null, t: "rap", c: `<svg>snoop icon</svg>` },
            { uri: "composer", f: "svg", m: "print", i: null, t: "rap", c: `<svg>snoop print page</svg>` },
            { uri: "composer", f: "svg", m: null, i: "deu", t: "rap", c: `<svg>snoop Hund icon</svg>` },
            { uri: "composer", f: "svg", m: "print", i: "deu", t: "rap", c: `<svg>snoop Hund print page</svg>` },

            { uri: "composer", f: "svg", m: null, i: null, t: "classical", c: `<svg>bach icon</svg>` },
            { uri: "composer", f: "svg", m: "print", i: null, t: "classical", c: `<svg>bach print page</svg>` },
            { uri: "composer", f: "svg", m: null, i: "rus", t: "classical", c: `<svg>BAX icon</svg>` },
            { uri: "composer", f: "svg", m: "print", i: "rus", t: "classical", c: `<svg>BAX print page</svg>` },
          ]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let rec = ireg.resolveSpec("svg://composer");//i32 eng azos
          areEqual("<svg>typical composer silhouette</svg>", rec.produceContent().content);

          rec = ireg.resolveSpec("svg://composer?media=tshirt&iso=esp&theme=lemon");
          areEqual("<svg>typical composer silhouette</svg>", rec.produceContent().content);

          rec = ireg.resolveSpec("svg://composer?iso=esp&theme=rap");
          areEqual("<svg>snoop icon</svg>", rec.produceContent().content);

          rec = ireg.resolveSpec("svg://composer?iso=esp&theme=rap&media=print");
          areEqual("<svg>snoop print page</svg>", rec.produceContent().content);

          rec = ireg.resolveSpec("svg://composer?iso=deu&theme=rap&media=print");
          areEqual("<svg>snoop Hund print page</svg>", rec.produceContent().content);
        });
    });

    cs("resolveSpec()- media, m", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [
            { uri: "test", f: "svg", m: "i128", i: null, t: "gdi", c: `<svg>1</svg>` },
            { uri: "test", f: "svg", m: "i128", i: "eng", t: null, c: `<svg>2</svg>` },
          ]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let icon = ireg.resolveSpec("svg://test?media=i128");
          expecting(icon, `<svg>2</svg>`, CONTENT_TYPE.IMG_SVG, 1001000, "#1 Capture SVG2");

          icon = ireg.resolveSpec("svg://test?m=i128");
          expecting(icon, `<svg>2</svg>`, CONTENT_TYPE.IMG_SVG, 1001000, "#2 Capture SVG2");
        });
    }, () => false);

    cs("resolveSpec()- isoLang, iso, lang, i", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [
            { uri: "test", f: "svg", m: null, i: "can", t: null, c: `<svg>1</svg>` },
            { uri: "test", f: "svg", m: "i32", i: "can", t: null, c: `<svg>2</svg>` },
          ]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let icon = ireg.resolveSpec("svg://test?i=can");
          expecting(icon, `<svg>2</svg>`, CONTENT_TYPE.IMG_SVG, 1001000, "#1 Capture SVG2");

          icon = ireg.resolveSpec("svg://test?iso=can");
          expecting(icon, `<svg>2</svg>`, CONTENT_TYPE.IMG_SVG, 1001000, "#2 Capture SVG2");

          icon = ireg.resolveSpec("svg://test?lang=can");
          expecting(icon, `<svg>2</svg>`, CONTENT_TYPE.IMG_SVG, 1001000, "#3 Capture SVG2");

          icon = ireg.resolveSpec("svg://test?isoLang=can");
          expecting(icon, `<svg>2</svg>`, CONTENT_TYPE.IMG_SVG, 1001000, "#4 Capture SVG2");
        });
    }, () => false);

    cs("resolveSpec()- theme, t", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [
            { uri: "test", f: "svg", m: null, i: null, t: "patio", c: `<svg>1</svg>` },
            { uri: "test", f: "svg", m: "i32", i: null, t: "patio", c: `<svg>2</svg>` },
          ]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let icon = ireg.resolveSpec("svg://test?theme=patio");
          expecting(icon, `<svg>2</svg>`, CONTENT_TYPE.IMG_SVG, 1000100, "#1 Capture SVG2");

          icon = ireg.resolveSpec("svg://test?t=patio");
          expecting(icon, `<svg>2</svg>`, CONTENT_TYPE.IMG_SVG, 1000100, "#2 Capture SVG2");
        });
    }, () => false);

    cs("resolveSpec()- STOCK", () => {
      doUsing(application({ modules: [{ name: "ir", type: ImageRegistry }] }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let icon = ireg.resolveSpec("svg://azos.ico.filter");
          expecting(icon, `<path d="M22 3.58002H2C1.99912 5.28492`, CONTENT_TYPE.IMG_SVG, 0, "Capture #1 azos.ico.filter");

          icon = ireg.resolveSpec("svg://azos.ico.filter?media=i32");
          expecting(icon, `<path d="M22 3.58002H2C1.99912 5.28492`, CONTENT_TYPE.IMG_SVG, 0, "Capture #2 azos.ico.filter");

          icon = ireg.resolveSpec("svg://azos.ico.filter?iso=eng");
          expecting(icon, `<path d="M22 3.58002H2C1.99912 5.28492`, CONTENT_TYPE.IMG_SVG, 0, "Capture #2 azos.ico.filter");

          icon = ireg.resolveSpec("svg://azos.ico.filter?theme=azos");
          expecting(icon, `<path d="M22 3.58002H2C1.99912 5.28492`, CONTENT_TYPE.IMG_SVG, 0, "Capture #2 azos.ico.filter");
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
            { uri: "test", f: "svg", m: "i16", i: "can", t: "patio", c: `<svg>1</svg>` }, // score: 1001100
            { uri: "test", f: "svg", m: "i16", i: "can", t: null, c: `<svg>2</svg>` },    // score: 1001000
            { uri: "test", f: "svg", m: "i16", i: null, t: "patio", c: `<svg>3</svg>` },  // score: 1000100
            { uri: "test", f: "svg", m: "i16", i: null, t: null, c: `<svg>4</svg>` },     // score: 1000000
            { uri: "test", f: "svg", m: null, i: "can", t: "patio", c: `<svg>5</svg>` },  // score:  101
            { uri: "test", f: "svg", m: null, i: "can", t: null, c: `<svg>6</svg>` },     // score:  1000
            { uri: "test", f: "svg", m: null, i: null, t: "patio", c: `<svg>7</svg>` },   // score:    1
            { uri: "test", f: "svg", m: null, i: null, t: null, c: `<svg>8</svg>` },      // score:    0
          ]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          areEqual(ireg.getRecords("non-existent").length, 0);

          const records = ireg.getRecords("test");
          areEqual(records.length, 8);

          const record = records[0];
          areEqual(record.format, "svg");
          areEqual(record.media, "i16");
          areEqual(record.isoLang, "can");
          areEqual(record.theme, "patio");
          areEqual(record.content, "<svg>1</svg>");
          areEqual(record.contentType, CONTENT_TYPE.IMG_SVG);
          areEqual(record.score, 1001100);
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
          ireg.register("test2", new ImageRecord(config({ format: "svg", content: "<svg>2</svg>" }).root));
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


  unit("Attributes", function(){
    cs("simple", () => {
      doUsing(application({
        modules: [{
          name: "ir",
          type: ImageRegistry,
          images: [{ uri: "test", f: "svg", m: null, i: null, t: "pumpkin", c: `<svg>12345</svg>`, attrs: {a: 1, b:-2, c: true} }]
        }]
      }),
        ({ moduleLinker }) => {
          const ireg = moduleLinker.resolve(ImageRegistry);

          let rec = ireg.resolve("test", "svg", { theme: "pumpkin" });

          areEqual(1, rec.attrs["a"]);
          areEqual(-2, rec.attrs["b"]);
          areEqual(true, rec.attrs["c"]);

          areEqual("<svg>12345</svg>", rec.produceContent().content);

        });
    }, () => false);
  });

});
