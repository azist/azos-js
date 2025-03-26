import { Module } from "azos/modules";
import { IStorage } from "azos/storage";
import { Applet } from "./applet";
import { isFunction, isFunctionOrNull, isNonEmptyString, isObjectOrArray, isOf, isOfOrNull, isStringOrNull } from "azos/aver";
import { keepBetween } from "azos/types";
import { matchPattern } from "azos/strings";
import { LOG_TYPE } from "azos/log";

/** Provides Most Recently Used (MRU) named list management functionality in a UI application.
 * This class maintains a registry of named lists for every applet within an application,
 * meaning: MRU lists do not cross between applications and applets, event on the same origin
 */
export class MruLogic extends Module{
  #ref = {storage: IStorage};
  #max = 25;

  constructor(dir, cfg){
    super(dir, cfg);
    this.#max = keepBetween(cfg.getInt("max", 25), 1, 250);
  }

  _appAfterLoad(){
    super._appAfterLoad();
    this.link(this.#ref); //in future we may add optional name
  }

  #getKeyName(applet, idList){ return `MRU::${(applet?.localStoragePrefix ?? "*")}::${idList ?? "*"}`;}

  /** Clears all MRU lists optionally filtering by applet and MRU list id.
   * WARNING: if you do not pass applet then all MRU lists for this application get deleted on the current origin
  */
  clearAll(applet = null, idList = null){
    isOfOrNull(applet, Applet);
    isStringOrNull(idList);
    const toDrop = [];

    const pattern = this.#getKeyName(applet, idList);
    for(let i=0; i < this.#ref.storage.length; i++){
      const key = this.#ref.storage.key(i);
      if (!matchPattern(key, pattern)) continue;
      toDrop.push(key);
    }

    for(const k of toDrop) this.#ref.storage.removeItem(k);
  }

  /** Returns the most recently used item list by id and an applet, e.g. `filter`.
   * Returns an empty array if such MRU list is not found by id for the supplied applet
   */
  getMruList(applet, idList){
    isOf(applet, Applet);
    isNonEmptyString(idList, String);
    const fullKey = this.#getKeyName(applet, idList);
    const stored = this.#ref.storage.getItem(fullKey);
    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch(e) {
      this.writeLog(LOG_TYPE.CRITICAL, `Corrupted MRU key '${fullKey}'`, e);
      return [];//swallow the error
    }
  }

  /** Puts an item into a named MRU list. Adds the item to the head (at the beginning) of the list.
   * The item identity is defined by a supplied comparer `fn(a, b): bool`.
   * If the list has more than a maximum count allowed, the last item at the list tail is dropped
   * @returns {Array} an MRU list after the put operation
   * @example
   *  mruLogic.putMruListItem(thisApplet, "filter", {id: 278, s: "Harris Joe*", now}, (a,b) => a.id === b.id);
   *  mruLogic.putMruListItem(thisApplet, "filter", {s: "Harris Joe*"}, (a,b) => matchPattern(a.s, `*.${b.s}*`);
  */
  putMruListItem(applet, idList, item, fItemIdentityComparer = null){
    isObjectOrArray(item);
    isFunctionOrNull(fItemIdentityComparer);

    const list = this.getMruList(applet, idList);
    if (fItemIdentityComparer){
      let idx = list.findIndex(one => fItemIdentityComparer(one, item));
      if (idx >= 0) {
        list.splice(idx, 1);
      }
    }

    list.unshift(item);//insert at the front
    if (list.length > this.#max) list.pop();//impose a limit at the end

    const fullKey = this.#getKeyName(applet, idList);
    this.#ref.storage.setItem(fullKey, JSON.stringify(list));
    return list;
  }

  /** Tries to remove an item by applying a predicate to items one by one in a named list by applet.
   * The predicate has a form: `fn(x): bool` returning true for the found item `x`.
   * @returns {boolean} true when found and removed
   * @example
   *  mruLogic.removeMruListItem(thisApplet, "doctors", (x) => x.id === "K78Z425");
  */
  removeMruListItem(applet, idList, fItemPredicate){
    isFunction(fItemPredicate);

    const list = this.getMruList(applet, idList);
    let idx = list.findIndex(one => fItemPredicate(one));
    if (idx < 0) return false;

    list.splice(idx, 1);
    const fullKey = this.#getKeyName(applet, idList);
    this.#ref.storage.setItem(fullKey, JSON.stringify(list));
    return true;
  }
}
