import {css} from '../../../../azos-js/packages/azos-ui/ui.js';
import * as color from './color-pallet.js';

/*****************************************************
 * This file contains styles for components.         *
 *                                                   *
 * What's included:                                  *
 * buttonStyles  *  colorStyles  *  customCheck      *
 * iconStyles    *  inputStyles  *  radioStyles      *
 * selectStyles  *  switchCheck                      *
 *                                                   *
 * NOTE: Colors are contained in color-pallet.js     *
******************************************************/

export const colorStyles=css`
    .bg_primary,.bg_secondary,.bg_success,.bg_danger,.bg_dark{
        color:${color.light};
    }
    .bg_warning,.bg_info,.bg_light{
        color:${color.dark};
    }
    .bg_primary{background-color:${color.primary};}
    .bg_secondary{background-color:${color.secondary};}
    .bg_success{background-color:${color.success};}
    .bg_danger{background-color:${color.danger};}
    .bg_warning{background-color:${color.warning};}
    .bg_info{background-color:${color.info};}
    .bg_light{background-color:${color.light};}
    .bg_dark{background-color:${color.dark};}
    
    .text_primary{color:${color.primary};}
    .text_secondary{color:${color.secondary};}
    .text_success{color:${color.success};}
    .text_danger{color:${color.danger};}
    .text_warning{color:${color.warning};}
    .text_info{color:${color.info};}
    .text_light{color:${color.light};}
    .text_dark{color:${color.dark};}
    
    .border_primary{
        border:1px solid ${color.primary};
        color:${color.primary};
    }
    .border_secondary{
        border:1px solid ${color.secondary};
        color:${color.secondary};
    }
    .border_success{
        border:1px solid ${color.success};
        color:${color.success};
    }
    .border_danger{
        border:1px solid ${color.danger};
        color:${color.danger};
    }
    .border_warning{
        border:1px solid ${color.warning};
        color:${color.warning};
    }
    .border_info{
        border:1px solid ${color.info};
        color:${color.info};
    }
    .border_light{
        border:1px solid ${color.light};
        color:${color.light};
    }
    .border_dark{
        border:1px solid ${color.dark};
        color:${color.dark};
    }
`;

export const buttonStyles=css`
    button{
        cursor:pointer;
        padding:10px 20px;
        border-radius:5px;
        filter: brightness(1);
        font-size:1em;
        margin:10px;
    }
    button:hover{ filter:brightness(1.15); }

    button.text_primary{border:1px solid ${color.primary};}
    button.text_secondary{border:1px solid ${color.secondary};}
    button.text_success{border:1px solid ${color.success};}
    button.text_danger{border:1px solid ${color.danger};}
    button.text_warning{border:1px solid ${color.warning};}
    button.text_info{border:1px solid ${color.info};}
    button.text_light{border:1px solid ${color.light};}
    button.text_dark{border:1px solid ${color.dark};}

    button.bg_primary,button.bg_secondary,button.bg_success,button.bg_danger,button.bg_dark{
        border:1px solid ${color.light};
    }
    button.bg_warning,button.bg_info,button.bg_light{
        border:1px solid ${color.dark};
    }

    .half_width{
        display:block;
        width:50%;
    }
    .full_width{
        display:block;
        width:100%;
    }
`;

