/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/
import * as aver from "./aver.js";
import { trim } from "./strings.js";
import { AzosError, isBigInt, isNumber } from "./types.js";

/**
 * Provides an efficient representation of a system string value which contains from 1 up to 8 ASCII-only
 *  digit or letter characters packed and stored as ulong system primitive. Typically used for system IDs of assets
 *  such as log and instrumentation channels, codes and classifications (e.g. ISO codes).
 *  The use of atoms obviates the costly string allocations for various codes which pretty much remain
 *  the same for the application lifetime (e.g. ISO language, currency, country codes, various system component names etc..)
 *
 * The framework treats the type efficiently in many areas
 *  such as binary, BSON and JSON serialization. Short ID strings represented as Atom en masse greatly
 *  relieve the GC pressure in network/data processing apps.
 *
 * The ranges of acceptable characters are: '0..9|a..z' upper or lower case, and '-','_' which
 *  are the only allowed separators. Note, that other separators (such as '.','/','\' et.al.) are used in paths and other data structures
 *  hence they can not be used in atom string for simplicity and uniformity of design.
 *
 * WARNING: Atom type is designed to represent a finite distinct number of constant values (typically less than a few thousand), having
 *  most applications dealing with less than 100 atom values. Do not encode arbitrary strings as atoms as these
 *  bloat the system Atom intern pool
 *
 * REMARKS:
 * This type was purposely designed for bulk streaming/batch service applications which need to move
 *  large number of objects (100Ks / second) containing short strings which identify a limited set of system objects,
 *  for example log message channel IDs, app IDs, instrumentation data channels/ and the like.
 *  Since the value fits into CPU register and does not produce references with consequential garbage collection the
 *  overall performance may be improved sometimes 5x-10x.
 *
 * The trick is to NOT convert strings into ASCII via .Encode() (that is why it is a static method, not a .ctor)
 *  but instead rely on static readonly (constant) values for naming channels, applications and other system assets.
 *  Instead of emitting "app1" string value in every log message we can now emit and store just a ulong 8 byte primitive.
 *  The packing works right to left, so the ulong may be var-bit compressed (e.g. using ULEB, Bix, Slim etc.).
 *
 * The string value is constrained to ASCII-only digits, upper or lower case letters and the following separators:  '-','_'
 *
 * A note about sorting atoms on "string" aka "lexicographical" sorting: Atoms are integers, they sort as integers via `IComparable&lt;Atom&gt;`.
 *  The fact that an atom is encoded from a string does NOT mean that its sorting should coincide with sorting on its string value representation.
 *  If you need to sort atoms as strings, sort on `atom.Value: string` property which is still more efficient than using
 *  just strings as atom string values are self-interned automatically.
 */
export class Atom {

  /** The <bigint, string> map of <id, value> */
  static #sCache = new Map();

  /** Zero Constant */
  static ZERO = new Atom(0n);

  /**
   * Encodes a string value into an Atom. The value must contain ASCII only 1 to 8 characters
   *  conforming to [0..9|A..Z|a..z|_|-] pattern and may not have whitespaces, slashes or dots.
   *  Null is encoded as Atom(0).
   *
   * WARNING: There has to be a good reason to call this method in places other than constant declarations.
   *  The whole point of using atoms is to rely on pre-encoded constant values. Please evaluate carefully what your code does
   *  as dynamic atom encoding en mass does not make any sense
   *
   * WARNING: Atom type is designed to represent a finite distinct number of constant values (typically less than a few thousand), having
   *  most applications dealing with less than 100 atom values. Do not encode arbitrary strings as atoms as these
   *  bloat the system Atom intern pool
   *
   * @param {string|null} value null or string value to encode as Atom.id
   * @returns a new Atom with id set as encoded value
   */
  static encode(value = null) {
    if (value === null || value === 0n || value === 0) return Atom.ZERO;

    aver.isNonEmptyMinMaxString(value, 1, 8);

    let id = Atom.#fetchIdFromCacheByValue(value);

    if (id === undefined) { // not yet cached
      let ax = 0n;
      for (let i = 0; i < value.length; i++) {
        if (!Atom.#isValidCharacter(value[i]))
          throw new AzosError(`Invalid character: ${value[i]} Atom.Encode(![0..9|A..Z|a..z|_|-])`);

        let c = value.charCodeAt(i);
        ax |= BigInt(c) << BigInt(i * 8);
      }

      Atom.#sCache.set(ax, value); // cache it
      id = ax;
    }

    return new Atom(id);
  }

  /**
   * Tries to encode a string value into Atom. The value must contain ASCII only 1 to 8 characters
   *  conforming to [0..9|A..Z|a..z|_|-] pattern and may not contain whitespaces, slashes or dots.
   * Null is encoded as Atom(0).
   *
   * WARNING: There has to be a good reason to call this method in places other than constant declarations.
   *  The whole point of using atoms is to rely on pre-encoded constant values. Please evaluate carefully what your code does
   *  as dynamic atom encoding en mass does not make any sense
   *
   * WARNING: Atom type is designed to represent a finite distinct number of constant values (typically less than a few thousand), having
   *  most applications dealing with less than 100 atom values. Do not encode arbitrary strings as atoms as these
   *  bloat the system Atom intern pool
   *
   * @param {string | null} value null or string value to encode as Atom.id
   * @returns an EncodeResponse with ok representing whether encode was successful and
   *  value representing the encoded Atom or undefined if unsuccessful
   */
  static tryEncode(value /*:string | null*/ = null) {
    try {
      return { ok: true, value: Atom.encode(value) };
    } catch (e) {
      return { ok: false, value: undefined };
    }
  }

  /**
   * Tries to encode a string value into Atom. The value must contain ASCII only 1 to 8 characters
   *  conforming to [0..9|A..Z|a..z|_|-] pattern and may not contain whitespaces, slashes or dots.
   * Null is encoded as Atom(0).
   *
   * WARNING: There has to be a good reason to call this method in places other than constant declarations.
   *  The whole point of using atoms is to rely on pre-encoded constant values. Please evaluate carefully what your code does
   *  as dynamic atom encoding en mass does not make any sense
   *
   * WARNING: Atom type is designed to represent a finite distinct number of constant values (typically less than a few thousand), having
   *  most applications dealing with less than 100 atom values. Do not encode arbitrary strings as atoms as these
   *  bloat the system Atom intern pool
   *
   * @param {string | null} value null or string value to encode as Atom.id
   * @returns an EncodeResponse with ok representing whether encode was successful and
   *  value representing the encoded Atom or undefined if unsuccessful
   */
  static tryEncodeValueOrId(valueOrId) {
    if (valueOrId === null) return { ok: true, value: Atom.ZERO };

    valueOrId = trim(valueOrId);

    if (valueOrId.startsWith("#")) {
      valueOrId = valueOrId.substring(1);

      try {
        const ul = BigInt(valueOrId);
        return { ok: true, value: new Atom(ul) };
      } catch (e) {
        return { ok: false, value: undefined };
      }
    }
    return this.tryEncode(valueOrId);
  }


  /**
   *
   * @param {char} c the character code to validate
   * @returns Returns true if the character is valid per Atom rule: [0..9|A..Z|a..z|_|-]
   */
  static #isValidCharacter(c) {
    return (c >= '0' && c <= '9') ||
      (c >= 'A' && c <= 'Z') ||
      (c >= 'a' && c <= 'z') ||
      (c == '_' || c == '-');
  }

