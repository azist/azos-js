/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as aver from "./aver.js";
import { User } from "./security.js";

/**
 * Session holds data about user session: user, culture, options etc.
 * An application chassis has a session, which represents default session for the whole
 * application, whereas on server "strides/threads" every flow of parallel execution may pass session
 * around as a reference.
 */
export class Session extends types.DisposableObject{
  #app;
  #user;
  #isoLang;
  #culture;
  #settings;

  constructor(app, cfg=null){
    super();
    this.#app = app;
  }

  [types.DESTRUCTOR_METHOD](){
  }

  get app(){ return this.#app;}

  get user(){ return this.#user;}
  set user(usr){
    usr === null || aver.isOf(usr, User);
    this.#user = usr ?? User.invalid;
  }

  //todo settings
  //todo culture...


}
