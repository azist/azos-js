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
    this.#id = `U${Unit.#idSeed.toString().padStart(4, "0")}`;
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

  _match(runner){
    for(const one of this.#children){
      if (one._match(runner)) return true;
    }
    return false;
  }

  run(runner){
    if (!runner) runner = Runner.default;

    const matching = this.#children.filter(one => one._match(runner));
    if (matching.length === 0) return false;

    runner.beginUnit(this);
    try{
      for(const one of matching){
        one.run(runner);
      }
      runner.endUnit(this, null);
    }catch(error){
      runner.endUnit(this, error);
    }

    return true;
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
    this.#id = `C${Case.#idSeed.toString().padStart(4, "0")}`;
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

  _match(runner){ return runner.matchCase(this); }

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

let argsParsed = false;
let argsUnits = null;
let argsCases = null;

/**
 * Default implementation for process cmd args parsing `--filter "Unit1 Unit2 &caseX &caseY"`
 * @param {Case} cse case to filter
 * @returns true if the supplied case satisfies the logical filter set from via command line args
 */
export function cmdArgsCaseFilter(cse){
  if (!argsParsed){
    argsParsed = true;
    if (typeof(process) === 'undefined') return true;//args not avail

    const idx = process.argv.indexOf("--filter");
    if (idx > 0 && idx < process.argv.length-1){
      const filterSegments = process.argv[idx+1].split(" ").filter(one => one !== '');
      for(const one of filterSegments){
        if (one.length > 1 && one.startsWith("&")){//case
          if (argsCases===null) argsCases = [];
          argsCases.push(one.slice(1));//get rid of &
        }else{
          if (argsUnits===null) argsUnits = [];
          argsUnits.push(one);
        }
      }
    }
  }

  if (!cse) return false;

  if (argsUnits !== null){
    let found = false;
    for(const pat of argsUnits){
      if (cse.unit.name.indexOf(pat) >=0){
        found = true;
        break;
      }
    }
    if (!found) return false;
  }

  if (argsCases !== null){
    let found = false;
    for(const pat of argsCases){
      if (cse.name.indexOf(pat) >=0){
        found = true;
        break;
      }
    }
    if (!found) return false;
  }

  return true;
}

export class Runner{
  static #dflt = new Runner();
  /** Returns default runner instance */
  static get default(){ return Runner.#dflt; }

  #indent;
  #sindent;
  #sindent2;

  #countOk;
  #countError;
  #countTotal;
  #countUnits;
  #fCaseFilter;

  constructor(fCaseFilter = null){
    this.#indent = 0;
    this.#sindent = "";
    this.#sindent2 = "";

    this.#countOk = 0;
    this.#countError = 0;
    this.#countTotal = 0;
    this.#countUnits = 0;

    this.#fCaseFilter = types.isFunction(fCaseFilter) ? fCaseFilter : null;
  }

  get countOk(){ return this.#countOk; }
  get countError(){ return this.#countError; }
  get countTotal(){ return this.#countTotal; }
  get countUnits(){ return this.#countUnits; }

  /**
   * Returns true when the supplied case matches the conditions and should be executed.
   * You can test for `cse.unit` property as well
   * @param {Case} cse to match
   * @returns {boolean} true when case should be ran
   */
  matchCase(cse){
    const f = this.#fCaseFilter;
    if (f !== null) return f(cse);
    return true;
  }


  //https://en.m.wikipedia.org/wiki/ANSI_escape_code#Colors

  beginUnit(unit){
    console.log(`${this.#sindent}\x1b[100m\x1b[30m Unit \x1b[40m \x1b[97m${unit.id}::'${unit.name}'\x1b[90m `);
    this.#countUnits++;
    this.#indent++;
    this.#sindent = "".padStart(this.#indent * 2, "  ") + "├─";
    this.#sindent2 = "".padStart(this.#indent * 2, "  ") + "│ └─";
  }

  endUnit(unit, error){
    //todo dump error!!!!
    this.#indent--;
    this.#sindent = "".padStart(this.#indent * 2, "  ");
    this.#sindent2 = this.#sindent;
    console.log(`\x1b[90m${this.#sindent}  └──\x1b[90m ${unit.id}  \x1b[90mOK: \x1b[92m${this.#countOk}  \x1b[90mErrors: \x1b[91m${this.#countError}  \x1b[90mTotal: ${this.#countTotal} \x1b[0m \n`);
  }

  beginCase(cse){
    this.#countTotal++;
    console.log(`\x1b[90m${this.#sindent}Case ${cse.unit.id}.\x1b[37m${cse.id} -> \x1b[36m'${cse.name}' \x1b[0m`);
  }

  endCase(cse, error){
    if (error === null){
      this.#countOk++;
    } else {
      this.#countError++;
      console.error(`\x1b[90m${this.#sindent2}\x1b[30m\x1b[101mError:\x1b[0m \x1b[91m${error.toString()}\x1b[0m `);
    }
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