  /**
   * Retrieve an encoded id from cache by value.
   * @param {string} value the value with which an Atom would have been encoded
   * @returns the cached Atom.id or undefined
   */
  static #fetchIdFromCacheByValue(value) {
    for (let [k, v] of Atom.#sCache.entries()) { // get id from cached value
      if (v === value) return k;
    }
    return undefined;
  }


  #id;

  /**
   * bigint id value of the Atom. This value is the only value which Atom consists of
   *  (stores), hence Atoms fit in 64bit CPU registers 1:1
   */
  get id() { return this.#id; }

  /**
   * Returns string of up to 8 ASCII characters which this ID was constructed from.
   *  The implementation performs thread-safe interning of strings keyed on Atom.ID
   * @returns {string | null} null or the string representing the encoded id from cache
   */
  get value() {
    if (this.isZero) return null;

    const val = Atom.#sCache.get(this.#id); // get value from id
    if (val !== undefined) return val; // already cached

    let result = '';
    let ax = this.#id;

    for (let i = 0; i < 8; i++) {
      let c = ax & 0x0ffn;
      if (c === 0n) break;

      let char = String.fromCharCode(Number(c));

      if (!Atom.#isValidCharacter(char))
        throw new AzosError(`Invalid character: ${char} Atom.Decode(![0..9|A..Z|a..z|_|-])`);

      result += char;
      ax >>= 8n;
    }

    Atom.#sCache.set(this.#id, result); // cache it

    return result;
  }

  /** @returns {boolean} true when id === 0, not representing any string */
  get isZero() {
    return this.#id === 0n;
  }

  /**
   * @returns {boolean} true when the value is either zero or a string of valid Atom characters
   */
  get isValid() {
    if (this.isZero) return true;

    let ax = this.#id;

    for (let i = 0; i < 8; i++) {
      let c = ax & 0x0ffn;
      if (c === 0n) break;

      let char = String.fromCharCode(Number(c));

      if (!Atom.#isValidCharacter(char)) return false;

      ax >>= 8n;
    }

    return true;
  }

  /**
   * @returns {number} the character length of Atom
   */
  get length() {
    if (this.isZero) return 0;
    let length = 0;
    let ax = this.#id;

    while (ax > 0n) {
      length++;
      ax >>= 8n;
    }

    return length;
  }

  /**
   * Constructs an Atom from a bigint
   * @param {number|bigint} id the encoded number or bigint. number is passed to bigint constructor
   */
  constructor(id = 0n) {
    if (isBigInt(id))
      this.#id = id;
    else if (isNumber(id))
      this.#id = BigInt(id);
    else
      throw new AzosError("Should call encode()");
  }

  equals(other) {
    return this.#id === other.id;
  }

  compareTo(other) {
    if (this.#id < other.id) return -1
    else if (this.#id > other.id) return 1
    else return 0;
  }

  /**
   * Called before valueOf when types are changed.
   * @param {*} hint
   * @returns
   */
  [Symbol.toPrimitive](hint) {
    return hint === "number" ? this.#id : this.value;
  }

  /**
   * Called before toString
   * @returns value
   */
  valueOf() { return this.value; }

  /** important to keep this as Value because Atoms are used in many format strings (which uses toString()) */
  toString() { return this.value; }

  toJSON() { return this.value || '#0'; }
}
