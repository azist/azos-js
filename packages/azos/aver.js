/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as str from "./strings.js";
import * as linq from "./linq.js";


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
 * @param {string | undefined} from optional clause in case of failure
 * @returns original object after successful type check or throws
 */
export function isUndefined(a, from) {
  if (a === undefined) return a;
  throw AVERMENT_FAILURE(`isUndefined(${dv(a)})`, from);
}

/**
 * Performs strict test for not undefined
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original object after successful type check or throws
 */
export function isDefined(a, from) {
  if (a !== undefined) return a;
  throw AVERMENT_FAILURE(`isDefined(${dv(a)})`, from);
}

/**
 * Performs strict test for being defined null
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original object after successful type check or throws
 */
export function isNull(a, from) {
  if (a !== undefined && a === null) return a;
  throw AVERMENT_FAILURE(`isNull(${dv(a)})`, from);
}

/**
 * Performs strict test for being defined not-null
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original object after successful type check or throws
 */
export function isNotNull(a, from) {
  if (a !== undefined && a !== null) return a;
  throw AVERMENT_FAILURE(`isNotNull(${dv(a)})`, from);
}

/**
 * Performs strict test for a non-empty string value
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original string after successful type check or throws
 */
export function isNonEmptyString(a, from) {
  if (types.isNonEmptyString(a)) return a;
  throw AVERMENT_FAILURE(`isNonEmptyString(${dv(a)})`, from);
}

/**
 * Performs strict test for a non-empty string value within a specified length range
 * @param {*} a
 * @param {*} min minimum length
 * @param {*} max maximum length
 * @param {string | undefined} from optional clause in case of failure
 * @returns original string after successful type check or throws
 */
export function isNonEmptyMinMaxString(a, min, max, from) {
  isNonEmptyString(a, from);

  min = types.asInt(min);
  max = types.asInt(max);
  isTrue(min < max, "min < max", from);

  if (a.length < min || a.length > max) {
    throw AVERMENT_FAILURE(`isNonEmptyMinMaxString(${dv(a)}, ${min}, ${max}})`, from);
  }

  return a;
}

/**
 * Performs strict test for object (not a primitive, array or function)
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original object after successful type check or throws
 */
export function isObject(a, from) {
  if (types.isObject(a)) return a;
  throw AVERMENT_FAILURE(`isObject(${dv(a)})`, from);
}

/**
 * Performs strict test for object (not a primitive, array or function)
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns null if undefined or null, original object after successful type check, or throws
 */
export function isObjectOrNull(a, from) {
  if (a === undefined || a === null) return null;
  if (types.isObject(a)) return a;
  throw AVERMENT_FAILURE(`isObjectOrNull(${dv(a)})`, from);
}

/**
 * Performs strict test for array (not a primitive, object or function)
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original array after successful type check or throws
 */
export function isArray(a, from) {
  if (types.isArray(a)) return a;
  throw AVERMENT_FAILURE(`isArray(${dv(a)})`, from);
}

/**
 * Performs strict test for array (not a primitive, object, or function)
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns null if undefined or null, original array after successful type check, or throws
 */
export function isArrayOrNull(a, from) {
  if (a === undefined || a === null) return null;
  if (types.isArray(a)) return a;
  throw AVERMENT_FAILURE(`isArrayOrNull(${dv(a)})`, from);
}

/**
 * Performs strict test for object or array (not a primitive or function)
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original object or array after successful type check or throws
 */
export function isObjectOrArray(a, from) {
  if (types.isObjectOrArray(a)) return a;
  throw AVERMENT_FAILURE(`isObjectOrArray(${dv(a)})`, from);
}

/**
 * Performs strict test for function (not a primitive, object or array)
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original function after successful type check or throws
 */
export function isFunction(a, from) {
  if (types.isFunction(a)) return a;
  throw AVERMENT_FAILURE(`isFunction(${dv(a)})`, from);
}

/**
 * Performs strict test for function (not a primitive, object or array), OR null/undefined. Undefined is returned as null
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns null if undefined or null, original function after successful type check, or throws
 */
export function isFunctionOrNull(a, from) {
  if (a === undefined || a === null) return null;
  if (types.isFunction(a)) return a;
  throw AVERMENT_FAILURE(`isFunctionOrNull(${dv(a)})`, from);
}

/**
 * Performs strict test for function or object (not a primitive or array)
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original object or function after successful type check or throws
 */
export function isObjectOrFunction(a, from) {
  if (types.isObjectOrFunction(a)) return a;
  throw AVERMENT_FAILURE(`isObjectOrFunction(${dv(a)})`, from);
}

