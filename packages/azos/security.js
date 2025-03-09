/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as strings from "./strings.js";
import * as aver from "./aver.js";
import { Configuration } from "./conf.js";

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
  //Aliases
  if (strings.isOneOf(v, "U,Usr", false)) return USER_STATUS.User;
  if (strings.isOneOf(v, "A;Adm;Administrator", false)) return USER_STATUS.Admin;
  return USER_STATUS.Invalid;
}

/**
 * Parses JWT encoded token supplied as string of a form 'xxx.yyy.zzz',
 * for example an id token coming from OIDC endpoint.
 * This function DOES NOT verify JWT tokens.
 * @param {string?} jwt jwt Token content string (xxx.yyy.zzz) format
 * @returns {Object} jwt token object, or null if supplied null|undef
 */
export function parseJwtToken(jwt){
  if (!types.isAssigned(jwt)) return null;
  try {
    aver.isNonEmptyString(jwt);
    const i1 = jwt.indexOf(".");
    const i2 = jwt.lastIndexOf(".");
    if (i1 <= 0 || i2 == i1) throw new SecurityError("bad structure `x.y.z`");
    const b64 = jwt.slice(i1+1, i2);
    const json = atob(b64);
    return JSON.parse(json);
  } catch(cause) {
    throw new SecurityError("Unparsable JWT", "parseJwtToken()", cause);
  }
}


/**
 * Describes user principal context
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
      this.#authToken = types.asString(init.authToken);

      const claims = types.isObject(init.claims) ? (wasJson ? init.claims : structuredClone(init.claims)) : { };
      const rights = types.isObject(init.rights) ? (wasJson ? init.rights : structuredClone(init.rights)) : { };

      this.#claims = new Configuration(claims);
      this.#rights = new Configuration(rights);
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
      authToken: this.#authToken,
      claims: this.#claims.content,
      rights: this.#rights.content,
    };
    return result;
  }

  /** Returns the date/time stamp as of which this object state was captured @returns {Date} */
  get asof(){return this.#asof; }

  /** Returns user name @returns {string} */
  get name(){return this.#name; }

  /** Returns user description @returns {string} */
  get description(){return this.#descr; }

  /** Returns user status @returns {USER_STATUS} */
  get status(){return this.#status; }

  /** Returns true when user status is either `USER`|`ADMIN`|`SYS`, otherwise user considered to be invalid @returns {boolean}*/
  get isValid(){
    const s = this.#status;
    return s === USER_STATUS.User || s === USER_STATUS.Admin || s === USER_STATUS.System;
  }

  /** Returns true when user status is `USER` @returns {boolean}*/
  get isUser()   { return this.#status === USER_STATUS.User; }

  /** Returns true when user status is `ADMIN` @returns {boolean}*/
  get isAdmin()  { return this.#status === USER_STATUS.Admin; }

  /** Returns true when user status is `SYSTEM` @returns {boolean}*/
  get isSystem() { return this.#status === USER_STATUS.System; }

  /** Returns user auth token, such as OAuth refresh token @returns {string} */
  get authToken(){return this.#authToken; }

  /** Returns user claims node @returns {ConfigNode} */
  get claims(){return this.#claims.root; }

  /** Returns user rights node @returns {ConfigNode} */
  get rights(){return this.#rights.root; }

  //See OIDC Standard claims
  //https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims

  /** Returns JWT "iss" claim @returns {string} */
  get claims_Issuer(){ return this.#claims.root.getString("iss", null); }

  /** Returns JWT "aud" claim @returns {string} */
  get claims_Audience(){ return this.#claims.root.getString("aud", null); }

  /** Returns JWT "exp" claim in Unix seconds @returns {int} */
  get claims_ExpirationTime(){ return this.#claims.root.getInt("exp", 0); }

  /** Returns JWT "iat" claim in Unix seconds @returns {int} */
  get claims_IssuedAtTime(){ return this.#claims.root.getInt("iat", 0); }

  /** Returns JWT "sub" claim  @returns {string} */
  get claims_Subject(){ return this.#claims.root.getString("sub", null); }

  /** Returns JWT "name" claim  @returns {string} */
  get claims_Name(){ return this.#claims.root.getString("name", null); }

  /** Returns JWT "picture" claim containing URL of user image  @returns {string} */
  get claims_Picture(){ return this.#claims.root.getString("picture", null); }
}
