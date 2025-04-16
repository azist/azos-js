/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Atom } from "./atom.js";
import * as CC from "./coreconsts.js";
import { EntityId } from "./entity-id.js";
import * as strings from "./strings.js";

import { isDate as aver_isDate, isNonEmptyString as aver_isNonEmptyString, isStringOrNull as aver_isStringOrNull, isNotNull as aver_isNotNull, isFunction as aver_isFunction } from "./aver.js";


/**
 * Establishes a "director" protocol - an entity which implements such property returns it's director -
 *  an entity who "owns" aka "directs" the implementing entity
 */
export const DIRECTOR_PROP = Symbol("director");

/**
 * Establishes a "INamed" protocol - an entity which implements such property returns it's name in a collection
 */
export const NAME_PROP = Symbol("name");

/**
 * Establishes a "IOrdered" protocol - an entity which implements such property returns it's relative int position in a collection
 */
export const ORDER_PROP = Symbol("order");

/**
 * Establishes a "IDirty" protocol - an entity that needs to be saved before disposal
 */
export const DIRTY_PROP = Symbol("dirty");

/**
 * Establishes a "closeQuery" - part of the IDirty protocol. Determines if an entity can be logically disposed
 *  such as a file view can be closed if there are no changes to be saved.
 */
export const CLOSE_QUERY_METHOD = Symbol("closeQuery");

/**
 * Establishes a "IData" protocol - an entity provides getting and possibly setting its data under this name aka "field name"
 */
export const DATA_NAME_PROP = Symbol("data-name");

/**
 * Establishes a "IData" protocol - an entity provides getting and possibly setting its data as a primitive value (e.g. such as a string for text fields)
 * or plan objects: arrays or maps for blocks and forms having its field names represent `Azos.Data.Doc` data document field values.
 */
export const DATA_VALUE_PROP = Symbol("data-value");


/**
 * Establishes data validation protocol: a function of signature: `[VALIDATE_METHOD](context, scope): error | null`.
 * Performs validation logic returning an error object if validation fails
 */
export const VALIDATE_METHOD = Symbol("validate");

/**
 * Establishes required value check protocol: a function of signature: `[CHECK_REQUIRED_METHOD](context): bool`.
 * Returns true if the implementing object logically has the required value, false otherwise
 */
export const CHECK_REQUIRED_METHOD = Symbol("checkRequired");

/**
 * Establishes minimum value length check protocol: a function of signature: `[CHECK_MIN_LENGTH_METHOD](context, minLength): bool`.
 * Returns true if the implementing object logically has the value of at least the required length, false otherwise
 */
export const CHECK_MIN_LENGTH_METHOD = Symbol("checkMinLength");

/**
 * Establishes maximum value length check protocol: a function of signature: `[CHECK_MAX_LENGTH_METHOD](context, maxLength): bool`.
 * Returns true if the implementing object logically has the value of at most the required length, false otherwise
 */
export const CHECK_MAX_LENGTH_METHOD = Symbol("checkMaxLength");



/**
 * Establishes a "dispose" deterministic finalization protocol - an entity which implements such method -
 * is capable of being deterministically finalized aka "disposed".
 * The concept has NOTHING TO DO with the GC, and deals with logical pairing of construction/destruction
 * of entities which need to finalize their lifecycle (e.g. write a trailer to disk file).
 * The standard is aligned with the new "using" resource block, as it uses system symbol when available
 */
export const DISPOSE_METHOD = (typeof Symbol.dispose === 'undefined') ? Symbol("dispose") : Symbol.dispose; //FIXME: Symbol.for

/**
 * When implemented, returns true if the object was already disposed.
 * This works in conjunction with {@link DISPOSE_METHOD} protocol
 */
export const DISPOSED_PROP = Symbol("disposed");

/**
 * When implemented in derived class, gets invoked by DISPOSE if the object has not been disposed yet
 * This is the method that descendants need to override
 */
export const DESTRUCTOR_METHOD = Symbol("destructor");

/**
 * Disposes object by invoking {@link DISPOSE_METHOD} protocol method returning true.
 * Returns false if the entity does not support disposable protocol
 * @param {*} v value to dispose (such as an object)
 * @returns true if disposable protocol was called, false if the entity does not support protocol
 */
export function dispose(v) {
  if (v !== undefined && v !== null) {
    const dsp = v[DISPOSE_METHOD];
    if (dsp !== undefined) {
      dsp.call(v);
      return true;
    }
  }
  return false;
}

