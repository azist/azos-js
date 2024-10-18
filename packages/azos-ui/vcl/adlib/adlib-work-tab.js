import { CLOSE_QUERY_METHOD, DIRTY_PROP } from "azos/types";
import { Tab } from "../tabs/tab";
import { prompt } from "./ok-cancel-modal";


export class AdlibWorkTab extends Tab {

  #dirty = Math.random() < 0.5;
  get [DIRTY_PROP]() { return this.#dirty; }

  async [CLOSE_QUERY_METHOD]() {
    if (this[DIRTY_PROP]) return await prompt("Are you sure?");
    return true;
  }

  constructor() { super(); }

}
