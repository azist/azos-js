/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Atom } from "../../atom.js";
import { EntityId } from "../../entity-id.js";

export const EID_ROOT_USER = EntityId.parse("usrn@idp::root");

export const SYS_AUTHKIT = Atom.encode("sky-auth");

export const ETP_USER = Atom.encode("user");
export const ETP_LOGIN = Atom.encode("login");
export const ETP_ORGUNIT = Atom.encode("orgu");

export const LTP_SYS_EMAIL = Atom.encode("email");
export const LTP_SYS_PHONE = Atom.encode("phone");
export const LTP_SYS_ID = Atom.encode("id");
export const LTP_SYS_SCREEN_NAME = Atom.encode("screenm");
export const LTP_SYS_URI = Atom.encode("uri");
