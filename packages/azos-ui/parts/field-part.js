import { POSITION, noContent } from "../ui";
import { html, css, parseRank, parseStatus, parsePosition } from '../ui.js';
import { AzosPart } from "./part";

export class FieldPart extends AzosPart{

  static properties = {
    /** Set the width of this field as "%". Use this instead of minWidth and maxWidth. Must be 0 <= this.width <= 100 */
    fieldWidth:         {type: Number},

    /** Maximum allowed width as "%" for this field. Cannot exceed 100. */
    maxFieldWidth:      {type: Number},

    /** Minimum allowed width as "%" for this field. Cannot be less than zero. */
    minFieldWidth:      {type: Number},

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
    value:         {type: String, reflect: true}
  }

  renderPart(){
    const clsRank =     `${parseRank(this.rank, true)}`;
    const clsStatus =   `${parseStatus(this.status, true)}`;
    const clsDisable =  `${this.isDisabled ? "disabled" : ""}`;
    const clsPosition = `${this.titlePosition ? parsePosition(this.titlePosition,true) : "top-left"}`;

    /** Set the width of the input field label */
    let titleWidth = '';
    if (this.titleWidth !== undefined) {
      if (this.titlePosition === POSITION.MIDDLE_LEFT || this.titlePosition === POSITION.MIDDLE_RIGHT)
        if(0 <= this.titleWidth <= 100) titleWidth = css`width:${this.titleWidth}%;`;
    }

    /** Set width for the entire input field (includes title, ui element, status message) */
    let styleFieldWidth=css``;
    if((this.fieldWidth !== undefined && this.minFieldWidth === undefined && this.maxFieldWidth === undefined) && 0 <= this.fieldWidth <= 100)
      styleFieldWidth = css`width: ${this.fieldWidth}%;`;
    if(this.minFieldWidth !== undefined && 0 <= this.minFieldWidth <= 100) styleFieldWidth += css`min-width: ${this.minFieldWidth}%;`;
    if(this.maxFieldWidth !== undefined && 0 <= this.maxFieldWidth <= 100) styleFieldWidth += css`max-width: ${this.maxFieldWidth}%;`;

    const msg = this.message ? html`<span class="msg">${this.message}</span>` : '';

    return html`
      <div class="${clsRank} ${clsStatus} ${clsDisable}" style="${styleFieldWidth}">
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
