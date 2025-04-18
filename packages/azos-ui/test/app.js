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
import { ImageRegistry, STOCK_IMAGES } from "azos/bcl/img-registry";

import { Arena, addAppBoilerplate } from "../arena";
import { BrowserRouter, MsgBoxActionHandler } from "../browser-router"
import { XyzApplet } from "./xyz-applet";
import { XyzApplet2 } from "./xyz-applet2";
import { XyzApplet3 } from "./xyz-applet3";
import { XyzAppletScheduler } from "./xyz-applet-scheduler";
import { errorMsg } from "../msg-box";
import "../vcl/util/img-registry-browser";
import { ExampleHomeApplet } from "./examples/home-applet";
import { ExampleFeatureAApplet } from "./examples/featureA-applet";
import { ExampleFeatureBApplet } from "./examples/featureB-applet";
import { ShowcaseApplet } from "./examples/showcase-applet";
import { MruLogic } from "../mru";
import { BrowserStorage } from "azos/storage";
import { TEST_IMAGES } from "./test-images";


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

const appRoutes = {
  Hello: {type: MsgBoxActionHandler, status: "Info", title: "Hello", message: "Hello message", rank: 1},
  old: "$(legacy)",
  legacy: {
    a0:  {applet: XyzApplet, args: {displayMethod: 0}},
    a1:  {applet: XyzApplet, args: {displayMethod: 1}},
    a2:  {applet: XyzApplet, args: {displayMethod: 2}},
    two: {applet: XyzApplet2},
    three: {applet: XyzApplet3},
    scheduler: {applet: XyzAppletScheduler}
  },

  examples: {
    home:  {applet: ExampleHomeApplet, args: {displayMethod: 0}},
    featurea:  {applet: ExampleFeatureAApplet, args: {displayMethod: 0}},
    featureb: {applet: ExampleFeatureBApplet, args: {displayMethod: 1}},
    showcase: {applet: ShowcaseApplet},
  },
  help: {
    about: {applet: XyzApplet, args: {isHelp: true }},
    legal: "$(about)",
    test1: {type: MsgBoxActionHandler, status: "Info", title: "Test1", message: "Test number one"},
    test2: {type: MsgBoxActionHandler, status: "Info", title: "Test2", message: "Test number two"},
    test3: {type: MsgBoxActionHandler, status: "Info", title: "Test3", message: "Test number three"},
  },

  error: {type: MsgBoxActionHandler, status: "error", title: "Routing error", message: "The requested routing operation failed", rank: 1}
};

const appMenu = {
  title: "Root Menu",
  icon: "svg://azos.ico.user",
  hint: "This is just a root menu item",
  menu: [
    "Section A",
    {title: "Showcase", icon: "svg://azos.ico.database", route: "/examples/showcase", Xpermissions: [{ns: "System", name: "UserManager", level: 0}]},
    {title: "Something Else", icon: "svg://azos.ico.category"},
    "Examples",
    {title: "Home", icon: "svg://azos.ico.home", route: "/examples/home"},
    {title: "Feature A", icon: "svg://azos.ico.draft", route: "/examples/featurea"},
    {title: "Feature B", icon: "svg://azos.ico.draft", route: "/examples/featureb"},
    {title: "Subsection...", icon: "svg://azos.ico.category", menu: [
      {title: "A", Xpermissions: [{ns: "Testing", name: "FeatureChecker", level: 3}]},
      {title: "B", Xpermissions: [{ns: "Testing", name: "FeatureChecker", level: 4}]}
    ]},
    {title: "Item D"},
    null,//divider
    {title: "Item E"},
  ]
};

const cfgApp = {
  id: "azosTest",
  name: "$(id)",
  description: "Test '$(name)' application",
  copyright: "2018-2025 Azist Group",
  modules: [
    { name: "chronClient", type: ChronicleClient, url: "https://hub.g8day-dev.com/chronicle/log", useOAuth: false, accessTokenScheme: "Basic", accessToken: process.env.AZ_CHRON_SECRET },
    { name: "adlibClient", type: AdlibClient, url: "https://hub.g8day-dev.com/adlib/store", useOAuth: false, accessTokenScheme: "Basic", accessToken: process.env.AZ_ADLIB_SECRET },
    { name: "log", type: ConLog },
    { name: "logic", type: MyLogic },
    { name: "imgRegistry", type: ImageRegistry, images: [...STOCK_IMAGES, ...TEST_IMAGES] },
    { name: "router", type: BrowserRouter, errorPath: "error", graph: {...appRoutes}, menu: {...appMenu}, start: "/examples/home", history: false },
    { name: "lclStorage", type: BrowserStorage, session: false},
    { name: "mruLogic", type: MruLogic}//most recently used
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
addAppBoilerplate(arena, (e) => errorMsg("Errors", e?.message));
