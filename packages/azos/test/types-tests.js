/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

//import { describe, it } from "mocha";
import { defineUnit as unit, defineCase as cs } from "../run.js";
import * as sut from "../types.js";
import * as strings from "../strings.js";
import * as aver from "../aver.js";

unit("Types", function() {

  unit("#isAssigned()", function() {
    cs("false for empty()",   function() { aver.isFalse( sut.isAssigned()           );});
    cs("false for undefined", function() { aver.isFalse( sut.isAssigned(undefined)  );});
    cs("false for null",      function() { aver.isFalse( sut.isAssigned(null)       );});

    cs("true for ''",    function() { aver.isTrue( sut.isAssigned("")       );});
    cs("true for 'abc'", function() { aver.isTrue( sut.isAssigned("abc")    );});
    cs("true for []",    function() { aver.isTrue( sut.isAssigned([])    );});
    cs("true for {}",    function() { aver.isTrue( sut.isAssigned({})    );});
    cs("true for true",  function() { aver.isTrue( sut.isAssigned(true)    );});
    cs("true for false", function() { aver.isTrue( sut.isAssigned(false)    );});
    cs("true for 123",   function() { aver.isTrue( sut.isAssigned(123)    );});
    cs("true for Date",  function() { aver.isTrue( sut.isAssigned(new Date(1980,1, 21))    );});
  });

  unit("#hown()", function() {
    cs("false for empty()",   function() { aver.isFalse( sut.hown()  );});
    cs("false for undefined", function() { aver.isFalse( sut.hown(undefined)  );});
    cs("false for null",      function() { aver.isFalse( sut.hown(null)       );});

    cs("{}",        function() { aver.isFalse( sut.hown({})  );});
    cs("{}, null",  function() { aver.isFalse( sut.hown({}, null)  );});
    cs("null, 'a'", function() { aver.isFalse( sut.hown(null, "a")  );});
    cs("{}, 'a'",   function() { aver.isFalse( sut.hown({}, "a")  );});

    cs("{a: undefined}, 'a'", function() { aver.isTrue( sut.hown({a: undefined}, "a")  );});

    cs("{[symbol1]: 1}, symbol1", function() {
      const s1 = Symbol("1");
      aver.isTrue( sut.hown({[s1]: 1}, s1)  );
    });

    cs("{[symbol2]: 1}, symbol1", function() {
      const s1 = Symbol("111111");
      const s2 = Symbol("222222");
      aver.isTrue( sut.hown({[s1]: 1}, s1)  );
      aver.isFalse( sut.hown({[s1]: 1}, s2)  );
    });

    cs("inherit", function() {
      function MyClass() {this.A = 1;}
      MyClass.prototype = {B: 2};

      let obj = new MyClass();

      aver.isTrue( sut.hown(obj, "A")  );
      aver.isTrue( "B" in obj  );
      aver.isFalse( sut.hown(obj, "B")  );
    });
  });

  unit("#allObjectValues()", function() {
    cs("()",          () => aver.areArraysEquivalent([], sut.allObjectValues()) );
    cs("(undefined)", () => aver.areArraysEquivalent([], sut.allObjectValues(undefined)) );
    cs("(null)",      () => aver.areArraysEquivalent([], sut.allObjectValues(null)) );

    cs("flat",    function(){
      let o = {a: 1, b: true};
      aver.areArraysEquivalent([1, true], sut.allObjectValues(o));
    });

    cs("with proto",  function(){
      function A(){ this.a = 1; this.b = true; this.z = "hello";}
      A.prototype.c = 123;
      let o = new A();
      aver.areEqual(123, o.c);//it is inherited from prototype
      aver.areArraysEquivalent([1, true, "hello"], sut.allObjectValues(o));//but the allObjectValues does not see it
    });


  });



  unit("#arrayDelete()", function() {
    cs("deletes int",   function() {
      let a = [1,2,3];
      aver.isTrue( sut.arrayDelete(a, 2)  );
      aver.areEqual(2, a.length );
      aver.areEqual(1, a[0] );
      aver.areEqual(3, a[1] );
    });

    cs("deletes int once",   function() {
      let a = [1,2,3,2];
      aver.isTrue( sut.arrayDelete(a, 2)  );
      aver.areEqual(3, a.length );
      aver.areEqual(1, a[0] );
      aver.areEqual(3, a[1] );
      aver.areEqual(2, a[2] );
    });

    cs("deletes undefined",   function() {
      let a = [1,2,undefined];
      aver.isTrue( sut.arrayDelete(a, undefined)  );
      aver.areEqual(2, a.length );
      aver.areEqual(1, a[0] );
      aver.areEqual(2, a[1] );
    });

    cs("does not delete absent",   function() {
      let a = [1, 2, 3];
      aver.isFalse( sut.arrayDelete(a, 5)  );
      aver.areEqual(3, a.length );
      aver.areEqual(1, a[0] );
      aver.areEqual(2, a[1] );
      aver.areEqual(3, a[2] );
    });

    cs("deletes objects",   function() {
      let o = {c: 3};
      let a = [{a: 1}, {b: 2}, o];
      aver.isTrue( sut.arrayDelete(a, o)  );
      aver.areEqual(2, a.length );
      aver.areEqual(1, a[0].a );
      aver.areEqual(2, a[1].b );
    });
  });


  unit("#arrayCopy()", function() {
    cs("copies",   function() {
      let a = [1,2,3];
      let b = sut.arrayCopy(a);

      aver.areNotEqual(a, b );
      aver.areEqual(a.length, b.length );
      aver.areEqual(a[0], b[0] );
      aver.areEqual(a[1], b[1] );
      aver.areEqual(a[2], b[2] );
    });
  });

  unit("#arrayClear()", function() {
    cs("clears",   function() {
      const a = [1,2,3];
      let b = sut.arrayClear(a);
      aver.areEqual(a, b );
      aver.areEqual(0, a.length);
    });
  });

  unit("#isString()", function() {
    cs("false for empty()",   function() { aver.isFalse( sut.isString()           );});
    cs("false for undefined", function() { aver.isFalse( sut.isString(undefined)  );});
    cs("false for null",      function() { aver.isFalse( sut.isString(null)       );});

    cs("false for true",      function() { aver.isFalse( sut.isString(true) );});
    cs("false for 1",      function() { aver.isFalse( sut.isString(1)       );});
    cs("false for []",      function() { aver.isFalse( sut.isString([])     );});
    cs("false for {}",      function() { aver.isFalse( sut.isString({})     );});

    cs("true for ''",       function() { aver.isTrue( sut.isString("")       );});
    cs("true for 'abc'",   function() { aver.isTrue( sut.isString("abc")    );});

    cs("true for new String('abc')",   function() { aver.isTrue( sut.isString( new String("abc") )) ;});
  });


  unit("#isDate()", function() {
    cs("false for empty()",   function() { aver.isFalse( sut.isDate()           );});
    cs("false for undefined", function() { aver.isFalse( sut.isDate(undefined)  );});
    cs("false for null",      function() { aver.isFalse( sut.isDate(null)       );});

    cs("true for date",      function() { aver.isTrue( sut.isDate( new Date("December 25, 2014")) );});
    cs("true for date(now)", function() { aver.isTrue( sut.isDate( new Date( Date.now() )) );});
  });


  unit("#isNumber()", function() {
    cs("false for empty()",   function() { aver.isFalse( sut.isNumber()           );});
    cs("false for undefined", function() { aver.isFalse( sut.isNumber(undefined)  );});
    cs("false for null",      function() { aver.isFalse( sut.isNumber(null)       );});

    cs("false for {}",      function() { aver.isFalse( sut.isNumber({})       );});
    cs("false for true",      function() { aver.isFalse( sut.isNumber(true)   );});
    cs("false for 'abc'",      function() { aver.isFalse( sut.isNumber("abc") );});
    cs("false for '2'",  function() { aver.isFalse( sut.isNumber( "2" )); });


    cs("true for 2",    function() { aver.isTrue( sut.isNumber( 2 )); });
    cs("true for -123.1232",    function() { aver.isTrue( sut.isNumber( -123.1232 )); });

    cs("true for new Number(-123.1232)",    function() { aver.isTrue( sut.isNumber( new Number(-123.1232) )); });
  });


  unit("#isBool()", function() {
    cs("false for empty()",   function() { aver.isFalse( sut.isBool()           );});
    cs("false for undefined", function() { aver.isFalse( sut.isBool(undefined)  );});
    cs("false for null",      function() { aver.isFalse( sut.isBool(null)       );});

    cs("false for {}",      function() { aver.isFalse( sut.isBool({})       );});
    cs("false for 'abc'",   function() { aver.isFalse( sut.isBool("abc") );});
    cs("false for 1",       function() { aver.isFalse( sut.isBool( 1 )); });
    cs("false for '1'",     function() { aver.isFalse( sut.isBool( "1" )); });


    cs("true for true",    function() { aver.isTrue( sut.isBool( true )); });
    cs("true for false",    function() { aver.isTrue( sut.isBool( false )); });

    cs("true for new Boolean()",    function() { aver.isTrue( sut.isBool( new Boolean(true) )); });
  });

  unit("#isSymbol()", function() {
    cs("false for empty()",   function() { aver.isFalse( sut.isSymbol()           );});
    cs("false for undefined", function() { aver.isFalse( sut.isSymbol(undefined)  );});
    cs("false for null",      function() { aver.isFalse( sut.isSymbol(null)       );});

    cs("false for {}",      function() { aver.isFalse( sut.isSymbol({})       );});
    cs("false for 'abc'",   function() { aver.isFalse( sut.isSymbol("abc") );});
    cs("false for 1",       function() { aver.isFalse( sut.isSymbol( 1 )); });
    cs("false for '1'",     function() { aver.isFalse( sut.isSymbol( "1" )); });


    cs("true for Sym 123",    function() { aver.isTrue( sut.isSymbol( Symbol(123) )); });
    cs("true for Sym xyz",    function() { aver.isTrue( sut.isSymbol( Symbol("xyz"))); });
  });


  unit("#isArray()", function() {
    cs("false for empty()",   function() { aver.isFalse( sut.isArray()          );});
    cs("false for undefined", function() { aver.isFalse( sut.isArray(undefined) );});
    cs("false for null",      function() { aver.isFalse( sut.isArray(null)      );});
    cs("false for true",      function() { aver.isFalse( sut.isArray(true)      );});
    cs("false for int",       function() { aver.isFalse( sut.isArray(123)       );});
    cs("false for string",    function() { aver.isFalse( sut.isArray("zaza")    );});
    cs("false for {}",        function() { aver.isFalse( sut.isArray({})        );});

    cs("false for function{}",        function() { aver.isFalse( sut.isArray(function(){}) );});

    cs("true for []",            function() { aver.isTrue( sut.isArray([])           );});
    cs("true for [null, null]",  function() { aver.isTrue( sut.isArray([null, null]) );});
    cs("true for [1,2,3]",       function() { aver.isTrue( sut.isArray([1,2,3])      );});

    cs("true for new Array()",       function() { aver.isTrue( sut.isArray( new Array()) );});
  });

  unit("#isObject()", function() {
    cs("false for empty()",   function() { aver.isFalse( sut.isObject()          );});
    cs("false for undefined", function() { aver.isFalse( sut.isObject(undefined) );});
    cs("false for null",      function() { aver.isFalse( sut.isObject(null)      );});
    cs("false for true",      function() { aver.isFalse( sut.isObject(true)      );});
    cs("false for int",       function() { aver.isFalse( sut.isObject(123)       );});
    cs("false for string",    function() { aver.isFalse( sut.isObject("zaza")    );});
    cs("false for []",        function() { aver.isFalse( sut.isObject([])    );});

    cs("false for function{}",        function() { aver.isFalse( sut.isObject(function(){}) );});

    cs("true for {}",        function() { aver.isTrue( sut.isObject({})        );});
    cs("true for {a:1...}",  function() { aver.isTrue( sut.isObject({a: 2, b: 3}) );});

    function Car(){ this.a=1; }

    cs("true for new Car()",  function() { aver.isTrue( sut.isObject(new Car()) );});
  });

  unit("#isFunction()", function() {
    cs("false for empty()",   function() { aver.isFalse( sut.isFunction()          );});
    cs("false for undefined", function() { aver.isFalse( sut.isFunction(undefined) );});
    cs("false for null",      function() { aver.isFalse( sut.isFunction(null)      );});
    cs("false for true",      function() { aver.isFalse( sut.isFunction(true)      );});
    cs("false for int",       function() { aver.isFalse( sut.isFunction(123)       );});
    cs("false for string",    function() { aver.isFalse( sut.isFunction("zaza")    );});
    cs("false for []",        function() { aver.isFalse( sut.isFunction([])    );});

    cs("false for {}",        function() { aver.isFalse( sut.isFunction({})    );});

    cs("true for function{}", function() { aver.isTrue( sut.isFunction( function(){}) );});
    cs("true for ()=>true", function() { aver.isTrue( sut.isFunction( () => true ) );});
    cs("true for new Function()",  function() { aver.isTrue( sut.isFunction( new Function("a", "return a*a")) );});


    cs("true for generator",  function() {

      function* gen(){ yield 1; yield 2; }

      const f = gen;

      aver.isTrue( sut.isFunction( gen ) );
      aver.isTrue( sut.isFunction( f ) );
    });

  });


  unit("#isObjectOrArray()", function() {
    cs("false for empty()",   function() { aver.isFalse( sut.isObjectOrArray()          );});
    cs("false for undefined", function() { aver.isFalse( sut.isObjectOrArray(undefined) );});
    cs("false for null",      function() { aver.isFalse( sut.isObjectOrArray(null)      );});
    cs("false for true",      function() { aver.isFalse( sut.isObjectOrArray(true)      );});
    cs("false for int",       function() { aver.isFalse( sut.isObjectOrArray(123)       );});
    cs("false for string",    function() { aver.isFalse( sut.isObjectOrArray("zaza")    );});

    cs("false for function{}",        function() { aver.isFalse( sut.isObjectOrArray(function(){}) );});

    cs("true for new Date(1)",        function() { aver.isTrue( sut.isObjectOrArray(new Date(1)) );});
    cs("true for new Boolean(true)",  function() { aver.isTrue( sut.isObjectOrArray(new Boolean(true)) );});
    cs("true for new Number(1)",      function() { aver.isTrue( sut.isObjectOrArray(new Number(1)) );});

    //String is "primitive"
    cs("false for 'aaa'",      function() { aver.isFalse( sut.isObjectOrArray("aaa") );});


    cs("true for []",        function() { aver.isTrue( sut.isObjectOrArray([]) );});
    cs("true for {}",        function() { aver.isTrue( sut.isObjectOrArray({})  );});
    cs("true for {a:1...}",  function() { aver.isTrue( sut.isObjectOrArray({a: 2, b: 3}) );});

    function Car(){ this.a=1; }

    cs("true for new Car()",  function()    { aver.isTrue( sut.isObjectOrArray(new Car())    );});
    cs("true for [null, null]",  function() { aver.isTrue( sut.isObjectOrArray([null, null]) );});
    cs("true for [1,2,3]",       function() { aver.isTrue( sut.isObjectOrArray([1,2,3])      );});
  });

  unit("#isObjectOrFunction()", function() {
    cs("false for empty()",   function() { aver.isFalse( sut.isObjectOrFunction()          );});
    cs("false for undefined", function() { aver.isFalse( sut.isObjectOrFunction(undefined) );});
    cs("false for null",      function() { aver.isFalse( sut.isObjectOrFunction(null)      );});
    cs("false for true",      function() { aver.isFalse( sut.isObjectOrFunction(true)      );});
    cs("false for int",       function() { aver.isFalse( sut.isObjectOrFunction(123)       );});
    cs("false for string",    function() { aver.isFalse( sut.isObjectOrFunction("zaza")    );});
    cs("false for []",        function() { aver.isFalse( sut.isObjectOrFunction([]) );});

    cs("true for new Date(1)",        function() { aver.isTrue( sut.isObjectOrFunction(new Date(1)) );});
    cs("true for new Boolean(true)",  function() { aver.isTrue( sut.isObjectOrFunction(new Boolean(true)) );});
    cs("true for new Number(1)",      function() { aver.isTrue( sut.isObjectOrFunction(new Number(1)) );});

    //String is "primitive"
    cs("false for 'aaa'",      function() { aver.isFalse( sut.isObjectOrFunction("aaa") );});

    cs("true for {}",        function() { aver.isTrue( sut.isObjectOrFunction({})  );});
    cs("true for {a:1...}",  function() { aver.isTrue( sut.isObjectOrFunction({a: 2, b: 3}) );});

    function Car(){ this.a=1; }

    cs("true for new Car()",      function() { aver.isTrue( sut.isObjectOrFunction(new Car())    );});
    cs("false for [null, null]",  function() { aver.isFalse( sut.isObjectOrFunction([null, null]) );});

    cs("true for function{}",     function() { aver.isTrue( sut.isObjectOrFunction( function(){}) );});
    cs("true for ()=>true",       function() { aver.isTrue( sut.isObjectOrFunction( () => true ) );});
    cs("true for new Function()", function() { aver.isTrue( sut.isObjectOrFunction( new Function("a", "return a*a")) );});

  });


  unit("#isIterable()", function() {
    cs("false for empty()",   function() { aver.isFalse( sut.isIterable()          );});
    cs("false for undefined", function() { aver.isFalse( sut.isIterable(undefined) );});
    cs("false for null",      function() { aver.isFalse( sut.isIterable(null)      );});
    cs("false for true",       function() { aver.isFalse( sut.isIterable(true)          );});
    cs("false for new Date(1)",  function() { aver.isFalse( sut.isIterable(new Date(1)) );});
    cs("false for 3",       function() { aver.isFalse( sut.isIterable(3)      );});
    cs("false for {}",      function() { aver.isFalse( sut.isIterable({ })       );});

    cs("true for string",   function() { aver.isTrue( sut.isIterable("")        );});
    cs("true for []",       function() { aver.isTrue( sut.isIterable([])        );});
    cs("true for Map",      function() { aver.isTrue( sut.isIterable(new Map()) );});
    cs("true for Set",      function() { aver.isTrue( sut.isIterable(new Set()) );});
  });




  unit("#describeTypeOf()", function() {
    cs("for ()",   function() { aver.areEqual( "<undefined>", sut.describeTypeOf() );});
    cs("for undefined",   function() { aver.areEqual( "<undefined>", sut.describeTypeOf(undefined) );});
    cs("for null",   function() { aver.areEqual( "<null>", sut.describeTypeOf(null) );});

    cs("for 1",   function() { aver.areEqual( "number", sut.describeTypeOf(1) );});
    cs("for new Number()",   function() { aver.areEqual( "number", sut.describeTypeOf(new Number(1)) );});
    cs("for 1.3",   function() { aver.areEqual( "number", sut.describeTypeOf(1.3) );});
    cs("for true",   function() { aver.areEqual( "boolean", sut.describeTypeOf(true) );});
    cs("for false",   function() { aver.areEqual( "boolean", sut.describeTypeOf(false) );});

    cs("for new Boolean()",   function() { aver.areEqual( "boolean", sut.describeTypeOf(new Boolean(false)) );});
    cs("for ''",   function() { aver.areEqual( "string", sut.describeTypeOf("") );});
    cs("for new String()",   function() { aver.areEqual( "string", sut.describeTypeOf(new String("")) );});

    cs("for Date",   function() { aver.areEqual( "date", sut.describeTypeOf(new Date()) );});
    cs("for []",   function() { aver.areEqual( "array", sut.describeTypeOf([]) );});
    cs("for [1,2,3]",   function() { aver.areEqual( "array", sut.describeTypeOf([1,2,3]) );});
    cs("for {}",   function() { aver.areEqual( "object", sut.describeTypeOf({}) );});
    cs("for {a: 1}",   function() { aver.areEqual( "object", sut.describeTypeOf({a: 1}) );});


    cs("for Symbol",   function() {
      let x = Symbol(9990);
      aver.areEqual( "symbol", sut.describeTypeOf(x) );
    });

    cs("for {Iterable}",   function() {
      let x = {
        a: 1, b: true,
        [Symbol.iterator]: function(){ return null; }
      };
      aver.areEqual( "object+Iterable", sut.describeTypeOf(x) );
    });

  });

  unit("#nav()", function() {

    cs("()",   function() {
      let got = sut.nav();
      aver.isNotNull(got);
      aver.isUndefined( got.orig  );
      aver.isUndefined( got.root  );
      aver.isUndefined( got.full  );
      aver.isUndefined( got.value );
      aver.isUndefined( got.result );
    });

    cs("({})",   function() {
      let got = sut.nav({});
      aver.isNotNull(got);
      aver.isNotNull( got.orig  );
      aver.isNotNull( got.root  );
      aver.isUndefined( got.full  );
      aver.isUndefined( got.value );
      aver.isUndefined( got.result );
    });

    cs("({},'a')",   function() {
      let obj = {};
      let got = sut.nav(obj,"a");
      aver.isNotNull(got);
      aver.isNotNull( got.orig  );
      aver.isNotNull( got.root  );
      aver.isFalse( got.full  );
      aver.areEqual(obj, got.value );
      aver.isUndefined(got.result);
    });

    cs("({a: 1},'a')",   function() {
      let obj = {a: 1};
      let got = sut.nav(obj,"a");
      aver.isNotNull(got);
      aver.isNotNull( got.orig  );
      aver.isNotNull( got.root  );
      aver.isTrue  ( got.full  );
      aver.areEqual(1, got.value );
      aver.areEqual(1, got.result);
    });

    cs("({a: undefined},'a')",   function() {
      let obj = {a: undefined};
      let got = sut.nav(obj,"a");
      aver.isNotNull(got);
      aver.isNotNull( got.orig  );
      aver.isNotNull( got.root  );
      aver.isTrue  ( got.full  ); // ATTENTION: full = true, but result is 100% match to undefined
      aver.areEqual(undefined, got.value );
      aver.areEqual(undefined, got.result);// undefined is a 100% match (because full=true)
    });

    cs("({a: undefined},'a.b.c')",   function() {
      let obj = {a: undefined};
      let got = sut.nav(obj,"a.b.c");
      aver.isNotNull(got);
      aver.isNotNull( got.orig  );
      aver.isNotNull( got.root  );
      aver.isFalse  ( got.full  ); // ATTENTION: full = false because there is no a.b.c
      aver.areEqual(undefined, got.value );
      aver.areEqual(undefined, got.result);
    });


    cs("([123, undefined, true],'1')",   function() {
      let obj = [123, undefined, true ];
      let got = sut.nav(obj,"1");
      aver.isNotNull(got);
      aver.isNotNull( got.orig  );
      aver.isNotNull( got.root  );
      aver.isTrue   ( got.full  ); // ATTENTION: full = true obj[1]==undefined
      aver.areEqual(undefined, got.value );
      aver.areEqual(undefined, got.result);
    });

    cs("([123, {a: {b: 567}}, true ],'1.a.b')",   function() {
      let obj = [123, {a: {b: 567}}, true ];
      let got = sut.nav(obj,"1.a.b");
      aver.isNotNull(got);
      aver.isNotNull( got.orig  );
      aver.isNotNull( got.root  );
      aver.isTrue   ( got.full  );
      aver.areEqual(567, got.value );
      aver.areEqual(567, got.result);
    });

    cs("([123, {a: {b: 567}, q: -9}, true],'1.z.b')",   function() {
      let obj = [123, {a: {b: 567}, q: -9}, true ];
      let got = sut.nav(obj,"1.z.b");
      aver.isNotNull(got);
      aver.isNotNull( got.orig  );
      aver.isNotNull( got.root  );
      aver.isFalse   ( got.full  );
      aver.areEqual(-9, got.value.q );
      aver.areEqual(undefined, got.result);
    });

    cs("([123, {a: {b: 567, xxx: -877}, q: -9}, true ],'1.a.z')",   function() {
      let obj = [123, {a: {b: 567, xxx: -877}, q: -9}, true ];
      let got = sut.nav(obj,"1.a.z");
      aver.isNotNull(got);
      aver.isNotNull( got.orig  );
      aver.isNotNull( got.root  );
      aver.isFalse   ( got.full  );
      aver.areEqual(-877, got.value.xxx );
      aver.areEqual(undefined, got.result);
    });

    cs("([123, {a: {b: 567, xxx: -877}, q: -9}, true ],'1.a.xxx')",   function() {
      let obj = [123, {a: {b: 567, xxx: -877}, q: -9}, true ];
      let got = sut.nav(obj,"1.a.xxx");
      aver.isNotNull(got);
      aver.isNotNull( got.orig  );
      aver.isNotNull( got.root  );
      aver.isTrue   ( got.full  );
      aver.areEqual(-877, got.value );
      aver.areEqual(-877, got.result);
    });


    cs("([123, [[567, 890],-40, -20, [1001, 1002]], true ],'1.0.1')",   function() {
      let obj = [123, [[567, 890],-40, -20, [1001, 1002]], true ];
      let got = sut.nav(obj,"1.0.1");
      aver.isNotNull(got);
      aver.isNotNull( got.orig  );
      aver.isNotNull( got.root  );
      aver.isTrue   ( got.full  );
      aver.areEqual(890, got.value );
      aver.areEqual(890, got.result);
    });

    cs("([123, [[567, 890],-40, -20, [1001, 1002]], true ],'1.0.111')",   function() {
      let obj = [123, [[567, 890],-40, -20, [1001, 1002]], true ];
      let got = sut.nav(obj,"1.0.111");
      aver.isNotNull(got);
      aver.isNotNull( got.orig  );
      aver.isNotNull( got.root  );
      aver.isFalse   ( got.full  );
      aver.areEqual(567, got.value[0] );
      aver.areEqual(undefined, got.result);
    });

    cs("([123, [[567, 890],-40, -20, [1001, 1002]], true ],'1.2')",   function() {
      let obj = [123, [[567, 890],-40, -20, [1001, 1002]], true ];
      let got = sut.nav(obj,"1.2");
      aver.isNotNull(got);
      aver.isNotNull( got.orig  );
      aver.isNotNull( got.root  );
      aver.isTrue   ( got.full  );
      aver.areEqual(-20, got.value );
      aver.areEqual(-20, got.result);
    });


    cs("simple [] path",   function() {
      let obj = {
        a: 2,
        b: true
      };

      let got1 = sut.nav(obj, ["a"]);
      aver.isNotNull(got1);
      aver.areEqual(obj, got1.orig  );
      aver.areEqual(obj, got1.root  );
      aver.isTrue(got1.full);
      aver.areEqual(2, got1.value  );

      let got2 = sut.nav(obj, ["b"]);
      aver.isNotNull(got2);
      aver.areEqual(obj, got2.orig  );
      aver.areEqual(obj, got2.root  );
      aver.isTrue(got2.full);
      aver.areEqual(true, got2.value  );
    });

    cs("simple string path",   function() {
      let obj = {
        a: 2,
        b: true
      };

      let got1 = sut.nav(obj, "a");
      aver.isNotNull(got1);
      aver.areEqual(obj, got1.orig  );
      aver.areEqual(obj, got1.root  );
      aver.isTrue(got1.full);
      aver.areEqual(2, got1.value  );

      let got2 = sut.nav(obj, "b");
      aver.isNotNull(got2);
      aver.areEqual(obj, got2.orig  );
      aver.areEqual(obj, got2.root  );
      aver.isTrue(got2.full);
      aver.areEqual(true, got2.value  );
    });


    cs("2 level object path",   function() {
      let obj = {
        a: {x: 2, y: 3},
        b: "Hello!"
      };

      let got1 = sut.nav(obj, "a.x");
      aver.isNotNull(got1);
      aver.areEqual(obj, got1.orig  );
      aver.areEqual(obj, got1.root  );
      aver.isTrue(got1.full);
      aver.areEqual(2, got1.value  );

      let got2 = sut.nav(obj, "a.y");
      aver.isNotNull(got2);
      aver.areEqual(obj, got2.orig  );
      aver.areEqual(obj, got2.root  );
      aver.isTrue(got2.full);
      aver.areEqual(3, got2.value  );

      let got3 = sut.nav(obj, "b");
      aver.isNotNull(got3);
      aver.areEqual(obj, got3.orig  );
      aver.areEqual(obj, got3.root  );
      aver.isTrue(got3.full);
      aver.areEqual("Hello!", got3.value  );
    });

    cs("2 level object path partial",   function() {
      let obj = {
        a: {x: 2, y: 3, q: 98},
        b: "Hello!"
      };

      let got = sut.nav(obj, "a.z");//there is no "z"
      aver.isNotNull(got);
      aver.areEqual(obj, got.orig  );
      aver.areEqual(obj, got.root  );
      aver.isFalse(got.full);
      aver.isObject( got.value  );
      aver.areEqual(98,  got.value.q  );
      aver.areEqual(undefined,  got.result  );
    });

    cs("3 level object path",   function() {
      let obj = {
        a: {x: 2, y: 3, q: { name: "abc", descr: "def" }},
        b: "Hello!"
      };

      let got = sut.nav(obj, "a.q.descr");
      aver.isNotNull(got);
      aver.areEqual(obj, got.orig  );
      aver.areEqual(obj, got.root  );
      aver.isTrue(got.full);
      aver.areEqual("def",  got.value  );
      aver.areEqual("def",  got.result );
    });

    cs("3 level object/array path",   function() {
      let obj = {
        a: [232, 323, { name: "abc", descr: "def123" }],
        b: "Hello!"
      };

      let got = sut.nav(obj, "a.2.descr");
      aver.isNotNull(got);
      aver.areEqual(obj, got.orig  );
      aver.areEqual(obj, got.root  );
      aver.isTrue(got.full);
      aver.areEqual("def123",  got.value  );
      aver.areEqual("def123",  got.result );
    });

    cs("3 level chain",   function() {
      let obj = {
        a: [232, 323, { name: "abc", descr: "def123" }],
        b: "Hello!"
      };

      let got = sut.nav(obj, "a")
        .nav("2")
        .nav("descr");

      aver.isNotNull(got);
      aver.areEqual(obj, got.orig  );
      aver.areEqual(obj.a[2], got.root  );
      aver.isTrue(got.full);
      aver.areEqual("def123",  got.value  );
      aver.areEqual("def123",  got.result  );
    });

    cs("inherit",   function() {

      function MyClass(a){ this.A = a; }
      MyClass.prototype = {B: {c: 1589, d: 2}};

      let obj = new MyClass(1234);

      let got = sut.nav(obj, "B.c");// B is inherited via prototype

      aver.isNotNull(got);
      aver.areEqual(obj, got.orig  );
      aver.areEqual(obj, got.root  );
      aver.isTrue(got.full);
      aver.areEqual(1589,  got.value  );
      aver.areEqual(1589,  got.result );
    });

    cs("inherit partial",   function() {

      function MyClass(a){ this.A = a; }
      MyClass.prototype = {B: {c: 1589, d: 2}};

      let obj = new MyClass(1234);

      let got = sut.nav(obj, "B.Z");// B is inherited via prototype

      aver.isNotNull(got);
      aver.areEqual(obj, got.orig  );
      aver.areEqual(obj, got.root  );
      aver.isFalse(got.full);
      aver.areEqual(1589,  got.value.c  );
      aver.areEqual(undefined,  got.result );
    });

  });

  unit("#mixin()", function() {
    cs("null for (undef, undef)",   function() { aver.isNull( sut.mixin(undefined));  });
    cs("null for (null, null)",   function() { aver.isNull( sut.mixin(null, null));  });
    cs("object for ({})",   function() { aver.isObject( sut.mixin({}) );  });
    cs("object for ({}, null)",   function() { aver.isObject( sut.mixin({}, null));  });


    cs("basically works",   function() {
      let a = {};
      let b = {d: 2, e: true};
      let c = sut.mixin(a, b);

      aver.areEqual(2,  c.d );
      aver.isTrue( c.e );
    });

    cs("overrides existing",   function() {
      let a = {d: 4};
      let b = {d: 2, e: true};
      let c = sut.mixin(a, b);

      aver.areEqual( 2, c.d );
      aver.isTrue( c.e );
    });

    cs("keeps existing",   function() {
      let a = {d: 4};
      let b = {d: 2, e: true};
      let c = sut.mixin(a, b, true);

      aver.areEqual(4, c.d );
      aver.isTrue( c.e );
    });


    cs("class this",   function() {
      let a = new aver.MockA(3, 4);
      let b = {d: 2, e: true};
      let c = sut.mixin(a, b);

      aver.areEqual(2, c.d );
      aver.isTrue( c.e );
    });


    cs("class prototype",   function() {

      function classX(){ this.z = 123; }

      let a = new classX();
      let b = {d: 2, e: true};
      sut.mixin(classX.prototype, b);


      aver.areEqual(123, a.z );
      aver.areEqual(2, a.d );
      aver.isTrue( a.e );
    });

  });


  unit("#asBool()", function() {
    cs("()",   function() { aver.areEqual( false, sut.asBool() );});
    cs("undefined",   function() { aver.areEqual( false, sut.asBool(undefined) );});
    cs("null",   function() { aver.areEqual( false, sut.asBool(null) );});

    cs("true",   function() { aver.areEqual( true, sut.asBool(true) );});
    cs("false",   function() { aver.areEqual( false, sut.asBool(false) );});

    cs("1",   function() { aver.areEqual( true, sut.asBool(1) );});
    cs("0",   function() { aver.areEqual( false, sut.asBool(0) );});

    cs("'1'",   function() { aver.areEqual( true, sut.asBool("1") );});
    cs("' 1'",   function() { aver.areEqual( true, sut.asBool(" 1   ") );});
    cs("ok",   function() { aver.areEqual( true, sut.asBool("  ok  ") );});
    cs("yes",   function() { aver.areEqual( true, sut.asBool("yes") );});
    cs("YES",   function() { aver.areEqual( true, sut.asBool("YES") );});
    cs("TrUE",   function() { aver.areEqual( true, sut.asBool("TrUE") );});

    function Custom(state){
      this.state = state;
      this[sut.AS_BOOLEAN_FUN] = function(){ return state; };
    }

    cs("Custom(true)",   function() { aver.areEqual( true, sut.asBool(new Custom(true)) );});
    cs("Custom(false)",   function() { aver.areEqual( false, sut.asBool(new Custom(false)) );});
    cs("Custom(undefined)",   function() { aver.areEqual( false, sut.asBool(new Custom(undefined)) );});

  });

  unit("#asTriBool()", function() {
    cs("()",   function() { aver.areEqual( undefined, sut.asTriBool() );});
    cs("undefined",   function() { aver.areEqual( undefined, sut.asTriBool(undefined) );});
    cs("null",   function() { aver.areEqual( false, sut.asTriBool(null) );});

    cs("true",   function() { aver.areEqual( true, sut.asTriBool(true) );});
    cs("false",   function() { aver.areEqual( false, sut.asTriBool(false) );});

    cs("1",   function() { aver.areEqual( true, sut.asTriBool(1) );});
    cs("0",   function() { aver.areEqual( false, sut.asTriBool(0) );});

    cs("'1'",   function() { aver.areEqual( true, sut.asTriBool("1") );});
    cs("' 1'",   function() { aver.areEqual( true, sut.asTriBool(" 1   ") );});
    cs("ok",   function() { aver.areEqual( true, sut.asTriBool("  ok  ") );});
    cs("yes",   function() { aver.areEqual( true, sut.asTriBool("yes") );});
    cs("YES",   function() { aver.areEqual( true, sut.asTriBool("YES") );});
    cs("TrUE",   function() { aver.areEqual( true, sut.asTriBool("TrUE") );});

    function Custom(state){
      this.state = state;
      this[sut.AS_BOOLEAN_FUN] = function(){ return state; };
    }

    cs("Custom(true)",   function() { aver.areEqual( true, sut.asTriBool(new Custom(true)) );});
    cs("Custom(false)",   function() { aver.areEqual( false, sut.asTriBool(new Custom(false)) );});
    cs("Custom(undefined)",   function() { aver.areEqual( undefined, sut.asTriBool(new Custom(undefined)) );});

  });


  unit("#classOf()", function() {
    cs("()",   function() { aver.areEqual( null, sut.classOf() );});
    cs("null",   function() { aver.areEqual( null, sut.classOf(null) );});
    cs("undef",   function() { aver.areEqual( null, sut.classOf(undefined) );});
    cs("123",   function() { aver.areEqual( null, sut.classOf(123) );});
    cs("str",   function() { aver.areEqual( null, sut.classOf(true) );});

    cs("[]",   function() { aver.areEqual( null, sut.classOf([]) );});

    cs("{}",   function() { aver.areEqual( Object, sut.classOf({ }) );});

    cs("MockA",   function() { aver.areEqual( aver.MockA, sut.classOf( new aver.MockA()) );});
    cs("MockB",   function() { aver.areEqual( aver.MockB, sut.classOf( new aver.MockB()) );});
    cs("MockBase",   function() { aver.areEqual( aver.MockBase, sut.classOf( new aver.MockBase()) );});

  });

  unit("#parentOfClass()", function() {
    cs("()",   function() { aver.areEqual( null, sut.parentOfClass() );});
    cs("null",   function() { aver.areEqual( null, sut.parentOfClass(null) );});
    cs("undef",   function() { aver.areEqual( null, sut.parentOfClass(undefined) );});
    cs("123",   function() { aver.areEqual( null, sut.parentOfClass(123) );});
    cs("bool",   function() { aver.areEqual( null, sut.parentOfClass(true) );});

    cs("[]",   function() { aver.areEqual( null, sut.parentOfClass([]) );});

    cs("{}",   function() { aver.areEqual( null, sut.parentOfClass({ }) );});

    cs("MockA",    function() { aver.areEqual( aver.MockBase, sut.parentOfClass( aver.MockA));});
    cs("MockB",    function() { aver.areEqual( aver.MockBase, sut.parentOfClass( aver.MockB)   );});
    cs("MockBC",    function() { aver.areEqual( aver.MockB, sut.parentOfClass( aver.MockBC)   );});
    cs("MockBase", function() { aver.areEqual( null, sut.parentOfClass( aver.MockBase)      );});

    cs("Chained",    function() { aver.areEqual( aver.MockBase, sut.parentOfClass(sut.parentOfClass( aver.MockBC))  );});
  });


  unit("#isSubclassOf()", function() {
    cs("()",   function() { aver.areEqual( false, sut.isSubclassOf() );});
    cs("null",   function() { aver.areEqual( false, sut.isSubclassOf(null) );});
    cs("undef",   function() { aver.areEqual( false, sut.isSubclassOf(undefined) );});
    cs("123",   function() { aver.areEqual( false, sut.isSubclassOf(123) );});
    cs("bool",   function() { aver.areEqual( false, sut.isSubclassOf(123, true) );});

    cs("MockA(MockBase)",    function() { aver.areEqual( true, sut.isSubclassOf( aver.MockA, aver.MockBase));});
    cs("MockBase(MockA)",    function() { aver.areEqual( false, sut.isSubclassOf( aver.MockBase, aver.MockA));});

    cs("MockA(MockA)",    function() { aver.areEqual( false, sut.isSubclassOf( aver.MockA, aver.MockA));});
    cs("MockA(object)",    function() { aver.areEqual( true, sut.isSubclassOf( aver.MockA, Object));});
    cs("MockB(object)",    function() { aver.areEqual( true, sut.isSubclassOf( aver.MockB, Object));});
    cs("MockBC(object)",    function() { aver.areEqual( true, sut.isSubclassOf( aver.MockBC, Object));});

    cs("MockA(MockB)",    function() { aver.areEqual( false, sut.isSubclassOf( aver.MockA, aver.MockB));});
    cs("MockB(MockA)",    function() { aver.areEqual( false, sut.isSubclassOf( aver.MockB, aver.MockA));});


    cs("MockB(MockBase)",    function() { aver.areEqual( true, sut.isSubclassOf( aver.MockB, aver.MockBase));});
    cs("MockBC(MockBase)",    function() { aver.areEqual( true, sut.isSubclassOf( aver.MockBC, aver.MockBase));});
    cs("MockBC(MockB)",    function() { aver.areEqual( true, sut.isSubclassOf( aver.MockBC, aver.MockB));});

    cs("MockBase(MockB)",    function() { aver.areEqual( false, sut.isSubclassOf(aver.MockBase, aver.MockB ));});
    cs("MockBase(MockBC)",    function() { aver.areEqual( false, sut.isSubclassOf(aver.MockBase, aver.MockBC) );});
    cs("MockB(MockBC)",    function() { aver.areEqual( false, sut.isSubclassOf( aver.MockB, aver.MockBC));});
  });


  unit("#isEmptyIterable()", function() {
    cs("()",    function()    { aver.isTrue( sut.isEmptyIterable() );});
    cs("null",  function()  { aver.isTrue( sut.isEmptyIterable(null) );});
    cs("undef", function() { aver.isTrue(  sut.isEmptyIterable(undefined) );});
    cs("123",   function()   { aver.isTrue( sut.isEmptyIterable(123) );});
    cs("bool",  function()   { aver.isTrue( sut.isEmptyIterable(true) );});

    cs("[]",    function() { aver.isTrue( sut.isEmptyIterable([]) );});

    cs("{}",    function() { aver.isTrue( sut.isEmptyIterable({ }) );});

    cs("[1]",      function() { aver.isFalse( sut.isEmptyIterable([1]) );});
    cs("Set(123)", function() { aver.isFalse( sut.isEmptyIterable(new Set([1,2,3])) );});
  });

  unit("#isNonEmptyString()", function() {
    cs("()",    function()  { aver.isFalse( sut.isNonEmptyString() );});
    cs("null",  function()  { aver.isFalse( sut.isNonEmptyString(null) );});
    cs("undef", function()  { aver.isFalse(  sut.isNonEmptyString(undefined) );});
    cs("123",   function()  { aver.isFalse( sut.isNonEmptyString(123) );});
    cs("bool",  function()  { aver.isFalse( sut.isNonEmptyString(true) );});

    cs("'          '",  function()  { aver.isFalse( sut.isNonEmptyString("          ") );});
    cs("'  \\r \\n '",  function()  { aver.isFalse( sut.isNonEmptyString("  \r  \n  ") );});
    cs("'aaa'",    function() { aver.isTrue( sut.isNonEmptyString("aaaa") );});
  });


  unit("#asCharCase", function() {
    cs("()",      function()  { aver.areEqual(sut.CHAR_CASE.ASIS,  sut.asCharCase() );});
    cs("(undef)", function()  { aver.areEqual(sut.CHAR_CASE.ASIS,  sut.asCharCase(undefined) );});
    cs("(null)",  function()  { aver.areEqual(sut.CHAR_CASE.ASIS,  sut.asCharCase(null) );});
    cs("(upper)", function()  { aver.areEqual(sut.CHAR_CASE.UPPER,  sut.asCharCase("UppEr") );});
  });

  unit("#asDataKind", function() {
    cs("()",      () =>  aver.areEqual(sut.DATA_KIND.TEXT,  sut.asDataKind())  );
    cs("(undef)", () =>  aver.areEqual(sut.DATA_KIND.TEXT,  sut.asDataKind(undefined)) );
    cs("(null)",  () =>  aver.areEqual(sut.DATA_KIND.TEXT,  sut.asDataKind(null)) );
    cs("(email)", () =>  aver.areEqual(sut.DATA_KIND.EMAIL, sut.asDataKind("EMaIL")) );
  });


  unit("#asTypeMoniker", function() {
    cs("()",      () =>  aver.areEqual(sut.TYPE_MONIKER.STRING,  sut.asTypeMoniker())  );
    cs("(undef)", () =>  aver.areEqual(sut.TYPE_MONIKER.STRING,  sut.asTypeMoniker(undefined)) );
    cs("(null)",  () =>  aver.areEqual(sut.TYPE_MONIKER.STRING,  sut.asTypeMoniker(null)) );
    cs("(int)", () =>  aver.areEqual(sut.TYPE_MONIKER.INT, sut.asTypeMoniker("iNT")) );
    cs("(object)", () =>  aver.areEqual(sut.TYPE_MONIKER.OBJECT, sut.asTypeMoniker("ObjECT")) );
  });


  unit("#asInt()", function() {
    cs("()",   function() { aver.areEqual( 0, sut.asInt() );});
    cs("undefined",   function() { aver.areEqual( 0, sut.asInt(undefined) );});
    cs("undefined canUndef",   function() { aver.areEqual( undefined, sut.asInt(undefined, true) );});
    cs("null",   function() { aver.areEqual( 0, sut.asInt(null) );});

    cs("true = 1 ",   function() { aver.areEqual( 1, sut.asInt(true) );});
    cs("false = 0 ",   function() { aver.areEqual( 0, sut.asInt(false) );});

    cs("1",   function() { aver.areEqual( 1, sut.asInt(1) );});
    cs("0",   function() { aver.areEqual( 0, sut.asInt(0) );});
    cs("-7",   function() { aver.areEqual( -7, sut.asInt(-7) );});

    cs("'1'",   function() { aver.areEqual( 1, sut.asInt("1") );});
    cs("'0'",   function() { aver.areEqual( 0, sut.asInt("0") );});
    cs("'-7'",   function() { aver.areEqual( -7, sut.asInt("-7") );});

    cs("1.23 = 1",   function() { aver.areEqual( 1, sut.asInt(1.23) );});
    cs("0.99 = 0",   function() { aver.areEqual( 0, sut.asInt(0.99) );});
    cs("-7.97 = -7",   function() { aver.areEqual( -7, sut.asInt(-7.97) );});

    cs("'1.23' = 1",   function() { aver.areEqual( 1, sut.asInt("1.23") );});
    cs("'0.99' = 0",   function() { aver.areEqual( 0, sut.asInt("0.99") );});
    cs("'-7.97' = -7",   function() { aver.areEqual( -7, sut.asInt("-7.97") );});

    cs("'2gaga' throws",   function() { aver.throws( function(){  sut.asInt("2gaga"); }, "Cast error");});

    cs("'0x2a' = 42",   function() { aver.areEqual( 42,  sut.asInt("0x2a") ); });
    cs("' 0x2a ' = 42",   function() { aver.areEqual( 42,  sut.asInt(" 0x2a ") ); });
    cs("' 0xFAcaCA ' = 16435914",   function() { aver.areEqual( 16435914,  sut.asInt(" 0xFAcaCA ") ); });

    cs("'0x' throws",   function() { aver.throws( function(){  sut.asInt("0x"); }, "Cast error");});
    cs("'2a' throws",   function() { aver.throws( function(){  sut.asInt("2a"); }, "Cast error");});
    cs("'0x2Z' throws",   function() { aver.throws( function(){  sut.asInt("0x2z"); }, "Cast error");});
    cs("'0xZ2' throws",   function() { aver.throws( function(){  sut.asInt("0xZ2"); }, "Cast error");});

    cs("'0b' throws",   function() { aver.throws( function(){  sut.asInt("0b"); }, "Cast error");});
    cs("'0b10' = 2",   function() { aver.areEqual( 2,  sut.asInt("0b10") ); });
    cs("' 0b11 ' = 3",   function() { aver.areEqual( 3,  sut.asInt(" 0b11 ") ); });
    cs("' 0b11110000 ' = 240",   function() { aver.areEqual( 240,  sut.asInt(" 0b11110000 ") ); });

    cs("'0b21' throws",   function() { aver.throws( function(){  sut.asInt("0b21"); }, "Cast error");});
    cs("'0b1Z' throws",   function() { aver.throws( function(){  sut.asInt("0b1Z"); }, "Cast error");});



    cs("'-7e3' = -7000",   function() { aver.areEqual( -7000, sut.asInt("-7e3") );});
    cs("'-7e-3' = 0",   function() { aver.areEqual( 0, sut.asInt("-7e-3") );});
    cs("'-7e--3' throws",   function() { aver.throws( function(){  sut.asInt("-7e--3"); }, "Cast error");});

    cs("'+7e3' = 7000",   function() { aver.areEqual( 7000, sut.asInt("+7e3") );});
    cs("'++7e3' throws",   function() { aver.throws( function(){  sut.asInt("++7e3"); }, "Cast error");});

    cs("'2..3' throws",   function() { aver.throws( function(){  sut.asInt("2..3"); }, "Cast error");});
    cs("'2-3' throws",   function() { aver.throws( function(){  sut.asInt("2-3"); }, "Cast error");});

    cs("Date(123)",   function() { aver.areEqual( 123, sut.asInt(new Date(123)) );});

    function Custom(state){
      this.state = state;
      this[sut.AS_INTEGER_FUN] = function(){ return state; };
    }

    cs("Custom(12)",   function() { aver.areEqual( 12, sut.asInt(new Custom(12)) );});
    cs("Custom(-800)",   function() { aver.areEqual( -800, sut.asInt(new Custom(-800)) );});

    cs("Custom('12')",   function() { aver.areEqual( 12, sut.asInt(new Custom("12")) );});
    cs("Custom('-800')",   function() { aver.areEqual( -800, sut.asInt(new Custom("-800.999")) );});
    cs("Custom(undefined)",   function() { aver.areEqual( 0, sut.asInt(new Custom(undefined)) );});
    cs("Custom(undefined) canUndef",   function() { aver.areEqual( undefined, sut.asInt(new Custom(undefined), true) );});

  });

  unit("#asReal()", function() {
    cs("()",   function() { aver.areEqual( 0, sut.asReal() );});
    cs("undefined",   function() { aver.areEqual( 0, sut.asReal(undefined) );});
    cs("undefined canUndef",   function() { aver.areEqual( undefined, sut.asReal(undefined, true) );});
    cs("null",   function() { aver.areEqual( 0, sut.asReal(null) );});

    cs("true = 1 ",   function() { aver.areEqual( 1, sut.asReal(true) );});
    cs("false = 0 ",   function() { aver.areEqual( 0, sut.asReal(false) );});

    cs("1",   function() { aver.areEqual( 1, sut.asReal(1) );});
    cs("0",   function() { aver.areEqual( 0, sut.asReal(0) );});
    cs("-7",   function() { aver.areEqual( -7, sut.asReal(-7) );});

    cs("'1'",   function() { aver.areEqual( 1, sut.asReal("1") );});
    cs("'0'",   function() { aver.areEqual( 0, sut.asReal("0") );});
    cs("'-7'",   function() { aver.areEqual( -7, sut.asReal("-7") );});


    cs("1.23 = 1.23",   function() { aver.areEqual( 1.23, sut.asReal(1.23) );});
    cs("0.99 = 0.99",   function() { aver.areEqual( 0.99, sut.asReal(0.99) );});
    cs("-7.97 = -7.97",   function() { aver.areEqual( -7.97, sut.asReal(-7.97) );});

    cs("'1.23' = 1.23",   function() { aver.areEqual( 1.23, sut.asReal("1.23") );});
    cs("'0.99' = 0.99",   function() { aver.areEqual( 0.99, sut.asReal("0.99") );});
    cs("'-7.97' = -7.97",   function() { aver.areEqual( -7.97, sut.asReal("-7.97") );});


    cs("'2gaga' throws",   function() { aver.throws( function(){  sut.asReal("2gaga"); }, "Cast error");});


    cs("'-7e3' = -7000",   function() { aver.areEqual( -7000, sut.asReal("-7e3") );});
    cs("'-7e-3' = -0.007",   function() { aver.areEqual( -0.007, sut.asReal("-7e-3") );});
    cs("'+7e-3' = 0.007",   function() { aver.areEqual( 0.007, sut.asReal("7e-3") );});
    cs("'-7e--3' throws",   function() { aver.throws( function(){  sut.asReal("-7e--3"); }, "Cast error");});

    cs("'+7e3' = 7000",   function() { aver.areEqual( 7000, sut.asReal("+7e3") );});
    cs("'++7e3' throws",   function() { aver.throws( function(){  sut.asReal("++7e3"); }, "Cast error");});

    cs("'2..3' throws",   function() { aver.throws( function(){  sut.asReal("2..3"); }, "Cast error");});
    cs("'2-3' throws",   function() { aver.throws( function(){  sut.asReal("2-3"); }, "Cast error");});


    cs("Date(123)",   function() { aver.areEqual( 123, sut.asReal(new Date(123)) );});

  });

  unit("#asMoney()", function() {
    cs("()",   function() { aver.areEqual( 0, sut.asMoney() );});
    cs("undefined",   function() { aver.areEqual( 0, sut.asMoney(undefined) );});
    cs("undefined canUndef",   function() { aver.areEqual( undefined, sut.asMoney(undefined, true) );});
    cs("null",   function() { aver.areEqual( 0, sut.asMoney(null) );});

    cs("true = 1 ",   function() { aver.areEqual( 1, sut.asMoney(true) );});
    cs("false = 0 ",   function() { aver.areEqual( 0, sut.asMoney(false) );});

    cs("1",   function() { aver.areEqual( 1, sut.asMoney(1) );});
    cs("0",   function() { aver.areEqual( 0, sut.asMoney(0) );});
    cs("-7",   function() { aver.areEqual( -7, sut.asMoney(-7) );});

    cs("'1'",   function() { aver.areEqual( 1, sut.asMoney("1") );});
    cs("'0'",   function() { aver.areEqual( 0, sut.asMoney("0") );});
    cs("'-7'",   function() { aver.areEqual( -7, sut.asMoney("-7") );});

    cs("1.23 = 1.23",   function() { aver.areEqual( 1.23, sut.asMoney(1.23) );});
    cs("0.99 = 0.99",   function() { aver.areEqual( 0.99, sut.asMoney(0.99) );});
    cs("-7.97 = -7.97",   function() { aver.areEqual( -7.97, sut.asMoney(-7.97) );});

    cs("'1.23' = 1.23",   function() { aver.areEqual( 1.23, sut.asMoney("1.23") );});
    cs("'0.99' = 0.99",   function() { aver.areEqual( 0.99, sut.asMoney("0.99") );});
    cs("'-7.97' = -7.97",   function() { aver.areEqual( -7.97, sut.asMoney("-7.97") );});


    cs("'2gaga' throws",   function() { aver.throws( function(){  sut.asMoney("2gaga"); }, "Cast error");});


    cs("'-7e3' = -7000",   function() { aver.areEqual( -7000, sut.asMoney("-7e3") );});
    cs("'-12345e-5' = -0.1234",   function() { aver.areEqual( -0.1234, sut.asMoney("-12345e-5") );});
    cs("'+7e-3' = 0.007",   function() { aver.areEqual( 0.007, sut.asMoney("7e-3") );});
    cs("'+7e-5' = 0",   function() { aver.areEqual( 0, sut.asMoney("7e-5") );});
    cs("'-7e--3' throws",   function() { aver.throws( function(){  sut.asMoney("-7e--3"); }, "Cast error");});

    cs("'+7e3' = 7000",   function() { aver.areEqual( 7000, sut.asMoney("+7e3") );});
    cs("'++7e3' throws",   function() { aver.throws( function(){  sut.asMoney("++7e3"); }, "Cast error");});

    cs("'2..3' throws",   function() { aver.throws( function(){  sut.asMoney("2..3"); }, "Cast error");});
    cs("'2-3' throws",   function() { aver.throws( function(){  sut.asMoney("2-3"); }, "Cast error");});


    cs("Date(123)",   function() { aver.areEqual( 123, sut.asMoney(new Date(123)) );});

    cs("45/8.17 = 5.5079(55936...)",   function() { aver.areEqual( 5.5079, sut.asMoney(45/8.17) );});

    cs("10/3 = 3.3333(3333333...)",   function() { aver.areEqual( 3.3333, sut.asMoney(10/3) );});

    cs("10/2.876 = 3.4770(5146....)",   function() { aver.areEqual( 3.4770, sut.asMoney(10/2.876) );});
  });


  unit("#asDate()", function() {

    const ZERO = new Date(0);

    cs("()",   function() { aver.areEqualValues( ZERO, sut.asDate() );});
    cs("undefined",   function() { aver.areEqualValues( ZERO, sut.asDate(undefined) );});
    cs("undefined canUndef",   function() { aver.areEqualValues( undefined, sut.asDate(undefined, true) );});
    cs("null",   function() { aver.areEqualValues( ZERO, sut.asDate(null) );});

    cs("true throws",   function() { aver.throws( function(){  sut.asDate(true); }, "Cast error");});
    cs("false throws",   function() { aver.throws( function(){  sut.asDate(false); }, "Cast error");});

    cs("1",   function() { aver.areEqualValues( new Date(1), sut.asDate(1) );});
    cs("0",   function() { aver.areEqualValues( ZERO, sut.asDate(0) );});
    cs("-7",   function() { aver.areEqualValues( new Date(-7), sut.asDate(-7) );});

    cs("'1'",   function() { aver.areEqualValues( new Date(1), sut.asDate("1") );});
    cs("'0'",   function() { aver.areEqualValues( ZERO, sut.asDate("0") );});
    cs("'-7'",   function() { aver.areEqualValues( new Date(-7), sut.asDate("-7") );});

    cs("April 12, 2012",   function() {
      const d = sut.asDate(" April 12, 2012");
      aver.areEqual( 3, d.getMonth() );
      aver.areEqual( 12, d.getDate() );
      aver.areEqual( 2012, d.getFullYear() );
    });

    cs("2024-12-31T00:00:00+00:00 !fromUTC", function() {
      const d = sut.asDate("2024-12-31T00:00:00Z", false);
      aver.areEqual(11, d.getUTCMonth());
      aver.areEqual(31, d.getUTCDate());
      aver.areEqual(2024, d.getUTCFullYear());
      aver.areEqual(0, d.getUTCHours());
      aver.areEqual(0, d.getUTCMinutes());
      aver.areEqual(0, d.getUTCSeconds());
      aver.areEqual(0, d.getUTCMilliseconds());
    });

    cs("abrakadabra throws",   function() { aver.throws( function(){  sut.asDate("abrakadabra"); }, "Cast error");});
  });


  unit("#asObject()", function() {

    cs("()",   function() { aver.areEqualValues( null, sut.asObject() );});
    cs("undefined",   function() { aver.areEqualValues( null, sut.asObject(undefined) );});
    cs("undefined canUndef",   function() { aver.areEqualValues( undefined, sut.asObject(undefined, true) );});
    cs("null",   function() { aver.areEqualValues( null, sut.asObject(null) );});

    cs("true throws",   function() { aver.throws( function(){  sut.asObject(true); }, "Cast error");});
    cs("false throws",   function() { aver.throws( function(){  sut.asObject(false); }, "Cast error");});

    cs("1 throws",   function() { aver.throws( function(){  sut.asObject(1); }, "Cast error");});
    cs("'1' throws",   function() { aver.throws( function(){  sut.asObject("1"); }, "Cast error");});

    cs("[] throws",   function() { aver.throws( function(){  sut.asObject([]); }, "Cast error");});
    cs("'[]' throws",   function() { aver.throws( function(){  sut.asObject("[]"); }, "Cast error");});

    cs("{}",   function() { aver.isObject( sut.asObject({})  );});
    cs("'{}'",   function() { aver.isObject( sut.asObject("{}")  );});

    cs("{a: 1, b: 234, c: true, d: [7,8,9]}",   function() {
      const o = sut.asObject({a: 1, b: 234, c: true, d: [7,8,9]});
      aver.isObject( o );
      aver.areEqual(1, o.a);
      aver.areEqual(234, o.b);
      aver.areEqual(true, o.c);
      aver.areArraysEquivalent([7,8,9], o.d);
    });

    cs("'{a: 1, b: 234, c: true, d: [7,8,9]}'",   function() {
      const o = sut.asObject("{\"a\": 1, \"b\": 234, \"c\": true, \"d\": [7,8,9]}");
      aver.isObject( o );
      aver.areEqual(1, o.a);
      aver.areEqual(234, o.b);
      aver.areEqual(true, o.c);
      aver.areArraysEquivalent([7,8,9], o.d);
    });

    cs("'{a: 2...' throws",   function() { aver.throws( function(){  sut.asObject("{\"a\": 2..."); }, "Cast error");});
  });

  unit("#asArray()", function() {

    cs("()",   function() { aver.areEqualValues( null, sut.asArray() );});
    cs("undefined",   function() { aver.areEqualValues( null, sut.asArray(undefined) );});
    cs("undefined canUndef",   function() { aver.areEqualValues( undefined, sut.asArray(undefined, true) );});
    cs("null",   function() { aver.areEqualValues( null, sut.asArray(null) );});

    cs("true throws",   function() { aver.throws( function(){  sut.asArray(true); }, "Cast error");});
    cs("false throws",   function() { aver.throws( function(){  sut.asArray(false); }, "Cast error");});

    cs("1 throws",   function() { aver.throws( function(){  sut.asArray(1); }, "Cast error");});
    cs("'1' throws",   function() { aver.throws( function(){  sut.asArray("1"); }, "Cast error");});

    cs("{} throws",   function() { aver.throws( function(){  sut.asArray({}); }, "Cast error");});
    cs("'{}' throws",   function() { aver.throws( function(){  sut.asArray("{}"); }, "Cast error");});

    cs("[]",   function() { aver.areArraysEquivalent([], sut.asArray([])  );});
    cs("'[]'",   function() { aver.areArraysEquivalent([], sut.asArray("[]")  );});

    cs("[1, -2, 3, true, 'abc']",   function() {
      const a = sut.asArray([1, -2, 3, true, "abc"]);
      aver.isArray( a );
      aver.areArraysEquivalent([1,-2,3,true,"abc"], a);
    });

    cs("'[1, -2, 3, true, \"abc\"]'",   function() {
      const a = sut.asArray("[1, -2, 3, true, \"abc\"]");
      aver.isArray( a );
      aver.areArraysEquivalent([1,-2,3,true,"abc"], a);
    });

    cs("'[1, 2...' throws",   function() { aver.throws( function(){  sut.asArray("{1, 2..."); }, "Cast error");});

    function Custom(){
      this[Symbol.iterator] =  function*(){
        yield 1;
        yield -2;
        yield 99;
      };
    }

    cs("Custom Iterator",   function() {
      const src = new Custom();
      const a = sut.asArray( src );
      aver.isArray( a );
      aver.areArraysEquivalent([1, -2, 99], a);
    });

  });


  unit("#cast()", function() {

    cs("()",   function() { aver.throws( function(){  sut.cast(); }, "missing 2");});

    cs("(undefined, string, false)",   function() { aver.areEqual("", sut.cast(undefined, sut.TYPE_MONIKER.STRING) );});
    cs("(undefined, string, true)",   function() { aver.areEqual(undefined, sut.cast(undefined, sut.TYPE_MONIKER.STRING, true) );});

    cs("(3, string)",   function() { aver.areEqual("3", sut.cast(3, sut.TYPE_MONIKER.STRING) );});
    cs("(true, string)",   function() { aver.areEqual("true", sut.cast(true, sut.TYPE_MONIKER.STRING) );});

    cs("(true, bool)",   function() { aver.areEqual(true, sut.cast("true", sut.TYPE_MONIKER.BOOL) );});
    cs("(undefined, bool, false)",   function() { aver.areEqual(false, sut.cast(undefined, sut.TYPE_MONIKER.BOOL) );});
    cs("(undefined, bool, true)",   function() { aver.areEqual(undefined, sut.cast(undefined, sut.TYPE_MONIKER.BOOL, true) );});


    cs("(-7, int)",   function() { aver.areEqual(-7, sut.cast("-7", sut.TYPE_MONIKER.INT) );});

    cs("(-7.89, real)",   function() { aver.areEqual(-7.89, sut.cast("-7.89", sut.TYPE_MONIKER.REAL) );});

    cs("(-7.7899, money)",   function() { aver.areEqual(-7.7899, sut.cast("-7.78999999999", sut.TYPE_MONIKER.MONEY) );});

    cs("(Jan 1 1980, date)",   function() { aver.areEqual(1980, sut.cast("Jan 1 1980", sut.TYPE_MONIKER.DATE).getFullYear() );});

    cs("([1,2,3], array)",   function() { aver.areArraysEquivalent([1,2,3], sut.cast("[1,2,3]", sut.TYPE_MONIKER.ARRAY) );});


    cs("(set, array)",   function() {
      let s = new Set();
      s.add(100);
      s.add(-10);
      s.add(true);
      aver.areArraysEquivalent([100,-10,true], sut.cast(s, sut.TYPE_MONIKER.ARRAY) );
    });


    cs("({a: 1, b:2}, array)",   function() { aver.areEqual(2, sut.cast("{\"a\": 1, \"b\": 2}", sut.TYPE_MONIKER.OBJECT).b );});
  });

  unit("#getRndBytes()", function() {

    cs("default",   function() {

      for(let i=0; i<10;i++){
        let got = sut.getRndBytes(16);
        console.log(strings.bufToHex(got));
      }
    });

    cs("()",   function() { aver.areEqual(16, sut.getRndBytes().length) });
    cs("(0)",   function() { aver.areEqual(16, sut.getRndBytes(0).length) });
    cs("('-1')",   function() { aver.areEqual(16, sut.getRndBytes("-1").length) });

    cs("dispersion",   function() {
      const got = sut.getRndBytes(256);
      const unique = got.filter((v,i,s) => s.indexOf(v) === i);
      //console.info(got);
      //console.info(unique);
      const dispersion = unique.length / got.length;
      console.info(`Dispersion: ${dispersion}%`);
      aver.isTrue(dispersion > 0.5379);//53%+ are distinct
    });

  });//getRndBytes

  unit("#genGuid()", function() {

    cs("default",   function() {

      for(let i=0; i<10;i++){
        let got = sut.genGuid();
        console.log(got);
      }
    });
    cs("()",   function() { aver.throws( function(){  sut.cast(); }, "missing 2");});

  });//genGuid

  unit("MinMaxBetween", function() {

    cs("atMin(123.45, 10)",   function() { aver.areEqual(123.45, sut.atMin(123.45, 10));  });
    cs("atMin(-10, 0)",   function() { aver.areEqual(0, sut.atMin(-10, 0));  });

    cs("atMax(123.45, 10)",   function() { aver.areEqual(10, sut.atMax(123.45, 10));  });
    cs("atMax(-10, 0)",   function() { aver.areEqual(-10, sut.atMax(-10, 0));  });

    cs("keepBetween(15, -10, 0)",   function() { aver.areEqual(0, sut.keepBetween(15, -10, 0));  });
    cs("keepBetween(-18, -10, 0)",   function() { aver.areEqual(-10, sut.keepBetween(-18, -10, 0));  });
    cs("keepBetween(0.1, -10, 0)",   function() { aver.areEqual(0, sut.keepBetween(0.1, -10, 0));  });

  });//MinMaxBetween

  unit("trimUri", function() {

    cs("trimUri(undefined, true)",   function() { aver.areEqual(undefined, sut.trimUri(undefined, false, false, true));  });
    cs("trimUri(undefined, false)",   function() { aver.areEqual("", sut.trimUri(undefined, false, false, false));  });

    cs("trimUri(1)",   function() { aver.areEqual("ok", sut.trimUri(" ok "));  });
    cs("trimUri(2)",   function() { aver.areEqual("/ ok/", sut.trimUri(" / ok/ "));  });
    cs("trimUri(3)",   function() { aver.areEqual("/ok", sut.trimUri(" ok ", true));  });
    cs("trimUri(4)",   function() { aver.areEqual("ok/", sut.trimUri("  ok ", false, true));  });

    cs("trimUri(5)",   function() { aver.areEqual("/ok/", sut.trimUri(" /ok/", true));  });
    cs("trimUri(6)",   function() { aver.areEqual("/ok/", sut.trimUri("  /ok/ ", false, true));  });
    cs("trimUri(7)",   function() { aver.areEqual("/ok/", sut.trimUri("  ok ", true, true));  });


  });//MinMaxBetween

  unit("TimeSpanBetween", function () {
    cs("hoursBetween()", function () {
      const a = new Date(2024, 10, 15, 10, 0, 0, 0);
      const b = new Date(2024, 10, 15, 15, 0, 0, 0);
      aver.areEqual(sut.hoursBetween(a, b), 5);
      aver.areEqual(sut.hoursBetween(b, a), -5);
      aver.areEqual(sut.hoursBetweenAbs(b, a), 5);
    });

    cs("minutesBetween()", function () {
      const a = new Date(2024, 10, 15, 10, 0, 0, 0);
      const b = new Date(2024, 10, 15, 10, 5, 0, 0);
      aver.areEqual(sut.minutesBetween(a, b), 5);
      aver.areEqual(sut.minutesBetween(b, a), -5);
      aver.areEqual(sut.minutesBetweenAbs(b, a), 5);
    });

    cs("secondsBetween()", function () {
      const a = new Date(2024, 10, 15, 10, 0, 0, 0);
      const b = new Date(2024, 10, 15, 10, 0, 5, 0);
      aver.areEqual(sut.secondsBetween(a, b), 5);
      aver.areEqual(sut.secondsBetween(b, a), -5);
      aver.areEqual(sut.secondsBetweenAbs(b, a), 5);
    });
  });


});
