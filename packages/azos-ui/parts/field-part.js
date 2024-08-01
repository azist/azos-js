import { POSITION, noContent } from "../ui";
import { html, css, parseRank, parseStatus, parsePosition } from '../ui.js';
import { AzosPart } from "./part";


function guardWidth(v, d){
  v = (v ?? d) | 0;
  return v < 0 ? 0: v > 100 ? 100 : v;
}

/** Default width of content box in INT percents */
export const DEFAULT_CONTENT_WIDTH_PCT = 40;

/** Default width of title in INT percents */
export const DEFAULT_TITLE_WIDTH_PCT = 40;


export class FieldPart extends AzosPart{

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

  #value;
  get value(){ return this.#value; }
  set value(v){
    this.#value = this.castValue(v);
  }

  /** Override to type-cast/coerce/change value as required by your specific descendant
   *  for example, this may restrict value to bool for logical fields */
  castValue(v){ return v; }

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

    /** The value of the field */
    value: {type: Object, converter: { fromAttribute: (v) => v?.toString()}}
  }



  /** True for field parts which have a preset/pre-defined content area layout by design, for example:
   *  checkboxes, switches, and radios have a pre-determined content area layout */
  get isPredefinedContentLayout(){ return false; }

  /** True if part's title position is middle left or middle right (i.e. field has horizontal orientation) */
  get isHorizontal(){ return this.titlePosition === POSITION.MIDDLE_LEFT || this.titlePosition === POSITION.MIDDLE_RIGHT; }

  renderPart(){
    const clsRank =     `${parseRank(this.rank, true)}`;
    const clsStatus =   `${parseStatus(this.status, true)}`;
    const clsDisable =  `${this.isDisabled ? "disabled" : ""}`;
    const clsPosition = `${this.titlePosition ? parsePosition(this.titlePosition,true) : "top-left"}`;

    const isPreContent = this.isPredefinedContentLayout;
    const isHorizon = this.isHorizontal;

    //Set the field's title width
    const stlTitleWidth = isHorizon ? css`width: ${this.titleWidth}%;` : null;
    //Set the field's content width if field is not of a predefined layout
    const stlContentWidth = isHorizon && !isPreContent ? css`width: ${this.contentWidth}%;` : null;

    const msg = this.message ? html`<p class="msg">${this.message}</p>` : '';

    return html`
      <div class="${clsRank} ${clsStatus} ${clsDisable} field">
        <label class="${clsPosition}">
          <span class="${this.isRequired ? 'requiredTitle' : noContent}" style="${stlTitleWidth}">${this.title}</span>
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
