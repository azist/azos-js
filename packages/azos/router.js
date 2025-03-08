/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
import { Module } from "azos/modules";
import { ConfigNode, makeNew } from "azos/conf";
import { ABSTRACT } from "./coreconsts";

/**
 * Provides routing services by maintaining a routing graph which maps requests into route handlers, such as app launch handlers
 */
export class Router extends Module{
  #graph;//ConfigNode

  constructor(dir, cfg){
    super(dir, cfg);
    this.#graph = aver.isOf(cfg.get("graph"), ConfigNode);
  }

  /** Returns routing graph root */
  get graph(){ return this.#graph; }

  /**
   * Routes a path, such as the one coming from a browser URI hash fragment, into an array of segment handlers,
   * the last one handling the action of the route
   * @param {String} path a string which contains a path being mapped
   * @returns {RouteHandler[]} returns a route handler array, the last one capable of handling the requested route
   */
  handleRouteSegments(path){
   aver.isNonEmptyString(path);
   const handler = makeNew(RouteHandler, this.#graph, this, SectionHandler, [path, null]);
   const result = [];
   for(let next; (next = handler.handle());) result.push(next);
   return result;
  }

  /**
   * Routes a path, such as the one coming from a browser URI hash fragment, into a handler
   * @param {String} path a string which contains a path being mapped
   * @returns {RouteHandler} returns a last route handler
   */
  handleRoute(path){
    return this.handleRouteSegments(path).at(-1);
  }
}//Router



export class RouteHandler{
  #router;
  #graph;
  #path;
  #segment;
  #nextPath;
  #parent;
  #permissions;

  constructor(router, graph, path, parent){
    this.#router = aver.isOf(router, Router);
    this.#graph = aver.isOf(graph, ConfigNode);
    this.#path = aver.isNonEmptyString(path);
    this.#parent = aver.isOfOrNull(parent, RouteHandler);

    const i = path.indexOf('/');
    if (i >= 0){
      this.#segment = path.slice(0, i);
      this.#nextPath = path.substring(i+1);
    } else {
      this.#segment = path;
      this.#nextPath = "";
    }
  }

  /** Router which processes the request */
  get router(){ return this.#router; }

  /** The routing graph which this node is based on */
  get graph(){ return this.#graph; }

  /** The path being processed by this and the next node(s) */
  get path(){ return this.#path; }

  /** The path segment being processed by this node */
  get segment(){ return this.#segment; }

  /** The path segment being processed by the next node/s if any */
  get nextPath(){ return this.#nextPath; }

  /** The parent handler OR NULL if this is a top-most handler at the very beginning of the path */
  get parent(){ return this.#parent; }

  /** Returns the next/child handler or NULL if this handler is the terminal/leaf action handler*/
  next(){ return null; }
}

export class SectionHandler extends RouteHandler{

  constructor(router, cfg, path, parent){
    super(router, cfg, path, parent);
  }

  next(){
    //finds .segment as a child section. tries to make an action handler or section by default
  }
}

/** Terminal/leaf route handler */
export class ActionHandler extends RouteHandler{

  constructor(router, cfg, path, parent){
    super(router, cfg, path, parent);
  }

  /**  */
  next(){ return null; }

  /** Performs the actual work */
  async execActionAsync(){ throw ABSTRACT("execActionAsync()"); }
}



//THis should be in AZOS-ui
export class AppletLaunchHandler extends RouteHandler{
  constructor(router, cfg, path, parent){
    super(router, cfg, path, parent);
  }
}


/*
- Applet - add launch arguments - a map. Routing positional arguments are supplied like: {@route: ["a", 2, true]}
- arena.appletOpen(..[args])


Need a catch all/default bucket
Routes are stored in a config node tree in memory.
  routeSectionA/
     routeSectionB/
           handler ->
           appletLaunchHandler ->  AppletAClass, optionalPermissions, launch parameters(they supersede what is passed)
           shortcutB ->  AppletBClass, .............................

  {
    company: {
      maintenance: {

        // company/maintenance/masterdata/orders/order-no/233676
        masterData: {applet: MasterDataSetup, args: {a: 1, b: 2} binder: function(p,args){ }} // binder is a function which takes request, and args which it populates, by default positionalBinder
        masterData: {applet: MasterDataSetup, args: {all: "@@"}} // all: [orders,order-no,233676]
      },
      setup: "$(./maintenance)", //shortcut to 'maintenance'
      reports: {
      },
      about: {applet: AboutUsApplet, args: {}},
      help: {type: "PageTemplateHandler", page: "help.html"}
    }
  }




  navigate(path, params);
  router.nav("#routeSectionA/routeSectionB/shortcutA/byId/1234").go();


*/
