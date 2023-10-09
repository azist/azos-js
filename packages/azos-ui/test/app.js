import {Conf, Chassis} from "azos";

console.log('Hook you hard barbindoziy');



const cfg = new Conf.Configuration({
  id: "abc",
  name: "test",
  description: "Test application",
  session: {type: "UiSession"},

});

const app = new Chassis.Application(cfg.root);
window.AZAPP = app;

console.log(`App instance ${app.instanceId}`);
app[Symbol.dispose]();

