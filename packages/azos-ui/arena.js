/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as aver from "azos/aver";
import { isSubclassOf, AzosError, arrayDelete, isFunction, isObject, isAssigned, DIRTY_PROP, CLOSE_QUERY_METHOD } from "azos/types";
import { html, AzosElement, noContent } from "./ui.js";
import { Application } from "azos/application";
import * as logging from "azos/log";

import { Command } from "./cmd.js";
import { ARENA_STYLES } from "./arena.css.js";
import * as DEFAULT_HTML from "./arena.htm.js";
import { Applet } from "./applet.js";
import { ModalDialog } from "./modal-dialog.js";
import { isEmpty } from "azos/strings";

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
  static styles = ARENA_STYLES; //[ARENA_STYLES, css`p { color: blue }`];

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
      DEFAULT_HTML.renderToolbar(app, this, this.#toolbar);
    }
    //TODO: in future we will add kiosk toolbar here
  }


  /** Sets the specified applet as the current one in the arena.
   * If there is an existing applet, then the system would prompt user via  `closeQuery(): bool`
   * call where the applet can check itself of it is dirty, or bypass close query if "force=true"
   */
  async appletOpen(tapplet, force = false){
    aver.isSubclassOf(tapplet, Applet);
    const tagName = customElements.getName(tapplet);
    aver.isNotNull(tagName);

    //check if current one is loaded
    const closed = await this.appletClose(force);
    if (!closed) return false;

    //re-render with render(tagName)
    this.#appletTagName = tagName;
    this.update();//synchronous update including DOM rebuild
    this.updateToolbar();
    this.#applet = this.shadowRoot.getElementById("elmActiveApplet");
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

  /** Hides footer from arena markup. This may be needed for some applets which control their own full-screen scrolling such as large table-based grids.
   * You need to call this method with (true) arg to hide the footer.
   * Upon applet close arena automatically un-hides the footer.
   */
  hideFooter(h){
    const ftr = this.$("arenaFooter");
    if (!ftr) return;
    ftr.style.display =  h ? "none" : "unset";
  }


  render() {
    const app = this.#app;
    if (!app) return "";
    //---------------------------
    const kiosk = this.isKiosk;
    const header = kiosk ? noContent : html`<header>${this.renderHeader(app)}</header>`;
    const footer = kiosk ? noContent : html`<footer id="arenaFooter">${this.renderFooter(app)}</footer>`;

    return html`
${header}
<main>
${this.renderMain(app)}
</main>
${footer}
`;
  }//render

  /** @param {Application} app  */
  renderHeader(app){ return DEFAULT_HTML.renderHeader(app, this); }

  /** @param {Application} app  */
  renderMain(app){ return DEFAULT_HTML.renderMain(app, this, this.#appletTagName); }

  /** @param {Application} app  */
  renderFooter(app){ return DEFAULT_HTML.renderFooter(app, this); }


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

}//Arena


