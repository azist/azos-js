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

  unit("constructor()", function () {

    cs("pass-fail-equality", function () {
      let v1 = new EntityId(Atom.encode("sys"), Atom.encode("tp1"), Atom.ZERO, "address");
      let v2 = new EntityId(Atom.encode("sys"), Atom.encode("tp2"), Atom.ZERO, "address");
      let v3 = new EntityId(Atom.encode("sys"), Atom.encode("tp1"), Atom.ZERO, "address2");
      let v4 = new EntityId(Atom.encode("sYs"), Atom.encode("tp1"), Atom.ZERO, "address");
      let v5 = new EntityId(Atom.encode("sys"), Atom.encode("tp1"), Atom.ZERO, "address");

      let v6 = new EntityId(Atom.encode("sys"), Atom.ZERO, Atom.ZERO, "address");
      let v7 = new EntityId(Atom.encode("sys"), Atom.ZERO, Atom.ZERO, "address");
      let v8 = new EntityId(Atom.encode("sys"), Atom.ZERO, Atom.ZERO, "address-1");

      let v9 = new EntityId(Atom.encode("sys"), Atom.encode("tp1"), Atom.encode("sch1"), "address-1");
      let v10 = new EntityId(Atom.encode("sys"), Atom.encode("tp1"), Atom.encode("sch1"), "address-1");
      let v11 = new EntityId(Atom.encode("sys"), Atom.encode("tp1"), Atom.encode("sch2"), "address-1");

      aver.isTrue(v1.equals(v5));
      aver.isTrue(v5.equals(v1));
      aver.isFalse(v1.equals(v2));
      aver.isFalse(v1.equals(v3));
      aver.isFalse(v1.equals(v4));
      aver.isFalse(v4.equals(v5));

      aver.isTrue(v6.equals(v7));
      aver.isFalse(v7.equals(v8));

      aver.isTrue(v9.equals(v10));
      aver.isFalse(v9.equals(v11));
    });
  });

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

    cs("parse-00", function () {
      aver.isFalse(EntityId.tryParse(null).ok);
      aver.isFalse(EntityId.tryParse("").ok);
      aver.isFalse(EntityId.tryParse("               ").ok);
    });

    cs("parse-01", function () {
      const entityIdResponse = EntityId.tryParse("a@b::adr1");
      aver.isTrue(entityIdResponse.ok);
      aver.areEqual(entityIdResponse.value.type.value, "a");
      aver.areEqual(entityIdResponse.value.system.value, "b");
      aver.isTrue(entityIdResponse.value.schema.isZero);
      aver.areEqual(entityIdResponse.value.address, "adr1");
    });

    cs("parse-02", function () {
      const entityIdResponse = EntityId.tryParse("b::adr1");
      aver.isTrue(entityIdResponse.ok);
      aver.isTrue(entityIdResponse.value.type.isZero);
      aver.areEqual(entityIdResponse.value.system.value, "b");
      aver.areEqual(entityIdResponse.value.address, "adr1");
    });

    cs("parse-03", function () {
      const entityIdResponse = EntityId.tryParse("system01::@://long-address::-string");
      aver.isTrue(entityIdResponse.ok);
      aver.isTrue(entityIdResponse.value.type.isZero);
      aver.areEqual(entityIdResponse.value.system.value, "system01");
      aver.areEqual(entityIdResponse.value.address, "@://long-address::-string");
    });

    cs("parse-04", function () { aver.isFalse(EntityId.tryParse("::abc").ok); });
    cs("parse-05", function () { aver.isFalse(EntityId.tryParse("aa::").ok); });
    cs("parse-06", function () { aver.isFalse(EntityId.tryParse("bbb@aa::").ok); });
    cs("parse-07", function () { aver.isFalse(EntityId.tryParse("bbb@::").ok); });
    cs("parse-08", function () { aver.isFalse(EntityId.tryParse("aaa::             ").ok); });
    cs("parse-09", function () { aver.isFalse(EntityId.tryParse("         @aaa::gggg").ok); });
    cs("parse-10", function () { aver.isFalse(EntityId.tryParse("@").ok); });
    cs("parse-11", function () { aver.isFalse(EntityId.tryParse("a b@dd::aaa").ok); });
    cs("parse-12", function () { aver.isFalse(EntityId.tryParse("ab@d d::aaa").ok); });
    cs("parse-13", function () { aver.isFalse(EntityId.tryParse("ab@d*d::aaa").ok); });
    cs("parse-14", function () { aver.isFalse(EntityId.tryParse("ab@dd::                             ").ok); });
    cs("parse-15", function () { aver.isFalse(EntityId.tryParse("::").ok); });

    cs("parse-16", function () {
      const entityIdResponse = EntityId.tryParse("vendor.gdid@ecom::1234");
      aver.isTrue(entityIdResponse.ok);
      aver.areEqual(entityIdResponse.value.type.value, "vendor");
      aver.areEqual(entityIdResponse.value.schema.value, "gdid");
      aver.areEqual(entityIdResponse.value.system.value, "ecom");
      aver.areEqual(entityIdResponse.value.address, "1234");
    });

    cs("parse-17", function () {
      const entityIdResponse = EntityId.tryParse("vendor.@ecom::1234");
      aver.isTrue(entityIdResponse.ok);
      aver.areEqual(entityIdResponse.value.type.value, "vendor");
      aver.isTrue(entityIdResponse.value.schema.isZero);
      aver.areEqual(entityIdResponse.value.system.value, "ecom");
      aver.areEqual(entityIdResponse.value.address, "1234");
    });

    cs("parse-17_1", function () { aver.isFalse(EntityId.tryParse("vendor. @ecom::1234").ok); });
    cs("parse-18", function () { aver.isFalse(EntityId.tryParse("vendor.gdiddddddddddddddddddddddddddddd@ecom::1234").ok); });
    cs("parse-19", function () { aver.isFalse(EntityId.tryParse(".@ecom::1234").ok); });
    cs("parse-20", function () { aver.isFalse(EntityId.tryParse(" . @ecom::1234").ok); });
    cs("parse-21", function () { aver.isFalse(EntityId.tryParse(" . . @ecom::1234").ok); });
    cs("parse-22", function () { aver.isFalse(EntityId.tryParse(".gdid@ecom::1234").ok); });
    cs("parse-23", function () { aver.isFalse(EntityId.tryParse(" .gdid@ecom::1234").ok); });

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

    cs("pass-when-matches-original-parse-value-2", function () {
      const parseValue = VALID_ENTITY_URIS.EML_SCHEMA;
      const entityId = EntityId.parse(parseValue);

      aver.areEqual(entityId.toString(), parseValue);
    });

    cs("pass-when-matches-original-parse-value-3", function () {
      const parseValue = VALID_ENTITY_URIS.GDID_SCHEMA;
      const entityId = EntityId.parse(parseValue);

      aver.areEqual(entityId.toString(), parseValue);
    });

    cs("pass-when-matches-original-parse-value-4", function () {
      const parseValue = VALID_ENTITY_URIS.JSON_SCHEMA;
      const entityId = EntityId.parse(parseValue);

      aver.areEqual(entityId.toString(), parseValue);
    });
  });
});
