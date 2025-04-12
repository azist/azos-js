/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as strings from "./strings.js";
import * as aver from "./aver.js";
import { config, ConfigNode, Configuration, GET_CONFIG_VERBATIM_VALUE, getNodeAttrOrValue, makeNew } from "./conf.js";
import { Session } from "./session.js";


/** Provides uniform base for Security-related exceptions */
export class SecurityError extends types.AzosError {
  constructor(message, from = null, cause = null, code = 503){ super(message, from, cause, code); }
}

/** Thrown when authorization permission check fails, indicating that access is denied */
export class AuthorizationError extends SecurityError {
  #permission;

  constructor(permission, message = null, from = null, cause = null){
    permission = aver.isOf(permission, Permission);
    message = `Permission '${permission.path}' failed authorization '${permission.description}'`;
    if (types.isNonEmptyString(message)) message += `: ${message}`;
    super(message, from, cause, 403);
    this.#permission = permission;
  }

  /** Returns failing permission instance */
  get permission(){ return this.#permission; }

  /** Override to change namespace which is returned from external status */
  get ns() { return "js.sec"; }

   /** Override to add details which are provided to callers via external status */
   provideExternalStatus() {
    const result = super.provideExternalStatus();
    result["permission"] = this.#permission.path;
    return result;
  }
}

/** Security ACL descriptor config attribute name.
 * WARNING: This has to match Azos server constant values in `./Azos/Security/authorization/AccessLevel.cs`
 */
export const CONFIG_LEVEL_ATTR = "level";

/** Security Namespace
 * WARNING: This has to match Azos server constant values
 */
export const NS_AZOS_SECURITY = "/Azos/Security";

/** Defines Azos security system canonical access level.
 * WARNING: This has to match Azos server constant values in `./Azos/Security/authorization/AccessLevel.cs`
 */
export const ACCESS_LEVEL = Object.freeze({
  /** All access denied */
  DENIED: 0,

  /** View only access */
  VIEW: 1,

  /** View and change access */
  CHANGE: 2,

  /** Full CRUD: View, Change, and Delete */
  DELETE: 3,

  /**
   * Bearers have above the full control. In the scope of system administration permissions only:  this is typically used
   * to protect irrevocable actions, direct data access, ability to launch arbitrary processes and other activities that
   * might destabilize the system
   */
  ADVANCED: 1000
});

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

