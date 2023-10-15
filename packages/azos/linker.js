/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as strings from "./strings.js";
import * as aver from "./aver.js";
import { $ } from "./linq.js";
import { UNKNOWN } from "./coreconsts.js";

/**
 * Provides service location functionality - a registry of Typed services descending from some base type which
 * can be queried to link a well-known handler (such as a {@link Module}) to the requestor.
 * This class is rarely needed in business applications
 */
export class Linker{
  #tInterface;
  #tHandler;
  #map;// Map<interface, Map<string, handler>>

  /**
   * Allocates and configures module
   * @param {class} tInterface
   * @param {class} tHandler
   */
  constructor(tInterface, tHandler){
    this.#tInterface = aver.isFunction(tInterface);
    this.#tHandler = aver.isFunction(tHandler);
    aver.isSubclassOf(tHandler, tInterface);
    this.#map = new Map();
  }

  /**
   * Returns an array of interfaces which handler implements
   * @param {class} handler
   * @returns {class[]} array of interfaces supported by the handler
   */
  getHandlerInterfaces(handler){
    aver.isOf(handler, this.#tHandler);
    const result = [];
    // eslint-disable-next-line no-constant-condition
    while(true){
      const tparent = types.parentOfClass(handler);
      if (!tparent) break;
      if (tparent === this.#tInterface) break;
      result.push(tparent);
    }

    return result;
  }

  register(handler, intf = null, name = null){
    aver.isOf(handler, this.#tHandler);
    const interfaces = intf  ? [aver.isOf(intf, this.#tInterface)] : this.getHandlerInterfaces(handler);

    const propName = handler[types.NAME_PROP];
    const nm = !strings.isEmpty(name) ? name : strings.dflt(propName ? propName : null, "*");//any module

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

  unregister(handler, intf = null, name = null){

    return true;
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

    const result = name ? bucket.get(name) : $(bucket).firstOrDefault().value;

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
