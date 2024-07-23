import { isOneOf } from 'azos/strings';
import { POSITION, noContent } from "../ui";
import { html, css, parseRank, parseStatus, parsePosition } from '../ui.js';
import { AzosPart } from "./part";

export class FieldPart extends AzosPart{

  static properties = {
    /** Width of the content as "%" when isHorizontal=true. Only applies to text input field(s).
     *  MUST BE BETWEEN 0 and 100 - otherwise defaults to 40.
    */
    contentWidth:  {type: Number},

    /** Validation (error) message */
    message:       {type: String},

    /** Field's title */
    title:         {type: String},

    /** Field title position, oriented to input field. Valid positions:
     *  top-left, top-center, top-right, mid-left, mid-right, bot-left,
     *  bot-center, bot-right.
     */
    titlePosition: {type: String, reflect: true, converter: { fromAttribute: (v) => parsePosition(v)}},

    /** Allowed width of field's title as "%" when isHorizontal=true.
     *  MUST BE BETWEEN 0 and 100 - otherwise defaults to 80 for "togglers", 40 for everything else.
     */
    titleWidth:    {type: Number},

    /** Input value */
    value:         {type: String, reflect: true}
  }

  /** True if part is a checkbox, switch, or radio */
  get isToggler(){ return isOneOf(this.tagName.toLowerCase(), ["az-checkbox", "az-radio-group"]); }

  /** True if part's title position is middle left or middle right (i.e. field has horizontal orientation) */
  get isHorizontal(){ return this.titlePosition === POSITION.MIDDLE_LEFT || this.titlePosition === POSITION.MIDDLE_RIGHT; }

  renderPart(){
    const clsRank =     `${parseRank(this.rank, true)}`;
    const clsStatus =   `${parseStatus(this.status, true)}`;
    const clsDisable =  `${this.isDisabled ? "disabled" : ""}`;
    const clsPosition = `${this.titlePosition ? parsePosition(this.titlePosition,true) : "top-left"}`;

    /** Set the field's title width */
    let stlTitleWidth = '';
    if(this.isHorizontal){
      (this.titleWidth !== undefined)
        ? (this.titleWidth >= 0 && this.titleWidth <= 100)
          ? stlTitleWidth = css`width: ${this.titleWidth}%;`
          : this.isToggler ? stlTitleWidth = css`width: 80%;` : stlTitleWidth = css`width: 40%`
        : this.isToggler ? stlTitleWidth = css`width: 80%;` : stlTitleWidth = css`width: 40%`;
    }

    /** Set the field's content width if field is not a toggler */
    let stlContentWidth = '';
    if(this.isHorizontal && !this.isToggler){
      (this.contentWidth !== undefined)
        ? (this.contentWidth >= 0 && this.contentWidth <= 100)
          ? stlContentWidth = css`width: ${this.contentWidth}%;`
          : stlContentWidth = css`width: 40%;`
        : stlContentWidth = css`width: 40%;`;
    }

    const msg = this.message ? html`<p class="msg">${this.message}</p>` : '';

    return html`
      <div class="${clsRank} ${clsStatus} ${clsDisable}">
        <label class="${clsPosition}">
          <span class="${this.isRequired ? 'requiredTitle' : noContent}" style="${stlTitleWidth}">${this.title}</span>
          ${this.isHorizontal ? html`<div style="${stlContentWidth}">${this.renderInput()} ${msg}</div>` : html`${this.renderInput()} ${msg}`}
        </label>
      </div>
    `;
  }

  /** Override to render particular input field(s), i.e. CheckField, RadioOptionField, SelectField, TextField */
  renderInput(){ return noContent; }
}
