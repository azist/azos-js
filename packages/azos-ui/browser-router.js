/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isNonEmptyString, isOf, isString, isSubclassOf } from "../azos/aver";
import { ConfigNode } from "../azos/conf";
import { Router, RouteHandler, ActionHandler, SectionHandler } from "../azos/router";
import { DESTRUCTOR_METHOD, isSubclassOf as types_isSubclassOf } from "../azos/types";
import { Arena } from "./arena";
import { Applet } from "./applet";
import { showMsg } from "./msg-box";
import { isNullOrWhiteSpace } from "azos/strings";
import { LOG_TYPE } from "azos/log";

/** Provides routing services in the context of a UI in a browser (such as Chrome or Firefox) user agent */
export class BrowserRouter extends Router{

  #integrated = true;
  #history = true;

  #onHashChange;
  #onHistoryPopState;

  constructor(dir, cfg){
    super(dir, cfg);
    this.#integrated = cfg.getBool("integrated", true);
    this.#history = cfg.getBool("history", true);

    if (this.#integrated){

      this.#onHashChange = (function(){
        const path = window.location.hash.slice(1) || '/';
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

  /** Returns true when this router was created in the integrated mode with the browser - it reacts to hash changes  */
  get integrated(){ return this.#integrated; }

  /** Returns true when history is used  */
  get history(){ return this.#history; }

  get defaultSectionHandler(){ return SectionHandler; }
  get defaultLaunchHandler(){ return AppletLaunchActionHandler; }


  /** Called by action handler derivatives to notify the routing integrated parts, such as browser about the route change */
  notifyRouteChanged(path){
    isString(path);
    //do nothing if not integrated with browser
    if (!this.#integrated) return;

    window.location.hash = path;

    if (this.#history) history.pushState(path);
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

  constructor(router, cfg, path, parent){
    super(router, cfg, path, parent);
    this.#applet = isSubclassOf(cfg.get("applet"), Applet);
    this.#force = cfg.getBool("force", false);
    this.#args = cfg.get("args") ?? null;//TODO: We need a getter which return Plain value like: cfg.getPlain("aaa"); which returns object or array or primitive, not config node
  }

  /** Returns a target applet type to launch */
  get applet(){ return this.#applet; }

  /** If true, disregards close query handling on open applets */
  get force(){ return this.#force; }

  /** Arguments object or null */
  get args(){ return this.#args; }

  // eslint-disable-next-line no-unused-vars
  async _doExecActionAsync(context, args, session){
    const arena = isOf(context, Arena, `${this.constructor.name} requires Arena context`);
    const launchArgs = {...this.requestContext["args"], ...this.#args, ...args};//mix-in args
    const result = await arena.appletOpen(this.#applet, launchArgs, this.#force);

    if (result) this.router.notifyRouteChanged(this.path);

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
