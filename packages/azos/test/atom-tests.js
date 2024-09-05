/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import * as aver from "../aver.js";
import { Atom } from "../atom.js";

unit("Atom", function () {

  unit("Equality", function () {

    cs("uses `ZERO` constant appropriately", function () {
      const a = Atom.ZERO;
      const b = Atom.encode(0n);

      aver.areEqual(a, b);
      aver.areEqualValues(a, b);
    });

    cs("new Atom(0) is own reference", function () {
      const a = Atom.ZERO;
      const b = new Atom(0);

      aver.areEqualValues(a, b);
      aver.areNotEqual(a, b);
    });

    cs("new id is always converted to BigInt for equality check via valueOf", function () {
      const a = new Atom(0);
      const b = new Atom(0n);

      aver.areEqualValues(a, b);
    });

    cs("equates 2 atoms that are encoded with the same value", function () {
      const a = Atom.encode("12345678");
      const b = Atom.encode("12345678");

      aver.isTrue(a.equals(b));
    });

    cs("does not equate 2 atoms encoded with different values", function () {
      const a = Atom.encode("12345678");
      const b = Atom.encode("11111111");

      aver.isFalse(a.equals(b));
    });
  });

  unit("Compares", function () {

    cs("compareTo when sorting sorts appropriately (by 'BigInt' id)", function () {
      const unsorted = [Atom.encode("3"), Atom.encode("2"), Atom.encode("1")];
      const sorted = unsorted.slice().sort((a, b) => a.compareTo(b));

      aver.areArraysNotEquivalent(unsorted, sorted);
    });
  });

  unit("ToString", function () {

    cs("converts the BigInt `id` back to string", function () {
      const a = Atom.encode("abcDEF12");

      aver.areEqual(a.toString(), "abcDEF12");
    });

    cs("empty string when constructed with `null`", function () {
      const a = Atom.encode(null);

      aver.areEqual(a.toString(), "");
    });
  });

  unit("Encode", function () {

    cs("converts id to BigInt", function () {
      const toEncode = "abcdefgh";
      const expectedId = 7523094288207667809n;
      const a = Atom.encode(toEncode);

      aver.isOf(a, Atom);
      aver.areEqual(a.id, expectedId);
      aver.areEqual(a.value, toEncode);
    });
  });

  unit("TryEncode", function () {
    cs("pass-when-valid-encode-value", function () {
      const toEncode = "abcdefgh";
      let encodedResponse = Atom.tryEncode(toEncode);
      aver.isTrue(encodedResponse.ok);
      aver.areEqualValues(encodedResponse.value.value, toEncode);
    });
    cs("fail-when-invalid-id", function () {
      const toEncode = "tooLongMate";
      let encodedResponse = Atom.tryEncode(toEncode);
      aver.isFalse(encodedResponse.ok);
      aver.isUndefined(encodedResponse.value);
    });
  });

  unit("TryEncodeValueOrId", function () {
    cs("pass-when-encode-value-null", function () {
      const toEncode = null;
      let encodedResponse = Atom.tryEncodeValueOrId(toEncode);
      aver.isTrue(encodedResponse.ok);
      aver.areEqual(encodedResponse.value, Atom.ZERO);
    });
    cs("pass-when-valid-encode-value", function () {
      const toEncode = "#12345678";
      let encodedResponse = Atom.tryEncodeValueOrId(toEncode);
      aver.isTrue(encodedResponse.ok);
      aver.areEqual(encodedResponse.value.id, 12345678n);
    });
    cs("fail-when-valid-encode-value", function () {
      const toEncode = "#abcdefgh";
      let encodedResponse = Atom.tryEncodeValueOrId(toEncode);
      aver.isFalse(encodedResponse.ok);
      aver.isUndefined(encodedResponse.value);
    });
    cs("fail-when-invalid-encode-value", function () {
      const toEncode = "abcdefgh";
      let encodedResponse = Atom.tryEncodeValueOrId(toEncode);
      aver.isFalse(encodedResponse.ok);
      aver.isUndefined(encodedResponse.value);
    });
  });

  unit("Constructor", function () {
    cs("should throw when non-number or non-BigInt passed", function () {
      aver.throws(() => new Atom("12345678"), "should call encode");
    })
  });

  unit("Length", function () {
    cs("Should count the number of characters encoded into the id", function () {
      let toEncode = "abcdefgh";
      const a = Atom.encode(toEncode);

      aver.areEqual(a.length, toEncode.length);

      toEncode = "abcd";
      const b = Atom.encode(toEncode);

      aver.areEqual(b.length, toEncode.length);
    });
  });
});
