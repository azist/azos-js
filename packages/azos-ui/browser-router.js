/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOf, isSubclassOf } from "../azos/aver";
import { ConfigNode } from "../azos/conf";
import { Router, RouteHandler, ActionHandler, SectionHandler } from "../azos/router";
import { isSubclassOf as types_isSubclassOf } from "../azos/types";
import { Arena } from "arena";
import { Applet } from "applet";

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

  #args;//TODO: implement


  constructor(router, cfg, path, parent){
    super(router, cfg, path, parent);
    this.#applet = isSubclassOf(cfg.get("applet"), Applet);
    this.#force = cfg.getBool("force", false);
  }

  /** Returns a target applet type to launch */
  get applet(){ return this.#applet; }

  /** If true, disregards close query handling on open applets */
  get force(){ return this.#force; }

  async execActionAsync(context, args, session = null){
    session = session ?? this.router.app.session;
    return await super.execActionAsync(context, args, session);
  }

  async _doExecActionAsync(context, args, session){//todo: Mixin args
    const arena = isOf(context, Arena);
    const result = await arena.appletOpen(this.#applet, this.#force);//todo: Mix-in args from this.args override by passed args
    return result;
  }
}
