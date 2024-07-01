
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

`;

export const buttonStyles = css`
button{
    font-weight: var(--ctl-button-fweight);
    font-style: var(--ctl-button-fstyle);
    border: var(--s-default-bor-ctl);
    color:  var(--s-default-fg-ctl);
    background: var(--s-default-bg-ctl);

   /* box-shadow: 0px 0px 2px rgba(25, 25, 25, .25); */
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

  button:disabled{
    color: #b4b4b4;
    border: 1px solid #c0c0c0;
    background: var(--paper);
    font-weight: 100;
    filter: none;
    transform: none;
  }


`;
