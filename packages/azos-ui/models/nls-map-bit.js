
import { css, html } from "../ui.js";
import { Bit, ListBit } from "../bit.js";
import "../parts/text-field.js";
import { dflt } from "azos/strings";

/** Models an item in the Native Language Support Map - a mapping of names and descriptions per language ISO code */
export class NlsMapItem extends Bit {

  static styles = [ListBit.styles, css`
    .item{
      display: flex;
    }
    #tbIso{ min-width: 10ch; max-width: 10ch; }
    #tbName{ min-width: 12ch; width: 20%; }
    #tbDescription{ width: 80%; }
  `];

  _getSummaryData(){
    return {
      title: `${(this.tbIso?.value) ?? ""}: (${this.tbName?.value})`,
      subtitle: this.tbDescription?.value,
      commands: []
    };
  }

  renderDetailContent(){
    return html`
    <div class="item">
      <az-text scope="this"  id="tbIso"         name="iso" title="Iso Lang"  datatype="atom" isrequired status="info"></az-text>
      <az-text scope="this"  id="tbName"        name="n"   title="Name"          maxLength=25 isrequired></az-text>
      <az-text scope="this"  id="tbDescription" name="d"   title="Description"   maxLength=96 ></az-text>
    </div>
    `;
  }
}

window.customElements.define("az-nls-map-item", NlsMapItem);


/** Provides a Native Language Support Map, a dictionary of lang iso -> (name, description) pairs */
export class NlsMapBit extends ListBit {

  static styles = [ListBit.styles];

  makeOrMapElement(elmData, existingOnly = false){

    if (this.indexOf(elmData) >= 0) return elmData;
    const existing = this.find(el => el.tbIso?.value === elmData);

    if (existing) return existing;
    if (existingOnly) return null;

    const item = new NlsMapItem();
    item.rank = "small";
    item.noSummary = true;
    return item;
  }


  _getSummaryData(effectDisabled, effectMutable){
    const commands = effectMutable ? [this._cmdAdd, this._cmdRemove] : [];
    return {
      title: `${dflt(this.title, this.description, this.name, "")} (${this.count})`,
      subtitle: "Subtitle",
      commands: commands
    };
  }
}

window.customElements.define("az-nls-map-bit", NlsMapBit);