export const customCheck=css`
    div{
        display:block;
        margin:10px;
    }
    label{
        cursor:pointer;
        padding:5px;
        display:grid;
        grid-template-columns: 1em auto;
    }
    label:has(.customCheck){ gap:.75em; }
    label:has(.customCheck):hover,label:has(.customCheck):focus,.customCheck:hover,.customCheck:focus{box-shadow:0 0 3px ${color.primary};}
    .customCheck{
        cursor:pointer;
        margin:0;
        width:1.25em;
        height:1.25em;
        appearance:none;
        background-color:${color.light};
        border:.1em solid ${color.dark};
        border-radius:.2em;
        display:grid;
        place-content:center;
    }
    .customCheck::before{
        content:"";
        width:1.6em;
        height:1.6em;
        clip-path:polygon(22% 48%, 36% 81%, 80% 0, 100% 21%, 37% 100%, 0 58%);
        transform:scale(0);
        transform-origin:center center;
        transition:.1s transform ease-in-out;
        box-shadow:inset 1em 1em ${color.dark};
    }
    .customCheck:checked::before{ transform:scale(.75); }
    /*.customCheck:indeterminate::before{
        content:"";
        width:1.6em;
        height:1.6em;
        clip-path:polygon(26% 32%, 73% 31%, 100% 50%, 74% 67%, 26% 67%, 0 50%);
        transform:scale(1);
        transform-origin:center center;
        transition:.15s transform ease-in-out;
        box-shadow:inset 1em 1em currentColor;
    }*/
    .text_primary .customCheck,.bg_primary .customCheck,.border_primary .customCheck{border:1px solid ${color.primary};}
    .text_primary .customCheck::before,.bg_primary .customCheck::before,.border_primary .customCheck::before{box-shadow:inset 1em 1em ${color.primary};}
    .text_secondary .customCheck,.bg_secondary .customCheck,.border_secondary .customCheck{border:1px solid ${color.primary};}
    .text_secondary .customCheck::before,.bg_secondary .customCheck::before,.border_secondary .customCheck::before{box-shadow:inset 1em 1em ${color.primary};}
    .text_success .customCheck,.bg_success .customCheck,.border_success .customCheck{border:1px solid ${color.success};}
    .text_success .customCheck::before,.bg_success .customCheck::before,.border_success .customCheck::before{box-shadow:inset 1em 1em ${color.success};}
    .text_danger .customCheck,.bg_danger .customCheck,.border_danger .customCheck{border:1px solid ${color.danger};}
    .text_danger .customCheck::before,.bg_danger .customCheck::before,.border_danger .customCheck::before{box-shadow:inset 1em 1em ${color.danger};}
    .text_warning .customCheck,.bg_warning .customCheck,.border_warning .customCheck{border:1px solid ${color.warning};}
    .text_warning .customCheck::before,.bg_warning .customCheck::before,.border_warning .customCheck::before{box-shadow:inset 1em 1em ${color.warning};}
    .text_info .customCheck,.bg_info .customCheck,.border_info .customCheck{border:1px solid ${color.info};}
    .text_info .customCheck::before,.bg_info .customCheck::before,.border_info .customCheck::before{box-shadow:inset 1em 1em ${color.info};}
    .text_light .customCheck,.bg_light .customCheck,.border_light .customCheck{border:1px solid ${color.light};}
    .text_light .customCheck::before,.bg_light .customCheck::before,.border_light .customCheck::before{box-shadow:inset 1em 1em ${color.light};}
    .text_dark .customCheck,.bg_dark .customCheck,.border_dark .customCheck{border:1px solid ${color.dark};}
    .text_dark .customCheck::before,.bg_dark .customCheck::before,.border_dark .customCheck::before{box-shadow:inset 1em 1em ${color.dark};}
`;

export const radioStyles=css`
    div{
        display:block;
        margin:10px;
    }
    label{
        cursor:pointer;
        padding:5px;
        display:grid;
        grid-template-columns: 1em auto;
        gap:.75em;
    }
    label:has(.radio):hover,.radio:hover,label:has(.radio):focus,.radio:focus{box-shadow:0 0 5px ${color.primary};}
    .radio{
        cursor:pointer;
        appearance:none;
        margin:0;
        width:1.25em;
        height:1.25em;
        background-color:${color.light};
        border-radius:50%;
        display:grid;
        place-content:center;
    }
    .radio::before{
        content:'';
        width:1.6em;
        height:1.6em;
        transform:scale(0);
        border-radius:50%;
        transform-origin:center center;
        transition:.1s transform ease-in-out;
    }
    .radio:checked::before{ transform:scale(.4); }

    .text_primary .radio,.bg_primary .radio,.border_primary .radio{border:1px solid ${color.primary};}
    .text_primary .radio::before,.bg_primary .radio::before,.border_primary .radio::before{box-shadow:inset 1em 1em ${color.primary};}
    .text_secondary .radio,.bg_secondary .radio,.border_secondary .radio{border:1px solid ${color.primary};}
    .text_secondary .radio::before,.bg_secondary .radio::before,.border_secondary .radio::before{box-shadow:inset 1em 1em ${color.primary};}
    .text_success .radio,.bg_success .radio,.border_success .radio{border:1px solid ${color.success};}
    .text_success .radio::before,.bg_success .radio::before,.border_success .radio::before{box-shadow:inset 1em 1em ${color.success};}
    .text_danger .radio,.bg_danger .radio,.border_danger .radio{border:1px solid ${color.danger};}
    .text_danger .radio::before,.bg_danger .radio::before,.border_danger .radio::before{box-shadow:inset 1em 1em ${color.danger};}
    .text_warning .radio,.bg_warning .radio,.border_warning .radio{border:1px solid ${color.warning};}
    .text_warning .radio::before,.bg_warning .radio::before,.border_warning .radio::before{box-shadow:inset 1em 1em ${color.warning};}
    .text_info .radio,.bg_info .radio,.border_info .radio{border:1px solid ${color.info};}
    .text_info .radio::before,.bg_info .radio::before,.border_info .radio::before{box-shadow:inset 1em 1em ${color.info};}
    .text_light .radio,.bg_light .radio,.border_light .radio{border:1px solid ${color.light};}
    .text_light .radio::before,.bg_light .radio::before,.border_light .radio::before{box-shadow:inset 1em 1em ${color.light};}
    .text_dark .radio,.bg_dark .radio,.border_dark .radio{border:1px solid ${color.dark};}
    .text_dark .radio::before,.bg_dark .radio::before,.border_dark .radio::before{box-shadow:inset 1em 1em ${color.dark};}
`;

