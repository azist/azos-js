/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import * as aver from "../aver.js";
import { $ } from "../linq.js";
import * as sut from "../conf.js";

unit("Configuration", function() {

  unit("config", function() {
    cs("config()",   function() {
      const cfg = sut.config({a: 1, b: 2, c: true});
      aver.areEqual(3, cfg.root.count);
      aver.areEqual(1, cfg.root.get("a"));
      aver.areEqual(2, cfg.root.get("b"));
      aver.areEqual(true, cfg.root.get("c"));
    });
  });

  unit(".ctor", function() {

    cs("undef",        () => aver.throws(()=> new sut.Configuration(undefined), "init content"));
    cs("null",         () => aver.throws(()=> new sut.Configuration(null), "init content"));
    cs("empty string", () => aver.throws(() => new sut.Configuration(""), "init content"));
    cs("bad json string", () => aver.throws(() => new sut.Configuration("{ bad json"), "init content"));
    cs("non object",   () => aver.throws(() => new sut.Configuration(123), "init content"));


    cs("from object",   function() {
      const cfg = new sut.Configuration({a: 1, b: 2, c: true});
      aver.areEqual(3, cfg.root.count);
      aver.areEqual(1, cfg.root.get("a"));
      aver.areEqual(2, cfg.root.get("b"));
      aver.areEqual(true, cfg.root.get("c"));
    });

    cs("from string",   function() {
      const cfg = new sut.Configuration('{"a": 1, "b": 2, "c": true}');
      aver.areEqual(3, cfg.root.count);
      aver.areEqual(1, cfg.root.get("a"));
      aver.areEqual(2, cfg.root.get("b"));
      aver.areEqual(true, cfg.root.get("c"));
    });

    cs(".content",   function() {
      const cfg = new sut.Configuration('{"a": 1, "b": -2}');
      aver.areEqual(2, cfg.root.count);
      aver.areEqual(1, cfg.root.get("a"));
      aver.areEqual(-2, cfg.root.get("b"));
      const content = cfg.content;
      aver.isObject(content);
      console.dir(content);
      aver.areEqual(1, content['a']);
      aver.areEqual(-2, content['b']);
    });
  });//.ctor
});


