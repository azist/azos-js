/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isNonEmptyString, isOf, isString, isSubclassOf } from "../azos/aver.js";
import { ConfigNode, makeNew } from "../azos/conf.js";
import { Router, RouteHandler, ActionHandler, SectionHandler } from "../azos/router.js";
import { DESTRUCTOR_METHOD, isSubclassOf as types_isSubclassOf } from "../azos/types.js";
import { Arena } from "./arena.js";
import { Applet } from "./applet.js";
import { showMsg } from "./msg-box.js";
import { isNullOrWhiteSpace } from "azos/strings.js";
import { LOG_TYPE } from "azos/log.js";
import { MenuCommand } from "./cmd.js";

/** Provides routing services in the context of a UI in a browser (such as Chrome or Firefox) user agent */
export class BrowserRouter extends Router{

  #integrated = true;
  #history = true;
  #appStart;
  #mainMenu = null;

  #hasLoaded;
  #onHashChange;
  #onHistoryPopState;

  #currentPath;

  constructor(dir, cfg){
    super(dir, cfg);
    this.#integrated = cfg.getBool("integrated", true);
    this.#history = cfg.getBool("history", true);
    this.#appStart = cfg.getString("start", null);

    const menu = cfg.get("menu", null);
    if (menu instanceof ConfigNode){
      this.#mainMenu = makeNew(MenuCommand, menu, this, MenuCommand);
    }

    if (this.#integrated){

      this.#onHashChange = (function(){
        if (!this.#hasLoaded) return;

        const hash = window.location.hash;
        if (isNullOrWhiteSpace(hash)) return;
        const path = hash.substring(1) || '/';

        if (path === this.#currentPath) return;//nothing changed

//console.warn("HASH CHANGE CALLED   ", hash, " -> ", path, " Current path: ", this.#currentPath);
        this.safeHandleUiActionAsync(window.ARENA, path);
      }).bind(this);

      window.addEventListener("hashchange", this.#onHashChange);
      window.addEventListener("load", this.#onHashChange);

      if (this.#history){
        this.#onHistoryPopState = (function(evt){
          if (!evt || !evt.state) return;
          this.safeHandleUiActionAsync(window.ARENA, evt.state);
        }).bind(this);
        window.addEventListener("popstate", this.#onHistoryPopState);
      }
    }
  }

  [DESTRUCTOR_METHOD](){
    if (this.#onHashChange){
      window.removeEventListener("hashchange", this.#onHashChange);
      window.removeEventListener("load", this.#onHashChange);
    }
    if (this.#onHistoryPopState){
      window.removeEventListener("popstate", this.#onHistoryPopState);
    }
  }

  _appAfterLoad() {
    if (isNullOrWhiteSpace(window.location.hash)){
      if (this.#appStart) {
        queueMicrotask(async () => { try{await this.safeHandleUiActionAsync(window.ARENA, this.#appStart);} finally { this.#hasLoaded = true;} });
      } else {
        this.#hasLoaded = true;
      }
    } else {
      queueMicrotask(async () => { try{await this.safeHandleUiActionAsync(window.ARENA, window.location.hash.substring(1));} finally { this.#hasLoaded = true;} });
    }
  }

  /** Returns {@link MenuCommand} for main application menu or null if not set
   * @returns {MenuCommand} menu command or null if not set
  */
  get mainMenu(){ return this.#mainMenu; }

  /** Returns true when this router was created in the integrated mode with the browser - it reacts to hash changes  */
  get integrated(){ return this.#integrated; }

  /** Returns true when history is used  */
  get history(){ return this.#history; }

  get hasLoaded(){ return this.#hasLoaded; }

  /** Route path to go to upon application start if no other path is supplied via URL */
  get start(){ return this.#appStart; }

  /** Current route path selected in browser */
  get currentPath(){ return this.#currentPath; }

  get defaultSectionHandler(){ return SectionHandler; }
  get defaultLaunchHandler(){ return AppletLaunchActionHandler; }


  /** Called by action handler derivatives to notify the routing integrated parts, such as browser about the route change */
  notifyRouteChanged(path, pushHistory){
    isString(path);

    this.#currentPath = path;

    //do nothing if not integrated with browser
    if (!this.#integrated) return;

    window.location.hash = `#${path}`;

    console.warn("notifyRouteChanged()", path, " --location.hash--> ", window.location.hash);

    if (this.#history && pushHistory) history.pushState(path, "");
  }

  getDefaultHandlerType(handler, nextNode){
    isOf(handler, RouteHandler);
    isOf(nextNode, ConfigNode);
    const isApplet = types_isSubclassOf(nextNode.get("applet") , Applet);
    return isApplet ? AppletLaunchActionHandler : this.defaultSectionHandler;
  }

  /**
   * Handles a route leading up to a UI `ActionHandler`-derivative in the scope of Arena
   * @param {Arena} arena - required scope
   * @param {string} path - route path string
   * @param {any|null} [args=null] - optional launch args
   * @param {Session | null} [session=null] - execution session scope
   * @returns {any} result of action, such as applet launch result
   */
  async safeHandleUiActionAsync(arena, path, args = null, session = null){
    isOf(arena, Arena);
    isNonEmptyString(path);
    if (!session) session = arena.app.session;

    try {
      const handler = this.handleRoute(path);
      isOf(handler, ActionHandler, `Route '${path}' must land on ActionHandler`);
      return await handler.execActionAsync(arena, args, session);
    } catch(e) {
      this.writeLog(LOG_TYPE.EMERGENCY, `Bad route '${path}'`, e, {path})
      if (isNullOrWhiteSpace(this.errorPath)) throw e;
      const eHandler = this.handleRoute(this.errorPath);
      isOf(eHandler, ActionHandler, `Misconfigured error route '${this.errorPath}' must land on ActionHandler`);
      return await eHandler.execActionAsync(arena, {error: e, ...args}, session);//with error args mix-in
    }
  }
}

/** Handles routing action by launching an associated applet */
export class AppletLaunchActionHandler extends ActionHandler{
  #applet;
  #force;
  #args;
  #history;

  constructor(router, cfg, path, parent){
    super(router, cfg, path, parent);
    this.#applet = isSubclassOf(cfg.get("applet"), Applet);
    this.#force = cfg.getBool("force", false);
    this.#args = cfg.getFlatNode("args");
    this.#history = cfg.getBool("history", true);
  }

  /** Returns a target applet type to launch */
  get applet(){ return this.#applet; }

  /** If true, disregards close query handling on open applets */
  get force(){ return this.#force; }

  /** Arguments object or null */
  get args(){ return this.#args; }

  /** True if the successful launch should go on the browser history stack */
  get history(){ return this.#history; }

  // eslint-disable-next-line no-unused-vars
  async _doExecActionAsync(context, args, session){
    const arena = isOf(context, Arena, `${this.constructor.name} requires Arena context`);
    const launchArgs = {...this.requestContext["args"], ...this.#args, ...args};//mix-in args
    const result = await arena.appletOpen(this.#applet, launchArgs, this.#force, session);

    if (result)
      this.router.notifyRouteChanged(this.rootPath, this.#history);
    else
      window.location.hash = `#${this.router.currentPath}`;//bring path back after failed change attempt

    return result;
  }
}


/** Handles routing action by showing a message box */
export class MsgBoxActionHandler extends ActionHandler{
  #status;
  #title;
  #message;
  #rank;
  #pre;

  constructor(router, cfg, path, parent){
    super(router, cfg, path, parent);
    this.#status = cfg.getString("status", "normal");
    this.#title = cfg.getString("title", "Message");
    this.#message = cfg.getString("message", "");
    this.#rank = cfg.getInt("rank", 3);
    this.#pre = cfg.getBool("pre", false);
  }

  async _doExecActionAsync(){
    return await showMsg(this.#status, this.#title, this.#message, this.#rank, this.#pre);
  }
}
