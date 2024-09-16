import { AzosElement, html, css, parseStatus, parseRank } from "../../ui";

export class Timeline extends AzosElement{
  constructor(){ super(); }

  static properties={
    /** Identifies the current (active) step within this timeline's array */
    currentStepIndex: {type:Number}
  }

  static styles=css`
    .timeline{
      background: var(--s-default-bg);
      color: var(--s-default-fg);
      display:flex;
      text-align:center;
      padding:1em 3.5em;
      justify-content:space-between;
      column-gap:1.25em;
    }

    .timeline-step{
      z-index:2;
      cursor:pointer;
      transition:all ease .2s;
      border-radius:.5em;
      border:1px solid;
      flex-grow:1;
    }

    .timeline-step:hover{
      filter:brightness(1.5) drop-shadow(0 0 10px #fff);
    }

    .timeline-step h3{
      box-sizing: border-box;
      margin-bottom:0;
      margin-top:0;
      padding:.5em 1em;
      border-radius:.3em .3em 0 0;
    }

    .timeline-step p{
      text-transform:uppercase;
      margin-top:auto;
      margin-bottom:0;
      padding:.5em 1em;
      font-size:.8em;
      letter-spacing:.2em;
      border-radius:0 0 .3em .3em;
    }

    .ok      {background:var(--s-ok-bg-ctl);    color:var(--ok-fg-ctl);}
    .info    {background:var(--s-info-bg-ctl);  color:var(--s-info-fg-ctl);}
    .warning {background:var(--s-warn-bg-ctl);  color:var(--s-warn-fg-ctl);}
    .alert   {background:var(--s-alert-bg-ctl); color:var(--s-alert-fg-ctl);}
    .error   {background:var(--s-error-bg-ctl); color:var(--s-error-fg-ctl);}

    .rev        {background:var(--s-default-fg);   color:var(--s-default-bg);}
    .revok      {background:var(--s-ok-fg-ctl);    color:var(--s-ok-bg-ctl);}
    .revinfo    {background:var(--s-info-fg-ctl);  color:var(--s-info-bg-ctl);}
    .revwarning {background:var(--s-warn-fg-ctl);  color:var(--s-warn-bg-ctl);}
    .revalert   {background:var(--s-alert-fg-ctl); color:var(--s-alert-bg-ctl);}
    .reverror   {background:var(--s-error-fg-ctl); color:var(--s-error-bg-ctl);}

    .r1 { font-size: var(--r1-fs); }
    .r2 { font-size: var(--r2-fs); }
    .r3 { font-size: var(--r3-fs); }
    .r4 { font-size: var(--r4-fs); }
    .r5 { font-size: var(--r5-fs); }
    .r6 { font-size: var(--r6-fs); }

    .bars{
      display:block;
      position:absolute;
      z-index:1;
      width:100%;
      height:10px;
      top:50%;
      left:0;
      background-color:hotpink;
    }
  `;

  #stepChange(e){
    const oldStep = this.currentStepIndex;
    const newStep = parseInt(e.currentTarget.getAttribute('data-step'));
    alert(`Current step BEFORE change is ${(oldStep+1)}`);
    if(newStep!==oldStep){
      this.currentStepIndex = newStep;
      alert(`Current step AFTER change is ${(newStep+1)}`);
      this.stepChanged();
    }
  }

  render(){
    const clsStatus=`${parseStatus(this.status,true)}`;
    const clsRank= `${parseRank(this.rank,true)}`;

    const steps=[...this.getElementsByTagName('az-timeline-step')];
    const stepList = html`${steps.map((step,i) =>
      //build individual step
      html`
        <div class="timeline-step" data-step="${i}" @click="${this.#stepChange}">
          <h3 class="${this.currentStepIndex===i ? `rev${clsStatus}` : ''}">${(i+1)}</h3>
          <p class="rev${clsStatus}">${step.title}</p>
        </div>
      `
    )}`;
    return html`
      <div class="timeline ${clsStatus} ${clsRank}">
          ${stepList}
      </div>
    `;
  }

  /** Bubbles timeline step change up to parent component */
  stepChanged(){
    const evt = new Event("change", {bubbles: true, cancelable: false});
    this.dispatchEvent(evt);
  }

}
window.customElements.define("az-timeline", Timeline);
