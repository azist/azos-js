export default async function writeToClipboard(text) {
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
