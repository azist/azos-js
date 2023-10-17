/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { describe, it } from "mocha";
import * as aver from "../aver.js";
import * as sut from "../conf.js";

describe("Configuration", function() {

  describe(".ctor", function() {

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


  });//.ctor

});
