/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "./aver.js";
import { config, makeNew } from "./conf.js";
import { Module } from "./modules.js";
import { AzosError } from "./types.js";

/** UTC time zone name. The instance of {@link TimeZone} with this name is ALWAYS present in {@link TimeZoneManager} registry */
export const TZ_UTC = "UTC";

/** Milliseconds in one hour */
export const ONE_HOUR_MS = 60 * 60 * 1000;



/** Provides named time zone information along with ability to convert UTC timestamps to local (as of timezone) components and back */
export class TimeZone {

  #name;
  #description;
  #iana;
  #windows;
  #baseOffsetMs;

  constructor(cfg){
    this.#name         = cfg.getString("name", null);
    aver.isNonEmptyMinMaxString(this.#name, 2, 32, "valid TZ name");
    this.#description  = cfg.getString("name", this.constructor.name);
    this.#iana         = cfg.getString("iana", null);
    this.#windows      = cfg.getString("windows", null);
    this.#baseOffsetMs = cfg.getInt("baseOffsetMs", 0);
  }

  /** Gets the unique id/name of this time zone. This is the field which time zones are keyed on */
  get name(){ return this.#name; }

  /** Gets the description of this time zone */
  get description(){ return this.#description; }

  /** Gets the IANA name of this time zone if it has one (standard timezones do) */
  get iana(){ return this.#iana; }

  /** Gets the Windows name of this time zone if it has one (standard timezones do) */
  get windows(){ return this.#windows; }

  /** Gets standard offset of this time zone relative to UTC */
  get standardBaseOffsetMs(){ return this.#baseOffsetMs; }

  /**
   * Returns the millisecond offset of this timezone relative to UTC as of the specified UTC timestamp
   * @param {number| Date} ts number or date UTC timestamp
   * @returns {number} offset in milliseconds
  */
  // eslint-disable-next-line no-unused-vars
  getOffsetMsAsOfUtc(ts){ return this.standardBaseOffsetMs; }

  /**
   * Returns the millisecond offset of this timezone relative to UTC as of LOCAL (for this zone) timestamp with explicit DST flag
   * @param {number| Date} ts number or date LOCAL (as of this zone)UTC timestamp
   * @param {Boolean} isDST true when the date is in Daylight Saving Time mode
   * @returns {number} offset in milliseconds
  */
  // eslint-disable-next-line no-unused-vars
  getOffsetMsAsOfLocal(ts, isDST){ return this.standardBaseOffsetMs; }


  /** Extracts components out of UTC timestamp as of THIS timezone,
   * that is: you pass-in a UTC timestamp as a number of milliseconds since UNIX epoch, or a Date object (which is already based UX epoch timestamp internally),
   * the system calculates the offset as of that timestamp and applies it to the argument, effectively returning components of the
   * date value as of THIS timezone
   * @param {number| Date} ts number or date UTC timestamp
  */
  extractComponents(ts){
    if (ts === null || ts == undefined) ts = 0;
    else if (ts instanceof Date) ts = ts.getTime();
    else aver.isNumber(ts, "ts must be a number");

    const offset = this.getOffsetMsAsOfUtc(ts);
    const result = new Date(ts + offset);// e.g. CLE is -5:0, so we add -5 hours to UTC to get local time

    //note: we use Date as a convenience, the local date is irrelevant and its UTC component is really wht we need
    //this is why it is an implementation detail and not a part of the public API
    return {
      year:        result.getUTCFullYear(),
      month:       result.getUTCMonth() + 1,
      day:         result.getUTCDate(),
      dayw:        result.getUTCDay() + 1,
      hour:        result.getUTCHours(),
      minute:      result.getUTCMinutes(),
      second:      result.getUTCSeconds(),
      millisecond: result.getUTCMilliseconds()
    };
  }

  /** Converts components of a date as of THIS timezone (LOCAL) to UTC timestamp */
  combineComponents(components){
    aver.isObject(components, "components must be an object");
    const { year, month, day, hour, minute, second, millisecond, isUtc, isDST } = components;
    const ts = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
    if (isUtc) return ts; // no conversion needed

    const offset = this.getOffsetMsAsOfLocal(ts, isDST);
    return ts - offset;// e.g. CLE is -5:0, so we subtract -5 hours from LOCAL to get to UTC
  }
}

/** A timezone used in the USA and Canada which does not support DST */
export class UsTimeZone extends TimeZone { }

/** Encapsulates general US and Canada time zone with Daylight savings conversion rules */
export class UsStandardTimeZone extends UsTimeZone {
/*
    United States and Canada
    DST begins at 2:00 a.m. local time on the second Sunday in March.
    DST ends at 2:00 a.m. local time on the first Sunday in November.
    During the start, clocks "spring forward" from 2:00 a.m. to 3:00 a.m., and during the end, clocks "fall back" from 2:00 a.m. to 1:00 a.m.
    Exceptions in the US include Arizona (except Navajo Nation), Hawaii, and some territories which do not observe DST
*/
   static DST_OFFSET_MS = 1  * //hr
                          60 * //min
                          60 * //sec
                          1000; //ms


  #getDstRange(ldt){
    let dstStart = new Date(Date.UTC(ldt.getUTCFullYear(), 3/*March*/, 1, 2, 0, 0));
    for(let sun = 0;;){
      if (dstStart.getUTCDay() === 0) {//Sunday == 0
        sun++;
      }
      if (sun === 2) break;
      dstStart.setUTCDate(dstStart.getUTCDate() + 1);
    }

    let dstEnd = new Date(Date.UTC(ldt.getUTCFullYear(), 11/*November*/, 1, 2, 0, 0));
    while(dstEnd.getUTCDay() !== 0) dstEnd.setUTCDate(dstEnd.getUTCDate() + 1);

    return { dstStart, dstEnd };
  }

  /**
   * Returns the millisecond offset of this timezone relative to UTC as of the specified UTC timestamp
   * @param {number| Date} ts number or date UTC timestamp
   * @returns {number} offset in milliseconds
  */
  getOffsetMsAsOfUtc(ts){
    const so = this.standardBaseOffsetMs;

    const lts = ts + so; // local time
    const ldt = new Date(lts);//fake "UTC" since Date does not have an API

    let {dstStart, dstEnd} = this.#getDstRange(ldt);
    ////console.log("fromUTC",ldt, dstStart, dstEnd);

    const isDST = ldt >= dstStart && ldt < dstEnd;
    const dstOffset = isDST ? UsStandardTimeZone.DST_OFFSET_MS : 0;

    return so + dstOffset;
  }

  /**
   * Returns the millisecond offset of this timezone relative to UTC as of LOCAL (for this zone) timestamp with explicit DST flag
   * @param {number| Date} ts number or date LOCAL (as of this zone)UTC timestamp
   * @param {Boolean} isDST true when the date is in Daylight Saving Time mode
   * @returns {number} offset in milliseconds
  */
  getOffsetMsAsOfLocal(ts, isDst = true){    // Mar 8, 2023  2:am
    const so = this.standardBaseOffsetMs;

    const lts = ts; // already local time
    const ldt = new Date(lts);//fake "UTC" since Date does not have an API

    let {dstStart, dstEnd} = this.#getDstRange(ldt);
    ////console.log("fromLOCAL",ldt, dstStart, dstEnd);

    const isInDstRange = isDst && ldt >= dstStart && ldt < dstEnd;
    const dstOffset = isInDstRange ? UsStandardTimeZone.DST_OFFSET_MS : 0;

    return so + dstOffset;
  }
}

/**
 * Provides a module which provides a registry of named {@link TimeZone} instances}
 */
export class TimeZoneManager extends Module {

  #map;

  constructor(dir, cfg) {
    super(dir, cfg);
    this.#map = new Map();

    //UTC is always there
    this.#map.set(TZ_UTC, new TimeZone(config({ name: TZ_UTC, description: "UTC - Coordinated Universal Time Zone", baseOffsetMs: 0 }).root));

    const cfgZones = cfg.get("zones");
    if (cfgZones){
      for(const cfgZone of cfgZones.getChildren(false)){
        const zone = makeNew(TimeZone, cfgZone, null, TimeZone);
        if (this.#map.has(zone.name)) {
          throw new AzosError(`TimeZone '${zone.name}' already registered`, "tzm.ctor()");
        }
        this.#map.set(zone.name, zone);
      }
    }
  }

  /** Gets {@link TimeZone} derivative instance by name or throws an exception  if not found */
  getZone(zone){
    const result = this.tryGetZone(zone);
    if (!result) throw new AzosError(`TimeZone '${zone}' not found`, "tzm.getZone()");
    return result;
  }

  /** Tries to get {@link TimeZone} derivative instance by name or `null` if no such named zone was found */
  tryGetZone(zone){
    aver.isNonEmptyString(zone, "zone");
    const result = this.#map.get(zone);
    return result ?? null;
  }

  /** Gets an array of all zones in the registry */
  getAllZones(){ return [...this.#map.values()]; }
}


/** Default config segment which covers US timezones including Alaska, Hawaii and Arizona */
export const US_STANDARD_TIMEZONES = Object.freeze([
  {type: UsStandardTimeZone, name: "est",   description: "Eastern Time",  iana: "America/New_York", windows: "Eastern Standard Time",     baseOffsetMs: -5 * ONE_HOUR_MS},
  {type: UsStandardTimeZone, name: "cst",   description: "Central Time",  iana: "America/Chicago",  windows: "Central Standard Time",     baseOffsetMs: -6 * ONE_HOUR_MS},
  {type: UsStandardTimeZone, name: "mst",   description: "Mountain Time", iana: "America/Denver",   windows: "Mountain Standard Time",    baseOffsetMs: -7 * ONE_HOUR_MS},
  {type: UsStandardTimeZone, name: "pst",   description: "Pacific Time",  iana: "America/Los_Angeles", windows: "Pacific Standard Time",  baseOffsetMs: -8 * ONE_HOUR_MS},
  {type: UsStandardTimeZone, name: "akst",  description: "Pacific Time",  iana: "America/Anchorage",   windows: "Alaskan Standard Time",  baseOffsetMs: -9 * ONE_HOUR_MS},

  // --------------------- Non-DST time zones ----------------------
  {type: UsTimeZone, name: "usmst", description: "US Mountain Time (no DST)", iana: "America/Phoenix", windows: "US Mountain Standard Time", baseOffsetMs: -7 * ONE_HOUR_MS},
  {type: UsTimeZone, name: "hst",   description: "Hawaiian Time", iana: "Pacific/Honolulu",    windows: "Hawaiian Standard Time", baseOffsetMs: -10 * ONE_HOUR_MS},
]);

/*
https://www.webexhibits.org/daylightsaving/b2.html

Time zone to UTC conversion does not "know" which instance of a duplicated hour to use unless it is provided with enough context—specifically,
 whether the time is during DST or standard time. Accurate conversion relies on explicit time zone and offset information, or else the result
  is ambiguous and must be resolved by the application or user

SEE THIS:  https://www.caktusgroup.com/blog/2019/03/21/coding-time-zones-and-daylight-saving-time/

*/
