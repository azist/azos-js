/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as strings from "./strings.js";
import { NULL } from "./coreconsts.js";
import * as aver from "./aver.js";
/*
 {
   sectionA: {
    type: "typespec",
    a1: v1,
    a2: v2,
    sub: {
      x1: [1, 2, 3, null],
      x2: true,
      x3: "$(/sectionA/a2)"

    }
   },

 }

*/

/** Regular expression that parses out variables <<format tokens>> */
export const REXP_VAR_DECL = /\$\((.*?)\)/g;  // $(path)

/** Makes new {@link Configuration} object from the specified content
 * @param {string | object} configuration source
 * @returns {Configuration}
*/
export function config(content){ return new Configuration(content); }

/**
 * Provides configuration tree navigation and formula evaluation functionality
 */
export class Configuration{

  #content;
  #root;

  constructor(content){
    aver.isNotNull(content);
    if (types.isString(content)){
      content = JSON.parse(content);
    }

    aver.isObject(content);
    this.#content = content;
    this.#root = new ConfigNode(this, null, "/", content);
  }

  /**
   * Returns a raw content object which this config was built from
   * @returns {objectMap}
   */
  get content(){ return this.#content; }

  /**
   * Returns root node
   * @returns {ConfigNode}
   */
  get root(){ return this.#root; }
}

/**
 * Configuration tree node
 */
export class ConfigNode{
  #configuration;
  #parent;
  #name;
  #value;
  constructor(cfg, parent, name, val){
    aver.isNotNull(cfg);
    if (typeof parent === 'undefined') parent = null;
    aver.isNonEmptyString(name);
    aver.isObjectOrArray(val);

    this.#configuration = cfg;
    this.#parent = parent;
    this.#name = name;

    if (types.isObject(val)) {
      const map = {};
      for(var key in val){
        if (key.indexOf('/') >= 0 || key.indexOf('#') >= 0)
          throw new Error(`Config node names may not contain '/' or '#' characters: "${key}", under parent "${this.path}"`);
        const kv = val[key];
        if (types.isObjectOrArray(kv))
          map[key] = new ConfigNode(cfg, this, key, kv);
        else
          map[key] = kv;
      }
      this.#value = map;
    } else if (types.isArray(val)) {
      const arr = [];
      for(var i=0; i < val.length; i++){
        const kv = val[i];
        if (types.isObjectOrArray(kv))
          arr.push(new ConfigNode(cfg, this, `#${i}`, kv));
        else
          arr.push(kv);
      }
      this.#value = arr;
    } else {
      this.#value = val;
    }
  }

  get [Symbol.toStringTag]() { return "ConfigNode"; }

  toString() {
    return `ConfigNode('${this.#name}', ${this.isSection ? (this.isArraySection ? "["+this.count+"]" : "{"+this.count+"}") : (this.#value?.toString() ?? NULL) })`;
  }

  get configuration() { return this.#configuration; }
  get name(){ return this.#name; }
  get parent() { return this.#parent; }

  get isSection(){ return types.isObject(this.#value); }
  get isArray(){ return types.isArray(this.#value); }

  /**
   * Returns the absolute path for this section node
   */
  get path(){
    const p = this.#parent;
    if (p === null) return "/";
    if (p.parent === null) return `/${this.#name}`;
    return `${p.path}/${this.#name}`;
  }

  /**
   * Navigates the path to the section or value
   */
   nav(path){
    aver.isString(path);
    path = strings.trim(path);
    if (path.length === 0) return this;
    if (path === "./") return this;
    if (path === "..") return this.parent;

    const segs = path.split("/");
    let result = this;
    for(var i=0; i < segs.length; i++){
      if (result === null) return undefined;
      if (!(result instanceof ConfigNode)) return result;
      const seg = strings.trim(segs[i]);
      if (seg==="") {
        result = this.configuration.root;
        continue;
      }
      if (seg===".") continue;
      if (seg==="..") {
        result = result.parent;
        continue;
      }
      if (seg.startsWith("#") && seg.length > 1){
        const idx = seg.slice(1) | 0;
        result = result.get(idx);
      } else {
        result = result.get(seg);
      }
    }
    return result;
  }

  /**
   * For section objects (maps or arrays) returns the number of elements
   * @returns {int}
   */
  get count(){
    const v = this.#value;
    if (types.isArray(v)) return v.length;
    return Object.keys(v).length;
  }

  /** Iterates over a section: map or array
   * Returning KVP {key, idx, value}; index is -1 for object elements
  */
  *[Symbol.iterator](){
    if (!this.isSection) return;//empty iterable
    if (types.isArray(this.#value)){
      const arr = this.#value;
      for(let i=0; i<arr.length; i++) yield {key: this.#name, idx: i, val: arr[i]};
    } else {
      const map = this.#value;
      for(const k in this.#value) yield {key: k, idx: -1, val: map[k]};
    }
  }

  #evalStack = null;
  /**
   * Evaluates an arbitrary value as of this node in a tree
   * @param {*} val
   */
  evaluate(val){
    if (!types.isString(val)) return val;

    let stack = this.#evalStack;
    if (stack === null) {
      stack = new Set();
      stack._level = 0;
      stack._path = this.path;
      stack._val = val;
      this.#evalStack = stack;
    }
    stack._level++;
    try{
        const vmap = (s, path) => {
          if (strings.isEmpty(path)) return "";
          if (path.startsWith("^^^")){ //escape
            path = path.slice(3);
            return `$(${path})`;
          }
          if (stack.has(path)) throw new Error(`ConfigNode('${stack._path}') can not evaluate '${stack._val}' due to recursive ref to path '${path}' at ref level ${stack._level}`);
          try{
            stack.add(path);
            return this.nav(path);
          }finally{
            stack.delete(path);
          }
        };

        const result = val.replace(REXP_VAR_DECL, vmap);
        return result;
    }finally{
      stack._level--;
      if (stack._level === 0) this.#evalStack = null;
    }
  }

  /**
   * Returns child element by the first matching name for map or index for an array.
   * The names are coalesced from left to right - the first matching element is returned.
   * Returns undefined for non-existing element or undefined/null index
   * @returns {undefined | Node | object} element value which
   */
  get(...names){
    const vv = this.getVerbatim(...names);
    const result = this.evaluate(vv);
    return result;
  }

  /**
   * This function is similar to {@link get} but it DOES NOT EVALUATE vars denoted by `$(path)` pattern,
   * instead it returns a verbatim value.
   *
   * Returns child element by the first matching name for map or index for an array.
   * The names are coalesced from left to right - the first matching element is returned.
   * Returns undefined for non-existing element or undefined/null index
   * @returns {undefined | Node | object} element value which
   */
  getVerbatim(...names){
    const val = this.#value;

    if (types.isObject(val)){ //object section
      for(let name of names){
        if (name === undefined || name === null) continue;
        if (types.hown(val, name))
          return this.#value[name];
      }
    } else if (types.isArray(val)){//array section
      for(let name of names){
        if (name === undefined || name === null) continue;
        const idx = (types.isString(name) ? (name.replace('#', '')) : name) | 0;
        if (idx >=0 && idx < val.length)
          return val[idx];
      }
    }

    return undefined;
  }



  //#region Typed getters
  /**
   * Tries to read a string value coalescing attribute names until a named attribute is found.
   * If the attribute is not found or value can not be read as a string, returns optional dflt.
   * Please note, the dflt value may be of any type
   * @param {string | string[]} names a single string name, or an array of string attribute names to coalesce the value from
   * @param {*} dflt optional default
   */
  getString(names, dflt){
    if (names === undefined || names===null) return dflt;
    const got = types.isArray(names) ? this.get(...names) : this.get(names);
    return dflt === undefined ? got : strings.isEmpty(got) ? dflt : got;
  }

  /**
   * Tries to read a bool value coalescing attribute names until a named attribute is found.
   * If the attribute is not found or value can not be read as a bool, returns optional dflt.
   * Please note, the dflt value may be of any type
   * @param {string | string[]} names a single string name, or an array of string attribute names to coalesce the value from
   * @param {*} dflt optional default
   */
  getBool(names, dflt){
    if (names === undefined || names===null) return dflt;
    const got = types.isArray(names) ? this.get(...names) : this.get(names);
    if (got === undefined) return dflt;
    try{ return types.asBool(got); }
    catch{ return dflt; }
  }

  /**
   * Tries to read a tri bool (undefined|false|true) value coalescing attribute names until a named attribute is found.
   * If the attribute is not found or value can not be read as a bool, returns `undefined`.
   * @param {string | string[]} names a single string name, or an array of string attribute names to coalesce the value from
   */
  getTriBool(names){
    if (names === undefined || names===null) return undefined;
    const got = types.isArray(names) ? this.get(...names) : this.get(names);
    try{ return types.asTriBool(got); }
    catch{ return undefined; }
  }

  /**
   * Tries to read an int value coalescing attribute names until a named attribute is found.
   * If the attribute is not found or value can not be read as an int, returns optional dflt.
   * Please note, the dflt value may be of any type
   * @param {string | string[]} names a single string name, or an array of string attribute names to coalesce the value from
   * @param {*} dflt optional default
   */
  getInt(names, dflt){
    if (names === undefined || names===null) return dflt;
    const got = types.isArray(names) ? this.get(...names) : this.get(names);
    if (got === undefined) return dflt;
    try{ return types.asInt(got, false); }
    catch{ return dflt; }
  }

  /**
   * Tries to read a real value coalescing attribute names until a named attribute is found.
   * If the attribute is not found or value can not be read as a real, returns optional dflt.
   * Please note, the dflt value may be of any type
   * @param {string | string[]} names a single string name, or an array of string attribute names to coalesce the value from
   * @param {*} dflt optional default
   */
  getReal(names, dflt){
    if (names === undefined || names===null) return dflt;
    const got = types.isArray(names) ? this.get(...names) : this.get(names);
    if (got === undefined) return dflt;
    try { return types.asReal(got, false); }
    catch{ return dflt; }
  }

  /**
   * Tries to read a money value coalescing attribute names until a named attribute is found.
   * If the attribute is not found or value can not be read as a money, returns optional dflt.
   * Please note, the dflt value may be of any type
   * @param {string | string[]} names a single string name, or an array of string attribute names to coalesce the value from
   * @param {*} dflt optional default
   */
  getMoney(names, dflt){
    if (names === undefined || names===null) return dflt;
    const got = types.isArray(names) ? this.get(...names) : this.get(names);
    if (got === undefined) return dflt;
    try{ return types.asMoney(got, false); }
    catch{ return dflt; }
  }

  /**
   * Tries to read a Date value coalescing attribute names until a named attribute is found.
   * If the attribute is not found or value can not be read as a Date, returns optional dflt.
   * Please note, the dflt value may be of any type
   * @param {string | string[]} names a single string name, or an array of string attribute names to coalesce the value from
   * @param {*} dflt optional default
   */
  getDate(names, dflt){
    if (names === undefined || names===null) return dflt;
    const got = types.isArray(names) ? this.get(...names) : this.get(names);
    if (got === undefined) return dflt;
    try{ return types.asDate(got, false); }
    catch{ return dflt; }
  }
  //#endregion

}
