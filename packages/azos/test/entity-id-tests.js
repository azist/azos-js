/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import { UNIMPLEMENTED } from "../coreconsts.js";

// eslint-disable-next-line no-unused-vars
const VALID_ENTITY_IDS = {
  ONE: "cust.eml@g8cust::kevin@example.com",
  TWO: "sku@g8prod::0:8:12345", // default gdid
  THREE: "cust.gdid@g8cust::0:8:12345",
  FOUR: 'cust.json@g8cust::{"ok": true}',
};

unit("EntityId", function () {

  unit("", function () {
    cs("", function () {
      throw UNIMPLEMENTED("no tests");
    });
  });
});
