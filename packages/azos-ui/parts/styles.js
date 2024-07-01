
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

/*STG edits start here*/
export const checkStyles=css`
  div{
    display:block;
    margin:10px;
  }
  label{
    cursor:pointer;
    display:grid;
    grid-template-columns: 1em auto;
    align-items:center;
  }
  label:has(.check){ gap:.75em; }
  label:has(.check):hover,label:has(.check):focus,.check:hover,.check:focus{
    outline: var(--focus-ctl-outline);
    box-shadow: var(--focus-ctl-box-shadow);
  }
  .check{
    cursor:pointer;
    margin:0;
    appearance:none;
    background-color:var(--s-default-bg-ctl);
    border:.1em solid var(--s-default-fg-ctl);
    display:grid;
    place-content:center;
  }
  .r1 label .check{
    width:var(--r1-fs);
    height:var(--r1-fs);
  }
  .r2 label .check{
    width:var(--r2-fs);
    height:var(--r2-fs);
  }
  .r3 label .check{
    width:var(--r3-fs);
    height:var(--r3-fs);
  }
  .r4 label .check{
    width:var(--r4-fs);
    height:var(--r4-fs);
  }
  .r5 label .check{
    width:var(--r5-fs);
    height:var(--r5-fs);
  }
  .r6 label .check{
    width:var(--r6-fs);
    height:var(--r6-fs);
  }
  .check::before{
    content:"\u{2713}";
    text-align:center;
    position:relative;
    transform:scale(0);
    transform-origin:center center;
    transition:.1s transform ease-in-out;
  }
  .check:checked::before{ transform:scale(1); }
  .r1 label .check::before{ font-size:var(--r1-fs); }
  .r2 label .check::before{ font-size:var(--r2-fs); }
  .r3 label .check::before{ font-size:var(--r3-fs); }
  .r4 label .check::before{ font-size:var(--r4-fs); }
  .r5 label .check::before{ font-size:var(--r5-fs); }
  .r6 label .check::before{ font-size:var(--r6-fs); }
`;

export const switchStyles=css`
    label:has(.switch){ align-items:center; }
    .r1 label:has(.switch){ gap:calc(var(--r1-fs)*2); }
    .r2 label:has(.switch){ gap:calc(var(--r2-fs)*2); }
    .r3 label:has(.switch){ gap:calc(var(--r3-fs)*2); }
    .r4 label:has(.switch){ gap:calc(var(--r4-fs)*2); }
    .r5 label:has(.switch){ gap:calc(var(--r5-fs)*2); }
    .r6 label:has(.switch){ gap:calc(var(--r6-fs)*2); }
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
    }
  .r1 label .switch{
    width:calc(var(--r1-fs)*2);
    height:var(--r1-fs);
  }
  .r2 label .switch{
    width:calc(var(--r2-fs)*2);
    height:var(--r2-fs);
  }
  .r3 label .switch{
    width:calc(var(--r3-fs)*2);
    height:var(--r3-fs);
  }
  .r4 label .switch{
    width:calc(var(--r4-fs)*2);
    height:var(--r4-fs);
  }
  .r5 label .switch{
    width:calc(var(--r5-fs)*2);
    height:var(--r5-fs);
  }
  .r6 label .switch{
    width:calc(var(--r6-fs)*2);
    height:var(--r6-fs);
  }
  label:has(.switch):hover,label:has(.switch):focus,.switch:hover,.switch:focus{
    outline: var(--focus-ctl-outline);
    box-shadow: var(--focus-ctl-box-shadow);
  }
  .switch:checked,
  .error label .switch:checked,.ok label .switch:checked,.warn label .switch:checked,.info label .switch:checked,.alert label .switch:checked{ background: var(--s-default-bg); }
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
    transform:translate(0,-50%);
    margin:0 .15em;
  }
  .switch:checked::before{
    background-color:currentColor;
    left:calc(50% - .15em);
  }
  .r1 label .switch::before{
    width:calc(var(--r1-fs)*.85);
    height:calc(var(--r1-fs)*.85);
  }
  .r2 label .switch::before{
    width:calc(var(--r2-fs)*.85);
    height:calc(var(--r2-fs)*.85);
  }
  .r3 label .switch::before{
    width:calc(var(--r3-fs)*.85);
    height:calc(var(--r3-fs)*.85);
  }
  .r4 label .switch::before{
    width:calc(var(--r4-fs)*.85);
    height:calc(var(--r4-fs)*.85);
  }
  .r5 label .switch::before{
    width:calc(var(--r5-fs)*.85);
    height:calc(var(--r5-fs)*.85);
  }
  .r6 label .switch::before{
    width:calc(var(--r6-fs)*.85);
    height:calc(var(--r6-fs)*.85);
  }
`;

export const radioStyles=css`
    div{
        display:block;
        margin:10px;
    }
    label{
        cursor:pointer;
        display:grid;
        grid-template-columns: 1em auto;
        gap:.75em;
    }
    label:has(.radio):hover,.radio:hover,label:has(.radio):focus,.radio:focus{
      outline: var(--focus-ctl-outline);
      box-shadow: var(--focus-ctl-box-shadow);
    }
    .radio{
        cursor:pointer;
        appearance:none;
        margin:0;
        background-color:var(--s-default-bg);
        border-radius:50%;
        border:.1em solid var(--s-default-fg);
        display:grid;
        place-content:center;
    }
    .radio::before{
        content:"";
        position:relative;
        top:0;
        left:0;
        border-radius:50%;
        background:var(--s-default-fg);
        transform:scale(0);
        transform-origin:center center;
        transition:.1s transform ease-in-out;
    }
    .radio:checked::before{ transform:scale(1); }
  .r1 label .radio{ 
    width:var(--r1-fs);
    height:var(--r1-fs);
  }
  .r2 label .radio{
    width:var(--r2-fs);
    height:var(--r2-fs);
  }
  .r3 label .radio{
    width:var(--r3-fs);
    height:var(--r3-fs);
  }
  .r4 label .radio{
    width:var(--r4-fs);
    height:var(--r4-fs);
  }
  .r5 label .radio{
    width:var(--r5-fs);
    height:var(--r5-fs);
  }
  .r6 label .radio{
    width:var(--r6-fs);
    height:var(--r6-fs);
  }
  .r1 label .radio::before{
    width:calc(var(--r1-fs)*.5);
    height:calc(var(--r1-fs)*.5);
  }
  .r2 label .radio::before{
    width:calc(var(--r2-fs)*.5);
    height:calc(var(--r2-fs)*.5);
  }
  .r3 label .radio::before{
    width:calc(var(--r3-fs)*.5);
    height:calc(var(--r3-fs)*.5);
  }
  .r4 label .radio::before{
    width:calc(var(--r4-fs)*.5);
    height:calc(var(--r4-fs)*.5);
  }
  .r5 label .radio::before{
    width:calc(var(--r5-fs)*.5);
    height:calc(var(--r5-fs)*.5);
  }
  .r6 label .radio::before{
    width:calc(var(--r6-fs)*.5);
    height:calc(var(--r6-fs)*.5);
  }
`;