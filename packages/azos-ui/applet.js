/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { CLOSE_QUERY_METHOD, DIRTY_PROP } from "azos/types";
import { AzosElement } from "./ui.js";
import { dflt } from "azos/strings";

/**
 * Defines a root UI element which represents an Applet - a part of application.
 * Applets run inside of arenas as a root element for building complex UI screens such as data view/entry forms
 */
export class Applet extends AzosElement {

  constructor() {
    super();
  }

  /** Returns the name of the applet displayed in the Arena title bar */
  get title() { return this.constructor.name; }

  /** Returns the prefix used for local storage key names */
  get localStoragePrefix() { return `${this.arena.app.id}::${this.constructor.name}`; }

  /** Returns short description */
  get description() { return ""; }

  /** Override to return true when this applet has unsaved data */
  get [DIRTY_PROP]() { return false; }

  /** Override to prompt the user on Close, e.g. if your Applet is "dirty"/contains unsaved changes
   * you may pop-up a confirmation box. Return "true" to allow close, false to prevent it.
   * The method is called by arena before evicting this applet and replacing it with a new one.
   * Returns a bool promise. The default impl returns `!this.dirty` which you can elect to override instead
   */
  [CLOSE_QUERY_METHOD](){ return !this[DIRTY_PROP]; }


  /** Returns schema name set by this applet or applet class name as a default one */
  get effectiveSchema(){ return dflt(this.schema, this.constructor.name);  }

}//Applet
