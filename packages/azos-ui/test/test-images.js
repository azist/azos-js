/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

/**
 * The following files are licensed as:
 *  - https://en.wikipedia.org/wiki/en:Creative_Commons
 *  - https://creativecommons.org/licenses/by-sa/4.0/deed.en
 *
 * azos.ico.testJpg:
 *  - https://commons.wikimedia.org/wiki/File:Surgeon_Vice-Admiral_Alasdair_Walker.jpg
 *
 * azos.ico.testPng:
 *  - https://commons.wikimedia.org/wiki/File:Nhonlam.png
 *
 * azos.ico.testSvg:
 *  - https://upload.wikimedia.org/wikipedia/commons/3/35/%281%2B2%29_Dimensional_SC_lattice.svg
 *
 * azos.ico.testGif:
 *  - https://upload.wikimedia.org/wikipedia/commons/c/c8/132C_trans.gif
 */
import { CONTENT_TYPE } from "azos/coreconsts";

export const TEST_IMAGES = Object.freeze([
  {
    uri: "azos.ico.testJpg",
    f: "jpg",
    // ctp: CONTENT_TYPE.TEXT_HTML, // This will be assumed by default to be TEXT_HTML anyway
    c: `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Surgeon_Vice-Admiral_Alasdair_Walker.jpg/800px-Surgeon_Vice-Admiral_Alasdair_Walker.jpg" />`,
  }, {
    uri: "azos.ico.testDataJpg",
    f: "jpg",
    ctp: CONTENT_TYPE.IMG_JPEG,
    c: `base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAHklEQVR4nGIxnrGZgRTARJLqUQ2jGoaUBkAAAAD//8vgAaHiwRyJAAAAAElFTkSuQmCC`,
  }, {
    uri: "azos.ico.testPng",
    f: "png",
    ctp: CONTENT_TYPE.TEXT_HTML,
    c: `<img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Nhonlam.png" />`,
  }, {
    uri: "azos.ico.testDataPng",
    f: "png",
    ctp: CONTENT_TYPE.IMG_PNG,
    c: `base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAHklEQVR4nGJZ/sSPgRTARJLqUQ2jGoaUBkAAAAD//+LCAfxEW7qOAAAAAElFTkSuQmCC`,
  }, {
    uri: "azos.ico.testSvg",
    f: "svg",
    ctp: CONTENT_TYPE.TEXT_HTML,
    c: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 110"><marker id="a" markerHeight="8" markerWidth="8" refX="3" refY="3"><circle cx="3" cy="3" r="2.9"/></marker><g fill="none" marker-mid="url(#a)" stroke="#000"><g stroke="#35a"><path d="m42 55h74"/><path d="m79 65 76 40m-38-50v30" stroke-dasharray="5,2"/></g><path d="m117 55-38-19-37 19v30l37-49 38 49m-38-80v60l-37 20h75l-38 20-37-20-37 20" stroke-dasharray="5,2"/><path d="m117 55-38 50-37-50m-37 50 74-100 76 100h-150 2"/></g></svg>`,
  }, {
    uri: "azos.ico.testSvgUrl",
    f: "svg",
    ctp: CONTENT_TYPE.TEXT_HTML,
    c: `<img src="https://upload.wikimedia.org/wikipedia/commons/3/35/%281%2B2%29_Dimensional_SC_lattice.svg" />`,
  }, {
    uri: "azos.ico.testDataSvg",
    f: "svg",
    ctp: CONTENT_TYPE.IMG_SVG,
    c: `base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTEwIj48bWFya2VyIGlkPSJhIiBtYXJrZXJIZWlnaHQ9IjgiIG1hcmtlcldpZHRoPSI4IiByZWZYPSIzIiByZWZZPSIzIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMi45Ii8+PC9tYXJrZXI+PGcgZmlsbD0ibm9uZSIgbWFya2VyLW1pZD0idXJsKCNhKSIgc3Ryb2tlPSIjMDAwIj48ZyBzdHJva2U9IiMzNWEiPjxwYXRoIGQ9Im00MiA1NWg3NCIvPjxwYXRoIGQ9Im03OSA2NSA3NiA0MG0tMzgtNTB2MzAiIHN0cm9rZS1kYXNoYXJyYXk9IjUsMiIvPjwvZz48cGF0aCBkPSJtMTE3IDU1LTM4LTE5LTM3IDE5djMwbDM3LTQ5IDM4IDQ5bS0zOC04MHY2MGwtMzcgMjBoNzVsLTM4IDIwLTM3LTIwLTM3IDIwIiBzdHJva2UtZGFzaGFycmF5PSI1LDIiLz48cGF0aCBkPSJtMTE3IDU1LTM4IDUwLTM3LTUwbS0zNyA1MCA3NC0xMDAgNzYgMTAwaC0xNTAgMiIvPjwvZz48L3N2Zz4=`,
  }, {
    uri: "azos.ico.testGif",
    f: "gif",
    ctp: CONTENT_TYPE.TEXT_HTML,
    c: `<img src="https://upload.wikimedia.org/wikipedia/commons/c/c8/132C_trans.gif" />`,
  }, {
    uri: "azos.ico.testDataGif",
    f: "gif",
    ctp: CONTENT_TYPE.IMG_GIF,
    c: `base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAHklEQVR4nGJZWfadgRTARJLqUQ2jGoaUBkAAAAD//5yAAjmnWq4+AAAAAElFTkSuQmCC
`,
  }
]);
