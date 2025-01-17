/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

let _hasAccess;
/** Puts test into clipboard */
export async function writeToClipboard(text) {
  if (!(await hasAccess())) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}
async function hasAccess() {
  if (_hasAccess !== undefined) return _hasAccess;
  const state = (await navigator.permissions.query({ name: "clipboard-write" })).state;
  return _hasAccess = ["granted", "prompt"].includes(state);
}