/**
 * Performs strict test for Iterable protocol
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original iterable after successful type check or throws
 */
export function isIterable(a, from) {
  if (types.isIterable(a)) return a;
  throw AVERMENT_FAILURE(`isIterable(${dv(a)})`, from);
}

/**
 * Performs strict test for date
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original date after successful type check or throws
 */
export function isDate(a, from) {
  if (types.isDate(a)) return a;
  throw AVERMENT_FAILURE(`isDate(${dv(a)})`, from);
}

/**
 * Performs strict test for number
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original number after successful type check or throws
 */
export function isNumber(a, from) {
  if (types.isNumber(a)) return a;
  throw AVERMENT_FAILURE(`isNumber(${dv(a)})`, from);
}

/**
 * Performs strict test for string
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original string after successful type check or throws
 */
export function isString(a, from) {
  if (types.isString(a)) return a;
  throw AVERMENT_FAILURE(`isString(${dv(a)})`, from);
}

/**
 * Performs strict test for string or null/undefined (converted to null)
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns null if undefined or null, original string after successful type check, or throws
 */
export function isStringOrNull(a, from) {
  if (a === undefined || a === null) return null;
  if (types.isString(a)) return a;
  throw AVERMENT_FAILURE(`isStringOrNull(${dv(a)})`, from);
}

/**
 * Performs strict test for bool
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original bool after successful type check or throws
 */
export function isBool(a, from) {
  if (types.isBool(a)) return a;
  throw AVERMENT_FAILURE(`isBool(${dv(a)})`, from);
}

/**
 * Performs strict test for symbol
 * @param {*} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original symbol after successful type check or throws
 */
export function isSymbol(a, from) {
  if (types.isSymbol(a)) return a;
  throw AVERMENT_FAILURE(`isSymbol(${dv(a)})`, from);
}

/**
 * Performs strict test for false
 * @param {bool} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original bool if false or throws
 */
export function isFalse(a, from) {
  if (a === false) return a;
  throw AVERMENT_FAILURE(`isFalse(${dv(a)})`, from);
}

/**
 * Performs strict test for true
 * @param {bool} a
 * @param {string | undefined} from optional clause in case of failure
 * @returns original bool if true or throws
 */
export function isTrue(a, from) {
  if (a === true) return a;
  throw AVERMENT_FAILURE(`isTrue(${dv(a)})`, from);
}

/**
 * Performs strict equality check using ===.
 * Contrast with areEqualValues() which is based on valueOf(); i.e. new Date(0) !== new Date(0)
 *  because those are different references.
 * @param {*} a
 * @param {*} b
 * @param {string | undefined} from optional clause in case of failure
 * @returns undefined if a and b are strictly equal or throws
 */
export function areEqual(a, b, from) {
  if (a === b) return;
  throw AVERMENT_FAILURE(`areEqual(${dv(a)}, ${dv(b)})`, from);
}

/**
 * Performs strict inequality check using !==
 * @param {*} a
 * @param {*} b
 * @param {string | undefined} from optional clause in case of failure
 * @returns undefined if a and be are not equal or throws
 */
export function areNotEqual(a, b, from) {
  if (a !== b) return;
  throw AVERMENT_FAILURE(`areNotEqual(${dv(a)}, ${dv(b)})`, from);
}

/**
 * Performs strict equality check on arguments using valueOf().
 * Do not confuse with areEqual() which is based on ===; i.e. new Date(0) !== new Date(0)
 *   because those are different references, so date values must be equated using areEqualValues(), not
 *  areEquals() which would equate object references instead. Note: strings are handled as special case,
 * and may be equated using either of the methods.
 * @param {*} a
 * @param {*} b
 * @param {string | undefined} from optional clause in case of failure
 * @returns undefined if a and b are same reference, a and b are assigned same values, or throws
 */
export function areEqualValues(a, b, from) {
  if (a === b) return;
  if (types.isAssigned(a) && types.isAssigned(b))
    if (a.valueOf() === b.valueOf()) return;

  throw AVERMENT_FAILURE(`areEqualValues(${dv(a)}, ${dv(b)})`, from);
}

/**
 * Performs strict equality check on arguments using valueOf().
 * Do not confuse with areNotEqual() which is based on ===; i.e. new Date(0) !== new Date(0)
 *   because those are different references, so date values must be equated using areNotEqualValues(), not
 *  areNotEquals() which would equate object references instead. Note: strings are handled as special case,
 * and may be equated using either of the methods.
 * @param {*} a
 * @param {*} b
 * @param {string | undefined} from optional clause in case of failure
 * @returns undefined if a and b are same reference, a and b are assigned same values, or throws
 */
