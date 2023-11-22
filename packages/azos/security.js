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

  #asof;
  #name;
  #descr;
  #status;
  #authRefreshToken;
  #claims;
  #rights;

  static makeUser(){
    const init = {};
    //structuredClone(); on config
    return new User(init);
  }

  /**
   *
   * @param {object} init
   */
  constructor(init){
    // if (cfg === undefined || cfg === null){//invalid user
    //   this.#name = UNKNOWN;
    //   return;
    // }

    // aver.isOf(cfg, ConfigNode);
    // this.#name = cfg.getString("name", UNKNOWN);
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
      auth: this.#authRefreshToken,
      claims: this.#claims.content,
      rights: this.#rights.content,
    };
    return result;
  }


  /** Returns user name @returns {string} */
  get name(){return this.#name; }

}
