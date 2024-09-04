/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as str   from "./strings.js";
import * as linq  from "./linq.js";


/**
 * Makes an AzosError() initialized with message
 * @param {string} msg message
 * @param {string} from a short method, clause, or trace point name
 * @param {Error | object} cause the exception associated with this error
 */
export function AVERMENT_FAILURE(msg, from, cause = null) {
  return new types.AzosError(`Averment failure: ${msg}}`, from, cause, 500);
}

const dv = (v, ml = 16) => str.describe(v, ml); //shortcut


/**
 * Performs strict test for undefined
 * @param {*} a
 */
export function isUndefined(a){
  if (a===undefined) return a;
  throw AVERMENT_FAILURE(`isUndefined(${dv(a)})`);
}

/**
 * Performs strict test for not undefined
 * @param {*} a
 */
export function isDefined(a){
  if (a!==undefined) return a;
  throw AVERMENT_FAILURE(`isDefined(${dv(a)})`);
}

/**
 * Performs strict test for being defined null
 * @param {*} a
 */
export function isNull(a){
  if (a!==undefined && a===null) return a;
  throw AVERMENT_FAILURE(`isNull(${dv(a)})`);
}

/**
 * Performs strict test for being defined not-null
 * @param {*} a
 */
export function isNotNull(a){
  if (a!==undefined && a!==null) return a;
  throw AVERMENT_FAILURE(`isNotNull(${dv(a)})`);
}

/**
 * Performs strict test for a non-empty string value
 * @param {*} a
 */
export function isNonEmptyString(a){
  if (types.isNonEmptyString(a)) return a;
  throw AVERMENT_FAILURE(`isNonEmptyString(${dv(a)})`);
}

/**
 * Performs strict test for object (not a primitive, array or function)
 * @param {*} a
 */
export function isObject(a){
  if (types.isObject(a)) return a;
  throw AVERMENT_FAILURE(`isObject(${dv(a)})`);
}

/**
 * Performs strict test for array (not a primitive, object or function)
 * @param {*} a
 */
export function isArray(a){
  if (types.isArray(a)) return a;
  throw AVERMENT_FAILURE(`isArray(${dv(a)})`);
}

/**
 * Performs strict test for object or array (not a primitive or function)
 * @param {*} a
 */
export function isObjectOrArray(a){
  if (types.isObjectOrArray(a)) return a;
  throw AVERMENT_FAILURE(`isObjectOrArray(${dv(a)})`);
}

/**
 * Performs strict test for function (not a primitive, object or array)
 * @param {*} a
 */
export function isFunction(a){
  if (types.isFunction(a)) return a;
  throw AVERMENT_FAILURE(`isFunction(${dv(a)})`);
}

/**
 * Performs strict test for function (not a primitive, object or array), OR null/undefined. Undefined is returned as null
 * @param {*} a
 */
export function isFunctionOrNull(a){
  if (a === undefined || a === null) return null;
  if (types.isFunction(a)) return a;
  throw AVERMENT_FAILURE(`isFunctionOrNull(${dv(a)})`);
}

/**
 * Performs strict test for function or object (not a primitive or array)
 * @param {*} a
 */
export function isObjectOrFunction(a){
  if (types.isObjectOrFunction(a)) return a;
  throw AVERMENT_FAILURE(`isObjectOrFunction(${dv(a)})`);
}

/**
 * Performs strict test for Iterable protocol
 * @param {*} a
 */
export function isIterable(a){
  if (types.isIterable(a)) return a;
  throw AVERMENT_FAILURE(`isIterable(${dv(a)})`);
}

/**
 * Performs strict test for date
 * @param {*} a
 */
export function isDate(a){
  if (types.isDate(a)) return a;
  throw AVERMENT_FAILURE(`isDate(${dv(a)})`);
}

/**
 * Performs strict test for number
 * @param {*} a
 */
export function isNumber(a){
  if (types.isNumber(a)) return a;
  throw AVERMENT_FAILURE(`isNumber(${dv(a)})`);
}

