/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

//import { describe, it } from "mocha";
import { defineUnit as unit, defineCase as cs } from "../run.js";
import * as sut from "../linq.js";
import * as aver from "../aver.js";
import * as types from "../types.js";

unit("LINQ", function() {


  unit("#iteration", function() {
    cs("root single",   function() {
      let a = [1,2,3];

      let q = sut.$(a);

      let iterator = q[Symbol.iterator]();

      let entry = iterator.next();

      aver.isFalse(entry.done);
      aver.areEqual(1, entry.value);

      entry = iterator.next();
      aver.isFalse(entry.done);
      aver.areEqual(2, entry.value);

      entry = iterator.next();
      aver.isFalse(entry.done);
      aver.areEqual(3, entry.value);

      entry = iterator.next();
      aver.isTrue(entry.done);
      aver.areEqual(undefined, entry.value);
    });

    cs("toArray single",   function() {
      let a = [1,2,3];

      let q = sut.$(a).toArray();

      let iterator = q[Symbol.iterator]();

      let entry = iterator.next();

      aver.isFalse(entry.done);
      aver.areEqual(1, entry.value);

      entry = iterator.next();
      aver.isFalse(entry.done);
      aver.areEqual(2, entry.value);

      entry = iterator.next();
      aver.isFalse(entry.done);
      aver.areEqual(3, entry.value);

      entry = iterator.next();
      aver.isTrue(entry.done);
      aver.areEqual(undefined, entry.value);
    });

    cs("toArray multiple",   function() {
      let a = [1,2,3];

      let q = sut.$(a).toArray();

      let iterator1 = q[Symbol.iterator]();
      let iterator2 = q[Symbol.iterator]();

      let entry1 = iterator1.next();
      let entry2 = iterator2.next();

      aver.isFalse(entry1.done);
      aver.areEqual(1, entry1.value);

      aver.isFalse(entry2.done);
      aver.areEqual(1, entry2.value);


      entry1 = iterator1.next();
      entry2 = iterator2.next();
      entry2 = iterator2.next();

      aver.isFalse(entry1.done);
      aver.areEqual(2, entry1.value);
      aver.isFalse(entry2.done);
      aver.areEqual(3, entry2.value);

      entry1 = iterator1.next();
      entry2 = iterator2.next();

      aver.isFalse(entry1.done);
      aver.areEqual(3, entry1.value);
      aver.isTrue(entry2.done);
      aver.areEqual(undefined, entry2.value);
    });

    cs("select single",   function() {
      let a = [1,2,3];

      let q = sut.$(a).select(e => e*10);

      let iterator = q[Symbol.iterator]();

      let entry = iterator.next();

      aver.isFalse(entry.done);
      aver.areEqual(10, entry.value);

      entry = iterator.next();
      aver.isFalse(entry.done);
      aver.areEqual(20, entry.value);

      entry = iterator.next();
      aver.isFalse(entry.done);
      aver.areEqual(30, entry.value);

      entry = iterator.next();
      aver.isTrue(entry.done);
      aver.areEqual(undefined, entry.value);
    });

    cs("select multiple",   function() {
      let a = [1,2,3];

      let q = sut.$(a).select(e => e*10);

      let iterator1 = q[Symbol.iterator]();
      let iterator2 = q[Symbol.iterator]();

      let entry1 = iterator1.next();
      let entry2 = iterator2.next();

      aver.isFalse(entry1.done);
      aver.areEqual(10, entry1.value);

      aver.isFalse(entry2.done);
      aver.areEqual(10, entry2.value);


      entry1 = iterator1.next();
      entry2 = iterator2.next();
      entry2 = iterator2.next();

      aver.isFalse(entry1.done);
      aver.areEqual(20, entry1.value);
      aver.isFalse(entry2.done);
      aver.areEqual(30, entry2.value);

      entry1 = iterator1.next();
      entry2 = iterator2.next();

      aver.isFalse(entry1.done);
      aver.areEqual(30, entry1.value);
      aver.isTrue(entry2.done);
      aver.areEqual(undefined, entry2.value);
    });

  });


  unit("#select()", function() {
    cs("1",   function() {
      let a = [1,2,3,4,5];
      let q = sut.$(a).select(e => e*10).toArray();
      aver.areArraysEquivalent([10,20,30,40,50], q);
    });

  });

  unit("#select-where()", function() {
    cs("1",   function() {
      let a = [1,2,3,4,5];
      let q = sut.$(a).select(e => e*10).where(e => e>30).toArray();
      aver.areArraysEquivalent([40,50], q);
    });

  });

  unit("#count()", function() {

    cs("empty",   function() {
      aver.areEqual( 0, sut.$().count() );
      aver.areEqual( 0, sut.$(undefined).count() );
      aver.areEqual( 0, sut.$(null).count() );
      aver.areEqual( 0, sut.$([]).count() );
      aver.areEqual( 0, sut.$([1,2,3].filter(e=> e<0)).count() );
    });


    cs("root",   function() {
      let a = [1,2,3,4,5];
      let cnt = sut.$(a).count();
      aver.areEqual( 5, cnt);
    });

    cs("select",   function() {
      let a = [1,2,3,4,5];
      let cnt = sut.$(a).select(e => e*10).count();
      aver.areEqual(5, cnt);
    });

    cs("select+filter",   function() {
      let a = [1,2,3,4,5];
      let cnt = sut.$(a).select(e => e*10).count(e => e>30);
      aver.areEqual( 2, cnt);
    });

    cs("select+where+filter",   function() {
      let a = [1,2,3,4,5];
      let cnt = sut.$(a).select(e => e*10).where(e => e>40).count(e => e>30);
      aver.areEqual( 1, cnt);
    });

    cs("mixed",   function() {
      let a = [1,2,3,4,5];
      aver.areEqual(1, sut.$(a).select(e => e*10).where(e => e>40).count(e => e>30)  );
      aver.areEqual(2, sut.$(a).select(e => e*10).where(e => e>10).count(e => e>30)  );
      aver.areEqual(4, sut.$(a).select(e => e*10).where(e => e!=10).count()  );
      aver.areEqual(5, sut.$(a).where(e => e!=10).select(e => e*10).count()  );
      aver.areEqual(4, sut.$(a).where(e => e!=1).select(e => e*10).count()  );
    });

  });


  unit("#take()", function() {

    cs("empty",   function() {
      aver.areIterablesEquivalent( [], sut.$().take() );
      aver.areIterablesEquivalent( [], sut.$(undefined).take() );
      aver.areIterablesEquivalent( [], sut.$(null).take() );
    });

    cs("basic",   function() {
      const a = [1,2,3,4,5];
      aver.areIterablesEquivalent( [1,2], sut.$(a).take(2) );
      aver.areIterablesEquivalent( [1,2,3], sut.$(a).take(3) );
    });

    cs("chain-take",   function() {
      const a = [1,2,3,4,5];
      aver.areIterablesEquivalent( [12,13,14], sut.$(a).select(e => e+10).where(e=>e>=12).take(3) );
      aver.areIterablesEquivalent( [12,13], sut.$(a).select(e => e+10).take(3).where(e=>e>=12) );
    });
  });


  unit("#skip()", function() {

    cs("empty",   function() {
      aver.areIterablesEquivalent( [], sut.$().skip() );
      aver.areIterablesEquivalent( [], sut.$(undefined).skip() );
      aver.areIterablesEquivalent( [], sut.$(null).skip() );
    });

    cs("basic",   function() {
      const a = [1,2,3,4,5];
      aver.areIterablesEquivalent( [3,4,5], sut.$(a).skip(2) );
      aver.areIterablesEquivalent( [], sut.$(a).skip(6) );
    });

    cs("chain-skip",   function() {
      const a = [1,2,3,4,5];
      aver.areIterablesEquivalent( [14,15], sut.$(a).select(e => e+10).where(e=>e>=12).skip(2) );
      aver.areIterablesEquivalent( [15], sut.$(a).select(e => e+10).skip(4).where(e=>e>=12) );
    });
  });


  unit("#any()", function() {

    cs("empty",   function() {
      aver.isFalse( sut.$().any() );
      aver.isFalse( sut.$().any(undefined) );
      aver.isFalse( sut.$().any(null) );

      aver.isFalse( sut.$([]).any() );
      aver.isFalse( sut.$([]).any(undefined) );
      aver.isFalse( sut.$([]).any(null) );

      aver.isTrue( sut.$([1,2,3]).any() );
      aver.isTrue( sut.$([1,2,3]).any(undefined) );
      aver.isTrue( sut.$([1,2,3]).any(null) );
    });

    cs("basic",   function() {
      const a = [1,2,3,4,5];
      aver.isTrue( sut.$(a).any() );
      aver.isTrue( sut.$(a).any(e=>e>=5) );
      aver.isFalse( sut.$(a).any(e=>e>15) );
    });
  });

  unit("#all()", function() {

    cs("empty",   function() {
      aver.isTrue( sut.$().all() );
      aver.isTrue( sut.$().all(undefined) );
      aver.isTrue( sut.$().all(null) );

      aver.isTrue( sut.$([]).all() );
      aver.isTrue( sut.$([]).all(undefined) );
      aver.isTrue( sut.$([]).all(null) );

      aver.isTrue( sut.$([1,2,3]).all() );
      aver.isTrue( sut.$([1,2,3]).all(undefined) );
      aver.isTrue( sut.$([1,2,3]).all(null) );
    });

    cs("basic",   function() {
      const a = [1,2,3,4,5];
      aver.isTrue( sut.$(a).all() );
      aver.isFalse( sut.$(a).all(e=>e>3) );
      aver.isTrue( sut.$(a).any(e=>e>0) );
    });
  });


  unit("#isEquivalentTo()", function() {

    cs("empty",   function() {
      aver.isFalse( sut.$().isEquivalentTo() );
      aver.isFalse( sut.$().isEquivalentTo(undefined) );
      aver.isFalse( sut.$().isEquivalentTo(null) );
      aver.isTrue( sut.$().isEquivalentTo([]) );
      aver.isTrue( sut.$([]).isEquivalentTo([]) );
    });

    cs("same",   function() {
      let a = sut.$([1,2,3]);
      aver.isTrue( a.isEquivalentTo(a) );
    });

    cs("basic",   function() {
      aver.isTrue( sut.$([1,2,3]).isEquivalentTo([1,2,3]) );
      aver.isFalse( sut.$([1,2,33]).isEquivalentTo([1,2,3]) );
      aver.isFalse( sut.$([1,2,3]).isEquivalentTo([1,2,33]) );

      aver.isFalse( sut.$([1,2,3]).isEquivalentTo([1,2,3,4]) );
      aver.isFalse( sut.$([1,2,3,4]).isEquivalentTo([1,2,3]) );

    });

    cs("basic wrapped",   function() {
      aver.isTrue( sut.$([1,2,3]).isEquivalentTo(   sut.$([1,2,3])  ));
      aver.isFalse( sut.$([1,2,33]).isEquivalentTo( sut.$([1,2,3])  ));
      aver.isFalse( sut.$([1,2,3]).isEquivalentTo(  sut.$([1,2,33]) ));

      aver.isFalse( sut.$([1,2,3]).isEquivalentTo(  sut.$([1,2,3,4]) ));
      aver.isFalse( sut.$([1,2,3,4]).isEquivalentTo(sut.$([1,2,3])   ));
    });

    cs("custom comparer",   function() {
      aver.isTrue( sut.$([1,2,3]).isEquivalentTo([10,20,30], (a,b) => 10*a === b) );
      aver.isFalse( sut.$([10,20,30]).isEquivalentTo([10,20,30], (a,b) => 10*a === b) );

      aver.isFalse( sut.$([1,2,3]).isEquivalentTo(["1","2","3"]));
      aver.isTrue( sut.$([1,2,3]).isEquivalentTo(["1","2","3"], (a,b) => a === types.asInt(b)) );
    });

    cs("chained",   function() {
      const a = sut.$([1,2,3,5,7,9]).where(e => e%2!==0);
      const b = sut.$([1,2,3,4,4,4,4,5,6,7,8,9]).where(e => e%2!==0);

      aver.areNotEqual(a, b);
      aver.isTrue( a.isEquivalentTo(b) );
      aver.areIterablesEquivalent(a, b); //test aver itself
    });
  });


  unit("#concat()", function() {

    cs("empty",   function() {

      const a = sut.$([1,2,3,4]);

      aver.areIterablesEquivalent(a, a.concat());
      aver.areIterablesEquivalent(a, a.concat(undefined));
      aver.areIterablesEquivalent(a, a.concat(null));
    });

    cs("basic",   function() {
      const a = sut.$([1,2,3,4]);

      aver.areIterablesEquivalent([1,2,3,4,-1,1,9], a.concat([-1,1,9]));
      aver.areIterablesEquivalent([1,2,3,4,1,2,3,4], a.concat(a));
    });

    cs("chained",   function() {
      const a = sut.$([1,2,3,4]);

      aver.areIterablesEquivalent([3,4,1,2,3,1,2,3,4], a.where(e=>e>=3).concat(a.where(e=>e<4).concat(a)));
    });
  });


  unit("#orderby()", function() {

    cs("empty",   function() {

      const a = sut.$([3,2,1,4]);

      aver.areIterablesEquivalent([1,2,3,4], a.orderBy());
      aver.areIterablesEquivalent([1,2,3,4], a.orderBy(undefined));
      aver.areIterablesEquivalent([1,2,3,4], a.orderBy(null));
    });

    cs("basic",   function() {
      const a = sut.$([4,2,1,3]);

      aver.areIterablesEquivalent([1,2,3,4], a.orderBy());
      aver.areIterablesEquivalent([4,3,2,1], a.orderBy((a,b) => a>b ? -1 : 1 ));
    });

    cs("chained",   function() {
      const a = sut.$([
        {id: "SRAY", name: "Sugar Ray", age: 123},
        {id: "CJON", name: "Captain John", age: 89},
        {id: "ALX", name: "Alex Simple", age: 45},
        {id: "BIK", name: "Bike Murdock", age: 19},
      ]);

      aver.areIterablesEquivalent([19, 45, 89, 123], a.select(e=>e.age).orderBy((a,b)=>a>b?1:-1));

      aver.areIterablesEquivalent(["CJON","ALX"], a.orderBy((a,b)=>a.age>b.age?-1:1).select(e=>e.id).skip(1).take(2) );
    });
  });


  unit("#distinct()", function() {

    cs("basic",   function() {
      const a = sut.$([1,2,2,2,2,3,3,4]);
      aver.areIterablesEquivalent([1,2,3,4], a.distinct());
    });

    cs("basic + selector",   function() {
      const a = sut.$([1,2,2,2,2,3,3,4]);
      aver.areIterablesEquivalent([1,3], a.distinct(e => e<3 ? 1 : 2 ));
    });

    const a = sut.$([
      {id: 1, age: 10, name: "Alex"},
      {id: 2, age: 12, name: "Doris"},
      {id: 3, age: 10, name: "Boris"},
      {id: 4, age: 34, name: "Alex"},
      {id: 5, age: 35, name: "Alex"}]);

    cs("objects + selector",   function() {
      aver.areIterablesEquivalent([10,12,34,35], a.distinct(e => e.age).select(e => e.age));
      aver.areIterablesEquivalent(["Alex","Doris","Alex","Alex"], a.distinct(e => e.age).select(e => e.name));
      aver.areIterablesEquivalent([10,12,10], a.distinct(e => e.name).select(e => e.age));
      aver.areIterablesEquivalent([1,2,3], a.distinct(e => e.name).select(e => e.id));
    });

    cs("objects + selector + count",   function() {
      aver.areEqual( 4, a.distinct(e => e.age).count() );
      aver.areEqual( 3, a.distinct(e => e.name).count() );
    });
  });


  unit("#firstOrDefault()", function() {

    cs("empty+basic",   function() {

      const a = sut.$([3,2,1,4]);

      let match = a.firstOrDefault();
      aver.isTrue(match.ok);
      aver.areEqual(3, match.value);

      match = a.firstOrDefault(undefined);
      aver.isTrue(match.ok);
      aver.areEqual(3, match.value);
    });

    cs("with predicate",   function() {
      const a = sut.$([3,2,1,4]);

      let match = a.firstOrDefault(e => e>3);
      aver.isTrue(match.ok);
      aver.areEqual(4, match.value);

      match = a.firstOrDefault(e => e<0);
      aver.isFalse(match.ok);
      aver.isUndefined(match.value);
    });

    cs("chained",   function() {
      const a = sut.$([1,2,3,4,5,6,7,8,9,0]);

      aver.areEqual( 22, a.where(e => e> 1).select(e => (e*10)+e).firstOrDefault().value);
      aver.areEqual( 88, a.where(e => e> 1).select(e => (e*10)+e).firstOrDefault(e => e>80).value);
    });
  });

  unit("#first()", function() {

    cs("basic",   function() {

      const a = sut.$([3,2,1,4]);
      aver.areEqual(3,a.first());

      aver.throws( function(){
        a.first(e => e<0);
      }, "no matching elements");

    });

    cs("empty sequence",   function() {
      const a = sut.$();
      aver.throws( function(){
        a.first();
      }, "no matching elements");
    });
  });

});
