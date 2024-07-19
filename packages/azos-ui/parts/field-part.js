import { isOneOf } from 'azos/strings';
import { POSITION, noContent } from "../ui";
import { html, css, parseRank, parseStatus, parsePosition } from '../ui.js';
import { AzosPart } from "./part";

export class FieldPart extends AzosPart{

  static properties = {
    /** Validation (error) message */
    message:       {type: String},

    /** Field's title */
    title:         {type: String},

    /** Field title position, oriented to input field. Valid positions:
     *  top-left, top-center, top-right, mid-left, mid-right, bot-left,
     *  bot-center, bot-right.
     */
    titlePosition: {type: String, reflect: true, converter: { fromAttribute: (v) => parsePosition(v)}},

    /** Allowed width of field's title as "%" when titlePosition = mid-left | mid-right.
     *  MUST BE BETWEEN 0 and 100 - otherwise defaults to 80 for "togglers", 40 for everything else.
     */
    titleWidth:    {type: Number},

    /** Input value */
    value:         {type: String, reflect: true}
  }

  /** True if part is a checkbox, switch, or radio */
  get isToggler(){ return isOneOf(this.tagName.toLowerCase(), ["az-checkbox", "az-radio-group"]); }

  renderPart(){
    const clsRank =     `${parseRank(this.rank, true)}`;
    const clsStatus =   `${parseStatus(this.status, true)}`;
    const clsDisable =  `${this.isDisabled ? "disabled" : ""}`;
    const clsPosition = `${this.titlePosition ? parsePosition(this.titlePosition,true) : "top-left"}`;

    /** Set the width of the input field label */
    let stlTitleWidth = '';
    if(this.titlePosition === POSITION.MIDDLE_LEFT || this.titlePosition === POSITION.MIDDLE_RIGHT){
      (this.titleWidth !== undefined)
        ? (this.titleWidth >= 0 && this.titleWidth <= 100)
          ? stlTitleWidth = css`width: ${this.titleWidth}%;`
          : this.isToggler ? stlTitleWidth = css`width: 80%;` : stlTitleWidth = css`width: 40%`
        : this.isToggler ? stlTitleWidth = css`width: 80%;` : stlTitleWidth = css`width: 40%`;
    }

    const msg = this.message ? html`<p class="msg">${this.message}</p>` : '';

    return html`
      <div class="${clsRank} ${clsStatus} ${clsDisable}">
        <label class="${clsPosition}">
          <span class="${this.isRequired ? 'requiredTitle' : noContent}" style="${stlTitleWidth}">${this.title}</span>
          ${this.renderInput()}
        </label>
        ${msg}
      </div>
    `;
  }

  /** Override to render particular input field(s), i.e. CheckField, RadioOptionField, SelectField, TextField */
  renderInput(){ return noContent; }
}
