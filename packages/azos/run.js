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
    this.#id = `U${Unit.#idSeed.toString(16).padStart(4, "0")}`;
    this.#parent = parent !== null ? aver.isOf(parent, Unit) : null;
    this.#name = aver.isString(name);
    init = init !== null ? aver.isFunction(init) : null;

    if (parent !== null){
      this.#parent.register(this);
    }
    if (init !== null){
      units.push(this);
      try{
        init.apply(this);
      } finally {
        units.pop();
      }

    }
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
    this.#id = `C${Case.#idSeed.toString(16).padStart(4, "0")}`;
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

  #countOk;
  #countError;
  #countTotal;
  #countUnits;

  constructor(){
    this.#indent = 0;
    this.#sindent = "";

    this.#countOk = 0;
    this.#countError = 0;
    this.#countTotal = 0;
    this.#countUnits = 0;
  }

  get countOk(){ return this.#countOk; }
  get countError(){ return this.#countError; }
  get countTotal(){ return this.#countTotal; }
  get countUnits(){ return this.#countUnits; }


  beginUnit(unit){
    console.log(`${this.#sindent} \x1b[90mBegin unit \x1b[97m${unit.id}::'${unit.name}'\x1b[90m `);
    this.#countUnits++;
    this.#indent++;
    this.#sindent = "".padStart(this.#indent * 2, "··") + "├";
  }

  endUnit(unit, error){
    //todo dump error!!!!
    this.#indent--;
    this.#sindent = "".padStart(this.#indent * 2, "  ");
    console.log(`${this.#sindent}  └ \x1b[97m${unit.id} \x1b[90mOK: \x1b[92m${this.#countOk}\x1b[0m  \x1b[90mErrors:  \x1b[91m${this.#countError}\x1b[0m  \x1b[97mTotal: ${this.#countTotal}\x1b[0m \n`);
  }

  beginCase(cse){
    this.#countTotal++;
    console.log(`${this.#sindent} \x1b[90mCase ${cse.unit.id}.${cse.id} -> '${cse.name}' `);
  }

  endCase(cse, error){
    if (error === null) this.#countOk++; else this.countError++;
  //  console.info(`${this.#sindent} Case ${cse.unit.id}.${cse.id} -> '${cse.name}' `);
    //todo dump error!!!!
  }

}



const units = [new Unit(null, "*")];

/**
 * Returns a root of the run suite, an instance of {@link Unit} class.
 * There is always a default top-level unit with the name "*" called "root".
 */
export function suite() { return units[0]; }

/**
 * Returns most current inner unit being declared.
 * The top level unit is always returned at the end
 * @returns {Unit}
 */
export function current(){ return units[units.length-1]; }

/**
 * Defines a suite of runnable cases by supplying either an init function
 * or an array of {@link Unit} instances.
 * @param {Function | Unit[]} def Definition function or array of Units
 * @returns {Unit} return a suite root unit
 */
export function defineSuite(def){
  if (types.isFunction(def)) def.apply(units[0]);
  else if (types.isArray(def)){
    for(const one of def){
      units[0].register(one);
    }
  }
  return units[0];
}

/**
 * Defines a new unit in the scope of the declaring unit.
 * This parameter is pointing at the declaring parent unit or root unit
 * @param {string} name unit string name
 * @param {function} body unit init body function containing cases and/or child declarations
 * @returns {Unit} newly created unit
 */
export function defineUnit(name, body){
  const parent = this instanceof Unit ? this : current();
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
  const parent = this instanceof Unit ? this : current();
  return new Case(parent, name, body);
}
