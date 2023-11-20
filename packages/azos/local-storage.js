/*<FILE_LICENSE>
* Azos (A to Z Application Operating System) Framework
* The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
* See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

/* eslint-disable no-unused-vars */

import * as aver from "./aver.js";
import { ABSTRACT } from "./coreconsts.js";
import { Module } from "./modules.js";

/**
 * Provides abstraction for working with local/session storage,
 * be it in on a local browser or server Node/Bun etc. applications.
 * Storage only supports storing and retrieving strings. If you need to save other data types,
 * you have to convert them to strings. For plain objects and arrays, you can use JSON.stringify().
 */
export class ILocalStorage extends Module{
  constructor(dir, cfg){ super(dir, cfg); }

  /**
   * Returns an integer representing the number of data items stored in the Storage object.
   * @returns {int}
   */
  get length(){ throw ABSTRACT("length.get"); }

  /**
   * When passed a number n, returns the name of the nth key in a given Storage object.
   * The order of keys is user-agent defined, so you should not rely on it.
   * @param {int} index An integer representing the number of the key you want to get the name of. This is a zero-based index.
   * @returns {string} A string containing the name of the key. If the index does not exist, null is returned.
   */
  key(index){ throw ABSTRACT("length.get"); }

  /**
   * When passed a key name, will return that key's value, or null if the key does not exist, in the given Storage object.
   * @param {string} keyName A string containing the name of the key you want to retrieve the value of.
   * @returns {string} A string containing the value of the key. If the key does not exist, null is returned.
  */
  getItem(keyName){ throw ABSTRACT("getItem(key)"); }

  /**
  * When passed a key name and value, will add that key to the given Storage object, or update that key's value if it already exists.
  * @param {string} keyName A string containing the name of the key you want to retrieve the value of.
  * @param {string} keyValue A string containing the value you want to give the key you are creating/updating.
  * @returns {undefined}}
  */
  setItem(keyName, keyValue){ throw ABSTRACT("setItem(key, val)"); }

  /**
   * When passed a key name, will remove that key from the given Storage object if it exists.
   * If there is no item associated with the given key, this method will do nothing.
   * @param {string} keyName A string containing the name of the key you want to remove.
   * @returns {undefined}
  */
  removeItem(keyName){ throw ABSTRACT("removeItem(key)"); }

  /**
   * Clears all keys stored in a given storage
   * @returns {undefined}
  */
  clear(){ throw ABSTRACT("clear()"); }
}

/** Provides abstraction for working with local/session storage in the Browser. */
export class BrowserStorage extends ILocalStorage{
  #isSession;
  constructor(dir, cfg){
    aver.isTrue(window && window.sessionStorage && window.localStorage);
    super(dir, cfg);
    this.#isSession = cfg.getBoolean(["isSession", "session"], false);
  }

  /** True if this is a session storage */
  get isSession(){ return this.#isSession; }

  /** Returns either a session or local browser storage */
  getStorage(){ return this.#isSession ? window.sessionStorage : window.localStorage; }

  get length(){ return this.getStorage().length; }
  key(index){ return this.getStorage().key(index); }
  getItem(keyName){ return this.getStorage().getItem(keyName);  }
  setItem(keyName, keyValue){ return this.getStorage().setItem(keyName, keyValue);  }
  removeItem(keyName){ return this.getStorage().removeItem(keyName);  }
  clear(){ return this.getStorage().clear();  }
}
