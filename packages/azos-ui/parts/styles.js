
/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { BREAKPOINT_SM } from "../styles/breakpoints.js";
import { css } from "../ui.js";

export const baseStyles = css`
:host{ display:inline-block;margin:0.2em 0.25em; }
.text-left   {text-align: left;}
.text-center {text-align: center;}
.text-right  {text-align: right;}

.r1 { font-size: var(--r1-fs); border-radius: var(--r1-brad-ctl); }
.r2 { font-size: var(--r2-fs); border-radius: var(--r2-brad-ctl); }
.r3 { font-size: var(--r3-fs); border-radius: var(--r3-brad-ctl); }
.r4 { font-size: var(--r4-fs); border-radius: var(--r4-brad-ctl); }
.r5 { font-size: var(--r5-fs); border-radius: var(--r5-brad-ctl); }
.r6 { font-size: var(--r6-fs); border-radius: var(--r6-brad-ctl); }

.ok      { background: var(--s-ok-bg-ctl);     color: var(--s-ok-ink-ctl);    border: var(--s-ok-bor-ctl);}
.info    { background: var(--s-info-bg-ctl);   color: var(--s-info-ink-ctl);  border: var(--s-info-bor-ctl);}
.warning { background: var(--s-warn-bg-ctl);   color: var(--s-warn-ink-ctl);  border: var(--s-warn-bor-ctl);}
.alert   { background: var(--s-alert-bg-ctl);  color: var(--s-alert-ink-ctl); border: var(--s-alert-bor-ctl);}
.error   { background: var(--s-error-bg-ctl);  color: var(--s-error-ink-ctl); border: var(--s-error-bor-ctl);}
.brand1  { background: var(--s-brand1-bg-ctl);  color: var(--s-brand1-ink-ctl); border: var(--s-brand1-bor-ctl);}
.brand2  { background: var(--s-brand2-bg-ctl);  color: var(--s-brand2-ink-ctl); border: var(--s-brand2-bor-ctl);}
.brand3  { background: var(--s-brand3-bg-ctl);  color: var(--s-brand3-ink-ctl); border: var(--s-brand3-bor-ctl);}

/*Note: These .statusBg classes are needed to give correct color
  to dots/checks of checkboxes, radios, & switches*/
.okBg      { background: var(--s-ok-bg-ctl); }
.infoBg    { background: var(--s-info-bg-ctl); }
.warningBg { background: var(--s-warn-bg-ctl); }
.alertBg   { background: var(--s-alert-bg-ctl); }
.errorBg   { background: var(--s-error-bg-ctl); }
.brand1Bg   { background: var(--s-brand1-bg-ctl); }
.brand2Bg   { background: var(--s-brand2-bg-ctl); }
.brand3Bg   { background: var(--s-brand3-bg-ctl); }

/* Styles for POSITION enumerated type */
/* Built to work for the current input layout:
    <label class="POSITION">
      <span> Input Title/Label </span>
      <input />
    </label>
*/
.top-left,.top-center,.top-right,
.mid-left,.mid-right,
.bottom-left,.bottom-center,.bottom-right { display:flex; width: 100%; }

.top-right { align-items: flex-end; }
.top-center { align-items: center; }
.bottom-right { align-items: flex-end; }
.bottom-center { align-items: center; }

.top-left,.top-center,.top-right { flex-direction:column; }
.top-left > span                 { text-align:left; margin-bottom: .6em; }
.top-center > span               { text-align:center; margin-bottom: .6em; }
.top-right > span                { text-align:right; margin-bottom: .6em; }

.mid-left                        { flex-direction:row; align-items:center; justify-content:space-between;}
.mid-left > span                 { text-align:left; }

.mid-right                       { flex-direction:row-reverse; align-items:center; justify-content:space-between; }
.mid-right > span                { text-align:left; }

.bottom-left,.bottom-center,.bottom-right { flex-direction:column-reverse; }
.bottom-left > span                 { text-align:left; margin-top: .6em; }
.bottom-center > span               { text-align:center; margin-top: .6em; }
.bottom-right > span                { text-align:right; margin-top: .6em; }

/**
 * TODO: determine if we can change 360 to ${BREAKPOINT_SM}
 */
@media screen and (max-width: 360px){
  .mid-right, .mid-left{ flex-direction: column; }
}
.msg { font-size: .0em; opacity: .1; margin: .33em; transition: 0.35s; }
.msg-filled { font-size: 0.85em; opacity: .8; }
.requiredTitle::after{
  content: var(--ctl-req-sym);
  margin-left: 3px;
  font-weight: 1000;
  font-size:0.85em;
  vertical-align:top;
  color: var(--ctl-req-sym-color);
  text-shadow: var(--ctl-req-sym-text-shadow);
}

.browse .requiredTitle::after{ color: var(--ghost); font-weight: var(--browse-label-fweight); }

.browse{ opacity: var(--browse-opacity); filter: var(--browse-filter); }
.browse label > span{ font-weight: var(--browse-label-fweight); }

.readonlyInput{ background: none!important; }

.field{
  display: block;
  border: none !important;
  background-color: unset !important;
  transition: 0.15s ease-out;
}

.busy{
  display: inline-block;
  vertical-align: super;
  width: .35em;
  height: .35em;
  background: var(--ink);
  border-radius: 25%;
  animation: busyPulse 1s infinite alternate;
  margin-left: 0.2ch;
}

@keyframes busyPulse {
  to {
    transform: scale(1.5) rotate(360deg) translateX(-0.1em);
    opacity: 0.15;
    border-radius: 50%;
  }
}
`;

