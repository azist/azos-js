/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html as lit_html, css as lit_css, svg as lit_svg, render as lit_render, LitElement, nothing as lit_nothing } from "lit";
import { unsafeHTML as lit_unsafe_html } from "lit/directives/unsafe-html";
import { ref as lit_ref, createRef as lit_create_ref } from "lit/directives/ref";
import { isOneOf } from "azos/strings.js";
import { link as linkModule } from "azos/linker.js";
import { AzosError,
         isNumber as types_isNumber,
         isString as types_isString,
         isArray as types_isArray,
         isObject as types_isObject,
         isNonEmptyString as types_isNonEmptyString,
         DATA_NAME_PROP,
         DATA_VALUE_PROP,
         sortDataFields,
         supportsDataProtocol,
         DATA_BLOCK_PROP
       } from "azos/types";
import { asString } from "azos/strings";
import { ImageRegistry } from "azos/bcl/img-registry";
import { AVERMENT_FAILURE, isOfOrNull, isStringOrNull } from "azos/aver";
import { CONTENT_TYPE } from "azos/coreconsts";

/** CSS template processing pragma: css`p{color: blue}` */
export const css = lit_css;

/** Html template processing pragma, use in `render()` e.g. "return html`<p>Hello ${this.name}!</p>`;" */
export const html = lit_html;

/** Svg template processing pragma */
export const svg = lit_svg;

/** Renders no content = nothing */
export const noContent = lit_nothing;

/** Adds ability to include direct HTML snippets like so: html` This is ${verbatimHtml(raw)}` */
export const verbatimHtml = lit_unsafe_html;

/** Directive to get DOM reference to rendered elements. Use like so: html` This is ${domRef(refOrCallback)}` */
export const domRef = lit_ref;

/** Helper method which creates a ref object which you can pass into `domRef(ref)` directive */
export const domCreateRef = lit_create_ref;

/** Helper method which renders template content into a specified root element e.g.: `renderInto(htmlResult, document.body)`*/
export const renderInto = lit_render;


const HTML_TAGS = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
function rtg(tag) { return HTML_TAGS[tag] || tag; }

/** Escapes HTML tags like: & < > */
export function escHtml(str) { return str === undefined || str == null || !(str.replace) ? "" : str.replace(/[&<>]/g, rtg); }


/** Ranks define the "importance"/size of the element. 1 is the biggest/highest rank aka 'RANK.HUGE', 6 is the smallest aka 'RANK.TINY' */
export const RANK = Object.freeze({
  UNDEFINED: 0,
  HUGE: 1,
  LARGE: 2,
  NORMAL: 3,
  MEDIUM: 4,
  SMALL: 5,
  TINY: 6
});
const ALL_RANK_NAMES = ["undefined", "huge", "large", "normal", "medium", "small", "tiny"];

/**
 * Returns a numeric 0..6 rank representation of a specifier value supplied as a numeric or string
 * @param {Number|string} v number or string value
 * @param {boolean} [isCss=false] when true returns default rank as an empty string which is suitable for CSS class name modifier; returns rank class names as `r1`..`r6`
 * @param {String|null} [clsSuffix=null] when set, adds a trailer to CSS class name
 * @returns {Number} an integer specified 0..6. O denotes "UNDEFINED"
 */
export function parseRank(v, isCss = false, clsSuffix = null) {
  if (v === undefined || v === null || v === 0) return isCss ? "" : RANK.UNDEFINED;
  clsSuffix = asString(clsSuffix);
  if (v > 0 && v <= 6) return isCss ? `r${v | 0}${clsSuffix}` : v | 0;
  const sv = v.toString().toLowerCase();
  const i = ALL_RANK_NAMES.indexOf(sv);
  if (i > 0) return isCss ? `r${i}${clsSuffix}` : i;
  return isCss ? "" : RANK.UNDEFINED;
}

/** System statuses assign logical conditions for elements, e.g.: `ok/info/warning/alert/error/brand1/brand2/brand3` */
export const STATUS = Object.freeze({
  DEFAULT: "default",
  OK: "ok",
  INFO: "info",
  WARNING: "warning",
  ALERT: "alert",
  ERROR: "error",
  BRAND1: "brand1",
  BRAND2: "brand2",
  BRAND3: "brand3"
});
const ALL_STATUS_VALUES = ["ok", "info", "warning", "alert", "error", "brand1", "brand2", "brand3"];

