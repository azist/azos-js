import * as types from "./types.js";
import * as aver from "./aver.js";

export class Unit{
  #parent;
  #name;
  #children = [];
  constructor(parent, name, init = null){
    parent = parent ?? null;
    this.#parent = parent !== null ? aver.isOf(parent, Unit) : null;
    this.#name = aver.isString(name);
    init = init !== null ? aver.isFunction(init) : null;

    if (init !== null) init.apply(this);

    if (parent !== null){
      this.#parent.register(this);
    }
  }

  get parent(){return this.#parent;}
  get name(){return this.#name;}

  register(child){
    aver.isOfEither(child, Unit, Case);
    if (this.#children.indexOf(child) >= 0) return false;//already exists
    this.#children.push(child);
    return true;
  }

  run(ctx){
    console.info(this.#name);
    for(const one of this.#children){
      one.run(ctx);
    }
  }

}

export class Case{
  #unit;
  #name;
  #body;
  constructor(unit, name, body){
    this.#unit = aver.isOf(unit, Unit);
    this.#name = aver.isString(name);
    this.#body = aver.isFunction(body);
    this.#unit.register(this);
  }

  get unit(){return this.#unit;}
  get name(){return this.#name;}
  get body(){return this.#body;}

  /** Executes case body such as a unit test body */
  run(){
    console.info(this.#name);
    this.#body.apply(this);
  }
}


const root = new Unit(null, "*");

export function rootUnit() { return root; }

/**
 * Defines a suite of runnable cases
 * @param {Function | Unit[]} def Definition function or array of Units
 */
export function defineSuite(def){
  if (types.isFunction(def)) def.apply(root);
  else if (types.isArray(def)){
    for(const one of def){
      root.register(one);
    }
  }
  return root;
}


export function runUnit(name, body){
  const parent = this instanceof Unit ? this : root;
  return new Unit(parent, name, body);
}

export function runCase(name, body){
  const parent = this instanceof Unit ? this : root;
  return new Case(parent, name, body);
}