/**
 * Performs strict test for string
 * @param {*} a
 */
export function isString(a){
  if (types.isString(a)) return a;
  throw AVERMENT_FAILURE(`isString(${dv(a)})`);
}

/**
 * Performs strict test for string or null/undefined (converted to null)
 * @param {*} a
 */
export function isStringOrNull(a){
  if (a === undefined || a === null) return null;
  if (types.isString(a)) return a;
  throw AVERMENT_FAILURE(`isStringOrNull(${dv(a)})`);
}

/**
 * Performs strict test for bool
 * @param {*} a
 */
export function isBool(a){
  if (types.isBool(a)) return a;
  throw AVERMENT_FAILURE(`isBool(${dv(a)})`);
}

/**
 * Performs strict test for symbol
 * @param {*} a
 */
export function isSymbol(a){
  if (types.isSymbol(a)) return a;
  throw AVERMENT_FAILURE(`isSymbol(${dv(a)})`);
}

/**
 * Performs strict test for false
 * @param {bool} a
 */
export function isFalse(a){
  if (a===false) return a;
  throw AVERMENT_FAILURE(`isFalse(${dv(a)})`);
}

/**
 * Performs strict test for true
 * @param {bool} a
 */
export function isTrue(a){
  if (a===true) return a;
  throw AVERMENT_FAILURE(`isTrue(${dv(a)})`);
}

/**
 * Performs strict equality check using ===.
 * Contrast with areEqualValues() which is based on valueOf(); i.e. new Date(0) !== new Date(0)
 *  because those are different references.
 * @param {*} a
 * @param {*} b
 */
export function areEqual(a, b){
  if (a===b) return;
  throw AVERMENT_FAILURE(`areEqual(${dv(a)}, ${dv(b)})`);
}

/**
 * Performs strict inequality check using !==
 * @param {*} a
 * @param {*} b
 */
export function areNotEqual(a, b){
  if (a!==b) return;
  throw AVERMENT_FAILURE(`areNotEqual(${dv(a)}, ${dv(b)})`);
}

/**
 * Performs strict equality check on arguments using valueOf().
 * Do not confuse with areEqual() which is based on ===; i.e. new Date(0) !== new Date(0)
 *   because those are different references, so date values must be equated using areEqualValues(), not
 *  areEquals() which would equate object references instead. Note: strings are handled as special case,
 * and may be equated using either of the methods.
 * @param {*} a
 * @param {*} b
 */
export function areEqualValues(a, b){
  if (a===b) return;
  if (types.isAssigned(a) && types.isAssigned(b))
    if (a.valueOf()===b.valueOf()) return;

  throw AVERMENT_FAILURE(`areEqualValues(${dv(a)}, ${dv(b)})`);
}


/**
 * Expects that function throws a message optionally containing the msg
 * @param {function} f function to call
 * @param {string} [msg] optional message to expect in the error
 */
export function throws(f, msg){
  try{
    f();
  }
  catch(e){
    if (!msg) return;
    //  console.log(e);

    let got = e.toString().toLowerCase();
    msg = msg.toLowerCase();

    if (got.indexOf(msg)==-1)
      throw AVERMENT_FAILURE(`throws(${dv(f)}, expect '${msg}' but was '${got}')`);

    return;
  }

  throw AVERMENT_FAILURE(`throws(${dv(f)})`);
}

/**
 * Succeeds when `t` is a direct or indirect subtype of `base`
 * @param {Function} t a type to check
 * @param {Function} base base type
 * @returns original object after successful type check or throws
 */
export function isSubclassOf(t, base){
  if (types.isSubclassOf(t, base)) return t;
  throw AVERMENT_FAILURE(`isSubclassOf(${dv(t)}, ${dv(base)})`);
}

/**
 * Succeeds when `t` is NOT a direct or indirect subtype of `base`
 * @param {Function} t a type to check
 * @param {Function} base base type
 * @returns original object after successful type check or throws
 */
