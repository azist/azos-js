import { POSITION, noContent } from "../ui";
import { html, css, parseRank, parseStatus, parsePosition } from '../ui.js';
import { AzosPart } from "./part";

export class FieldPart extends AzosPart{

  static properties = {
    /** Maximum allowed width as "%" for this field. Cannot exceed 100. */
    maxWidth:      {type: Number},

    /** Minimum allowed width as "%" for this field. Cannot be less than zero. */
    minWidth:      {type: Number},

    /** Validation (error) message */
    message:       {type: String},

    /** Field's title */
    title:         {type: String},

    /** Field title position, oriented to input field. Valid positions:
     *  top-left, top-center, top-right, mid-left, mid-right, bot-left,
     *  bot-center, bot-right.
     */
    titlePosition: {type: String, reflect: true, converter: { fromAttribute: (v) => parsePosition(v)}},

    /** Allowed width of field's title as "%" when titlePosition = mid-left | mid-right */
    titleWidth:    {type: Number},

    /** Input value */
    value:         {type: String, reflect: true},

    /** Set the width of this field as "%". Use this instead of minWidth and maxWidth. Must be 0 <= this.width <= 100 */
    width:         {type: Number}
  }

  renderPart(){
    const clsRank=`${parseRank(this.rank, true)}`;
    const clsStatus=`${parseStatus(this.status, true)}`;
    const clsDisable = `${this.isDisabled ? "disabled" : ""}`;
    const clsPosition = `${this.titlePosition ? parsePosition(this.titlePosition,true) : "top-left"}`;

    let titleWidth = '';
    if (this.titlePosition === POSITION.MIDDLE_LEFT || this.titlePosition === POSITION.MIDDLE_RIGHT)
      titleWidth = (0 <= this.titleWidth <= 100) ? css`width:${this.titleWidth}%;` : noContent;

    const minWidth = (this.minWidth >= 0) ? css`min-width: ${this.minWidth}%;` : noContent;
    const maxWidth = (this.maxWidth <= 100) ? css`max-width: ${this.maxWidth}%;` : noContent;
    const width    = (0 <= this.width <= 100) ? css`width: ${this.width}%;` : noContent;

    const msg = this.message ? html`<span class="msg">${this.message}</span>` : noContent;

    return html`
      <div class="${clsRank} ${clsStatus} ${clsDisable}" style="${minWidth} ${maxWidth} ${width}">
        <label class="${clsPosition}">
          <span style="${titleWidth}">${this.title}</span>
          ${this.renderInput()}
          ${msg}
        </label>
      </div>
    `;
  }

  /** Override to render particular input field(s), i.e. CheckField, RadioOptionField, SelectField, TextField */
  renderInput(){ return noContent; }
}
