/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { asTypeMoniker, cast, asObject, CLIENT_MESSAGE_PROP } from "azos/types";
import { dflt } from "azos/strings";
import { POSITION, STATUS, noContent } from "../ui";
import { Part, html, css, parseRank, parseStatus, parsePosition } from '../ui.js';


function guardWidth(v, d){
  v = (v ?? d) | 0;
  return v < 0 ? 0: v > 100 ? 100 : v;
}

/** Default width of content box in INT percents */
export const DEFAULT_CONTENT_WIDTH_PCT = 40;

/** Default width of title in INT percents */
export const DEFAULT_TITLE_WIDTH_PCT = 40;


export class FieldPart extends Part{

  constructor(){
    super();
    this.contentWidth = DEFAULT_CONTENT_WIDTH_PCT;
    this.titleWidth = DEFAULT_TITLE_WIDTH_PCT;
    this.titlePosition = POSITION.TOP_LEFT;
  }

  #contentWidth;
  get contentWidth() { return this.#contentWidth; }
  set contentWidth(v) { this.#contentWidth = guardWidth(v, DEFAULT_CONTENT_WIDTH_PCT); }

  #titleWidth;
  get titleWidth() { return this.#titleWidth; }
  set titleWidth(v) { this.#titleWidth = guardWidth(v, DEFAULT_TITLE_WIDTH_PCT); }

  #titlePosition;
  get titlePosition() { return this.#titlePosition; }
  set titlePosition(v) { this.#titlePosition = parsePosition(v); }

  #dataType;
  /**
   * Defines a type of data stored by this field.
   * It is either `null | undefined` or contains a valid type moniker which is used to coerce the value
   * upon its assignment
   */
  get dataType() { return this.#dataType; }
  set dataType(v) { this.#dataType = v ? asTypeMoniker(v) : undefined; }

  #value;
  #rawValue;
  /** Gets field data value which is of {@link dataType} or undefined */
  get value(){ return this.#value; }

  /**
   * Sets field data value which will be type-cast in accordance with the specified {@link dataType}.
   * If the cast fails the exception gets thrown, this behavior differs from  {@link setValueFromInput}
   * which will capture cast exception as a field error
   */
  set value(v){
    this.#rawValue = v;
    this.#value = undefined;
    this.requestUpdate();
    this.#value = this.castValue(v);
  }

  /**
   * Sets the value as entered through the input/inputs, for example a value may contain extra formatting
   * which needs to be stripped prior to assignment into data value
   */
  setValueFromInput(v){
    this.#rawValue = v;
    this.#value = undefined; //the value is `undefined` because error may be thrown at conversion below
    this.requestUpdate();//async schedule update even if error gets thrown
    try{
      v = this.prepareInputValue(v);//prepare Input value first - this may throw (if user entered crap)
      this.#value = this.castValue(v);//cast data type - this may throw on invalid cast
      this.error = null; //reset an error if we did not throw above
    }catch(e){
      this.error = e;
    }
  }

  /**
   * Prepares a value obtained from a user input(s) into a value which can be set as field data value.
   * For example, a blood pressure field may contain a single input for systolic and diastolic measurements,
   * which are delimited by a slash `120/80`, however a {@link value} property stores an object with two fields, or
   * an array with two integers. You would parse two values out of a single string into
   * an object with two fields `{"systolic": 120, "diastolic": 80}` or an array (effectively a tuple) `[120, 80]`.
   * The default implementation does not alter the supplied value returning it as-is.
   * You do not call this method directly, call {@link setValueFromInput} which calls this method in a guarded way, so exceptions thrown by this method
   * will be displayed by the field via an {@link error} property
  */
  prepareInputValue(v){ return v; }



  /**
   * Returns a last set value BEFORE any conversion or value preparation which may have failed,
   * therefore this returns a raw value of the last field set attempt
   */
  get rawValue() { return this.#rawValue; }


  #error;
  /**
   * Returns an error object if the field is in errored state, such as a validation error
   */
  get error() { return this.#error; }

  /**
   * Sets an error object, such as an exception, which describes the error condition such as a validation error.
   * The error details are to be kept in this object (e.g. a custom exception).
   * You can also pass a string containing objects JSON which will be parsed as object
   */
  set error(v) { this.#error = asObject(v, true); }


  /**
   * The effective status is "shadowed" by the error if one is set, or returns a regular parts' {@link status}.
   * `render*` method implementations should use this method
   * */
  get effectiveStatus(){ return this.#error ? STATUS.ERROR : this.status; }

  /**
   *  The effective message is "shadowed" by the error if one is set, or returns a regular parts' {@link message}.
   * `render*` method implementations should use this method.
   * When errors are present, the system uses {@link CLIENT_MESSAGE_PROP} protocol to get the client-centric message
   * for user display. You can also pass an object with a `clientMessage` string key (not a symbol)
   * */
  get effectiveMessage(){
    const e = this.#error;
    if (e) {
      const cm = e[CLIENT_MESSAGE_PROP] ?? e[CLIENT_MESSAGE_PROP.description];
      return dflt(cm, "Invalid data");
    } else return this.message;
  }


  /** Override to type-cast/coerce/change value as required by your specific descendant
   *  for example, this may restrict value to bool for logical fields.
   * This is called on value set, therefore a {@link value} property may only store data as dictated  by this override,
   * as there is no way to set the value bypassing this method.
   * The default implementation relies on `{@link dataType} type moniker conversion
   * @param {*} v - value to set
   * @returns {T} value coerced to T as defined by `dataType` or the descendant implementation which might always convert to certain type (e.g. checkbox to bool)
   * */
  castValue(v){
    const tp = this.#dataType;
    const result = tp ? cast(v, tp, true) : v;
    return result;
  }

  static properties = {
    /** Width of the content as "%" when `isHorizontal=true`. Only applies to fields with non-predefined content layout, such as text fields etc.
     *  An integer number MUST BE BETWEEN 0 and 100 - otherwise the defaults are used.  */
    contentWidth:  {type: Number},

    /** Validation (error) message */
    message:       {type: String},

    /** Field's title */
    title:         {type: String},

    /** Field title position, oriented to input field. Valid positions:
     *  top-left, top-center, top-right, mid-left, mid-right, bot-left,
     *  bot-center, bot-right.  */
    titlePosition: {type: String, reflect: true},

    /** Width of the title as "%" when `isHorizontal=true`.
     *  An integer number MUST BE BETWEEN 0 and 100 - otherwise the defaults are used.
    */
    titleWidth:    {type: Number},

    /** The logical name of the field within its context (e.g.) */
    name:  {type: String, reflect: true},

    /** Type moniker which constrains the type of this field values */
    dataType: {String},

    /** The value of the field */
    value: {type: Object,
            converter: { fromAttribute: (v) => v?.toString()}
            /////////////hasChanged(newVal, oldVal) { return true; }
           },


    error: {type: Object},

    isRequired:  {type: Boolean, reflect: true}
  }



  /** True for field parts which have a preset/pre-defined content area layout by design, for example:
   *  checkboxes, switches, and radios have a pre-determined content area layout */
  get isPredefinedContentLayout(){ return false; }

  /** True if part's title position is middle left or middle right (i.e. field has horizontal orientation) */
  get isHorizontal(){ return this.titlePosition === POSITION.MIDDLE_LEFT || this.titlePosition === POSITION.MIDDLE_RIGHT; }

  renderPart(){
    const clsRank =     `${parseRank(this.rank, true)}`;
    const clsStatus =   `${parseStatus(this.effectiveStatus, true)}`;
    const clsDisable =  `${this.isDisabled ? "disabled" : ""}`;
    const clsPosition = `${this.titlePosition ? parsePosition(this.titlePosition,true) : "top-left"}`;

    const isPreContent = this.isPredefinedContentLayout;
    const isHorizon = this.isHorizontal;

    //Set the field's title width
    const stlTitleWidth = isHorizon ? css`width: ${this.titleWidth}%;` : null;
    const stlTitleHidden = this.title ? null : css`display:none`;
    //Set the field's content width if field is not of a predefined layout
    const stlContentWidth = isHorizon && !isPreContent ? css`width: ${this.contentWidth}%;` : null;

    const em = this.effectiveMessage;
    const msg = em ? html`<p class="msg">${em}</p>` : '';

    return html`
      <div class="${clsRank} ${clsStatus} ${clsDisable} field">
        <label class="${clsPosition}">
          <span class="${this.isRequired ? 'requiredTitle' : noContent}" style="${stlTitleWidth} ${stlTitleHidden}">${this.title}</span>
          ${this.isHorizontal ? html`<div style="${stlContentWidth}">${this.renderInput()} ${msg}</div>` : html`${this.renderInput()} ${msg}`}
        </label>
      </div>
    `;
  }

  /** Override to render particular input field(s), i.e. CheckField, RadioOptionField, SelectField, TextField */
  renderInput(){ return noContent; }

  /** Override to trigger `change` event dispatch after value changes DUE to user input */
  inputChanged(){
    const evt = new Event("change", {bubbles: true, cancelable: false});
    this.dispatchEvent(evt);
  }

}
