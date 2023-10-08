/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";

/**
 * Creates a root iterable $LINQ object
 * @param {*} iterable if undefined assumes empty array
 */
export function $(iterable){
  return new $LINQ(iterable);
}

/**
 * Provides lazy functional enumeration over iterable source a-la LINQ in C#
 */
export class $LINQ{

  #src;

  constructor(iterable){
    if (!types.isIterable(iterable)) iterable = [];
    this.#src = iterable;
  }

  get source(){ return this.#src;}

  [Symbol.iterator](){
    return this.#src[Symbol.iterator](); 
  }


  /** Materializes the sequence into an array */
  toArray(){ return [...this.#src]; }

  /** 
   * Maps values 
   * @param {function} f Mapper, if not a function returns this
   */
  select(f){
    if (!types.isFunction(f)) return this;

    const self = this;
    const it = {
      [Symbol.iterator]: function* (){
        for(let e of self.#src) yield f(e);
      }
    };

    return new $LINQ(it);
  }

  /** 
   * Filters values 
   * @param {function} f Predicate, if not a function returns this
   */
  where(f){
    if (!types.isFunction(f)) return this;

    const self = this;
    const it = {
      [Symbol.iterator]: function* (){
        for(let e of self.#src) if (f(e)) yield e;
      }
    };

    return new $LINQ(it);
  }

  /** Only takes up to N elements */
  take(n){
    n = types.asInt(n);
    const self = this;
    const it = {
      [Symbol.iterator]: function* (){
        let cnt = 0;
        for(let e of self.#src) {
          if (cnt===n) break;
          yield e;
          cnt++;
        } 
      }
    };

    return new $LINQ(it);
  }

  /** skips up to N first elements */
  skip(n){
    n = types.asInt(n);
    const self = this;
    const it = {
      [Symbol.iterator]: function* (){
        let cnt = 0;
        for(let e of self.#src) {
          if (cnt>=n) yield e;
          cnt++;
        } 
      }
    };

    return new $LINQ(it);
  }

  /** 
   * Orders(sorts) by function. This materializes all data for sorting to take place
   * @param {function} [f] Optional comparator (a,b): int 
   * 
  */
  orderBy(f){
    let arr = this.toArray();
    if (f === null) f = undefined;//null may not be used as of 2023
    arr.sort(f);//f may be undefined
    return new $LINQ(arr);
  }

  /**
   * Counts elements optionally applying predicate
   * @param {function} [f] Optional bool predicate 
   */
  count(f){
    const ass = types.isFunction(f);
    let result = 0;
    for(let e of this.#src)
      if (!ass || f(e)) result++;
    return result;
  }

  /**
   * Returns true if sequence has any elemnts optionally applying predicate
   * @param {function} [f] Optional bool predicate 
   */
  any(f){
    const ass = types.isFunction(f);
    for(let e of this.#src)
      if (!ass || f(e)) return true;
    return false;
  }

  /**
   * Returns true if all sequence elemnts satisfy predicate
   * @param {function} [f] Optional bool predicate, if not supplied true returned right away 
   */
  all(f){
    if (!types.isFunction(f)) return true;
    for(let e of this.#src)
      if (!f(e)) return false;
    return true;
  }

  /**
   * Returns the first element matching the optional predicate or undefined if nonthing matched
   * @param {function} [f] Optional bool predicate, if not supplied takes first element
   * @returns {match} Object {ok: bool, value: object} ok: true on positive match
   */
  firstOrDefault(f){
    const ass = types.isFunction(f);
    for(let e of this.#src)
      if (!ass || f(e)) return {ok: true, value: e};
    
    return {ok: false, value: undefined};
  }

  /**
   * Returns the first element matching the optional predicate or throws
   * @param {function} [f] Optional bool predicate, if not supplied takes first element
   */
  first(f){
    const got = this.firstOrDefault(f);
    if (got.ok)
      return got.value;
    throw Error("LINQ.first() no matching elements");
  }


  /**
   * Returns true if another iterable sequence is of the same size and has equal elements as determined
   * by the optional equality comparer
   * @param {*} other Another Sequence
   * @param {*} [f] Optional equality comparer of form (a,b): bool
   */
  isEquivalentTo(other, f = null){
    if (!types.isIterable(other)) return false;
   
    const ass = types.isFunction(f);
    const it1 = this[Symbol.iterator]();
    const it2 = other[Symbol.iterator]();

    while(true){
      const r1 = it1.next();
      const r2 = it2.next();
      if (r1.done!=r2.done) break;
      if (r1.done) return true;
      
      const eq = ass ? f(r1.value, r2.value)===true : r1.value === r2.value;
      if (!eq) break;
    }

    return false;
  }

  /**
   * Concatenates other sequence with this one
   * @param {Iterable<*>} other another sequence to add to this one 
   */
  concat(other){
    if (!types.isIterable(other)) return this;

    const self = this;
    const it = {
      [Symbol.iterator]: function* (){
        for(let e of self.#src) yield e;
        for(let e of other) yield e;
      }
    };

    return new $LINQ(it);
  }

  /**
   * Returns distinct values - removes repetition, takes optional key selector function
   * @param {function} [f] Optional selector 
   */
  distinct(f){
    const ass = types.isFunction(f);
    const self = this;
    const it = {
      [Symbol.iterator]: function* (){
        const set = new Set();
        for(let e of self.#src){
          let key = ass ? f(e) : e;
          if (set.has(key)) continue;
          set.add(key);
          yield e;
        }
        
      }
    };

    return new $LINQ(it);
  }

}

