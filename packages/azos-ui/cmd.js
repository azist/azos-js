/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
import { isString } from "azos/types";
import { makeNew, config, ConfigNode, GET_CONFIG_VERBATIM_VALUE } from "azos/conf";
import { html, verbatimHtml } from "./ui.js";

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

  //Enables treatment by config framework as a verbatim value instead of being deconstructed into a ConfigSection
  [GET_CONFIG_VERBATIM_VALUE](){ return this; }

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

/** Command types */
export const CMD_KIND = Object.freeze({
  BUTTON:      "Button",
  CHECK:       "Check",
  CUSTOM:      "Custom",
});

/** Baseline abstraction of command object pattern used for various UI actions.
 * Typically commands get triggered by actions on menus and tool bar items, such as buttons.
 * An example command would be "File/Open" or "Project/Compile".
 * A large UI app (e.g. VS Code) may have 100s of commands presented to the user via various
 * main and context menus, and various tool strips/side bars;
 */
export class Command {
  #ctx;
  #kind;
  #uri;
  #title;
  #hint;
  #icon;

  #active = true;
  #visible = true;
  #enabled = true;
  #readonly = false;

  #shortcut;
  #value;
  #handler;

  constructor(ctx, cfg){
    this.#ctx = ctx ?? null;
    aver.isNotNull(cfg);

    if (!(cfg instanceof ConfigNode)){
      cfg = config(cfg).root;
    }
    this._ctor(cfg);
  }

  /** Protected constructor method not to be called by public callers */
  _ctor(cfg){
    this.#kind = cfg.getString("kind", null);
    this.#uri = cfg.getString("uri", null);
    this.#title = cfg.getString("title", null);
    this.#hint = cfg.getString("hint", null);
    this.#icon = cfg.getString("icon", null);
    this.#active = cfg.getBool("active", true);
    this.#visible = cfg.getBool("visible", true);
    this.#enabled = cfg.getBool("enabled", true);
    this.#readonly = cfg.getBool("readonly", false);

    const nsh = cfg.get("shortcut");
    if (nsh instanceof ConfigNode) this.#shortcut = makeNew(KeyboardShortcut, nsh, null, KeyboardShortcut);
    else if (nsh instanceof KeyboardShortcut) this.#shortcut = nsh;
    else this.#shortcut = null;

    this.#value = cfg.get("value") ?? null;
    this.#handler = aver.isFunctionOrNull(cfg.get("handler"));
  }

  //Enables treatment by config framework as a verbatim value instead of being deconstructed into a ConfigSection
  [GET_CONFIG_VERBATIM_VALUE](){ return this; }

  get ctx(){ return this.#ctx; }

  /** Globally (cross-applet) unique URI of the command. The convention is to use this pattern `Applet/Area/Ns/Cmd` */
  get uri(){ return this.#uri; }
  set uri(v){ this.#uri = aver.isNonEmptyString(v); }

  get kind(){ return this.#kind; }
  set kind(v){ this.#kind = aver.isStringOrNull(v); }

  get title(){ return this.#title; }
  set title(v){ this.#title = aver.isStringOrNull(v); }

  get hint(){ return this.#hint; }
  set hint(v){ this.#hint = aver.isStringOrNull(v); }

  get icon(){ return this.#icon; }
  set icon(v){ this.#icon = aver.isStringOrNull(v); }

  get active(){ return this.#active; }
  set active(v){ this.#active = !!v; }

  get visible(){ return this.#visible; }
  set visible(v){ this.#visible = !!v; }

  get enabled(){ return this.#enabled; }
  set enabled(v){ this.#enabled = !!v; }

  get readonly(){ return this.#readonly; }
  set readonly(v){ this.#readonly = !!v; }

  get shortcut(){ return this.#shortcut; }
  set shortcut(v){ this.#shortcut = aver.isOfOrNull(v, KeyboardShortcut); }

  get value(){ return this.#value; }
  set value(v){ this.#value = v; }

  get handler(){ return this.#handler; }
  set handler(v){ this.#handler = aver.isFunctionOrNull(v); }


  /** Executes the command. Commands return a Promise which completes upon command execution */
  async exec(sender){
    if (!this.#active) return;
    if (this.#handler) await this.#handler.call(this, sender);
  }

  /**
   * Provides a main representation of the command in a toolbar/menu in a form of markup,
   * such as SVG for image. It is possible to provide a complex markup such as flex container with text input and a button etc..
   * @param {Arena} arena - required parameter
   * @param {object} target - target of rendering, where rendering is directed
   * @returns {TemplateResult} return html template fragment
   * */
  // eslint-disable-next-line no-unused-vars
  provideMarkup(arena, target){
    let ico = this.#icon;
    if (!ico){
      return html`<div class="command-button">${this.title}</div>`;
    }

    ico = arena.renderImageSpec(ico, { cls: "command-icon icon" });
    if (ico.html) return ico.html;
    else return html`<div class="command-icon">${verbatimHtml(ico)}</div>`;
  }

}

/**
 * Represents a command sub type which has a menu of other commands.
 * The menu of sub-commands is supplied as an array of commands - either their config nodes with types,
 * or existing command instances. A null/undefined array values are treated as menu breaks
 *
*/
export class MenuCommand extends Command{
  #menu = [];

  constructor(ctx, cfg){
    super(ctx, cfg);
  }

  _ctor(cfg){
    super._ctor(cfg);

    let menu = cfg.get("menu");

    aver.isOf(menu, ConfigNode);
    aver.isTrue(menu.isArray);

    for(let {val} of menu){

      //Factory method for command
      if (val instanceof ConfigNode) val = makeNew(Command, val, this.ctx, Command);

      if (isString(val))
        this.#menu.push(val); // a string denotes a named menu section (a horizontal dash with a name)
      else
        this.#menu.push(aver.isOfOrNull(val, Command));//null denotes a menu break (a horizontal dash)
    }
  }

  /** Returns an array of menu items: each item is either a Command, a String section name or a null which represents a divider. */
  get menu(){ return [...this.#menu]; }
}
