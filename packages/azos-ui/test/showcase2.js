/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { Control, html } from "../ui";

import "../vcl/tabs/tab-view";
import "./showcase/case-buttons";

/** Test element used as a showcase of various parts and form elements in action */
export class Showcase2 extends Control {


  render() {
    return html`
<az-tab-view>
  <az-tab title="Buttons"> <az-case-buttons> </az-case-buttons></az-tab>
</az-tab-view>
    `;
  }
}

window.customElements.define("az-showcase2", Showcase2);
