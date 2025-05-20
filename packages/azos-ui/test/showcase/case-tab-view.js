/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { css, html } from "../../ui";
import { CaseBase } from "./case-base";

import "../../vcl/tabs/tab";

export class CaseTabView extends CaseBase {
  static styles = css`az-tab-view{ --vcl-tabview-svg-stroke: #336699; }`;
  renderControl() {
    return html`
<h2>Tab View</h2>

<az-tab-view title="Draggable TabView" activeTabIndex="3" isDraggable>
  <az-tab title="Users List" .canClose="${false}" icon="svg://azos.ico.user">Users List</az-tab>
  <az-tab title="User Groups" .canClose="${false}" icon="svg://azos.ico.userGroup">User Groups</az-tab>
  <az-tab title="User Admins" .canClose="${false}" icon="svg://azos.ico.userSupervisor">User Admins</az-tab>
  <az-tab title="Tab 4"><az-text id="testValue" .value=${"This is the rhythm of the night"}></az-tab>
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
