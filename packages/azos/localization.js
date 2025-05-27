/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as aver from "./aver.js";
import * as strings from "./strings.js";
import { AppComponent } from "./components.js";
import { Application } from "./application.js";
import { config, ConfigNode, makeNew } from "./conf.js";
import { TimeZone, TZ_UTC, UTC_TIME_ZONE } from "./time.js";
import { Session } from "./session.js";

export const CULTURE_INVARIANT = "*";
export const CULTURE_US = "us";

export const ISO_LANG_ENG = "eng";
export const ISO_LANG_DEU = "deu";
export const ISO_LANG_FRA = "fra";
export const ISO_LANG_RUS = "rus";
export const ISO_LANG_ESP = "esp";

//SCHEMA/FIELD: do not use Symbols - these values may need to be hard-coded in 3rd party
//translation files
export const ANY_SCHEMA = "ANY-SCHEMA--";
export const ANY_FIELD  = "ANY-FIELD--";

export const SCHEMA_MODEL_VALIDATION = "Model-Validation";
export const FIELD_ERROR  = "Field-Error";

export const FIELD_DAY   = "day";
export const FIELD_MONTH = "month";


export const DATE_FORMAT = Object.freeze({
  LONG_WEEK_DATE:   "LongWeekDate",  //  Tuesday, 30 August 2018
  SHORT_WEEK_DATE:  "ShortWeekDate", //  Tue, 30 Aug 2018
  LONG_DATE:        "LongDate",      //  30 August 2018
  SHORT_DATE:       "ShortDate",     //  30 Aug 2018
  NUM_DATE:         "NumDate",       //  08/30/2018

  LONG_MONTH:       "LongMonth",     // August 2018
  SHORT_MONTH:      "ShortMonth",    // Aug 2018
  NUM_MONTH:        "NumMonth",      // 10/2018

  LONG_DAY_MONTH:   "LongDayMonth",  //  12 August
  SHORT_DAY_MONTH:  "ShortDayMonth"  //  12 Aug
});

export const TIME_DETAILS = Object.freeze({
  NONE: "NONE", // time is off
  HM:   "HM",   // hours:minutes
  HMS:  "HMS",  // hours:minutes:seconds
  HMSM: "HMSM"  // hours:minutes:seconds:mills
});


