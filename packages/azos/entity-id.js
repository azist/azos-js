/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Atom } from "./atom.js";
import * as aver from "./aver.js";
import * as types from "./types.js";

export class EntityId {
  static TYPE_PREFIX = '@';
  static SCHEMA_DIV = '.';
  static SYS_PREFIX = '::';

  static fromComposite(system, compositeAddress, type = Atom.ZERO, schema = Atom.ZERO) {
    const address = JSON.stringify(types.sortJsonKeys(compositeAddress));
    return new EntityId(system, type, address, schema);
  }

  /**
   * Try to parse the given `value` into an @EntityId Returns a ParseResponse
   * @param {string} value
   * @returns the parsed @EntityId | null
   */
  static parse(value) {
    aver.isNonEmptyString(value);

    let sysIdx = value.indexOf(EntityId.SYS_PREFIX);
    if (sysIdx < 1 || sysIdx === value.length - EntityId.SYS_PREFIX.length) {
      throw types.AzosError("Invalid system");
    }

    let systemPart = value.substring(0, sysIdx);
    let address = value.substring(sysIdx + EntityId.SYS_PREFIX.length);
    let type = undefined;
    let schema = undefined;

    if (types.isNonEmptyString(address)) {
      throw types.AzosError("Invalid address");
    }

    let typeIdx = systemPart.indexOf(EntityId.TYPE_PREFIX);
    if (typeIdx >= 0) {
      if (typeIdx === systemPart.length - 1) {
        throw types.AzosError("Invalid type");
      }

      let typePart = systemPart.substring(0, typeIdx);
      systemPart = systemPart.substring(typeIdx + 1);

      const typeSchemaPart = typePart.split(EntityId.SCHEMA_DIV);

      type = typeSchemaPart[0];
      schema = typeSchemaPart[1] || null;
    }

    return new EntityId(systemPart, type, schema, address);
  }

  /**
   * Parse the given `value` into an @EntityId Throws when unable.
   * @param {string} value
   * @throws when unable to parse `value`
   */
  static tryParse(value) {
    try {
      return { ok: true, value: EntityId.parse(value) }
    } catch (e) {
      return { ok: false, value: undefined };
    }
  }

  #system;
  #type;
  #schema;
  #address; // probably capped @ 256 or 512

  /** System id, non zero for assigned values */
  get system() { return this.#system; }

  /** Entity type. It may be Zero for a default type */
  get type() { return this.#type; }

  /** Address schema. It may be Zero if not specified */
  get schema() { return this.#schema; }

  /** Address for entity per Type and System */
  get address() { return this.#address; }

  /**
   * If the address is composite, JSON parse it and gimme gimme
   * @throws if not composite. Call `.isCompositeAddress()` first to forego throws.
   */
  get compositeAddress() {
    aver.isTrue(this.isCompositeAddress);
    return JSON.parse(this.address);
  }

  /** Check if the address is a composite address */
  get isCompositeAddress() {
    return this.address.startsWith("{") && this.address.endsWith("}");
  }

  /**
   * Construct an EntityId object
   * @param {Atom} system required
   * @param {Atom} type optional
   * @param {Atom} schema
   * @param {string} address
   */
  constructor(system/*:Atom*/, type/*:Atom*/ = Atom.ZERO, schema/*:Atom*/ = Atom.ZERO, address/*:string*/) {
    this.#system = aver.isOf(system, Atom);
    if (this.#system.isZero) {
      throw aver.AzosError("Required sys.isZero");
    }

    this.#type = aver.isOf(type, Atom);
    this.#schema = aver.isOf(schema, Atom);
    this.#address = aver.isNonEmptyString(address);
  }

  equals(other) {
    aver.isOf(other, EntityId);
    return this.type === other.type &&
      this.schema === other.schema &&
      this.system === other.system &&
      this.address === other.address;
  }

  compareTo(other) {
    aver.isOf(other, EntityId);
    if (this.equals(other)) return 0;
    else if (this.system.id < other.system.id) return -1;
    else if (this.system.id > other.system.id) return 1;
    else if (this.type.id < other.type.id) return -1;
    else if (this.type.id > other.type.id) return 1;
    else if (this.schema.id < other.schema.id) return -1;
    else if (this.schema.id > other.schema.id) return 1;
    else if (this.address < other.address) return -1;
    else if (this.address > other.address) return 1;
    else return 0; // but really, they're equal so this is essentially a noop.
  }

  valueOf() { return this.toString(); }

  toString() {
    if (!this.isAssigned) return "";
    if (this.type.isZero) return this.system + EntityId.SYS_PREFIX + this.address;
    if (this.schema.isZero) return this.type + EntityId.TYPE_PREFIX + this.system + EntityId.SYS_PREFIX + this.address;
    return this.type.toString() + EntityId.SCHEMA_DIV + EntityId.TYPE_PREFIX + this.system + EntityId.SYS_PREFIX + this.address;
  }

  toJSON() {

  }
}
