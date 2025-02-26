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

    cs("zero-toString-value", function () {
      let atom = new Atom(0);
      aver.isNull(atom.toString());
      aver.isNull(atom.value);
    });

    cs("test-toString", function () {
      let atom = new Atom(0x3041304130413041n);
      aver.areEqual(atom.toString(), "A0A0A0A0");
    });

    cs("encode-toString", function () {
      let atom = Atom.encode("ALEX");
      aver.areEqual("ALEX", atom.toString());
    });

    cs("pass-when-converts-id-back-to-string", function () {
      const a = Atom.encode("abcDEF12");

      aver.areEqual(a.toString(), "abcDEF12");
    });

    cs("pass-when-constructed-null-converts-to-empty-string", function () {
      const a = Atom.encode(null);

      aver.isNull(a.toString());
    });
  });

  unit(".encode()", function () {

    cs("encode-decode", function () {
      let a = Atom.encode("ALEX1234");
      let b = new Atom(a.id);
      aver.areEqualValues(a, b);
      aver.areEqual("ALEX1234", b.value);
    });

    cs("encode-null", function () {
      let a = Atom.encode(null);
      aver.areEqualValues(a.id, 0n);
      aver.isTrue(a.isZero);
      aver.isNull(a.toString());
    });

    cs("error-empty", function () { aver.throws(() => Atom.encode("")); });

    cs("error-toLong", function () { aver.throws(() => Atom.encode("123456789")); });

    cs("error-nonAscii", function () { aver.throws(() => Atom.encode("ag²■")); });

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

    cs("try-encode", function () {
      let a = Atom.tryEncode("abc");
      aver.isTrue(a.ok);
      aver.areEqual(a.value.value, "abc")

      a = Atom.tryEncode("ab * c");
      aver.isFalse(a.ok);
      aver.isUndefined(a.value);
    });

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

    cs("try-encode-value-or-id", function () {
      let a = Atom.tryEncodeValueOrId("abc");
      aver.isTrue(a.ok);
      aver.areEqual(a.value.value, "abc");

      a = Atom.tryEncodeValueOrId("ab * c");
      aver.isFalse(a.ok);

      a = Atom.tryEncodeValueOrId("#0x3031");
      aver.isTrue(a.ok);
      aver.areEqual(a.value.value, "10");

      a = Atom.tryEncodeValueOrId("#12337");
      aver.isTrue(a.ok);
      aver.areEqual(a.value.value, "10");
    });

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
      aver.isTrue(encodedResponse.ok);
      aver.areEqual(encodedResponse.value.value, toEncode);
    });
  });

  unit("constructor()", function () {

    cs("zero", function () {
      let atom = new Atom(0);
      aver.isTrue(atom.isZero);
      aver.areEqual(atom.id, 0n);
    });

    cs("zero-equality", function () {
      const a = new Atom(0);
      const b = new Atom(0n);
      aver.areEqualValues(a, b);
    });

    cs("zero-inequality", function () {
      const a = new Atom(0);
      const b = new Atom(1);

      aver.areNotEqualValues(a, b);
    }, () => true /** new Atom(1) fails because 1 is not a valid id */);

    cs("pass-throws-when-constructed-with-string", function () {
      aver.throws(() => new Atom("12345678"), "should call encode");
    })
  });

  unit(".length", function () {
    cs("var-length", function () {
      let a = Atom.encode("a");
      let b = Atom.encode("ab");

      aver.areEqual(0x61n, a.id);
      aver.areEqual(0x6261n, b.id);
    });

    cs("test-length", function () {
      aver.areEqual(0, new Atom().length);
      aver.areEqual(0, new Atom(0).length);

      let a = Atom.encode("a");
      aver.areEqual(1, a.length);

      a = Atom.encode("abc");
      aver.areEqual(3, a.length);

      a = Atom.encode("abcdef");
      aver.areEqual(6, a.length);

      a = Atom.encode("abc-def");
      aver.areEqual(7, a.length);

      a = Atom.encode("abc-def0");
      aver.areEqual(8, a.length);

      a = new Atom(0xFFFFFFFFFFFFFFFFn);
      aver.areEqual(8, a.length);
      aver.isFalse(a.isValid);

      a = new Atom(0xFFn);
      aver.areEqual(1, a.length);
      aver.isFalse(a.isValid);

      a = new Atom(0xFF0101n);
      aver.areEqual(3, a.length);
      aver.isFalse(a.isValid);
    });

    cs("pass-when-length-matches-encoded-character-count", function () {
      let toEncode = "abcdefgh";
      const a = Atom.encode(toEncode);

      aver.areEqual(a.length, toEncode.length);

      toEncode = "abcd";
      const b = Atom.encode(toEncode);

      aver.areEqual(b.length, toEncode.length);
    });
  });

  unit(".value", function () {
    cs("value-interning", function () {
      let a = Atom.encode("abc");
      let b = Atom.encode("abc");
      let c = new Atom(b.id);

      aver.areEqualValues(a, b);
      aver.areEqualValues(a, c);

      aver.areEqual("abc", a.value);
      aver.areEqual("abc", b.value);
      aver.areEqual("abc", c.value);

      aver.areEqual(a.value, b.value);
      aver.areEqual(a.value, c.value);
    });
  });

  unit(".timeUnder", function () {
    // Adjust these values to whatever is appropriate for your environment
    const ATOM_ENCODE_TIME_MS = .2;
    const ATOM_VALIDITY_TIME_MS = .05;

    // For ATOM.isValid tests
    const VALID_ATOM = Atom.encode("123");
    const VALID_ATOMS = Array.from({ length: 10000 }, (_, i) => Atom.encode(i.toString()));

    cs(`should make 1 atom under ${ATOM_ENCODE_TIME_MS}ms`, function () {
      aver.timeUnder(ATOM_ENCODE_TIME_MS, () => {
        Atom.tryEncode(`test-suite`)
      });
    });

    cs(`should make 100 simple atoms ${ATOM_ENCODE_TIME_MS * 10}ms`, function () {
      aver.timeUnder(ATOM_ENCODE_TIME_MS * 10, () => {
        let atoms = [];
        for (let i = 0; i < 100; i++) {
          atoms.push(Atom.tryEncode(`${i}`));
        }
      });
    });

    cs(`should make 1000 simple atoms ${ATOM_ENCODE_TIME_MS * 100}ms`, function () {
      aver.timeUnder(ATOM_ENCODE_TIME_MS * 100, () => {
        let atoms = [];
        for (let i = 0; i < 1000; i++) {
          atoms.push(Atom.tryEncode(`${i}`));
        }
      });
    });

    cs(`should make 10000 simple atoms ${ATOM_ENCODE_TIME_MS * 5000}ms`, function () {
      aver.timeUnder(ATOM_ENCODE_TIME_MS * 5000, () => {
        let atoms = [];
        for (let i = 0; i < 10000; i++) {
          atoms.push(Atom.tryEncode(`${i}`));
        }
      });
    });

    cs(`should determine if atom valid`, function () {
      aver.timeUnder(ATOM_VALIDITY_TIME_MS, () => {
        aver.isTrue(VALID_ATOM.isValid)
      });
    }
    );

    cs(`should determine if ${VALID_ATOMS.length} atoms are valid within ${ATOM_VALIDITY_TIME_MS * 80}ms`, function () {
      aver.timeUnder(ATOM_VALIDITY_TIME_MS * 80, () => {
      VALID_ATOMS.forEach(a => aver.isTrue(a.isValid));
      });
    });

  });
});
