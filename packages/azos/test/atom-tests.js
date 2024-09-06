/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import * as aver from "../aver.js";
import { Atom } from "../atom.js";

unit("Atom", function () {

  unit(".isValid()", function () {

    cs("test-validation001", function () {
      let a = Atom.encode("abc");
      aver.isTrue(a.isValid);
    });

    cs("test-validation002", function () {
      let a = new Atom(0xfffffff);
      aver.isFalse(a.isValid);
    });


    cs("test-validation003", function () {
      const a = new Atom(0xfffff);
      // eslint-disable-next-line no-unused-vars
      const b = Atom.encode("a");
      // eslint-disable-next-line no-unused-vars
      const c = Atom.encode("ab");
      // eslint-disable-next-line no-unused-vars
      const d = Atom.encode("abcd")
      aver.isFalse(a.isValid);
    }, () => true /** No batch process nor field validation introduced */);

    cs("is-valid", function () {
      let a = new Atom(0);
      let b = new Atom(0xffffn);
      aver.isTrue(a.isZero);
      aver.isTrue(a.isValid);
      aver.isFalse(b.isValid);
      aver.throws(() => b.value.toLower());
    });
  });

  unit(".equals()", function () {

    cs("pass-when-encoding-0n-against-ZERO", function () {
      const a = Atom.ZERO;
      const b = Atom.encode(0n);

      aver.areEqual(a, b);
      aver.areEqualValues(a, b);
    });

    cs("pass-when-new-Atom(0)-is-own-reference", function () {
      const a = Atom.ZERO;
      const b = new Atom(0);

      aver.areEqualValues(a, b);
      aver.areNotEqual(a, b);
    });

    cs("pass-when-new-id-always-converted-to-BigInt", function () {
      const a = new Atom(0);
      const b = new Atom(0n);

      aver.areEqualValues(a, b);
    });

    cs("pass-when-2-atoms-encoded-with-same-value", function () {
      const a = Atom.encode("12345678");
      const b = Atom.encode("12345678");

      aver.isTrue(a.equals(b));
    });

    cs("pass-when-2-atoms-encoded-with-different-values", function () {
      const a = Atom.encode("12345678");
      const b = Atom.encode("11111111");

      aver.isFalse(a.equals(b));
    });
  });

  unit(".compareTo()", function () {

    cs("pass-when-sort-by-id", function () {
      const one = Atom.encode("1");
      const two = Atom.encode("2");
      const three = Atom.encode("3");
      const unsorted = [three, two, one];
      const sorted = unsorted.slice().sort((a, b) => a.compareTo(b));

      aver.areArraysNotEquivalent(unsorted, sorted);
      aver.areEqual(sorted.indexOf(one), 0);
      aver.areEqual(sorted.indexOf(two), 1);
      aver.areEqual(sorted.indexOf(three), 2);
    });
  });

  unit(".toString()", function () {

    cs("pass-when-converts-id-back-to-string", function () {
      const a = Atom.encode("abcDEF12");

      aver.areEqual(a.toString(), "abcDEF12");
    });

    cs("pass-when-constructed-null-converts-to-empty-string", function () {
      const a = Atom.encode(null);

      aver.areEqual(a.toString(), "");
    });
  });

  unit(".encode()", function () {

    cs("pass-when-encoded-string-matches-expected-id", function () {
      const toEncode = "abcdefgh";
      const expectedId = 7523094288207667809n;
      const a = Atom.encode(toEncode);

      aver.isOf(a, Atom);
      aver.areEqual(a.id, expectedId);
      aver.areEqual(a.value, toEncode);
    });
  });

  unit(".tryEncode()", function () {

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

  unit(".tryEncodeValueOrId()", function () {

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

  unit("constructor()", function () {

    cs("zero", function () {
      let atom = new Atom(0);
      aver.isTrue(atom.isZero);
      aver.areEqual(atom.id, 0n);
    });

    cs("zero-toString-value", function () {
      let atom = new Atom(0);
      aver.isNull(atom.toString());
      aver.isNull(atom.value);
    });

    cs("pass-throws-when-constructed-with-string", function () {
      aver.throws(() => new Atom("12345678"), "should call encode");
    })
  });

  unit(".length", function () {

    cs("pass-when-length-matches-encoded-character-count", function () {
      let toEncode = "abcdefgh";
      const a = Atom.encode(toEncode);

      aver.areEqual(a.length, toEncode.length);

      toEncode = "abcd";
      const b = Atom.encode(toEncode);

      aver.areEqual(b.length, toEncode.length);
    });
  });
});
