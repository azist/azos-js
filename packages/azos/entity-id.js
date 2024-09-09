/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Atom } from "./atom.js";
import * as aver from "./aver.js";
import * as types from "./types.js";

/**
 * A tuple of (SYSTEM: Atom, TYPE: Atom, SCHEMA: Atom, ADDRESS: string) used for identification of entities in business systems.
 *  The concept is somewhat similar to an "URI" in its intended purpose, as it identifies objects by an "Address"
 *  string which is interpreted in a scope of "Type/Schema", which in turn is in the scope of a "System".
 *  As a string, an EntityId is formatted like: `type.schema@system::address`, for example: `car.vin@dealer::1A8987339HBz0909W874`
 *  vs `boat.license@dealer::I9973OD`. The system qualifier is required, but type (and schema) qualifier is optional, which denotes "default type"
 *  for example: `dealer::I9973OD` is a valid EntityId pointing to a "dealer" system "car" type with "license" address schema by default.
 *  The optional schema sub-qualifier defines the "schema" of addressing used per type, this way you can identify the same entity types within a system with
 *  different addressing schemas
 */
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
      throw new types.AzosError("Invalid system");
    }

    let systemPart = value.substring(0, sysIdx);
    let address = value.substring(sysIdx + EntityId.SYS_PREFIX.length);
    let typePart = null;
    let schemaPart = null;

    if (!types.isNonEmptyString(address)) {
      throw new types.AzosError("Invalid address");
    }

    let typeIdx = systemPart.indexOf(EntityId.TYPE_PREFIX);
    if (typeIdx >= 0) {
      if (typeIdx === systemPart.length - 1) {
        throw new types.AzosError("Invalid type");
      }

      typePart = systemPart.substring(0, typeIdx);
      systemPart = systemPart.substring(typeIdx + 1);

      const typeSchemaPart = typePart.split(EntityId.SCHEMA_DIV);

      typePart = typeSchemaPart[0];
      schemaPart = typeSchemaPart[1] || null;
    }

    const system = Atom.tryEncode(systemPart);
    if (!system.ok) throw new types.AzosError(`Unable to encode system atom ${systemPart}`);

    const type = Atom.tryEncode(typePart);
    if (!type.ok)  throw new types.AzosError(`Unable to encode type atom ${typePart}`);

    const schema = Atom.tryEncode(schemaPart);
    if (!schema.ok)  throw new types.AzosError(`Unable to encode schema atom ${schemaPart}`);

    return new EntityId(system.value, type.value, schema.value, address);
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

  /** Check if the address is a composite address - starts with '{', ends with '}' */
  get isCompositeAddress() {
    return this.address.startsWith("{") && this.address.endsWith("}");
  }

  /**
   * If the address is composite, JSON parse it and gimme gimme
   * @throws if not composite. @see .isCompositeAddress() to forego throws.
   */
  get compositeAddress() {
    aver.isTrue(this.isCompositeAddress);
    return JSON.parse(this.address);
  }

  /**
   * Initializes an EntityId instance
   * @param {Atom} system required
   * @param {Atom} type optional
   * @param {Atom} schema
   * @param {string} address
   */
  constructor(system, type = Atom.ZERO, schema = Atom.ZERO, address) {
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
    return (this.type ? this.type.equals(other.type) : !other.type) &&
      (this.schema ? this.schema.equals(other.schema) : !other.schema) &&
      (this.system ? this.system.equals(other.system) : !other.system) &&
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
    else return 0; // essentially a noop as they are equal
  }

  valueOf() { return this.toString(); }

  toString() {
    if (this.type.isZero) return this.system.toString() + EntityId.SYS_PREFIX + this.address;
    if (this.schema.isZero) return this.type.toString() + EntityId.TYPE_PREFIX + this.system.toString() + EntityId.SYS_PREFIX + this.address;
    return this.type.toString() + EntityId.SCHEMA_DIV + this.schema.toString() + EntityId.TYPE_PREFIX + this.system.toString() + EntityId.SYS_PREFIX + this.address;
  }

  toJSON() {

  }
}
