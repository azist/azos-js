/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as strings from "./strings.js";
import * as aver from "./aver.js";
import { UNKNOWN } from "./coreconsts.js";
import { ConfigNode, Configuration } from "./conf.js";

/** Provides uniform base for Security-related exceptions */
export class SecurityError extends types.AzosError {
  constructor(message, from = null, cause = null){ super(message, from, cause, 503); }
}

/** User login status types */
export const USER_STATUS = Object.freeze({
  Invalid: "Invalid",
  User:    "User",
  Admin:   "Admin",
  System:  "System"
});
const ALL_STATUSES = types.allObjectValues(USER_STATUS);

/**
 * Converts value to USER_STATUS coercing it to string if needed
 * @param {*} v value to convert
 * @param {boolean} [canNull=false] pass true to return null for null input
 * @returns {USER_STATUS}
 */
export function asUserStatus(v, canNull = false){
  if (canNull && v===null) return null;
  v = strings.asString(v);
  if (strings.isOneOf(v, ALL_STATUSES, false)) return v;
  return USER_STATUS.Invalid;
}

/**
 * Describes user principal
 */
export class User {
  static #invalid = new User({asof: new Date(),
                              name: "Invalid",
                              descr: "Invalid user",
                              status: USER_STATUS.Invalid,
                              token: null,
                              claims: null,
                              rights: null});

  /** Returns a singleton invalid user instance @returns {User} */
  static get invalid(){ return User.#invalid; }

  #asof;
  #name;
  #descr;
  #status;
  #authToken;
  #claims;
  #rights;

  /**
   * Creates user principal object
   * @param {object} init a tuple of `(asof: Date, name: str, descr: str, status: USER_STATUS, token: str, claims: map, rights: map)`
   */
  constructor(init){
    let wasJson = false;
    try{
      aver.isNotNull(init);
      if (types.isString(init)){
        init = JSON.parse(init);
        wasJson = true;
      }
      aver.isObject(init);

      this.#asof = types.asDate(init.asof);
      this.#name = strings.asString(init.name);
      this.#descr = strings.asString(init.descr);
      this.#status = asUserStatus(init.status);
      this.#authToken = types.asString(init.token);

      const claims = types.isObject(init.claims) ? (wasJson ? init.claims : structuredClone(init.claims)) : { };
      const rights = types.isObject(init.rights) ? (wasJson ? init.rights : structuredClone(init.rights)) : { };

      init.claims = new Configuration(claims);
      init.rights = new Configuration(rights);
    }catch(e){
      throw new SecurityError(`Bad User init content: ${e.message}`, "User.ctor()", e);
    }
  }

  /** Returns User as serializable init object which can be stored (e.g. local storage)
   * and later read back into user object via .ctor(init)
   */
  toInitObject(){
    const result = {
      asof: this.#asof,
      name: this.#name,
      descr: this.#descr,
      status: this.#status,
      auth: this.#authToken,
      claims: this.#claims.content,
      rights: this.#rights.content,
    };
    return result;
  }


  /** Returns user name @returns {string} */
  get name(){return this.#name; }

}
