/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as aver from "./aver.js";


/** Thrown for runner-related exceptions */
export class RunError extends types.AzosError {
  constructor(message, from = null, cause = null){ super(message, from, cause, 528); }
}

//All Units
const allUnits = [];

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

    allUnits.push(this);
    this.addDefinition(init);
  }

  /**
   * Returns suite-unique integer id generated on every unit allocation.
   * You can use this as correlation key in runner etc.
   * */
  get id(){ return this.#id;}
  get parent(){return this.#parent;}
  get name(){return this.#name;}

  /**
   * Adds unit definition by applying the supplied init function in unit scope
   * @param {Function} init - initialization function body
   * @returns {Unit} returns self
   */
  addDefinition(init){
    if (!init) return this;
    aver.isFunction(init);
    units.push(this);
    try{
      init.apply(this);
    } finally {
      units.pop();
    }
    return this;
  }


  register(child){
    aver.isOfEither(child, Unit, Case);
    if (this.#children.indexOf(child) >= 0) return false;//already exists
    this.#children.push(child);
    return true;
  }

  /** Determines if this unit should be included or excluded from a run. Returns true if it should be included */
  _match(runner){
    for(const one of this.#children){
      if (one._match(runner)) return true;
    }
    return false;
  }

  /** Determines if this unit should or should not be skipped while running. It is similar to `_match()`
  however skipped units get printed out into runner as skipped */
  _shouldSkip(runner){
    return runner.shouldSkipUnit(this);
  }

  /** Async method runs all child units/cases */
  async run(runner){
    if (!runner) runner = Runner.default;

    if (this._shouldSkip(runner)){
      runner.skipUnit(this);
      return false;
    }

    const matching = this.#children.filter(one => one._match(runner));
    if (matching.length === 0) return false;

    runner.beginUnit(this);
    try{
      for(const one of matching){
        await one.run(runner);
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

  #startMs = 0;
  #endMs = 0;
  #timeoutMs = 0;
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

  /** Last/current execution start timestamp */
  get startMs(){ return this.#startMs; }
  /** Last/current execution end timestamp */
  get endMs(){ return this.#endMs; }

  /** Timeout constraint for this test; default 0 = no timeout */
  get timeoutMs() {return this.#timeoutMs; }
  /** Timeout constraint for this test; default 0 = no timeout */
  set timeoutMs(v) { this.#timeoutMs = v | 0; }

  /** Determines if this case should be included or excluded from a run. Returns true if it should be included */
  _match(runner){ return runner.matchCase(this); }

  /** Determines if this case should or should not be skipped while running. It is similar to `_match()`
  however skipped units get printed out into runner as skipped */
  _shouldSkip(runner){ return runner.shouldSkipCase(this); }

  /** Async: executes case body such as a unit test body */
  async run(runner){
    if (!runner) runner = Runner.default;

    if (this._shouldSkip(runner)){
      runner.skipCase(this);
      return false;
    }

    runner.beginCase(this);
    this.#startMs = performance.now();
    try{
      const got = this.#body.call(this, runner);
      if (types.isAssigned(got)) await got; //block on async call

      this.#endMs = performance.now();

      if (this.#timeoutMs > 0 && (this.#endMs - this.#startMs) > this.#timeoutMs)
        throw new RunError(`Run timeout of ${this.#timeoutMs} ms exceeded`, "case.run()");

      runner.endCase(this, null);
    }catch(error){
      this.#endMs = performance.now();
      runner.endCase(this, error);
    }

    return true;
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

/**
 * Provides basic counts of success/errors and overridable `begin/end` style hooks
 * for units and cases. `matchCase` returns true for cases which will run.
 */
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
  #elapsedMs;
  #fCaseFilter;

  /** Optionally takes a filter predicate `f(Case): bool`.
   * You can pass default {@link cmdArgsCaseFilter()} which handles command line args in node
   */
  constructor(fCaseFilter = null){
    this.#indent = 0;
    this.#sindent = "";
    this.#sindent2 = "";

    this.#countOk = 0;
    this.#countError = 0;
    this.#countTotal = 0;
    this.#countUnits = 0;
    this.#elapsedMs = 0;

    this.#fCaseFilter = types.isFunction(fCaseFilter) ? fCaseFilter : null;
  }

  get countOk(){ return this.#countOk; }
  get countError(){ return this.#countError; }
  get countTotal(){ return this.#countTotal; }
  get countUnits(){ return this.#countUnits; }
  get elapsedMs(){ return this.#elapsedMs; }

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

  /**
   * Returns true when the supplied unit matches the conditions and should be skipped.
   * @param {Unit} unit to match
   * @returns {boolean} true when case should be skipped
   */
  shouldSkipUnit(unit){
    return false;
  }

  /**
   * Returns true when the supplied case matches the conditions and should be skipped.
   * You can test for `cse.unit` property as well
   * @param {Case} cse to match
   * @returns {boolean} true when case should be skipped
   */
  shouldSkipCase(cse){
    return false;
  }

  //https://en.m.wikipedia.org/wiki/ANSI_escape_code#Colors

  skipUnit(unit){
    console.log(`${this.#sindent}\x1b[105m\x1b[30m Unit \x1b[40m \x1b[95m${unit.id}::'${unit.name} skipped`);
  }

  skipCase(cse){
    console.log(`\x1b[35m${this.#sindent}Case ${cse.unit.id}.${cse.id} -> '${cse.name}' skipped`);
  }


  beginUnit(unit){
    console.log(`${this.#sindent}\x1b[100m\x1b[30m Unit \x1b[40m \x1b[97m${unit.id}::'${unit.name}'\x1b[90m `);
    this.#countUnits++;
    this.#indent++;
    this.#sindent = "".padStart(this.#indent * 2, "  ") + "├─";
    this.#sindent2 = "".padStart(this.#indent * 2, "  ") + "│ └─";
  }

  endUnit(unit, error){
    this.#indent--;
    this.#sindent = "".padStart(this.#indent * 2, "  ");
    this.#sindent2 = this.#sindent;

    if (this.countError > 0){
      console.log(`\x1b[90m${this.#sindent}  └──\x1b[90m ${unit.id}  \x1b[90mOK: \x1b[92m${this.#countOk}  \x1b[90mErrors: \x1b[91m${this.#countError}  \x1b[90mTotal: \x1b[93m${this.#countTotal} (!) \x1b[90m Running time: \x1b[34m${this.#elapsedMs.toFixed(1)} ms\x1b[0m \n`);
    } else{
      console.log(`\x1b[90m${this.#sindent}  └──\x1b[90m ${unit.id}  \x1b[90mOK: \x1b[92m${this.#countOk}  \x1b[90mErrors: ${this.#countError}  \x1b[90mTotal: ${this.#countTotal} \x1b[90m Running time: \x1b[34m${this.#elapsedMs.toFixed(1)} ms\x1b[0m \n`);
    }

    if (error !== null){
      this.#countError++;
      console.error(`\x1b[90m${this.#sindent2}\x1b[30m\x1b[105m Error \x1b[97m\x1b[45m ${unit.name} \x1b[0m \x1b[35m${error.toString()}\x1b[0m `);
    }
  }

  // eslint-disable-next-line no-unused-vars
  beginCase(cse){
    this.#countTotal++;
    //console.groupCollapsed(cse.name);
  }

  endCase(cse, error){
    //console.groupEnd();
    const elapsedMs = cse.endMs - cse.startMs;
    this.#elapsedMs += elapsedMs;

    console.log(`\x1b[90m${this.#sindent}Case ${cse.unit.id}.\x1b[37m${cse.id} -> \x1b[36m'${cse.name}' \x1b[34m${elapsedMs.toFixed(3)} ms \x1b[0m`);

    if (error === null){
      this.#countOk++;
    } else {
      this.#countError++;
      console.error(`\x1b[90m${this.#sindent2}\x1b[30m\x1b[101m Error \x1b[97m\x1b[41m ${cse.unit.name}::${cse.name} \x1b[0m \x1b[91m${error.toString()}\x1b[0m `);
    }
  }

}


//Unit STACK
const units = [new Unit(null, "*")];

/**
 * Returns a root of the run suite, an instance of {@link Unit} class.
 * There is always a default top-level unit with the name "*" called "root".
 */
export function suite() { return units[0]; }

/**
 * Deletes all units defined in suite
 */
export function clearSuite() {
  types.arrayClear(units);
  types.arrayClear(allUnits);
  units.push(new Unit(null, "*"));
}

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
  } else { throw new Error("`defineSuite()` needs either an init function or an array of units and/or cases");}

  return units[0];
}

/**
 * Defines a new unit in the scope of the declaring unit OR if unit with such name already exists, adds definition to existing one.
 * This parameter is pointing at the declaring parent unit or root unit
 * @param {string} name unit string name
 * @param {function} body unit init body function containing cases and/or child declarations
 * @returns {Unit} newly created unit or existing unit
 */
export function defineUnit(name, body){
  const parent = this instanceof Unit ? this : current();
  let existing = allUnits.find(one => one.parent === parent && one.name === name);

  if (!existing) {
    return new Unit(parent, name, body);
  } else {
    existing.addDefinition(body);
    return existing;
  }
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

/** Macro for con.dir(obj) in a collapsed group, used for testing */
export function condir(grp, obj){
  console.groupCollapsed(grp ?? "Group");
  console.dir(obj);
  console.groupEnd();
}
