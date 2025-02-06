/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { application } from "azos/application";
import { LOG_TYPE } from "azos/log";
import { ConLog } from "azos/ilog";
import { Module } from "azos/modules";
import { ChronicleClient } from "azos/sysvc/chron/chron-client";
import { AdlibClient } from "azos/sysvc/adlib/adlib-client";
import { ImageRegistry } from "azos/bcl/img-registry";

import { Arena, addAppBoilerplate } from "../arena";
import { Router } from "../router";
import { XyzApplet } from "./xyz-applet";
import { XyzApplet2 } from "./xyz-applet2";
import { XyzApplet3 } from "./xyz-applet3";
import { XyzAppletScheduler } from "./xyz-applet-scheduler";
import { errorMsg } from "../msg-box";
import "../vcl/util/img-registry-browser";



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
    icon: "svg://azos.ico.none",
    nodes: [
    ],
    access: "/ns/permission1"
  },
  {
    uri: "reports",
    caption: "Reports and Analytics",
    icon: "svg://azos.ico.none",
    nodes: [
    ]
  },
  {
    uri: "setup", caption: "Data Setup", nodes: [
      {
        uri: "codes", caption: "Codes and Classifications", nodes: [
          { uri: "facility", caption: "Facility Master", handler: { type: XyzApplet, a: 1, b: true }, icon: "svg://azos.ico.none" },
          { uri: "postal", caption: "Postal Codes", handler: { type: XyzApplet, x: -5, b: "ok" }, icon: "svg://azos.ico.none" },
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
    { name: "imgRegistry", type: ImageRegistry },
  ]
};

const app = application(cfgApp);
window.AZOS_APP = app;//for debugging
console.info(`App instance ${app.instanceId} assigned into 'window.AZOS_APP' for debugging`);
app.session.boot(window.XYZ_USER_OBJECT_INIT);

app.log.write({ type: LOG_TYPE.DEBUG, text: "Launching arena..." });
const arena = Arena.launch(app)[0];
window.ARENA = arena;
app.log.write({ type: LOG_TYPE.DEBUG, text: "...arena launched" });

//Wire up app closing events and global error handlers
addAppBoilerplate(arena, (e) => errorMsg("Errors", e.message));

switch (location.pathname) {
  case "/0.app":
    arena.appletOpen(XyzApplet).then(() => arena.applet.displayMethod = 0);
    break;
  case "/1.app":
    arena.appletOpen(XyzApplet).then(() => arena.applet.displayMethod = 1);
    break;
  case "/2.app":
    arena.appletOpen(XyzApplet).then(() => arena.applet.displayMethod = 2);
    break;
  case "/3.app":
    arena.appletOpen(XyzApplet2);
    break;
  case "/4.app":
    arena.appletOpen(XyzApplet3);
    break;
  case "/5.app":
    arena.appletOpen(XyzAppletScheduler);
    break;
  case "/": // pass-thru
  default:
    arena.appletOpen(XyzApplet2);
    break;
}

