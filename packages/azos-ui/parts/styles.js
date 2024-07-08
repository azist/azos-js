
import {css} from "../ui.js"

export const baseStyles = css`
.r1 { font-size: var(--r1-fs); border-radius: var(--r1-brad-ctl); }
.r2 { font-size: var(--r2-fs); border-radius: var(--r2-brad-ctl); }
.r3 { font-size: var(--r3-fs); border-radius: var(--r3-brad-ctl); }
.r4 { font-size: var(--r4-fs); border-radius: var(--r4-brad-ctl); }
.r5 { font-size: var(--r5-fs); border-radius: var(--r5-brad-ctl); }
.r6 { font-size: var(--r6-fs); border-radius: var(--r6-brad-ctl); }

.ok      { background: var(--s-ok-bg-ctl);     color: var(--s-ok-fg-ctl);    border: var(--s-ok-bor-ctl);}
.info    { background: var(--s-info-bg-ctl);   color: var(--s-info-fg-ctl);  border: var(--s-info-bor-ctl);}
.warning { background: var(--s-warn-bg-ctl);   color: var(--s-warn-fg-ctl);  border: var(--s-warn-bor-ctl);}
.alert   { background: var(--s-alert-bg-ctl);  color: var(--s-alert-fg-ctl); border: var(--s-alert-bor-ctl);}
.error   { background: var(--s-error-bg-ctl);  color: var(--s-error-fg-ctl); border: var(--s-error-bor-ctl);}

.okBg      { background: var(--s-ok-bg-ctl); }
.infoBg    { background: var(--s-info-bg-ctl); }
.warningBg { background: var(--s-warn-bg-ctl); }
.alertBg   { background: var(--s-alert-bg-ctl); }
.errorBg   { background: var(--s-error-bg-ctl); }

.okTxt      { color: var(--s-ok-fg-ctl); }
.infoTxt    { color: var(--s-info-fg-ctl); }
.warningTxt { color: var(--s-warn-fg-ctl); }
.alertTxt   { color: var(--s-alert-fg-ctl); }
.errorTxt   { color: var(--s-error-fg-ctl); }
`;

export const buttonStyles = css`
button{
  font-weight: var(--ctl-button-fweight);
  font-style: var(--ctl-button-fstyle);
  border: var(--s-default-bor-ctl);
  color:  var(--s-default-fg-ctl);
  background: var(--s-default-bg-ctl-btn);

  padding: 0.5lh 1ch 0.5lh 1ch;
  margin: 0.5lh 0.5ch 0.5lh 0.5ch;
  min-width: 10ch;
  transition: 0.2s;

  user-select: none;
  -webkit-user-select: none;
}

button:focus{
  outline: var(--focus-ctl-outline);
  box-shadow: var(--focus-ctl-box-shadow);
}

button:hover{
  filter:  brightness(1.08);
}

button:active{
  transform: translateY(1.2px);
}


button.ok      { background: var(--s-ok-bg-ctl-btn);     color: var(--s-ok-fg-ctl);    border: var(--s-ok-bor-ctl);}
button.info    { background: var(--s-info-bg-ctl-btn);   color: var(--s-info-fg-ctl);  border: var(--s-info-bor-ctl);}
button.warning { background: var(--s-warn-bg-ctl-btn);   color: var(--s-warn-fg-ctl);  border: var(--s-warn-bor-ctl);}
button.alert   { background: var(--s-alert-bg-ctl-btn);  color: var(--s-alert-fg-ctl); border: var(--s-alert-bor-ctl);}
button.error   { background: var(--s-error-bg-ctl-btn);  color: var(--s-error-fg-ctl); border: var(--s-error-bor-ctl);}

button:disabled{
  color: #b4b4b4;
  border: 1px solid #c0c0c0;
  background: var(--paper);
  font-weight: 100;
  filter: none;
  transform: none;
}`;

