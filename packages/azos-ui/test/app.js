import { application } from "azos/application";
import { Arena } from "../arena.js";
import { ArenaLogic } from "../arena-logic.js";
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
    this.#tmr = setInterval(() => this.writeLog(LOG_TYPE.WARNING, "This message comes from within a module every X seconds"), 25_000);
  }

  _appBeforeCleanup(){
    clearInterval(this.#tmr);
  }
}

class XyzApplet{//this is tempnpm

}

const appMenu = [
  {
    uri: "processing",
    caption: "Processing",
    icon: "<svg></svg>",
    nodes: [
    ],
    access: "/ns/permission1"
  },
  {
    uri: "reports",
    caption: "Reports and Analytics",
    icon: "<svg></svg>",
    nodes: [
    ]
  },
  {uri: "setup", caption: "Data Setup", nodes: [
    {uri: "codes", caption: "Codes and Classifications", nodes: [
      {uri: "facility", caption: "Facility Master", handler: {type: XyzApplet, a: 1, b: true}, icon: "<svg></svg>"},
      {uri: "postal", caption: "Postal Codes", handler: {type: XyzApplet, x: -5, b: "ok"}, icon: "<svg></svg>"},
    ]}
  ]}
];

const cfgApp = {
  id: "abc",
  name: "$(id)",
  description: "Test '$(name)' application",
  modules: [
    {name: "log", type: ConLog},
    {name: "logic", type: MyLogic},
    {
      name: "arena", type: ArenaLogic,
      menu: { root: [...appMenu] }
    },
  ]
};

const app = application(cfgApp);
window.AZOS_APP = app;//for debugging
console.info(`App instance ${app.instanceId} assigned into 'window.AZOS_APP' for debugging`);
app.session.boot(window.XYZ_USER_OBJECT_INIT);

app.log.write({type: LOG_TYPE.DEBUG, text: "Launching arena..."});
Arena.launch(app);
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

