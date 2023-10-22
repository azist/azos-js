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

    let thandler = types.classOf(handler);
    // eslint-disable-next-line no-constant-condition
    while(true){
      ////console.debug(thandler);
      result.push(thandler);
      const tparent = types.parentOfClass(thandler);
      if (!tparent) break;
      if (tparent === this.#tInterface) break;
      thandler = tparent;
    }

    return result;
  }

  /**
   * Registers the specified handler instance as a handler of specific interface types.
   * When the specific interface type is passed, it is used directly, otherwise the system computes
   * the types which handler implements by calling {@link getHandlerInterfaces} function.
   * @param {object} handler object of class `tHandler`
   * @param {Function | null} intf optional concrete interface type
   * @param {string} [name=null] optional name
   * @returns true when mapping was registered, false when the mapping could not  be registered wither because
   * matching case is already handled by some other handler, or no interface types were yielded from handler
   */
  register(handler, intf = null, name = null){
    aver.isOf(handler, this.#tHandler);
    const interfaces = intf  ? [aver.isSubclassOf(intf, this.#tInterface)] : this.getHandlerInterfaces(handler);

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
   * @returns {object | null}
   */
  tryResolve(intf, name = null){
    aver.isFunction(intf);
    const bucket = this.#map.get(intf);
    if (!bucket) return null;

    let result = null;
    if (strings.isEmpty(name))
      result = bucket.get(ANY_NAME) ?? bucket.values().next().value;//first item
    else
      result = bucket.get(name);

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
      throw new Error(`Linker error resolving type ${intf.name}, name '${name ?? UNKNOWN}'`);

    return result;
  }

}

/**
 * Links requested dependencies in the supplied object of a form: `{name: type, name_x: type2, ...}`
 * using the supplied linker instance. Each object entry represents a single dependency.
 * This function keeps the key, but replaces the values which are class types (.ctor functions)
 * with resolved references to the object instances which implement these class .ctors (e,.g, inherit from classes).
 * Optionally, you can specify the name for dependency by using the `nsplit` string which is by default "_", e.g.
 * an object entry of "log_main: ILog" will be linked with an instance of the class which derives from "ILog" and
 * has a name "main". You can disable named linking by passing null to "nsplit" param
 * @param {Linker} linker linker to use
 * @param {object} map target object which contains pairs: `{nm: type,...}`
 * @param {string} [nsplit="_"] optional split string for name, for example: "logger_main" will link with named object instance "main". The default is '_'. Pass null to disable named dependencies
 * @returns The original map which was passed-in, having its entries linked
 * @example  <caption> Example </caption>
 *  const got = link(linker, {log: ILog, weather_nation: IWeather, weather_local: IWeather})
 *  //after calling this method, the map will be modified to have its values replaced by
 *  //real objects implementing these "interfaces"(type .ctors), so we will get:
 *  got.log // DefaultLog{...}
 *  got.weather_nation // UsWeatherModule{....}
 *  got.weather_local // OdessaWeatherService{.....}}
 *  //Notice that we have used two `IWeather` services, one named "nation" and another "local"- having both reoslve to different
 *  //instances in spite of both implementing the same "IWeather" contract
 */
export function link(linker, map, nsplit = "_"){
  if (!(linker instanceof Linker) || !map) throw new Error(`Bad 'link()' args: need Linker and map`);

  for(const key in map){
    let tp = map[key];
    if (!types.isFunction(tp)) continue;
    let nm = null;

    if (nsplit){//parse name of the form:  {xyz_name: type}
      const i = key.indexOf(nsplit);
      if (i>0 && i<key.length-1){
        nm = key.slice(i + 1);
      }
    }

    const got = linker.tryResolve(tp, nm);
//console.debug(key, tp, nm);
    if (got === null) throw new Error(`Could not link dependency '${nm}' of type '${tp.name}'`);
    map[key] = got;
  }

  return map;
}