export const buttonStyles = css`
button{
  width: inherit;
  height: inherit;
  font-family: inherit;
  font-weight: var(--ctl-button-fweight);
  font-style: var(--ctl-button-fstyle);
  letter-spacing: var(--ctl-button-letter-spacing);
  box-shadow: var(--ctl-button-box-shadow);
  border: var(--s-default-bor-ctl-btn);
  color:  var(--s-default-fg-ctl);
  background: var(--s-default-bg-ctl-btn);
  padding: var(--ctl-button-padding);
  transition: 0.2s;
  user-select: none;
  -webkit-user-select: none;
}

button:focus{
  outline: var(--focus-ctl-outline);
  box-shadow: var(--focus-ctl-box-shadow);
}

button:hover{ filter:  brightness(1.08); }
button:active{ transform: translateY(0.1em); }


button.ok      { background: var(--s-ok-bg-ctl-btn); color: var(--s-ok-fg-ctl-btn); border: var(--s-ok-bor-ctl-btn);}
button.info    { background: var(--s-info-bg-ctl-btn); color: var(--s-info-fg-ctl-btn); border: var(--s-info-bor-ctl-btn);}
button.warning { background: var(--s-warn-bg-ctl-btn); color: var(--s-warn-fg-ctl-btn); border: var(--s-warn-bor-ctl-btn);}
button.alert   { background: var(--s-alert-bg-ctl-btn); color: var(--s-alert-fg-ctl-btn); border: var(--s-alert-bor-ctl-btn);}
button.error   { background: var(--s-error-bg-ctl-btn); color: var(--s-error-fg-ctl-btn); border: var(--s-error-bor-ctl-btn);}
button.brand1  { background: var(--s-brand1-bg-ctl-btn); color: var(--s-brand1-fg-ctl-btn); border: var(--s-brand1-bor-ctl-btn);}
button.brand2  { background: var(--s-brand2-bg-ctl-btn); color: var(--s-brand2-fg-ctl-btn); border: var(--s-brand2-bor-ctl-btn);}
button.brand3  { background: var(--s-brand3-bg-ctl-btn); color: var(--s-brand3-fg-ctl-btn); border: var(--s-brand3-bor-ctl-btn);}

button:disabled{
 font-weight: 100;
 filter: var(--ctl-disabled-filter);
 transform: none;
}

button{ display: inline-block; }

/**
 * Icons in Buttons should always be 1em so it doesn't stretch out the button
 * using scale to make icon bigger without affecting the button size
 */
button .icon {
  --icon-stroke: currentColor;
  --icon-size: 1em;
  scale: 1.4;
  margin-inline-end: .5ch;
  margin-inline-start: -.5ch;
}
button:has(i) {
  display: inline-flex;
  &.shrink {
    @media (max-width: ${BREAKPOINT_SM}px) {
      padding: .5em;
      .title {display: none }
      .icon { margin: 0 }
    }
  }
  i {
    display: inline-flex !important;
  }
}
`;

