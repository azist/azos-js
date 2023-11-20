/*<FILE_LICENSE>
* Azos (A to Z Application Operating System) Framework
* The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
* See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

/* eslint-disable no-unused-vars */

import { HEADERS, CONTENT_TYPE } from "./coreconsts.js";
import * as aver from "./aver.js";
import * as strings from "./strings.js";
import { ABSTRACT } from "./coreconsts.js";
import { LOG_TYPE } from "./log.js";
import { Module } from "./modules.js";

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


  async get(){ }
  async post(){ }
  async put(){ }
  async patch(){ }
  async delete(){  }

  assembleRequest(method, uri, body, headers){
    aver.isString(method);
    aver.isString(uri);

    const url = this.#rootUrl + uri;
    const init = {
      method: method,
      body: JSON.stringify(body),
      headers: {}
    };

    return {url, init};
  }



  async call(method, uri, body, headers, fProcessResponse){
    const {url, init} = this.assembleRequest(method, uri, body, headers);
    await this.#addAuthInfo(init);
    const response = await fetch(url, init);
    const result = await fProcessResponse(response);
    return result;
  }

  //this is a private method, outside parties should not be leaking token
  async #addAuthInfo(init){
    const token = await this.#getAccessToken();
    init.headers[HEADERS.AUTH] = `Bearer ${token}`;
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
    const rel = this.writeLog(LOG_TYPE.TRACE, "About to obtain AUTH token");
    const refreshToken = this.app.session.user.authRefreshToken;

    //make a server call
    const authResponse = await fetch("auth/token",
    {
      method: "post",
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
    const newRefreshToken = got["refresh_token"];
    const newJwt = got["id_token"];
    const newTokenType = got["token_type"];
    const newExpiresInSec = got["expires_in"];

    //set jwt to session

    if (rel) this.writeLog(LOG_TYPE.INFO, "Obtained auth token", null, rel);
    return newToken;
  }
}
