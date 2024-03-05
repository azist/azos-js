/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as aver from "./aver.js";
import { Application } from "./application.js";
import { AppComponent } from "./components.js";
import { ConfigNode } from "./conf.js";
import { Linker } from "./linker.js";

/**
 * Provides module implementation base.
 * Modules unify building blocks for business/app logic functionality
 * as they provide logic and dynamically link (DI/service locate) as driven by the application configuration
 */
export class Module extends AppComponent{

  #name;
  #order;

  /**
   * Allocates and configures module
   * @param {Application} app
   * @param {ConfigNode} cfg
   */
  constructor(app, cfg){
    aver.isOf(app, Application);
    aver.isOf(cfg, ConfigNode);
    super(app, cfg);
    this.#name = cfg.getString("name", types.genGuid());
    this.#order = cfg.getInt("order", 0);
  }

  /**
   * Override to provide logging from prefix, default uses class name
   */
  get logFrom(){ return `${this.constructor.name}(#${this.sid}, '${this.name}', ${this.#order})`; }

  /** Returns true when this implementation is the server one, so certain functions (such as dependencies) are required
   * vs being a client pass-through implementation
  */
  get isServerImpl(){ return false; }

  get [types.NAME_PROP](){ return this.#name; }
  get [types.ORDER_PROP](){ return this.#order; }

  /** Called by application after all modules have been created.
   * Override to patch references and startup subordinate daemons
   */
  _appAfterLoad(){
  }

  /** Called by application before stopping.
   * Override to un-patch references and shut-down subordinate daemons
   */
  _appBeforeCleanup(){
  }
}

/**
 * Dynamically resolves module interface types into concrete implementations
 * which are registered with the linker
 */
export class ModuleLinker extends Linker{
  constructor(){
    super(Module, Module);
  }
}
