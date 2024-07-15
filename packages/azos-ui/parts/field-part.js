import { POSITION, noContent } from "../ui";
import { html, css, parseRank, parseStatus, parsePosition } from '../ui.js';
import { AzosPart } from "./part";

export class FieldPart extends AzosPart{

  static properties = {
    /** Validation (error) message */
    message:       {type: String},

    /** Field's label/title  */
    title:         {type: String},

    /** Horizontal space in ch units when titlePosition = mid-left | mid-right */
    titleMargin:   {type: Number},

    /** Field title position, oriented to input field. Valid positions:
     *  top-left, top-center, top-right, mid-left, mid-right, bot-left,
     *  bot-center, bot-right.
     */
    titlePosition: {type: String, reflect: true, converter: { fromAttribute: (v) => parsePosition(v)}},

    /** Input value */
    value:         {type: String, reflect: true}
  }

  renderPart(){
    const clsRank=`${parseRank(this.rank, true)}`;
    const clsStatus=`${parseStatus(this.status, true)}`;
    const clsDisable = `${this.isDisabled ? "disabled" : ""}`;
    const clsPosition = `${this.titlePosition ? parsePosition(this.titlePosition,true) : "top-left"}`;

    let stlTitle = '';
    if (this.titleMargin > 0){
      if (this.titlePosition === POSITION.MIDDLE_LEFT) stlTitle = css`margin-right:${this.titleMargin}ch;`;
      else if (this.titlePosition === POSITION.MIDDLE_RIGHT) stlTitle = css`margin-left:${this.titleMargin}ch;`;
    }

    const msg = this.message ? html`<span>${this.message}</span>` : noContent;

    return html`
      <div class="${clsRank} ${clsStatus} ${clsDisable}">
        <label class="${clsPosition}">
          <span style="${stlTitle}">${this.title}</span>
          ${this.renderInput()}
          ${msg}
        </label>
      </div>
    `;
  }

  /** Override to render particular input field(s), i.e. CheckField, RadioOptionField, SelectField, TextField */
  renderInput(){ return noContent; }
}