/**
 * Try {@link body} using {@link disposable} and finally dispose of resource.
 * @param {Object} disposable any disposable resource
 * @param {Function} body any function that requires {@link disposable}
 */
export function doUsing(disposable, body) {
  aver_isNotNull(disposable);
  aver_isFunction(body);
  try { body(disposable); }
  finally { dispose(disposable); }
}

/**
 * Provides implementation base for disposable objects by implementing base system protocols
 */
export class DisposableObject {
  #disposed = false;

  /**
   * Establishes dispose protocol, see {@link DISPOSE_METHOD}.
   * Does nothing if the object was already disposed.
   * Override {@link DESTRUCTOR_METHOD} instead
   */
  [DISPOSE_METHOD]() {
    if (this.#disposed) return;
    this.#disposed = true;
    this[DESTRUCTOR_METHOD]();
  }

  /**
   * Override this method to perform custom actions on dispose
   */
  [DESTRUCTOR_METHOD]() { }

  /** Returns true if the object was already disposed */
  get [DISPOSED_PROP]() { return this.#disposed; }
}



/**
 * When implemented provides a friendly client-facing message for example for errors
 */
export const CLIENT_MESSAGE_PROP = Symbol("clientMessage");


/** Provides uniform base for Azos.js exceptions */
export class AzosError extends Error {
  #code;
  #from;

  /**
   * Creates a base error which has: message, code, from, and optional cause for daisy-chaining calls
   * @param {string} message
   * @param {string} from
   * @param {Error | object} cause
   * @param {int} code
   */
  constructor(message, from = null, cause = null, code = 0) {
    super(message);
    code |= 0;
    from = asString(from);
    this.#code = code;
    this.#from = from;
    let nm = `${this.constructor.name} ${code}`;
    if (!strings.isEmpty(from)) nm += ` @ '${from}'`;
    this.name = nm;
    this.cause = cause;
  }

  /** Returns client-facing message, such as a validation message */
  get [CLIENT_MESSAGE_PROP]() { return null; }

  /** Returns the name of the causing site - maps to "from" field in log chronicle */
  get from() { return this.#from; }

  /** Returns status code, by convention HTTP status codes are used, e.g. 400, 500 etc. */
  get code() { return this.#code; }

  /** Override to change namespace which is returned from external status */
  get ns() { return "js"; }

  toString() { return `${this.name}: ${this.message}` }

  /** Override to add details which are provided to callers via external status,
   * for example validation exception adds schema and field names so it can be structurally gotten
   * by the handler
   */
  provideExternalStatus() { return { ns: this.ns }; }
}

/** Provides uniform base for Localization-related exceptions */
export class LclError extends AzosError { //declared here to avoid circular reference between modules
  constructor(message, from = null, cause = null) { super(message, from, cause, 518); }
}

/** Thrown to indicate data validation problems e.g entity/model/field validation errors
 * when data does not comply with the set schema (a set of business rules)
*/
export class ValidationError extends AzosError {
  #schema;
  #field;
  #scope;
  #clientMessage;

  /**
   * Creates an instance of ValidationError capturing (`schema`, `field`, `scope`, `message`, `clientMessage`, `from`, and `cause`) parameters
   * @param {String} schema - required schema name. In the UI code this is typically passed from an `azElm.effectiveSchema` property
   * @param {String} field - required field name within a schema
   * @param {String} scope - optional field subscript, for example an array indexer, which tells what entity instance generated an error; or null
   * @param {String} message - required validation message. Clients get shown `clientMessage` unless it is not supplied then this one is used
   * @param {String} clientMessage - an optional user-friendly client UI display message
   * @param {String} from - optional. What sub/component generated the error
   * @param {object} cause - optional. Inner causing exception (if any)
   */
  constructor(schema, field, scope, message, clientMessage = null, from = null, cause = null) {
    super(message, from, cause, 400);
    this.#schema = aver_isNonEmptyString(schema);
    this.#field = aver_isNonEmptyString(field);
    this.#scope = aver_isStringOrNull(scope ?? null);
    this.#clientMessage = aver_isStringOrNull(clientMessage);
  }

  /** Override to change namespace which is returned from external status */
  get ns() { return "data.val"; }

  /** Name of the schema which triggers validation error */
  get schema() { return this.#schema; }

  /** Name of the field which triggers validation error */
  get field() { return this.#field; }

  /** Name of the field sub-scope, such as an array/collection subscript e.g. Field: `Doctors`, Scope: `[3]` */
  get scope() { return this.#scope; }

  /** Allows to provide a user-friendly message which is shown in the UI */
  get clientMessage() { return this.#clientMessage; }

  get [CLIENT_MESSAGE_PROP]() { return strings.dflt(this.clientMessage, this.message); }

  toString() { return `${this.name}: {${this.schema}.${this.field}.${this.scope ?? "*"}} ${this.message}` }

  /** Override to add details which are provided to callers via external status,
   * for example validation exception adds schema and field names so it can be structurally gotten
   * by the handler
   */
  provideExternalStatus() { return { ns: this.ns, schema: this.schema, field: this.field, scope: this.scope, clientMessage: this[CLIENT_MESSAGE_PROP] }; }
}


/**
 * Returns true if the argument is assigned - not undefined non-null value, even an empty string is assigned
 * @param {*} v value
 */
export function isAssigned(v) {
  return v !== undefined && v !== null;//warning:  if (!v) is not the same test!
}

/**
 * Shortcut to hasOwnProperty()
 * @param {*} obj object to test
 * @param {string|symbol} prop property to test
 */
export function hown(obj, prop) {
  // in 2023 a candidate for Object.hasOwn() which is not yet widely supported
  return obj ? hasOwnProperty.call(obj, prop) : false;
}

/**
 * Returns all object values as an array. Empty array for undefined or null.
 * Does NOT return values from prototype, only values on this object itself
 * Note: object.values() is not widely supported yet
 * @returns {[*]} Array of all object values
 */
export function allObjectValues(o) {
  if (!isAssigned(o)) return [];
  return Object.keys(o).map(k => o[k]);
}

/**
 * Deletes the first occurrence of the element in array.
 * Warning: this is an "unsafe" method as it does not do any args checks for speed
 * @param {Array} array to delete from
 * @param {*} elm element to delete
 * @returns {boolean} true if element was found and deleted
 */
export function arrayDelete(array, elm) {
  const idx = array.indexOf(elm);
  if (idx === -1) return false;
  array.splice(idx, 1);
  return true;
}

/**
 * Creates a shallow copy of the array.
 * Warning: this is an "unsafe" method as it does not do any args checks for speed
 */
export function arrayCopy(array) {
  return array.slice();
}

/**
 * Clears the array contents in-place.
 * Warning: this is an "unsafe" method as it does not do any args checks for speed
 * @param {Array} array to clear
 */
export function arrayClear(array) {
  array.length = 0;
  return array;
}

/**
 * Returns true if the argument is BigInt
 * @param {*} v
 */
export function isBigInt(v) {
  return Object.prototype.toString.call(v) === "[object BigInt]";
}

/**
 * Returns true if the argument is a non null string
 * @param {*} v
 */
export function isString(v) {
  return Object.prototype.toString.call(v) === "[object String]";
}

/**
 * Returns true if the argument is a non null date
 * @param {*} v
 */
export function isDate(v) {
  return Object.prototype.toString.call(v) === "[object Date]";
}

/**
 * Returns true when the passed parameter is an array, not a map or function
 * @param {*} v
 */
export function isArray(v) {
  return Object.prototype.toString.call(v) === "[object Array]";
}

/**
 * Returns true when the passed parameter is an object, not an array or function
 * @param {*} v
 */
export function isObject(v) {
  return v === Object(v) && !isArray(v) && !isFunction(v);
}

/**
 * Returns true when the passed parameter is an array, or object but not a function
 * @param {*} v
 */
export function isObjectOrArray(v) {
  return v === Object(v) && !isFunction(v);
}

/**
 * Returns true when passed parameter is a function, not a map object or an array
 * @param {*} v
 */
export function isFunction(v) {
  const t = Object.prototype.toString.call(v);
  return t === "[object Function]" || t === "[object GeneratorFunction]" || t === "[object AsyncFunction]";
}

/**
 * Returns true when the passed parameter is a function, or object but not an array or primitive
 * @param {*} v
 */
export function isObjectOrFunction(v) {
  return v === Object(v) && !isArray(v);
}

/**
 * Returns true when the passed value implements Iterable protocol
 * @param {*} v
 */
export function isIterable(v) {
  return isAssigned(v) && isFunction(v[Symbol.iterator]);
}


/**
 * Returns true if the argument is an int32 value
 * @param {*} v
 */
export function isInt32(v) {
  if (Number.isInteger) return Number.isInteger(v);
  return v === (v | 0);
}

/**
 * Returns true if the value is either integer number or a string representing an integer number
 * @param {int|string} v Value to check
 */
export function isIntValue(v) {
  if (isNaN(v)) return false;
  let x = parseFloat(v);
  return x === (x | 0);
}

/**
 * Return true if the value is a Number
 * @param {*} v Value to check
 */
export function isNumber(v) {
  return Object.prototype.toString.call(v) === "[object Number]";
}

/**
 * Return true if the value is a boolean
 * @param {*} v Value to check
 */
export function isBool(v) {
  return Object.prototype.toString.call(v) === "[object Boolean]";
}

/**
 * Return true if the value is a symbol
 * @param {*} v Value to check
 */
export function isSymbol(v) {
  return Object.prototype.toString.call(v) === "[object Symbol]";
}


/**
 * Describes the type of value returning the string description, not type moniker.
 * Keep in mind that in JS typeof(new String|Date|Number|Boolean(x)) is object, not the actual type, hence this method :)
 * @param {*} v
 */
export function describeTypeOf(v) {
  if (v === undefined) return CC.UNDEFINED;
  if (v === null) return CC.NULL;

  // typeof( Boolean(true)) === 'boolean'
  // typeof( new Boolean(true)) === 'object'
  // same for Date, Number, String, [] === object etc


  if (isDate(v)) return "date";
  if (isFunction(v)) return "function";
  if (isString(v)) return "string";
  if (isArray(v)) return "array";
  if (isNumber(v)) return "number";
  if (isBool(v)) return "boolean";
  if (isIterable(v)) return typeof (v) + "+Iterable";

  return typeof (v);
}

/**
 * Returns the class function(constructor) of the instance or null if not an object
 * @param {Object} obj object instance to get a class function from
 * @returns Constructor function of the object or null
 */
export function classOf(obj) {
  if (!isObject(obj)) return null;
  let result = obj.constructor;
  return result;
}

/**
 * Returns the parent class (prototype) of the specified class (function) or null if the class is the top-most class
 * @param {function} cls class to get a parent of
 */
export function parentOfClass(cls) {
  if (!isFunction(cls)) return null;
  let result = Object.getPrototypeOf(cls);
  return result.name === "" ? null : result;
}

/**
 * Returns true when `t` is a direct or indirect subtype of `base`, both being assigned functions
 * @param {Function} t a type to check
 * @param {Function} base base type
 * @returns {boolean} true when `t` is a subtype of `base`
 */
export function isSubclassOf(t, base) {
  if (!isFunction(t) || !isFunction(base)) return false;
  return t.prototype instanceof base;
  // while(t!==null){
  //   t = parentOfClass(t);
  //   if (t === base) return true;
  // }
  // return false;
}

/**
 * Mixes in an extension's own keys into an object, conditionally keeping existing keys even if null
 * @param {Object} obj An object to mix into
 * @param {Object} ext An extension to mix into obj
 * @param {boolean} [keepExisting=false] True to keep existing props even if they are null
 */
export function mixin(obj, ext, keepExisting = false) {
  if (!isAssigned(obj)) return null;
  if (!isAssigned(ext)) return obj;

  if (!keepExisting) {
    for (let prop in ext)
      if (hown(ext, prop))
        obj[prop] = ext[prop];
  } else {
    for (let prop in ext)
      if (hown(ext, prop) && !hown(obj, prop))
        obj[prop] = ext[prop];
  }
  return obj;
}


/**
  * @typedef {Object} NavResult
  * @property {Object} orig origin, the first object in a chain of navigation
  * @property {Object} root the root to which this path is applied
  * @property {boolean} full True if full path match was made
  * @property {Object} value the value of navigation, may be undefined and is set to however far the func could navigate
  * @property {Object} result only sett on full path match, may be undefined if that is what was matched, check .full
  * @property {Object} nav chain call function does curries the current object
  */


/**
 * Tries to navigate the path as far a s possible starting at the root object
 * @param {Object|Array} obj Required root object of navigation
 * @param {string|string[]} path Rquired path as '.' delimited segments, or array of strings
 * @param {Object|Array} org Optional origin of the chain, used by chain nav() calls
 * @returns {NavResult} Navigation result object
 */
export function nav(obj, path, org) {
  let result = {
    orig: isAssigned(org) ? org : obj,
    root: obj,
    full: undefined,
    value: undefined,
    result: undefined,
    nav: (p) => nav(result.value, p, result.orig)
  };

  if (!isAssigned(obj)) return result;
  if (!isAssigned(path)) return result;

  if (isString(path)) {
    path = path.split(".").filter(s => s.length > 0);
  }

  result.full = false;
  result.value = obj;
  for (let i in path) {
    if (!isObjectOrArray(result.value)) return result;

    let seg = path[i];
    if (!(seg in result.value)) return result;
    let sub = result.value[seg];

    result.value = sub;
  }

  result.full = true;
  result.result = result.value;
  return result;
}

/**
 * Returns false only if an iterable was supplied and it yields at least one value, true in all other cases
 * @param {*} iterable Iterable object
 */
export function isEmptyIterable(iterable) {
  if (!isIterable(iterable)) return true;
  const iterator = iterable[Symbol.iterator]();
  return iterator.next().done === true;
}

/**
 * Ensures that the result is always a string representation of a primitive v, an empty one for null or undefined (unless canUndef is true).
 * Non-string values are coerced using v.toString(), objects are NOT JSONized
 * @param {*} v Value
 * @param {boolean} canUndef True to preserve undefined
 */
export function asString(v, canUndef = false) { return strings.asString(v, canUndef); }


/**
 * Returns true if the argument is a non-empty value of a string type
 * @param {*} v value
 */
export function isNonEmptyString(v) {
  if (!isString(v)) return false;
  return !strings.isEmpty(v);
}


/** Character cases */
export const CHAR_CASE = Object.freeze({ ASIS: "asis", UPPER: "upper", LOWER: "lower", CAPS: "caps", CAPSNORM: "capsnorm" });
const ALL_CHAR_CASES = allObjectValues(CHAR_CASE);

/** Data Entry field kinds */
export const DATA_KIND = Object.freeze({
  TEXT: "text",
  SCREENNAME: "screenname",
  URL: "url",
  TEL: "tel",
  PHONE: "tel",
  EMAIL: "email",
  COLOR: "color",
  DATE: "date",
  DATETIME: "datetime",
  DATETIMELOCAL: "datetime-local",
  PASSWORD: "pwd",
  TIME: "time"
});
const ALL_DATA_KINDS = allObjectValues(DATA_KIND);

export const FORM_MODE = Object.freeze({
  UNSPECIFIED: "Unspecified",
  INSERT: "Insert",
  UPDATE: "Update",
  DELETE: "Delete",
});
//const ALL_FORM_MODES = allObjectValues(FORM_MODE);

/**
 * Converts value to CHAR_CASE coercing it to lowercase string if needed
 * @param {*} v value to convert
 * @returns {CHAR_CASE}
 */
export function asCharCase(v) {
  v = strings.asString(v).toLowerCase();
  if (strings.isOneOf(v, ALL_CHAR_CASES, true)) return v;
  return CHAR_CASE.ASIS;
}


/**
 * Converts value to DATA_KIND coercing it to lowercase string if needed
 * @param {*} v value to convert
 * @returns {DATA_KIND}
 */
export function asDataKind(v) {
  v = strings.asString(v).toLowerCase();
  if (strings.isOneOf(v, ALL_DATA_KINDS, true)) return v;
  return DATA_KIND.TEXT;
}

export function getFormMode(f) {
  isObject(f);

  // function parseFormMode(str) {
  //   return FORM_MODE[str]
  // }
  let mode = f["mode"]?.toLowerCase(); // TODO: parseFormMode(f["mode"])
  switch (mode) {
    case FORM_MODE.INSERT.toLowerCase(): return FORM_MODE.INSERT;
    case FORM_MODE.UPDATE.toLocaleLowerCase(): return FORM_MODE.UPDATE;
    case FORM_MODE.DELETE.toLowerCase(): return FORM_MODE.DELETE;
    default: return FORM_MODE.UNSPECIFIED;
  }
}

export function isInsertForm(f) { return getFormMode(f) === FORM_MODE.INSERT; }

export function isUpdateForm(f) { return getFormMode(f) === FORM_MODE.UPDATE; }

export function isDeleteForm(f) { return getFormMode(f) === FORM_MODE.DELETE; }


export const AS_BOOLEAN_FUN = Symbol("asBoolean");
const TRUISMS = Object.freeze(["true", "t", "yes", "1", "ok"]);

/**
 * Converts primitives into bool. Uses AS_BOOLEAN_FUN on objects.
 * Yields true only on (bool)true, 1, or ["true", "t", "yes", "1", "ok"]
 * @param {any} v object to test
 */
export function asBool(v) {
  if (!v) return false;
  if (v === true || v === 1) return true;
  if (isFunction(v[AS_BOOLEAN_FUN])) return v[AS_BOOLEAN_FUN]() === true;
  return strings.isOneOf(v, TRUISMS);
}

/**
 * Converts primitives into a tri-state bool. Tri state bool values are {undefined|false|true}
 * Uses AS_BOOLEAN_FUN on objects, respecting undefined value.
 * Yields true only on (bool)true, 1, or ["true", "t", "yes", "1", "ok"]. Undefined input is returned as-is
 * @param {any} v object to test
 */
export function asTriBool(v) {
  if (v === undefined) return undefined;
  if (!v) return false;
  if (v === true || v === 1) return true;
  if (isFunction(v[AS_BOOLEAN_FUN])) {
    const r = v[AS_BOOLEAN_FUN]();
    if (r === undefined) return undefined;
    return r === true;
  }
  return strings.isOneOf(v, TRUISMS);
}

export const AS_INTEGER_FUN = Symbol("asInt");

export const REXP_HEX = /^[0-9, a-f, A-F]+$/;
export const REXP_BIN = /^[0-1]+$/;
export const REXP_NUMBER = /^[-+]?(?:[0-9]{0,30}\.)?[0-9]{1,30}(?:[Ee][-+]?[1-2]?[0-9])?$/;

const CAST_ERROR = "Cast error: ";

/**
 * Converts value to and integer number. Respects 0x and 0b prefixes for hex and binary.
 * Unlike parseInt() does NOT allow trailing non-convertible characters.
 * Throws if string conversion is not possible
 * Uses AS_INTEGER_FUN on objects, respecting undefined value.
 * @param {*} v value to convert.
 * @param {boolean} [canUndef=false] Whether undefined is allowed
 */
export function asInt(v, canUndef = false) {
  if (v === undefined) return canUndef ? undefined : 0;
  if (v === null) return 0;

  if (isFunction(v[AS_INTEGER_FUN])) {
    const r = v[AS_INTEGER_FUN]();
    if (r === undefined) return canUndef ? undefined : 0;
    if (r === null) return 0;
    return r | 0;
  }

  if (isString(v)) {
    const ov = v;
    v = strings.trim(v);
    if (v.startsWith("0x")) {
      v = v.substring(2);
      v = (REXP_HEX.test(v)) ? parseInt(v, 16) : NaN;
    } else if (v.startsWith("0b")) {
      v = v.substring(2);
      v = (REXP_BIN.test(v)) ? parseInt(v, 2) : NaN;
    } else {
      v = (REXP_NUMBER.test(v)) ? parseFloat(v) : NaN;
    }
    if (isNaN(v)) throw new AzosError(CAST_ERROR + `asInt("${strings.describe(ov)}")`);
  }

  return v | 0;
}

/**
 * Converts value to real number (contrast with asInt())
 * @param {*} v value to convert.
 * @param {boolean} [canUndef=false] Whether undefined is allowed
 */
export function asReal(v, canUndef = false) {
  if (v === undefined) return canUndef ? undefined : 0;
  if (v === null) return 0;

  if (isString(v)) {
    const ov = v;
    v = strings.trim(v);
    v = (REXP_NUMBER.test(v)) ? parseFloat(v) : NaN;
    if (isNaN(v)) throw new AzosError(CAST_ERROR + `asReal("${strings.describe(ov)}")`);
  }
  return 1.0 * v;
}

/** Multiplier used for money operations */
export const MONEY_MULT = 10000;

/**
 * Converts value to 4-decimal point fixed number without rounding of the 5th digit
 * @param {*} v value to convert.
 * @param {boolean} [canUndef=false] Whether undefined is allowed
 */
export function asMoney(v, canUndef = false) {
  v = asReal(v, canUndef);
  if (v === undefined) return undefined;
  return ((v * MONEY_MULT) | 0) / MONEY_MULT;
}

/**
 * Converts value to Date
 * @param {*} v value to convert.
 * @param {boolean} [canUndef=false] Whether undefined is allowed
 */
export function asDate(v, canUndef = false, fromUTC = false) {
  let d, ts;
  if (v === undefined) canUndef ? d = undefined : d = new Date(0);
  else if (v === null) d = new Date(0);
  else if (isDate(v)) d = v;
  else if (isIntValue(v)) d = new Date(asInt(v));
  else if (isString(v) && !isNaN((ts = Date.parse(v)))) d = new Date(ts);
  else throw new AzosError(CAST_ERROR + `asDate("${strings.describe(v)}")`);
  if (!fromUTC || !d) return d;
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
}

/**
 * Converts value to object/map (not array). The value has to be an object or object content in JSON format
 * @param {*} v value to convert.
 * @param {boolean} [canUndef=false] Whether undefined is allowed
 */
export function asObject(v, canUndef = false) {
  if (v === undefined) return canUndef ? undefined : null;
  if (v === null) return null;
  if (isObject(v)) return v;

  try {
    let obj = JSON.parse(asString(v));
    if (!isObject(obj)) throw new AzosError(CAST_ERROR + `asObject("${strings.describe(v)}") -> not object`);
    return obj;
  } catch (e) {
    throw new AzosError(CAST_ERROR + `asObject("${strings.describe(v)}") -> ${e.message}`);
  }
}

/**
 * Converts value to array (not object map). The value has to be an array, iterable object, or array content in JSON format
 * @param {*} v value to convert.
 * @param {boolean} [canUndef=false] Whether undefined is allowed
 */
export function asArray(v, canUndef = false) {
  if (v === undefined) return canUndef ? undefined : null;
  if (v === null) return null;
  if (isArray(v)) return v;
  if (isIterable(v) && !isString(v)) return [...v];

  try {
    let arr = JSON.parse(asString(v));
    if (!isArray(arr)) throw new AzosError(CAST_ERROR + `asArray("${strings.describe(v)}") -> not array`);
    return arr;
  } catch (e) {
    throw new AzosError(CAST_ERROR + `asArray("${strings.describe(v)}") -> ${e.message}`, "asArray()", e);
  }
}

export function asAtom(v, canUndef = false) {
  if (v === undefined) return canUndef ? undefined : null;
  if (v === null) return null;
  if (v instanceof Atom) return v;

  try {
    let atom = Atom.encode(v);
    return atom;
  } catch (e) {
    throw new AzosError(CAST_ERROR + `asAtom("${strings.describe(v)}") -> ${e.message}`, "asAtom()", e);
  }
}

export function asEntityId(v, canUndef = false) {
  if (v === undefined) return canUndef ? undefined : null;
  if (v === null) return null;
  if (v instanceof EntityId) return v;

  try {
    let entityId = EntityId.parse(v);
    return entityId;
  } catch (e) {
    throw new AzosError(CAST_ERROR + `asEntityId("${strings.describe(v)}") -> ${e.message}`, "asEntityId()", e);
  }
}

/** Data Type Monikers */
export const TYPE_MONIKER = Object.freeze({
  STRING: "str",
  INT: "int",
  REAL: "real",
  MONEY: "money",
  BOOL: "bool",
  DATE: "date",
  OBJECT: "object",
  ARRAY: "array",
  ATOM: "atom",
  ENTITY_ID: "eid",
});
const ALL_TYPE_MONIKERS = allObjectValues(TYPE_MONIKER);

/**
 * Converts value into a valid TYPE_MONIKER member
 * @param {*} v string moniker
 * @returns {TYPE_MONIKER} .STRING as default
 */
export function asTypeMoniker(v) {
  v = strings.asString(v).toLowerCase();
  if (strings.isOneOf(v, ALL_TYPE_MONIKERS, true)) return v;
  return TYPE_MONIKER.STRING;
}

/**
 * Performs value type cast per type moniker
 * @param {*} v Value to cast
 * @param {TYPE_MONIKER} tmon type moniker
 * @param {boolean} [canUndef] true to allow undefined values
 */
export function cast(v, tmon, canUndef = false) {
  if (arguments.length < 2) throw new AzosError("cast(v, tmon) missing 2 req args");
  tmon = asTypeMoniker(tmon);

  switch (tmon) {
    case TYPE_MONIKER.STRING: return asString(v, canUndef);
    case TYPE_MONIKER.INT: return asInt(v, canUndef);
    case TYPE_MONIKER.REAL: return asReal(v, canUndef);
    case TYPE_MONIKER.MONEY: return asMoney(v, canUndef);
    case TYPE_MONIKER.BOOL: return canUndef ? asTriBool(v) : asBool(v);
    case TYPE_MONIKER.DATE: return asDate(v, canUndef);
    case TYPE_MONIKER.OBJECT: return asObject(v, canUndef);
    case TYPE_MONIKER.ARRAY: return asArray(v, canUndef);
    case TYPE_MONIKER.ATOM: return asAtom(v, canUndef);
    case TYPE_MONIKER.ENTITY_ID: return asEntityId(v, canUndef);
    default: return asString(v, canUndef);
  }
}


//crypto module is NOT loaded by default on node. Need async fallback.
//On browser it is pre-loaded as-is
//let cryptoModule = null;
let cryptoModule = typeof (window) !== "undefined" ? window.crypto : null;

////20231226 DKh commented because parcel browserifies this with 3.5 mb of polyfill which we do not need
//// If you need to run this on node, we will figure it out in future using import vuia Data uri see:
////  https://2ality.com/2019/10/eval-via-import.html
// if (typeof crypto === "undefined"){
//   import('node:crypto').then(mod => cryptoModule = mod);
// }else{
//   cryptoModule = crypto;
// }

/**
 * Gets an instance of {@link Uint8Array} filled with random bytes
 * based on crypto api facade
 * @param {int} cnt
 */
export function getRndBytes(cnt = 16) {
  cnt = cnt | 0;
  if (cnt <= 0) cnt = 16;
  const buf = new Uint8Array(cnt);
  if (cryptoModule !== null) {
    cryptoModule.getRandomValues(buf);
  } else { //async fallback, use pseudo generation
    let s1 = performance.now() * 1000 | 0;
    let s2 = Date.now() | 0;
    let r = 0;
    for (let i = 0; i < cnt; i++) {
      if (r == 0) r = Math.random() * 0xffffffff | 0;
      buf[i] = r & 0xff;
      r = r >>> 8;
      if (s1 > 0) {
        buf[i] = buf[i] ^ (s1 & 0xff);
        s1 = s1 >>> 8;
      } else if (s2 > 0) {
        buf[i] = buf[i] ^ (s2 & 0xff);
        s2 = s2 >>> 8;
      }
    }
  }

  return buf;
}

/**
 * Generates a new v4 random guid
 * @returns {string} guid representation
 */
export function genGuid() {
  if (cryptoModule !== null && cryptoModule.randomUUID) return cryptoModule.randomUUID();

  let rnd = getRndBytes(16);
  rnd[6] = 0x40 | (rnd[6] & 0x0f);
  rnd[8] = 0xc0 | (rnd[8] & 0x1f) | (rnd[8] & 0x0f);//Msft 110x type

  const srnd = strings.bufToHex(rnd);
  const guid = `${srnd.slice(0, 8)}-${srnd.slice(8, 12)}-${srnd.slice(12, 16)}-${srnd.slice(16, 20)}-${srnd.slice(20)}`;
  return guid;
}

/** @returns a deferred promise capable of being destructured rather than wrapping code in a Promise executor fn. */
export function deferredPromise() {
  let resolve, reject;
  const promise = new Promise((res, rej) => [resolve, reject] = [res, rej]);
  return { promise, resolve, reject };
}

/** Macro caps value at minimum. No type checks are done */
export function atMin(v, min) { return v < min ? min : v; }
/** Macro caps value at maximum. No type checks are done */
export function atMax(v, max) { return v > max ? max : v; }
/** Macro keeps value between min/max. No type checks are done */
export function keepBetween(v, min, max) { return v > min ? (v > max ? max : v) : min; }

/**
 * Takes a value, coercing it to string, optionally passing-through an undefined value;
 * trims it and optionally checks of leading and trailing forward slashes
 * @param {string} uri uri to process
 * @param {boolean?} lsl true to check for leading slash, if not present then it will be added
 * @param {boolean?} tsl true to check for trailing slash, if not present then it will be added
 * @param {boolean?} canUndef true to pass `undefined` through as-is
 * @returns {string} uri
 */
export function trimUri(uri, lsl = false, tsl = false, canUndef = false) {
  uri = strings.asString(uri, canUndef);
  if (uri === undefined) return undefined;
  uri = uri.trim();
  if (lsl) {
    if (!uri.startsWith("/")) uri = "/" + uri;
  }

  if (tsl) {
    if (!uri.endsWith("/")) uri = uri + "/";
  }

  return uri;
}

/**
 * Sort the json object's keys in alphabetic order.
 * @param {JSON} json the json object whose keys to sort
 * @returns the json object with sorted keys
 */
export function sortJsonKeys(json) {
  return Object.keys(json).sort().reduce(
    (obj, key) => {
      obj[key] = json[key];
      return obj;
    },
    {}
  );
}

export function hoursBetween(date1, date2) { return minutesBetween(date1, date2) / 60; }
export function hoursBetweenAbs(date1, date2) { return minutesBetweenAbs(date1, date2) / 60; }

export function minutesBetween(date1, date2) { return secondsBetween(date1, date2) / 60; }
export function minutesBetweenAbs(date1, date2) { return secondsBetweenAbs(date1, date2) / 60; }

export function secondsBetween(date1, date2) { return (aver_isDate(date2) - aver_isDate(date1)) / 1000; }
export function secondsBetweenAbs(date1, date2) { return Math.abs(aver_isDate(date2) - aver_isDate(date1)) / 1000; }
