/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { describe, it } from "mocha";
import * as aver from "../aver.js";
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

    //console.dir(cfg.root.get("b").get("f").get("q").get("#0").get("a1").toString());
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

});
