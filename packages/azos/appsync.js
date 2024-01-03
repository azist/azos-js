/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "./aver.js";
import { Module } from "./modules.js";
import { LOG_TYPE } from "./log.js";


/** Session synchronization */
export const SYNC_EVT_TYPE_SESSION_CHANGE = "session-change";

/** Synchronizes global state between application instances running in different browser windows/tabs */
export class AppSync extends Module{

  #channel;

  constructor(dir, cfg){
    super(dir, cfg);
  }

  //https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
  //this.#channel.postMessage({x: 1});


  _appAfterLoad(){
    const chn = new BroadcastChannel(`Azos-app-${this.app.id}`);
    chn.onmessage = (evt) => {
      if (evt.data){
        this.writeLog(LOG_TYPE.TRACE, `Got channel '${chn.name}' event '${evt.data.type}'`);
        try{
          this.prepareAndHandleEvent(evt);
        } catch(err){
          this.writeLog(LOG_TYPE.ERROR, `Error processing broadcast channel '${chn.name}' leaked`, err);
        }
      }
    };
    this.#channel = chn;
  }

  _appBeforeCleanup(){
    const cn = this.#channel.name;
    try {
      this.#channel.close();
      this.#channel = null;
      this.writeLog(LOG_TYPE.TRACE, `Closed broadcast channel '${cn}'`);
    } catch(err) {
      this.writeLog(LOG_TYPE.ERROR, `Closing broadcast channel '${cn}' leaked`, err);
    }
  }

  /** Override to handle channel event. Most of times you will need to override `handleEvent(tp, body)` instead */
  prepareAndHandleEvent(evt){
    const tp = aver.isString(evt.data.type);
    const body = aver.isNotNull(evt.data.body);
    return this._doHandleEvent(tp, body);
  }

  /** Override to handle your custom events. The default implementation synchronizes session state */
  _doHandleEvent(tp, body){
    if (tp === SYNC_EVT_TYPE_SESSION_CHANGE){
      this.writeLog(LOG_TYPE.INFO, "Got session change event");
      this.app.session._sync(body);
      return true;
    }
    return false;
  }

  /** Post event object into app sync channel */
  postEvent(tp, body){
    aver.isString(tp);
    aver.isNotNull(body);
    const chn = this.#channel;
    if (chn !== null) {
      chn.postMessage({type: tp, body: body});
    }
  }
}
