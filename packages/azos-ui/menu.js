/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "azos/types";
import * as aver from "azos/aver";
import { Module } from "azos/modules";

/*
 - Usage: menu() function is called BEFORE UI MENU POPUP so you can build menu before it gets displayed
 - Menu Defined as config, there is no special "menu hierarchy" data types which "hold menu"
 - Menu defined at menu<Tdirector>(director, ConfigNode)
 - Menu turns config node into array of MenuItem which is a model for menu rendering

 - Menu does this by interpreting BY CONVENTION config vector
 - Important: What you get out of Menu may be different what you feed in, eg. u get "last 5" files menu items,
    whereas in the menu config you get only one handler
 - Nodes may also have "handler" which generates dynamic sub/tree of MenuItem (see above)

 - A get handler is a function delegate which "handles" menu construction.
 - A run handler is a function delegate which "handles" menu invocation
 - System handlers provide default functions (e.g. for wrapping Applet invocation etc).
*/


/**
 * Menus are logical lists of dispatchable commands, optionally organized in hierarchies of nodes.
 * Menus are used everywhere: a). Primary arena menu b). Arena toolstrip menu c). Arena applet areas menu d). context menus.
 * Menus may have dynamic handlers which generate menu sub-tree upon invocation, e.g. "a list of recent files".
 * Menus are owned by the declaration site, e.g. an applet menu is owned by an applet.
 */
export class Menu{
  #root;

  constructor(cfg, fChange){
    super(dir, cfg);
    this.#root = new MenuNode(this, null);
  }

  get root(){ return this.#root; }

}

export class MenuNode{
  #menu;
  #parent;
  #uri;
  #caption;
  #access;
  #nodes; //is section if !=null
  #handler;//handler declaraton


  /** Menu reference */
  get menu(){ return this.#menu; }

  /** Parent section node */
  get menu(){ return this.#menu; }

  /** Returns root path to this item */
  get path(){ return null; }
}
