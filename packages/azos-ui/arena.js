/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
import { isSubclassOf, AzosError, arrayDelete, isFunction, isObject, isAssigned, DIRTY_PROP, CLOSE_QUERY_METHOD, dispose } from "azos/types";
import { html, AzosElement, noContent, resolveImageSpec, renderImageSpec, verbatimHtml, domRef, domCreateRef, renderInto } from "./ui.js";
import { Application } from "azos/application";
import * as logging from "azos/log";

import { Command } from "./cmd.js";
import { iconStyles } from "./parts/styles.js";
import { ARENA_STYLES } from "./arena.css.js";
import { Applet } from "./applet.js";
import { ModalDialog } from "./modal-dialog.js";
import { isEmpty } from "azos/strings";
import { ImageRegistry } from "azos/bcl/img-registry";

import "./launcher.js";
import { BrowserRouter } from "./browser-router.js";
import { showObject } from "./object-inspector-modal.js";

//todo Move outside of here
function getUserInitials(user) {
  let parts;
  for (let screenName of [user.descr, user.name]) {
    if (!screenName) continue;
    else if (screenName.includes(" ")) { parts = screenName.split(" "); break; }
    else if (screenName.includes(".")) { parts = screenName.split("."); break; }
    else if (screenName.includes("-")) { parts = screenName.split("-"); break; }
    else if (screenName.includes("_")) { parts = screenName.split("_"); break; }
  }
  let initials;
  if (parts?.length > 0) initials = parts.map(n => n[0]).join("");
  else initials = user.name ?? "IN";

  return initials.slice(0, 2).toUpperCase();
}


/** Adds boilerplate like global error handling and page close event handling.
 * This is typically a last line in your `app.js` file.
 * @param {Arena} arena instance which should be already `launch(app)`-ed at the time of making this call
 * @param {function | null} [fError=null]  optional delegate function which takes a causing {@link Error} instance
 *  which you can use to show fancy error popups etc.
*/
export function addAppBoilerplate(arena, fError = null){
  const app = aver.isOf(aver.isOf(arena, Arena).app, Application);
  aver.isFunctionOrNull(fError);


  // Handle UNLOADING/CLOSING of tab/window
  //https://developer.chrome.com/docs/web-platform/page-lifecycle-api
  window.addEventListener("beforeunload", (evt) => {
    if (arena.dirty) {
      evt.preventDefault();
      evt.returnValue = true;
      return;
    }
  });

  //Called on tab close POST-factum asking questions.
  //Not called if user decides to cancel tab close
  window.addEventListener("pagehide", () => dispose(app));

  window.addEventListener("error", function (e) {
    app.log.write({
      type: logging.LOG_TYPE.EMERGENCY,
      topic: "ui",
      from: "app.js",
      text:  `Unhandled: ${e.error.constructor.name} ${e.error.message}`,
      exception: e.error
    });
    fError?.call(app, e.error);
  });

  window.addEventListener('unhandledrejection', function (e) {
    app.log.write({
      type: logging.LOG_TYPE.EMERGENCY,
      topic: "ui",
      from: "app.js",
      text:  `Unhandled rejection: ${e.reason.constructor.name} ${e.reason.message}`,
      exception: e.reason
    });
    fError?.call(app, e.reason);
  });
}


/**
 * Defines a root UI element which displays the whole Azos app.
 * See architecture introduction in root `readme.md`
 * Applets run inside of arenas. Arena is akin to a "desktop" while applets are akin to "applications" running in such desktop
 */
export class Arena extends AzosElement {

  /**
   * Launches Arena by registering it with the `window.customElementRegistry: CustomElementsRegistry`
   * @param {Application} app required application instance which arena works under
   * @param {string?} elementName - null or string name of arena custom element, `az-arena` used by default
   * @param {Function?} arenaClass - null or Arena or its subclass, `Arena` class used by default
   * @returns {Arena[]} array of connected arenas (in most cases with a single arena, while it is possible to have multiple)
   */
  static launch(app, elementName, arenaClass){
    aver.isOf(app, Application);
    elementName = aver.isString(elementName ?? "az-arena");
    arenaClass = arenaClass ?? Arena;
    aver.isTrue(arenaClass === Arena || isSubclassOf(arenaClass, Arena));
    window.customElements.define(elementName, arenaClass);

    //hook application by element name
    const allArenas = document.getElementsByTagName(elementName);
    for(const one of allArenas){
      one.____bindApplicationAtLaunch(app);
    }

    return [...allArenas];
  }

