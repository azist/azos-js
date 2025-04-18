/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { CLOSE_QUERY_METHOD, DATA_BLOCK_PROP, DATA_NAME_PROP, DATA_VALUE_PROP, DIRTY_PROP, ERROR_PROP, isArray, isObject, isString, VALIDATE_METHOD, VALIDATION_APPLY_METHOD, ValidationError } from "azos/types";
import { Control, css, getBlockDataValue, getChildDataMembers, setBlockDataValue } from "./ui.js";

/**
 * A higher order component which represents a grouping of user interface elements which are
 *  logically connected. e.g., "Address block" containing `street1`, `street2`, `city`, `state`, `zip`.
 * Blocks allow component composition: Block descendants may be re-used in a variety of interfaces,
 * such as popup modals, or be sub-blocks of other blocks or applets.
 *  A special derivation branch based on {@link Form} class represent a logically completed data-bound forms.
 */
export class Block extends Control {

  static styles = [css`:host{ display: block }`];

  static properties = {
    name:        { type: String },
    title:       { type: String },
    description: { type: String },
    error:       { type: Object }
  };

  constructor() {
    super();
    this.title = this.constructor.name;
  }

  get[ERROR_PROP](){ return this.error; }
  set[ERROR_PROP](v){ this.error = v; }

  /** Override to return true when this app has unsaved data */
  get [DIRTY_PROP]() { return false; }

  /** Override to prompt the user on Close, e.g. if your Applet is "dirty"/contains unsaved changes
   * you may pop-up a confirmation box. Return "true" to allow close, false to prevent it.
   * The method is called by arena before evicting this applet and replacing it with a new one.
   * Returns a bool promise. The default impl returns `!this.dirty` which you can elect to override instead
   */
  async [CLOSE_QUERY_METHOD]() { return !this[DIRTY_PROP]; }

  get [DATA_BLOCK_PROP](){ return getChildDataMembers(this, true); }

  get [DATA_NAME_PROP](){ return this.name; }
  set [DATA_NAME_PROP](v){ this.name = v;}

  get [DATA_VALUE_PROP](){ return getBlockDataValue(this, false); }
  set [DATA_VALUE_PROP](v){
    const anythingApplied = setBlockDataValue(this, v);
    if (anythingApplied) this.requestUpdate();
  }

  /**
   * Establishes data validation protocol: a function of signature: `[VALIDATE_METHOD](context: any, scope: string, apply: bool): error | null`.
   * Performs validation logic returning an error object if validation fails.
   * Context object may include `[TARGET_PROP]` by convention to specify the validation target system id
   */
  [VALIDATE_METHOD](context, scope, apply = false){
    try{
      const items = this[DATA_BLOCK_PROP];
      var errorBatch = [];

      for(const item of items){
        const vm = item[VALIDATE_METHOD];
        if (vm){
          const ve = vm.call(item, context, scope, apply);
          errorBatch.push(ve);
        }
      }

      this._doValidate(errorBatch, context, scope);

      if (errorBatch.length === 0) return null;//no errors

      //Return a validation batch: an error with an array of errors in its `cause`
      const result = new ValidationError(this.constructor.name, this.name, scope, "Validation errors", "Errors", this.constructor.name, errorBatch);

      if (apply){
        this.error = result;
        this.requestUpdate();
      }

      return result;

    } catch(e) {
      this.error = e;
      this.requestUpdate();
      return e;
    }
  }

  /**
   * Override to perform block-level validation, such as cross-field validation.
   * This gets called after all fields have validated individually, having existing errors (if any) passed-in via `errorBatch`
   * @param {Error[]} errorBatch - an array of errors which have already been detected during validation. You add more errors via `errorBatch.push(...)`
   * @param {*} context optional validation context
   * @param {*} scope scoping specifier
   */
  // eslint-disable-next-line no-unused-vars
  _doValidate(errorBatch, context, scope){ }


  //todo: FormMode which is taken from parent

}//Block

/**
 * A higher order {@link Block} which represents a data view/entry form.
 * Forms may have service/backend logic association and provide data models context -
 * this makes forms more specific than blocks as forms provide data schema via metadata for contained detail fields
 * and/or sub-blocks (which in turn may have child fields and/or sub-blocks etc.)
 */
export class Form extends Block {

  constructor() { super(); }

}//Form
