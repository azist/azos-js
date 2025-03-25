import { Module } from "azos/modules";
import { IStorage } from "azos/storage";
import { Applet } from "./applet";
import { isFunctionOrNull, isNonEmptyString, isObjectOrArray, isOf, isOfOrNull, isStringOrNull } from "azos/aver";
import { keepBetween } from "azos/types";
import { matchPattern } from "azos/strings";

/** Provides Most Recently Used (MRU) named list management functionality in a UI application */
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

  /** Clears all MRU lists optionally filtering by applet and MRU list id */
  clearAll(applet = null, idList = null){
    isOfOrNull(applet, Applet);
    isStringOrNull(idList);
    const toDrop = [];

    const pattern = this.#getKeyName(applet, idList);
    for(let i=0; i < this.#ref.storage.length; i++){
      const key = this.#ref.key(i);
      if (!matchPattern(key, pattern)) continue;
      toDrop.push(key);
    }

    for(const k of toDrop) this.#ref.storage.removeItem(k);
  }

  /** Returns the most recently used items by MRU list id an applet, e.g. `filter`.
   * Returns empty array if such MRU list is not found by id
   */
  getMruList(applet, idList){
    isOf(applet, Applet);
    isNonEmptyString(idList, String);
    const fullKey = this.#getKeyName(applet, idList);
    const stored = this.#ref.storage.getItem(fullKey);
    return stored ?? [];
  }

  /** Pushes an item into the storage. Add the item to the head (at the beginning) of the list.
   * The item identity is defined by a supplied comparer `fn(a, b): bool`
   *
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
      if (idx >=0 ) {
        list.splice(idx, 1);
      }
    }

    list.unshift(item);//insert up front

    if (list.length > this.#max) list.pop();//impose a limit at the end

    const fullKey = this.#getKeyName(applet, idList);
    this.#ref.storage.setItem(fullKey, list);
    return list;
  }

}
