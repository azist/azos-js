import { Atom } from "../../atom";
import { EntityId } from "../../entity-id";

export const EID_ROOT_USER = EntityId.parse("usrn@idp::root");

export const ATM_SYS_AUTHKIT = Atom.encode("sky-auth");

export const ATM_ETP_USER = Atom.encode("user");
export const ATM_ETP_LOGIN = Atom.encode("login");
export const ATM_ETP_ORGUNIT = Atom.encode("orgu");

export const ATM_LTP_SYS_EMAIL = Atom.encode("email");
export const ATM_LTP_SYS_PHONE = Atom.encode("phone");
export const ATM_LTP_SYS_ID = Atom.encode("id");
export const ATM_LTP_SYS_SCREEN_NAME = Atom.encode("screenm");
export const ATM_LTP_SYS_URI = Atom.encode("uri");
