/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "azos/types";
import * as aver from "azos/aver";
import { Module } from "azos/modules";

/**
 * Arena represents a virtual "stage" - what application/user "deals with"
 * e.g. sees at the present moment.
 * An arena maintains a state of scenes which get created by components such as
 * modal dialogs which have a stacking order
 */
export class ArenaLogic extends Module{

  constructor(dir, cfg){
    super(dir, cfg);
  }


  /** Calculates menu tree as of current state
   * Returns enumerable of tuple (level, html...)
  */
  calculateMenu(){

  }

}