export const checkStyles = css`
  label{
    gap:0 .5em;
    user-select:none;
  }
  label > span{ font-weight: 500; }
  .check{
    appearance:none;
    background-color:var(--s-default-bg-ctl);
    border: var(--s-default-bor-ctl);
    display:grid;
    place-content:center;
    width:1.5em;
    height:1.5em;
    min-width: 14px;
    min-height: 14px;
    box-shadow: var(--ctl-box-shadow);
  }
  .check:focus{
    outline: var(--focus-ctl-outline);
    box-shadow: var(--focus-ctl-box-shadow);
  }
  .check:disabled::before{ opacity: 0.5;}

  .check:disabled{  }
  .disabled{
    color: #b4b4b4;
    font-weight: 100;
    filter: var(--ctl-disabled-filter);
  }

  .checkmark {
    &:before {
      content: "";
      position: absolute;
      width: .2em;
      height: .4em;
      bottom: .055em;
      border-right: .07em solid var(--s-default-fg-ctl);
      border-bottom: .07em solid var(--s-default-fg-ctl);
      opacity: 0;
      scale: 0;
      rotate: 45deg;
      text-align:center;
      position:relative;
      transform-origin:center center;
      transition:.1s scale ease-in-out;
      font-size:1.85em;
    }
    &:checked:before {
      scale: 1;
      opacity: 1;
    }
  }
  .cross {
    position: relative;
    &:before,&:after {
      opacity: 0;
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1em;
      height: 0.1em;
      background-color: var(--s-default-fg-ctl);
      transition:.1s scale ease-in-out;
      translate: -50% -50%;
      scale: 0;
    }
    &:after {
      rotate: -45deg;
    }
    &:before {
      rotate: 45deg;
    }
    &:checked {
      &:before, &:after {
        scale: 1;
        opacity: 1; }
    }
  }
  .okBg { background-color: var(--s-ok-bg-ctl)!important;        border: var(--s-ok-bor-ctl);}
  .infoBg { background-color: var(--s-info-bg-ctl)!important;    border: var(--s-info-bor-ctl);}
  .warningBg { background-color: var(--s-warn-bg-ctl)!important; border: var(--s-warn-bor-ctl);}
  .alertBg { background-color: var(--s-alert-bg-ctl)!important;  border: var(--s-alert-bor-ctl);}
  .errorBg { background-color: var(--s-error-bg-ctl)!important;  border: var(--s-error-bor-ctl);}
  .brand1Bg { background-color: var(--s-brand1-bg-ctl)!important;  border: var(--s-brand1-bor-ctl);}
  .brand2Bg { background-color: var(--s-brand2-bg-ctl)!important;  border: var(--s-brand2-bor-ctl);}
  .brand3Bg { background-color: var(--s-brand3-bg-ctl)!important;  border: var(--s-brand3-bor-ctl);}

  .okBg[class~="check"]::before { background-color:none; color: var(--s-ok-fg-ctl); }
  .infoBg[class~="check"]::before { background-color:none; color: var(--s-info-fg-ctl); }
  .warningBg[class~="check"]::before { background-color:none; color: var(--s-warn-fg-ctl); }
  .alertBg[class~="check"]::before { background-color:none; color: var(--s-alert-fg-ctl); }
  .errorBg[class~="check"]::before { background-color:none; color: var(--s-error-fg-ctl); }
  .brand1Bg[class~="check"]::before { background-color:none; color: var(--s-brand1-fg-ctl); }
  .brand2Bg[class~="check"]::before { background-color:none; color: var(--s-brand2-fg-ctl); }
  .brand3Bg[class~="check"]::before { background-color:none; color: var(--s-brand3-fg-ctl); }
`;

