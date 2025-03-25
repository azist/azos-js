/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

import "../../vcl/tabs/tab";

export class CaseTabView extends CaseBase {
  renderControl() {
    return html`
<h2>Tab View</h2>

<az-tab-view title="Draggable TabView" activeTabIndex="5" isDraggable>
  <az-tab title="Tab 1">Tab 1 Content</az-tab>
  <az-tab title="Tab 2">Tab 2 Content</az-tab>
  <az-tab title="Tab 3">Tab 3 Content</az-tab>
  <az-tab title="Tab 4">Tab 4 Content</az-tab>
  <az-tab title="Tab 5">Tab 5 Content</az-tab>
  <az-tab title="Tab 6">Tab 6 Content</az-tab>
  <az-tab title="Tab 7">Tab 7 Content</az-tab>
  <az-tab title="Tab 8">Tab 8 Content</az-tab>
  <az-tab title="Tab 9">Tab 9 Content</az-tab>
  <az-tab title="Tab 10">Tab 10 Content</az-tab>
</az-tab-view>
    `;
  }
}

window.customElements.define("az-case-tab-view", CaseTabView);
