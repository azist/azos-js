/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { IClient } from "../../client.js";
import { isObject } from "../../aver.js";
import * as types from "../../types.js";
import { isString } from "../../types.js";

/** Provides functionality for consuming Sky.Adlib services*/
export class AdlibClient extends IClient {
  constructor(dir, cfg) {
    super(dir, cfg);
  }

  async getSpaces() {
    const got = await this.get("spaces");
    return got; // {"data":["g8formf","g8mfgprj","g8lookup","g8sysdat","tezt"],"OK":true}
  }

  async getCollections(space) {
    isString(space); // isOf(space, Atom)
    const got = await this.get(`collections?space=${space}`);
    return got; // {"data":["corph"],"OK":true}
  }

  async getItems(filter) {
    isObject(filter);
    const got = await this.post("filter", filter);
    return got; // {"data":[{"Space":"g8sysdat","Collection":"svcapmap","Segment":2,"Gdid":"0:2:2","Id":"svcapmap.gi@g8sysdat::0:2:2","ShardTopic":null,"CreateUtc":"1725680819107","Origin":"devga","Headers":"","ContentType":"#0","Tags":[],"Content":"sdEEAQeq__8FVGl0bGUBqgD_CVNjaGVkdWxlcwGqAP8ETG9icwGqAgeq__8ETmFtZRH_Cy9oaS9zdW5yb29t_wlTY2hlZHVsZXMBqgD_CENvcnBSZWxzAaoCC_8HMDoxOjc5MOfwjPumjhz13KWjB-fIpaMGAP8GVGl0bGVfAaoA_wdUaXRsZV9fAaoA_whUaXRsZV9fXwGqAgeq__8Da2V5Ef8DZW5n_wV2YWx1ZQeq__8BbhH_CXVzYTo0NDIzNv8BZBH_EnVzYTo0NDIzNiBMb2NhbGl0eQAAAA"},{"Space":"g8sysdat","Collection":"svcapmap","Segment":1,"Gdid":"0:2:3","Id":"svcapmap.gi@g8sysdat::0:2:3","ShardTopic":null,"CreateUtc":"1725637650668","Origin":"devga","Headers":"","ContentType":"#0","Tags":[{"p":"pc","s":"usa:44236"}],"Content":"sdEEAQGqAgeq__8BZzAAAAAAIAAAAAAAAAL_A3V0YyoI3MoZBcvAAAAA"}],"OK":true}
  }

  async saveItem(item) {
    isObject(item);

    const method = types.isInsertForm(item) ? this.post : this.put;
    const got = await method("item", item);
    return got;
  }

  async deleteItem(id) {
    isString(id);
    const got = await this.delete(`item?id=${id}`);
    return got;
  }

  async deleteCollection(space, collectionId) {
    isString(space);
    isString(collectionId);

    const got = await this.delete(`collection?space=${space}&id=${collectionId}`);
    return got;
  }

}