export function areNotEqualValues(a, b, from) {
  if (a !== b) {
    if (types.isAssigned(a) && types.isAssigned(b))
      if (a.valueOf() !== b.valueOf()) return;
  }

  throw AVERMENT_FAILURE(`areEqualValues(${dv(a)}, ${dv(b)})`, from);
}


/**
 * Expects that function throws a message optionally containing the msg
 * @param {function} f function to call
 * @param {string} [msg] optional message to expect in the error
 * @param {string | undefined} from optional clause in case of failure
 * @returns undefined if f throws with no msg present or f throws containing msg, or throws
 */
export function throws(f, msg, from) {
  try {
    f();
  }
  catch (e) {
    if (!msg) return;
    //  console.log(e);

    let got = e.toString().toLowerCase();
    msg = msg.toLowerCase();

    if (got.indexOf(msg) == -1)
      throw AVERMENT_FAILURE(`throws(${dv(f)}, expect '${msg}' but was '${got}')`, from);

    return;
  }

  throw AVERMENT_FAILURE(`throws(${dv(f)})`, from);
}

/**
 * Succeeds when `t` is a direct or indirect subtype of `base`
 * @param {Function} t a type to check
 * @param {Function} base base type
 * @param {string | undefined} from optional clause in case of failure
 * @returns original object after successful type check or throws
 */
export function isSubclassOf(t, base, from) {
  if (types.isSubclassOf(t, base)) return t;
  throw AVERMENT_FAILURE(`isSubclassOf(${dv(t)}, ${dv(base)})`, from);
}

/**
 * Succeeds when `t` is NOT a direct or indirect subtype of `base`
 * @param {Function} t a type to check
 * @param {Function} base base type
 * @param {string | undefined} from optional clause in case of failure
 * @returns original object after successful type check or throws
 */
export function isNotSubclassOf(t, base, from) {
  if (types.isFunction(t) && types.isFunction(base))
    if (!types.isSubclassOf(t, base)) return t;

  throw AVERMENT_FAILURE(`isNotSubclassOf(${dv(t)}, ${dv(base)})`, from);
}


/**
 * Performs strict instanceof check on object and function args
 * @param {Object} o
 * @param {typeFunction} t
 * @param {string | undefined} from optional clause in case of failure
 * @returns original object after successful type check or throws
 */
export function isOf(o, t, from) {
  if (types.isObject(o) && types.isFunction(t))
    if (o instanceof t) return o;

  throw AVERMENT_FAILURE(`isOf(${dv(o)}, ${dv(t)})`, from);
}

/**
 * Performs strict instanceof check on object and function args; if object is null or undefined returns null
 * @param {Object} o
 * @param {typeFunction} t
 * @param {string | undefined} from optional clause in case of failure
 * @returns original object after successful type check or throws or NULL for undefined/null object
 */
export function isOfOrNull(o, t, from) {
  if (o === undefined || o === null) return null;
  if (types.isObject(o) && types.isFunction(t))
    if (o instanceof t) return o;

  throw AVERMENT_FAILURE(`isOfOrNull(${dv(o)}, ${dv(t)})`, from);
}

/**
 * Performs strict instanceof check on object and function args
 * @param {Object} classToCheck instance to check
 * @param {typeFunction} typeArr array of type functions(class names) to check
 * @param {string | undefined} from optional clause in case of failure
 * @returns original object after successful type check or throws
 */
export function isOfEither(classToCheck, ...typeArr) {
  if (types.isObject(classToCheck)) {
    for (let t of typeArr)
      if (types.isFunction(t) && (classToCheck instanceof t)) return classToCheck;
  }

  throw AVERMENT_FAILURE(`isOfEither(${dv(classToCheck)}, ${dv(typeArr)})`);
}

/**
 * Performs strict instanceof check on object and function args
 * @param {Object} classToCheck instance to check
 * @param {typeFunction} typeArr array of type functions(class names) to check
 * @param {string | undefined} from optional clause in case of failure
 * @returns original object after successful type check or throws
 */
export function isOfEitherFrom(classToCheck, from, ...typeArr) {
  if (types.isObject(classToCheck)) {
    for (let t of typeArr)
      if (types.isFunction(t) && (classToCheck instanceof t)) return classToCheck;
  }

  throw AVERMENT_FAILURE(`isOfEither(${dv(classToCheck)}, ${dv(typeArr)})`, from);
}


