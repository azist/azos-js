import { Module } from "azos/modules.js";
import { LOG_TYPE } from "azos/log.js";

/** Synchronizes global state between application instances running in different browser windows/tabs */
export class AppTabSync extends Module{

  #channel;

  constructor(dir, cfg){
    super(dir, cfg);
  }

  //https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
  //this.#channel.postMessage({x: 1});



  _appAfterLoad(){
    const chn = new BroadcastChannel(`Azos-app-${this.app.id}`);
    chn.onmessage = (evt) => {
      //todo: handle event such as access token change etc.
      console.log(evt.data);
    };
    this.#channel = chn;
  }

  _appBeforeCleanup(){
    const cn = this.#channel.name;
    try{
      this.#channel.close();
      this.writeLog(LOG_TYPE.TRACE, `Closed broadcast channel '${cn}'`);
    } catch(err) {
      this.writeLog(LOG_TYPE.ERROR, `Closing broadcast channel '${cn}' leaked`, err)
    }
  }
}
