import {Configuration} from "azos/conf";
import {Application} from "azos/chassis";
import * as types from "azos/types";

console.info('Hook you hard barbindoziy');



const cfg = new Configuration({
  id: "abc",
  name: "test",
  description: "Test application",
  session: {type: "UiSession"},

});

const app = new Application(cfg.root);
if (typeof window !== 'undefined') window.AZAPP = app;

console.info(`App instance ${app.instanceId}`);
console.info(`Add dispose 1: ${app[types.DISPOSED_PROP]} - ${types.dispose(app)}`);
console.info(`Add dispose 2: ${app[types.DISPOSED_PROP]} - ${types.dispose(app)}`);

