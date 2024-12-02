import { html } from "../../ui";

/** Translates JSON object to readonly form fields */
export function JSONToForm(jsonObject) {
  let fields = '';
  const processObject = (obj, parentKey = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        fields += `
          <fieldset>
            <legend>${fullKey}</legend>
            ${processObject(value, fullKey)}
          </fieldset>`;
      } else if (typeof value === 'boolean') {
        fields += html`
          <az-check
            id="${key}"
            title="${key}"
            titlePosition="mid-right"
            value="${value}"
            isReadOnly
          ></az-check>`;
      } else {
        fields += html`
          <az-text
            id="${key}"
            title="${key}"
            value="${value}"
            isReadonly
          ></az-text>`;
      }
    });
  }
  processObject(jsonObject);
  return fields || 'Failed to translate JSON to Form Fields.';
}
