
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
  }
  .check{
    cursor:pointer;
    appearance:none;
    background-color:var(--s-default-bg-ctl);
    border:.15em solid var(--s-default-fg-ctl);
    display:grid;
    place-content:center;
    width:1em;
    height:1em;
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
    font-size:.75em;
    font-weight:bolder;
    color:var(--s-default-fg-ctl);
  }
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
    border:1px solid var(--s-default-fg);
    border-radius:1em;
    vertical-align:middle;
    background: var(--s-default-bg);
    transition:.2 all ease;
    width:2em;
    height:1em;
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
    width:.85em;
    height:.85em;
    transform:translate(0,-50%);
    margin:0 .15em;
  }
  .switch:checked::before{
    background-color:currentColor;
    left:calc(50% - .15em);
  }
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
    align-items:center;
    gap:0 1em;
  }
  .radio:focus{
    outline: var(--focus-ctl-outline);
    box-shadow: var(--focus-ctl-box-shadow);
  }
  .radio{
    cursor:pointer;
    appearance:none;
    background-color:var(--s-default-bg);
    border:.15em solid var(--s-default-fg-ctl);
    border-radius:50%;
    display:grid;
    place-content:center;
    width:1.68em;
    min-width:1.68em;
    max-width:1.68em;
    height:1.68em;
  }
  .radio::before{
    content:"";
    position:relative;
    top:0;
    left:0;
    width:.9em;
    height:.9em;
    border-radius:50%;
    background:var(--s-default-fg);
    transform:scale(0);
    transform-origin:center center;
    transition:.1s transform ease-in-out;
  }
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