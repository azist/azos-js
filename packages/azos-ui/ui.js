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
         isAssigned as types_isAssigned,
         DATA_NAME_PROP,
         DATA_VALUE_PROP,
         sortDataFields,
         supportsDataProtocol,
         DATA_BLOCK_PROP,
         DATA_MODE_PROP,
         DATA_SCHEMA_PROP,
         TIME_ZONE_PROP,
         DATA_VALUE_DESCRIPTOR_PROP,
         DATA_VALUE_DESCRIPTOR_IS_LIST,
       } from "azos/types";
import { asString } from "azos/strings";
import { ImageRecord, ImageRegistry } from "azos/bcl/img-registry";
import { AVERMENT_FAILURE, isOfOrNull, isStringOrNull } from "azos/aver";
import { CONTENT_TYPE, UNKNOWN } from "azos/coreconsts";
import { TimeZone } from "azos/time";

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

/** Controls are components with interact-ability properties like
 *  `disabled`, `visible`, `absent`, `applicable`, and `readonly`
 */
export class Control extends AzosElement {

  static properties = {
    /* HTML ELEMENTS may NOT have FALSE bool attributes which is very inconvenient, see the reversed accessors below */
    isDisabled:  {type: Boolean, reflect: true},
    isNa:        {type: Boolean, reflect: true},
    isHidden:    {type: Boolean, reflect: true},
    isAbsent:    {type: Boolean, reflect: true},
    isReadonly:  {type: Boolean, reflect: true},
    isBrowse:    {type: Boolean, reflect: true}
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


  /**
   * Override to calculate styles based on current state which we applied to element host, the dflt implementation emits css for invisible and non-displayed items.
   * The styles are applied to the HOST element being rendered via an inline `<style>` which overrides the default classes.
   * Note: this is called during rendering so you may take advantage of cached values in `renderState` bag
   * @param {Boolean} effectiveAbsent pass true to make element disappear
   */
  calcHostStyles(effectiveAbsent){
    let stl = "";
    if (this.isHidden) stl += "visibility:hidden!important;";
    if (effectiveAbsent || this.isAbsent) stl += "display:none!important;";
    return stl;
  }

  #renderState;

  /** True when render state object was already allocated.
   * You may query this property before using `renderState` which allocates state
   * if it has not been yet allocated. Sometimes this may need to be avoided.
   * Note: render state gets reset for EVERY new render call
   * @returns {Boolean}
   */
  get hasRenderState(){ return !!this.#renderState; }

  /**
   * Lazily allocates an object which is used as an ephemeral bag to cache/carry-over possibly expensive
   * operation results between different phases of element rendering.
   * For example: you may get an effective data entry mode for some partial rendering call,
   * then when you may need the data entry mode again later, you may take it from cache not to re-compute again.
   * The object gets lazily allocated, and it gets reset on EVERY re-render.
   * @returns {Object}
  */
  get renderState(){
    if (!this.#renderState) this.#renderState = { };
    return this.#renderState;
  }

  //https://www.oddbird.net/2023/11/17/components/
  //https://frontendmasters.com/blog/light-dom-only/
  /** Descendants should override `renderControl()` instead */
  render(){
    this.#renderState = null;//start every render from scratch
    const stlHost = this.calcHostStyles();
    return stlHost ? html`<style>:host{ ${stlHost}}</style> ${this.renderControl()}` : this.renderControl();
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

/**
 * This is a {@link resolveImageSpec} helper function wrapping A STRING (such as SVG) {@link ImageRecord.content} with {@link verbatimHtml}
 * returning it as a tuple along with optional image attributes. Other params include:
 * @param {ImageRegistry} reg - required ImageRegistry instance to use for resolving the image spec
 * @param {string|ImageRecord} spec  - image specifier such as `svg://azos.ico.help?iso=deu&theme=bananas&media=print` or ImageRecord
 * @param {object} options - optional object with the following properties:
 * @param {string} [options.cls] - cls {string} - optional CSS class name (or names, separated by space) or an array of class names to apply to the image
 * @param {string | number} [options.ox] - optional X offset to apply to the image, default is unset
 * @param {string | number} [options.oy] - optional Y offset to apply to the image, default is unset
 * @param {number} [options.scale] - optional scale factor to apply to the image, default is unset
 * @param {boolean} [options.wrapImage] - optional flag to indicate if the image should be wrapped in a `<i>` tag, default is true
 * @param {string} [options.iso]  - optional system-wide ISO code to use when resolving the image spec, default is null
 * @param {string} [options.theme] - optional system-wide theme to use when resolving the image spec, default is null
 * @returns {tuple} {html: VerbatimHtml, attrs: {}}
 */
export function renderImageSpec(reg, spec, { cls, ox, oy, scale, wrapImage, iso, theme, } = {}) {
  const content = resolveImageSpec(reg, spec, iso, theme);
  return renderImageRecord(content, { cls, scale, ox, oy, wrapImage });
}

export function renderImageRecord(got, { cls, ox, oy, scale, wrapImage, } = {}) {
  if (got instanceof ImageRecord) got = got.produceContent();

  cls ??= "icon";
  wrapImage ??= true;
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
 *                              Note: Only non-shadowed sub elements (not web components) are searched, e.g. things like "span/div/section" which are in the same DOM
 *                              are considered to be on the same logical level, but shadow DOM is NOT pierced, as web components should encapsulate their own child fields
 * @returns {AzosElement[]} array of data-aware elements which support IData protocol; empty array for null/undefined/unsupported elements;
 *                          If you pass `deep` then the child elements are also searched
 **/
export function getChildDataMembers(element, deep = true){
  let result = [];

  function traverse(elm){
    if (!elm || !elm.children) return;
    for(const one of elm.children){
      if (one instanceof AzosElement){
        //Does it support data protocol
        if (supportsDataProtocol(one)){
          result.push(one);
        } else if (DATA_BLOCK_PROP in one){
          //If it is a block, we need to get its children
          const sub = one[DATA_BLOCK_PROP];
          result = result.concat(sub);
        }
      } else if (deep) { //I am another element
        const sub = getChildDataMembers(one, deep);
        result = result.concat(sub);
      }
    }
  }

  //We may need to traverse "slotted" element and the ones with shadow dom
  traverse(element);
  if (element?.shadowRoot) traverse(element.shadowRoot);

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
    const slot = element.assignedSlot;
    if (slot){
      const shadow = slot.getRootNode();
      if (shadow){
        element = shadow;
      } else return null;
    }

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
    for(const fld of fields){
      const pn = fld[DATA_NAME_PROP] ?? `?noname_${i++}`;
      const pv = result[pn];
      if (pv !== undefined){ //if the value is already set
        if (types_isArray(pv)){ //and it is an array
          pv.push(fld[DATA_VALUE_PROP]);//add to existing array
        } else {
          result[pn] = [pv, fld[DATA_VALUE_PROP]];//wrap existing value in array and add new value to that array
        }
      } else result[pn] = fld[DATA_VALUE_PROP];//assign value in a new key
    }
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

  const ov = v;
  const isUi = v instanceof UiInputValue;
  if (isUi){ //unwrap the value
    v = v.value;
  }

  if (v === undefined || v === null) {
    for(const fld of fields) fld[DATA_VALUE_PROP] = ov;
    return true;
  }

  if (types_isString(v)) v = JSON.parse(v);

  if (types_isArray(v)){
    for(let i = 0; i < v.length; i++ ){
      if (i < fields.length){
        fields[i][DATA_VALUE_PROP] = isUi ? new UiInputValue(v[i]) : v[i];
        result = true;
      }
    }
  } else if (types_isObject(v)){
    for(const [pk, pv] of Object.entries(v)){
      const flds = fields.filter(one => one[DATA_NAME_PROP]?.toLowerCase() === pk.toLowerCase());
      if (flds.length === 0) continue;

      if (types_isArray(pv)){ //DATA is array, we need to bind it a awhole if the field supports LIST via value descriptor OR hard coded collection - bind one by one via index

        const isList = !!(flds[0][DATA_VALUE_DESCRIPTOR_PROP]?.[DATA_VALUE_DESCRIPTOR_IS_LIST]);

        if (isList){//If it is a list then bind array awhole
          flds[0][DATA_VALUE_PROP] = isUi ? new UiInputValue(pv) : pv;
          result = true;
        } else {
          for(let i=0; i < pv.length && i < flds.length; i++){
            flds[i][DATA_VALUE_PROP] = isUi ? new UiInputValue(pv[i]) : pv[i];
            result = true;
          }
        }
      } else {
        for(const one of flds){
          one[DATA_VALUE_PROP] = isUi ? new UiInputValue(pv) : pv;
          result = true;
        }
      }
    }
  } else throw AVERMENT_FAILURE("Expecting data assignment either [] or {} vector", "setDataValue()");

  return result;
}

/**
 * Computes the effective data mode for this element: if this element has {@link DATA_MODE_PROP}
 * it gets it, and if it is set with non-null/undef value returns it, otherwise continues the search up the parent chain of
 * AzosElements until the `DATA_MODE_PROP` returns a real {@link DATA_MODE} value. If none found, then returns undefined data mode
 * @param {HTMLElement} element required HTML element
 * @returns {DATA_MODE | undefined}
 */
export function getEffectiveDataMode(element){
  while(element instanceof HTMLElement){
    if (DATA_MODE_PROP in element) {
      const mode = element[DATA_MODE_PROP];
      if (types_isString(mode)) return mode;
    }
    element = getImmediateParentAzosElement(element);
  }

  return undefined;
}

/**
 * Computes the effective time zone for this element: if this element has {@link TIME_ZONE_PROP}
 * it gets it, and if it is set with non-null/undef value returns it, otherwise continues the search up the parent chain of
 * AzosElements until the `TIME_ZONE_PROP` returns a real {@link TimeZone} or string value (a name of time zone) value.
 * If none found, then returns undefined time zone
 * @param {HTMLElement} element required HTML element
 * @returns {DATA_MODE | undefined}
 */
export function getEffectiveTimeZone(element){
  while(element instanceof HTMLElement){
    if (TIME_ZONE_PROP in element) {
      const tz = element[TIME_ZONE_PROP];
      if (types_isString(tz) || tz instanceof TimeZone) return tz;
    }
    element = getImmediateParentAzosElement(element);
  }

  return undefined;
}

/**
 * Computes the effective schema for this element: if this element has {@link DATA_SCHEMA_PROP}
 * it gets it, and if it is set with non-null/undef value returns it, otherwise continues the search up the parent chain of
 * AzosElements until the `DATA_SCHEMA_PROP` returns a real string value. If non found, then returns undefined
 * @param {HTMLElement} element required HTML element
 * @param {String} dflt - optional string default used for undefined schemas
 * @returns {String | undefined}
 */
export function getEffectiveSchema(element, dflt){
  while(element instanceof HTMLElement){
    if (DATA_SCHEMA_PROP in element) {
      const schema = element[DATA_SCHEMA_PROP];
      if (types_isString(schema)) return schema ?? dflt ?? UNKNOWN;
    }
    element = getImmediateParentAzosElement(element);
  }

  return dflt ?? UNKNOWN;
}


/**
 *  Decorator pattern which signifies that the encapsulated passed value is the value coming from an UI input entry action and
 *  consequently it needs to be treated as such at the data buffer level, e.g. prepared before assignment into `.value` property
 */
export class UiInputValue {
  #value;
  get value(){ return this.#value; }
  set value(v){ this.#value = v; }
  constructor(v){ this.#value = v; }
}


/**
 * Provides access to CSS variables that are defined in the CSS palette.
 * @param {string} spec a valid CSS specification, e.g., "selected-item-bg-color" or "default-item-fg-color"
 * @param {string | undefined} prefix optional prefix to use for the CSS variable, default is "pal" (e.g., "pal-selected-item-bg-color")
 * @returns `var(--{prefix}-{spec})`, e.g., `--var(--pal-selected-item-bg-color)` or `--var(--pal-default-item-fg-color)`;
 *  unless the {@param spec} starts with `#` or contains `{`, then it is returned as-is, e.g., `#ff0000` or `rgb(255, 0, 0)`.
 */
export function getCssPaletteSpec(spec, prefix = "pal") {
  if (!types_isAssigned(isStringOrNull(spec))) return undefined;
  if (spec.startsWith("#") || spec.indexOf("(") > -1) return spec; //already a CSS spec
  return `var(--${prefix}-${spec})`; //convert to CSS variable
}