export const switchStyles = css`
  /*label{ gap:0 .5em; user-select:none; }*/
  .switch{
    appearance:none;
    position:relative;
    color:inherit;
    font-size:inherit;
    box-sizing:content-box;
    border: var(--s-default-bor-ctl);
    background-color: var(--s-default-bg-ctl);
    border-radius:1.5em;
    vertical-align:middle;
    transition:.2 all ease;
    width:3em;
    height:1.5em;
    box-shadow: var(--ctl-box-shadow);
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
    width:.8em;
    height:.8em;
    transform:translate(0,-50%);
    margin:0 .15em;
  }
  .switch:checked::before{
    left:50%;
    width:1.2em;
    height:1.2em;
  }
  .switch:disabled{
    border: 1px solid var(--ghost);
    background: none;
  }

  .switch:disabled::before{background:var(--ghost);}

  .okBg[class~="switch"]::before { background-color: var(--s-ok-fg-ctl); }
  .infoBg[class~="switch"]::before { background-color: var(--s-info-fg-ctl); }
  .warningBg[class~="switch"]::before { background-color: var(--s-warn-fg-ctl); }
  .alertBg[class~="switch"]::before { background-color: var(--s-alert-fg-ctl); }
  .errorBg[class~="switch"]::before { background-color: var(--s-error-fg-ctl); }
  .brand1Bg[class~="switch"]::before { background-color: var(--s-brand1-fg-ctl); }
  .brand2Bg[class~="switch"]::before { background-color: var(--s-brand2-fg-ctl); }
  .brand3Bg[class~="switch"]::before { background-color: var(--s-brand3-fg-ctl); }

  .okBg[class~="switch"]    { background: var(--s-ok-bg-ctl)!important;    border: var(--s-ok-bor-ctl);}
  .infoBg[class~="switch"]  { background: var(--s-info-bg-ctl)!important;  border: var(--s-info-bor-ctl);}
  .warningBg[class~="switch"] { background: var(--s-warn-bg-ctl)!important;border: var(--s-warn-bor-ctl); }
  .alertBg[class~="switch"] { background: var(--s-alert-bg-ctl)!important; border: var(--s-alert-bor-ctl);}
  .errorBg[class~="switch"] { background: var(--s-error-bg-ctl)!important; border: var(--s-error-bor-ctl);}
  .brand1Bg[class~="switch"] { background: var(--s-brand1-bg-ctl)!important;  border: var(--s-brand1-bor-ctl);}
  .brand2Bg[class~="switch"] { background: var(--s-brand2-bg-ctl)!important;  border: var(--s-brand2-bor-ctl);}
  .brand3Bg[class~="switch"] { background: var(--s-brand3-bg-ctl)!important;  border: var(--s-brand3-bor-ctl);}
`;

export const radioStyles = css`
  .radio-item{
    display:flex;
    align-items:center;
    padding-bottom:.75em;
  }
  .radio-item-label{
    padding-left:.25em;
    margin-left:0;
  }
  .radio:focus{
    outline: var(--focus-ctl-outline);
    box-shadow: var(--focus-ctl-box-shadow);
  }
  .radioPrompt{ font-weight: 500; }
  .radio{
    appearance:none;
    border: var(--s-default-bor-ctl);
    border-radius:50%;
    background: var(--s-default-bg-ctl);
    display:grid;
    place-content:center;
    width:1.5em;
    min-width:1.5em;
    max-width:1.5em;
    height:1.5em;
    box-shadow: var(--ctl-box-shadow);
  }
  .radio::before{
    content:"";
    width:.75em;
    height:.75em;
    background-color: var(--s-default-fg-ctl);
    border-radius:50%;
    transform:scale(0);
    transform-origin:center center;
    transition:.1s transform ease-in-out;
  }
  .radio:checked::before{ transform:scale(1); }
  .radio:disabled{
    border: 1px solid var(--ghost);
    background: none;
  }
  .radio:disabled::before{background:var(--ghost);}
  .disabled{
    color: #b4b4b4;
    font-weight: 100;
  }
  .okBg[class~="radio"]::before { background-color: var(--s-ok-fg-ctl); }
  .infoBg[class~="radio"]::before { background-color: var(--s-info-fg-ctl); }
  .warningBg[class~="radio"]::before { background-color: var(--s-warn-fg-ctl); }
  .alertBg[class~="radio"]::before { background-color: var(--s-alert-fg-ctl); }
  .errorBg[class~="radio"]::before { background-color: var(--s-error-fg-ctl); }

  .okBg[class~="radio"]    { background: var(--s-ok-bg-ctl);     border: var(--s-ok-bor-ctl);}
  .infoBg[class~="radio"]  { background: var(--s-info-bg-ctl);   border: var(--s-info-bor-ctl);}
  .warningBg[class~="radio"] { background: var(--s-warn-bg-ctl); border: var(--s-warn-bor-ctl);}
  .alertBg[class~="radio"] { background: var(--s-alert-bg-ctl);  border: var(--s-alert-bor-ctl);}
  .errorBg[class~="radio"] { background: var(--s-error-bg-ctl);  border: var(--s-error-bor-ctl);}
`;