unit("ConfigNode", function() {

  cs("toString()",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    //console.info(cfg.root.toString());
    aver.areEqual("ConfigNode('/', {3})", cfg.root.toString());
  });

  cs("configuration",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    aver.areEqual(cfg, cfg.root.configuration);
  });

  cs("name",   function() {
    const cfg = sut.config({a: 1, b: {f: true}});
    aver.areEqual("/", cfg.root.name);
    aver.areEqual("b", cfg.root.get("b").name);
  });

  cs("parent",   function() {
    const cfg = sut.config({a: 1, b: {f: true}});
    aver.areEqual(cfg.root, cfg.root.get("b").parent);
  });

  cs("isSection|isArray",   function() {
    const cfg = sut.config({a: [1,2,3], b: {f: true}});
    aver.isTrue(cfg.root.get("a").isArray);
    aver.isTrue(cfg.root.get("b").isSection);
  });

  cs("path",   function() {
    const cfg = sut.config({a: 1, b: {f: {q: [ {a1: {}}, [{ok: false}] ]}}});
    aver.areEqual("/b", cfg.root.get("b").path);
    aver.areEqual("/b/f", cfg.root.get("b").get("f").path);
    aver.areEqual("/b/f/q/#0/a1", cfg.root.get("b").get("f").get("q").get("#0").get("a1").path);
  });

  cs("get() null/undefined values",   function() {
    const cfg = sut.config({a: 1, b: null, c: undefined});
    aver.areEqual(1, cfg.root.get("a"));
    aver.areEqual(null, cfg.root.get("b"));
    aver.areEqual(undefined, cfg.root.get("c"));
  });

  cs("get()",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    aver.areEqual(undefined, cfg.root.get());
  });

  cs("get(null)",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    aver.areEqual(undefined, cfg.root.get(null));
  });

  cs("get('')",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    aver.areEqual(undefined, cfg.root.get(""));
  });

  cs("get('notExist')",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    aver.areEqual(undefined, cfg.root.get("notExist"));
  });

  cs("get('notExist', 'a')",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    aver.areEqual(1, cfg.root.get("notExist", "a"));
  });

  cs("get('notExist', 'b', 'a')",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    aver.areEqual(2, cfg.root.get("notExist", "b", "a"));
  });

  cs("get('notExist', null, 'a')",   function() {
    const cfg = sut.config({a: 11, b: 22, c: true});
    aver.areEqual(11, cfg.root.get("notExist", null, "a"));
  });

  cs("get('notExist', undefined, 'a')",   function() {
    const cfg = sut.config({a: 11, b: 22, c: true});
    aver.areEqual(11, cfg.root.get("notExist", undefined, "a"));
  });

  cs("get(null|undef combinations)",   function() {
    const cfg = sut.config({a: 11, b: 22, c: true});
    aver.areEqual(11, cfg.root.get(undefined, "notExist", undefined, "a"));
    aver.areEqual(11, cfg.root.get(null, "notExist", undefined, "a"));
    aver.areEqual(22, cfg.root.get("b", null, "notExist", undefined, "a"));
    aver.areEqual(22, cfg.root.get(null, null, "b"));

    const a = [null, null, "b"];
    aver.areEqual(22, cfg.root.get(...a));
    aver.areEqual(11, cfg.root.get("a", ...a));
  });

  cs("getVerbatim(null|undef combinations)",   function() {
    const cfg = sut.config({a: 11, b: 22, c: true});
    aver.areEqual(11, cfg.root.getVerbatim(undefined, "notExist", undefined, "a"));
    aver.areEqual(11, cfg.root.getVerbatim(null, "notExist", undefined, "a"));
    aver.areEqual(22, cfg.root.getVerbatim("b", null, "notExist", undefined, "a"));
    aver.areEqual(22, cfg.root.getVerbatim(null, null, "b"));

    const a = [null, null, "b"];
    aver.areEqual(22, cfg.root.getVerbatim(...a));
    aver.areEqual(11, cfg.root.getVerbatim("a", ...a));
  });

  cs("get(section)",   function() {
    const cfg = sut.config({a: 11, b: {d: -9, z: 78.12}, c: true});
    aver.areEqual(11, cfg.root.get("a"));
    aver.isOf(cfg.root.get("b"), sut.ConfigNode);
    aver.areEqual(-9, cfg.root.get("b").get("d"));
    aver.areEqual(78.12, cfg.root.get("b").get("z"));
  });


  cs("complex structure and nav",   function() {
    const cfg = sut.config({
      v: null,
      a: {
        section1: { array: [null, false, [ {ok: true, ["string name"]: "little bug"}, null] ]},
        dbl: -9e-8,
      },
      ["long key"]: {
        x: 18,
        empty: {},
        a: 0, b: null, c: []
      },
      flag: true
    });


    aver.areEqual(4, cfg.root.count);
    aver.areEqual(2, cfg.root.get("a").count);
    aver.areEqual(1, cfg.root.get("a").get("section1").count);

    aver.areEqual(5, cfg.root.get("long key").count);
    aver.areEqual(0, cfg.root.get("long key").get("empty").count);
    aver.areEqual(0, cfg.root.get("long key").get("c").count);

    aver.areEqual(null, cfg.root.get("v"));
    aver.areEqual(-9e-8, cfg.root.get("a").get("dbl"));
    aver.areEqual(18, cfg.root.get("long key").get("x"));
    aver.areEqual(18, cfg.root.nav("long key/x"));

    aver.areEqual(null, cfg.root.nav("/a/section1/array/2/1"));
    aver.areEqual(undefined, cfg.root.nav("/a/section1/array/2/99"));

    aver.areEqual("/a/section1/array/#2/#0", cfg.root.nav("/a/section1/array/2/0").path);

    aver.areEqual("little bug", cfg.root.nav("/a/section1/array/2/0/string name"));
    aver.areEqual("little bug", cfg.root.nav("                           /a/section1/array/2/0/string name"));
    aver.areEqual("little bug", cfg.root.nav("      /a/section1/array/2/0/string name              "));
    aver.areEqual("little bug", cfg.root.nav("/a / section1/ array    /    2/   0 /      string name              "));
    aver.areEqual("little bug", cfg.root.nav("/a/section1/array/#2/#0/string name"));
    aver.areEqual("little bug", cfg.root.nav("/a/section1/array").nav("#2/#0/string name"));
    aver.areEqual("little bug", cfg.root.nav("/a/section1/array").get("2").nav("#0/string name"));
    aver.areEqual("little bug", cfg.root.nav("/a/section1/array").get("2").get("0").nav("string name"));
  });

  cs("iterator",   function() {
    const cfg = sut.config({
      abba: 11,
      bubba: {d: -9, z: 78.12},
      coll: true,
      dole: [1,5,{z: -9}]
    });

    const rootItems = $(cfg.root);
    console.groupCollapsed("Iterator.rootItems");
    for(const one of rootItems) console.dir(one);
    console.groupEnd();

    aver.areEqual(4, rootItems.count());
    aver.areIterablesEquivalent(["abba", "bubba", "coll", "dole"], rootItems.select(one => one.key));
    aver.isTrue(rootItems.all( one => one.idx === -1));
    aver.areIterablesEquivalent([11, cfg.root.get("bubba"), true, cfg.root.get("dole")], rootItems.select(one => one.val));

    const doleItems = $(cfg.root.get("dole"));
    console.groupCollapsed("Iterator.doleItems");
    for(const one of doleItems) console.dir(one);
    console.groupEnd();

    aver.areEqual(3, doleItems.count());
    aver.areIterablesEquivalent([0, 1, 2], doleItems.select(one => one.idx));
    aver.isTrue(doleItems.all( one => one.key === "dole"));
    aver.areIterablesEquivalent([1, 5, cfg.root.nav("/dole/2")], doleItems.select(one => one.val));
  });

  cs("var-path-eval",   function() {
    const cfg = sut.config({
      id: "a1bold",
      paths: {
        log: "/etc/var/logs",
        data: "~/data-$(/id)",
        mongo: "$(data)/mongo"
      },
      paths_Alias: "$(paths)",// notice that we create a direct node shortcut by not including anything else but a reference in a variable value
      paths_Alias2: "$(paths_Alias)",
      providers:[
        { name: "logger", disk: "$(/paths/log)"},
        { name: "snake", disk: "$(/paths/mongo)"},
        { name: "drake", disk: "$(/paths_Alias/data)/drakes", paths: "$(/paths_Alias)", paths2: "$(/paths_Alias2)"},
      ]
    });

    const providers = $(cfg.root.get("providers")).select(one => one.val);

    const logger = providers.firstOrDefault(one => one.get("name") === "logger").value;
    //console.dir(logger);
    aver.isNotNull(logger);
    aver.areEqual("/etc/var/logs", logger.get("disk"));

    const snake = providers.firstOrDefault(one => one.get("name") === "snake").value;
    aver.isNotNull(snake);
    aver.areEqual("~/data-a1bold/mongo", snake.get("disk"));

    const drake = providers.firstOrDefault(one => one.get("name") === "drake").value;
    aver.isNotNull(drake);
    aver.areEqual("~/data-a1bold/drakes", drake.get("disk"));
    aver.isTrue(drake.get("paths").isSection);
    aver.areEqual("/paths", drake.get("paths").path);
    aver.isTrue(drake.get("paths2").isSection);
    aver.areEqual("/paths", drake.get("paths2").path);


    aver.areEqual("Bingo Bongo: a1bold|a1bold", cfg.root.evaluate("Bingo Bongo: $(id)|$(id)"));
    aver.areEqual("Saved into: ~/data-a1bold/mongo", cfg.root.evaluate("Saved into: $(/providers/1/disk)"));

    aver.areEqual("Saved into: ~/data-a1bold/mongo", cfg.root.nav("providers/1").evaluate("Saved into: $(disk)"));
    aver.areEqual("App `a1bold` Saved into: ~/data-a1bold/mongo", cfg.root.nav("providers/#1").evaluate("App `$(/id)` Saved into: $(disk)"));

    aver.areEqual("~/data-a1bold", cfg.root.get("paths_Alias2").get("data"));
  });

  cs("verbatim",   function() {
    const cfg = sut.config({
      id: "a1bold",
      paths: new sut.Verbatim({
        log: "/etc/var/logs",
      }),
      pathsOriginal: {
        log: "/etc/var/logs",
      },
      providers: new sut.Verbatim([
        { name: "logger", disk: "$(/paths/log)"},
        { name: "snake", disk: "$(/paths/mongo)"},
      ])
    });

    const paths = cfg.root.get("paths");
    aver.isNotOf(paths, sut.ConfigNode);
    aver.isObject(paths);
    aver.areEqual("/etc/var/logs", paths.log);

    const pathsOriginal = cfg.root.get("pathsOriginal");
    aver.isOf(pathsOriginal, sut.ConfigNode);
    aver.areEqual("/etc/var/logs", pathsOriginal.get("log"));

    const providers = cfg.root.get("providers");
    aver.isArray(providers);
    aver.areEqual("logger", providers[0].name);
    aver.areEqual("snake", providers[1].name);
    aver.areEqual("$(/paths/mongo)", providers[1].disk);

  });

  cs("verbatim-2",   function() {

    class A{  [sut.GET_CONFIG_VERBATIM_VALUE](){ return 1234;}  }
    class B{    }

    const cfg = sut.config({
      a: new A(),
      b: new B()
    });

    const a = cfg.root.get("a");
    aver.isNumber(a);
    aver.areEqual(1234, a);

    const b = cfg.root.get("b");
    aver.isOf(b, sut.ConfigNode);
  });


  cs("var-recursion",   function() {
    const cfg = sut.config({
      id: "a1bold",
      paths: {
        a: "a looks at $(b)",
        b: "b looks at $(c/#2)",
        c: [false, null, "$(/paths/a)" ]
      }
    });

    aver.areEqual("a looks at $(b)", cfg.root.nav("paths").getVerbatim("a"));
    aver.throws(() => cfg.root.nav("paths").get("a"), "recursive ref to path");
  });


  cs("getNodeAttrOrValue()",   function() {
    aver.areEqual(1, sut.getNodeAttrOrValue(1, "a"));
    aver.areEqual("yes no", sut.getNodeAttrOrValue("yes no", "a"));
    aver.areEqual(-897.12, sut.getNodeAttrOrValue(sut.config({a: -897.12}), "a"));
    aver.areEqual(-897.13, sut.getNodeAttrOrValue(sut.config({a: -897.13}).root, "a"));
    aver.areEqual(undefined, sut.getNodeAttrOrValue(sut.config({a: -897.13}).root, "b"));
    aver.areEqual("zzz", sut.getNodeAttrOrValue(sut.config({a: "$(b)", b: "zzz"}), "a"));
    aver.areEqual("zzz", sut.getNodeAttrOrValue(sut.config({a: "$(b)", b: "zzz"}), "no", "cant", "a"));
  });

  cs("getVerbatimNodeAttrOrValue()",   function() {
    aver.areEqual(1, sut.getVerbatimNodeAttrOrValue(1, "a"));
    aver.areEqual("yes no", sut.getVerbatimNodeAttrOrValue("yes no", "a"));
    aver.areEqual(-897.12, sut.getVerbatimNodeAttrOrValue(sut.config({a: -897.12}), "a"));
    aver.areEqual(-897.13, sut.getVerbatimNodeAttrOrValue(sut.config({a: -897.13}).root, "a"));
    aver.areEqual(undefined, sut.getVerbatimNodeAttrOrValue(sut.config({a: -897.13}).root, "b"));
    aver.areEqual("$(b)", sut.getVerbatimNodeAttrOrValue(sut.config({a: "$(b)", b: "zzz"}), "a"));
    aver.areEqual("$(b)", sut.getVerbatimNodeAttrOrValue(sut.config({a: "$(b)", b: "zzz"}), "no", "cant", "a"));
  });


  unit("Flatten", function(){

    cs("map-simple",  function() {
      const cfg = sut.config({ a: 1, b: 2, s: "hello" });

      const got = cfg.root.flatten();
      aver.isObject(got);
      aver.areEqual(1, got.a);
      aver.areEqual(2, got.b);
      aver.areEqual("hello", got.s);
    });

    cs("map-simple-var",  function() {
      const cfg = sut.config({ a: 1, b: 2, c: "$(b)-$(a)" });

      const got = cfg.root.flatten();
      aver.isObject(got);
      aver.areEqual(1, got.a);
      aver.areEqual(2, got.b);
      aver.areEqual("2-1", got.c);
    });

    cs("map-simple-var-verbatim",  function() {
      const cfg = sut.config({ a: 1, b: 2, c: "$(b)-$(a)" });

      const got = cfg.root.flatten(true);
      aver.isObject(got);
      aver.areEqual(1, got.a);
      aver.areEqual(2, got.b);
      aver.areEqual("$(b)-$(a)", got.c);
    });

    cs("array-simple",  function() {
      const cfg = sut.config({d: [1, 2, "hello"]});

      const got = cfg.root.get("d").flatten();
      aver.isArray(got);
      aver.areEqual(1, got[0]);
      aver.areEqual(2, got[1]);
      aver.areEqual("hello", got[2]);
    });

    cs("array-simple-var",  function() {
      const cfg = sut.config({d: [1, 2, "$(1)-$(0)"]});

      const got = cfg.root.get("d").flatten();
      aver.isArray(got);
      aver.areEqual(1, got[0]);
      aver.areEqual(2, got[1]);
      aver.areEqual("2-1", got[2]);
    });

    cs("array-simple-var-verbatim",  function() {
      const cfg = sut.config({d: [1, 2, "$(1)-$(0)"]});

      const got = cfg.root.get("d").flatten(true);
      aver.isArray(got);
      aver.areEqual(1, got[0]);
      aver.areEqual(2, got[1]);
      aver.areEqual("$(1)-$(0)", got[2]);
    });


    cs("complex",  function() {
      const cfg = sut.config({
         a: 10,
         b: -275,
         s: "helloS",
         chain: {a: 1, inner: {a: 2, inner: {a: 3, inner: null}}},
         d: {
          q: 120,
          pizza: { xyz: -789, topping: "bacon", boris:  {error: "none", b: -785.328}},
          z: [-1.34, {a: true, b: -789.234}]
        }
      });

      aver.isOf(cfg.root.get("d").get("z").get("1"), sut.ConfigNode);
      aver.areEqual(-789.234, cfg.root.get("d").get("z").get("1").get("b"));

      const got = cfg.root.flatten();
      console.info(JSON.stringify(got, null, 2));
      aver.isObject(got);
      aver.areEqual(10, got.a);
      aver.areEqual(-275, got.b);
      aver.areEqual("helloS", got.s);

      aver.areEqual(3, got.chain.inner.inner.a);
      aver.areEqual(null, got.chain.inner.inner.inner);

      aver.areEqual(2, got.d.z.length);
      aver.areEqual(-1.34, got.d.z[0]);

      aver.areEqual("bacon", got.d.pizza.topping);
      aver.areEqual(-785.328, got.d.pizza.boris.b);
      aver.areEqual(-789.234, got.d.z[1].b);
    });

    cs("complex-getFlatNode()",  function() {
      const cfg = sut.config({
         a: 10,
         b: -275,
         s: "helloS",
         chain: {a: 1, inner: {a: 2, inner: {a: 3, inner: null}}},
         d: {
          q: 120,
          pizza: { xyz: -789, topping: "bacon", boris:  {error: "none", b: -785.328}},
          z: [-1.34, {a: true, b: -789.234}]
        }
      });

      aver.areEqual(null, cfg.root.getFlatNode("doesnotexist"));

      const got = cfg.root.getFlatNode("d");
      console.info(JSON.stringify(got, null, 2));

      aver.areEqual(2, got.z.length);
      aver.areEqual(-1.34, got.z[0]);

      aver.areEqual(120, got.q);
      aver.areEqual("bacon", got.pizza.topping);
      aver.areEqual(-785.328, got.pizza.boris.b);
      aver.areEqual(-789.234, got.z[1].b);
    });

  });


  cs("getChildren()",   function() {
    const cfg = sut.config({
      a: {x: 123},
      b: [{x: -11}, {x: -22}],
      c: [null, true, "yes", {x: -100},[ ], {x: -200}, {xyz: -300}]
    });

    const aNoSelf = $(cfg.root.get("a").getChildren(false));
    aver.isFalse(aNoSelf.any());

    const aWithSelf = $(cfg.root.get("a").getChildren());//true by default
    aver.isTrue(aWithSelf.any());
    aver.areEqual(1, aWithSelf.count());
    aver.areEqual(123, aWithSelf.first().get("x"));

    const b = $(cfg.root.get("b").getChildren());
    aver.isTrue(b.any());
    aver.areEqual(2, b.count());
    aver.areEqual(-11, b.first().get("x"));
    aver.areEqual(-22, b.skip(1).first().get("x"));

    const c = $(cfg.root.get("c").getChildren());
    aver.isTrue(c.any());
    aver.areEqual(3, c.count());
    aver.areEqual(-100, c.first().get("x"));
    aver.areEqual(-200, c.skip(1).first().get("x"));
    aver.areEqual(-300, c.skip(2).first().get("xyz"));
  });



  const cfgGetAccessors = sut.config({
    vUndefined: undefined,
    vNull: null,

    vStringEmpty: "",
    vStringSpace: " ",
    vStringInt1: "9",
    vStringInt2: "09",
    vStringInt3: "-09",
    vStringBool1: "true",
    vStringBool2: "yes",
    vStringBool3: "ok",
    vStringBool4: "1",
    vStringReal1: "1.0",
    vStringReal2: "-1.0",
    vStringReal3: "-1e5",
    vStringMoney1: "1.00",
    vStringMoney2: "-1.01",
    vStringMoney3: "12345.12345",
    vStringDate1: "10/12/2021",
    vStringDate2: "2018-10-31T01:29:18.123Z",


    vBool1: true,
    vBool2: 1,
    vBool3: false,

    vInt1: 123,
    vInt2: -123,
    vInt3: 0xfaca,

    vReal1: 123.0,
    vReal2: -123.0,
    vReal3: -5e-9,

    vMoney1: 123.0,
    vMoney2: -123.0012,
    vMoney3: -12345.12345,

    vDate1: new Date("2017-10-19")
  }).root;

  cs("getString(undefined)",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getString("vUndefined"));
    aver.areEqual("Mister X!", cfgGetAccessors.getString("vUndefined", "Mister X!"));
  });

  cs("getString(null)",   function() {
    aver.areEqual(null, cfgGetAccessors.getString("vNull"));
    aver.areEqual("Mister Y!", cfgGetAccessors.getString("vNull", "Mister Y!"));
  });

  cs("getString('')",   function() {
    aver.areEqual("", cfgGetAccessors.getString("vStringEmpty"));
    aver.areEqual("zzz", cfgGetAccessors.getString("vStringEmpty", "zzz"));
    aver.areEqual(" ", cfgGetAccessors.getString("vStringSpace"));
    aver.areEqual("nnn", cfgGetAccessors.getString("vStringSpace", "nnn"));
  });

  cs("getString(int)",   function() {
    aver.areEqual(0xfaca.toString(), cfgGetAccessors.getString("vInt3"));
    aver.areEqual(0xfaca.toString(), cfgGetAccessors.getString("vInt3", "kuku"));
  });

  cs("getString(money)",   function() {
    aver.areEqual("-12345.12345", cfgGetAccessors.getString("vMoney3"));
    aver.areEqual("-12345.12345", cfgGetAccessors.getString("vMoney3","smoke"));
  });

  cs("getBool(undefined)",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getBool("vUndefined"));
    aver.areEqual(true, cfgGetAccessors.getBool("vUndefined", true));
  });

  cs("getBool(null)",   function() {
    aver.areEqual(false, cfgGetAccessors.getBool("vNull"));
    aver.areEqual(false, cfgGetAccessors.getBool("vNull", true));
  });

  cs("getBool(' ')",   function() {
    aver.areEqual(false, cfgGetAccessors.getBool("vStringSpace"));
    aver.areEqual(false, cfgGetAccessors.getBool("vStringSpace", true));
  });

  cs("getBool(str1)",   function() {
    aver.areEqual(true, cfgGetAccessors.getBool("vStringBool1"));
    aver.areEqual(true, cfgGetAccessors.getBool("vStringBool1", false));
  });

  cs("getBool(str2)",   function() {
    aver.areEqual(true, cfgGetAccessors.getBool("vStringBool2"));
    aver.areEqual(true, cfgGetAccessors.getBool("vStringBool2", false));
  });

  cs("getBool(str3)",   function() {
    aver.areEqual(true, cfgGetAccessors.getBool("vStringBool3"));
    aver.areEqual(true, cfgGetAccessors.getBool("vStringBool3", false));
  });

  cs("getBool(bool1)",   function() {
    aver.areEqual(true, cfgGetAccessors.getBool("vBool1"));
    aver.areEqual(true, cfgGetAccessors.getBool("vBool1", false));
  });

  cs("getBool(bool2)",   function() {
    aver.areEqual(true, cfgGetAccessors.getBool("vBool2"));
    aver.areEqual(true, cfgGetAccessors.getBool("vBool2", false));
  });

  cs("getBool(bool3)",   function() {
    aver.areEqual(false, cfgGetAccessors.getBool("vBool3"));
    aver.areEqual(false, cfgGetAccessors.getBool("vBool3", true));
  });


  cs("getTriBool(undefined)",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getTriBool("vUndefined"));
    aver.areEqual(undefined, cfgGetAccessors.getTriBool("vUndefined", true));
  });

  cs("getTriBool(null)",   function() {
    aver.areEqual(false, cfgGetAccessors.getTriBool("vNull"));
    aver.areEqual(false, cfgGetAccessors.getTriBool("vNull", true));
  });

  cs("getTriBool(' ')",   function() {
    aver.areEqual(false, cfgGetAccessors.getTriBool("vStringSpace"));
    aver.areEqual(false, cfgGetAccessors.getTriBool("vStringSpace", true));
  });

  cs("getTriBool(str1)",   function() {
    aver.areEqual(true, cfgGetAccessors.getTriBool("vStringBool1"));
    aver.areEqual(true, cfgGetAccessors.getTriBool("vStringBool1", false));
  });

  cs("getTriBool(str2)",   function() {
    aver.areEqual(true, cfgGetAccessors.getTriBool("vStringBool2"));
    aver.areEqual(true, cfgGetAccessors.getTriBool("vStringBool2", false));
  });

  cs("getTriBool(str3)",   function() {
    aver.areEqual(true, cfgGetAccessors.getTriBool("vStringBool3"));
    aver.areEqual(true, cfgGetAccessors.getTriBool("vStringBool3", false));
  });

  cs("getInt(undefined)",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getInt("vUndefined"));
    aver.areEqual(123, cfgGetAccessors.getInt("vUndefined", 123));
  });

  cs("getInt(null)",   function() {
    aver.areEqual(0, cfgGetAccessors.getInt("vNull"));
    aver.areEqual(0, cfgGetAccessors.getInt("vNull", 456));
  });

  cs("getInt('')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getInt("vStringEmpty"));
    aver.areEqual(456, cfgGetAccessors.getInt("vStringEmpty", 456));
  });

  cs("getInt(' ')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getInt("vStringSpace"));
    aver.areEqual(-456, cfgGetAccessors.getInt("vStringSpace", -456));
  });

  cs("getInt(str1)",   function() {
    aver.areEqual(9, cfgGetAccessors.getInt("vStringInt1"));
    aver.areEqual(9, cfgGetAccessors.getInt("vStringInt1", -456));
  });

  cs("getInt(str2)",   function() {
    aver.areEqual(9, cfgGetAccessors.getInt("vStringInt2"));
    aver.areEqual(9, cfgGetAccessors.getInt("vStringInt2", -456));
  });

  cs("getInt(str3)",   function() {
    aver.areEqual(-9, cfgGetAccessors.getInt("vStringInt3"));
    aver.areEqual(-9, cfgGetAccessors.getInt("vStringInt3", -456));
  });

  cs("getInt(int1)",   function() {
    aver.areEqual(123, cfgGetAccessors.getInt("vInt1"));
    aver.areEqual(123, cfgGetAccessors.getInt("vInt1", -456));
  });

  cs("getInt(int2)",   function() {
    aver.areEqual(-123, cfgGetAccessors.getInt("vInt2"));
    aver.areEqual(-123, cfgGetAccessors.getInt("vInt2", -456));
  });

  cs("getInt(int3)",   function() {
    aver.areEqual(0xfaca, cfgGetAccessors.getInt("vInt3"));
    aver.areEqual(0xfaca, cfgGetAccessors.getInt("vInt3", -456));
  });

  cs("getReal(undefined)",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getReal("vUndefined"));
    aver.areEqual(123e5, cfgGetAccessors.getReal("vUndefined", 123e5));
  });

  cs("getReal(null)",   function() {
    aver.areEqual(0, cfgGetAccessors.getReal("vNull"));
    aver.areEqual(0, cfgGetAccessors.getReal("vNull", 456.1));
  });

  cs("getReal('')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getReal("vStringEmpty"));
    aver.areEqual(456.2, cfgGetAccessors.getReal("vStringEmpty", 456.2));
  });

  cs("getReal(' ')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getReal("vStringSpace"));
    aver.areEqual(-456.03, cfgGetAccessors.getReal("vStringSpace", -456.03));
  });

  cs("getReal(str1)",   function() {
    aver.areEqual(1.0, cfgGetAccessors.getReal("vStringReal1"));
    aver.areEqual(1.0, cfgGetAccessors.getReal("vStringReal1", -456.02));
  });

  cs("getReal(str2)",   function() {
    aver.areEqual(-1.0, cfgGetAccessors.getReal("vStringReal2"));
    aver.areEqual(-1.0, cfgGetAccessors.getReal("vStringReal2", -456.03));
  });

  cs("getReal(str3)",   function() {
    aver.areEqual(-1e5, cfgGetAccessors.getReal("vStringReal3"));
    aver.areEqual(-1e5, cfgGetAccessors.getReal("vStringReal3", -456.04));
  });

  cs("getReal(r1)",   function() {
    aver.areEqual(123.0, cfgGetAccessors.getReal("vReal1"));
    aver.areEqual(123.0, cfgGetAccessors.getReal("vReal1", -456.1));
  });

  cs("getReal(r2)",   function() {
    aver.areEqual(-123.0, cfgGetAccessors.getReal("vReal2"));
    aver.areEqual(-123.0, cfgGetAccessors.getReal("vReal2", -456.2));
  });

  cs("getReal(r3)",   function() {
    aver.areEqual(-5e-9, cfgGetAccessors.getReal("vReal3"));
    aver.areEqual(-5e-9, cfgGetAccessors.getReal("vReal3", -456.3));
  });


  cs("getMoney(undefined)",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getMoney("vUndefined"));
    aver.areEqual(100.18, cfgGetAccessors.getMoney("vUndefined", 100.18));
  });

  cs("getMoney(null)",   function() {
    aver.areEqual(0, cfgGetAccessors.getMoney("vNull"));
    aver.areEqual(0, cfgGetAccessors.getMoney("vNull", 456.1));
  });

  cs("getMoney('')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getMoney("vStringEmpty"));
    aver.areEqual(-300.12, cfgGetAccessors.getMoney("vStringEmpty", -300.12));
  });

  cs("getMoney(' ')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getMoney("vStringSpace"));
    aver.areEqual(-456.03, cfgGetAccessors.getMoney("vStringSpace", -456.03));
  });

  cs("getMoney(str1)",   function() {
    aver.areEqual(1.0, cfgGetAccessors.getMoney("vStringMoney1"));
    aver.areEqual(1.0, cfgGetAccessors.getMoney("vStringMoney1", -456.02));
  });

  cs("getMoney(str2)",   function() {
    aver.areEqual(-1.01, cfgGetAccessors.getMoney("vStringMoney2"));
    aver.areEqual(-1.01, cfgGetAccessors.getMoney("vStringMoney2", -456.03));
  });

  cs("getMoney(str3)",   function() {
    aver.areEqual(12345.1234, cfgGetAccessors.getMoney("vStringMoney3"));
    aver.areEqual(12345.1234, cfgGetAccessors.getMoney("vStringMoney3", -456.04));
  });

  cs("getMoney(m1)",   function() {
    aver.areEqual(123.0, cfgGetAccessors.getMoney("vMoney1"));
    aver.areEqual(123.0, cfgGetAccessors.getMoney("vMoney1", -456.1));
  });

  cs("getMoney(m2)",   function() {
    aver.areEqual(-123.0012, cfgGetAccessors.getMoney("vMoney2"));
    aver.areEqual(-123.0012, cfgGetAccessors.getMoney("vMoney2", -456.2));
  });

  cs("getMoney(m3)",   function() {
    aver.areEqual(-12345.1234, cfgGetAccessors.getMoney("vMoney3"));
    aver.areEqual(-12345.1234, cfgGetAccessors.getMoney("vMoney3", -456.3));
  });



  cs("getDate(undefined)",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getDate("vUndefined"));
    aver.areEqual(1980, cfgGetAccessors.getDate("vUndefined", new Date("1980-02-21")).getUTCFullYear());
  });

  cs("getDate(null)",   function() {
    aver.areEqual(1970, cfgGetAccessors.getDate("vNull").getUTCFullYear());
    aver.areEqual(1970, cfgGetAccessors.getDate("vNull", new Date("1980-02-21")).getUTCFullYear());
  });

  cs("getDate('')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getDate("vStringEmpty"));
    aver.areEqual(-300.12, cfgGetAccessors.getDate("vStringEmpty", -300.12));
  });

  cs("getDate(' ')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getDate("vStringSpace"));
    aver.areEqual(-456.03, cfgGetAccessors.getDate("vStringSpace", -456.03));
  });

  cs("getDate(str1)",   function() {
    aver.areEqual(2021, cfgGetAccessors.getDate("vStringDate1").getFullYear());
    aver.areEqual(2021, cfgGetAccessors.getDate("vStringDate1", new Date("1980-02-21")).getUTCFullYear());
  });

  cs("getDate(str2)",   function() {
    aver.areEqual(2018, cfgGetAccessors.getDate("vStringDate2").getFullYear());
    aver.areEqual(2018, cfgGetAccessors.getDate("vStringDate2", new Date("1980-02-21")).getUTCFullYear());
  });


  cs("getDate(d1)",   function() {
    //console.dir(cfgGetAccessors.getString("vDate1"));
    aver.areEqual(2017, cfgGetAccessors.getDate("vDate1").getFullYear());
    aver.areEqual(2017, cfgGetAccessors.getDate("vDate1",  new Date("1980-02-21")).getUTCFullYear());
  });


});//ConfigNode



