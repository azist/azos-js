/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOf, isSubclassOf } from "../azos/aver";
import { ConfigNode } from "../azos/conf";
import { Router, RouteHandler, ActionHandler, SectionHandler } from "../azos/router";
import { isSubclassOf as types_isSubclassOf } from "../azos/types";
import { Arena } from "./arena";
import { Applet } from "./applet";
import { showMsg } from "./msg-box";

/** Provides routing services in the context of a UI in a browser (such as Chrome or Firefox) user agent */
export class BrowserRouter extends Router{

  get defaultSectionHandler(){ return SectionHandler; }
  get defaultLaunchHandler(){ return AppletLaunchActionHandler; }

  getDefaultHandlerType(handler, nextNode){
    isOf(handler, RouteHandler);
    isOf(nextNode, ConfigNode);
    const isApplet = types_isSubclassOf(nextNode.get("applet") , Applet);
    return isApplet ? AppletLaunchActionHandler : this.defaultSectionHandler;
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
  async _doExecActionAsync(context, args, session){//todo: Mixin args
    const arena = isOf(context, Arena, `${this.constructor.name} requires Arena context`);
    const launchArgs = {...this.requestContext["args"], ...this.#args, ...args};//mix-in args
    const result = await arena.appletOpen(this.#applet, launchArgs, this.#force);
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
    await showMsg(this.#status, this.#title, this.#message, this.#rank, this.#pre)
 }
}