export const textFieldStyles = css`
  label{
    gap:0 .5em;
    user-select:none;
  }
  label > span{ font-weight: 500; }
  input,textarea,select{
    width: 100%;
    box-sizing: border-box;
    padding: 0.3em 0.35em;
    border: var(--s-default-bor-ctl);
    background-color: var(--s-default-bg-ctl);
    color: var(--s-default-fg-ctl);
    line-height: 1.3em;
    font-size: 1em;
    box-shadow: var(--ctl-box-shadow);
  }
  input:focus,textarea:focus,select:focus{
    outline: var(--focus-ctl-outline);
    box-shadow: var(--focus-ctl-box-shadow);
  }
  input::placeholder, textarea::placeholder{ color: var(--ghost); }
  textarea{font-family:inherit;}

  .okBg      { background-color: var(--s-ok-bg-ctl) !important;    color: var(--s-ok-fg-ctl) !important;    border: var(--s-ok-bor-ctl) !important;}
  .infoBg    { background-color: var(--s-info-bg-ctl) !important;  color: var(--s-info-fg-ctl) !important;  border: var(--s-info-bor-ctl) !important;}
  .warningBg { background-color: var(--s-warn-bg-ctl) !important;  color: var(--s-warn-fg-ctl) !important;  border: var(--s-warn-bor-ctl) !important;}
  .alertBg   { background-color: var(--s-alert-bg-ctl) !important; color: var(--s-alert-fg-ctl) !important; border: var(--s-alert-bor-ctl) !important;}
  .errorBg   { background-color: var(--s-error-bg-ctl) !important; color: var(--s-error-fg-ctl) !important; border: var(--s-error-bor-ctl) !important;}

  .brand1Bg   { background-color: var(--s-brand1-bg-ctl) !important; color: var(--s-brand1-fg-ctl) !important; border: var(--s-brand1-bor-ctl) !important;}
  .brand2Bg   { background-color: var(--s-brand2-bg-ctl) !important; color: var(--s-brand2-fg-ctl) !important; border: var(--s-brand2-bor-ctl) !important;}
  .brand3Bg   { background-color: var(--s-brand3-bg-ctl) !important; color: var(--s-brand3-fg-ctl) !important; border: var(--s-brand3-bor-ctl) !important;}

  .disabled{ color: #b4b4b4; filter: var(--ctl-disabled-filter); }
  input[type=text]:disabled,input[type=password]:disabled,input[type=date]:disabled,textarea:disabled,select:disabled{
    border: 1px solid var(--ghost);
    background: none;
    color: var(--ghost);
  }

  select > option { padding: 0.3em 0.35em; }
`;

export const dateRangeStyles = css`
:host{ --content-width: 26ch; }
.field{ width: var(--content-width); }
.inputs{
  display: inline-grid;
  grid-template-columns: 1fr auto 1fr;
  grid-column-gap: 0.25em;
  align-items: center;
  justify-items: center;

  box-sizing: border-box;
  padding: 0;
  margin: 0;
  font-size: 1em;
  background-color: var(--s-default-bg-ctl);
  color: var(--s-default-fg-ctl);
  border: var(--s-default-bor-ctl);
  border-radius: var(--r3-brad-ctl);
  box-shadow: var(--ctl-box-shadow);
}
.inputs input{
  width: 100%;
  background: none;
  border: none;
  box-shadow: none;
  text-align: center;
}

.infoBg    input{ color: var(--s-info-fg-ctl) !important; }
.warningBg input{ color: var(--s-warn-fg-ctl) !important; }
.errorBg   input{ color: var(--s-error-fg-ctl) !important; }
.okBg      input{ color: var(--s-ok-fg-ctl) !important; }
.alertBg   input{ color: var(--s-alert-fg-ctl) !important; }

.brand1Bg  input{ color: var(--s-brand1-fg-ctl) !important; }
.brand2Bg  input{ color: var(--s-brand2-fg-ctl) !important; }
.brand3Bg  input{ color: var(--s-brand3-fg-ctl) !important; }

`;