class IConfMock{
  #name;
  constructor(cfg){
    this.#name = cfg.getString("name", "no-name");
  }
  get name(){ return this.#name; }
}

class ConfMockA extends IConfMock{
  #age;
  constructor(cfg){
    super(cfg);
    this.#age = cfg.getInt("age");
  }
  get age(){ return this.#age; }
}

class ConfMockB extends IConfMock{
  #dob;
  constructor(cfg){
    super(cfg);
    this.#dob = cfg.getDate("dob");
  }
  get dob(){ return this.#dob; }
}

class ConfMockC extends ConfMockB{ constructor(cfg){ super(cfg); } }

class ConfMockStandalone {
  #args;
  constructor(...args){ this.#args = args; }
  get args(){ return this.#args;}
}

unit("Config::MakeNew", function() {

  cs("makeA",   function() {
    const cfg = sut.config({
      type: ConfMockA,
      name: "MockA",
      age: 99
    });
    const got = sut.makeNew(IConfMock, cfg.root);
    //console.dir(got);
    aver.isOf(got, ConfMockA);
    aver.isOf(got, IConfMock);
    aver.areEqual("MockA", got.name);
    aver.areEqual(99, got.age);
  });

  cs("makeB",   function() {
    const cfg = sut.config({
      type: ConfMockB,
      name: "MockB",
      dob: new Date("1980-08-05")  //"1980-08-05"
    });
    const got = sut.makeNew(IConfMock, cfg.root);
    //console.dir(got);
    aver.isOf(got, ConfMockB);
    aver.isOf(got, IConfMock);
    aver.areEqual("MockB", got.name);
    aver.areEqual(1980, got.dob.getFullYear());
  });

  cs("makeC",   function() {
    const cfg = sut.config({
      type: ConfMockC,
      name: "MockC",
      dob: new Date("1999-08-05")
    });
    const got = sut.makeNew(IConfMock, cfg.root);
    //console.dir(got);

    aver.isOf(got, ConfMockC);
    aver.isOf(got, ConfMockB);
    aver.isOf(got, IConfMock);
    aver.isNotOf(got, ConfMockA);
    aver.areEqual("MockC", got.name);
    aver.areEqual(1999, got.dob.getFullYear());
  });

  cs("makeWrongSubtype",   function() {
    const cfg = sut.config({ type: ConfMockStandalone });
    aver.throws(() => sut.makeNew(IConfMock, cfg.root), "is not of expected base");
  });

  cs("useFactoryFunction",   function() {
    const got = sut.makeNew(Object, ConfMockStandalone);
    aver.isOf(got, ConfMockStandalone);
    aver.areEqual(0, got.args.length);
  });

  cs("useFactoryFunction ctor args",   function() {
    const got = sut.makeNew(Object, ConfMockStandalone, null, null, [1, true, 'abc']);
    aver.isOf(got, ConfMockStandalone);
    aver.areEqual(3, got.args.length);
    aver.areArraysEquivalent([1, true, 'abc'], got.args);
  });

  cs("useFactoryFunction ctor args with director",   function() {
    const dir = {a: 1};

    const got = sut.makeNew(Object, ConfMockStandalone, dir, null, [1, true, 'abc']);
    aver.isOf(got, ConfMockStandalone);
    aver.areEqual(4, got.args.length);
    aver.areArraysEquivalent([dir, 1, true, 'abc'], got.args);
  });

  cs("standalone cfg dir args",   function() {
    const dir = {a: 1};
    const cfg = sut.config({ type: ConfMockStandalone });
    const got = sut.makeNew(Object, cfg.root, dir, null, [-1, true, 'abcd']);
    aver.isOf(got, ConfMockStandalone);
    aver.areEqual(5, got.args.length);
    aver.areArraysEquivalent([dir, cfg.root, -1, true, 'abcd'], got.args);
  });

  cs("standalone cfg dir default type args",   function() {
    const dir = {a: 1};
    const cfg = sut.config({ x: 1 });
    const got = sut.makeNew(Object, cfg.root, dir, ConfMockStandalone, [-1, true, 'abcd']);
    aver.isOf(got, ConfMockStandalone);
    aver.areEqual(5, got.args.length);
    aver.areArraysEquivalent([dir, cfg.root, -1, true, 'abcd'], got.args);
  });

  cs("standalone missing dflt type",   function() {
    const dir = {a: 1};
    const cfg = sut.config({ x: 1 });
    aver.throws(() => sut.makeNew(Object, cfg.root, dir, undefined, [-1, true, 'abcd']), "cls was not supplied");
  });

});


unit("Config::Performance", function() {

  const cfgJson =`{
    "a": 1, "b": true, "c": false, "d": null, "e": -9e3, "msg": "loaded from json",

    "obj-a": { "ar": [{"a":{"b":[ 1,null,3,4,"sduhfsuihdfiuhsdu",6,7,8,9]}},{}, {"x": -9}, true, true, false, -79] },
    "obj-b": { "ar": [{},null,{"x": 129}, false, true, false, 500] },
    "obj-c": { "ar": [{},{},{"x": 4}, false, true, false, 12] },
    "app":{
      "paths": { "log": "/etc/testing/book" },
      "log": { "provider": {"type": "Cutz", "sinks":
       [
        {"name": "disk", "path": "$(/app/paths/log)/shneershon/$(/c)-borukh"}
       ]}}
     },
     "mock": {
        "name": "MockC",
        "dob": "1567-08-05"
     }
    }`;


  cs("from Json",   function() { // 75K ops/sec on OCTOD
    console.time("cfg");
    for(let i=0; i<10_000; i++){
      const cfg = sut.config(cfgJson);
      aver.areEqual("loaded from json", cfg.root.get("msg"));
    }
    console.timeEnd("cfg");

  });

  cs("navigate",   function() { // 80K ops/sec on OCTOD
    console.time("cfg");
    const cfg = sut.config(cfgJson);
    for(let i=0; i<10_000; i++){
      aver.areEqual("/etc/testing/book/shneershon/false-borukh", cfg.root.nav("/app/log/provider/sinks/0/path"));
    }
    console.timeEnd("cfg");

  });

  cs("makeNew",   function() { // 200K ops/sec on OCTOD
    console.time("cfg");
    const cfg = sut.config(cfgJson);
    for(let i=0; i<10_000; i++){
      const got = sut.makeNew(IConfMock, cfg.root.get("mock"), null, ConfMockC);

      aver.isOf(got, ConfMockC);
      aver.isOf(got, ConfMockB);
      aver.isOf(got, IConfMock);
      aver.isNotOf(got, ConfMockA);
      aver.areEqual("MockC", got.name);
      aver.areEqual(1567, got.dob.getFullYear());
    }
    console.timeEnd("cfg");

  });

});
