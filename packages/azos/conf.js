/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
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


/**
 *
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
    this.#root = new Node(this, null, "/", content);
  }

  /**
   * Returns a raw content object which this config was built from
   * @returns {objectMap}
   */
  get content(){ return this.#content; }

  /**
   * Returns root node
   * @returns {Node}
   */
  get root(){ return this.#root; }
}

/**
 * Configuration tree node
 */
export class Node{
  #configuration;
  #parent;
  #name;
  #value;
  constructor(cfg, parent, name, val){
    aver.isNotNull(cfg);
    aver.isNonEmptyString(name);

    this.#configuration = cfg;
    this.#parent = parent;
    this.#name = name;

    if (types.isObject(val)) {
      const map = {};
      for(var key in val){
        const kv = val[key];
        if (types.isObjectOrArray(kv))
          map[key] = new Node(cfg, this, key, kv);
        else
          map[key] = kv;
      }
      this.#value = map;
    } else if (types.isArray(val)) {
      const arr = [];
      for(var i=0; i < val.length; i++){
        const kv = val[i];
        if (types.isObjectOrArray(kv))
          arr.push(new Node(cfg, this, `#${i}`, kv));
        else
          arr.push(kv);
      }
      this.#value = arr;
    } else {
      this.#value = val;
    }
  }

  get configuration() { return this.#configuration; }
  get name(){ return this.#name; }
  get parent() { return this.#parent; }

  get isAttr(){ return !types.isAssigned(this.#value) || !types.isObjectOrArray(this.#value); }
  get isSection(){ return types.isObjectOrArray(this.#value); }
  get isArraySection(){ return types.isArray(this.#value); }

  get value(){ return  this.evaluate(this.#value); }
  get verbatimValue(){ return this.#value; }

  /**
   * Evaluates an arbitrary value as of this node in a tree
   * @param {*} val
   */
  evaluate(val){

  }

}