export const checkStyles=css`
  div{
    display:block;
    margin:10px;
  }
  label{
    cursor:pointer;
    display:flex;
    align-items:center;
    gap:0 .5em;
    user-select:none;
  }
  .check{
    cursor:pointer;
    appearance:none;
    background-color:var(--s-default-bg-ctl);
    border:.12em solid var(--s-default-fg-ctl);
    display:grid;
    place-content:center;
    width:1.5em;
    height:1.5em;
    border-radius:.25em;
  }
  .check:focus{
    outline: var(--focus-ctl-outline);
    box-shadow: var(--focus-ctl-box-shadow);
  }
  .check::before{
    content:"\u{2713}";
    text-align:center;
    position:relative;
    transform:scale(0);
    transform-origin:center center;
    transition:.1s transform ease-in-out;
    font-size:1.3em;
    font-weight:bolder;
    color:var(--s-default-fg-ctl);
  }
  .okBg[class~="check"]::before { color: var(--s-ok-fg-ctl); }
  .infoBg[class~="check"]::before { color: var(--s-info-fg-ctl); }
  .warningBg[class~="check"]::before { color: var(--s-warn-fg-ctl); }
  .alertBg[class~="check"]::before { color: var(--s-alert-fg-ctl); }
  .errorBg[class~="check"]::before { color: var(--s-error-fg-ctl); }
  .check:checked::before{ transform:scale(1); }
  .check:disabled{
    border: 1px solid #c0c0c0;
  }
  .disabled{
    color: #b4b4b4;
    font-weight: 100;
  }
`;

export const switchStyles=css`
  .switch{
    cursor:pointer;
    appearance:none;
    position:relative;
    color:inherit;
    font-size:inherit;
    box-sizing:content-box;
    border:.12em solid var(--s-default-fg);
    border-radius:1.5em;
    vertical-align:middle;
    background-color: var(--s-default-bg);
    transition:.2 all ease;
    width:3em;
    height:1.5em;
  }
  .switch:focus{
    outline: var(--focus-ctl-outline);
    box-shadow: var(--focus-ctl-box-shadow);
  }
  .switch::before{
    content:"";
    position:absolute;
    box-sizing:border-box;
    border:none;
    border-radius:50%;
    background-color: var(--s-default-fg-ctl);
    transition:.2s all ease;
    top:50%;
    left:0;
    width:1.2em;
    height:1.2em;
    transform:translate(0,-50%);
    margin:0 .15em;
  }
  .okBg[class~="switch"]::before { background-color: var(--s-ok-fg-ctl); }
  .infoBg[class~="switch"]::before { background-color: var(--s-info-fg-ctl); }
  .warningBg[class~="switch"]::before { background-color: var(--s-warn-fg-ctl); }
  .alertBg[class~="switch"]::before { background-color: var(--s-alert-fg-ctl); }
  .errorBg[class~="switch"]::before { background-color: var(--s-error-fg-ctl); }
  .switch:checked::before{ left:50%; }
  .switch:disabled{
    border: 1px solid #c0c0c0;
  }
  .switch:disabled::before{background:#c0c0c0;}
`;

export const radioStyles=css`
  div{
    display:block;
    margin:10px;
    text-align:left;
  }
  label{
    cursor:pointer;
    display:flex;
    align-items:baseline;
    gap:0 1em;
    user-select:none;
  }
  label:has(.switch){
    cursor:pointer;
    display:flex;
    align-items:center;
    gap:0 .5em;
  }
  .radio:focus{
    outline: var(--focus-ctl-outline);
    box-shadow: var(--focus-ctl-box-shadow);
  }
  .radio{
    cursor:pointer;
    appearance:none;
    XXXbackground-color:var(--s-default-bg);
    border:.12em solid var(--s-default-fg-ctl);
    border-radius:50%;
    display:grid;
    place-content:center;
    width:1.5em;
    min-width:1.5em;
    max-width:1.5em;
    height:1.5em;
  }
  .radio::before{
    content:"";
    width:.75em;
    height:.75em;
    border-radius:50%;
    background:var(--s-default-fg);
    transform:scale(0);
    transform-origin:center center;
    transition:.1s transform ease-in-out;
  }
  .okBg[class~="radio"]::before { background-color: var(--s-ok-fg-ctl); }
  .infoBg[class~="radio"]::before { background-color: var(--s-info-fg-ctl); }
  .warningBg[class~="radio"]::before { background-color: var(--s-warn-fg-ctl); }
  .alertBg[class~="radio"]::before { background-color: var(--s-alert-fg-ctl); }
  .errorBg[class~="radio"]::before { background-color: var(--s-error-fg-ctl); }
  .radio:checked::before{ transform:scale(1); }
  .radio:disabled{
    border: 1px solid #c0c0c0;
  }
  .radio:disabled::before{background:#c0c0c0;}
  .disabled{
    color: #b4b4b4;
    font-weight: 100;
  }
`;
