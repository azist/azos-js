/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
import { Module } from "azos/modules";
import { ConfigNode, makeNew } from "azos/conf";
import { ABSTRACT } from "./coreconsts";
import { AzosError } from "./types";
import { trim } from "./strings";
import { Session } from "./security";

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

  /** Returns the type of SectionHandler derivative used by default by this router
   * @returns {function}
  */
  get defaultSectionHandler() { return SectionHandler; }

  /** Returns the type of ActionHandler derivative used by default by this router
   * @returns {function}
  */
  get defaultLaunchHandler() { return ActionHandler; }

  /** Override to perform a determination based on attrib use pattern matching of the nextNode
   * within a handler - is it a section or an action node - the specifics are up to the
   * descendant class
  */
  getDefaultHandlerType(handler, nextNode){
    aver.isOf(handler, RouteHandler);
    aver.isOf(nextNode, ConfigNode);
    return this.defaultSectionHandler;
  }

  /**
   * Routes a path, such as the one coming from a browser URI hash fragment, into an array of segment handlers,
   * the last one handling the action of the route
   * @param {String} path a string which contains a path being mapped
   * @returns {RouteHandler[]} returns a route handler array, the last one capable of handling the requested route
   */
  handleRouteSegments(path){
   aver.isNonEmptyString(path);
   const handler = makeNew(RouteHandler, this.#graph, this, this.defaultSectionHandler, [path, null]);
   const result = [];
   for(let next; (next = handler.handle());) result.push(next);
   return result;
  }

  /**
   * Routes a path, such as the one coming from a browser URI hash fragment, into a handler
   * @param {String} path a string which contains a path being mapped
   * @returns {RouteHandler} returns the last route handler which handles the specified path
   */
  handleRoute(path){
    return this.handleRouteSegments(path).at(-1);
  }
}//Router


/** Handles route paths by navigating through routing graph of config nodes segment by segment, dynamically capturing parameters and
 * injecting the next most appropriate polymorphic route handler for processing of the next segment
 */
export class RouteHandler{
  #requestContext;
  #router;
  #graph;
  #path;
  #segment;
  #nextPath;
  #parent;
  #permissions; //TODO: Implement sec in general - assertion script

  constructor(router, graph, path, parent){
    this.#router = aver.isOf(router, Router);
    this.#graph = aver.isOf(graph, ConfigNode);
    this.#path = aver.isNonEmptyString(path);
    this.#parent = aver.isOfOrNull(parent, RouteHandler);
    this.#requestContext = this.#parent?.requestContext ?? { };

    const i = path.indexOf('/');
    if (i==0) {
      throw new AzosError("Bad route", "RouteHandler.ctor()");
    } else if (i > 0){
      this.#segment = trim(path.substring(0, i));
      this.#nextPath = trim(path.substring(i + 1));
    } else {
      this.#segment = trim(path);
      this.#nextPath = "";
    }
  }

  /** Router which processes the request */
  get router(){ return this.#router; }

  /** Returns global request context which can be used to attach properties and other state dynamically.
   * The object is carried-over from the first node in the chain, effectively all handlers share the same context instance
   */
  get requestContext(){ return this.#requestContext; }

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
  next(){ throw ABSTRACT("RouteHandler.next()"); }

  /** Passes or fails with AuthorizationException/403. It checks permissions on the whole ancestry chain leading up to this handler (all parents) */
  checkPermissionChain(session){
    aver.isOf(session, Session);
    let node = this;
    while(node){
      node.checkPermissions(session);
      node = node.parent;
    }
  }

  /** Checks permissions defined on this level */
  checkPermissions(session){
    aver.isOf(session, Session);
    // TODO: Implement!!!!!!!!!!
  }

}

export class SectionHandler extends RouteHandler{

  constructor(router, cfg, path, parent){
    super(router, cfg, path, parent);
  }

  next(){
    //Section or Action default type
    let node = aver.isOf(this.graph.get(this.segment), `${this.constructor.name} expects segment '${this.segment}' to be of ConfigNode type`);
    const nxtDefaultType = this.router.getDefaultHandlerType(this, node);
    const nxtHandler = makeNew(RouteHandler, this.graph, this, nxtDefaultType, [this.nextPath, this]);
    return nxtHandler;
  }
}

/** Terminal/leaf route handler which performs an action such as renders the page or launches an applet.
 * You need to derive a more concrete class which performs a specific action by overriding `_doExecActionAsync()` protected method
 */
export class ActionHandler extends RouteHandler{
  constructor(router, cfg, path, parent){
    super(router, cfg, path, parent);
  }

  /** The Leaf node which performs an action. Returns NULL for action nodes as here is nothing next in the chain*/
  next(){ return null; }

  /** Performs the actual work after checking permissions if a user session object is passed
   * @param {*} context execution context, e.g. for browser routing we would pass arena
   * @param {*} args arguments for action execution
   * @param {Session} session session which execution is under
   */
  async execActionAsync(context, args, session = null){
    //Validate permissions from top to bottom
    aver.isOfOrNull(session, Session);
    if (session) this.checkPermissions(session);
    await this._doExecActionAsync(context, args, session);
  }

  /** Performs the actual work. Returns the result of the action
   * @param {*} context execution context, e.g. for browser routing we would pass arena
   * @param {*} args arguments for action execution
   * @param {Session} session which execution is under
   */
  // eslint-disable-next-line no-unused-vars
  async _doExecActionAsync(context, args, session){
    throw ABSTRACT("execActionAsync()");
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
