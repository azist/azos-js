/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
import { ConfigNode } from "azos/conf";

/** Define a keyboard shortcut */
export class KeyboardShortcut {
  #ctl;
  #alt;
  #shift;
  #key;
  #title;

  /** @param {ConfigNode} cfg  */
  constructor(cfg){
    aver.isOf(cfg, ConfigNode);
    this.#ctl   = cfg.getBool("ctl", false);
    this.#alt   = cfg.getBool("alt", false);
    this.#shift = cfg.getBool("shift", false);
    this.#key   = cfg.getString("key", "");
    this.#title = cfg.getString("title", "");
  }

  get ctl()  { return this.#ctl; }
  get alt()  { return this.#alt; }
  get shift(){ return this.#shift; }
  get key()  { return this.#key; }
  get title(){ return this.#title; }

  /**
   * Returns true when the keyboard event matches this shortcut.
   * See event details {@link https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values}
   * @param {KeyboardEvent} e - KeyboardEvent instance
   * */
  match(e){
    return e.key === this.#key &&
           e.altKey === this.#alt &&
           e.ctrlKey === this.#ctl &&
           e.shiftKey === this.#shift;
  }

}

/** Baseline abstraction of command object pattern used for various UI actions.
 * Typically commands get triggered by actions on menus and tool bar items, such as buttons.
 * An example command would be "File/Open" or "Project/Compile".
 * A large UI app (e.g. VS Code) may have 100s of commands presented to the user via various
 * main and context menus, and various tool strips/side bars;
 */
export class Command {

  static #idSeed = 0;

  #id;
  #caption;
  #hint;
  #icon;

  #shortcut;
  #enabled;
  #value;
  #onExec;

  #args;

  constructor(cfg){

  }


  /** Executes the command. Commands do NOT return anything */
  exec(sender){
    if (this.#onExec) this.#onExec.call(this, sender);
  }

  /**
   * Provides a main representation of the command in a toolbar/menu in a form of markup,
   * such as SVG for image. It is possible to provide a complex markup such as flex container with text input and a button etc..
   * */
  provideMarkup(target){
   return "";
  }

}
