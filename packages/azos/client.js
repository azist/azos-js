/*<FILE_LICENSE>
* Azos (A to Z Application Operating System) Framework
* The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
* See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

/* eslint-disable no-unused-vars */

import { METHODS, HEADERS, CONTENT_TYPE, UNKNOWN } from "./coreconsts.js";
import * as aver from "./aver.js";
import * as strings from "./strings.js";
import * as types from "./types.js";
import { User, parseJwtToken } from "./security.js";
import { LOG_TYPE } from "./log.js";
import { Module } from "./modules.js";


/** Provides uniform base for Client-related exceptions */
export class ClientError extends types.AzosError {
  #responseBody;
  constructor(message, from = null, cause = null, code = 500, responseBody = null){
    super(message, from, cause, code);
    this.#responseBody = responseBody ?? null;
  }

  /** Returns response body if one was set or null */
  responseBody(){ return this.#responseBody; }
  ns(){ return "client"; }
  provideExternalStatus(){
    const status = super.provideExternalStatus();
    status["responseBody"] = this.#responseBody;
    return status;
  }
}

/**
 * Provides default handling of response based on `Content-Type` header
 * @param {Response} response object obtained from `fetch(req)`
 * @returns {object} a tuple of `{status: int, ctp: string, data: string | object | Blob}`
 */
export async function defaultResponseHandler(response){
  if (response === undefined || response === null) return null;
  const ctp = response.headers.get(HEADERS.CONTENT_TYPE) ?? UNKNOWN;

  if (ctp.indexOf(CONTENT_TYPE.TEXT_FAMILY) >=0){
    const text = await response.text();
    return {status: response.status, ctp: ctp,  data: text};
  } else if (ctp.indexOf(CONTENT_TYPE.JSON) >=0){
    const obj  = await response.json();
    return {status: response.status, ctp: ctp, data: obj};
  } else { //default - handle as BLOB
    const blob = await response.blob();
    return {status: response.status, ctp: ctp, data: blob};
  }
}


/**
 * Provides abstraction for consuming remote services via Http/s
 */
export class IClient extends Module{
  #rootUrl;
  #useOAuth;
  #oAuthUrl;
  #accessTokenScheme;
  #accessToken;
  #accessTokenStamp;
  #tokenRefreshSec;
  #defaultTimeoutMs;

  constructor(dir, cfg){
    super(dir, cfg);
    this.#rootUrl = types.trimUri(cfg.getString(["url", "rootUrl"], "./"), false, true);
    this.#oAuthUrl = types.trimUri(cfg.getString(["oauthurl", "oAuthUrl", "OAuthUrl"], "/system/oauth/token"), false, true);

    this.#accessToken = null;
    this.#accessTokenScheme = "Bearer";
    this.#accessTokenStamp = 0;

    this.#useOAuth = cfg.getBool("useOAuth", true);
    if (!this.#useOAuth){
      this.#accessTokenScheme = cfg.getString("accessTokenScheme", "Bearer");
      this.#accessToken = cfg.getString("accessToken", null);
      this.#accessTokenStamp = Date.now();
    }

    this.#tokenRefreshSec = cfg.getInt("tokenRefreshSec", 600);
    this.#defaultTimeoutMs = types.keepBetween(cfg.getInt("defaultTimeoutMs", 7935), 0, 5 * 60 * 1000);
  }

