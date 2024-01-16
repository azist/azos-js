/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { isOf } from "azos/aver";
import { application, Application } from "azos/application";

import { html as lit_html, css as lit_css, svg as lit_svg, LitElement } from "lit";
import { AzosError } from "azos/types";


/**
 * A helper factory method creates a new application (new Application(cfg)) from a config object
 * which is either a plain JS object, or a string representation in JSON format,
 * or {@link Configuration}, or {@link ConfigNode} objects.
 * Please see {@link Application} and {@link Configuration} topics
 * @param {object | Configuration | ConfigNode} cfg plain object, JSON string, Configuration or ConfigNode instance
 * @returns {Application} New Application instance
 */
export function makeUiApplication(cfg){
  const app = application(cfg);
  setUiApplication(app);
  return app;
}

/** For UI clients sets `window.AZOS_APP` global.
 * You do not need to call this if you created your application using {@link uiApplication} helper method
 * which calls this method already
 */
export function setUiApplication(app){
  window.AZOS_APP = app;
}

/** Gets UI-global {@link Application} instance from window object
 * The method throws if the window object was not injected `Application`
 * @returns {Application} Application instance
*/
export function uia(){
  try{
    return isOf(window.AZOS_APP, Application);
  } catch{
    throw new AzosError(`The global application AZOS_APP variable is not defined.
                         Is it because you are trying to do something before app is allocated?
                         Revise your entry point (e.g. 'app.js')`);
  }
}


/** CSS template processing pragma: css`p{color: blue}` */
export function css(content, ...values){
  return lit_css(content, values);
}
/** Html template processing pragma, use in `render()` e.g. "return html`<p>Hello ${this.name}!</p>`;" */
export function html(content, ...values){
  return lit_html(content, values);
}
/** Svg template processing pragma */
export function svg(content, ...values){
  return lit_svg(content, values);
}

/** Provides uniform base derivation point for `AzosElements` - all elements must derive from here */
export class AzosElement extends LitElement {
  constructor() {   super();   }
  render() { return html`>>AZOS ELEMENT<<`; }
}