export const INVARIANT_MONTH_LONG_NAMES = Object.freeze([
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"]);
export const INVARIANT_MONTH_SHORT_NAMES = INVARIANT_MONTH_LONG_NAMES.map( v => strings.truncate(v, 3) );

export const INVARIANT_DAY_LONG_NAMES = Object.freeze([
  "Sunday", "Monday", "Tuesday",
  "Wednesday", "Thursday", "Friday",
  "Saturday"]);
export const INVARIANT_DAY_SHORT_NAMES = INVARIANT_DAY_LONG_NAMES.map( v => strings.truncate(v, 3) );

/**
 * Provides default implementation of invariant localizer.
 * Other localizer should extend this class and install it in app chassis.
 * Any application always has an instance of a default localizer
 */
export class Localizer extends AppComponent {

  #strings;
  #tzMap;

  constructor(app, cfg){
    aver.isOf(app, Application);
    aver.isOf(cfg, ConfigNode);
    super(app, cfg);
    const stringTable = cfg.get("strings");

    if (types.isAssigned(stringTable)){
      aver.isObject(stringTable);
      this.#strings = stringTable;
    } else {
      this.#strings = {
        [ISO_LANG_ENG]: { [ANY_SCHEMA]: {[ANY_FIELD]: {  }} },
        [ISO_LANG_RUS]: { [ANY_SCHEMA]: {[ANY_FIELD]: {"yes":"да", "no":"нет"}}, "tezt": {[ANY_FIELD]: {"yes":"так", "no":"неа"}} },
        [ISO_LANG_DEU]: { [ANY_SCHEMA]: {[ANY_FIELD]: {"yes":"ja", "no":"nein"}} },
        [ISO_LANG_FRA]: { },
        [ISO_LANG_ESP]: { }
      };
    }

    this.#tzMap = new Map();

    //UTC is always there
    this.#tzMap.set(TZ_UTC, new TimeZone(config({ name: TZ_UTC, description: "UTC - Coordinated Universal Time Zone", baseOffsetMs: 0 }).root));

    const cfgZones = cfg.get("zones", "time-zones");
    if (cfgZones){
      for(const cfgZone of cfgZones.getChildren(false)){
        const zone = makeNew(TimeZone, cfgZone, null, TimeZone);
        if (this.#tzMap.has(zone.name)) {
          throw new types.LclError(`TimeZone '${zone.name}' already registered`, "tzm.ctor()");
        }
        this.#tzMap.set(zone.name.toLowerCase(), zone);
      }
    }
  }

  get name () { return "Localizer('Invariant')"; }
  get isInvariant() { return true; }

  /**
   * Formats the date and time value as string per culture
   * @param {Object} args
   * @param {Date} args.dt Datetime argument, it may be supplied without an args object as a sole argument
   * @param {string} args.culture Localization culture id
   * @param {DATE_FORMAT} args.dtFormat Format of date part representation
   * @param {TIME_DETAILS} args.tmDetails Time detail level (NONE= no time)
   * @param {boolean} args.utc Treat date time as UTC value
   */
  formatDateTime({dt = null, culture = null, dtFormat = DATE_FORMAT.NUM_DATE, tmDetails = TIME_DETAILS.NONE, timeZone = null} = {}){
    if (dt===null){
      if (arguments.length==0)
        throw new types.LclError("'dt' arg is missing", "formatDateTime()");

      dt = arguments[0];
    }

    const v = types.isDate(dt) ? dt : new Date(dt);
    timeZone = this.getEffectiveTimeZone(timeZone);
    const cmp = timeZone.extractComponents(v);

    const month = cmp.month - 1; //need month INDEX
    const daym  = cmp.day;
    const dayw  = cmp.dayw - 1;//need index
    const year  = cmp.year;

    const d2 = (num) => ("0" + num.toString()).slice(-2);
    const d3 = (num) => ("00" + num.toString()).slice(-3);
    const dnl = (idx) => this.localizeCultureString(INVARIANT_DAY_LONG_NAMES[idx], culture, FIELD_DAY);
    const dns = (idx) => this.localizeCultureString(INVARIANT_DAY_SHORT_NAMES[idx], culture, FIELD_DAY);
    const mnl = (idx) => this.localizeCultureString(INVARIANT_MONTH_LONG_NAMES[idx], culture, FIELD_MONTH);
    const mns = (idx) => this.localizeCultureString(INVARIANT_MONTH_SHORT_NAMES[idx], culture, FIELD_MONTH);

    let result = "";

    switch(dtFormat){
      case DATE_FORMAT.LONG_WEEK_DATE:   result = `${dnl(dayw)}, ${daym} ${mnl(month)} ${year}`; break; //  Tuesday, 30 August 2018
      case DATE_FORMAT.SHORT_WEEK_DATE:  result = `${dns(dayw)}, ${daym} ${mns(month)} ${year}`; break; //  Tue, 30 Aug 2018
      case DATE_FORMAT.LONG_DATE:        result = `${daym} ${mnl(month)} ${year}`; break; //  30 August 2018
      case DATE_FORMAT.SHORT_DATE:       result = `${daym} ${mns(month)} ${year}`; break; //  30 Aug 2018
      case DATE_FORMAT.NUM_DATE:         result = `${d2(month+1)}/${d2(daym)}/${year}`; break;//  08/30/2018

      case DATE_FORMAT.LONG_MONTH:       result = `${mnl(month)} ${year}`; break;  // August 2018
      case DATE_FORMAT.SHORT_MONTH:      result = `${mns(month)} ${year}`; break;  // Aug 2018
      case DATE_FORMAT.NUM_MONTH:        result = `${d2(month+1)}/${year}`; break;   // 10/2018

      case DATE_FORMAT.LONG_DAY_MONTH:   result = `${daym} ${mnl(month)}`; break;    //  12 August
      case DATE_FORMAT.SHORT_DAY_MONTH:  result = `${daym} ${mns(month)}`; break;     //  12 Aug
      default:
        result = `${daym} ${mnl(month)} ${year}`;
    }

    if (tmDetails===TIME_DETAILS.NONE) return result;

    const hours   = cmp.hour;
    const minutes = cmp.minute;

    if (tmDetails===TIME_DETAILS.HM) return `${result} ${d2(hours)}:${d2(minutes)}`;

    const seconds = cmp.second;

    if (tmDetails===TIME_DETAILS.HMS) return `${result} ${d2(hours)}:${d2(minutes)}:${d2(seconds)}`;

    const millis =  cmp.millisecond;
    return `${result} ${d2(hours)}:${d2(minutes)}:${d2(seconds)}:${d3(millis)}`;
  }

  /*eslint-disable no-unused-vars*///------------------------------

  /**
  * @typedef {Object} CurrencySymbols
  * @property {string} sym Currency symbol, such as $
  * @property {string} ts Thousands separator, such as ,
  * @property {string} ds Decimal separator, such as .
  */

  /**
   * Returns currency formatting symbols for culture
   * @param {string} culture
   * @returns {CurrencySymbols} Currency formatting symbols
   */
  getCurrencySymbols(culture){
    return {sym: "$", ts: ",", ds: "."};
  }

  /**
   * Returns primary language iso code for the specified culture
   * @param {string} culture
   */
  getPrimaryLanguageIso(culture){
    return ISO_LANG_ENG;
  }

  /**
   * Returns an array of languages in the order of importance for the specified culture
   * @param {string} culture
   */
  getLanguageIsos(culture){
    return [ISO_LANG_ENG];
  }

  /*eslint-enable no-unused-vars*///------------------------------

  /**
   * Formats currency per supplied culture
   * @param {Object|number}args
   * @param {number} args.amt Amount to format - required
   * @param {string} args.iso Currency iso code such as 'usd' - required
   * @param {string} args.culture Formatting culture id
   * @param {int} args.precision Number of decimal places
   * @param {boolean} args.symbol True to add the currency symbol
   * @param {boolean} args.sign  True to add minus sign, otherwise culture accounting format is used (such as parenthesis in the US)
   * @param {boolean} args.thousands True to add thousands separator
   */
  formatCurrency({amt = NaN, iso = null, culture = null,  precision = 2, symbol = true, sign = true, thousands = true} = {}){
    if (isNaN(amt)){
      if (arguments.length<2)
        throw new types.LclError("Currency 'amt' and 'iso' args are required", "formatCurrency()");
      amt = arguments[0];
      iso = arguments[1];
    }

    if (isNaN(amt)) throw new types.LclError("Currency 'amt' isNaN", "formatCurrency()");
    if (!iso) throw new types.LclError("Currency 'iso' is required", "formatCurrency()");
    if (!culture) culture = CULTURE_INVARIANT;
    const symbols = this.getCurrencySymbols(culture);
    const neg = amt < 0;
    if (precision<0) precision = 0;

    amt = Math.floor(Math.abs(amt) * Math.pow(10, precision));
    const amts = amt.toString();
    let amtw, amtf;
    if (precision>0){
      amtw = amts.slice(0, amts.length-precision);//whole
      amtf = amts.slice(-precision);//fraction
    }else{
      amtw = amts;
      amtf = "";
    }

    if (thousands){
      let whole = "";
      for(let i=1; amtw.length-i>=0; i++){
        if (i>1 && (i-1)%3===0) whole = symbols.ts + whole;
        whole = amtw[amtw.length-i] + whole;
      }
      amtw = whole;
    }

    let result = neg ? (sign ? "-" : "(") : "";//  - or (

    result += symbol ? symbols.sym : "";// $

    result += precision>0 ? amtw + symbols.ds + amtf : amtw; // whole.fraction

    if (neg && !sign) result += ")";
    return result;
  }

  /**
   * Returns an array of all language ISOs supported by the instance
   */
  getStringLocalizationIsos(){
    return Object.keys(this.#strings).filter(n => n.length === 3);
  }

  /**
   * Localizes string identified by the value within the schema and field scopes for the primary language of the supplied culture
   */
  localizeCultureString(value, culture, field, schema){
    let iso = this.getPrimaryLanguageIso(culture);
    return this.localizeString(value, iso, field, schema);
  }

  /**
   * Localizes string identified by the value within the schema and field scopes per supplied language iso code
   * @param {string} value to localize/localization key
   * @param {string} iso language iso code
   * @param {string} field field name to which localization is applied, e.g. ANY_FIELD. Fields are resolved under schema
   * @param {string} schema schema name to which localization is applied, e.g. ANY_SCHEMA
   */
  localizeString(value, iso, field, schema){
    if (!value) return null;
    if (strings.isEmpty(value) || strings.isEmpty(iso)) return null;

    if (strings.isEmpty(field)) field = ANY_FIELD;
    if (strings.isEmpty(schema)) schema = ANY_SCHEMA;

    var node = this.#strings;
    if (!types.hown(node, iso)) return value;
    node = node[iso];

    if (!types.hown(node, schema)){
      if (!types.hown(node, ANY_SCHEMA)) return value;
      node = node[ANY_SCHEMA];
    } else node = node[schema];

    if (!types.hown(node, field)){
      if (!types.hown(node, ANY_FIELD)) return value;
      node = node[ANY_FIELD];
    } else node = node[field];

    if (!types.hown(node, value)) return value;
    return node[value];
  }

  /** Gets {@link TimeZone} derivative instance by name or throws an exception  if not found. Names are case-insensitive */
  getTimeZone(zone){
    aver.isNonEmptyString(zone, "zone");
    const result = this.tryGetTimeZone(zone.toLowerCase());
    if (!result) throw new types.LclError(`TimeZone '${zone}' not found`, "tzm.getZone()");
    return result;
  }

  /** Tries to get {@link TimeZone} derivative instance by name or `null` if no such named zone was found.  Names are case-insensitive  */
  tryGetTimeZone(zone){
    aver.isNonEmptyString(zone, "zone");
    const result = this.#tzMap.get(zone);
    return result ?? null;
  }

  /** Gets an array of all zones in the registry */
  getAllTimeZones(){ return [...this.#tzMap.values()]; }


  /** Gets TimeZone by its name if it is passed, or from timezone preference of the session object.
   * If session not passed then takes session from app session, if such time zone is not found then UTC is defaulted.
   * Throws if the tz name is explicitly passed and such timezone is not found by name in the localizer timezone stack.
   * @param {null|string|TimeZone} tzOrName - If supplied, must be an instance of TimeZone or a string. Strings get resolved to
   * TimeZone by name or exception  thrown if not found.
   * @param {Session} [session=null] - Session to use for timezone resolution, if not supplied then app session is used.
   * @returns {TimeZone} - Returns TimeZone instance
   */
  getEffectiveTimeZone(tzOrName, session = null){
    if (!tzOrName){ //default to UTC
      const tzn =  (aver.isOfOrNull(session, Session) ?? this.app.session).tzName;
      if (tzn) tzOrName = this.tryGetTimeZone(tzn);
      if (!tzOrName) tzOrName = UTC_TIME_ZONE;
    } else if (types.isString(tzOrName)) {//resolve from string name (requires TimeZoneManager)
      tzOrName = this.getTimeZone(tzOrName);//throws on not found
    } else aver.isOf(tzOrName, TimeZone);//must be of TimeZone type

    return tzOrName;//which is always tz now
  }


  /**
   * Returns a vector {dt: Date, tz: TimeZone} having its Date value UTC component offset As-OF the proper time zone supplied.
   * In other words, this method returns a UTC date which is obtained by converting a LOCAL supplied date into UTC using TimeZone class,
   * effectively re-coding the supplied local date as of the specified time zone as-if the date was entered in that time zone.
   * JS Date class respects LOCAL COMPUTER time zone only, which is problematic and not always the desired behavior when the date is entered
   * by a user in a different time zone.
   * @param {*} v - Date-convertible value (int, string) or Date Value as is. The value is assumed to be as of JS-LOCAL (per Date class spec) zone
   * @param {null|string|TimeZone} [timeZone=null] time zone as of which to perform conversion, if null then session is used
   * @param {null} [session=null] - Session to use for timezone resolution, if not supplied then app session is used.
   * @param {boolean} [isDST=false] - true if the date is in Daylight Saving Time mode, false otherwise, this is needed for double-hour DST edge cases (research wikipedia)
   * @returns {{dt: Date, tz: TimeZone}} - Returns a vector `{dt Date, tz TimeZone}` where Date is the UTC date as of the time zone and TimeZone is the effective time zone
   * @example
   *  Suppose a user is in New York City, and their computer-local date is 1pm on June 1st,
   * however the session (or screen-local) time zone is set to "Pacific Time Zone" which is 3 hours behind of New York.
   * When the user types-in a string "June 1, 2025 1:00pm" the JS Date class parses this as local time which is -4 hrs from UTC in NY, so the Date object is "2025-06-01T17:00:00Z",
   * HOWEVER this method is sensitive to the time zone which was specified via parameter or session, which is "Pacific Time Zone" in this case,
   * so really the user meant 1pm in Pacific Time Zone, which is 7 hours behind UTC during DST, so the Date object returned by this method will be "2025-06-01T20:00:00Z"
   * as-if the user was operating from a computer in "Pacific Time Zone", and the session was set accordingly.
   * This is especially important when users perform an enterprise-wide data entry tasks which may require display and entry of dates in the branch office-local dates,
   * effectively user's computer-local dates timezones become completely logically irrelevant.
  */
  treatUserDateInput(v, timeZone = null, session = null, isDST = false){
    timeZone = this.getEffectiveTimeZone(timeZone, session);

    const jsLocalDate = types.asDate(v);

    const ts = timeZone.combineComponents({ //convert local date to UTC components
      year:   jsLocalDate.getFullYear(),
      month:  jsLocalDate.getMonth() + 1, //getMonth() returns 0-11
      day:    jsLocalDate.getDate(),
      hour:   jsLocalDate.getHours(),
      minute: jsLocalDate.getMinutes(),
      second: jsLocalDate.getSeconds(),
      millisecond: jsLocalDate.getMilliseconds(),
      isDST:  isDST
    });

    return {dt: new Date(ts), tz: timeZone};
  }

}//Localizer
