/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { CLOSE_QUERY_METHOD, DIRTY_PROP } from "azos/types";
import { AzosElement } from "./ui.js";

/**
 * A higher order component which represents a grouping of user interface elements which are
 *  logically connected.
 *  e.g., "Address block" containing street1, street2, city, state, zip.
 */
export class Block extends AzosElement {

  /**
   * Reactive properties
   */
  static properties = {
    title: { type: String },
    description: { type: String }
  };

  constructor() {
    super();
    this.title = this.constructor.name;
  }

  /** Override to return true when this app has unsaved data */
  get [DIRTY_PROP]() { return false; }

  /** Override to prompt the user on Close, e.g. if your Applet is "dirty"/contains unsaved changes
   * you may pop-up a confirmation box. Return "true" to allow close, false to prevent it.
   * The method is called by arena before evicting this applet and replacing it with a new one.
   * Returns a bool promise. The default impl returns `!this.dirty` which you can elect to override instead
   */
  async [CLOSE_QUERY_METHOD]() { return !this[DIRTY_PROP]; }

}//Applet