/**
 * Returns status string which is either of system statuses as declared in `STATUS` enumeration
 * or `STATUS.DEFAULT`
 * @param {String} v string status value
 * @param {boolean} [isCss=false] when true returns default status as an empty string which is suitable for CSS class name modifier
 * @param {String|null} [clsSuffix=null] when you need to add a trailing part to the css class name
 * @returns {String} one of members of `STATUS` enum
 */
export function parseStatus(v, isCss = false, clsSuffix = null) {
  if (v === undefined || v === null) return isCss ? "" : STATUS.DEFAULT;
  clsSuffix = asString(clsSuffix);
  v = v.toString().toLowerCase();
  if (isOneOf(v, ALL_STATUS_VALUES)) return `${v}${clsSuffix}`;
  return isCss ? "" : STATUS.DEFAULT;
}

/** Directional positioning for how label text appears in relation to input element (e.g. text input field, checkbox, radio button, etc.) */
export const POSITION = Object.freeze({
  DEFAULT: "default",
  TOP_CENTER: "top-center",
  TOP_RIGHT: "top-right",
  MIDDLE_RIGHT: "mid-right",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_CENTER: "bottom-center",
  BOTTOM_LEFT: "bottom-left",
  MIDDLE_LEFT: "mid-left",
  TOP_LEFT: "top-left"
});
const ALL_POSITION_VALUES = [...Object.values(POSITION)];

/**
 * Returns position string to determine how label text appears in relation to an input element.
 * @param {String} v string status value
 * @param {boolean} [isCss=false] when true returns default position as an empty string which is suitable for CSS class name modifier
 * NOTE: "DEFAULT" must be later redefined as "TOP_LEFT" for text input field classes and "MIDDLE_RIGHT" for boolean input field classes (i.e. checkbox, radio, etc.)
 * @returns {String} one of members of `POSITION` enum
 */
export function parsePosition(v, isCss = false) {
  if (v === undefined || v === null) return isCss ? "" : POSITION.DEFAULT;
  v = v.toString().toLowerCase();
  if (isOneOf(v, ALL_POSITION_VALUES)) return `${v}`;
  return isCss ? "" : POSITION.DEFAULT;
}


/** Provides uniform base derivation point for `AzosElements` - all elements must derive from here */
export class AzosElement extends LitElement {

  static properties = {
    status: { type: String, reflect: true },
    rank: { type: String, reflect: true },
    scope: { type: String, reflect: false },
    schema: { type: String, reflect: false}
  };

  #arena = null;
  /** Optional `arena` allows for programmatic association, such as dialog boxes */
  constructor(arena) {
    super();
    this.status = null;
    this.rank = RANK.NORMAL;
    this.#arena = arena ?? null;
  }


