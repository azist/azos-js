import {application} from "azos/application";
import {Module} from "azos/modules";
import {ConLog} from "azos/ilog";
import { LOG_TYPE } from "azos/log";

console.info('Hook you hard barbindoziy');


class MyLogic extends Module{
  #tmr;
  constructor(dir, cfg){
    super(dir, cfg);
  }

  _appAfterLoad(){
    this.#tmr = setInterval(() => this.writeLog(LOG_TYPE.WARNING, "Hook you hard!"), 1000);
  }

  _appBeforeCleanup(){
    clearInterval(this.#tmr);
  }
}



const cfgApp = {
  id: "abc",
  name: "$(id)",
  description: "Test '$(name)' application",
  //session: null, //{type: "UiSession"},
  modules: [
    {name: "log", type: ConLog},
    {name: "logic", type: MyLogic},
  ]
};

const app = application(cfgApp);
app.session.boot(window.XYZ_USER_OBJECT_INIT);
if (typeof window !== 'undefined') window.AZAPP = app;

console.info(`App instance ${app.instanceId}`);

app.log.write({text: "aaaaaaaaaaaaaaa"});
app.log.write({type: LOG_TYPE.DEBUG, text: "Debug message"});
app.log.write({type: LOG_TYPE.TRACE, text: "Trace message text"});
app.log.write({type: LOG_TYPE.INFO, text: "Info message text"});
app.log.write({type: LOG_TYPE.WARNING, text: "Warning message text"});
app.log.write({type: LOG_TYPE.ERROR, text: "Error message text"});

for(let i=0; i<5; i++){
  app.log.write({type: LOG_TYPE.INFO, text: "Trace message text", params: {i: i}});
}

app.session.boot(window.G8_USER_OBJECT_INIT);

//console.info(`Add dispose 1: ${app[types.DISPOSED_PROP]} - ${types.dispose(app)}`);
//console.info(`Add dispose 2: ${app[types.DISPOSED_PROP]} - ${types.dispose(app)}`);

