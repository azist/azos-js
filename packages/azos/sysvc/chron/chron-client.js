/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/
import { IClient } from "../../client.js";
import { isObject } from "../../aver.js";

/** Provides functionality  for consuming Sky.Chronicle services*/
export class ChronicleClient extends IClient{
  constructor(dir, cfg){
    super(dir, cfg);
  }

  /** Gets a list of Chronicle log messages for the supplied filter */
  async getLogList(filter){
    isObject(filter);
    const got = await this.post("filter", filter);
    return got;
  }


}
