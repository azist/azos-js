import * as types from "./types.js";
import * as aver from "./aver.js";

/**
 * A unit is a logical grouping of registered cases which can be run.
 * A unit can have child units and/or cases.
 * Units get created by either calling a `.ctor` or using a {@link defineUnit()} method.
 * There is always a top-level unit which you can get by calling {@link suite()} function.
*/
export class Unit{
  static #idSeed = 0;

  #id;
  #parent;
  #name;
  #children = [];
  constructor(parent, name, init = null){
    parent = parent ?? null;
    Unit.#idSeed++;
    this.#id = `U-${Unit.#idSeed.toString(16).padStart(4, "0")}`;
    this.#parent = parent !== null ? aver.isOf(parent, Unit) : null;
    this.#name = aver.isString(name);
    init = init !== null ? aver.isFunction(init) : null;

    if (parent !== null){
      this.#parent.register(this);
    }
    if (init !== null) init.apply(this);
  }

  /**
   * Returns suite-unique integer id generated on every unit allocation.
   * You can use this as correlation key in runner etc.
   * */
  get id(){ return this.#id;}
  get parent(){return this.#parent;}
  get name(){return this.#name;}

  register(child){
    aver.isOfEither(child, Unit, Case);
    if (this.#children.indexOf(child) >= 0) return false;//already exists
    this.#children.push(child);
    return true;
  }

  run(runner){
    if (!runner) runner = Runner.default;

    runner.beginUnit(this);
    try{
      for(const one of this.#children){
        one.run(runner);
      }
      runner.endUnit(this, null);
    }catch(error){
      runner.endUnit(this, error);
    }
  }
}

/**
 * This class represents a logical registerable case which can be invoked by calling a `run(runner)`
 * method. Cases are children of units. You typically define a run case using a {@link defineCase()} function
 */
export class Case{
  static #idSeed = 0;

  #id;
  #unit;
  #name;
  #body;
  constructor(unit, name, body){
    Case.#idSeed++;
    this.#id = `C-${Case.#idSeed.toString(16).padStart(4, "0")}`;
    this.#unit = aver.isOf(unit, Unit);
    this.#name = aver.isString(name);
    this.#body = aver.isFunction(body);
    this.#unit.register(this);
  }

  /**
   * Returns suite-unique string id generated on every case allocation.
   * You can use this as correlation key in runner etc.
   * */
  get id(){ return this.#id;}

  /** Returns a unit which this case is under */
  get unit(){return this.#unit;}

  /** Returns logical name of this case */
  get name(){return this.#name;}

  /** Returns a function body for case execution */
  get body(){return this.#body;}

  /** Executes case body such as a unit test body */
  run(runner){
    if (!runner) runner = Runner.default;

    runner.beginCase(this);
    try{
      this.#body.call(this, runner);
      runner.endCase(this, null);
    }catch(error){
      runner.endCase(this, error);
    }
  }

}


export class Runner{
  static #dflt = new Runner();
  /** Returns default runner instance */
  static get default(){ return Runner.#dflt; }

  #indent;
  #sindent;
  constructor(){
    this.#indent = 0;
  }

  beginUnit(unit){
    this.#indent++;
    this.#sindent = ">".padStart(this.#indent * 2, " ");
    console.info(`${this.#sindent} Begin unit: [${unit.id}]('${unit.name}') >`);
  }

  endUnit(unit, error){
    console.info(`${this.#sindent} End unit [${unit.id}]('${unit.name}') >`);
    //todo dump error!!!!
    this.#indent--;
    this.#sindent = ">".padStart(this.#indent * 2, " ");
  }

  beginCase(cse){
  //  console.info(`${this.#sindent} Case ${cse.unit.id}.${cse.id} -> '${cse.name}' `);
  }

  endCase(cse, error){
  //  console.info(`${this.#sindent} Case ${cse.unit.id}.${cse.id} -> '${cse.name}' `);
    //todo dump error!!!!
  }

}



const root = new Unit(null, "*");

/**
 * Returns a root of the run suite, an instance of {@link Unit} class.
 * There is always a default top-level unit with the name "*" called "root".
 */
export function suite() { return root; }

/**
 * Defines a suite of runnable cases by supplying either an init function
 * or an array of {@link Unit} instances.
 * @param {Function | Unit[]} def Definition function or array of Units
 * @returns {Unit} return a suite root unit
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

/**
 * Defines a new unit in the scope of the declaring unit.
 * This parameter is pointing at the declaring parent unit or root unit
 * @param {string} name unit string name
 * @param {function} body unit init body function containing cases and/or child declarations
 * @returns {Unit} newly created unit
 */
export function defineUnit(name, body){
  const parent = this instanceof Unit ? this : root;
  return new Unit(parent, name, body);
}

/**
 * Defines a run case in the declaring unit scope.
 * `this` parameter is pointing at the declaring unit
 * @param {string} name case string
 * @param {function} body case execution body
 * @returns {Case} newly created run case
 */
export function defineCase(name, body){
  const parent = this instanceof Unit ? this : root;
  return new Case(parent, name, body);
}
