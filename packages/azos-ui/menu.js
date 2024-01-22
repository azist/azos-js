/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "azos/types";
import * as aver from "azos/aver";
import { Module } from "azos/modules";

/**
 * Manages menu tree
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
