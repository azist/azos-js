import { application } from "azos/application";
import { Arena } from "../arena.js";
import { Router } from "../router.js";
import { LOG_TYPE } from "azos/log";
import { ConLog } from "azos/ilog";

import { dispose } from "azos/types";
import { Module } from "azos/modules";
import { XyzApplet } from "./xyz-applet.js";
import { ChronicleClient } from "azos/sysvc/chron/chron-client";
import { AdlibClient } from "azos/sysvc/adlib/adlib-client";
import { XyzApplet2 } from "./xyz-applet2.js";


class MyLogic extends Module {
  #tmr;
  constructor(dir, cfg) {
    super(dir, cfg);
  }

  _appAfterLoad() {
    this.#tmr = setInterval(() => this.writeLog(LOG_TYPE.WARNING, "This message comes from within a module every X seconds"), 25_000);
  }

  _appBeforeCleanup() {
    clearInterval(this.#tmr);
  }
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
  {
    uri: "setup", caption: "Data Setup", nodes: [
      {
        uri: "codes", caption: "Codes and Classifications", nodes: [
          { uri: "facility", caption: "Facility Master", handler: { type: XyzApplet, a: 1, b: true }, icon: "<svg></svg>" },
          { uri: "postal", caption: "Postal Codes", handler: { type: XyzApplet, x: -5, b: "ok" }, icon: "<svg></svg>" },
        ]
      }
    ]
  }
];

const cfgApp = {
  id: "abc",
  name: "$(id)",
  description: "Test '$(name)' application",
  modules: [
    { name: "chronClient", type: ChronicleClient, url: "https://hub.g8day-dev.com/chronicle/log", useOAuth: false, accessTokenScheme: "Basic", accessToken: process.env.AZ_CHRON_SECRET },
    { name: "adlibClient", type: AdlibClient, url: "https://hub.g8day-dev.com/adlib/store", useOAuth: false, accessTokenScheme: "Basic", accessToken: process.env.AZ_ADLIB_SECRET },
    { name: "log", type: ConLog },
    { name: "logic", type: MyLogic },
    { name: "router", type: Router, menu: { root: [...appMenu] } },
  ]
};

const app = application(cfgApp);
window.AZOS_APP = app;//for debugging
console.info(`App instance ${app.instanceId} assigned into 'window.AZOS_APP' for debugging`);
app.session.boot(window.XYZ_USER_OBJECT_INIT);

app.log.write({ type: LOG_TYPE.DEBUG, text: "Launching arena..." });
const arena = Arena.launch(app)[0];
window.ARENA = arena;
arena.appletOpen(XyzApplet);
app.log.write({ type: LOG_TYPE.DEBUG, text: "...arena launched" });


// Handle UNLOADING/CLOSING of tab/window
//https://developer.chrome.com/docs/web-platform/page-lifecycle-api
window.addEventListener("beforeunload", (evt) => {
  if (arena.dirty) {
    evt.preventDefault();
    evt.returnValue = true;
    return;
  }
});

//Called on tab close POST-factum asking questions.
//Not called if user decides to cancel tab close
window.addEventListener("pagehide", () => dispose(app));

