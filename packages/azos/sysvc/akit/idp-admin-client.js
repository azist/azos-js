/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isObject, isOf, isString, isStringOrNull } from "../../aver.js";
import { CONTENT_TYPE, HEADERS } from "../../coreconsts.js";
import { ofUserGdid } from "../../canonical.js";
import { IClient } from "../../client.js";
import { EntityId } from "../../entity-id.js";
import { dflt } from "../../strings.js";
import { isInsertForm, isNonEmptyString } from "../../types.js";
import { EID_ROOT_USER } from "./constraints.js";

/** Provides functionality for consuming `Sky.AuthKit` admin services by adhering to `IIdpUserAdminLogic` et.al. server contracts */
export class IdpAdminClient extends IClient {

  constructor(dir, cfg) {
    super(dir, cfg);
  }

  #makeHeaders(realm) {
    realm = dflt(isStringOrNull(realm), "gdi");
    const hdr = { [HEADERS.ACCEPT]: CONTENT_TYPE.JSON, "wv-data-ctx": realm };
    return hdr;
  }

  /** Gets a list of Users for the supplied filter */
  async getUserListAsync(filter, realm) {
    const got = await this.post("filter", { filter: isObject(filter) }, this.#makeHeaders(realm));
    return got;
  }

  /** Returns a list of login info objects for the selected user account */
  async getLoginsAsync(gdid, realm) {
    const got = await this.get(`userlogins?gUser=${isString(gdid)}`, this.#makeHeaders(realm));
    return got;
  }

  async saveUserAsync({ mode, ...user }, realm) {
    isObject(user);
    const method = isInsertForm({ mode }) ? this.post : this.put;
    const got = await method.call(this, "user", { user: user }, this.#makeHeaders(realm));
    return got;
  }

  async saveLoginAsync({ mode, ...login }, realm) {
    isObject(login);
    const method = isInsertForm({ mode }) ? this.post : this.put;
    const got = await method.call(this, "login", { login: login }, this.#makeHeaders(realm));
    return got;
  }

  async setLockStatusAsync(status, realm) {
    const got = await this.put("lock", { lockStatus: isObject(status) }, this.#makeHeaders(realm));
    return got;
  }

  createLockStatusBody(targetEID, lockInfo, currentUserGdid) {
    if (!isNonEmptyString(lockInfo?.LockActor))
      lockInfo.LockActor = (currentUserGdid ? ofUserGdid(currentUserGdid) : EID_ROOT_USER).toString();

    const status = {
      TargetEntity: isOf(targetEID, EntityId).toString(),
      LockSpanUtc: {
        start: lockInfo.LockSpanUtc.start ?? null,
        end: lockInfo.LockSpanUtc.end ?? null,
      },
      LockActor: lockInfo.LockActor,
      LockNote: lockInfo.LockNote ?? null,
    };
    return status;
  }
}
