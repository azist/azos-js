/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { css } from "./ui.js";

export const ARENA_STYLES = css`
header{
  position: fixed;
  min-width: var(--arn-min-width);
  left: 0px;
  width: 100%;
  height: var(--arn-hdr-height);
  top: 0px;
  z-index: 100;
  margin-top: 0px;
  padding-top: 0px;
  color: var(--arn-hdr-color);
  background-color: var(--arn-hdr-bg-color);
  box-shadow: var(--arn-hdr-shadow);
}
      header .side-menu{
        display: block;
        position: fixed;
        z-index: 1200;
        left: var(--arn-mnu-left);
        top: 0;
        width: var(--arn-mnu-width);
        height: 100vh;
        color: var(--arn-mnu-color);
        background: var(--arn-mnu-bg);
        opacity: var(--arn-mnu-opacity);
        transition:var(--arn-mnu-transition);
        font-size: var(--arn-mnu-font-size);
        overflow: hidden;
        box-shadow: var(--arn-mnu-shadow);
      }

      header .side-menu_expanded{
        left: 0px;
        opacity: var(--arn-mnu-opacity);
      }

      header .side-menu .close-button{
        font-size: var(--arn-mnu-close-font-size);
        position: absolute;
        top: var(--arn-mnu-close-top);
        left: var(--arn-mnu-close-left);
        margin-top: var(--arn-mnu-close-margin-top);
      }

      header .side-menu a{
        text-decoration:  none;
        color: inherit;
        transition: 0.3s;
      }
      header .side-menu a:hover{
       color: var(--arn-mnu-hover-color);
      }

      header .side-menu ul{
        list-style: none;
        padding: var(--arn-mnu-ul-padding);
      }

      header .side-menu li{
        padding: var(--arn-mnu-li-padding);
      }

      header .menu{
        float: left;
        width: var(--arn-mnu-btn-width);
        height: 100%;
        display: block;
        background: var(--arn-mnu-btn-color);
      }

      header .menu svg{
        display: block;
        margin: var(--arn-mnu-svg-margin);
        width: var(--arn-mnu-svg-width);
        height: var(--arn-mnu-svg-height);

        stroke: var(--arn-mnu-svg-stroke);
        stroke-width: var(--arn-mnu-svg-stroke-width);
      }

      header .title{
        position: absolute;
        left: var(--arn-mnu-btn-width);
        top: 0px;
        display: block;
        font-size: var(--arn-title-font-size);
        padding: var(--arn-title-padding);
        color: var(--arn-title-color);
        letter-spacing:  var(--arn-title-letter-spacing);
        height: 1lh;
        overflow: hidden;
      }

      header .strip{
        position: absolute;
        top: 0px;
        right: 0px;
        display: flex;
        flex-direction: row-reverse;
        flex-wrap: nowrap;
        height: 100%;
        background: linear-gradient(to right, rgba(100,100,100, 0.0), var(--arn-hdr-bg-color) 15%);
        padding-left: 20px;
      }

      header .strip-btn{
        display: inline-block;
        font-size: var(--arn-strip-font-size);
        text-align: center;
        width: auto;
        min-width: var(--arn-strip-min-width);
        max-width:  var(--arn-strip-max-width);
        margin: var(--arn-strip-margin);
        color: var(--arn-strip-color);
        padding: var(--arn-strip-padding);
        overflow: hidden;
        stroke: var(--arn-strip-svg-stroke);
        stroke-width: var(--arn-strip-svg-stroke-width);
        fill: none;
        stroke-linecap: round;
      }

      header .strip-btn:hover{
        background-color: rgba(255, 255, 255, 0.1);
      }

/* ------------------- */

main{
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
  color: var(--ink);
  background: var(--paper);
  min-width: var(--arn-min-width);
}

main::after {
  content: "";
  clear: both;
  display: table;
}

main .applet-container{
  display: block;
  width: 100%; /* calc(100% - var(--menu-btn-width)); */
  min-height: 50vh;
  box-sizing: border-box;
  padding:  calc(var(--arn-hdr-height)) 0px 0px 0px;
  margin: 0px;
  text-align: left;
  overflow: auto;
}

main .applet-container.kiosk{
  padding: unset;
  min-height: unset;
}

/* ------------------- */

footer{
  background-color: #606060;
  color: #aaa;
  padding: 10px;
  min-width: var(--arn-min-width);
  box-sizing: border-box;
}

      footer .bottom-menu a{
        text-decoration:  none;
        color: #a8a8a0;
        transition: 0.3s;
        font-size: 1.1em;
      }
      footer .bottom-menu a:hover{
        color: #e8e8d8;
      }

      footer .bottom-menu ul{
        margin: 0px;
        list-style: none;
      }

      footer .bottom-menu li{
        padding: 2px;
      }

      footer .contact{
        position: relative;
        top: -3em;
        text-align: right;
        font-size: 0.75em;
        opacity: 0.5;
      }

      footer .contact .line{
        display: block;
      }
`;
