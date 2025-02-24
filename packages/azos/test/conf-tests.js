/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

//import { describe, it } from "mocha";
import { defineUnit as describe, defineCase as it } from "../run.js";
import * as aver from "../aver.js";
import { $ } from "../linq.js";
import * as sut from "../conf.js";

describe("Configuration", function() {

  describe("config", function() {
    it("config()",   function() {
      const cfg = sut.config({a: 1, b: 2, c: true});
      aver.areEqual(3, cfg.root.count);
      aver.areEqual(1, cfg.root.get("a"));
      aver.areEqual(2, cfg.root.get("b"));
      aver.areEqual(true, cfg.root.get("c"));
    });
  });

  describe(".ctor", function() {

    it("undef",        () => aver.throws(()=> new sut.Configuration(undefined), "init content"));
    it("null",         () => aver.throws(()=> new sut.Configuration(null), "init content"));
    it("empty string", () => aver.throws(() => new sut.Configuration(""), "init content"));
    it("bad json string", () => aver.throws(() => new sut.Configuration("{ bad json"), "init content"));
    it("non object",   () => aver.throws(() => new sut.Configuration(123), "init content"));


    it("from object",   function() {
      const cfg = new sut.Configuration({a: 1, b: 2, c: true});
      aver.areEqual(3, cfg.root.count);
      aver.areEqual(1, cfg.root.get("a"));
      aver.areEqual(2, cfg.root.get("b"));
      aver.areEqual(true, cfg.root.get("c"));
    });

    it("from string",   function() {
      const cfg = new sut.Configuration('{"a": 1, "b": 2, "c": true}');
      aver.areEqual(3, cfg.root.count);
      aver.areEqual(1, cfg.root.get("a"));
      aver.areEqual(2, cfg.root.get("b"));
      aver.areEqual(true, cfg.root.get("c"));
    });

    it(".content",   function() {
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


describe("ConfigNode", function() {

  it("toString()",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    //console.info(cfg.root.toString());
    aver.areEqual("ConfigNode('/', {3})", cfg.root.toString());
  });

  it("configuration",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    aver.areEqual(cfg, cfg.root.configuration);
  });

  it("name",   function() {
    const cfg = sut.config({a: 1, b: {f: true}});
    aver.areEqual("/", cfg.root.name);
    aver.areEqual("b", cfg.root.get("b").name);
  });

  it("parent",   function() {
    const cfg = sut.config({a: 1, b: {f: true}});
    aver.areEqual(cfg.root, cfg.root.get("b").parent);
  });

  it("isSection|isArray",   function() {
    const cfg = sut.config({a: [1,2,3], b: {f: true}});
    aver.isTrue(cfg.root.get("a").isArray);
    aver.isTrue(cfg.root.get("b").isSection);
  });

  it("path",   function() {
    const cfg = sut.config({a: 1, b: {f: {q: [ {a1: {}}, [{ok: false}] ]}}});
    aver.areEqual("/b", cfg.root.get("b").path);
    aver.areEqual("/b/f", cfg.root.get("b").get("f").path);
    aver.areEqual("/b/f/q/#0/a1", cfg.root.get("b").get("f").get("q").get("#0").get("a1").path);
  });

  it("get() null/undefined values",   function() {
    const cfg = sut.config({a: 1, b: null, c: undefined});
    aver.areEqual(1, cfg.root.get("a"));
    aver.areEqual(null, cfg.root.get("b"));
    aver.areEqual(undefined, cfg.root.get("c"));
  });

  it("get()",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    aver.areEqual(undefined, cfg.root.get());
  });

  it("get(null)",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    aver.areEqual(undefined, cfg.root.get(null));
  });

  it("get('')",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    aver.areEqual(undefined, cfg.root.get(""));
  });

  it("get('notExist')",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    aver.areEqual(undefined, cfg.root.get("notExist"));
  });

  it("get('notExist', 'a')",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    aver.areEqual(1, cfg.root.get("notExist", "a"));
  });

  it("get('notExist', 'b', 'a')",   function() {
    const cfg = sut.config({a: 1, b: 2, c: true});
    aver.areEqual(2, cfg.root.get("notExist", "b", "a"));
  });

  it("get('notExist', null, 'a')",   function() {
    const cfg = sut.config({a: 11, b: 22, c: true});
    aver.areEqual(11, cfg.root.get("notExist", null, "a"));
  });

  it("get('notExist', undefined, 'a')",   function() {
    const cfg = sut.config({a: 11, b: 22, c: true});
    aver.areEqual(11, cfg.root.get("notExist", undefined, "a"));
  });

  it("get(null|undef combinations)",   function() {
    const cfg = sut.config({a: 11, b: 22, c: true});
    aver.areEqual(11, cfg.root.get(undefined, "notExist", undefined, "a"));
    aver.areEqual(11, cfg.root.get(null, "notExist", undefined, "a"));
    aver.areEqual(22, cfg.root.get("b", null, "notExist", undefined, "a"));
    aver.areEqual(22, cfg.root.get(null, null, "b"));

    const a = [null, null, "b"];
    aver.areEqual(22, cfg.root.get(...a));
    aver.areEqual(11, cfg.root.get("a", ...a));
  });

  it("getVerbatim(null|undef combinations)",   function() {
    const cfg = sut.config({a: 11, b: 22, c: true});
    aver.areEqual(11, cfg.root.getVerbatim(undefined, "notExist", undefined, "a"));
    aver.areEqual(11, cfg.root.getVerbatim(null, "notExist", undefined, "a"));
    aver.areEqual(22, cfg.root.getVerbatim("b", null, "notExist", undefined, "a"));
    aver.areEqual(22, cfg.root.getVerbatim(null, null, "b"));

    const a = [null, null, "b"];
    aver.areEqual(22, cfg.root.getVerbatim(...a));
    aver.areEqual(11, cfg.root.getVerbatim("a", ...a));
  });

  it("get(section)",   function() {
    const cfg = sut.config({a: 11, b: {d: -9, z: 78.12}, c: true});
    aver.areEqual(11, cfg.root.get("a"));
    aver.isOf(cfg.root.get("b"), sut.ConfigNode);
    aver.areEqual(-9, cfg.root.get("b").get("d"));
    aver.areEqual(78.12, cfg.root.get("b").get("z"));
  });


  it("complex structure and nav",   function() {
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

  it("iterator",   function() {
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

  it("var path eval",   function() {
    const cfg = sut.config({
      id: "a1bold",
      paths: {
        log: "/etc/var/logs",
        data: "~/data-$(/id)",
        mongo: "$(data)/mongo"
      },
      providers:[
        { name: "logger", disk: "$(/paths/log)"},
        { name: "snake", disk: "$(/paths/mongo)"},
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

    aver.areEqual("Bingo Bongo: a1bold|a1bold", cfg.root.evaluate("Bingo Bongo: $(id)|$(id)"));
    aver.areEqual("Saved into: ~/data-a1bold/mongo", cfg.root.evaluate("Saved into: $(/providers/1/disk)"));

    aver.areEqual("Saved into: ~/data-a1bold/mongo", cfg.root.nav("providers/1").evaluate("Saved into: $(disk)"));
    aver.areEqual("App `a1bold` Saved into: ~/data-a1bold/mongo", cfg.root.nav("providers/#1").evaluate("App `$(/id)` Saved into: $(disk)"));
  });

  it("verbatim",   function() {
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

  it("verbatim-2",   function() {

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


  it("var recursion",   function() {
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


  it("getChildren()",   function() {
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

  it("getString(undefined)",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getString("vUndefined"));
    aver.areEqual("Mister X!", cfgGetAccessors.getString("vUndefined", "Mister X!"));
  });

  it("getString(null)",   function() {
    aver.areEqual(null, cfgGetAccessors.getString("vNull"));
    aver.areEqual("Mister Y!", cfgGetAccessors.getString("vNull", "Mister Y!"));
  });

  it("getString('')",   function() {
    aver.areEqual("", cfgGetAccessors.getString("vStringEmpty"));
    aver.areEqual("zzz", cfgGetAccessors.getString("vStringEmpty", "zzz"));
    aver.areEqual(" ", cfgGetAccessors.getString("vStringSpace"));
    aver.areEqual("nnn", cfgGetAccessors.getString("vStringSpace", "nnn"));
  });

  it("getString(int)",   function() {
    aver.areEqual(0xfaca.toString(), cfgGetAccessors.getString("vInt3"));
    aver.areEqual(0xfaca.toString(), cfgGetAccessors.getString("vInt3", "kuku"));
  });

  it("getString(money)",   function() {
    aver.areEqual("-12345.12345", cfgGetAccessors.getString("vMoney3"));
    aver.areEqual("-12345.12345", cfgGetAccessors.getString("vMoney3","smoke"));
  });

  it("getBool(undefined)",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getBool("vUndefined"));
    aver.areEqual(true, cfgGetAccessors.getBool("vUndefined", true));
  });

  it("getBool(null)",   function() {
    aver.areEqual(false, cfgGetAccessors.getBool("vNull"));
    aver.areEqual(false, cfgGetAccessors.getBool("vNull", true));
  });

  it("getBool(' ')",   function() {
    aver.areEqual(false, cfgGetAccessors.getBool("vStringSpace"));
    aver.areEqual(false, cfgGetAccessors.getBool("vStringSpace", true));
  });

  it("getBool(str1)",   function() {
    aver.areEqual(true, cfgGetAccessors.getBool("vStringBool1"));
    aver.areEqual(true, cfgGetAccessors.getBool("vStringBool1", false));
  });

  it("getBool(str2)",   function() {
    aver.areEqual(true, cfgGetAccessors.getBool("vStringBool2"));
    aver.areEqual(true, cfgGetAccessors.getBool("vStringBool2", false));
  });

  it("getBool(str3)",   function() {
    aver.areEqual(true, cfgGetAccessors.getBool("vStringBool3"));
    aver.areEqual(true, cfgGetAccessors.getBool("vStringBool3", false));
  });

  it("getBool(bool1)",   function() {
    aver.areEqual(true, cfgGetAccessors.getBool("vBool1"));
    aver.areEqual(true, cfgGetAccessors.getBool("vBool1", false));
  });

  it("getBool(bool2)",   function() {
    aver.areEqual(true, cfgGetAccessors.getBool("vBool2"));
    aver.areEqual(true, cfgGetAccessors.getBool("vBool2", false));
  });

  it("getBool(bool3)",   function() {
    aver.areEqual(false, cfgGetAccessors.getBool("vBool3"));
    aver.areEqual(false, cfgGetAccessors.getBool("vBool3", true));
  });


  it("getTriBool(undefined)",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getTriBool("vUndefined"));
    aver.areEqual(undefined, cfgGetAccessors.getTriBool("vUndefined", true));
  });

  it("getTriBool(null)",   function() {
    aver.areEqual(false, cfgGetAccessors.getTriBool("vNull"));
    aver.areEqual(false, cfgGetAccessors.getTriBool("vNull", true));
  });

  it("getTriBool(' ')",   function() {
    aver.areEqual(false, cfgGetAccessors.getTriBool("vStringSpace"));
    aver.areEqual(false, cfgGetAccessors.getTriBool("vStringSpace", true));
  });

  it("getTriBool(str1)",   function() {
    aver.areEqual(true, cfgGetAccessors.getTriBool("vStringBool1"));
    aver.areEqual(true, cfgGetAccessors.getTriBool("vStringBool1", false));
  });

  it("getTriBool(str2)",   function() {
    aver.areEqual(true, cfgGetAccessors.getTriBool("vStringBool2"));
    aver.areEqual(true, cfgGetAccessors.getTriBool("vStringBool2", false));
  });

  it("getTriBool(str3)",   function() {
    aver.areEqual(true, cfgGetAccessors.getTriBool("vStringBool3"));
    aver.areEqual(true, cfgGetAccessors.getTriBool("vStringBool3", false));
  });

  it("getInt(undefined)",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getInt("vUndefined"));
    aver.areEqual(123, cfgGetAccessors.getInt("vUndefined", 123));
  });

  it("getInt(null)",   function() {
    aver.areEqual(0, cfgGetAccessors.getInt("vNull"));
    aver.areEqual(0, cfgGetAccessors.getInt("vNull", 456));
  });

  it("getInt('')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getInt("vStringEmpty"));
    aver.areEqual(456, cfgGetAccessors.getInt("vStringEmpty", 456));
  });

  it("getInt(' ')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getInt("vStringSpace"));
    aver.areEqual(-456, cfgGetAccessors.getInt("vStringSpace", -456));
  });

  it("getInt(str1)",   function() {
    aver.areEqual(9, cfgGetAccessors.getInt("vStringInt1"));
    aver.areEqual(9, cfgGetAccessors.getInt("vStringInt1", -456));
  });

  it("getInt(str2)",   function() {
    aver.areEqual(9, cfgGetAccessors.getInt("vStringInt2"));
    aver.areEqual(9, cfgGetAccessors.getInt("vStringInt2", -456));
  });

  it("getInt(str3)",   function() {
    aver.areEqual(-9, cfgGetAccessors.getInt("vStringInt3"));
    aver.areEqual(-9, cfgGetAccessors.getInt("vStringInt3", -456));
  });

  it("getInt(int1)",   function() {
    aver.areEqual(123, cfgGetAccessors.getInt("vInt1"));
    aver.areEqual(123, cfgGetAccessors.getInt("vInt1", -456));
  });

  it("getInt(int2)",   function() {
    aver.areEqual(-123, cfgGetAccessors.getInt("vInt2"));
    aver.areEqual(-123, cfgGetAccessors.getInt("vInt2", -456));
  });

  it("getInt(int3)",   function() {
    aver.areEqual(0xfaca, cfgGetAccessors.getInt("vInt3"));
    aver.areEqual(0xfaca, cfgGetAccessors.getInt("vInt3", -456));
  });

  it("getReal(undefined)",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getReal("vUndefined"));
    aver.areEqual(123e5, cfgGetAccessors.getReal("vUndefined", 123e5));
  });

  it("getReal(null)",   function() {
    aver.areEqual(0, cfgGetAccessors.getReal("vNull"));
    aver.areEqual(0, cfgGetAccessors.getReal("vNull", 456.1));
  });

  it("getReal('')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getReal("vStringEmpty"));
    aver.areEqual(456.2, cfgGetAccessors.getReal("vStringEmpty", 456.2));
  });

  it("getReal(' ')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getReal("vStringSpace"));
    aver.areEqual(-456.03, cfgGetAccessors.getReal("vStringSpace", -456.03));
  });

  it("getReal(str1)",   function() {
    aver.areEqual(1.0, cfgGetAccessors.getReal("vStringReal1"));
    aver.areEqual(1.0, cfgGetAccessors.getReal("vStringReal1", -456.02));
  });

  it("getReal(str2)",   function() {
    aver.areEqual(-1.0, cfgGetAccessors.getReal("vStringReal2"));
    aver.areEqual(-1.0, cfgGetAccessors.getReal("vStringReal2", -456.03));
  });

  it("getReal(str3)",   function() {
    aver.areEqual(-1e5, cfgGetAccessors.getReal("vStringReal3"));
    aver.areEqual(-1e5, cfgGetAccessors.getReal("vStringReal3", -456.04));
  });

  it("getReal(r1)",   function() {
    aver.areEqual(123.0, cfgGetAccessors.getReal("vReal1"));
    aver.areEqual(123.0, cfgGetAccessors.getReal("vReal1", -456.1));
  });

  it("getReal(r2)",   function() {
    aver.areEqual(-123.0, cfgGetAccessors.getReal("vReal2"));
    aver.areEqual(-123.0, cfgGetAccessors.getReal("vReal2", -456.2));
  });

  it("getReal(r3)",   function() {
    aver.areEqual(-5e-9, cfgGetAccessors.getReal("vReal3"));
    aver.areEqual(-5e-9, cfgGetAccessors.getReal("vReal3", -456.3));
  });


  it("getMoney(undefined)",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getMoney("vUndefined"));
    aver.areEqual(100.18, cfgGetAccessors.getMoney("vUndefined", 100.18));
  });

  it("getMoney(null)",   function() {
    aver.areEqual(0, cfgGetAccessors.getMoney("vNull"));
    aver.areEqual(0, cfgGetAccessors.getMoney("vNull", 456.1));
  });

  it("getMoney('')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getMoney("vStringEmpty"));
    aver.areEqual(-300.12, cfgGetAccessors.getMoney("vStringEmpty", -300.12));
  });

  it("getMoney(' ')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getMoney("vStringSpace"));
    aver.areEqual(-456.03, cfgGetAccessors.getMoney("vStringSpace", -456.03));
  });

  it("getMoney(str1)",   function() {
    aver.areEqual(1.0, cfgGetAccessors.getMoney("vStringMoney1"));
    aver.areEqual(1.0, cfgGetAccessors.getMoney("vStringMoney1", -456.02));
  });

  it("getMoney(str2)",   function() {
    aver.areEqual(-1.01, cfgGetAccessors.getMoney("vStringMoney2"));
    aver.areEqual(-1.01, cfgGetAccessors.getMoney("vStringMoney2", -456.03));
  });

  it("getMoney(str3)",   function() {
    aver.areEqual(12345.1234, cfgGetAccessors.getMoney("vStringMoney3"));
    aver.areEqual(12345.1234, cfgGetAccessors.getMoney("vStringMoney3", -456.04));
  });

  it("getMoney(m1)",   function() {
    aver.areEqual(123.0, cfgGetAccessors.getMoney("vMoney1"));
    aver.areEqual(123.0, cfgGetAccessors.getMoney("vMoney1", -456.1));
  });

  it("getMoney(m2)",   function() {
    aver.areEqual(-123.0012, cfgGetAccessors.getMoney("vMoney2"));
    aver.areEqual(-123.0012, cfgGetAccessors.getMoney("vMoney2", -456.2));
  });

  it("getMoney(m3)",   function() {
    aver.areEqual(-12345.1234, cfgGetAccessors.getMoney("vMoney3"));
    aver.areEqual(-12345.1234, cfgGetAccessors.getMoney("vMoney3", -456.3));
  });



  it("getDate(undefined)",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getDate("vUndefined"));
    aver.areEqual(1980, cfgGetAccessors.getDate("vUndefined", new Date("1980-02-21")).getFullYear());
  });

  it("getDate(null)",   function() {
    aver.areEqual(1969, cfgGetAccessors.getDate("vNull").getFullYear());
    aver.areEqual(1969, cfgGetAccessors.getDate("vNull", new Date("1980-02-21")).getFullYear());
  });

  it("getDate('')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getDate("vStringEmpty"));
    aver.areEqual(-300.12, cfgGetAccessors.getDate("vStringEmpty", -300.12));
  });

  it("getDate(' ')",   function() {
    aver.areEqual(undefined, cfgGetAccessors.getDate("vStringSpace"));
    aver.areEqual(-456.03, cfgGetAccessors.getDate("vStringSpace", -456.03));
  });

  it("getDate(str1)",   function() {
    aver.areEqual(2021, cfgGetAccessors.getDate("vStringDate1").getFullYear());
    aver.areEqual(2021, cfgGetAccessors.getDate("vStringDate1", new Date("1980-02-21")).getFullYear());
  });

  it("getDate(str2)",   function() {
    aver.areEqual(2018, cfgGetAccessors.getDate("vStringDate2").getFullYear());
    aver.areEqual(2018, cfgGetAccessors.getDate("vStringDate2", new Date("1980-02-21")).getFullYear());
  });


  it("getDate(d1)",   function() {
    //console.dir(cfgGetAccessors.getString("vDate1"));
    aver.areEqual(2017, cfgGetAccessors.getDate("vDate1").getFullYear());
    aver.areEqual(2017, cfgGetAccessors.getDate("vDate1",  new Date("1980-02-21")).getFullYear());
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

describe("Config::MakeNew", function() {

  it("makeA",   function() {
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

  it("makeB",   function() {
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

  it("makeC",   function() {
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

  it("makeWrongSubtype",   function() {
    const cfg = sut.config({ type: ConfMockStandalone });
    aver.throws(() => sut.makeNew(IConfMock, cfg.root), "is not of expected base");
  });

  it("useFactoryFunction",   function() {
    const got = sut.makeNew(Object, ConfMockStandalone);
    aver.isOf(got, ConfMockStandalone);
    aver.areEqual(0, got.args.length);
  });

  it("useFactoryFunction ctor args",   function() {
    const got = sut.makeNew(Object, ConfMockStandalone, null, null, [1, true, 'abc']);
    aver.isOf(got, ConfMockStandalone);
    aver.areEqual(3, got.args.length);
    aver.areArraysEquivalent([1, true, 'abc'], got.args);
  });

  it("useFactoryFunction ctor args with director",   function() {
    const dir = {a: 1};

    const got = sut.makeNew(Object, ConfMockStandalone, dir, null, [1, true, 'abc']);
    aver.isOf(got, ConfMockStandalone);
    aver.areEqual(4, got.args.length);
    aver.areArraysEquivalent([dir, 1, true, 'abc'], got.args);
  });

  it("standalone cfg dir args",   function() {
    const dir = {a: 1};
    const cfg = sut.config({ type: ConfMockStandalone });
    const got = sut.makeNew(Object, cfg.root, dir, null, [-1, true, 'abcd']);
    aver.isOf(got, ConfMockStandalone);
    aver.areEqual(5, got.args.length);
    aver.areArraysEquivalent([dir, cfg.root, -1, true, 'abcd'], got.args);
  });

  it("standalone cfg dir default type args",   function() {
    const dir = {a: 1};
    const cfg = sut.config({ x: 1 });
    const got = sut.makeNew(Object, cfg.root, dir, ConfMockStandalone, [-1, true, 'abcd']);
    aver.isOf(got, ConfMockStandalone);
    aver.areEqual(5, got.args.length);
    aver.areArraysEquivalent([dir, cfg.root, -1, true, 'abcd'], got.args);
  });

  it("standalone missing dflt type",   function() {
    const dir = {a: 1};
    const cfg = sut.config({ x: 1 });
    aver.throws(() => sut.makeNew(Object, cfg.root, dir, undefined, [-1, true, 'abcd']), "cls was not supplied");
  });

});


describe("Config::Performance", function() {

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


  it("from Json",   function() { // 75K ops/sec on OCTOD
    this.timeoutMs = 500;
    console.time("cfg");
    for(let i=0; i<10_000; i++){
      const cfg = sut.config(cfgJson);
      aver.areEqual("loaded from json", cfg.root.get("msg"));
    }
    console.timeEnd("cfg");

  });

  it("navigate",   function() { // 80K ops/sec on OCTOD
    this.timeoutMs = 350;
    console.time("cfg");
    const cfg = sut.config(cfgJson);
    for(let i=0; i<10_000; i++){
      aver.areEqual("/etc/testing/book/shneershon/false-borukh", cfg.root.nav("/app/log/provider/sinks/0/path"));
    }
    console.timeEnd("cfg");

  });

  it("makeNew",   function() { // 200K ops/sec on OCTOD
    this.timeoutMs = 300;
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