  /** Returns true when user status is `ADMIN` or `SYSTEM` @returns {boolean}*/
  get isAdminOrSystem() { return this.#status === USER_STATUS.Admin || this.#status === USER_STATUS.System; }

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


/** Permission is a security authorization assertion, you allocate permissions and call `check(session)` method which either passes or fails with
 * `AuthorizationError`. You can create your own permissions which embody possibly complex authorization checks.
 * The ideology is taken from Azos full server framework where permissions are used everywhere
 */
export class Permission {

  /** Returns an instance of `Permission` or its derivative out of the supplied specifier.
   * If you pass a string, returns a permission configured from the string,
   * if you pass ConfigNode builds a Permission object, otherwise throws averment error
   * @param {string | Configuration | ConfigNode | Permission} spec permission specifier of one of the supported types
   * @returns {Permission | null}
   */
  static specToPermission(spec){
    if (!spec) return null;
    if (spec instanceof Permission) return spec;//as-is
    if (types.isString(spec)) spec = config(spec);
    if (spec instanceof Configuration) spec = spec.root;
    if (spec instanceof ConfigNode){
      return makeNew(Permission, spec, null, Permission);//factory method
    }
    if (types.isObject(spec)) {
      spec = config(spec).root;
      return makeNew(Permission, spec, null, Permission);//factory method
    }
    throw aver.AVERMENT_FAILURE(`Bad permission spec '${spec}'`, "specToPermission()");
  }


  /**
   *  Returns a first permission which fails authorization check or null, if all pass
   * @param {Session} session security context for the call
   * @param {Iterable<Permission | Configuration | ConfigNode | string>} permissionSpecs - iterable of permission specifiers
   * @returns {Permission} first failing permission or null if none failed
  */
  static findFirstFailing(session, permissionSpecs){
    aver.isOf(session, Session);
    aver.isIterable(permissionSpecs);
    for(const one of permissionSpecs){
      const perm = Permission.specToPermission(one);
      if (!perm.check(session)) return perm;
    }
    return null;
  }

  /**
   *  Returns true when all permissions are checked and authorized
   * @param {Session} session security context for the call
   * @param {Iterable<Permission | Configuration | ConfigNode | string>} permissionSpecs - iterable of permission specifiers
   * @returns {boolean} true if all permissions are authorized
  */
  static allAuthorized(session, permissionSpecs){
     return null === Permission.findFirstFailing(session, permissionSpecs);
  }

  /**
   * Runs guard check an all supplied permissions. This throws a {@link AuthorizationError} on the first permission which fails the check
   * @param {Session} session security context for the call
   * @param {Iterable<Permission | Configuration | ConfigNode | string>} permissionSpecs - iterable of permission specifiers
   * @param {string | null} [message=null] - optional error message for exception
   * @param {string | null} [from=null] - optional error from clause for exception
  */
  static guardAll(session, permissionSpecs, message = null, from = null){
    aver.isOf(session, Session);
    aver.isIterable(permissionSpecs);
    for(const one of permissionSpecs){
      const perm = Permission.specToPermission(one);
      perm.guard(session, message, from);
    }
  }

  #ns;
  #name;
  #level;

  /**
   * Creates an instance of Permission which represents a security assertion
   * @param {string | Configuration | ConfigNode} nsOrCfg required namespace name or ConfigNode or Configuration object
   * @param {string} name required name within namespace
   * @param {int} level requires access level
   */
  constructor(nsOrCfg, name, level){

    if (nsOrCfg instanceof Configuration){
      nsOrCfg = nsOrCfg.root;
    }

    let ns = nsOrCfg;
    if (nsOrCfg instanceof ConfigNode){
      const cfg = nsOrCfg;
      ns = cfg.getString("ns", null);
      name = cfg.getString("name", null);
      level = cfg.getInt(CONFIG_LEVEL_ATTR, 0);
    }

    aver.isNonEmptyString(ns);
    ns = strings.trim(ns);
    if (ns.endsWith("/")) ns = ns.slice(0, -1);
    this.#ns = ns;
    this.#name = aver.isNonEmptyString(name);
    this.#level = types.asInt(level, false);
  }

  //Enables treatment by config framework as a verbatim value instead of being deconstructed into a ConfigSection
  [GET_CONFIG_VERBATIM_VALUE](){ return this; }

  /** Permission namespace name e.g. `Azos/System/Services` */
  get ns(){ return this.#ns; }

  /** Permission name which is the trailing segment of full path e.g `DataAdminPermission` */
  get name(){ return this.#name; }

  /** Full path concatenating `ns + / + name` e.g. `Azos/System/Services/DataAdminPermission` */
  get path(){ return `${this.#ns}/${this.#name}`; }

  /** Asserted access level. 0 = DENIED, {@link ACCESS_LEVEL} */
  get level(){ return this.#level; }

  /** Describes the security assertion action/parameters. Override to reflect your specific checks */
  get description(){ return `Level >= ${this.#level}`; }


  /** Returns true/false if permission check passes or fails in the context of a given session */
  check(session){
    aver.isOf(session, Session);
    const user = session.user;
    const rights = user.rights;
    //The descriptor is taken from user rights ACL and it MUST BE a config section
    const descriptor = rights.nav(this.path);
    if (!(descriptor instanceof ConfigNode) || !descriptor.isSection) return false;// no security descriptor in the ACL was found = failed authorization
    const result = this._doCheck(session, user, descriptor);
    return result;
  }

  /** Throws an {@link AuthorizationError} when authorization check fails */
  guard(session, message = null, from = null){
    const pass = this.check(session);
    if (!pass) throw new AuthorizationError(this, message, from);
  }


  /**
   * Protected method which performs authorization assertion check. The default one check the access level
   * @param {Session} session session context
   * @param {User} user user principal object as extracted from the session context
   * @param {ConfigNode} descriptor security descriptor config section as gotten from this permission path
   */
  // eslint-disable-next-line no-unused-vars
  _doCheck(session, user, descriptor){
    const aclLevel = descriptor.getInt(CONFIG_LEVEL_ATTR, ACCESS_LEVEL.DENIED);
    return aclLevel >= this.#level;
  }
}

//#region Azos permissions
/**
 * Checks that user is authenticated and does not care about access level to any specific permission beyond that,
 * consequently this permission skips authorization altogether.
 * This is typically used to inject session/security scope and to assert user identity validity without checking
 * for any specific permissions/ACLs
 */
export class AuthenticatedUserPermission extends Permission {
  constructor(){ super(NS_AZOS_SECURITY, "AuthenticatedUser", 0); }
  // eslint-disable-next-line no-unused-vars
  _doCheck(session, user, descriptor){ return user.isValid; }
}

/**
 * Checks that user is authenticated with Administrator status (user.Status=Admin) and has the specified access level.
 * The validation fails for plain User statuses regardless of their ACL level.
 */
export class SystemAdminPermission extends Permission {
  constructor(cfgOrLevel){ super(NS_AZOS_SECURITY, "SystemAdmin", getNodeAttrOrValue(cfgOrLevel, CONFIG_LEVEL_ATTR)); }
  _doCheck(session, user, descriptor){ return user.isAdminOrSystem && super._doCheck(session, user, descriptor); }
}
//#endregion
