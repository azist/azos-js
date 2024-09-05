/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { defineUnit as unit, defineCase as cs } from "../run.js";
import * as aver from "../aver.js";
import { Atom } from "../atom.js";
import { EntityId } from "../entity-id.js";

// eslint-disable-next-line no-unused-vars
const VALID_ENTITY_URIS = {
  MISSING_SCHEMA: "sku@g8prod::0:8:12345",
  MISSING_TYPE_SCHEMA: "g8prod::0:8:12345",
  EML_SCHEMA: "cust.eml@g8cust::kevin@example.com",
  GDID_SCHEMA: "cust.gdid@g8cust::0:8:12345",
  JSON_SCHEMA: 'cust.json@g8cust::{"ok": true}',
};

unit("EntityId", function () {

  unit(".parse()", function () {

    cs("pass-eml-schema", function () {
      const entityId = EntityId.parse(VALID_ENTITY_URIS.EML_SCHEMA);

      const expectedSystem = Atom.encode("g8cust");
      const expectedType = Atom.encode("cust");
      const expectedSchema = Atom.encode("eml");
      const expectedAddress = "kevin@example.com";

      aver.areEqualValues(entityId.system, expectedSystem);
      aver.areEqualValues(entityId.type, expectedType);
      aver.areEqualValues(entityId.schema, expectedSchema);
      aver.areEqualValues(entityId.address, expectedAddress);
    });

    cs("pass-default-schema", function () {
      const entityId = EntityId.parse(VALID_ENTITY_URIS.MISSING_SCHEMA);

      const expectedSystem = Atom.encode("g8prod");
      const expectedType = Atom.encode("sku");
      const expectedSchema = Atom.ZERO;
      const expectedAddress = "0:8:12345";

      aver.areEqualValues(entityId.system, expectedSystem);
      aver.areEqualValues(entityId.type, expectedType);
      aver.areEqualValues(entityId.schema, expectedSchema);
      aver.areEqualValues(entityId.address, expectedAddress);
    });

    cs("pass-gdid-schema", function () {
      const entityId = EntityId.parse(VALID_ENTITY_URIS.GDID_SCHEMA);

      const expectedSystem = Atom.encode("g8cust");
      const expectedType = Atom.encode("cust");
      const expectedSchema = Atom.encode("gdid");
      const expectedAddress = "0:8:12345";

      aver.areEqualValues(entityId.system, expectedSystem);
      aver.areEqualValues(entityId.type, expectedType);
      aver.areEqualValues(entityId.schema, expectedSchema);
      aver.areEqualValues(entityId.address, expectedAddress);
    });

    cs("pass-json-schema", function () {
      const entityId = EntityId.parse(VALID_ENTITY_URIS.JSON_SCHEMA);

      const expectedSystem = Atom.encode("g8cust");
      const expectedType = Atom.encode("cust");
      const expectedSchema = Atom.encode("json");
      const expectedAddress = '{"ok": true}';

      aver.areEqualValues(entityId.system, expectedSystem);
      aver.areEqualValues(entityId.type, expectedType);
      aver.areEqualValues(entityId.schema, expectedSchema);
      aver.areEqualValues(entityId.address, expectedAddress);
      aver.isTrue(entityId.isCompositeAddress);
      aver.isTrue(entityId.compositeAddress.ok);
    });
  });

  unit(".tryParse()", function () {

    cs("pass-eml-schema", function () {
      const entityIdResponse = EntityId.tryParse(VALID_ENTITY_URIS.EML_SCHEMA);

      const expectedSystem = Atom.encode("g8cust");
      const expectedType = Atom.encode("cust");
      const expectedSchema = Atom.encode("eml");
      const expectedAddress = "kevin@example.com";

      aver.isTrue(entityIdResponse.ok);
      aver.areEqualValues(entityIdResponse.value.system, expectedSystem);
      aver.areEqualValues(entityIdResponse.value.type, expectedType);
      aver.areEqualValues(entityIdResponse.value.schema, expectedSchema);
      aver.areEqualValues(entityIdResponse.value.address, expectedAddress);
    });

    cs("pass-default-schema", function () {
      const entityIdResponse = EntityId.tryParse(VALID_ENTITY_URIS.MISSING_SCHEMA);

      const expectedSystem = Atom.encode("g8prod");
      const expectedType = Atom.encode("sku");
      const expectedSchema = Atom.ZERO;
      const expectedAddress = "0:8:12345";

      aver.isTrue(entityIdResponse.ok);
      aver.areEqualValues(entityIdResponse.value.system, expectedSystem);
      aver.areEqualValues(entityIdResponse.value.type, expectedType);
      aver.areEqualValues(entityIdResponse.value.schema, expectedSchema);
      aver.areEqualValues(entityIdResponse.value.address, expectedAddress);
    });

    cs("pass-gdid-schema", function () {
      const entityIdResponse = EntityId.tryParse(VALID_ENTITY_URIS.GDID_SCHEMA);

      const expectedSystem = Atom.encode("g8cust");
      const expectedType = Atom.encode("cust");
      const expectedSchema = Atom.encode("gdid");
      const expectedAddress = "0:8:12345";

      aver.isTrue(entityIdResponse.ok);
      aver.areEqualValues(entityIdResponse.value.system, expectedSystem);
      aver.areEqualValues(entityIdResponse.value.type, expectedType);
      aver.areEqualValues(entityIdResponse.value.schema, expectedSchema);
      aver.areEqualValues(entityIdResponse.value.address, expectedAddress);
    });

    cs("pass-json-schema", function () {
      const entityIdResponse = EntityId.tryParse(VALID_ENTITY_URIS.JSON_SCHEMA);

      const expectedSystem = Atom.encode("g8cust");
      const expectedType = Atom.encode("cust");
      const expectedSchema = Atom.encode("json");
      const expectedAddress = '{"ok": true}';

      aver.isTrue(entityIdResponse.ok);
      aver.areEqualValues(entityIdResponse.value.system, expectedSystem);
      aver.areEqualValues(entityIdResponse.value.type, expectedType);
      aver.areEqualValues(entityIdResponse.value.schema, expectedSchema);
      aver.areEqualValues(entityIdResponse.value.address, expectedAddress);
      aver.isTrue(entityIdResponse.value.isCompositeAddress);
      aver.isTrue(entityIdResponse.value.compositeAddress.ok);
    });
  });

  unit(".isEqual()", function () {

    cs("pass-when-equal", function () {
      const a = EntityId.parse(VALID_ENTITY_URIS.MISSING_SCHEMA);
      const b = EntityId.parse(VALID_ENTITY_URIS.MISSING_SCHEMA);

      aver.isTrue(a.equals(b));
    });
  });

  unit(".compareTo()", function () {

    cs("pass-when-sorted", function () {
      const one = EntityId.parse(VALID_ENTITY_URIS.MISSING_SCHEMA);
      const two = EntityId.parse(VALID_ENTITY_URIS.EML_SCHEMA);
      const three = EntityId.parse(VALID_ENTITY_URIS.JSON_SCHEMA);
      const unsorted = [three, two, one];

      const sorted = unsorted.slice().sort((a, b) => a.compareTo(b));

      aver.areArraysNotEquivalent(unsorted, sorted);
      aver.areEqual(sorted.indexOf(one), 0);
      aver.areEqual(sorted.indexOf(two), 1);
      aver.areEqual(sorted.indexOf(three), 2);
    });
  });

  unit(".toString()", function () {

    cs("pass-when-matches-original-parse-value-type-is-0", function () {
      const parseValue = VALID_ENTITY_URIS.MISSING_SCHEMA;
      const entityId = EntityId.parse(parseValue);

      aver.areEqual(entityId.toString(), parseValue);
    });

    cs("pass-when-matches-original-parse-value-schema-is-0", function () {
      const parseValue = VALID_ENTITY_URIS.MISSING_TYPE_SCHEMA;
      const entityId = EntityId.parse(parseValue);

      aver.areEqual(entityId.toString(), parseValue);
    });

    cs("pass-when-matches-original-parse-value2", function () {
      const parseValue = VALID_ENTITY_URIS.EML_SCHEMA;
      const entityId = EntityId.parse(parseValue);

      aver.areEqual(entityId.toString(), parseValue);
    });

    cs("pass-when-matches-original-parse-value3", function () {
      const parseValue = VALID_ENTITY_URIS.GDID_SCHEMA;
      const entityId = EntityId.parse(parseValue);

      aver.areEqual(entityId.toString(), parseValue);
    });

    cs("pass-when-matches-original-parse-value4", function () {
      const parseValue = VALID_ENTITY_URIS.JSON_SCHEMA;
      const entityId = EntityId.parse(parseValue);

      aver.areEqual(entityId.toString(), parseValue);
    });
  });
});