  /** Returns root url. It always ends with a trailing forward slash */
  get rootUrl() { return this.#rootUrl; }

  /** Returns true (default) when the client will get access token from OAuth server */
  get useOAuth() { return this.#useOAuth; }

  /** Returns OAuth url to use when {@link useOAuth} is enabled */
  get oAuthUrl() { return this.#oAuthUrl; }

  /** Returns access token scheme or "Bearer" */
  get accessTokenScheme() { return strings.dflt(this.#accessTokenScheme, "Bearer"); }

  /** Returns default timeout in milliseconds which is applied when no explicit abort signal is passed */
  get defaultTimeoutMs() { return this.#defaultTimeoutMs; }

  /**
  * Defines a tuple returned from web calls a vector of (status: int, ctp: string, data: any)
  * @typedef {Object} ResponseTuple
  * @property {int} status - Http status code
  * @property {string} ctp - Returns content type header/mime type
  * @property {any} data - The actual data returned by the server, e.g. a blob array or an image or a JSON parsing result
  */

  /** Executes a GET call returning a tuple of `(status: int, ctp: string, data: any)`
   * @param {string} uri
   * @param {object?} headers - if not defined then system adds `Accept: application/json`; pass an empty object `{}` to prevent defaults
   * @param {AbortSignal?} abort - Optional abort controller
   * @param {Function?} fResponseHandler - Optional response handler which reacts to different content types. By default system uses in-built one
   * @returns {Promise<ResponseTuple>}
   */
  async get(uri, headers = null, abort = null, fResponseHandler = null){
    return await this.call(METHODS.GET, uri, null, headers ?? {[HEADERS.ACCEPT]: CONTENT_TYPE.JSON}, abort, fResponseHandler);
  }

  /** Executes a POST call returning a tuple of `(status: int, ctp: string, data: any)`
   * @param {string} uri
   * @param {object?} body - post body
   * @param {object?} headers - if not defined then system adds `Accept: application/json`; pass an empty object `{}` to prevent defaults
   * @param {AbortSignal?} abort - Optional abort controller
   * @param {Function?} fResponseHandler - Optional response handler which reacts to different content types. By default system uses in-built one
   * @returns {Promise<ResponseTuple>}
   */
  async post(uri, body, headers = null, abort = null, fResponseHandler = null){
    return await this.call(METHODS.POST, uri, body, headers ?? {[HEADERS.ACCEPT]: CONTENT_TYPE.JSON}, abort, fResponseHandler);
  }

  /** Executes a PUT call returning a tuple of `(status: int, ctp: string, data: any)`
   * @param {string} uri
   * @param {object?} body - put body
   * @param {object?} headers - if not defined then system adds `Accept: application/json`; pass an empty object `{}` to prevent defaults
   * @param {AbortSignal?} abort - Optional abort controller
   * @param {Function?} fResponseHandler - Optional response handler which reacts to different content types. By default system uses in-built one
   * @returns {Promise<ResponseTuple>}
   */
  async put(uri, body, headers = null, abort = null, fResponseHandler = null){
    return await this.call(METHODS.PUT, uri, body, headers ?? {[HEADERS.ACCEPT]: CONTENT_TYPE.JSON}, abort, fResponseHandler);
  }

  /** Executes a PATCH call returning a tuple of `(status: int, ctp: string, data: any)`
   * @param {string} uri
   * @param {object?} body - patch body
   * @param {object?} headers - if not defined then system adds `Accept: application/json`; pass an empty object `{}` to prevent defaults
   * @param {AbortSignal?} abort - Optional abort controller
   * @param {Function?} fResponseHandler - Optional response handler which reacts to different content types. By default system uses in-built one
   * @returns {Promise<ResponseTuple>}
   */
  async patch(uri, body, headers = null, abort = null, fResponseHandler = null){
    return await this.call(METHODS.PATCH, uri, body, headers ?? {[HEADERS.ACCEPT]: CONTENT_TYPE.JSON}, abort, fResponseHandler);
  }

  /** Executes a DELETE call returning a tuple of `(status: int, ctp: string, data: any)`
   * @param {string} uri
   * @param {object?} body - optional delete body
   * @param {object?} headers - if not defined then system adds `Accept: application/json`; pass an empty object `{}` to prevent defaults
   * @param {AbortSignal?} abort - Optional abort controller
   * @param {Function?} fResponseHandler - Optional response handler which reacts to different content types. By default system uses in-built one
   * @returns {Promise<ResponseTuple>}
   */
  async delete(uri, body = null, headers = null, abort = null, fResponseHandler = null){
    return await this.call(METHODS.DELETE, uri, body, headers ?? {[HEADERS.ACCEPT]: CONTENT_TYPE.JSON}, abort, fResponseHandler);
  }

  /**
   * This protected method is called as a part of {@link _assembleRequest}
   * Converts body into request body, e.g. an object into a JSON string,
   * Returning a tuple [ctp?: string, body?: any] or [null, null] if there is no body
   */
  _prepareBody(payload){
    if (!payload) return [null, null];

    //https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
    //Any body that you want to add to your request: this can be a
    //  Blob, an ArrayBuffer, a TypedArray, a DataView, a FormData, a URLSearchParams, a string, or a ReadableStream object.
    //Note that a request using the GET or HEAD method cannot have a body.

    //payload is either an object, then ctp is calculated, or its a tuple of {ctp: string, body: any}
    let ctp = null;
    let body = null;
    if (types.hown(payload, "ctp") && types.hown(payload, "body")){
      ctp = types.asString(payload.ctp);
      body = payload.body;
    } else body = payload;

    if (!body) return [null, null];

    if (body instanceof String){ return [ctp ?? CONTENT_TYPE.TEXT_PLAIN, body]; }
    else if (body instanceof Blob){ return [ctp, body]; }
    else if (body instanceof ArrayBuffer){ return [ctp ?? CONTENT_TYPE.BINARY, body]; }
    else if (body instanceof FormData){ return [ctp, body]; }

    return [ctp ?? CONTENT_TYPE.JSON, JSON.stringify(body)];
  }

  /**
   * Assembles a `Request` object out of parameters
   * @param {string} method
   * @param {string} uri
   * @param {any?} body
   * @param {object?} headers
   * @param {AbortSignal?} abort
   * @returns {Request}
   */
  _assembleRequest(method, uri, body, headers, abort){
    aver.isString(method);
    aver.isString(uri);

    const [ctp, requestBody] = this._prepareBody(body);

    const hdrs = { };
    if (ctp !== null) hdrs[HEADERS.CONTENT_TYPE] = ctp;

    if (types.isAssigned(headers)){
      for(const [k, v] of Object.entries(headers))
        if (types.isAssigned(v)) hdrs[k] = v;
    }

    while (uri.startsWith("/")) uri = uri.slice(1);

    const url = this.#rootUrl + uri;

    const opts = {
      method: method,
      headers: hdrs,
      credentials: "same-origin",
      redirect: "follow",
      keepalive: true,
    };
    if (requestBody !== null)  opts["body"] = requestBody;
    if (abort !== null)  opts["signal"] = abort;

    return new Request(url, opts);
  }
  /**
   * Performs a service call using the specified METHOD, uri, body, headers, AbortSignal, response handler and optionally performing
   * response status check for 2xx Http code.
   * @param {string} method
   * @param {string} uri
   * @param {any?} body
   * @param {object?} headers
   * @param {AbortSignal?} abort
   * @param {Function} fResponseHandler
   * @param {boolean} noStatusCheck
   * @returns
   */
  async call(method, uri, body, headers, abort = null, fResponseHandler = null, noStatusCheck = false){
    try {
      fResponseHandler = fResponseHandler ?? defaultResponseHandler;
      aver.isFunction(fResponseHandler);

      //Default timeout
      if (!abort && this.#defaultTimeoutMs > 0) abort = AbortSignal.timeout(this.#defaultTimeoutMs);

      const request = this._assembleRequest(method, uri, body, headers, abort);
      await this.#addAuthInfo(request);

      //call
      const response = await fetch(request);

      //get response
      const result = await fResponseHandler(response);

      //check response
      if (!noStatusCheck && !response.ok) {
        throw new ClientError(`Http code ${response.status}/${response.statusText}`, null, null, result.status, result);
      }

      return result;//all OK ======================
    } catch(cause) {
      const res = types.isFunction(cause?.responseBody) ? cause.responseBody() : null;
      const clErr = new ClientError(`Error calling '${method} ${uri}: ${(cause.message ?? cause)}'}`, `${this.constructor.name}.call()`, cause, cause.code ?? 599, res);
      this.writeLog(LOG_TYPE.TRACE, "Error making client call", clErr, {method, uri});
      throw clErr;
    }
  }

  //this is a private method, outside parties should not be leaking token
  async #addAuthInfo(request){
    const [scheme, token] = await this.#getAccessToken();
    if (token){
      request.headers.append(HEADERS.AUTH, `${scheme} ${token}`);
    }
  }

  //this is a private method, outside parties should not be leaking token
  //returns {scheme, token}
  async #getAccessToken(){
    if (!this.#useOAuth) return [this.accessTokenScheme, this.#accessToken];

    let needNew = !this.#accessToken;
    if (!needNew){
      const ageSec = (Date.now() - this.#accessTokenStamp) / 1000;
      needNew = ageSec > this.#tokenRefreshSec;
    }

    if (needNew){
      [this.#accessTokenScheme, this.#accessToken] = await this.#obtainNewSessionUserToken();
      this.#accessTokenStamp = Date.now();
    }
    return [this.accessTokenScheme, this.#accessToken];
  }

  async #obtainNewSessionUserToken(){
    this.writeLog(LOG_TYPE.TRACE, "About to obtain AUTH token");
    const token = this.app.session.user.authToken;

    //make a server call
    const authResponse = await fetch(this.#oAuthUrl,
    {
      method: METHODS.POST,
      body: JSON.stringify({
        partialToken: token
      }),
      headers: {
        [HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON
      },
      credentials: "same-origin" //AUTH cookies!!!!!!!!!!!! <==============
    });
    const init = await authResponse.json();

    const newToken        = types.asString(init["access_token"]);
    const newTokenType    = types.asString(init["token_type"]);
    const newExpNowSec = types.asInt(init["expNowSec"]);

    const expInSec = newExpNowSec - (Date.now() / 1000);

    if (expInSec > 0 && expInSec < this.#tokenRefreshSec){
      this.#tokenRefreshSec = types.atMin(0.75 * (expInSec | 0), 10);
      this.writeLog(LOG_TYPE.WARNING, `Server advised of sooner token expiration in ${expInSec} sec. Adjusted refresh interval accordingly to ${this.#tokenRefreshSec} sec`);
    }

    //set updated identity
    const uini = init.user;
    if (types.isAssigned(uini)) {
      this.app.session.user = new User(uini);
    }

    this.writeLog(LOG_TYPE.INFO, `Obtained auth token for '${this.app.session.user.name}'`);
    return [newTokenType, newToken];
  }
}
