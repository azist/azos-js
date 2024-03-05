/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "azos/types";
import * as aver from "azos/aver";
import { Module } from "azos/modules";
import { ConfigNode } from "azos/conf";

/**
 * Handles app routing and menu in a browser
 */
export class Router extends Module{

  #menu;//ConfigNode
  constructor(dir, cfg){
    super(dir, cfg);
    this.#menu = aver.isOf(cfg.get("menu"), ConfigNode);
  }

  //TODO: Need router methods which navigate menu

  


  /** Calculates menu tree as of current state
   * Returns [] of tuple (level, html...)
  */
  calculateMenu(){
    return {
      id: 1,//command id - ever increasing integer
      level: 1,//in the tree
      parent: null,//parent item
      uriFull: "/full/path",
      uri: "path",
      kind: "",//section|split|check|cmd
      htmlIcon: "",//icon
      htmlContent: "", //caption is rendered
      hint: "",//optional description as plain text
      shortcut: "",//optional shortcut name in plain text e.g. "Ctrl+A"
      checked: true,
      handler: ConfigNode
    };
  }

}