export const switchCheck=css`
    label:has(.switch){ gap:2em; }
    .switch{
        cursor:pointer;
        appearance:none;
        position:relative;
        color:inherit;
        font-size:inherit;
        box-sizing:content-box;
        border:1px solid currentColor;
        border-radius:1em;
        vertical-align:middle;
        background: currentColor;
        transition:.2 all ease;
        width:2em;
        height:1em;
    }
    label:has(.switch):hover,label:has(.switch):focus,.switch:hover,.switch:focus{box-shadow:0 0 5px ${color.primary};}
    .switch:checked,.bg_danger .switch:checked,.bg_success .switch:checked,.bg_warning .switch:checked,.bg_info .switch:checked,.bg_primary .switch:checked,.bg_secondary .switch:checked,.bg_dark .switch:checked,.bg_light .switch:checked{ background: ${color.light}; }
    .switch::before{
        content:"";
        position:absolute;
        box-sizing:border-box;
        width:.75em;
        height:.75em;
        border:none;
        border-radius:50%;
        background-color: ${color.light};
        transition:.2s all ease;
        top:50%;
        left:0;
        transform:translate(0,-50%);
        margin:0 .15em;
    }
    .switch:checked::before{
        background-color:currentColor;
        left:1em;
    }
    .bg_danger .switch{background:${color.danger}}
    .bg_success .switch{background:${color.success}}
    .bg_info .switch{background:${color.info}}
    .bg_warning .switch{background:${color.warning}}
    .bg_primary .switch{background:${color.primary}}
    .bg_secondary .switch{background:${color.secondary}}
    .bg_light .switch{background:${color.light}}
    .bg_dark .switch{background:${color.dark}}

    .bg_danger .switch:checked::before{background-color:${color.danger}}
    .bg_success .switch:checked::before{background-color:${color.success}}
    .bg_info .switch:checked::before{background-color:${color.info}}
    .bg_warning .switch:checked::before{background-color:${color.warning}}
    .bg_primary .switch:checked::before{background-color:${color.primary}}
    .bg_secondary .switch:checked::before{background-color:${color.secondary}}
    .bg_light .switch:checked::before{background-color:${color.light}}
    .bg_dark .switch:checked::before{background-color:${color.dark}}
`;

export const inputStyles=css`
    div{display:block;padding:5px;}
    input[type=text],input[type=password],textarea{
        border:1px solid currentColor;
        border-radius:5px;
        padding:5px;
        width:80%;
        background:${color.light};
        color:${color.dark};
        filter:brightness(1);
        margin-bottom:10px;
    }
    input[type=text]:read-only,input[type=password]:read-only,textarea:read-only{
        filter:brightness(.85)
    }
    input[type=text]:disabled,input[type=password]:disabled,textarea:disabled{
        color:${color.light};
        background:${color.dark};
    }
    label:has(+input[type=text]),label:has(+input[type=password]),label:has(+textarea){
        display:block;
        margin-bottom:10px; margin-top:10px;
    }
    label:has(+input[type=text]:required),label:has(+input[type=password]:required),label:has(+textarea:required){
        font-weight:bold;
    }
    input[type=text]:focus,input[type=password]:focus,textarea:focus,
    input[type=text]:hover,input[type=password]:hover,textarea:hover{
        box-shadow:0 0 5px ${color.primary};
    }
    .text_primary input,.text_primary textarea{border:1px solid ${color.primary};}
    .text_secondary input,.text_secondary textarea{border:1px solid ${color.secondary};}
    .text_info input,.text_info textarea{border:1px solid ${color.info};}
    .text_success input,.text_success textarea{border:1px solid ${color.success};}
    .text_warning input,.text_warning textarea{border:1px solid ${color.warning};}
    .text_danger input,.text_danger textarea{border:1px solid ${color.danger};}
    .text_light input,.text_light textarea{border:1px solid ${color.light};}
    .text_dark input,.text_dark textarea{border:1px solid ${color.dark};}
`;

export const selectStyles=css`
    label:has(+select){
        display:block;
        margin-bottom:10px; margin-top:10px;
    }
    select{
        border:1px solid currentColor;
        border-radius:5px;
        padding:5px;
        background:${color.light};
        color:currentColor;
        filter:brightness(1);
        width:100%;
        margin-bottom:10px;
    }
    select:disabled{
        color:${color.light};
        background:${color.dark};
    }
`;

export const iconStyles=css`
    .icon{
        width:1.25em;
        height:1.25em;
        float:left;
        margin-right:.75em;
    }
    .icon:has(+label){margin-top:.5em; margin-left:.75em; margin-right:.25em;}
    .fill_info{fill:${color.info};}
    .fill_warning{fill:${color.warning};}
    .fill_danger{fill:${color.danger};}
    .fill_success{fill:${color.success};}
    .fill_light{fill:${color.light};}
    .fill_dark{fill:${color.dark};}

    .bg_success .fill_success{fill:${color.light};}
    .bg_info .fill_info,.bg_warning .fill_warning,.bg_danger .fill_danger{fill:${color.dark};}
`;