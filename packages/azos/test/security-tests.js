/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as describe, defineCase as it } from "../run.js";
import * as sut from "../security.js";
import * as aver from "../aver.js";

describe("Security", function() {
  describe("#parseJwtToken()", function() {
    it("parseSample1", function(){
      /*
      {
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
   }*/
      const got = sut.parseJwtToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
      console.dir(got);

      aver.areEqual("1234567890", got.sub);
      aver.areEqual("John Doe", got.name);
      aver.areEqual(1516239022, got.iat);

    });
  });
});
