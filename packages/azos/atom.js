/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/
import * as aver from "./aver.js";
import { trim } from "./strings.js";
import { AzosError, isBigInt, isNumber } from "./types.js";

export class Atom {

  static #sCache = new Map/*<bigint, string>*/();
  static ZERO = new Atom(0n);

  static encode(value /*:string | null */ = null) {
    if (value === null || value === 0n || value === 0) return Atom.ZERO;

    aver.isNonEmptyMinMaxString(value, 1, 8);

    let id = undefined;
    for (let [k, v] of Atom.#sCache.entries()) {
      if (v === value) {
        id = k;
        break;
      }
    }

    if (id === undefined) {
      let ax = 0n;
      for (let i = 0; i < value.length; i++) {
        let c = value.charCodeAt(i);

        if (!Atom.#isValidCharacter(value[i]))
          throw new AzosError(`Invalid character: ${value[i]} Atom.Encode(![0..9|A..Z|a..z|_|-])`);

        ax |= BigInt(c) << BigInt(i * 8);
      }

      Atom.#sCache.set(ax, value);
      id = ax;
    }

    return new Atom(id);
  }

  static tryEncode(value /*:string | null*/ = null) {
    try {
      return { ok: true, value: Atom.encode(value) };
    } catch (e) {
      return { ok: false, value: undefined };
    }
  }

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
    return { ok: false, value: undefined };
  }

  static #isValidCharacter(c) {
    return (c >= '0' && c <= '9') ||
      (c >= 'A' && c <= 'Z') ||
      (c >= 'a' && c <= 'z') ||
      (c == '_' || c == '-');
  }



  /**
   * BigInt value of the Atom. This value is the only value which Atom
   *  consists of (stores), hence Atoms fit in 64bit CPU registers 1:3
   */
  #id /* : BigInt */;

  get id() { return this.#id; }

  get value() /*: string | null */ {
    if (this.isZero) return null;

    const val = Atom.#sCache.get(this.#id);
    if (val !== undefined) return val;

    let result = '';
    let ax = this.#id;

    for (let i = 0; i < 8; i++) {
      let c = ax & 0x0ffn;
      if (c == 0n) break;

      let char = String.fromCharCode(Number(c));

      if (!Atom.#isValidCharacter(char))
        throw new AzosError(`Invalid character: ${c[i]} Atom.Decode(![0..9|A..Z|a..z|_|-])`);

      result += char;
      ax >>= 8n;
    }

    Atom.#sCache.set(this.#id, result);

    return result;
  }

  /**
   * Returns true when id == 0, not representing any string
   */
  get isZero() {
    return this.#id === 0n;
  }

  /**
   * Returns true when the value is either zero or a string of valid Atom characters
   */
  get isValid() {
    if (this.isZero) return true;

    let ax = this.#id;

    for (let i = 0; i < 8; i++) {
      let c = ax & 0xff;
      if (c == 0) break;

      if (!Atom.#isValidCharacter(c)) return false;

      ax >>= 8;
    }

    return true;
  }

  /**
   * Returns the character length of Atom
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
   * @returns
   */
  valueOf() {
    return this.#id;
  }

  toString() {
    return this.value || '';
  }

  toJSON() {
    return this.value || '#0';
  }
}
