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
import { AzosError } from "azos/types";
import { asString } from "azos/strings";


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


const HTML_TAGS = {'&': '&amp;', '<': '&lt;', '>': '&gt;' };
function rtg(tag) { return HTML_TAGS[tag] || tag; }

/** Escapes HTML tags like: & < > */
export function escHtml(str) { return str === undefined || str == null || !(str.replace) ? "" : str.replace(/[&<>]/g, rtg); }


/** Ranks define the "importance"/size of the element. 1 is the biggest/highest rank aka 'RANK.HUGE', 6 is the smallest aka 'RANK.TINY' */
export const RANK = Object.freeze({
  UNDEFINED:   0,
  HUGE:        1,
  LARGE:       2,
  NORMAL:      3,
  MEDIUM:      4,
  SMALL:       5,
  TINY:        6
});
const ALL_RANK_NAMES = ["undefined", "huge", "large", "normal", "medium", "small", "tiny"];

/**
 * Returns a numeric 0..6 rank representation of a specifier value supplied as a numeric or string
 * @param {Number|string} v number or string value
 * @param {boolean} [isCss=false] when true returns default rank as an empty string which is suitable for CSS class name modifier; returns rank class names as `r1`..`r6`
 * @param {String|null} [clsSuffix=null] when set, adds a trailer to CSS class name
 * @returns {Number} an integer specified 0..6. O denotes "UNDEFINED"
 */
export function parseRank(v, isCss = false, clsSuffix = null){
  if (v===undefined || v===null || v===0) return isCss ? "" : RANK.UNDEFINED;
  clsSuffix = asString(clsSuffix);
  if (v > 0 && v <= 6) return isCss ? `r${v | 0}${clsSuffix}` : v | 0;
  const sv = v.toString().toLowerCase();
  const i = ALL_RANK_NAMES.indexOf(sv);
  if (i>0) return isCss ? `r${i}${clsSuffix}` : i;
  return isCss ? "" : RANK.UNDEFINED;
}

/** System statuses assign logical conditions for elements, e.g.: `ok/info/warning/alert/error` */
export const STATUS = Object.freeze({
  DEFAULT:   "default",
  OK:        "ok",
  INFO:      "info",
  WARNING:   "warning",
  ALERT:     "alert",
  ERROR:     "error"
});
const ALL_STATUS_VALUES = ["ok", "info", "warning", "alert", "error"];

/**
 * Returns status string which is either of system statuses as declared in `STATUS` enumeration
 * or `STATUS.DEFAULT`
 * @param {String} v string status value
 * @param {boolean} [isCss=false] when true returns default status as an empty string which is suitable for CSS class name modifier
 * @param {String|null} [clsSuffix=null] when you need to add a trailing part to the css class name
 * @returns {String} one of members of `STATUS` enum
 */
export function parseStatus(v, isCss = false, clsSuffix = null){
  if (v===undefined || v===null) return isCss ? "" : STATUS.DEFAULT;
  clsSuffix = asString(clsSuffix);
  v = v.toString().toLowerCase();
  if (isOneOf(v, ALL_STATUS_VALUES)) return `${v}${clsSuffix}`;
  return isCss ? "" : STATUS.DEFAULT;
}


/** Provides uniform base derivation point for `AzosElements` - all elements must derive from here */
export class AzosElement extends LitElement {

  static properties = {
    status: { type: String, reflect: true,  converter: { fromAttribute: (v) => parseStatus(v) }  },
    rank:   { type: Number, reflect: true,  converter: { fromAttribute: (v) => parseRank(v) }  },
    scope:  { type: String}
  };

  #arena = null;
  constructor() {
     super();
     this.status = null;
     this.rank = RANK.NORMAL;
  }

  /** Returns {@link Arena} instance from the first (great/grand)parent element that defines arena ref
   * @returns {Arena}
  */
  get arena(){
    if (this.#arena === null){
      let n = this.parentNode;
      while(typeof n.arena === 'undefined'){
        n =  (n.parentNode ?? n.host);
      }
      this.#arena =  n.arena;
    }
    return this.#arena;
  }

  /** Returns custom HTML element tag name for this element type registered with `customElements` collection */
  get customElementTagName() { return customElements.getName(this.constructor); }

  /** When `scope` property is set, returns an element which is pointed at by id, unless scope is set to either of: `self`|`this`|`host` in which
   *  case the hosting parent is used. Null if scoping element is not found */
  getScopeContext(){
    const scope = this.scope;
    if (!scope) return null;
    if (isOneOf(scope, ["win", "window"])) return window;
    if (isOneOf(scope, ["this", "host", "self"])) {
      let result = this;
      while(result){
        if (result.host) return result.host;
        result = result.parentNode;
      }
      return null;
    }
    return document.getElementById(scope);//or null
  }

  connectedCallback(){
    super.connectedCallback();
    const ctx = this.getScopeContext();
    if (ctx && this.id) ctx[this.id] = this;
  }

  disconnectedCallback(){
    const ctx = this.getScopeContext();
    if (ctx && this.id) delete ctx[this.id];
    super.disconnectedCallback();
  }

  /** Returns an element by id of the renderRoot */
  $(id){ return this.renderRoot.getElementById(id); }

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
  link(map, nsplit){
    const arn = this.arena;
    if (!arn) throw new AzosError("Arena is null. You need to call this function after component is mounted", "AzosElement.link(map)");
    linkModule(arn.app.moduleLinker, map, nsplit);
  }


  render() { return html`>>AZOS ELEMENT<<`; }
}
