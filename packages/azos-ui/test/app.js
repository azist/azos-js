import { makeUiApplication } from "../ui.js";
import { Arena } from "../arena.js";
import { LOG_TYPE } from "azos/log";
import { ConLog } from "azos/ilog";

import { dispose } from "azos/types";
import { Module } from "azos/modules";


class MyLogic extends Module{
  #tmr;
  constructor(dir, cfg){
    super(dir, cfg);
  }

  _appAfterLoad(){
    this.#tmr = setInterval(() => this.writeLog(LOG_TYPE.WARNING, "This message comes from within a module every X seconds"), 5_000);
  }

  _appBeforeCleanup(){
    clearInterval(this.#tmr);
  }
}



const cfgApp = {
  id: "abc",
  name: "$(id)",
  description: "Test '$(name)' application",
  modules: [
    {name: "log", type: ConLog},
    {name: "logic", type: MyLogic},
  ]
};

const app = makeUiApplication(cfgApp);
console.info(`App instance ${app.instanceId}`);
app.session.boot(window.XYZ_USER_OBJECT_INIT);

app.log.write({type: LOG_TYPE.DEBUG, text: "Launching arena..."});
Arena.launch();
app.log.write({type: LOG_TYPE.DEBUG, text: "...arena launched"});

// Handle UNLOADING/CLOSING of tab/window
//https://developer.chrome.com/docs/web-platform/page-lifecycle-api
window.addEventListener("beforeunload", (evt) => {
  if (app.dirty){
    evt.preventDefault();
    evt.returnValue = true;
    return;
  }
});

//Called on tab close POST-factum asking questions.
//Not called if user decides to cancel tab close
window.addEventListener("pagehide", () => dispose(app));

