import {application} from "azos/application";
import { LOG_TYPE } from "azos/log";

console.info('Hook you hard barbindoziy');



const cfgApp = {
  id: "abc",
  name: "$(id)",
  description: "Test '$(name)' application",
  session: null//{type: "UiSession"}
};

const app = application(cfgApp);
if (typeof window !== 'undefined') window.AZAPP = app;

console.info(`App instance ${app.instanceId}`);

app.log.write({text: "aaaaaaaaaaaaaaa"});
app.log.write({type: LOG_TYPE.DEBUG, text: "Debug message"});
app.log.write({type: LOG_TYPE.TRACE, text: "Trace message text"});
app.log.write({type: LOG_TYPE.INFO, text: "Info message text"});
app.log.write({type: LOG_TYPE.WARNING, text: "Warning message text"});
app.log.write({type: LOG_TYPE.ERROR, text: "Error message text"});

for(let i=0; i<100; i++){
  app.log.write({type: LOG_TYPE.INFO, text: "Trace message text", params: {i: i}});
}


//console.info(`Add dispose 1: ${app[types.DISPOSED_PROP]} - ${types.dispose(app)}`);
//console.info(`Add dispose 2: ${app[types.DISPOSED_PROP]} - ${types.dispose(app)}`);

