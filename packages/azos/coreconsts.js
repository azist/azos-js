/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

export const ELLIPSIS  = "...";
export const NULL      = "<null>";
export const UNDEFINED = "<undefined>";
export const UNKNOWN   = "<unknown>";
export const EMPTY     = "<empty>";

export const METHODS = Object.freeze({
  GET: "GET",
  HEAD: "HEAD",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  OPTIONS: "OPTIONS",
  DELETE: "DELETE"
});

export const HEADERS = Object.freeze({
  AUTH: "Authorization",
  CONTENT_TYPE: "Content-Type",
  WV_DATA_CTX: "wv-data-ctx"
});

export const CONTENT_TYPE = Object.freeze({
  JSON: "application/json",
  TEXT_FAMILY: "text/",
});

/** Creates an `Error` exception ready to be thrown indicating that operation is abstract and is not implemented */
export function ABSTRACT(nm){ return new Error(`Method '${nm ?? UNDEFINED}' is abstract`); }


