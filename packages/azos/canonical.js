/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Atom } from "./atom.js";
import { EntityId } from "./entity-id.js";
import { ETP_USER, SYS_AUTHKIT } from "./sysvc/akit/constraints.js";
import { isNonEmptyString } from "./types.js";

export const ADDRESS_INVALID = "[n/a]";

export const SCH_GDID = Atom.encode("gdid");
export const SCH_ID = Atom.encode("id");

export const SYS_IDP = Atom.encode("idp");
export const ETP_INVALID = Atom.encode("invalid");
export const ETP_IDP_USER_NAME = Atom.encode("usrn");

/** Gets EntityId for the User principal. */
export function ofUser(user = null) {
  return ofUserName(user?.Name);
}

/** Gets EntityId for the valid user by name. If name is null, return an invalid user etp and address */
export function ofUserName(name) {
  if (!isNonEmptyString(name)) return new EntityId(SYS_IDP, ETP_INVALID, Atom.ZERO, ADDRESS_INVALID);
  return new EntityId(SYS_IDP, ETP_IDP_USER_NAME, Atom.ZERO, name);
}

export function ofUserGdid(gdid) {
  if (!isNonEmptyString(gdid)) return new EntityId(SYS_IDP, ETP_INVALID, Atom.ZERO, ADDRESS_INVALID);
  return new EntityId(SYS_AUTHKIT, ETP_USER, SCH_GDID, gdid);
}
