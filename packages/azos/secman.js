/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOf } from "./aver.js";
import { AppComponent } from "./components.js";
import { ConfigNode } from "./conf.js";
import { AccessLevel, Permission, User } from "./security.js";
import { DISPOSED_PROP } from "./types.js";

/**
 * Outlines contract and provides default implementation for the app-global component which handles application
 * security related functionality, such as authorization checking and sec-channel logging.
 * SecurityManager defines the format/layout of your security system ACL/rights descriptors which are stored
 * as config vectors. Depending on your needs you can derive access level from roles, effectively implementing a RBAC,
 * or implement a more granular security with per-permission access, by default security manager
 * implements granular security which expects permission ACL vector to be stored in user rights.
 */
export class SecurityManager extends AppComponent {
  constructor(dir, cfg){ super(dir, cfg); }

  /**
   * Returns an {@link AccessLevel} vector for the specified permission from user rights.
   * Null returned in case of access being denied
   * @param {User} user user principal object for which we compute access level
   * @param {Permission} permission requires permission instance which the access level is computed for
   * @returns {AccessLevel} or null for denied access
   */
  getAccessLevel(user, permission){
    if (this[DISPOSED_PROP]) return null;

    isOf(user, User);
    isOf(permission, Permission);

    const rights = user.rights;
    const descriptor = rights.nav(permission.path);
    if (!(descriptor instanceof ConfigNode) || !descriptor.isSection) return false;// no security descriptor in the ACL was found = failed authorization
    return new AccessLevel(user, permission, descriptor);
  }
}
