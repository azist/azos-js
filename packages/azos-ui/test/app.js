import {Configuration} from "azos/conf";
import {Application} from "azos/chassis";
import * as types from "azos/types";

console.log('Hook you hard barbindoziy');



const cfg = new Configuration({
  id: "abc",
  name: "test",
  description: "Test application",
  session: {type: "UiSession"},

});

const app = new Application(cfg.root);
if (typeof window !== 'undefined') window.AZAPP = app;

console.log(`App instance ${app.instanceId}`);
app[Symbol.dispose]();

