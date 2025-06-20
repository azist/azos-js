/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import * as sut from "../strings.js";
import * as aver from "../aver.js";

unit("Strings", function () {

  unit(".isEmpty()", function () {
    cs("true ()", function () { aver.isTrue(sut.isEmpty()); });
    cs("true (undefined)", function () { aver.isTrue(sut.isEmpty(undefined)); });
    cs("true (null)", function () { aver.isTrue(sut.isEmpty(null)); });

    cs("true (\"\")", function () { aver.isTrue(sut.isEmpty("")); });
    cs("true (\"  \")", function () { aver.isTrue(sut.isEmpty("   ")); });
    cs("true (\" \\n  \\r  \")", function () { aver.isTrue(sut.isEmpty(" \n  \r  ")); });
    cs("true ([])", function () { aver.isTrue(sut.isEmpty([])); });
    cs("true ([\"\"])", function () { aver.isTrue(sut.isEmpty([""])); });


    cs("false (true)", function () { aver.isFalse(sut.isEmpty(true)); });
    cs("false (false)", function () { aver.isFalse(sut.isEmpty(false)); });
    cs("false ({})", function () { aver.isFalse(sut.isEmpty({})); });
    cs("false ([\"\",2,3])", function () { aver.isFalse(sut.isEmpty(["", 2, 3])); });
    cs("false (\"some text\"])", function () { aver.isFalse(sut.isEmpty("some text")); });
    cs("false (\"----------\"])", function () { aver.isFalse(sut.isEmpty("----------")); });
    cs("false (\"---\\r\\n-------\"])", function () { aver.isFalse(sut.isEmpty("---\r\n-----")); });
  });

  unit(".isNullOrWhiteSpace(str)", function () {
    cs("true ()", () => aver.isTrue(sut.isNullOrWhiteSpace()));
    cs("true (undefined)", () => aver.isTrue(sut.isNullOrWhiteSpace(undefined)));
    cs("true (null)", () => aver.isTrue(sut.isNullOrWhiteSpace(null)));
    cs("true ('')", () => aver.isTrue(sut.isNullOrWhiteSpace("")));
    cs("true (' ')", () => aver.isTrue(sut.isNullOrWhiteSpace(" ")));
  });

  unit(".charEqual()", function () {
    cs("true ('a','a', false)", () => aver.isTrue(sut.charEqual("a", "a", false)));
    cs("true ('a','a', true)", () => aver.isTrue(sut.charEqual("a", "a", true)));
    cs("true ('a','A', false)", () => aver.isTrue(sut.charEqual("a", "A", false)));
    cs("false ('a','A', true)", () => aver.isFalse(sut.charEqual("a", "A", true)));
  });

  unit(".matchPattern()", function () {
    cs("match-pattern1", function () {
      const pattern = "s?me?addres?";
      aver.isTrue(sut.matchPattern("some address", pattern));
      aver.isTrue(sut.matchPattern("same-addresZ", pattern));

      aver.isFalse(sut.matchPattern("sone address", pattern));
      aver.isFalse(sut.matchPattern("sane-oddresZ", pattern));
    });

    cs("match-pattern2", function () {
      const pattern = "s?me?addres?";
      aver.isTrue(sut.matchPattern("some address", pattern, undefined, undefined, true));

      aver.isFalse(sut.matchPattern("same-addreZs", pattern, undefined, undefined, true));
      aver.isFalse(sut.matchPattern("sone address", pattern, undefined, undefined, true));
      aver.isFalse(sut.matchPattern("saMe-addrezs", pattern, undefined, undefined, true));
    });

    cs("match-pattern3", function () {
      const pattern = "some*";
      aver.isTrue(sut.matchPattern("some address", pattern));
      aver.isFalse(sut.matchPattern("sone address ", pattern));
    });

    cs("match-pattern4", function () {
      const pattern = "s?me*";
      aver.isTrue(sut.matchPattern("some address", pattern));
      aver.isFalse(sut.matchPattern("sone adzress", pattern));
    });

    cs("match-pattern5", function () {
      const pattern = "s?me*addre??";
      aver.isTrue(sut.matchPattern("some address", pattern));
      aver.isFalse(sut.matchPattern("some adzress", pattern));
    });

    cs("match-pattern6", () => aver.isTrue(sut.matchPattern("same Address", "s?me*addre??")));

    cs("match-pattern7", function () {
      const pattern = "s?me*addre??";
      aver.isTrue(sut.matchPattern("same Addre??", pattern));
      aver.isFalse(sut.matchPattern("same AddreZZ?", pattern));
      aver.isFalse(sut.matchPattern("same AddreZ", pattern));
    });

    cs("match-pattern8", function () {
      const pattern = "*";
      aver.isTrue(sut.matchPattern("same AddreZZ", pattern));
      aver.isTrue(sut.matchPattern("    ", pattern));
      aver.isTrue(sut.matchPattern(" ", pattern));
      aver.isTrue(sut.matchPattern("", pattern));
      aver.isTrue(sut.matchPattern(null, pattern));
    });

    cs("match-pattern9", () => aver.isFalse(sut.matchPattern("same AddreZZ", "")));

    cs("match-pattern10", () => aver.isFalse(sut.matchPattern("same AddreZZ", "?")));

    cs("match-pattern11", function () {
      const pattern = "????????????";
      aver.isTrue(sut.matchPattern("same AddreZZ", pattern));
      aver.isFalse(sut.matchPattern("same Addre", pattern));
    });

    cs("match-pattern12", function () {
      const pattern = "same*";
      aver.isTrue(sut.matchPattern("same AddreZZ", pattern));
      aver.isFalse(sut.matchPattern("some AddreZZ", pattern));
    });

    cs("match-pattern13", function () {
      const pattern1 = "*addre??";
      const pattern2 = "*addre????";
      aver.isTrue(sut.matchPattern("same AddreZZ", pattern1));
      aver.isTrue(sut.matchPattern("good address", pattern1));
      aver.isTrue(sut.matchPattern("new address-2", pattern2));

      aver.isFalse(sut.matchPattern("same ApdreZZ", pattern1));
      aver.isFalse(sut.matchPattern("good adress", pattern1));
      aver.isFalse(sut.matchPattern("good adres", pattern1));
      aver.isFalse(sut.matchPattern("new accress-2", pattern2));
    });

    cs("match-pattern14", function () {
      const pattern = "*address";
      aver.isTrue(sut.matchPattern("same Address", pattern));
      aver.isFalse(sut.matchPattern("same Address ok", pattern));
    });

    cs("match-pattern15", function () {
      const pattern = "*address";
      aver.isTrue(sut.matchPattern("some same crazy address address Address", pattern));
      aver.isFalse(sut.matchPattern("some same crazy address address Address", pattern, undefined, undefined, true));
      aver.isFalse(sut.matchPattern("some same crazy address address!", pattern));
    });

    cs("match-pattern16", function () {
      const pattern = "*crazy*";
      aver.isTrue(sut.matchPattern("some crazy address", pattern));
      aver.isFalse(sut.matchPattern("some crizy address", pattern));
      aver.isFalse(sut.matchPattern("some craizy address", pattern));
    });

    cs("match-pattern16_2", function () {
      const pattern = "*cr?zy*";
      aver.isTrue(sut.matchPattern("some crazy address", pattern));
      aver.isTrue(sut.matchPattern("some crizy address", pattern));
      aver.isFalse(sut.matchPattern("some criizy address", pattern));
      aver.isFalse(sut.matchPattern("some krazy address", pattern));
    });

    cs("match-pattern16_3", () => aver.isFalse(sut.matchPattern("some crazy address", "*cr*zy")));

    cs("match-pattern17", () => aver.isTrue(sut.matchPattern("127.0.0.1", "127.0.*")));

    cs("match-pattern18", () => aver.isTrue(sut.matchPattern("https://some-site.com/?q=aaaa", "https://some-site.com*")));

    cs("match-pattern19", () => aver.isTrue(sut.matchPattern("140.70.81.139", "140.70.81.139")));

    cs("match-pattern20", function () {
      const pattern = "140.70.*.139";
      aver.isTrue(sut.matchPattern("140.70.81.139", pattern));
      aver.isTrue(sut.matchPattern("140.70.1.139", pattern));
      aver.isTrue(sut.matchPattern("140.70.17.139", pattern));
      aver.isTrue(sut.matchPattern("140.70.123.139", pattern));

      aver.isFalse(sut.matchPattern("141.70.81.139", pattern));
      aver.isFalse(sut.matchPattern("140.71.1.139", pattern));
      aver.isFalse(sut.matchPattern("140.70.17.13", pattern));
      aver.isFalse(sut.matchPattern("140.70.123.137", pattern));
    });

    cs("match-pattern21", function () {
      const pattern = "*.70.81.139";
      aver.isTrue(sut.matchPattern("140.70.81.139", pattern));
      aver.isFalse(sut.matchPattern("140.70.99.139", pattern));
    });

    cs("match-pattern22", function () {
      const pattern = "140.70.81.*";
      aver.isTrue(sut.matchPattern("140.70.81.139", pattern));
      aver.isFalse(sut.matchPattern("140.70.99.139", pattern));
    });

    cs("match-pattern23", function () {
      const pattern1 = "140.*.81.*";
      const pattern2 = "*.70.81.*";

      aver.isTrue(sut.matchPattern("140.70.81.139", pattern1));
      aver.isTrue(sut.matchPattern("140.80.81.139", pattern1));
      aver.isTrue(sut.matchPattern("140.    80       .81.139", pattern1));
      aver.isTrue(sut.matchPattern("140. 80 .81.99999", pattern1));

      aver.isTrue(sut.matchPattern("1.70.81.1", pattern2));
      aver.isFalse(sut.matchPattern("1.70.82.1", pattern2));
    });

    cs("match-pattern24", function () {
      const str = "Alex Boris";
      aver.isTrue(sut.matchPattern(str, "*"));
      aver.isTrue(sut.matchPattern(str, "Alex*"));
      aver.isTrue(sut.matchPattern(str, "*Boris"));
      aver.isTrue(sut.matchPattern(str, "*lex Bo*"));
    });

    cs("match-pattern25", function () {
      const str = "Alex Boris";
      aver.isTrue(sut.matchPattern(str, "*"));
      aver.isFalse(sut.matchPattern(str, "Axex*"));
      aver.isFalse(sut.matchPattern(str, "*Bosir"));
      aver.isFalse(sut.matchPattern(str, "*lxe Bo*"));
    });

    cs("match-pattern26", function () {
      const str = "Alex Boris";
      aver.isTrue(sut.matchPattern(str, "*"));
      aver.isFalse(sut.matchPattern(str, "alex*", undefined, undefined, true));
      aver.isTrue(sut.matchPattern("Alex Boris", "Alex*", undefined, undefined, true));

      aver.isFalse(sut.matchPattern(str, "*boris", undefined, undefined, true));
      aver.isTrue(sut.matchPattern(str, "*Boris", undefined, undefined, true));
    });

    cs("match-pattern27", function () {
      const str = "Honda buick honda monda donda ford buick ford ford";
      aver.isTrue(sut.matchPattern(str, "*ford"));
      aver.isFalse(sut.matchPattern(str, "*honda"));
      aver.isTrue(sut.matchPattern(str, "*honda*"));
    });

    cs("match-pattern28", function () {
      const str = "Honda buick honda monda donda ford buick ford fORd";
      aver.isTrue(sut.matchPattern(str, "*ford"));
      aver.isFalse(sut.matchPattern(str, "*ford", undefined, undefined, true));
      aver.isTrue(sut.matchPattern(str, "*fORd", undefined, undefined, true));
    });

    cs("match-pattern29", function () {
      const str = "Honda buick honda monda donda ford buick ford fORd";
      aver.isTrue(sut.matchPattern(str, "*buick*"));
      aver.isFalse(sut.matchPattern(str, "*buick handa*", undefined, undefined, true));
      aver.isTrue(sut.matchPattern(str, "*buick h?nda*", undefined, undefined, true));
    });

    cs("match-pattern30", function () {
      const str = "kikimora zhaba fly snake toad";
      aver.isTrue(sut.matchPattern(str, "*?ly*"));
      aver.isFalse(sut.matchPattern(str, "*?ly"));
      aver.isTrue(sut.matchPattern(str, "*?ly*toad"));
    });

    cs("match-pattern31", function () {
      const str = "We shall overcome";
      aver.isTrue(sut.matchPattern(str, "*****************"));
      aver.isTrue(sut.matchPattern(str, "?????????????????"));
      aver.isTrue(sut.matchPattern(str, "?*????????**?????"));
      aver.isTrue(sut.matchPattern(str, "*?????????**????*"));

      aver.isFalse(sut.matchPattern(str, "***x*************"));
      aver.isFalse(sut.matchPattern(str, "?A???????????????"));
      aver.isFalse(sut.matchPattern(str, "?*????-???**?????"));
      aver.isFalse(sut.matchPattern(str, "*?????????**???? "));
    });

    cs("match-pattern32", function () {
      const str = "We shall overcome";
      aver.isTrue(sut.matchPattern(str, "*********overcome"));
      aver.isTrue(sut.matchPattern(str, "??????????v???o??"));
      aver.isTrue(sut.matchPattern(str, "?e????????**??o??"));
      aver.isTrue(sut.matchPattern(str, "We*???????**????*"));

      aver.isFalse(sut.matchPattern(str, "*********ofercome"));
      aver.isFalse(sut.matchPattern(str, "??????????A???o??"));
      aver.isFalse(sut.matchPattern(str, "?e--??????**??o??"));
      aver.isFalse(sut.matchPattern(str, "They*?????**????*"));
    });

    cs("match-pattern33", function () {
      const str = "We shall overcome";
      aver.isTrue(sut.matchPattern(str, "*********overCOME", undefined, undefined, false));
      aver.isFalse(sut.matchPattern(str, "*********overCOME", undefined, undefined, true));

      aver.isTrue(sut.matchPattern(str, "@@@@@@@@@overcome", '@'));
      aver.isTrue(sut.matchPattern(str, "@erco$$", '@', '$'));
    });

    cs("match-pattern34", function () {
      aver.isTrue(sut.matchPattern(null, null));
      aver.isTrue(sut.matchPattern("", ""));

      aver.isTrue(sut.matchPattern(null, ""));
      aver.isTrue(sut.matchPattern("", null));

      aver.isFalse(sut.matchPattern(" a ", null));
      aver.isFalse(sut.matchPattern(null, " a "));
    });

  });

  unit(".truncate()", function () {
    cs("'' ()", function () { aver.areEqual("", sut.truncate()); });
    cs("'' undef", function () { aver.areEqual("", sut.truncate(undefined)); });
    cs("'' null", function () { aver.areEqual("", sut.truncate(null)); });
    cs("coerce to string", function () { aver.areEqual("12345", sut.truncate(12345)); });
    cs("coerce to string and truncate", function () { aver.areEqual("123", sut.truncate(12345, 3)); });
    cs("truncate", function () { aver.areEqual("123", sut.truncate("12345", 3)); });
    cs("ellipsis", function () { aver.areEqual("1234..", sut.truncate("1234567890", 6, "..")); });
  });

  unit(".trim()", function () {
    cs("'' ()", function () { aver.areEqual("", sut.trim()); });
    cs("'' undef", function () { aver.areEqual("", sut.trim(undefined)); });
    cs("'' null", function () { aver.areEqual("", sut.trim(null)); });

    cs("coerce int to string", function () { aver.areEqual("12345", sut.trim(12345)); });
    cs("coerce bool to string", function () { aver.areEqual("true", sut.trim(true)); });

    cs("case 1", function () { aver.areEqual("abc", sut.trim(" abc")); });
    cs("case 2", function () { aver.areEqual("abc", sut.trim(" abc ")); });
    cs("case 3", function () { aver.areEqual("abc", sut.trim("\n abc\r ")); });
    cs("case 4", function () { aver.areEqual("a bc", sut.trim("\n a bc\r ")); });
    cs("case 5", function () { aver.areEqual("a\n\n   bc", sut.trim("\n a\n\n   bc\r ")); });
  });

  unit(".trimLeft()", function () {
    cs("'' ()", function () { aver.areEqual("", sut.trimLeft()); });
    cs("'' undef", function () { aver.areEqual("", sut.trimLeft(undefined)); });
    cs("'' null", function () { aver.areEqual("", sut.trimLeft(null)); });

    cs("coerce int to string", function () { aver.areEqual("12345", sut.trimLeft(12345)); });
    cs("coerce bool to string", function () { aver.areEqual("true", sut.trimLeft(true)); });

    cs("case 1", function () { aver.areEqual("abc", sut.trimLeft(" abc")); });
    cs("case 2", function () { aver.areEqual("abc ", sut.trimLeft(" abc ")); });
    cs("case 3", function () { aver.areEqual("abc\r ", sut.trimLeft("\n abc\r ")); });
    cs("case 4", function () { aver.areEqual("a bc\r ", sut.trimLeft("\n a bc\r ")); });
    cs("case 5", function () { aver.areEqual("a\n\n   bc\r ", sut.trimLeft("\n a\n\n   bc\r ")); });
  });

  unit(".trimRight()", function () {
    cs("'' ()", function () { aver.areEqual("", sut.trimRight()); });
    cs("'' undef", function () { aver.areEqual("", sut.trimRight(undefined)); });
    cs("'' null", function () { aver.areEqual("", sut.trimRight(null)); });

    cs("coerce int to string", function () { aver.areEqual("12345", sut.trimRight(12345)); });
    cs("coerce bool to string", function () { aver.areEqual("true", sut.trimRight(true)); });

    cs("case 1", function () { aver.areEqual(" abc", sut.trimRight(" abc")); });
    cs("case 2", function () { aver.areEqual(" abc", sut.trimRight(" abc ")); });
    cs("case 3", function () { aver.areEqual("\n abc", sut.trimRight("\n abc\r ")); });
    cs("case 4", function () { aver.areEqual("\n a bc", sut.trimRight("\n a bc\r ")); });
    cs("case 5", function () { aver.areEqual("\n a\n\n   bc", sut.trimRight("\n a\n\n   bc\r ")); });
  });

  unit(".startsWith()", function () {
    cs("'' ()", function () { aver.isTrue(sut.startsWith()); });//because "" starts with ""

    cs("case 0 coerce", function () { aver.isTrue(sut.startsWith("567abcdef", 567)); });

    cs("case 1", function () { aver.isTrue(sut.startsWith("abcdef", "ABc")); });
    cs("case 2", function () { aver.isFalse(sut.startsWith(" abcdef", "ABc")); });
    cs("case 3", function () { aver.isTrue(sut.startsWith(" abcdef", "ABc", false, 1)); });
    cs("case 4", function () { aver.isFalse(sut.startsWith(" abcdef", "ABc", true, 1)); });

  });


  unit(".dflt()", function () {
    cs("()", function () { aver.areEqual("", sut.dflt()); });
    cs("undef", function () { aver.areEqual("", sut.dflt(undefined)); });
    cs("null", function () { aver.areEqual("", sut.dflt(null)); });

    cs("1", function () { aver.areEqual("abc", sut.dflt(undefined, "abc")); });
    cs("2", function () { aver.areEqual("abc", sut.dflt(null, "abc")); });

    cs("1 2", function () { aver.areEqual("def", sut.dflt(undefined, undefined, "def")); });
    cs("2 2", function () { aver.areEqual("def", sut.dflt(null, null, "def")); });

    cs("3", function () { aver.areEqual("abc", sut.dflt("abc", undefined, "def")); });
    cs("4", function () { aver.areEqual("cba", sut.dflt("cba", null, "def")); });
    cs("5", function () { aver.areEqual("cba", sut.dflt("cba", "   ", "def")); });
    cs("6", function () { aver.areEqual("123", sut.dflt(123, "   ", "def")); });

    cs("6", function () { aver.areEqual("true", sut.dflt(true, "   ", "def")); });
    cs("7", function () { aver.areEqual("false", sut.dflt(false, "   ", "def")); });

    let x = " \r\n    ";
    let y = "anyway";
    cs("8", function () { aver.areEqual(y, sut.dflt(x, y)); });
    cs("9", function () { aver.areEqual(x, sut.dflt(x)); });
  });


  unit(".asString()", function () {
    cs("()", function () { aver.areEqual("", sut.asString()); });
    cs("undefined", function () { aver.areEqual("", sut.asString(undefined)); });
    cs("null", function () { aver.areEqual("", sut.asString(null)); });
    cs("-1", function () { aver.areEqual("-1", sut.asString(-1)); });
    cs("'abcd'", function () { aver.areEqual("abcd", sut.asString("abcd")); });

    cs("undefined, true", function () { aver.areEqual(undefined, sut.asString(undefined, true)); });
    cs("null, true", function () { aver.areEqual("", sut.asString(null, true)); });
    cs("-1, true", function () { aver.areEqual("-1", sut.asString(-1, true)); });
    cs("'abcd', true", function () { aver.areEqual("abcd", sut.asString("abcd", true)); });

    cs("true", function () { aver.areEqual("true", sut.asString(true)); });
    cs("false", function () { aver.areEqual("false", sut.asString(false)); });
    cs("'defg'", function () { aver.areEqual("defg", sut.asString(new String("defg"))); });
    cs("date", function () { aver.isTrue(sut.asString(new Date(1980, 1, 18)).indexOf("1980") > 0); });
  });

  unit(".isOneOf()", function () {
    cs("()", function () { aver.isFalse(sut.isOneOf()); });
    cs("(aaa,)", function () { aver.isFalse(sut.isOneOf("aaa")); });

    cs("(aaa,bbb)", function () { aver.isFalse(sut.isOneOf("aaa", "bbb")); });
    cs("(aaa,aaa)", function () { aver.isTrue(sut.isOneOf("aaa", "aaa")); });
    cs("(aaa,aAA)", function () { aver.isTrue(sut.isOneOf("aaa", "aAA")); });
    cs("(aaa,aAA, true)", function () { aver.isFalse(sut.isOneOf("aaa", "aAA", true)); });


    cs(" case 1 ", function () { aver.isFalse(sut.isOneOf("bbb", "a;b;c;d;e;f;aaa;ddd")); });
    cs(" case 2 ", function () { aver.isTrue(sut.isOneOf("ddd", "a;b;c;d;e;f;aaa;ddd")); });
    cs(" case 3 ", function () { aver.isTrue(sut.isOneOf("ddd", "a;b;c;d;e;f;aaa;dDD", false)); });
    cs(" case 4 ", function () { aver.isFalse(sut.isOneOf("ddd", "a;b;c;d;e;f;aaa;dDD", true)); });

    cs(" case 5 ", function () { aver.isTrue(sut.isOneOf(1, "a;b;c;1;e;f;aaa;ddd")); });
    cs(" case 6 ", function () { aver.isTrue(sut.isOneOf(false, "a;b;c;1;false;f;2aaa;ddd")); });
    cs(" case 7 ", function () { aver.isTrue(sut.isOneOf(false, "a|b|c|1|false|f|2aaa|ddd")); });

    cs("flags 1 ", function () { aver.isTrue(sut.isOneOf("rich", "a| b | RICH |  TIMID")); });
    cs("flags 2 ", function () { aver.isTrue(sut.isOneOf("tImiD", "a| b| RICH | TIMID ")); });
    cs("flags 3 ", function () { aver.isTrue(sut.isOneOf("a", "a|b| RICH|TIMID")); });
    cs("flags 4 ", function () { aver.isFalse(sut.isOneOf("hue", "a|b|RICH|TIMID")); });

    cs("flags 1 arr", function () { aver.isTrue(sut.isOneOf("rich", ["a  ", " b", " RICH ", " TIMID"])); });
    cs("flags 2 arr", function () { aver.isTrue(sut.isOneOf("tImiD", ["a  ", " b", " RICH ", " TIMID"])); });
    cs("flags 3 arr", function () { aver.isTrue(sut.isOneOf("a", ["a  ", " b", " RICH ", " TIMID"])); });
    cs("flags 4 arr", function () { aver.isFalse(sut.isOneOf("hue", ["a  ", " b", " RICH ", " TIMID"])); });

    cs("mix of types 1", function () { aver.isTrue(sut.isOneOf(true, [1, true, " 23", "goOD"])); });
    cs("mix of types 2", function () { aver.isTrue(sut.isOneOf(23, [1, true, " 23", "goOD"])); });
    cs("mix of types 3", function () { aver.isTrue(sut.isOneOf("23", [1, true, 23, "goOD"])); });
    cs("mix of types 4", function () { aver.isTrue(sut.isOneOf("good", [1, true, 23, "goOD"])); });
    cs("mix of types 5", function () { aver.isFalse(sut.isOneOf("good", [1, true, 23, "goOD"], true)); });

    cs("mix of types 6", function () { aver.isTrue(sut.isOneOf(7, [1, 2, 7, "go"])); });
  });


  unit(".describe()", function () {


    cs("undefined", function () {
      let v = undefined;
      let got = sut.describe(v);
      aver.areEqual("<undefined>", got);
    });

    cs("null", function () {
      let v = null;
      let got = sut.describe(v);
      aver.areEqual("<null>", got);
    });

    cs("string", function () {
      let v = "abcdef";
      let got = sut.describe(v);
      console.log(got);
      aver.areEqual("(string[6])\"abcdef\"", got);
    });

    cs("int", function () {
      let v = 123;
      let got = sut.describe(v);
      console.log(got);
      aver.areEqual("(number)123", got);
    });

    cs("float", function () {
      let v = 123.8901;
      let got = sut.describe(v);
      console.log(got);
      aver.areEqual("(number)123.8901", got);
    });

    cs("bool", function () {
      let v = false;
      let got = sut.describe(v);
      console.log(got);
      aver.areEqual("(boolean)false", got);
    });

    cs("date", function () {
      let v = new Date(1980, 7, 15);
      let got = sut.describe(v);
      console.log(got);
      aver.areEqual("(date)08/15/1980", got);
    });



    cs("array[5]", function () {
      let v = [1, 2, 3, true, -34.2];

      let got = sut.describe(v);
      console.log(got);
      aver.areEqual("(array[5])[1,2,3,true,-34.2]", got);
    });

    cs("object", function () {
      let v = { a: [1, 2, 3, true, -34.2], b: "abc" };

      let got = sut.describe(v);
      console.log(got);
      aver.areEqual("(object){\"a\":[1,2,3,true,-34.2],\"b\":\"abc\"}", got);
    });

    cs("symbol", function () {
      let v = Symbol(123);

      let got = sut.describe(v);
      console.log(got);
      aver.areEqual("(symbol)Symbol(123)", got);
    });
  });

  unit(".format()", function () {

    cs("without sub format 1 level nav", function () {
      aver.areEqual("a = -2, b = true", sut.format("a = <<a>>, b = <<b>>", { a: -2, b: true }));
    });

    cs("without sub format 2 level nav", function () {
      aver.areEqual("a = -2, b = true and dogma is bad, not good", sut.format("a = <<a>>, b = <<b>> and dogma is <<c.dogma>>", { a: -2, b: true, c: { dogma: "bad, not good" } }));
    });

    cs("without sub format 2 level+array nav", function () {
      const data = { a: -2, b: true, c: { dogma: ["bad, not good", "OK sometimes"] } };
      aver.areEqual("a = -2, b = true and dogma is bad, not good", sut.format("a = <<a>>, b = <<b>> and dogma is <<c.dogma.0>>", data));
      aver.areEqual("a = -2, b = true and dogma is OK sometimes", sut.format("a = <<a>>, b = <<b>> and dogma is <<c.dogma.1>>", data));
    });

    cs("type cast", function () {
      aver.areEqual("a = -2", sut.format("a = <<realA::tc{\"tm\": \"int\"}>>", { realA: -2.082932 }));
    });

    cs("date-1", function () {
      aver.areEqual("DOB: 01/02/1980", sut.format("DOB: <<dob::ld>>", { dob: new Date(1980, 0, 2) }));
    });

    cs("date-2", function () {
      aver.areEqual("DOB: 2 January 1980", sut.format("DOB: <<dob::ld{\"dtFormat\": \"LongDate\"}>>", { dob: new Date(1980, 0, 2) }));
    });

    cs("money-1", function () {
      aver.areEqual("Balance: $2,315,678.89", sut.format("Balance: <<amt::lm{\"iso\": \"usd\"}>>", { amt: 2315678.8999 }));
    });

    cs("money-2", function () {
      aver.areEqual("Balance: $2,315,678.89", sut.format("Balance: <<amt::lm{\"iso\": \"@iso\"}>>", { amt: 2315678.8999, iso: "usd" }));
    });

    cs("bad json", function () {
      aver.throws(() => sut.format("a = <<a::ld{'a': }>>, b = <<b>>", {}), "Error parsing token format");
    });


    cs("full example", function () {
      const data = {
        title: "Mr.",
        lname: "Solomon",
        fname: "Satya",
        dob: new Date(Date.UTC(1980, 0, 2, 13, 44, 12)),
        balance: 5123456.89,
        balance_iso: "usd",
        hobbies: [{ id: "run", name: "Running" }, { id: "wld", name: "Welding" }]
      };

      const msg =
        `Dear <<title>> <<lname>>! You were born on <<dob::ld{"dtFormat": "LongDate", "tmDetails": "HMS"}>> and
       saved <<balance::lm{"iso": "@balance_iso", "precision": 0}>>. We appreciate that you like <<hobbies.1.name>>! Thanks <<fname>>!`;

      const expect =
        `Dear Mr. Solomon! You were born on 2 January 1980 13:44:12 and
       saved $5,123,456. We appreciate that you like Welding! Thanks Satya!`;


      aver.areEqual(expect, sut.format(msg, data));
    });
  });

  unit(".isValidEMail()", function () {

    cs("()", function () { aver.isFalse(sut.isValidEMail()); });
    cs("(undefined)", function () { aver.isFalse(sut.isValidEMail(undefined)); });
    cs("(null)", function () { aver.isFalse(sut.isValidEMail(null)); });
    cs("(true)", function () { aver.isFalse(sut.isValidEMail(true)); });
    cs("(7)", function () { aver.isFalse(sut.isValidEMail(7)); });

    cs("person@domain.com", function () { aver.isTrue(sut.isValidEMail("person@domain.com")); });
    cs("person-a-b-c@domain.com", function () { aver.isTrue(sut.isValidEMail("person-a-b-c@domain.com")); });
    cs("person.a.b.c@domain.com", function () { aver.isTrue(sut.isValidEMail("person.a.b.c@domain.com")); });
    cs("person.a.b.c@domain.another.com", function () { aver.isTrue(sut.isValidEMail("person.a.b.c@domain.another.com")); });

    cs("@domain.com", function () { aver.isFalse(sut.isValidEMail("@domain.com")); });
    cs("aaa@d", function () { aver.isFalse(sut.isValidEMail("aaa@d")); });

    cs("aaa@do", function () { aver.isFalse(sut.isValidEMail("aaa@do")); });
    cs("aaa@do@abc.com", function () { aver.isFalse(sut.isValidEMail("aaa@do@abc.com")); });
    cs("aaa@do.d", function () { aver.isTrue(sut.isValidEMail("aaa@do.d")); });
    cs("aaa@do.do", function () { aver.isTrue(sut.isValidEMail("aaa@do.do")); });

    cs("aaa@aaa...bbb", function () { aver.isFalse(sut.isValidEMail("aaa@aaa...bbb")); });
  });

  unit(".isValidScreenName()", function () {

    cs("()", function () { aver.isFalse(sut.isValidScreenName()); });
    cs("(undefined)", function () { aver.isFalse(sut.isValidScreenName(undefined)); });
    cs("(null)", function () { aver.isFalse(sut.isValidScreenName(null)); });
    cs("(7)", function () { aver.isFalse(sut.isValidScreenName(7)); });

    cs("(true)", function () { aver.isTrue(sut.isValidScreenName(true)); });
    cs("my-name", function () { aver.isTrue(sut.isValidScreenName("my-name")); });
    cs("my.name", function () { aver.isTrue(sut.isValidScreenName("my.name")); });
    cs("my.name1980", function () { aver.isTrue(sut.isValidScreenName("my.name1980")); });
    cs("my.name-1980.ok", function () { aver.isTrue(sut.isValidScreenName("my.name-1980.ok")); });

    cs("1my-name", function () { aver.isFalse(sut.isValidScreenName("1my-name")); });
    cs("my name", function () { aver.isFalse(sut.isValidScreenName("my name")); });
    cs("-my.name", function () { aver.isFalse(sut.isValidScreenName("-my.name")); });
    cs("my.name1980.", function () { aver.isFalse(sut.isValidScreenName("my.name1980.")); });
    cs("my..name-1980.ok", function () { aver.isFalse(sut.isValidScreenName("my..name-1980.ok")); });
    cs("my.-name", function () { aver.isFalse(sut.isValidScreenName("my.-name")); });
  });

  unit(".normalizeUSPhone()", function () {
    cs("normalize-phone-1", () => aver.areEqual(sut.normalizeUSPhone("5552224415"), "(555) 222-4415"));
    cs("normalize-phone-2", () => aver.areEqual(sut.normalizeUSPhone("2224415"), "(???) 222-4415"));
    cs("normalize-phone-3", () => aver.areEqual(sut.normalizeUSPhone("   +38 067 2148899   "), "+38 067 2148899"));
    cs("normalize-phone-4", () => aver.areEqual(sut.normalizeUSPhone("555-222-4415"), "(555) 222-4415"));
    cs("normalize-phone-5", () => aver.areEqual(sut.normalizeUSPhone("555-222-4415 EXT 2014"), "(555) 222-4415x2014"));
    cs("normalize-phone-6", () => aver.areEqual(sut.normalizeUSPhone("555-222-4415.2014"), "(555) 222-4415x2014"));
    cs("normalize-phone-7", () => aver.areEqual(sut.normalizeUSPhone("555-222-4415EXT.2014"), "(555) 222-4415x2014"));
    cs("normalize-phone-8", () => aver.areEqual(sut.normalizeUSPhone("555-222-4415 X 2014"), "(555) 222-4415x2014"));
    cs("normalize-phone-9", () => aver.areEqual(sut.normalizeUSPhone("555.222.4415"), "(555) 222-4415"));
    cs("normalize-phone-10", () => aver.areEqual(sut.normalizeUSPhone("555-222-4415"), "(555) 222-4415"));
    cs("normalize-phone-11", () => aver.areEqual(sut.normalizeUSPhone("5552224415ext123"), "(555) 222-4415x123"));
    cs("normalize-phone-12", () => aver.areEqual(sut.normalizeUSPhone("5552224415ext.123"), "(555) 222-4415x123"));
  });

  unit(".isValidPhone()", function () {
    cs("valid-phones", function () {
      const good = [
        "(800) 234-2345x234",
        "(800) 234-2345",
        "800 2345678",
        "800 234-4522",
        "800.2345678",
        "800.234.4522",
        "800-234-2345",
        "800-234-2345x234",
        "8882344511",
        "(888)2344511",
        "(888)234-4511",
        "(888)234.4511",
        "(888) 2344511",
        "(888) 234 4511",
        "(900) 4megood",
        "9004megood",
        "+28937498723987498237",
        "+8293 823098 82394",
        "+3423-3423-234-34",
        "+3423-3423-234x456",
        "+1 900 4ME-GOOD"
      ];

      for (let i = 0; i < good.length; i++) {
        aver.isTrue(sut.isValidPhone(good[i]), good[i]);
      }
    });

    cs("invalid-phones", function () {
      const bad = [
        "800",
        "(800)",
        "(8888)234-4511",
        " (888)234-4511",
        "(888)234-4511 ",
        "(8-88)234-4511",
        "+1423423 +23423",
        ")800 23456777(",
        "800)1234567",
        "(216) 234(2345)",
        "345#aaaaa",
        "7567:242333",
        "+800242--3333",
        "+800242..3333",
        "+800242-.3333",
        "#800242.-3333",
        "+800242.-3333",
        "+(80 0)242.-3333",
        "(800).2423333",
        "(800)-2423333",
        "(800)2423333.",
        ".(800)2423333",
        "-(800)2423333",
        "((800))2423333",
        "(800-)2423333",
        "(.800)2423333",
        "+(800)242-3333",
        "(800)242. 3333",
        "(800)242 - 3333",
        "(800)242        COOL",
        "(800)242 - 33 - 33"
      ];

      for (let i = 0; i < bad.length; i++) {
        aver.isFalse(sut.isValidPhone(bad[i]), bad[i]);
      }
    });
  });

  unit(".isLetter()", function () {
    cs("true ('a')", () => aver.isTrue(sut.isLetter('a')));
    cs("false ('1')", () => aver.isFalse(sut.isLetter('1')));
    cs("false (1)", () => aver.isFalse(sut.isLetter(1)));
    cs("false (' ')", () => aver.isFalse(sut.isLetter(' ')));
    cs("false ('$')", () => aver.isFalse(sut.isLetter('$')));
    cs("false ('@')", () => aver.isFalse(sut.isLetter('@')));
    cs("false ('\t')", () => aver.isFalse(sut.isLetter('\t')));
    cs("false ('mo')", () => aver.isFalse(sut.isLetter('mo')));
    cs("false ('m#')", () => aver.isFalse(sut.isLetter('m#')));
  });

  unit(".isDigit()", function () {
    cs("false ('a')", () => aver.isFalse(sut.isDigit('a')));
    cs("true ('1')", () => aver.isTrue(sut.isDigit('1')));
    cs("true (1)", () => aver.isTrue(sut.isDigit(1)));
    cs("false (' ')", () => aver.isFalse(sut.isDigit(' ')));
    cs("false ('$')", () => aver.isFalse(sut.isDigit('$')));
    cs("false ('@')", () => aver.isFalse(sut.isDigit('@')));
    cs("false ('\t')", () => aver.isFalse(sut.isDigit('\t')));
    cs("false ('mo')", () => aver.isFalse(sut.isDigit('mo')));
    cs("false ('m#')", () => aver.isFalse(sut.isDigit('m#')));
  });

  unit(".isLetterOrDigit()", function () {
    cs("true ('a')", () => aver.isTrue(sut.isLetterOrDigit('a')));
    cs("true ('1')", () => aver.isTrue(sut.isLetterOrDigit('1')));
    cs("true (1)", () => aver.isTrue(sut.isLetterOrDigit(1)));
    cs("false (' ')", () => aver.isFalse(sut.isLetterOrDigit(' ')));
    cs("false ('$')", () => aver.isFalse(sut.isLetterOrDigit('$')));
    cs("false ('@')", () => aver.isFalse(sut.isLetterOrDigit('@')));
    cs("false ('\t')", () => aver.isFalse(sut.isLetterOrDigit('\t')));
    cs("false ('mo')", () => aver.isFalse(sut.isLetterOrDigit('mo')));
    cs("false ('m#')", () => aver.isFalse(sut.isLetterOrDigit('m#')));
  });

  unit(".isMultilingualLetterOrDigit()", function () {
    cs("true ('a')", () => aver.isTrue(sut.isMultilingualLetterOrDigit('a')));
    cs("true ('1')", () => aver.isTrue(sut.isMultilingualLetterOrDigit('1')));
    cs("true (1)", () => aver.isTrue(sut.isMultilingualLetterOrDigit(1)));
    cs("true ('é')", () => aver.isTrue(sut.isMultilingualLetterOrDigit('é')));
    cs("true ('ç')", () => aver.isTrue(sut.isMultilingualLetterOrDigit('ç')));
    cs("true ('α')", () => aver.isTrue(sut.isMultilingualLetterOrDigit('α')));
    cs("true ('٥')", () => aver.isTrue(sut.isMultilingualLetterOrDigit('٥')));
    cs("true ('९')", () => aver.isTrue(sut.isMultilingualLetterOrDigit('९')));
    cs("false (' ')", () => aver.isFalse(sut.isMultilingualLetterOrDigit(' ')));
    cs("false ('$')", () => aver.isFalse(sut.isMultilingualLetterOrDigit('$')));
    cs("false ('@')", () => aver.isFalse(sut.isMultilingualLetterOrDigit('@')));
    cs("false ('\t')", () => aver.isFalse(sut.isMultilingualLetterOrDigit('\t')));
    cs("false ('mo')", () => aver.isFalse(sut.isMultilingualLetterOrDigit('mo')));
    cs("false ('m#')", () => aver.isFalse(sut.isMultilingualLetterOrDigit('m#')));
  });

  unit(".bufToHex()", function () {

    cs("()", function () { aver.isNull(sut.bufToHex()); });
    cs("(null)", function () { aver.isNull(sut.bufToHex(null)); });
    cs("(undefined)", function () { aver.isNull(sut.bufToHex(undefined)); });

    cs("[1,2,3]", function () { aver.areEqual("010203", sut.bufToHex([1, 2, 3])); });
    cs("[255,256,-1]", function () { aver.areEqual("ff00ff", sut.bufToHex([255, 256, -1])); });
    cs("[255,257,-1]", function () { aver.areEqual("ff01ff", sut.bufToHex([255, 257, -1])); });

    cs("Uint8Array", function () {
      let buf = new Uint8Array(120);
      buf[0] = 0xab;
      buf[119] = 0xdd;
      let got = sut.bufToHex(buf);
      console.info(got);
      aver.areEqual(120 * 2, got.length);
      aver.areEqual("a", got[0]);
      aver.areEqual("b", got[1]);
      aver.areEqual("d", got[238]);
      aver.areEqual("d", got[239]);
    });

    cs("throws", function () {
      aver.throws(function () { sut.bufToHex({}); }, "isiterable");
    });
  });//bufToHex

});
