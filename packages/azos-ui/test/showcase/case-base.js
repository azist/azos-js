/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Block } from "../../blocks";
import { css } from "../../ui";

export class CaseBase extends Block {

  static styles = [Block.styles, css`
:host{ padding: 1ch 2ch; }
.strip-h{ display:flex;flex-wrap:wrap;align-items:center;margin-bottom:0.5em;gap:1ch; }
@media only screen and (max-width: 700px) {:host {padding:0;}}
  `];


}
