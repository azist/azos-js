/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

//import { describe, it } from "mocha";
import { defineUnit as unit, defineCase as cs } from "../run.js";
import * as sut from "../aver.js";


unit("Aver", function () {

  unit("#isUndefined()", function () {

    cs("pass undefined", function () {
      let x = undefined;
      sut.isUndefined(x);
    });

    cs("fail defined", function () {
      sut.throws(function () {
        let x = 2;
        sut.isUndefined(x);
      }, "averment failure: isundefined");
    });
  });

  unit("#isDefined()", function () {

    cs("pass defined", function () {
      let x = 1;
      sut.isDefined(x);
    });

    cs("fail undefined", function () {
      sut.throws(function () {
        let x = undefined;
        sut.isDefined(x);
      }, "averment failure: isdefined");
    });
  });

  unit("#isNull()", function () {

    cs("pass null", function () {
      let x = null;
      sut.isNull(x);
    });

    cs("fail undefined", function () {
      sut.throws(function () {
        let x = undefined;
        sut.isNull(x);
      }, "averment failure: isnull");
    });

    cs("fail non null", function () {
      sut.throws(function () {
        let x = {};
        sut.isNull(x);
      }, "averment failure: isnull");
    });
  });

  unit("#isNotNull()", function () {

    cs("pass non null", function () {
      let x = {};
      sut.isNotNull(x);
    });

    cs("fail undefined", function () {
      sut.throws(function () {
        let x = undefined;
        sut.isNotNull(x);
      }, "averment failure: isnotnull");
    });

    cs("fail null", function () {
      sut.throws(function () {
        let x = null;
        sut.isNotNull(x);
      }, "averment failure: isnotnull");
    });
  });

  unit(".isNonEmptyString()", function () {

    cs("pass-non-empty", function () {
      let x = "a";
      sut.isTrue(sut.isNonEmptyString(x));
    });
    cs("fail-with-non-string", function () {
      let x = {};
      sut.isFalse(sut.isNonEmptyString(x));
    });
    cs("fail-with-space", function () {
      let x = " ";
      sut.isFalse(sut.isNonEmptyString(x));
    });
    cs("fail-with-empty-string", function () {
      let x = "";
      sut.isFalse(sut.isNonEmptyString(x));
    });
  });

  unit(".isNonEmptyMinMaxString()", function () {
    cs("", function () {

    });
  });

  unit("#isObject()", function () {

    cs("pass object", function () {
      let x = {};
      sut.isObject(x);
    });

    cs("fail null", function () {
      sut.throws(function () {
        let x = null;
        sut.isObject(x);
      }, "averment failure: isobject");
    });

    cs("fail undefined1", function () {
      sut.throws(function () {
        let x = undefined;
        sut.isObject(x);
      }, "averment failure: isobject");
    });

    cs("fail undefined2", function () {
      sut.throws(function () {
        sut.isObject();
      }, "averment failure: isobject");
    });

    cs("fail []", function () {
      sut.throws(function () {
        let x = [];
        sut.isObject(x);
      }, "averment failure: isobject");
    });
  });

  unit("#isArray()", function () {

    cs("pass array", function () {
      let x = [];
      sut.isArray(x);
    });

    cs("fail {}", function () {
      sut.throws(function () {
        let x = {};
        sut.isArray(x);
      }, "averment failure: isarray");
    });
  });

  unit("#isFunction()", function () {

    cs("pass function", function () {
      let x = function () { };
      sut.isFunction(x);
    });

    cs("fail {}", function () {
      sut.throws(function () {
        let x = {};
        sut.isFunction(x);
      }, "averment failure: isfunction");
    });
  });

  unit("#isFalse()", function () {

    cs("pass false", function () {
      let x = false;
      sut.isFalse(x);
    });

    cs("fail true", function () {
      sut.throws(function () {
        let x = true;
        sut.isFalse(x);
      }, "averment failure: isfalse");
    });

    cs("fail undefined", function () {
      sut.throws(function () {
        let x = undefined;
        sut.isFalse(x);
      }, "averment failure: isfalse");
    });

    cs("fail null", function () {
      sut.throws(function () {
        let x = null;
        sut.isFalse(x);
      }, "averment failure: isfalse");
    });
  });


  unit("#isTrue()", function () {

    cs("pass true", function () {
      let x = true;
      sut.isTrue(x);
    });

    cs("fail false", function () {
      sut.throws(function () {
        let x = false;
        sut.isTrue(x);
      }, "averment failure: istrue");
    });

    cs("fail undefined", function () {
      sut.throws(function () {
        let x = undefined;
        sut.isTrue(x);
      }, "averment failure: istrue");
    });

    cs("fail null", function () {
      sut.throws(function () {
        let x = null;
        sut.isTrue(x);
      }, "averment failure: istrue");
    });
  });


  unit("#isString()", function () {

    cs("pass string", function () {
      sut.isString("aaaaa");
    });

    cs("fail 1", function () {
      sut.throws(function () {
        sut.isString(1);
      }, "averment failure: isstring");
    });

    cs("fail undefined", function () {
      sut.throws(function () {
        sut.isString(undefined);
      }, "averment failure: isstring");
    });

    cs("fail null", function () {
      sut.throws(function () {
        sut.isString(null);
      }, "averment failure: isstring");
    });
  });

  unit("#isBool()", function () {

    cs("pass bool", function () {
      sut.isBool(true);
      sut.isBool(false);
      sut.isBool(1 === 1);
    });

    cs("fail 1", function () {
      sut.throws(function () {
        sut.isBool(1);
      }, "averment failure: isbool");
    });

    cs("fail undefined", function () {
      sut.throws(function () {
        sut.isBool(undefined);
      }, "averment failure: isbool");
    });

    cs("fail null", function () {
      sut.throws(function () {
        sut.isBool(null);
      }, "averment failure: isbool");
    });
  });

  unit("#isNumber()", function () {

    cs("pass nums", function () {
      sut.isNumber(1);
      sut.isNumber(-1123.23);
      sut.isNumber(0);
    });

    cs("fail str", function () {
      sut.throws(function () {
        sut.isNumber("123");
      }, "averment failure: isnumber");
    });

    cs("fail undefined", function () {
      sut.throws(function () {
        sut.isNumber(undefined);
      }, "averment failure: isnumber");
    });

    cs("fail null", function () {
      sut.throws(function () {
        sut.isNumber(null);
      }, "averment failure: isnumber");
    });
  });

  unit("#isDate()", function () {

    cs("pass date", function () {
      sut.isDate(new Date(1980, 1, 1));
    });

    cs("fail str", function () {
      sut.throws(function () {
        sut.isDate("1/1/2001");
      }, "averment failure: isdate");
    });

    cs("fail undefined", function () {
      sut.throws(function () {
        sut.isDate(undefined);
      }, "averment failure: isdate");
    });

    cs("fail null", function () {
      sut.throws(function () {
        sut.isDate(null);
      }, "averment failure: isdate");
    });
  });


  unit("#areEqual()", function () {
    cs("TRUE", function () {
      sut.areEqual(1, 1);

      sut.areEqual("abc", "abc");//may have used areEqualValues() as strings get special treatment

      sut.areEqual(null, null);
      sut.areEqual(undefined, undefined);
    });

    cs("FALSE", function () {
      sut.throws(function () { sut.areEqual(1, "1"); });
      sut.throws(function () { sut.areEqual(0, null); });
      sut.throws(function () { sut.areEqual(undefined, null); });
    });
  });

  unit("#areNotEqual()", function () {
    cs("TRUE", function () {
      sut.areNotEqual(1, "1");
      sut.areNotEqual(0, null);
      sut.areNotEqual(undefined, null);

      //note: Date is ref type, hence two instances are different.
      //Use areEqualValues() for object equality check based on valueOf()
      sut.areNotEqual(new Date(123), new Date(123));
    });

    cs("FALSE", function () {
      sut.throws(function () { sut.areNotEqual(1, 1); });
      sut.throws(function () { sut.areNotEqual(null, null); });
      sut.throws(function () { sut.areNotEqual(undefined, undefined); });
    });
  });


  unit("#areEqualValues()", function () {
    cs("TRUE", function () {
      sut.areEqualValues(1, 1);

      sut.areEqualValues("abc", "abc");//may have used areEqual() as strings get special treatment

      sut.areEqualValues(null, null);
      sut.areEqualValues(undefined, undefined);

      sut.areEqualValues(new Date(123), new Date(123));
    });

    cs("FALSE", function () {
      sut.throws(function () { sut.areEqual(1, "1"); });
      sut.throws(function () { sut.areEqual(0, null); });
      sut.throws(function () { sut.areEqual(undefined, null); });

      sut.throws(function () { sut.areEqualValues(new Date(124), new Date(1)); });
      sut.throws(function () { sut.areEqualValues(1, true); });
      sut.throws(function () { sut.areEqualValues(1, "1"); });
    });
  });


  unit("#isSubclassOf()", function () {
    cs("TRUE", function () {
      sut.isSubclassOf(sut.MockA, sut.MockBase);
      sut.isSubclassOf(sut.MockBC, sut.MockBase);
    });

    cs("FALSE", function () {
      sut.throws(function () { sut.isSubclassOf(null, null); }, "isSubclassOf");
      sut.throws(function () { sut.isSubclassOf(undefined, undefined); }, "isSubclassOf");
      sut.throws(function () { sut.isSubclassOf(true, null); }, "isSubclassOf");
      sut.throws(function () { sut.isSubclassOf(sut.MockBase, sut.MockBase); }, "isSubclassOf");
      sut.throws(function () { sut.isSubclassOf(Object, sut.MockBase); }, "isSubclassOf");
    });
  });

  unit("#isNotSubclassOf()", function () {
    cs("TRUE", function () {
      sut.isNotSubclassOf(sut.MockA, sut.MockB);
      sut.isNotSubclassOf(Object, sut.MockBase);
    });

    cs("FALSE", function () {
      sut.throws(function () { sut.isNotSubclassOf(null, null); }, "isNotSubclassOf");
      sut.throws(function () { sut.isNotSubclassOf(undefined, undefined); }, "isNotSubclassOf");
      sut.throws(function () { sut.isNotSubclassOf(true, null); }, "isNotSubclassOf");
      sut.throws(function () { sut.isNotSubclassOf(sut.MockA, sut.MockBase); }, "isNotSubclassOf");
      sut.throws(function () { sut.isNotSubclassOf(sut.MockBase, Object); }, "isNotSubclassOf");
    });
  });



  unit("#isOf()", function () {
    cs("TRUE", function () {
      let obj = new sut.MockA(1, 2);
      sut.isOf(obj, sut.MockBase);
      sut.isOf(obj, sut.MockA);
    });

    cs("FALSE", function () {
      let obj = new sut.MockA(1, 2);
      sut.throws(function () { sut.isOf(obj, Array); }, "isOf");
      sut.throws(function () { sut.isOf(null, null); }, "isOf");
      sut.throws(function () { sut.isOf(undefined, undefined); }, "isOf");
    });
  });



  unit("#isNotOf()", function () {
    cs("TRUE", function () {
      let obj = new sut.MockB(1, 2);
      sut.isNotOf(obj, Array);
      sut.isNotOf(obj, sut.MockA);
    });

    cs("FALSE", function () {
      let obj = new sut.MockA(1, 2);
      sut.throws(function () { sut.isNotOf(obj, sut.MockBase); }, "isNotOf");
      sut.throws(function () { sut.isNotOf(obj, sut.MockA); }, "isNotOf");
      sut.throws(function () { sut.isNotOf(null, null); }, "isNotOf");
      sut.throws(function () { sut.isNotOf(undefined, undefined); }, "isNotOf");
    });
  });

  unit("#isOfEither()", function () {
    cs("TRUE", function () {
      let obj = new sut.MockA(1, 2);
      sut.isOfEither(obj, sut.MockBase);
      sut.isOfEither(obj, sut.MockB, sut.MockBase);
      sut.isOfEither(obj, sut.MockBase, Object);
      sut.isOfEither(obj, Object, sut.MockBase);
      sut.isOfEither(obj, Date, Object, sut.MockA);
    });

    cs("FALSE", function () {
      let obj = new sut.MockA(1, 2);
      sut.throws(function () { sut.isOfEither(obj, Array); }, "isOfEither");
      sut.throws(function () { sut.isOfEither(obj, Date, Array, sut.MockB); }, "isOfEither");
      sut.throws(function () { sut.isOfEither(null, null); }, "isOfEither");
      sut.throws(function () { sut.isOfEither(undefined, undefined); }, "isOfEither");
    });
  });

  unit("#classes", function () {

    cs("inherits", function () {
      let obj = new sut.MockA(3, 9);
      sut.isOf(obj, sut.MockBase);
      sut.isOf(obj, sut.MockA);

      sut.areEqual(3, obj.a);
      sut.areEqual(9, obj.b);
      obj.b = -8;
      sut.areEqual(-8, obj.b);
    });

    cs("virtual override function", function () {
      let a = new sut.MockA(3, 9);

      let dscr = a.unit();
      sut.areEqual("MockA(a: 3, b: 9)", dscr);
    });

    cs("virtual base function", function () {
      let a = new sut.MockB(3, 9);

      let dscr = a.unit();
      sut.areEqual("base(a: 3, b: 9)", dscr);
    });

  });


  unit("#areArraysEquivalent()", function () {

    cs("()", function () { sut.throws(() => sut.areArraysEquivalent(), "areArraysEquivalent"); });
    cs("(undefined)", function () { sut.throws(() => sut.areArraysEquivalent(undefined), "areArraysEquivalent"); });
    cs("(null, null)", function () { sut.throws(() => sut.areArraysEquivalent(null, null), "areArraysEquivalent"); });

    cs("1", function () { sut.areArraysEquivalent([], []); });
    cs("2", function () { sut.areArraysEquivalent([1], [1]); });
    cs("3", function () { sut.areArraysEquivalent([true, 1], [true, 1]); });
    cs("4", function () { sut.areArraysEquivalent(["aaa", 2], ["aaa", 2]); });

    cs("10", function () { sut.throws(() => sut.areArraysEquivalent(null, []), "areArraysEquivalent"); });
    cs("20", function () { sut.throws(() => sut.areArraysEquivalent([1], [2]), "areArraysEquivalent"); });
    cs("30", function () { sut.throws(() => sut.areArraysEquivalent([1, 2], [2, 1]), "areArraysEquivalent"); });
    cs("40", function () { sut.throws(() => sut.areArraysEquivalent([1], [1, 2]), "areArraysEquivalent"); });
  });


  unit("#areIterablesEquivalent()", function () {

    cs("()", function () { sut.throws(() => sut.areIterablesEquivalent(), "areIterablesEquivalent"); });
    cs("(undefined)", function () { sut.throws(() => sut.areIterablesEquivalent(undefined), "areIterablesEquivalent"); });
    cs("(null, null)", function () { sut.throws(() => sut.areIterablesEquivalent(null, null), "areIterablesEquivalent"); });

    cs("1", function () { sut.areIterablesEquivalent([], []); });
    cs("2", function () { sut.areIterablesEquivalent([1], [1]); });
    cs("3", function () { sut.areIterablesEquivalent([true, 1], [true, 1]); });
    cs("4", function () { sut.areIterablesEquivalent(["aaa", 2], ["aaa", 2]); });

    cs("10", function () { sut.throws(() => sut.areIterablesEquivalent(null, []), "areIterablesEquivalent"); });
    cs("20", function () { sut.throws(() => sut.areIterablesEquivalent([1], [2]), "areIterablesEquivalent"); });
    cs("30", function () { sut.throws(() => sut.areIterablesEquivalent([1, 2], [2, 1]), "areIterablesEquivalent"); });
    cs("40", function () { sut.throws(() => sut.areIterablesEquivalent([1], [1, 2]), "areIterablesEquivalent"); });
  });


});

