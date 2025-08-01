/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/


import { css, html, UiInputValue } from "../ui.js";
import { Bit, ListBit } from "../bit.js";
import { STL_INLINE_GRID } from "../styles";
import { dflt, dfltObject, isEmpty } from "azos/strings";
import { EntityId } from "azos/entity-id";
import { Atom } from "azos/atom";
import { asAtom, DATA_VALUE_PROP, isArray } from "azos/types";

//#region EntityIdBit
export class EntityIdBit extends Bit {
  static styles = [...Bit.styles, STL_INLINE_GRID, css`
    .item {
      display: flex;
    }
    #tbAddress { width: 80%; }
    #tbtype, #tbSchema, #tbSystem { 
      min-width: 10ch;
      max-width: 10ch;
    }
    `];

  asEntityId() {
    let type =    this.tbType?.value;
    let schema =  this.tbSchema?.value;
    let system =  this.tbSystem?.value;
    let address = dflt(this.tbAddress?.value, "");
    let entityId =  "";

    if (isEmpty(address)) { return EntityId.Empty;}
    if (system === undefined || !system["isValid"]) { return EntityId.Empty; }
    
    if (type !== undefined && type["isValid"] && !type["isZero"]) {
      type = asAtom(type["value"]);
    }
    if (schema !== undefined && schema["isValid"] && !schema["isZero"]) {
      schema = asAtom(schema["value"]);
    }
    if (system["isValid"]) {
      system = asAtom(system["value"]);
    }
    entityId += address;

    return new EntityId(system, type, schema, address);
  }

  _getSummaryData() {
    const entityId = this.asEntityId();

    return {
      title: dflt(entityId?.toString(), "INVALID ENTITY ID"),
    }
  }

  renderDetailContent() {
    return html`
    <div class="item">
    <az-text scope="this" id="tbType"     name="type"     title="Type"    datatype="atom" status="info"></az-text>
    <az-text scope="this" id="tbSchema"   name="schema"   title="Schema"  datatype="atom" status="info"></az-text>
    <az-text scope="this" id="tbSystem"   name="system"   title="System"  datatype="atom" isrequired status="info"></az-text>
    <az-text scope="this" id="tbAddress"  name="address"  title="Address" minLength="1"   isrequired status="info"></az-text>
    </div>`;
  }

  get [DATA_VALUE_PROP]() {
    return this.asEntityId();
  }

  set [DATA_VALUE_PROP](v) {
    if (v) {
      let isUiInput = false;
      if (v instanceof UiInputValue) {
        isUiInput = true;
        v = v.value;
      }
      if (!isArray(v)){
        let result = {};
        let e = EntityId.tryParse(v);
        if (e.ok) {
          result = {
            type: e.value?.type,
            schema: e.value?.schema,
            system: e.value?.system,
            address: e.value?.address
          }
        }
        v = isUiInput ? new UiInputValue(result) : result;
      }
    }

    super[DATA_VALUE_PROP] = v;

    queueMicrotask(async () => {await this.updateComplete; this.requestUpdate();});
  }
}

window.customElements.define("az-entity-id-bit", EntityIdBit);
//#endregion

//#region EntityIdBitList
export class EntityIdBitList extends ListBit {
  static styles = [ListBit.styles];

  makeOrMapElement(elmData, existingOnly = false) {
    if (this.indexOf(elmData) >= 0) return elmData;
    const existing = this.find(el => el?.asEntityId() === new EntityId(elmData));

    if (existing) return existing;
    if (existingOnly) return null;

    const item = new EntityIdBit();
    item.rank = "medium";
    item.noSummary = true;
    return item;
  }

  _getSummaryData(effectDisabled, effectMutable) {
    const command = effectMutable ? [this._cmdAdd, this._cmdRemove] : [];
    const first = this.find(() => true);
    const subtitle = dflt(first?.getEntityId()?.toString(), "");

    return {
      title: `${dflt(this.title, this.description, this.name, "")} (${this.count})`,
      subtitle: subtitle,
      commands: command,
    }
  }
}

window.customElements.define("az-entity-id-bit-list", EntityIdBitList);
//#endregion