/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as aver from "./aver.js";
import { User } from "./security.js";
import { Application } from "./application.js";

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

  // eslint-disable-next-line no-unused-vars
  constructor(app, cfg=null){
    super();
    this.#app = aver.isOf(app, Application);
    this.#user = User.invalid;
  }

  [types.DESTRUCTOR_METHOD](){
  }

  /** @returns {Application} */
  get app(){ return this.#app; }

  /**
   * Returns current session user. This property is never null because {@link User.invalid} is returned
   * when no specific user is set
   * @returns {User}
   */
  get user(){ return this.#user; }
  set user(usr){
    const was = this.#user;
    if (!types.isAssigned(usr)) usr = User.invalid;
    this.#user = aver.isOf(usr, User);

    if (this.#user !== was){ //Broadcast change
      //broadcast user change
      const sync = this.app.moduleLinker.tryResolve(IAppSync);
      if (sync !== null) sync.broadcast({user: this.#user.toInitObject()});
    }
  }

  //todo settings
  //todo culture...
}
