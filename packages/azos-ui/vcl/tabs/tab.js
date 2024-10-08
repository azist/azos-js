import { isOf } from "azos/aver";
import { TabView } from "./tab-view";
import { Block } from "../../block";
import { verbatimHtml } from "../../ui";

export class Tab extends Block {
  static properties = {
    selected: { type: Boolean },
  };

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    isOf(this.parentNode, TabView);
  }

  render() {
    return verbatimHtml(this.innerHTML);
  }
}
