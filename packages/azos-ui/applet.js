/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { CLOSE_QUERY_METHOD, DIRTY_PROP } from "azos/types";
import { AzosElement, getChildDataMembers } from "./ui.js";
import { toast } from "./toast.js";
import { dflt } from "azos/strings";
import { isOfOrNull } from "azos/aver";
import { Session } from "azos/session";

/**
 * Defines a root UI element which represents an Applet - a part of application.
 * Applets run inside of arenas as a root element for building complex UI screens such as data view/entry forms
 */
export class Applet extends AzosElement {

  #args;
  #session;

  /** Returns a STATIC iterable/array of permission specifiers which this applet CLASS requires for activation
   * Arena checks this permissions BEFORE activating the desired applet type.
   * You declare this STATIC (per class) property in every applet class where you want to implement security
   * @example
   * class B extends A {
   *   static permissions = [new SpecialPermission(1),'{"ns": "/System/Admin", "name": "UserManager", "level": 3}', ...super.permissions];
   * }
   */
  static permissions = [];

  constructor() {
    super();
  }

  /** Arguments which are assigned at applet launch. You can pass parameters such as deep links into the applet  */
  get args(){return this.#args;}
  /** Arguments which are assigned at applet launch. You can pass parameters such as deep links into the applet  */
  set args(v){ this.#args = v ?? null; }

  /** Session object which describes among other things, User security principal, set by arena at launch.
   * You should use this for checking security within your applet, and not rely on global app session
  */
  get session(){return this.#session ?? null;}
  /** Session object which describes among other things, User security principal, set by arena at launch*/
  set session(v){this.#session = isOfOrNull(v, Session);}

  /** Returns the name of the applet displayed in the Arena title bar */
  get title() { return this.constructor.name; }

  /** Returns short description */
  get description() { return ""; }

  /** Returns the prefix used for local storage key names */
  get localStoragePrefix() { return `${this.arena.app.id}::${this.constructor.name}`; }

  /** Override to return true when this applet has unsaved data.
   * The default implementation trips on a first child data member which returns true
   */
  get [DIRTY_PROP]() {
    const fields = getChildDataMembers(this, true);
    return fields.some(one => one[DIRTY_PROP] === true);
  }

  /** Override to prompt the user on Close, e.g. if your Applet is "dirty"/contains unsaved changes
   * you may pop-up a confirmation box. Return "true" to allow close, false to prevent it.
   * The method is called by arena before evicting this applet and replacing it with a new one.
   * Returns a bool promise. The default impl returns `!this.dirty` which you can elect to override instead
   */
  [CLOSE_QUERY_METHOD](){
    if (this[DIRTY_PROP]){
      toast(`Please Save or Cancel changes in:  ${this.title}`, {timeout: 5000, status: "error"});
      return false;
    }

    return true;
  }



  /** Returns schema name set by this applet or applet class name as a default one */
  get effectiveSchema(){ return dflt(this.schema, this.constructor.name);  }

}//Applet
