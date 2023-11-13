/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as strings from "./strings.js";
import { ABSTRACT } from "./coreconsts.js";
import { Module } from "./modules.js";

/**
  * @typedef {Object} LogMessage
  * @property {string} rel optional guid of related-to message or null
  * @property {Atom} channel optional channel atom or null
  * @property {string} type Message type enum
  * @property {int} src int source
  * @property {string} from optional from
  * @property {string} topic optional topic
  * @property {string} text message text
  * @property {object} params optional parameters
  */

/** Provides uniform base for Log-related exceptions */
export class LogError extends types.AzosError {
  constructor(message, from = null, cause = null){ super(message, from, cause, 553); }
}

/** Log Message types */
export const LOG_TYPE = Object.freeze({
  DEBUG:         "Debug",
  DEBUG_A:       "DebugA",
  DEBUG_B:       "DebugB",
  DEBUG_C:       "DebugC",

  TRACE:         "Trace",
  TRACE_A:       "TraceA",
  TRACE_B:       "TraceB",
  TRACE_C:       "TraceC",

  INFO:         "Info",
  INFO_A:       "InfoA",
  INFO_B:       "InfoB",
  INFO_C:       "InfoC",

  WARNING:      "Warning",
  ERROR:        "Error",
  ERROR_INFO:   "ErrorInfo",

  CRITICAL:    "Critical",
  EMERGENCY:   "Emergency",
});
const ALL_TYPES = types.allObjectValues(LOG_TYPE);

/** Log Message types -> int */
const LOG_TYPE_SEVERITY = Object.freeze({
  [LOG_TYPE.DEBUG]:        -100,
  [LOG_TYPE.DEBUG_A]:       -100,
  [LOG_TYPE.DEBUG_B]:       -100,
  [LOG_TYPE.DEBUG_C]:       -100,

  [LOG_TYPE.TRACE]:         -50,
  [LOG_TYPE.TRACE_A]:       -50,
  [LOG_TYPE.TRACE_B]:       -50,
  [LOG_TYPE.TRACE_C]:       -50,

  [LOG_TYPE.INFO]:         0,
  [LOG_TYPE.INFO_A]:       0,
  [LOG_TYPE.INFO_B]:       0,
  [LOG_TYPE.INFO_C]:       0,

  [LOG_TYPE.WARNING]:      10,
  [LOG_TYPE.ERROR]:        100,
  [LOG_TYPE.ERROR_INFO]:   101,

  [LOG_TYPE.CRITICAL]:    1000,
  [LOG_TYPE.EMERGENCY]:   2000
});

/**
 * Converts value to LOG_TYPE coercing it to lowercase string if needed
 * @param {*} v value to convert
 * @returns {LOG_TYPE}
 */
export function asMsgType(v){
  v = strings.asString(v);
  if (strings.isOneOf(v, ALL_TYPES, false)) return v;
  return LOG_TYPE.INFO;
}

/**
 * Converts value to LOG_TYPE to integer severity. 0 = info
 * @param {*} v value to convert
 * @returns {int}
 */
export function getMsgTypeSeverity(v){ return LOG_TYPE_SEVERITY[v] | 0; }

/**
 * Takes a message and normalizes its data converting to appropriate data types and filling require missing data
 * @param {object} msg
 * @returns {LogMessage}
 */
export function normalizeMsg(msg){
  try{
    if (msg===undefined || msg===null) throw new LogError("Null msg");
    return {
      guid: types.genGuid(),
      rel: strings.asString(msg.guid),
      type: asMsgType(msg.type),
      text: strings.asString(msg.text),
      from: strings.asString(msg.from),
      host: "123.0.0.1",//app.host see issue #33
      topic: strings.asString(msg.topic),
      src:   msg.src | 0,
      params: types.isAssigned(msg.params) ? (types.isString(msg.params) ? msg.params : JSON.stringify(msg.params)) : null
    };
  } catch(e){
    throw new LogError("Bad log msg", "normalizeMsg(...)", e);
  }
}

/**
 * Writes normalized log message into console
 * @param {LogMessage} msg
 */
export function writeConsole(msg, dTopic = null, dFrom = null){
  const sev = getMsgTypeSeverity(msg.type);

  if (sev >= LOG_TYPE_SEVERITY[LOG_TYPE.ERROR]){
    console.error(`%c${msg.type}%c  ${strings.dflt(msg.topic, dTopic)}  ${strings.dflt(msg.from, dFrom)}`,
        "color: #802000; background-color: #f04000; padding: 2px; border-radius: 4px;",
        "color: #757575",
        msg.text,
        msg);
  } else {
    const stl = sev < LOG_TYPE_SEVERITY[LOG_TYPE.INFO] ? "color: #606060; background-color: #e0e0e0; padding: 2px; border-radius: 4px;" :
                sev < LOG_TYPE_SEVERITY[LOG_TYPE.WARNING] ? "color: #4e7e00; background-color: #45ea12; padding: 2px; border-radius: 4px;"
                                                : "color: #7f6800; background-color: #f4f200; padding: 2px; border-radius: 4px;"

    const map = {};
    for(let i in msg) if (msg[i]) map[i] = msg[i];
    console.log(`%c${msg.type}%c ${strings.dflt(msg.topic, dTopic)} ${strings.dflt(msg.from, dFrom)}`,
        stl,
        "color: #8594a8",
        msg.text,
        map);
  }
}


/**
 * ILog contract
 */
export class ILog extends Module{

  constructor(dir, cfg){
    super(dir, cfg);

    //todo build sinks
  }

  /**
   * Writes log message into logging system
   * @param {LogMessage} msg log message to write
   * @returns {guid} message Guid string
   */
  write(msg){
    msg = normalizeMsg(msg);
    this._doWrite(msg);
    return msg.guid;
  }

  // eslint-disable-next-line no-unused-vars
  _doWrite(msgFrame){ throw ABSTRACT("ILog._doWrite()"); }
}

/** Console logger */
export class ConLog extends ILog{
  constructor(dir, cfg){ super(dir, cfg); }
  _doWrite(msg){ writeConsole(msg, `app('${this.app.id}')`, this.constructor.name); }
}