export const sliderStyles = css`
  label{
    gap:0 .5em;
    user-select:none;
  }
  label > span{ font-weight: 500; }

  /*********** Baseline, reset styles ***********/
  input[type="range"] {
    appearance: none;
    background: transparent;
    width: 100%;
    box-sizing: border-box;
  }

  /* Removes default focus */
  input[type="range"]:focus {
    outline: none;
  }

  /******** Chrome, Safari, Opera and Edge Chromium styles ********/
  /* slider track */
  input[type="range"]::-webkit-slider-runnable-track {
    border: var(--s-default-bor-ctl);
    background-color: var(--s-default-bg-ctl);
    border-radius: 0.5em;
    height: 0.5em;
  }

  /* slider thumb */
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    margin-top: -.25em; /* Centers thumb on the track */
    background-color: var(--s-default-fg-ctl);
    border-radius: 50%;
    height: 1em;
    width: 1em;
  }

  input[type="range"]:focus::-webkit-slider-thumb {
    outline: var(--focus-ctl-outline);
    box-shadow: var(--focus-ctl-box-shadow);
  }

  /*********** Firefox styles ***********/
  /* slider track */
  input[type="range"]::-moz-range-track {
    border: var(--s-default-bor-ctl);
    background-color: var(--s-default-bg-ctl);
    border-radius: 0.5em;
    height: 0.5em;
  }

  /* slider thumb */
  input[type="range"]::-moz-range-thumb {
    background-color: var(--s-default-fg-ctl);
    border: none; /*Removes extra border that FF applies*/
    border-radius: 50%;
    height: 1em;
    width: 1em;
  }

  input[type="range"]:focus::-moz-range-thumb{
    outline: var(--focus-ctl-outline);
    box-shadow: var(--focus-ctl-box-shadow);
  }

  /******** status overrides ********/
  input[type=range].okBg::-moz-range-track              { background-color: var(--s-ok-bg-ctl); border: var(--s-ok-bor-ctl); }
  input[type=range].okBg::-webkit-slider-runnable-track { background-color: var(--s-ok-bg-ctl); border: var(--s-ok-bor-ctl); }
  input[type=range].okBg::-moz-range-thumb              { background-color: var(--s-ok-fg-ctl); }
  input[type=range].okBg::-webkit-slider-thumb          { background-color: var(--s-ok-fg-ctl); }

  input[type=range].infoBg::-moz-range-track              { background-color: var(--s-info-bg-ctl); border: var(--s-info-bor-ctl); }
  input[type=range].infoBg::-webkit-slider-runnable-track { background-color: var(--s-info-bg-ctl); border: var(--s-info-bor-ctl); }
  input[type=range].infoBg::-moz-range-thumb              { background-color: var(--s-info-fg-ctl); }
  input[type=range].infoBg::-webkit-slider-thumb          { background-color: var(--s-info-fg-ctl); }

  input[type=range].warningBg::-moz-range-track              { background-color: var(--s-warn-bg-ctl); border: var(--s-warn-bor-ctl); }
  input[type=range].warningBg::-webkit-slider-runnable-track { background-color: var(--s-warn-bg-ctl); border: var(--s-warn-bor-ctl); }
  input[type=range].warningBg::-moz-range-thumb              { background-color: var(--s-warn-fg-ctl); }
  input[type=range].warningBg::-webkit-slider-thumb          { background-color: var(--s-warn-fg-ctl); }

  input[type=range].alertBg::-moz-range-track              { background-color: var(--s-alert-bg-ctl); border: var(--s-alert-bor-ctl); }
  input[type=range].alertBg::-webkit-slider-runnable-track { background-color: var(--s-alert-bg-ctl); border: var(--s-alert-bor-ctl); }
  input[type=range].alertBg::-moz-range-thumb              { background-color: var(--s-alert-fg-ctl); }
  input[type=range].alertBg::-webkit-slider-thumb          { background-color: var(--s-alert-fg-ctl); }

  input[type=range].errorBg::-moz-range-track              { background-color: var(--s-error-bg-ctl); border: var(--s-error-bor-ctl); }
  input[type=range].errorBg::-webkit-slider-runnable-track { background-color: var(--s-error-bg-ctl); border: var(--s-error-bor-ctl); }
  input[type=range].errorBg::-moz-range-thumb              { background-color: var(--s-error-fg-ctl); }
  input[type=range].errorBg::-webkit-slider-thumb          { background-color: var(--s-error-fg-ctl); }
`;

export const iconStyles = css`
.icon{
  --icon-size: var(--arn-mnu-svg-size);
  --icon-stroke: var(--arn-strip-svg-stroke);
  --icon-stroke-width: var(--arn-strip-svg-stroke-width);
  --icon-fill: none;

  display: inline-block;
  stroke: var(--icon-stroke);
  stroke-width: var(--icon-stroke-width);
  fill: var(--icon-fill);
  vertical-align: middle;

  &, svg{ /* sometimes, svg is wrapped */
    width: var(--icon-size);
    padding: 0;
    margin: 0;
  }

  &.fas{ fill: var(--icon-stroke) }
}
`;
