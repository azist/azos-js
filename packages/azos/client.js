/*<FILE_LICENSE>
* Azos (A to Z Application Operating System) Framework
* The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
* See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

/* eslint-disable no-unused-vars */

import { ABSTRACT, METHODS, HEADERS, CONTENT_TYPE, UNKNOWN } from "./coreconsts.js";
import * as aver from "./aver.js";
import * as strings from "./strings.js";
import * as types from "./types.js";
import { LOG_TYPE, getMsgTypeSeverity } from "./log.js";
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
  #accessToken;
  #accessTokenStamp;
  #tokenRefreshSec;

  constructor(dir, cfg){
    super(dir, cfg);
    this.#accessToken = null;
    this.#accessTokenStamp = 0;
    this.#rootUrl = strings.trim(cfg.getString(["url", "root-url"], "./"));
    if (!this.#rootUrl.endsWith("/")){
      this.#rootUrl += "/";
    }

    this.#tokenRefreshSec = cfg.getInt("tokenRefreshSec", 600);
  }

  /** Returns root url. It always ends with a trailing forward slash */
  get rootUrl() { return this.#rootUrl; }


  async get(uri, headers = null, fResponseHandler = null){
    return await this.call(METHODS.GET, uri, null, headers, fResponseHandler);
  }
  async post(uri, body, headers = null, fResponseHandler = null){
    return await this.call(METHODS.POST, uri, body, headers, fResponseHandler);
  }
  async put(uri, body, headers = null, fResponseHandler = null){
    return await this.call(METHODS.PUT, uri, body, headers, fResponseHandler);
  }
  async patch(uri, body, headers = null, fResponseHandler = null){
    return await this.call(METHODS.PATCH, uri, body, headers, fResponseHandler);
  }
  async delete(uri, body = null, headers = null, fResponseHandler = null){
    return await this.call(METHODS.DELETE, uri, body, headers, fResponseHandler);
  }

  _assembleRequest(method, uri, body, headers){
    aver.isString(method);
    aver.isString(uri);

    const hdrs = {};
    for(const [k, v] of Object.entries(headers))
      if (types.isAssigned(v)) hdrs[k] = v;

    while (uri.startsWith("/")) uri = uri.slice(1);

    const url = this.#rootUrl + url;
    const request = {
      method: method,
      body: JSON.stringify(body),
      headers: hdrs
    };

    return {url, request};
  }
  /**
   * Performs a service call using the specified METHOD, uri, body, headers, response handler and optionally performing
   * response status check for 2xx Http code.
   * @param {*} method
   * @param {*} uri
   * @param {*} body
   * @param {*} headers
   * @param {*} fResponseHandler
   * @param {*} noStatusCheck
   * @returns
   */
  async call(method, uri, body, headers, fResponseHandler = null, noStatusCheck = false){
    try {
      fResponseHandler = fResponseHandler ?? defaultResponseHandler;
      aver.isFunction(fResponseHandler);
      const {url, request} = this._assembleRequest(method, uri, body, headers);
      await this.#addAuthInfo(request);
      //call
      const response = await fetch(url, request);

      //get response
      const result = await fResponseHandler(response);

      //check response
      if (!noStatusCheck && !response.ok) {
        throw new ClientError(`Http code ${response.status}/${response.statusText}`, null, null, result.status, result);
      }

      return result;//all OK ======================
    } catch(cause) {
      const clErr = new ClientError(`Error calling '${method} ${uri}: ${cause.message}`, `${this.constructor.name}.call()`, cause, cause.code ?? 599);
      this.writeLog(LOG_TYPE.TRACE, "Error making client call", clErr, {method, uri});
      throw clErr;
    }
  }

  //this is a private method, outside parties should not be leaking token
  async #addAuthInfo(request){
    const token = await this.#getAccessToken();
    request.headers[HEADERS.AUTH] = `Bearer ${token}`;
  }

  //this is a private method, outside parties should not be leaking token
  async #getAccessToken(){
    let needNew = !this.#accessToken;
    if (!needNew){
      const ageSec = (Date.now() - this.#accessTokenStamp) / 1000;
      needNew = ageSec > this.#tokenRefreshSec;
    }

    if (needNew){
      this.#accessToken = await this.#obtainNewSessionUserToken();
    }
    return this.#accessToken;
  }

  async #obtainNewSessionUserToken(){
    this.writeLog(LOG_TYPE.TRACE, "About to obtain AUTH token");
    const refreshToken = this.app.session.user.authRefreshToken;

    //make a server call
    const authResponse = await fetch("auth/token",
    {
      method: METHODS.POST,
      body: JSON.stringify({
        refresh: refreshToken
      }),
      headers: {
        [HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON
      },
      credentials: 'same-origin' //AUTH cookies!!!!!!!!!!!! <==============
    });
    const got = await authResponse.json();

    const newToken = got["access_token"];
    const newTokenType = got["token_type"];
    const newRefreshToken = got["refresh_token"];
    const newJwt = got["id_token"];
    const newExpiresInSec = types.asInt(got["expires_in"]);

    if (newExpiresInSec > 0 && newExpiresInSec < this.#tokenRefreshSec){
      this.#tokenRefreshSec = types.atMin(0.75 * newExpiresInSec | 0, 10);
      this.writeLog(LOG_TYPE.WARNING, `Server advised of sooner token expiration in ${newExpiresInSec} sec. Adjusted refresh interval accordingly to ${this.#tokenRefreshSec} sec`);
    }

    //set identity/jwt to session
    this.app.session.updateIdentity(newRefreshToken, newJwt);

    this.writeLog(LOG_TYPE.INFO, `Obtained auth token for ${newJwt.sub}`);
    return newToken;
  }
}
