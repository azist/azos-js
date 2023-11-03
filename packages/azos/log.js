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

/**
 * Converts value to LOG_TYPE coercing it to lowercase string if needed
 * @param {*} v value to convert
 * @returns {LOG_TYPE}
 */
export function asMsgType(v){
  v = strings.asString(v).toLowerCase();
  if (strings.isOneOf(v, ALL_TYPES, true)) return v;
  return LOG_TYPE.INFO;
}

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
      rel: types.asString(msg.guid),
      type: asMsgType(msg.type),
      text: types.asString(msg.text),
      from: types.asString(msg.from),
      host: "123.0.0.1",//app.host use https://peerip.glitch.me/
      topic: types.asString(msg.topic),
      src:   msg.src | 0,
      params: types.isAssigned(msg.params) ? (types.isString(msg.params) ? msg.params : JSON.stringify(msg.params)) : null
    };
  } catch(e){
    throw new LogError("Bad log msg", "normalizeMsg(...)", e);
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
