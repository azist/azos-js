/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { IClient } from "../../client.js";
import { isObject, isString, isStringOrNull } from "../../aver.js";
import { isInsertForm } from "../../types.js";
import { dflt } from "../../strings.js";
import { CONTENT_TYPE, HEADERS } from "../../coreconsts.js";


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
  async getLoginsAsync(gUser) {
    const got = await this.get(`userLogins?gUser=${isString(gUser)}`);
    return got;
  }

  async saveUserAsync(user) {
    isObject(user);
    const method = isInsertForm(user) ? this.post : this.put;
    const got = await method("user", { user: user });
    return got;
  }

  async saveLoginAsync(login) {
    isObject(login);
    const method = isInsertForm(login) ? this.post : this.put;
    const got = await method("login", { login: login });
    return got;
  }

  async setLockStatusAsync(status) {
    const got = await this.put("lock", { lockStatus: isObject(status) });
    return got;
  }
}
