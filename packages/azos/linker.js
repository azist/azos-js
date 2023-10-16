/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as strings from "./strings.js";
import * as aver from "./aver.js";
import { UNKNOWN } from "./coreconsts.js";


/**
 * Special handler name which is reserved to represent handlers with unknown name
 */
export const ANY_NAME = "*";

/**
 * Implemented by handlers, establishes a "linker" protocol - a handler entity which implements such method
 * returns an array of interfaces which handler gets mapped into
 */
export const GET_LINKER_INTERFACES_METHOD = Symbol("getLinkerInterfaces");

/**
 * Provides a registry of handlers: list of associative mappings between a target class (type function aka an `Interface`)
 * and handler object instance/s which can "handle" the requested interface either by handling it directly (e.g. a module), or
 * a factory for other objects which can handle the desired request.
 * This can be thought about in terms of service location pattern, which is used in turn for dependency injection.
 * for type-safety the constructor takes `tInterface` constraint which is a base marker interface for all interfaces mapped by this class; and
 *  `tHandler` constraint which is a base for all handler instances, for example a {@link ModuleLinker} sets `Module` as both interface and handler constraints.
 * */
export class Linker{
  #tInterface;
  #tHandler;
  #map;// Map<interface, Map<string, handler>>

  /**
   * Allocates and configures Linker to resolve a desired interface into a handler object
   * which is typically as sub-class of the specified interface or another object which makes instances
   * of the required interface
   * @param {class} tInterface
   * @param {class} tHandler
   */
  constructor(tInterface, tHandler){
    this.#tInterface = aver.isFunction(tInterface);
    this.#tHandler = aver.isFunction(tHandler);
    this.#map = new Map();
  }

  /** Base Interface type which this linker maintains, the resolution is done for the sub-types of this interface*/
  get TInterface(){ return this.#tInterface; }

  /** Base type of handler which is mapped to interfaces */
  get THandler(){ return this.#tHandler; }

  /**
   * Returns an array of interfaces which handler implements.
   * If handler implements {@link GET_LINKER_INTERFACES_METHOD} protocol, then it is called, otherwise
   * the interfaces are computed of the handler type itself, starting at (including) the parent type of
   * the specified handler, all the way to the top-level interface type (excluding)
   * @param {class} handler handler to get interfaces from
   * @returns {class[]} array of interfaces supported by the handler
   */
  getHandlerInterfaces(handler){
    aver.isOf(handler, this.#tHandler);
    const result = [];

    const getInterfaces = handler[GET_LINKER_INTERFACES_METHOD];
    if(types.isFunction(getInterfaces)) return getInterfaces.bind(handler)();

    // eslint-disable-next-line no-constant-condition
    while(true){
      const tparent = types.parentOfClass(handler);
      if (!tparent) break;
      if (tparent === this.#tInterface) break;
      result.push(tparent);
    }

    return result;
  }

  /**
   * Registers the specified handler instance as a handler of specific interface types.
   * When the specific interface type is passed, it is used directly, otherwise the system computes
   * the types which handler implements by calling {@link getHandlerInterfaces} function.
   * @param {object} handler object of class `tHandler`
   * @param {Function | null} intf optional concrete interface type
   * @param {string} name optional name
   * @returns true when mapping was registered, false when the mapping could not  be registered wither because
   * matching case is already handled by some other handler, or no interface types were yielded from handler
   */
  register(handler, intf = null, name = null){
    aver.isOf(handler, this.#tHandler);
    const interfaces = intf  ? [aver.isOf(intf, this.#tInterface)] : this.getHandlerInterfaces(handler);

    const propName = handler[types.NAME_PROP];
    const nm = !strings.isEmpty(name) ? name : strings.dflt(propName ? propName : null, ANY_NAME);

    let added = false;
    const map = this.#map;
    for(const one of interfaces){
      let bucket = map.get(one);
      if (bucket===undefined){
        bucket = new Map();
        bucket.set(nm, handler);
        map.set(one, bucket);
      } else {
        if (bucket.has(nm)) return false;//name exists
        bucket.set(nm, handler);
      }
      added = true;
    }

    return added;
  }

  /**
   * Unregisters the handler instance from all mappings returning true,
   * or false when handler did not match any mappings
   * @param {object} handler handler of `tHandler` type
   * @returns {boolean}
   */
  unregister(handler){
    aver.isOf(handler, this.#tHandler);

    let deleted = false;
    for(const bucket of this.#map.entries()){
      for(const entry of bucket.value.entries()){
        if (entry.value === handler){
          bucket.delete(entry.key);
          deleted = true;
        }
      }
      if (bucket.size === 0){
        this.#map.delete(bucket.key);
      }
    }

    return deleted;
  }

  /**
   * Service location: tries to find a handler which supports the specified interface with optional name.
   * Returns such handler or NULL IF not found.
   * @param {class} intf a type of handler to find
   * @param {string | null} name  optional name of handler
   */
  tryResolve(intf, name = null){
    aver.isFunction(intf);
    const bucket = this.#map.get(intf);
    if (!bucket) return null;

    name = strings.dflt(name, ANY_NAME);

    const result = bucket.get(name);

    return result ?? null;
  }

  /**
   * Service location: tries to find a handler which supports the specified interface with optional name.
   * Returns such handler or throws if not found
   * @param {class} intf a type of handler to find
   * @param {string | null} name  optional name of handler
   */
  resolve(intf, name = null){
    const result = this.tryResolve(intf, name);
    if (result === null)
      throw new Error(`Linker error resolving type ${intf}, name '${name ?? UNKNOWN}'`);

    return result;
  }

}