  #status;
  get status() { return this.#status; }
  set status(v) { this.#status = parseStatus(v); }

  #rank;
  get rank() { return this.#rank; }
  set rank(v) { this.#rank = parseRank(v); }


  /** Returns {@link Arena} instance from the first (great/grand)parent element that defines arena ref
   * @returns {Arena}
  */
  get arena() {
    if (this.#arena === null) {
      let n = this;
      while (n === this || typeof n.arena === 'undefined') {
        n = (n.parentNode ?? n.host);
        if (!n) throw new AzosError(`Component '${this.constructor.name}' can not compute 'arena' because this element is either not inserted in DOM yet, or does not have arena instance on its parent node path`);
      }
      this.#arena = n.arena;
    }
    return this.#arena;
  }

  /** Returns schema name from this or parent control chain.
   * If none define schema name, then it is taken from the applet name */
  get effectiveSchema(){
    let schema = this.schema;
    if (schema) return schema;

    let n = this.parentNode;
    while (typeof n.effectiveSchema === 'undefined') {
       n = (n.parentNode ?? n.host);
    }
    return n.effectiveSchema;
  }

  /** Returns custom HTML element tag name for this element type registered with `customElements` collection */
  get customElementTagName() { return customElements.getName(this.constructor); }

  /** When `scope` property is set, returns an element which is pointed at by id, unless scope is set to either of: `self`|`this`|`host` in which
   *  case the hosting parent is used. Null if scoping element is not found */
  getScopeContext() {
    const scope = this.scope;
    if (!scope) return null;
    if (isOneOf(scope, ["win", "window"])) return window;
    if (isOneOf(scope, ["this", "host", "self"])) {
      let result = this;
      while (result) {
        if (result.host) return result.host;
        result = result.parentNode;
      }
      return null;
    }
    return document.getElementById(scope);//or null
  }

  connectedCallback() {
    super.connectedCallback();
    const ctx = this.getScopeContext();
    if (ctx && this.id) ctx[this.id] = this;
  }

  disconnectedCallback() {
    const ctx = this.getScopeContext();
    if (ctx && this.id) delete ctx[this.id];
    super.disconnectedCallback();
  }

  /** Returns an element by id of the renderRoot */
  $(id) { return this.renderRoot.getElementById(id); }

  /** An alias for `link(app.moduleLinker, map, nsplit)`.
   * This function is typically called after component has mounted in `connectedCallback()`.
   *
   * Links requested dependencies in the supplied object of a form: `{name: type, name_x: type2, ...}`
   * using the supplied linker instance. Each object entry represents a single dependency.
   * This function keeps the key, but replaces the values which are class types (.ctor functions)
   * with resolved references to the object instances which implement these class .ctors (e,.g, inherit from classes).
   * Optionally, you can specify the name for dependency by using the `nsplit` string which is by default "_", e.g.
   * an object entry of "log_main: ILog" will be linked with an instance of the class which derives from "ILog" and
   * has a name "main". You can disable named linking by passing null to "nsplit" param.
   * @param {object} map target object which contains pairs: `{nm: type,...}`
   * @param {string} [nsplit="_"] optional split string for name, for example: "logger_main" will link with named object instance "main". The default is '_'. Pass null to disable named dependencies
   * @returns The original map which was passed-in, having its entries linked
  */
  link(map, nsplit) {
    const arn = this.arena;
    if (!arn) throw new AzosError("Arena is null. You need to call this function after component is mounted", "AzosElement.link(map)");
    linkModule(arn.app.moduleLinker, map, nsplit);
  }


  /**
     * Writes to log if current component effective level permits, returning guid of newly written message
     * @param {string} type an enumerated type `LOG_TYPE`
     * @param {string} text message text
     * @param {Error} ex optional exception object
     * @param {object | null} params optional parameters
     * @param {string | null} rel optional relation guid
     * @param {int | null} src optional int src line num
     * @returns {guid | null} null if nothing was written or guid of the newly written message
     */
  writeLog(type, text, ex, params, rel, src) { return this.arena.writeLog(this, type, text, ex, params, rel, src); }


  /** Resolves image specifier into an image content.
   * Image specifiers starting with `@` get returned as-is without the first `@` prefix, this way you cam embed verbatim image content in identifiers.
   *  For example: `arena.resolveImageSpec("jpg://welcome-banner-hello1?iso=deu&theme=bananas&media=print")`. See {@link ImageRegistry.resolveSpec}
   * Requires {@link ImageRegistry} module installed in app chassis, otherwise returns a text block for invalid image.
   * @param {string | null} [iso=null] Pass language ISO code which will be used as a default when the spec does not contain a specific code. You can also set `$session` in the spec to override it with this value
   * @param {string | null} [theme=null] Pass theme id which will be used as a default when the spec does not contain a specific theme. You can also set `$session` in the spec to override it with this value
   * @returns {tuple} - {sc: int, ctp: string, content: buf | string, attrs: {}}, for example `{sc: 200, ctp: "image/svg+xml", content: "<svg>.....</svg>", {fas: true}}`
   */
  resolveImageSpec(spec, iso = null, theme = null){ return this.arena.resolveImageSpec(spec, iso, theme); }

  /** This is a {@link resolveImageSpec} helper function wrapping A STRING (such as SVG) {@link ImageRecord.content} with {@link verbatimHtml}
   * returning it as a tuple along with optional image attributes
   * @returns {tuple} - {html: VerbatimHtml, attrs: {}}
   */
  renderImageSpec(spec, options = {}) { return this.arena.renderImageSpec(spec, options); }

  render() { return html`>>AZOS ELEMENT<<`; }
}

//FIXME: What is this used by? Remove/test
export function isRectInViewport(rect) {
  let bounds = rect.getBoundingClientRect();
  let viewWidth = document.documentElement.clientWidth;
  let viewHeight = document.documentElement.clientHeight;

  if (bounds['left'] < 0) return false;
  if (bounds['top'] < 0) return false;
  if (bounds['right'] > viewWidth) return false;
  if (bounds['bottom'] > viewHeight) return false;

  return true;
}

/** Controls are components with interact-ability properties like
 *  `disabled`, `visible`, `absent`, `applicable`, and `readonly`
 */
export class Control extends AzosElement{

  static properties = {
    /* HTML ELEMENTS may NOT have FALSE bool attributes which is very inconvenient, see the reversed accessors below */
    isDisabled:  {type: Boolean, reflect: true},
    isNa:        {type: Boolean, reflect: true},
    isHidden:    {type: Boolean, reflect: true},
    isAbsent:    {type: Boolean, reflect: true},
    isReadonly:  {type: Boolean, reflect: true}
  };

  constructor(){ super(); }

  /** Programmatic accessor with reversed meaning for `isDisabled` */
  get isEnabled() { return !this.isDisabled; }

  /** Programmatic accessor with reversed meaning for `isDisabled` */
  set isEnabled(v) { this.isDisabled = !v; }

  /** Programmatic accessor with reversed meaning for `isNa`. Controls logical applicability similar to "business enabled" */
  get isApplicable() { return !this.isNa; }

  /** Programmatic accessor with reversed meaning for `isNa`. Controls logical applicability similar to "business enabled" */
  set isApplicable(v) { this.isNa = !v; }

  /** Programmatic accessor with reversed meaning for `isHidden` */
  get isVisible() { return !this.isHidden; }

  /** Programmatic accessor with reversed meaning for `isHidden` */
  set isVisible(v) { this.isHidden = !v; }


  /** Override to calculate styles based on current state, the dflt implementation emits css for invisible and non-displayed items.
   * The styles are applied to root element being rendered via a `style` which overrides the default classes
   */
  calcStyles(){
    let stl = "";
    if (this.isHidden) stl += "visibility:hidden!important;";
    if (this.isAbsent) stl += "display:none!important;";
    return stl;
  }

  //https://www.oddbird.net/2023/11/17/components/
  //https://frontendmasters.com/blog/light-dom-only/
  /** Descendants should override `renderControl()` instead */
  render(){
    const stl = this.calcStyles();
    return stl ? html`<style>:host{ ${stl}}</style> ${this.renderControl()}` : this.renderControl();
  }

  /** Override to render your specific control */
  renderControl(){ return "***NO CONTROL***"; }
}


/** AzosParts are primitives akin to "widgets" for building more complex UI components.
 * Buttons, textboxes, radios, checks, sliders et.al are all parts
 */
export class Part extends Control{
  constructor(){ super(); }

  /** Descendants should override `renderPart()` instead */
  renderControl(){
    return this.renderPart();
  }

  /** Override to render your specific part */
  renderPart(){ return "***NO PART***"; }
}


/** Resolves image specifier into an image content.
   * Image specifiers starting with `@` get returned as-is without the first `@` prefix, this way you cam embed verbatim image content in identifiers.
   *  For example: `arena.resolveImageSpec("jpg://welcome-banner-hello1?iso=deu&theme=bananas&media=print")`. See {@link ImageRegistry.resolveSpec}
   * Requires {@link ImageRegistry} passed in as a first parameter
   * @param {ImageRegistry} reg a required ImageRegistry reference
   * @param {string} spec a required image specification
   * @param {string | null} [iso=null] Pass language ISO code which will be used as a default when the spec does not contain a specific code. You can also set `$session` in the spec to override it with this value
   * @param {string | null} [theme=null] Pass theme id which will be used as a default when the spec does not contain a specific theme. You can also set `$session` in the spec to override it with this value
   * @returns {tuple | string} - {sc: int, ctp: string, content: buf | string, attrs: {}}, for example `{sc: 200, ctp: "image/svg+xml", content: "<svg>.....</svg>", {fas: true}}`, returns plain strings without verbatim `@` specifier
   */
export function resolveImageSpec(reg, spec, iso = null, theme = null) {
  isOfOrNull(reg, ImageRegistry);
  isStringOrNull(spec);
  if (!spec) return {sc: 500, ctp: "text/plain", content: ""};

  if (spec.startsWith("@")) return spec.slice(1); //get rid of prefix, return the rest as-is

  if (!reg) return { sc: 404, ctp: CONTENT_TYPE.TEXT_HTML, content: "<div style='font-size: 9px; color: yellow; background: red; width: 64px; border: 2px solid yellow;'>NO IMAGE-REGISTRY</div>", attrs: {} };

  const rec = reg.resolveSpec(spec, iso, theme);
  if (!rec) return { sc: 404, ctp: CONTENT_TYPE.TEXT_HTML, content: `<div style='font-size: 9px; color: #202020; background: #ff00ff; width: 64px; border: 2px solid white;'>UNKNOWN IMG: <br>${spec}</div>`, attrs: {} };

  return rec.produceContent();
}

/** This is a {@link resolveImageSpec} helper function wrapping A STRING (such as SVG) {@link ImageRecord.content} with {@link verbatimHtml}
 * returning it as a tuple along with optional image attributes. Other params include:
 * @param spec {string} - image specifier such as `svg://azos.ico.help?iso=deu&theme=bananas&media=print`
 * @param  options {object} - optional object with the following properties:
 *  - cls {string} - optional CSS class name (or names, separated by space) or an array of class names to apply to the image
 *  - iso {string} - optional system-wide ISO code to use when resolving the image spec, default is null
 *  - ox {string | number} - optional X offset to apply to the image, default is unset
 *  - oy {string | number} - optional Y offset to apply to the image, default is unset
 *  - scale {number} - optional scale factor to apply to the image, default is unset
 *  - theme {string} - optional system-wide theme to use when resolving the image spec, default is null
 *  - wrapImage {boolean} - optional flag to indicate if the image should be wrapped in a `<i>` tag, default is true
 * @returns {tuple} - {html: VerbatimHtml, attrs: {}}
 */
export function renderImageSpec(reg, spec, { cls, iso, ox, oy, scale, theme, wrapImage } = {}) {
  cls ??= "icon";
  wrapImage ??= true;

  const got = resolveImageSpec(reg, spec, iso, theme);

  scale ??= got?.attrs?.scale;
  ox ??= got?.attrs?.ox;
  oy ??= got?.attrs?.oy;

  if (types_isNumber(ox)) ox = `${ox}px`;
  if (types_isNumber(oy)) oy = `${oy}px`;

  let transforms = [];
  let stl = noContent;

  if (scale) transforms.push(`scale(${scale})`);
  if (ox) transforms.push(`translateX(${ox})`);
  if (oy) transforms.push(`translateY(${oy})`);
  if (transforms.length) stl = `transform: ${transforms.join(" ")}`;

  if (types_isString(cls)) cls = cls.split(" ");
  cls = [...(cls ?? []), got.attrs?.fas ? "fas" : ""].filter(types_isNonEmptyString);

  if (cls.length) cls = cls.join(" ");
  else cls = noContent;

  let content;
  if (typeof got === "string")
    content = `<img src="${got}" />`;
  else if (CONTENT_TYPE.isImageFamily(got.ctp))
    content = `<img src="data:${got.ctp};${got.content}" />`;
  else if (CONTENT_TYPE.isHtml(got.ctp))
    content = got.content;
  else
    content = got.content ?? "NO CONTENT";

  if (wrapImage || !["svg", "img"].some(option => content.startsWith(`<${option}`))) // or if content is an svg
    content = html`<i class="${cls}" style="${stl}">${verbatimHtml(content)}</i>`;
  else
    content = verbatimHtml([
      content.slice(0, 4),
      (cls !== noContent) ? `class="${cls}"` : '',
      (stl !== noContent) ? `style="${stl}"` : '',
      content.slice(5)
    ].join(' '));

  return { html: content, attrs: got.attrs };
}

/**
 * Takes HtmlElement and returns an array of {@link AzosElement} child instances which support IData protocol
 * characterized by the presence of {@link DATA_NAME_PROP} and {@link DATA_VALUE_PROP} properties.
 * @param {HTMLElement} element required UI element as of which to search for child `AzosElement` derivatives
 * @param {boolean} [deep=true] true to consider child sub-elements, false to only scan the immediate children of this element.
 *                              Note: Only non-shadow sub elements (not web components) are searched, e.g. things like "span/div/section" which are in the same DOM
 *                              are considered to be on the same logical level, but shadow DOM is NOT pierced, as web components should encapsulate their own child fields
 * @returns {AzosElement[]} array of data-aware elements which support IData protocol; empty array for null/undefined/unsupported elements;
 *                          If you pass `deep` then the child elements are also searched
 **/
export function getChildDataMembers(element, deep = true){
  let result = [];

  if (element && element.children){
    for(const one of element.children){
      if (one instanceof AzosElement){
        //Does it support data protocol
        if (supportsDataProtocol(one)) result.push(one);
      } else { //I am another element
        const sub = getChildDataMembers(one, deep);
        result = result.concat(sub);
      }
    }
  }

  result.sort(sortDataFields);

  return result;
}


/**
 * Returns the immediate (the innermost) parent of type `AzosElement` for the supplied html element
 * @param {AzosElement} element
 * @returns {AzosElement | null} Immediate parent or null if not AzosElement
 */
export function getImmediateParentAzosElement(element){
  isOfOrNull(element, HTMLElement);

  while(element){
    const host = element.host;
    if (host){
      if (host instanceof AzosElement) return host;
      element = host;
      continue;
    }
    element = element.parentNode;
  }

  return null;
}

window.az_GetImmediateParentAzosElement = getImmediateParentAzosElement;

/**
 * Returns a parent node which supports {@link DATA_BLOCK_PROP} (such as a {@link Block})
 * which this element is a member of. Note: this does NOT pierce shadow dom of upper element by design,
 * so it searches for IMMEDIATE AzosElement with data protocol containing this element
 * @param {AzosElement} element required element reference
 * @returns {AzosElement | null} parent element or null
 */
export function getDataParentOfMember(element){
  const parent = getImmediateParentAzosElement(element);
  if (!parent) return null;
  if (DATA_BLOCK_PROP in parent) return parent;
  return null;
}


/**
 * Helper method which harvests data from {@link AzosElement} children of the specified element,
 * using their {@link DATA_NAME_PROP} and  {@link DATA_VALUE_PROP} properties.
 * @param {HTMLElement} element required UI element as of which to search for child `AzosElement` derivatives
 * @param {bool} asArray true to get data as an array instead of a map
 * @returns {array | object} an array or object populated with data e.g. `["James", "Bond"]` or `{"LastName": "Bond", "FirstName": "James"}`
 */
export function getBlockDataValue(element, asArray = false){
  const fields = getChildDataMembers(element, true);

  if (asArray){
    const result = [ ];
    for(const fld of fields) result.push(fld[DATA_VALUE_PROP]);
    return result;
  } else { //map
    const result = { };
    let i = 0;
    for(const fld of fields) result[fld[DATA_NAME_PROP] ?? `?noname_${i++}`] = fld[DATA_VALUE_PROP];
    return result;
  }
}


/**
 * Helper method which uses default strategy to setting {@link DATA_VALUE_PROP}
 * on named fields on a BLOCK field-composite element by applying a field assignment vector which is either:
 *   a). an array containing field values matched by their ordinal array position, e.g. `["James", "Bond"]`
 *   b). or an object having key names equal data field names of child fields, e.g. `{FirstName: "James", LastName: "Bond"}`
 * Field name bindings are case-INSENSITIVE
 * @param {HTMLElement} element whose child fields need to be set
 * @param {Array | Object} v either array or object representing field assignment vector, e.g. `{FirstName: "James", LastName: "Bond"}`
 * @returns {boolean} true if at least a single set operation was applied - fields were found by name or by index; false when nothing was found
 */
export function setBlockDataValue(element, v){
  let result = false;

  const fields = getChildDataMembers(element, true);


  if (v === undefined || v === null) {
    for(const fld of fields) fld[DATA_VALUE_PROP] = null;
    return true;
  }

  if (types_isString(v)) v = JSON.parse(v);

  if (types_isArray(v)){
    for(let i = 0; i < v.length; i++ ){
      if (i < fields.length){
        fields[i][DATA_VALUE_PROP] = v[i];
        result = true;
      }
    }
  } else if (types_isObject(v)){
    for(const [pk, pv] of Object.entries(v)){
      const fld = fields.find(one => one[DATA_NAME_PROP]?.toLowerCase() === pk.toLowerCase());
      if (fld) {
        fld[DATA_VALUE_PROP] = pv;
        result = true;
      }
    }
  } else throw AVERMENT_FAILURE("Expecting data assignment either [] or {} vector", "setDataValue()");

  return result;
}


