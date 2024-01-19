/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { css } from "./ui.js";

export const ARENA_STYLES = css`

header{
  position: fixed;
  min-width: 360px;
  left: 0px;
  width: 100%;
  top: 0px;
  z-index: 100;
  margin-top: 0px;
  padding-top: 0px;
  color: var(--hdr-color);
  background-color: var(--hdr-bg-color);
  box-shadow: var(--hdr-shadow);
}

      header .social-buttons{
        position: fixed;
        right: 0px;
        top:  calc(50% - 96px);
        z-index: 500;
        overflow: hidden;
      }

      header .social-buttons a{
        display: block;
      }

      header .social-buttons svg{
        width: 48px; height: 48px;
      }

      header .side-menu{
        display: block;
        position: fixed;
        z-index: 200;
        left: -500px;
        top: 0;
        width: 250px;
        height: 100vh;
        color: var(--menu-color);
        background: var(--menu-bg-color);
        opacity: var(--menu-opacity);
        transition: 0.75s;
        font-size: var(--menu-font-size);
        overflow: hidden;
        box-shadow: var(--menu-shadow);
      }

      header .side-menu_expanded{
        left: 0px;
        opacity: var(--menu-opacity);
      }

      header .side-menu .close-button{
        font-size: 1.8em;
        position: absolute;
        top: 6px;
        left: 6px;
        margin-top: -10px;
      }

      header .side-menu a{
        text-decoration:  none;
        color: inherit;
        transition: 0.3s;
      }
      header .side-menu a:hover{
        color: #d8d8d8;
      }

      header .side-menu ul{
        list-style: none;
        padding: 28px 24px 8px 48px;
      }

      header .side-menu li{
        padding: 8px;
      }

      header .menu{
        float: left;
        width: var(--menu-btn-width);
        height: 100%;
        display: block;
        background: var(--menu-btn-color);
      }

      header .menu svg{
        display: block;
        margin: 8px auto 8px auto;
        width: 30px;
        height: var(--hdr-item-height);

        stroke: var(--menu-svg-color);
        stroke-width: var(--menu-svg-stroke);
      }



      header .title{
        float: left;
        display: block;
        font-size: 1.6rem;
        padding: 6px 2px 0px 8px;
        color: #d8d8d8;
        letter-spacing:  -1.5px;
      }


      header .user{
        float: right;
        display: block;
        text-align: right;
        font-size: 0.9rem;
        padding: 20px 8px 0px 4px;
      }

/* ------------------- */

main{
  background-color: var(--paper);
  padding: 40px 16px 16px 16px;
  text-align: justify;
}

/* ------------------- */

footer{
  background-color: #606060;
  color: #aaa;
  padding: 10px;
}

      /*footer .bottom-menu{
      }*/

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
        list-style: none;
        padding: 28px 10px 10px 32px;
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
