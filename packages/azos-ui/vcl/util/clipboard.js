/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

/** Puts test into clipboard */
export async function writeToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
  else { // deprecated, insecure, but functional method of Copy Pasta
    const textArea = document.createElement("textArea");
    textArea.value = text;
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";
    document.body.prepend(textArea);
    textArea.select();
    try { document.execCommand("copy"); }
    catch (e) { console.error(e); }
    finally { textArea.remove(); }
  }
}
