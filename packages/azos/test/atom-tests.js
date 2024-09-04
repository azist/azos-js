/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as describe, defineCase as it } from "../run.js";
import * as aver from "../aver.js";
import { Atom } from "../atom.js";
import { ABSTRACT } from "../coreconsts.js";

describe("Atom", function () {

  describe("Equality", function () {

    it("uses `ZERO` constant appropriately", function () {
      const a = Atom.ZERO;
      const b = Atom.encode(0n);

      aver.areEqual(a, b);
      aver.areEqualValues(a, b);
    });

    it("new Atom(0) is own reference", function () {
      const a = Atom.ZERO;
      const b = new Atom(0);

      aver.areEqualValues(a, b);
      aver.areNotEqual(a, b);
    });

    it("new id is always converted to BigInt for equality check via valueOf", function () {
      const a = new Atom(0);
      const b = new Atom(0n);

      aver.areEqualValues(a, b);
    });

    it("equates 2 atoms that are encoded with the same value", function () {
      const a = Atom.encode("12345678");
      const b = Atom.encode("12345678");

      aver.isTrue(a.equals(b));
    });

    it("does not equate 2 atoms encoded with different values", function () {
      const a = Atom.encode("12345678");
      const b = Atom.encode("11111111");

      aver.isFalse(a.equals(b));
    });
  });

  describe("Compares", function () {

    it("compareTo when sorting sorts appropriately (by 'BigInt' id)", function () {
      const unsorted = [Atom.encode("3"), Atom.encode("2"), Atom.encode("1")];
      const sorted = unsorted.slice().sort((a, b) => a.compareTo(b));

      // TODO: This test sucks. But it's quick and proves to sort properly
      aver.throws(() => aver.areArraysEquivalent(unsorted, sorted), "Averment failure: areArraysEquivalent");
    });
  });

  describe("ToString", function () {

    it("converts the BigInt `id` back to string", function () {
      const a = Atom.encode("abcDEF12");

      aver.areEqual(a.toString(), "abcDEF12");
    });

    it("empty string when constructed with `null`", function () {
      const a = Atom.encode(null);

      aver.areEqual(a.toString(), "");
    });
  });

  describe("Encode", function () {

    it("converts id to BigInt", function () {
      const toEncode = "abcdefgh";
      const expectedId = 7523094288207667809n;
      const a = Atom.encode(toEncode);

      aver.isOf(a, Atom);
      aver.areEqual(a.id, expectedId);
      aver.areEqual(a.value, toEncode);
    });
  });

  describe("TryEncode", function () {
    it("tries to encode", function () {
      throw ABSTRACT("tryEncode()");
    })
  });

  describe("TryEncodeValueOrId", function () {
    it("tries to encode value as '#1234' or id", function () {
      throw ABSTRACT("tryEncodeValueOrId()");
    })
  });

  describe("Constructor", function () {
    it("should throw when non-number or non-BigInt passed", function () {
      aver.throws(() => new Atom("12345678"), "should call encode");
    })
  });

  describe("Length", function () {
    it("Should count the number of characters encoded into the id", function () {
      let toEncode = "abcdefgh";
      const a = Atom.encode(toEncode);

      aver.areEqual(a.length, toEncode.length);

      toEncode = "abcd";
      const b = Atom.encode(toEncode);

      aver.areEqual(b.length, toEncode.length);
    });
  });
});
