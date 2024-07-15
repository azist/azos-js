import { noContent } from "../ui";
import { html, parseRank, parseStatus, parsePosition } from '../ui.js';
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
    titlePosition: {type: String},

    /** Starting input value */
    value:         {type: String}
  }

  renderPart(){
    const clsRank=`${parseRank(this.rank, true)}`;
    const clsStatus=`${parseStatus(this.status, true)}`;
    const clsDisable = `${this.isDisabled ? "disabled" : ""}`;
    const clsPosition = `${this.titlePosition ? parsePosition(this.titlePosition,true) : "top-left"}`;

    let titleM='';
    if(this.titleMargin && (clsPosition==="mid-right" || clsPosition==="mid-left")){
      clsPosition==="mid-right" ? titleM=css`margin-left:${this.titleMargin}ch;` : titleM=css`margin-right:${this.titleMargin}ch;`;
    }

    return html`
      <div class="${clsRank} ${clsStatus} ${clsDisable}">
        <label class="${clsPosition}">
          <span style="${titleM}">${this.title}</span>
          ${this.message ? html`<br><span>${this.message}</span>` : ''}
          ${this.renderInput()}
        </label>
      </div>
    `;
  }

  /** Override to render particular input field(s), i.e. CheckField, RadioOptionField, SelectField, TextField */
  renderInput(){ return noContent; }
}
