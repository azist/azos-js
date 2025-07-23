/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/
import { html, css } from "../../ui";
import { CaseBase } from "./case-base";

import "../../bit.js";
import "../../parts/button.js";
import "../../vcl/util/code-box.js";

export class CaseBitCells extends CaseBase {

  static styles = [...this.styles, css`
.composite {
  margin: 1em;
  gap: 0.5em;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

az-bit{
 width: 18ch;
 transition: 1s;
}

az-bit:not([isexpanded]){
 transition-delay: .25s;
}

XXXaz-bit[isexpanded]{ width: 25ch; }
az-bit.wide[isexpanded]{ width: 75%; }

  `];


  renderControl() {
    return html`

    <h2>Bit Cells</h2>

    This example demonstrates a composite pattern which uses bits as "cells" of a grid

    <div class="composite">

      <az-bit title="Item 01" rank="medium">
        Bit content 1
      </az-bit>

      <az-bit title="Item 02" rank="medium" status="warning" class="wide" group="hogs">
       <p> Bit content 2 which takes significantly more space to display. </p>

        <az-code-box highlight="js" source="">
//this is my json object
{
  "a": 1, "b": 2, "c": true,
  d: ["string1", null, true, false, {"name": "string2", "salary": 100.67}],
  "c": "string message",
  "d": [{"a": -123.032, "b": +45}, false, null, null, "ok"]
}
        </az-code-box>


      </az-bit>

      <az-bit title="Item 03" rank="medium" status="warning" class="wide" group="hogs">
      <p> Furariy ipsum dolor sit amet, consectetur adipiscing elit. Furariy sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Furariy.</p>

      <az-code-box highlight="js" source="">
//Example of a person
//who supports Jeff Scmotzhermangh
{ "FirstName": "Jeremy", "LastName":  "Toad", "RegisteredToVote": true, "Married": false  }
        </az-code-box>
      </az-bit>

       <az-bit title="Item 04" rank="medium">
        Bit content 1
      </az-bit>

      <az-bit title="Item 05" rank="medium" status="info" group="blueAngels">
        Bit content 5 - five of five is fiver than five
      </az-bit>

      <az-bit title="Item 06" rank="medium" status="info" group="blueAngels">
        Bit content 6 - six is a blessed number
      </az-bit>

       <az-bit title="Item 07" rank="medium" status="info" group="blueAngels">
        Bit content 7 - measure seven times - <br> but only cut once!
      </az-bit>

       <az-bit title="Item 08" rank="medium">
        Bit content 8 relatives of Debbie
      </az-bit>


      <az-bit title="Title Two" rank="medium">
        Another bit content which <br> spans multiple lines?<br>
        Another one rides the bus!
      </az-bit>

      <az-button title="Add"></az-button

    </div>
    `;
  }
}

window.customElements.define("az-case-bit-cells", CaseBitCells);