/**
 * Performs strict !instanceof check on object and function args
 * @param {Object} o
 * @param {typeFunction} t
 * @param {string | undefined} from optional clause in case of failure
 * @returns original function o if o is object, t is function, and o is not instance of t; else throws
 */
export function isNotOf(o, t, from) {
  if (types.isObject(o) && types.isFunction(t))
    if (!(o instanceof t)) return o;

  throw AVERMENT_FAILURE(`isNotOf(${dv(o)}, ${dv(t)})`, from);
}


/**
 * Checks that both arguments are arrays of equal length running per-element areEqual()
 * Notes: 1.) does not do deep comparison, 2.) arrays are not sorted
 * @param {Array} a
 * @param {Array} b
 * @param {string | undefined} from optional clause in case of failure
 * @returns undefined if a and b are same reference array or if each element is strictly equal, or throws
 */
export function areArraysEquivalent(a, b, from) {
  if (types.isArray(a) && types.isArray(b)) {
    if (a === b) return;
    if (a.length === b.length) {
      let alleq = true;
      for (let i = 0; i < a.length; i++)
        if (a[i] !== b[i]) {
          alleq = false;
          break;
        }
      if (alleq) return;
    }
  }

  throw AVERMENT_FAILURE(`areArraysEquivalent(${dv(a)}, ${dv(b)})`, from);
}


/**
 * Checks that both arguments are arrays of equal length running per-element areEqual()
 * Notes: 1.) does not do deep comparison, 2.) arrays are not sorted
 * @param {Array} a
 * @param {Array} b
 * @param {string | undefined} from optional clause in case of failure
 * @returns undefined if a and b are not same reference array or if each element is not strictly equal, or throws
 *   if arrays are same reference or each element is strictly equal, throws if a and b are not both arrays
 */
export function areArraysNotEquivalent(a, b, from) {
  if (types.isArray(a) && types.isArray(b)) {
    if (a !== b) {
      if (a.length === b.length) {
        let alleq = true;
        for (let i = 0; i < a.length; i++)
          if (a[i] !== b[i]) {
            alleq = false;
            break;
          }
        if (!alleq) return;
      } else {
        return;
      }
    }
  }

  throw AVERMENT_FAILURE(`areArraysNotEquivalent(${dv(a)}, ${dv(b)})`, from);
}

/**
 * Checks that both arguments are iterable sequences of the same size and content using an optional equality comparer
 * @param {Iterable<*>} a First sequence
 * @param {Iterable<*>} b Second sequence
 * @param {function} [f] Optional equality comparer predicate of (a,b): bool
 * @param {string | undefined} from optional clause in case of failure
 * @returns undefined if a and b are same reference iterable or if a and b match isEquivalentTo check or throws
 */
export function areIterablesEquivalent(a, b, f = null, from) {
  if (types.isIterable(a) && types.isIterable(b)) {
    if (a === b) return;
    const al = linq.$(a);
    const bl = linq.$(b);
    if (al.isEquivalentTo(bl, f)) return;
  }

  throw AVERMENT_FAILURE(`areIterablesEquivalent(${dv(a)}, ${dv(b)})`, from);
}

/**
 * Ensures that the execution time of a function is under a specified limit
 * @param {number} limitMs The time limit in milliseconds
 * @param {function} fn The function to execute
 * @param {string | undefined} from Optional tracepoint name
 * @returns undefined if function execution is within the time limit or throws
 */
export function timeUnder(limitMs, fn, from) {
  isTrue(isNumber(limitMs) > 0, from);
  isFunction(fn, from);

  const start = performance.now();
  fn();
  const duration = performance.now() - start;

  if (duration > limitMs) {
    throw AVERMENT_FAILURE(`Function execution exceeded ${limitMs}ms (took ${duration.toFixed(2)}ms)`, from);
  }
}

/**
 * Used for internal derivation testing
 */
export class MockBase {
  #a;
  #b;
  constructor(a, b) {
    this.#a = a | 0;
    this.#b = b | 0;
  }
  get a() { return this.#a; } set a(v) { this.#a = v; }
  get b() { return this.#b; } set b(v) { this.#b = v; }

  virt() { return "base"; }

  describe() {
    return `${this.virt()}(a: ${this.a}, b: ${this.b})`;
  }

}

/**
 * Used for internal derivation testing
 */
export class MockA extends MockBase {
  constructor(a, b) {
    super(a, b);
  }
  virt() { return "MockA"; }
}

/** Used for internal derivation testing */
export class MockB extends MockBase { constructor(a, b) { super(a, b); } }

/** Used for internal derivation testing */
export class MockBC extends MockB { constructor(a, b) { super(a, b); } }
