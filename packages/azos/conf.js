/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as strings from "./strings.js";
import { UNKNOWN } from "./coreconsts.js";
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

/** Regular expression that parses out variables $(var_path) */
export const REXP_VAR_DECL = /\$\((.*?)\)/g;  // $(path)

/** Provides uniform base for Configuration-related exceptions */
export class ConfigError extends types.AzosError {
  constructor(message, from = null, cause = null){ super(message, from, cause, 517); }
}

/** Makes new {@link Configuration} object from the specified content
 * @param {string | object} configuration source
 * @returns {Configuration}
*/
export function config(content){ return new Configuration(content); }


/**
 * Establishes a verbatim value protocol for config value consumption.
 * If a complex value (e.g. a custom object) implements this protocol, then instead
 * of turning it into a ConfigNode, the system will return the provided value as-is.
 */
export const GET_CONFIG_VERBATIM_VALUE = Symbol("getConfigVerbatimValue");

/**
 * Wraps a complex value in config nodes as a verbatim one - without turning objects
 * into config sections and arrays into collection ConfigNodes.
 *
 * For example, if you need to pass-in an array (e.g. a buffer) directly into a config value
 * you write something like `{buffer: new Verbatim([])}`
 */
export class Verbatim{
  #value;
  [GET_CONFIG_VERBATIM_VALUE](){ return this.#value; }
  constructor(v){ this.#value = v;}
  get value(){ return this.#value;}
}

/**
 * Provides configuration tree navigation and variable evaluation functionality
 */
export class Configuration{

  #content;
  #root;

  constructor(content){
    try{
      aver.isNotNull(content);
      if (types.isString(content)){
        content = JSON.parse(content);
      }
      aver.isObject(content);
    }catch(e){
      throw new ConfigError(`Bad configuration init content: ${e.message}`, "Config.ctor()", e);
    }

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
          throw new ConfigError(`Config node names may not contain '/' or '#' characters: "${key}", under parent "${this.path}"`, "ConfigNode.ctor()");
        const kv = val[key];

        let vp = types.isAssigned(kv) ? kv[GET_CONFIG_VERBATIM_VALUE] : null;
        if (!types.isFunction(vp)) vp = null;

        if (types.isObjectOrArray(kv) && !(kv instanceof Date) && !vp)
          map[key] = new ConfigNode(cfg, this, key, kv);
        else
          map[key] = vp ? vp.call(kv) : kv;
      }
      this.#value = map;
    } else if (types.isArray(val)) {
      const arr = [];
      for(var i=0; i < val.length; i++){
        const kv = val[i];

        let vp = types.isAssigned(kv) ? kv[GET_CONFIG_VERBATIM_VALUE] : null;
        if (!types.isFunction(vp)) vp = null;


        if (types.isObjectOrArray(kv) && !(kv instanceof Date) && !vp)
          arr.push(new ConfigNode(cfg, this, `#${i}`, kv));
        else
          arr.push(vp ? vp.call(kv) : kv);
      }
      this.#value = arr;
    } else {
      throw new ConfigError(`ConfigNode '${name}' value must be either an object or an array`, "ConfigNode.ctor()");
    }
  }

  get [Symbol.toStringTag]() { return `ConfigNode(${this.path})`; }

  toString() {
    return `ConfigNode('${this.path}', ${this.isArray ? "["+this.count+"]" : "{"+this.count+"}"})`;
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
      result = result.get(seg);
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

  /**
   * Iterable generator method which returns just this node if 'includeSelf=true' and it is a section, that is: not an array.
   * If this node is an array then it returns all array elements which are {@link ConfigNode} sections (not arrays)
   * @param {boolean} [includeSelf=true] When true includes this node itself if it is a section, has no effect on array nodes
   * @returns {Iterable<ConfigNode>}
   */
  getChildren(includeSelf = true){
    const self = this;
    return {
      [Symbol.iterator]: function* (){
        if (types.isArray(self.#value)){
          const arr = self.#value;
          for(let i=0; i<arr.length; i++) {
            const one = arr[i];
            if (one instanceof ConfigNode && one.isSection) yield one;
          }
        } else if (includeSelf) yield self;
      }
    };
  }

  /** Returns this `ConfigNode` as a flat object copy, that is: this node is copied as a new object, its non-ConfigNode properties are assigned
   * to the new object, whereas ConfigNode properties are flattened.
   * Sections are flattened into JS plain object maps, and arrays are flattened into plain JS arrays
   * @param {boolean} [verbatim=false] True to bypass variable evaluation, false by default
   * @returns {map | Array} a map with a copy of this and possibly child nodes (if any exist) flattened as well
   */
  flatten(verbatim = false){
    if (types.isArray(this.#value)) { //ARRAY
      const arr = this.#value;
      const result = [ ];
      for(let i = 0; i < arr.length; i++) {
        let v = arr[i];
        if (!verbatim) v = this.evaluate(v);
        if (v instanceof ConfigNode) v = v.flatten(verbatim);
        result.push(v);
      }
      return result;
    } else { //SECTION
      const map = this.#value;
      const result = { };
      for(const k of map.keys()) {
        let v = map[k];
        if (!verbatim) v = this.evaluate(v);
        if (v instanceof ConfigNode) v = v.flatten(verbatim);
        result[k] = v;
      }
      return result;
    }
  }

  /** Iterates over a section: map or array
   * Returning KVP {key, idx, value}; index is -1 for object elements
  */
  *[Symbol.iterator](){
    if (types.isArray(this.#value)){
      const arr = this.#value;
      for(let i=0; i<arr.length; i++) yield {key: this.#name, idx: i, val: arr[i]};
    } else if (types.isObject(this.#value)){
      const map = this.#value;
      for(const k in map) yield {key: k, idx: -1, val: map[k]};
    }
  }

  static #evalStack = null;
  /**
   * Evaluates an arbitrary value as of this node in a tree
   * @param {*} val
   */
  evaluate(val){
    if (!types.isString(val)) return val;

    let stack = ConfigNode.#evalStack;
    if (stack === null) {
      stack = new Set();
      stack._level = 0;
      stack._path = this.path;
      stack._val = val;
      ConfigNode.#evalStack = stack;
    }
    stack._level++;
    try{
        const vmap = (s, path) => {
          if (strings.isEmpty(path)) return "";
          if (path.startsWith("^^^")){ //escape
            path = path.slice(3);
            return `$(${path})`;
          }
          if (stack.has(path)) throw new ConfigError(`ConfigNode('${stack._path}') can not evaluate '${stack._val}' due to recursive ref to path '${path}' at ref level ${stack._level}`, "evaluate()");
          try{
            stack.add(path);
            return this.nav(path);
          }finally{
            stack.delete(path);
          }
        };

        //20250319 DKh Special case - another node reference
        //When a variable can be treated as a non-string rather as an object if there is nothing else to interpolate
        if (val.length > 3 && val.startsWith("$(") && val.charAt(val.length-1) === ")"){
          return vmap(null, val.substring(2, val.length-1));
        }
        //20250319 DKh -------------------------------------

        const result = val.replace(REXP_VAR_DECL, vmap);//REXP has a `/g` flag for global replace all
        return result;
    } finally {
      stack._level--;
      if (stack._level === 0) ConfigNode.#evalStack = null;
    }
  }

  //#region Getters
  /**
   * Returns child element by the first matching name for map or index for an array.
   * The names are coalesced from left to right - the first matching element is returned.
   * Returns undefined for non-existing element or undefined/null index
   * @returns {undefined | ConfigNode | object} element value which
   */
  get(...names){
    const vv = this.getVerbatim(...names);
    const result = this.evaluate(vv);
    return result;
  }

  /**
   * Returns a flattened child `ConfigNode` element copy by the first matching name for map or index for an array.
   * The names are coalesced from left to right - the first matching element is returned.
   * Returns null for non-existing elements or non-`ConfigNode` elements.
   * @returns {undefined | ConfigNode | object} element value which
   */
  getFlatNode(...names){
    const got = this.get(names);
    return got instanceof ConfigNode ? got.flatten() : null;
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
        try{
          if (name === undefined || name === null) continue;
          if (types.hown(val, name))
            return this.#value[name];
        }catch(e){
          throw new ConfigError(`ConfigNode error getting map attr '${name}': ${e.message}`, "getVerbatim()", e)
        }
      }
    } else if (types.isArray(val)){//array section
      for(let name of names){
        try{
          if (name === undefined || name === null) continue;
          const idx = types.asInt(types.isString(name) ? name.replace('#', '') : name);
          if (idx >=0 && idx < val.length)
            return val[idx];
        }catch(e){
          throw new ConfigError(`ConfigNode error getting array value by index '${name}': ${e.message}`, "getVerbatim()", e)
        }
      }
    }

    return undefined;
  }
  //#endregion

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
    let got = types.isArray(names) ? this.get(...names) : this.get(names);
    if (got !== null) got = strings.asString(got, true);
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

/**
 * Makes and configures an instance of the specified type using one of the convention ctor signatures.
 * The type is specified using either a config node with `type` attribute or passed directly in place of config node.
 * If `dir` is passed then it gets passed as first ctor parameter.
 * If `cfg` is a {@link ConfigNode} instance, then it gets passed as a second ctor param.
 * If `cargs` array is passed, it must be an array which gets concatenated after the above params.
 * If the `cfg` is config node, then the type is read from `type` property, if not specified then defaulted from `tdflt` param.
 * You can also pass class type directly into `cfg`.
 * @returns Newly constructed instance of the specified type
 * @param {Function} base class function for base interface which the allocated instance must derive from
 * @param {ConfigNode | Function} cfg class function, or instance of {@link ConfigNode}
 * @param {object | null} dir  director of the type being created or null if the type does not support director
 * @param {Function | null} tdflt default type to use when the `type` attribute is not specified
 * @param {object[] | null} cargs optional extra arguments to pass to .ctor
 */
export function makeNew(base, cfg, dir = null, tdflt = null, cargs = null){
  let argDescr = "...";
  try{
    aver.isNotNull(cfg);
    aver.isFunction(base);

    const isNode = cfg instanceof ConfigNode;

    if (!isNode && !types.isFunction(cfg)) throw new ConfigError(`Param 'cfg' should be either a 'ConfigNode' or a 'Function'`);

    argDescr = isNode ? `'${cfg.toString()}'` : cfg.name;//function name

    let type = cfg;//.ctor fun
    if (isNode){
      type = cfg.get("type") ?? tdflt;
      if (!types.isFunction(type)) throw new ConfigError(`target cls was not supplied as 'type' conf attr and 'tdflt' param was not passed`);
    }

    let args = [null];//dummy 'this'
    if (dir !== undefined && dir !== null) args.push(dir);
    if (isNode) args.push(cfg);
    if (cargs !== undefined && cargs !== null){
      aver.isArray(cargs);
      args = args.concat(cargs);
    }

    const result = new (Function.prototype.bind.apply(type, args)); // see Reflect.construct
    if (!(result instanceof base)) throw new ConfigError(`instance of type '${type.name}' is not of expected base '${base.name}'`);
    return result;
  }catch(e){
    throw new ConfigError(`Factory "makeNew(${base.name ?? UNKNOWN}, ${argDescr})" error: ${e.message}`, "makeNew()", e);
  }
}
