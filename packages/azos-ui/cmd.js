/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
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
    if (nsh instanceof ConfigNode){
      this.#shortcut = makeNew(KeyboardShortcut, nsh, null, KeyboardShortcut);
    } else this.#shortcut = null;
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
   * @returns {TemplateResult} return html template fragment
   * */
  // eslint-disable-next-line no-unused-vars
  provideMarkup(target){
    const ico = this.#icon;
    if (!ico){
      return html`<div class="command-button">${this.title}</div>`;
    }

    return html`<div class="command-icon">${verbatimHtml(this.icon)}</div>`;
  }

}

/*
 MenuItem is based on ConfigSection, has Children (sub menus):
 1. An Command reference allocated elsewhere
 2. A ConfigNode which is cfg for Command factory
 3. A divider, which is a "---" string, double divider "===" string


Functional style builder, which visits cfgNode and invokes callbacks to build the actual menu:
 menuLevelBuilder(cfg, ctx, fDetailCallback...)

 MenuCommand(........children)

 const menu = Iterable<Command|string>();

 const menu = [
   new MenuCommand(ctx, [
      cmdFileOpen,
      "----",
      cmdFileSave,
      cmdSaveAs
    ]),
    new Command(ctx, { condifg}})
 ];

1. add config Symbol[ProvideConfigVerbatimValue]()
 so now we can use commands directly in config like so:  {a: [cmd1, cmd2]} without converting them to sections, we dont need [new Verbatim(cmd1),...] anymore

2. add MenuCommand(ctx, cfg) .Items: [] array of Command | string

3. Menu rendered, takes:  buildMenu(anchor, menu); menu: ITerable<ommand|string>)


*/
