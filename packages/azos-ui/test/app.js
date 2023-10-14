import {application} from "azos/chassis";
import * as types from "azos/types";

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
console.info(`Add dispose 1: ${app[types.DISPOSED_PROP]} - ${types.dispose(app)}`);
console.info(`Add dispose 2: ${app[types.DISPOSED_PROP]} - ${types.dispose(app)}`);

