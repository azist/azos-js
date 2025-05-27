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

function anyOf(s, vs){
  if (!s.toLowerCase) return false;
  s = s.toLowerCase();
  return vs.some(one => s.indexOf(one) > -1);
}

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
  ACCEPT: "Accept",
  CONTENT_TYPE: "Content-Type",
  WV_DATA_CTX: "wv-data-ctx",
});

export const CONTENT_TYPE = Object.freeze({
  MULTIPART_FORM: "multipart/form-data",
  JSON: "application/json",
  TEXT_FAMILY: "text/",
  TEXT_PLAIN: "text/plain",
  TEXT_HTML: "text/html",
  IMG_JPEG: "image/jpeg",
  IMG_PNG: "image/png",
  IMG_GIF: "image/gif",
  IMG_SVG: "image/svg+xml",
  BINARY: "application/octet-stream",

  isHtml: (v) => anyOf(v, ["/html"]),
  isJson: (v) => anyOf(v, ["/json"]),
  isTextFamily: (v) => anyOf(v, ["text/"]),
  isImageFamily: (v) => anyOf(v, ["image/"]),
  isImageJpeg: (v) => anyOf(v, ["/jpeg", "/jfif", "/jpg"]),
  isImagePng:  (v) => anyOf(v, ["/png"]),
  isImageSvg:  (v) => anyOf(v, ["/svg"]),
  isImageWebP: (v) => anyOf(v, ["/webp"]),
  isImageGif:  (v) => anyOf(v, ["/gif"]),
  isBinary: (v) => anyOf(v, ["/octet"]),
});

//https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
/** Name of abort exception when for example AbortController.abort() is used. See MDN */
export const ABORT_ERROR_NAME = "AbortError";

/** Creates an `Error` exception ready to be thrown indicating that operation is abstract and is not implemented */
export function ABSTRACT(nm){ return new Error(`Method '${nm ?? UNDEFINED}' is abstract`); }

/** Developer helper function: Creates an `Error` exception ready to be thrown indicating that the operation is not implemented */
export function UNIMPLEMENTED(nm) {return new Error(`Method '${nm ?? UNDEFINED}' is unimplemented`);}

/** Facilitates access to process-global services such as NopApplication without referencing any modules */
export class GLOBALS {
  static #nopApplication = null;

  static ____bindGlobalNopApplication(app){ GLOBALS.#nopApplication = app; }

  /** Returns global NopApplication instance */
  static get NOP_APP(){
    const nop = GLOBALS.#nopApplication;
    if (!nop) {
      throw new Error("NopApplication has not been initialized yet");
    }
    return nop;
  }

  /** Returns default global INVARIANT localizer */
  static get DEFAULT_INVARIANT(){ return GLOBALS.NOP_APP.localizer; }
}