  //Sharing style sheets between Shadow Dom
  //// Create an element in the document and then create a shadow root:
  //const node = document.createElement("div");
  //const shadow = node.attachShadow({ mode: "open" });
  ////Adopt the same sheet into the shadow DOM
  //shadow.adoptedStyleSheets = [sheet];
  //https://stackoverflow.com/questions/69702129/how-to-use-adoptedstylesheets-in-lit
  //https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets
  static styles = [ARENA_STYLES, iconStyles]; //[ARENA_STYLES, css`p { color: blue }`];

  static properties = {
    name:  {type: String},
    menu:  {type: String},
    kiosk: {type: String},
    logLevel: {type: String}
  };

  #app;
  #applet = null;
  #appletTagName = null;
  #toolbar = [];
  #defaultImageRegistry;//optimization only DO NOT EXPOSE this property publicly

  #kiosk;
  get kiosk(){ return this.#kiosk; }
  set kiosk(v){
    this.#kiosk = v;
    this.requestUpdate();
    queueMicrotask(() => this.updateToolbar());
  }


  #logLevel;
  get logLevel(){ return this.#logLevel; }
  set logLevel(v){ this.#logLevel = logging.asMsgType(v); }

  constructor() {
    super();
    this.name = 'Arena';
    this.menu = "show";
    this.kiosk = null;//not in kiosk mode
  }

  /** System internal, don't use */
  ____bindApplicationAtLaunch(app){
    this.#app = app;
    this.#defaultImageRegistry = app.moduleLinker.tryResolve(ImageRegistry);//cache the DEFAULT image registry
    this.requestUpdate();
  }


  /** Returns {@link Arena} self
   * @returns {Arena} self
  */
  get arena(){ return this; }

  /** Returns {@link Application} instance where this arena was launched
   * @returns {Application}
  */
  get app(){ const app = this.#app; if (!app) throw new AzosError("Arena app is not bound. Must call `Arena.launch(app...)`"); return app; }

  /** Returns currently open {@link Applet} instance, or null if nothing is open yet, or applet was closed */
  get applet(){ return this.#applet; }

  /** Returns true when the arena state is considered "unsaved" and this should prevent browser window close
   * The default implementation returns true when there are any dialogs open or applet is active and it is `dirty`
  */
  get [DIRTY_PROP](){
    if (ModalDialog.topmost !== null) return true;//there are open pending modals
    if (this.#applet !== null && this.#applet[DIRTY_PROP]) return true;//applet has unsaved data
    return false;
  }

  /**
   * A convenient shortcut for the "DIRTY_PROP" symbol
   */
  get dirty() {return this[DIRTY_PROP]; }


  get isKiosk(){ return !isEmpty(this.kiosk); }
  get isKioskWithToolbar() { return this.kiosk==="toolbar"; }
  get isKioskWithoutToolbar() { return this.isKiosk && !this.isKioskWithToolbar; }


  firstUpdated(){
    this.updateToolbar();
  }


  /**
   * Installs tool items in the arena and requests update
   * @param {Command[]} commands an array of {@link Command} instances
   * @returns void
   */
  installToolbarCommands(commands){
    aver.isArray(commands);
    for(const cmd of commands){
      const idx = this.#toolbar.indexOf(cmd);
      if (idx < 0)
        this.#toolbar.push(cmd);
      else
        this.#toolbar.splice(idx, 1);
    }
    this.updateToolbar();
  }

  /** Uninstalls tool items in the arena and requests update
   * @param {string[] | Command[]} commands an array of either command string URIs or {@link Command} objects to uninstall
   * @returns void
   */
  uninstallToolbarCommands(commands){
    aver.isArray(commands);
    for(const one of commands){
      const cmd = one instanceof Command ? one : this.#toolbar.find(c => c.uri === one);
      if (cmd) arrayDelete(this.#toolbar, cmd);
    }
    this.updateToolbar();
  }

  /** Request an update of arena to reflect changes in Toolbars.
   * You may want to call this method WHEN the command definition/s change
   * for example, command icon or title change programmatically.
   * The install/uninstall methods already call this method.
   * @returns void
   */
  updateToolbar(){
    const app = this.#app;
    if (!app) return;
    if (!this.isKiosk){
      this.#renderToolbar(this.#toolbar);
    }
    //TODO: in future we will add kiosk toolbar here
  }


  /** Asynchronously launches an applet - sets the specified applet as the current one in the arena.
   * If there is an existing applet, then the system would prompt user via  `closeQuery(): bool`
   * call where the applet can check itself if it is dirty, or bypass close query if "force=true".
   * You can also pass launch args any object.
   * @param {function} tapplet a type of applet which you want to launch. It has to be a derivative of Applet class
   * @param {*} [args=null] an any object which serves as launch parameter, such as a deep link or other startup params
   * @param {boolean} [force=false] if you pass true, instructs the already open current applet (if any) to disregard close query circuit, effectively forcing current applet close
   * @returns {bool} true if requested applet was launched, or false if existing applet prevented the operation because of the close query abort
   */
  async appletOpen(tapplet, args = null, force = false){
    aver.isSubclassOf(tapplet, Applet);
    const tagName = customElements.getName(tapplet);
    aver.isNotNull(tagName);

    //Try to close the current one is loaded
    const closed = await this.appletClose(force);
    if (!closed) return false;

    //re-render with render(tagName)
    this.#appletTagName = tagName;
    this.update();//synchronous update including DOM rebuild
    this.updateToolbar();
    this.#applet = this.shadowRoot.getElementById("elmActiveApplet");
    this.#applet.args = args;//pass launch args
    this.requestUpdate();
    return true;
  }

  /** Closes applet returning to default state. Pass force=true to bypass closeQuery().
   * All toolbar commands installed by an applet are automatically uninstalled
   * @param {boolean} [force=false] pass true to bypass closeQuery
   * @returns {boolean} true if applet was closed or there was no applet to close to begin with. false when closeQuery prevented the close
  */
  async appletClose(force = false){
    if (!this.#applet) return true;
    const canClose = force ? true : await this.#applet[CLOSE_QUERY_METHOD]();
    if (!canClose) return false;

    this.uninstallToolbarCommands([...this.#toolbar]);
    this.#applet = null;
    this.#appletTagName = null;
    this.requestUpdate();//async
    this.hideFooter(false);
    return true;
  }

  /**
     * Writes to log if current component effective level permits, returning guid of newly written message
     * @param {string|function|object} from - specifies the name of the component which produces the log message
     * @param {string} type an enumerated type {@link log.LOG_TYPE}
     * @param {string} text message text
     * @param {Error} ex optional exception object
     * @param {object | null} params optional parameters
     * @param {string | null} rel optional relation guid
     * @param {int | null} src optional int src line num
     * @returns {guid | null} null if nothing was written or guid of the newly written message
     */
  writeLog(from, type, text, ex, params, rel, src){
    const ell = logging.getMsgTypeSeverity(this.logLevel);
    if (logging.getMsgTypeSeverity(type) < ell) return null;
    const app = this.#app;
    if (!app) return;

    if (!isAssigned(from)) from = this.constructor.name;
    from = isFunction(from) ? from.name : isObject(from) ? from.constructor.name : from.toString();

    const guid = app.log.write({
      type: type,
      topic: "ui",
      from: from,
      text: text,
      params: params,
      rel: rel ?? this.app.instanceId,
      src: src,
      exception: ex ?? null
    });
    return guid;
  }

  /** Resolves image specifier into an image content using a default image registry.
   * If you need to use another registry than the default one, you can call {@link resolveImageSpec} function directly.
   * Image specifiers starting with `@` get returned as-is without the first `@` prefix, this way you cam embed verbatim image content in identifiers.
   *  For example: `arena.resolveImageSpec("jpg://welcome-banner-hello1?iso=deu&theme=bananas&media=print")`. See {@link ImageRegistry.resolveSpec}
   * Requires {@link ImageRegistry} module installed in app chassis, otherwise returns a text block for invalid image.
   * @param {string} spec a required image specification
   * @param {string | null} [iso=null] Pass language ISO code which will be used as a default when the spec does not contain a specific code. You can also set `$session` in the spec to override it with this value
   * @param {string | null} [theme=null] Pass theme id which will be used as a default when the spec does not contain a specific theme. You can also set `$session` in the spec to override it with this value
   * @returns {tuple | string} - {sc: int, ctp: string, content: buf | string, attrs: {}}, for example `{sc: 200, ctp: "image/svg+xml", content: "<svg>.....</svg>", {fas: true}}`, returns plain strings without verbatim `@` specifier
   */
  resolveImageSpec(spec, iso = null, theme = null){
    const result = resolveImageSpec(this.#defaultImageRegistry, spec, iso, theme);
    return result;
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
  renderImageSpec(spec, { cls, iso, ox, oy, scale, theme, wrapImage } = {}) {
    const result = renderImageSpec(this.#defaultImageRegistry, spec, { cls, iso, ox, oy, scale, theme, wrapImage });
    return result;
  }

  /** Hides footer from arena markup. This may be needed for some applets which control their own full-screen scrolling such as large table-based grids.
   * You need to call this method with (true) arg to hide the footer.
   * Upon applet close arena automatically un-hides the footer.
   */
  hideFooter(h){
    const ftr = this.$("arenaFooter");
    if (!ftr) return;
    ftr.style.display =  h ? "none" : "block";
  }


  render() {
    const app = this.#app;
    if (!app) return "";
    //---------------------------
    const kiosk = this.isKiosk;
    const header = kiosk ? noContent : html`<header>${this.renderHeader(app)}</header>`;
    const footer = kiosk ? noContent : html`<footer id="arenaFooter">${this.renderFooter(app)}</footer>`;

    return html`
    <div class="app-container">
${header}
<main>
${this.renderMain()}
</main>
${footer}
</div>
`;
  }//render

  /** @param {Application} app  */
  renderHeader(app){
    const applet = this.applet;
    const title = applet !== null ? html`${applet.title}` : html`${app.description} - ${this.name}`

    if (this.menu === "show"){
      return html`
      <a href="#" class="menu" id="btnMenuOpen" @click="${(e) => { this.#menuOpen(); e.preventDefault(); }}">
        <svg><path d="M0,5 30,5  M0,14 25,14  M0,23 30,23"/></svg>
      </a>

      <nav class="side-menu" id="navMenu">
        <a href="#" class="close-button" id="btnMenuClose" @click="${(e) => { this.#menuClose(); e.preventDefault(); }}" >&times;</a>
        <az-launcher id="launcherMain" scope="this">
        </az-launcher>
      </nav>

      <div class="title">${title}</div>
      <div class="strip" ${domRef(this.#getRefToolbar())}> </div>
    `;
    } else {//noMenu
      return html`
        <div class="title" style="left: 0px;">${title}</div>
        <div class="strip" ${domRef(this.#getRefToolbar())}> </div>`;
    }
  }


  /** @param {Application} app  */
  renderMain(app){
    const tag =  this.#appletTagName;
    const appletHtml = tag ? `<${tag} id="elmActiveApplet"></${tag}>` : `<slot name="applet-content"> </slot>`;
    const clsMain = this.isKiosk ? "kiosk" : "";
    return html`
    <div class="applet-container ${clsMain}" role="main" >
      ${verbatimHtml(appletHtml)}
    </div>
    `;
  }


  renderFooter(){
    return html`
    <nav class="bottom-menu" id="navBottomMenu">
      <ul>
      </ul>
    </nav>

    <div class="contact"></div>
    <div class="copyright">Copyright &copy; 2022-2023 Azist</div>
    `;
  }

  #refToolbar;

  #getRefToolbar(){
    let refToolbar = this.#refToolbar;
    if (!refToolbar){
      this.#refToolbar = refToolbar = domCreateRef();
    }
    return refToolbar;
  }

  #menuOpen(){
    //todo: Add a function call on arena, if not defined ONLY THEN resolve the router module
    const linker = this.app.moduleLinker;
    if (linker && this.launcherMain) {
      const router = linker.tryResolve(BrowserRouter);
      if (router) {
        this.launcherMain.menu = router.mainMenu;
      } else {
        this.launcherMain.menu = null;
      }
    }

   this.renderRoot.getElementById("navMenu").classList.add("side-menu_expanded");
   this.renderRoot.querySelector('.app-container').classList.add("app-sidenav-open");
 }

  #menuClose(){
   this.renderRoot.getElementById("navMenu").classList.remove("side-menu_expanded");
   this.renderRoot.querySelector('.app-container').classList.remove("app-sidenav-open");
  }

  async #showUser() {
    const user = this.app.session.user;

    if (user.status === "Invalid")
      window.location.assign("/app/login");
    else
      showObject(user, { title: "User Profile", okBtnTitle: "Close" }, this);
  }

  async #toolbarClick(){ await this.exec(this); }

  #renderToolbar(commands){
    const divToolbar = this.#getRefToolbar(this).value;
    if (!divToolbar) return;

    const itemContent = [];

    let i=0;
    for(let cmd of commands){
      const one = html`<div class="strip-btn" id="divToolbar_${i++}" @click="${this.#toolbarClick.bind(cmd)}">
        ${cmd.provideMarkup(this, this)}
      </div>`;
      itemContent.push(one);
    }

    const userIcon = this.renderImageSpec("svg://azos.ico.user");
    let user = this.app.session?.user?.toInitObject();
    let initials, cls;
    if (user?.status !== "Invalid") {
      initials = getUserInitials(user);
      cls = "loggedIn";
    }

    const content = html`<div class="strip-btn ${cls}" id="divToolbar_User" @click="${this.#showUser}">${initials ?? userIcon.html}</div> ${itemContent} `;

    renderInto(content, divToolbar);
  }

}//Arena
