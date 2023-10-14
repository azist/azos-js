/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as aver from "./aver.js";
import { UNKNOWN } from "./coreconsts.js";
import { ConfigNode } from "./conf.js";

/**
 * Describes user principal
 */
export class User {
  static #invalid = new User(null);

  /** Returns a singleton invalid user instance @returns {User} */
  static get invalid(){ return User.#invalid;}

  #name;

  /**
   *
   * @param {ConfigNode} cfg
   */
  constructor(cfg){
    if (cfg === undefined || cfg === null){//invalid user
      this.#name = UNKNOWN;
      return;
    }

    aver.isOf(cfg, ConfigNode);
    this.#name = cfg.getString("name", UNKNOWN);
  }

  /** Returns user name @returns {string} */
  get name(){return this.#name; }

}
