/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "./aver.js";
import { Module } from "./modules.js";
import { ConfigNode, makeNew } from "./conf.js";
import { ABSTRACT } from "./coreconsts.js";
import { trim } from "./strings.js";
import { Session } from "./session.js";

/**
 * Provides routing services by maintaining a routing graph which maps requests into route handlers, such as app launch handlers
 */
export class Router extends Module{
  #graph;//ConfigNode
  #errorPath;

  constructor(dir, cfg){
    super(dir, cfg);
    this.#graph = aver.isOf(cfg.get("graph"), ConfigNode);
    this.#errorPath = cfg.getString("errorPath", null);
  }

  /** Returns routing graph root */
  get graph(){ return this.#graph; }

  /** Error path to use when routing fails. When routing fails exceptions are thrown.
   * You can handle exceptions by trying to re-route into this errorPath
   */
  get errorPath(){ return this.#errorPath;}

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
   let handler = makeNew(RouteHandler, this.#graph, this, this.defaultSectionHandler, [path, null]);
   const result = [];
   // eslint-disable-next-line no-constant-condition
   while(true){
     handler = handler.next();
     if (!handler) break;
     result.push(handler);
   }
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

//return a tuple [segment, nextPath]
function splitPaths(path){
  while(path.indexOf('/')===0) path = path.substring(1);
  const i = path.indexOf('/');
  if (i > 0){
    return [trim(path.substring(0, i)), trim(path.substring(i + 1)) ];
  } else {
    return [trim(path), ""];
  }
}


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

  constructor(router, graph, path, parent){
    this.#router = aver.isOf(router, Router);
    this.#graph = aver.isOf(graph, ConfigNode);
    this.#path = path = trim(aver.isNonEmptyString(path));
    this.#parent = aver.isOfOrNull(parent, RouteHandler);
    this.#requestContext = this.#parent?.requestContext ?? { };

    if (!parent){//very root
      this.#segment = "/";
      if (path.startsWith("/")){
        this.#nextPath = path.substring(1);
      } else {
        this.#nextPath = path;
        this.#path = "/" + path;
      }
    } else  [this.#segment, this.#nextPath] = splitPaths(this.#path);
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

  /** Returns full path from the very parent of the route to this node*/
  get rootPath(){
    if (!this.#parent) return "/";
    return this.#parent.#parent ? `${this.#parent.rootPath}/${this.#segment}` : `/${this.#segment}`;
  }

  /** The path segment being processed by this node */
  get segment(){ return this.#segment; }

  /** The path segment being processed by the next node/s if any */
  get nextPath(){ return this.#nextPath; }

  /** The parent handler OR NULL if this is a top-most handler at the very beginning of the path */
  get parent(){ return this.#parent; }

  /** Returns the next/child handler or NULL if this handler is the terminal/leaf action handler*/
  next(){ throw ABSTRACT("RouteHandler.next()"); }
}

/** Represents a section of a route (like a file path folder), contrast with ActionHandler which is a terminal action handler */
export class SectionHandler extends RouteHandler{

  constructor(router, cfg, path, parent){ super(router, cfg, path, parent); }

  next(){
    //Section or Action default type
    if (this.nextPath.length === 0) return null;
    const [nxtSeg, ] = splitPaths(this.nextPath);
    let nxtNode = aver.isOf(this.graph.get(nxtSeg), ConfigNode, `${this.constructor.name} expects segment '${nxtSeg}' to be of ConfigNode type`);
    const nxtDefaultType = this.router.getDefaultHandlerType(this, nxtNode);
    const nxtHandler = makeNew(RouteHandler, nxtNode, this.router, nxtDefaultType, [this.nextPath, this]);
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

  /** Performs the actual work
   * @param {*} context execution context, e.g. for browser routing we would pass arena
   * @param {*} args arguments for action execution
   * @param {Session} session session which execution is under, this may be needed changing security context
   */
  async execActionAsync(context, args, session = null){
    aver.isOfOrNull(session, Session);
    return await this._doExecActionAsync(context, args, session);
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