export function isNotSubclassOf(t, base){
  if (types.isFunction(t) && types.isFunction(base))
    if (!types.isSubclassOf(t, base)) return t;

  throw AVERMENT_FAILURE(`isNotSubclassOf(${dv(t)}, ${dv(base)})`);
}


/**
 * Performs strict instanceof check on object and function args
 * @param {Object} o
 * @param {type-function} t
 * @returns original object after successful type check or throws
 */
export function isOf(o, t){
  if (types.isObject(o) && types.isFunction(t))
    if (o instanceof t) return o;

  throw AVERMENT_FAILURE(`isOf(${dv(o)}, ${dv(t)})`);
}

/**
 * Performs strict instanceof check on object and function args; if object is null or undefined returns null
 * @param {Object} o
 * @param {type-function} t
 * @returns original object after successful type check or throws or NULL for undefined/null object
 */
export function isOfOrNull(o, t){
  if (o === undefined || o === null) return null;
  if (types.isObject(o) && types.isFunction(t))
    if (o instanceof t) return o;

  throw AVERMENT_FAILURE(`isOfOrNull(${dv(o)}, ${dv(t)})`);
}

/**
 * Performs strict instanceof check on object and function args
 * @param {Object} o instance to check
 * @param {typeFunction} ts array of type functions(class names) to check
 * @returns original object after successful type check or throws
 */
export function isOfEither(o, ...ts){
  if (types.isObject(o)){
    for(let t of ts)
      if (types.isFunction(t) && (o instanceof t)) return o;
  }

  throw AVERMENT_FAILURE(`isOfEither(${dv(o)}, ${dv(ts)})`);
}


/**
 * Performs strict !instanceof check on object and function args
 * @param {Object} o
 * @param {type-function} t
 */
export function isNotOf(o, t){
  if (types.isObject(o) && types.isFunction(t))
    if (!(o instanceof t)) return o;

  throw AVERMENT_FAILURE(`isNotOf(${dv(o)}, ${dv(t)})`);
}


/**
 * Checks that both arguments are arrays of equal length running per-element areEqual()
 * Note: does not do deep comparison
 */
export function areArraysEquivalent(a, b){
  if (types.isArray(a) && types.isArray(b)){
    if (a===b) return;
    if (a.length===b.length){
      let alleq = true;
      for(let i=0; i<a.length; i++)
        if (a[i]!==b[i]){
          alleq = false;
          break;
        }
      if (alleq) return;
    }
  }

  throw AVERMENT_FAILURE(`areArraysEquivalent(${dv(a)}, ${dv(b)})`);
}

/**
 * Checks that both arguments are iterable sequences of the same size and content using an optional equality comparer
 * @param {Iterable<*>} a First sequence
 * @param {Iterable<*>} b Second sequence
 * @param {function} [f] Optional equality comparer predicate of (a,b): bool
 */
export function areIterablesEquivalent(a, b, f = null){
  if (types.isIterable(a) && types.isIterable(b)){
    if (a===b) return;
    const al = linq.$(a);
    const bl = linq.$(b);
    if (al.isEquivalentTo(bl, f)) return;
  }

  throw AVERMENT_FAILURE(`areIterablesEquivalent(${dv(a)}, ${dv(b)})`);
}


/**
 * Used for internal derivation testing
 */
export class MockBase{
  #a;
  #b;
  constructor(a, b){
    this.#a = a | 0;
    this.#b = b | 0;
  }
  get a( ) { return this.#a; }  set a(v) { this.#a = v; }
  get b( ) { return this.#b; }  set b(v) { this.#b = v; }

  virt(){ return "base"; }

  describe(){
    return `${this.virt()}(a: ${this.a}, b: ${this.b})`;
  }

}

/**
 * Used for internal derivation testing
 */
export class MockA extends MockBase{
  constructor(a,b){
    super(a, b);
  }
  virt(){ return "MockA"; }
}

/** Used for internal derivation testing */
export class MockB extends MockBase{ constructor(a,b){ super(a, b); } }

/** Used for internal derivation testing */
export class MockBC extends MockB{ constructor(a,b){ super(a, b); } }
