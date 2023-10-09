/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as aver from "./aver.js";

/**
 * Session holds data about user session: user, culture, options etc.
 * An application chassis has a session, which represents default session for the whole
 * application, whereas on server "strides/threads" every flow of parallel execution may pass session
 * around as a reference.
 */
export class Session extends types.DisposableObject{
  #user;
  #isoLang;
  #culture;
  #settings;

  constructor(){
    super();
  }

  [types.DESTRUCTOR_METHOD](){

  }

  get user(){ return this.#user;}
  set user(usr){
   // aver.isOf(usr, User);
    this.#user = usr;
  }

  //todo settings
  //todo culture...


}
