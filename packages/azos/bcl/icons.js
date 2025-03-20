/**
 * Stock images dictionary. The registry gets initialized with these images by default.
 * The keys are of form 'namespace://name', the values are either SVG strings or ImageSpecs
 */
export const WEB_APP_ICONS = Object.freeze([
  {
    // svg://azos.ico.none
    uri: "azos.ico.none",
    f: "svg",
    c: "<svg></svg>",
  },
  {
    uri: "azos.ico.arrowLeft",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="m276.85-460 231.69 231.69L480-200 200-480l280-280 28.54 28.31L276.85-500H760v40H276.85Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.arrowRight",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M683.15-460H200v-40h483.15L451.46-731.69 480-760l280 280-280 280-28.54-28.31L683.15-460Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.calendarToday",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M360-335.38q-35.08 0-59.85-24.77-24.77-24.77-24.77-59.85t24.77-59.85q24.77-24.77 59.85-24.77t59.85 24.77q24.77 24.77 24.77 59.85t-24.77 59.85q-24.77 24.77-59.85 24.77ZM160-120v-640h135.38v-89.23h43.08V-760h286.16v-89.23h40V-760H800v640H160Zm40-40h560v-375.38H200V-160Zm0-415.39h560V-720H200v144.61Zm0 0V-720v144.61Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.caretUp",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="m480-555.69-184 184L267.69-400 480-612.31 692.31-400 664-371.69l-184-184Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.caretRight",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="m531.69-480-184-184L376-692.31 588.31-480 376-267.69 347.69-296l184-184Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.caretDown",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M480-371.69 267.69-584 296-612.31l184 184 184-184L692.31-584 480-371.69Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.caretLeft",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M560-267.69 347.69-480 560-692.31 588.31-664l-184 184 184 184L560-267.69Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.checkmark",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M382-267.69 183.23-466.46 211.77-495 382-324.77 748.23-691l28.54 28.54L382-267.69Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.copy",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M300-280v-560h440v560H300Zm40-40h360v-480H340v480ZM180-160v-535.38h40V-200h375.38v40H180Zm160-160v-480 480Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.edit",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M200-200h43.92l427.93-427.92-43.93-43.93L200-243.92V-200Zm-40 40v-100.77l555-556.08 101.62 102.54L260.77-160H160Zm600-555.54L715.54-760 760-715.54ZM649.5-649.5l-21.58-22.35 43.93 43.93-22.35-21.58Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.filter",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M440-200v-253.85L198-760h564L520-453.85V-200h-80Zm40-268 198-252H282l198 252Zm0 0Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.folder",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M120-200v-560h263.85l80 80H840v480H120Zm40-40h640v-400H447.77l-80-80H160v480Zm0 0v-480 480Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.folderOpen",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M120-200v-560h263.85l80 80h369.23v40H447.77l-80-80H160v478.46l90.62-303.08h664L811.54-200H120Zm81.69-40h579.85l78.92-264.62H280.62L201.69-240Zm0 0 78.93-264.62L201.69-240ZM160-640v-80 80Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.home",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M240-200h147.69v-235.38h184.62V-200H720v-360L480-741.54 240-560v360Zm-40 40v-420l280-211.54L760-580v420H532.31v-235.38H427.69V-160H200Zm280-310.77Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.hamburger",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M160-269.23v-40h640v40H160ZM160-460v-40h640v40H160Zm0-190.77v-40h640v40H160Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.label",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M120-200v-560h505.38L840-480 625.38-200H120Zm40-40h445.38L790-480 605.38-720H160v480Zm315.38-240Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.openInNew",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M160-160v-640h289.23v40H200v560h560v-249.23h40V-160H160Zm229.54-201.23-28.31-28.31L731.69-760H560v-40h240v240h-40v-171.69L389.54-361.23Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.refresh",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M483.08-200q-117.25 0-198.63-81.34-81.37-81.34-81.37-198.54 0-117.2 81.37-198.66Q365.83-760 483.08-760q71.3 0 133.54 33.88 62.23 33.89 100.3 94.58V-760h40v209.23H547.69v-40h148q-31.23-59.85-87.88-94.54Q551.15-720 483.08-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h42.46Q725.08-310.15 651-255.08 576.92-200 483.08-200Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.testCmd2",
    f: "svg",
    c: `<svg viewBox="0 0 24 24"><path d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z"/><path d="M10 9H14L10 13H14" stroke-linejoin="round"/><path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" /></svg>`,
  },
  {
    uri: "azos.ico.user",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M480-504.62q-49.5 0-84.75-35.25T360-624.62q0-49.5 35.25-84.75T480-744.62q49.5 0 84.75 35.25T600-624.62q0 49.5-35.25 84.75T480-504.62ZM200-215.38v-65.85q0-24.77 14.42-46.35 14.43-21.57 38.81-33.5 56.62-27.15 113.31-40.73 56.69-13.57 113.46-13.57 56.77 0 113.46 13.57 56.69 13.58 113.31 40.73 24.38 11.93 38.81 33.5Q760-306 760-281.23v65.85H200Zm40-40h480v-25.85q0-13.31-8.58-25-8.57-11.69-23.73-19.77-49.38-23.92-101.83-36.65-52.45-12.73-105.86-12.73t-105.86 12.73Q321.69-349.92 272.31-326q-15.16 8.08-23.73 19.77-8.58 11.69-8.58 25v25.85Zm240-289.24q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0-80Zm0 369.24Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.group",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M103.85-215.38v-65.85q0-27.85 14.42-47.89 14.42-20.03 38.76-32.02 52.05-24.78 103.35-39.51 51.31-14.73 123.47-14.73 72.15 0 123.46 14.73 51.31 14.73 103.35 39.51 24.34 11.99 38.76 32.02 14.43 20.04 14.43 47.89v65.85h-560Zm640 0v-67.7q0-34.77-14.08-65.64-14.07-30.87-39.92-52.97 29.46 6 56.77 16.65 27.3 10.66 54 23.96 26 13.08 40.77 33.47 14.76 20.4 14.76 44.53v67.7h-112.3Zm-360-289.24q-49.5 0-84.75-35.25t-35.25-84.75q0-49.5 35.25-84.75t84.75-35.25q49.5 0 84.75 35.25t35.25 84.75q0 49.5-35.25 84.75t-84.75 35.25Zm290.77-120q0 49.5-35.25 84.75t-84.75 35.25q-2.54 0-6.47-.57-3.92-.58-6.46-1.27 20.33-24.9 31.24-55.24 10.92-30.34 10.92-63.01t-11.43-62.44q-11.42-29.77-30.73-55.62 3.23-1.15 6.46-1.5 3.23-.35 6.47-.35 49.5 0 84.75 35.25t35.25 84.75ZM143.85-255.38h480v-25.85q0-14.08-7.04-24.62-7.04-10.53-25.27-20.15-44.77-23.92-94.39-36.65-49.61-12.73-113.3-12.73-63.7 0-113.31 12.73-49.62 12.73-94.39 36.65-18.23 9.62-25.27 20.15-7.03 10.54-7.03 24.62v25.85Zm240-289.24q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0 289.24Zm0-369.24Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.search",
    f: "svg",
    c: `
    <svg viewBox="0 -960 960 960"><path d="M779.38-153.85 528.92-404.31q-30 25.54-69 39.54t-78.38 14q-96.1 0-162.67-66.53-66.56-66.53-66.56-162.57 0-96.05 66.53-162.71 66.53-66.65 162.57-66.65 96.05 0 162.71 66.56Q610.77-676.1 610.77-580q0 41.69-14.77 80.69t-38.77 66.69l250.46 250.47-28.31 28.3ZM381.54-390.77q79.61 0 134.42-54.81 54.81-54.8 54.81-134.42 0-79.62-54.81-134.42-54.81-54.81-134.42-54.81-79.62 0-134.42 54.81-54.81 54.8-54.81 134.42 0 79.62 54.81 134.42 54.8 54.81 134.42 54.81Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.add",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M460-460H240v-40h220v-220h40v220h220v40H500v220h-40v-220Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.delete",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M240-160v-560h-40v-40h160v-30.77h240V-760h160v40h-40v560H240Zm40-40h400v-520H280v520Zm112.31-80h40v-360h-40v360Zm135.38 0h40v-360h-40v360ZM280-720v520-520Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.settings",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="m405.38-120-14.46-115.69q-19.15-5.77-41.42-18.16-22.27-12.38-37.88-26.53L204.92-235l-74.61-130 92.23-69.54q-1.77-10.84-2.92-22.34-1.16-11.5-1.16-22.35 0-10.08 1.16-21.19 1.15-11.12 2.92-25.04L130.31-595l74.61-128.46 105.93 44.61q17.92-14.92 38.77-26.92 20.84-12 40.53-18.54L405.38-840h149.24l14.46 116.46q23 8.08 40.65 18.54 17.65 10.46 36.35 26.15l109-44.61L829.69-595l-95.31 71.85q3.31 12.38 3.7 22.73.38 10.34.38 20.42 0 9.31-.77 19.65-.77 10.35-3.54 25.04L827.92-365l-74.61 130-107.23-46.15q-18.7 15.69-37.62 26.92-18.92 11.23-39.38 17.77L554.62-120H405.38ZM440-160h78.23L533-268.31q30.23-8 54.42-21.96 24.2-13.96 49.27-38.27L736.46-286l39.77-68-87.54-65.77q5-17.08 6.62-31.42 1.61-14.35 1.61-28.81 0-15.23-1.61-28.81-1.62-13.57-6.62-29.88L777.77-606 738-674l-102.08 42.77q-18.15-19.92-47.73-37.35-29.57-17.42-55.96-23.11L520-800h-79.77l-12.46 107.54q-30.23 6.46-55.58 20.81-25.34 14.34-50.42 39.42L222-674l-39.77 68L269-541.23q-5 13.46-7 29.23t-2 32.77q0 15.23 2 30.23t6.23 29.23l-86 65.77L222-286l99-42q23.54 23.77 48.88 38.12 25.35 14.34 57.12 22.34L440-160Zm38.92-220q41.85 0 70.93-29.08 29.07-29.07 29.07-70.92t-29.07-70.92Q520.77-580 478.92-580q-42.07 0-71.04 29.08-28.96 29.07-28.96 70.92t28.96 70.92Q436.85-380 478.92-380ZM480-480Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.save",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M800-663.08V-160H160v-640h503.08L800-663.08ZM760-646 646-760H200v560h560v-446ZM479.82-298.46q33.26 0 56.72-23.28T560-378.28q0-33.26-23.28-56.72t-56.54-23.46q-33.26 0-56.72 23.28T400-378.64q0 33.26 23.28 56.72t56.54 23.46ZM270.77-569.23h296.92v-120H270.77v120ZM200-646v446-560 114Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.download",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M480-336.92 338.46-478.46l28.31-28.77L460-414v-346h40v346l93.23-93.23 28.31 28.77L480-336.92ZM200-200v-161.54h40V-240h480v-121.54h40V-200H200Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.upload",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M460-336.92v-346l-93.23 93.23-28.31-28.77L480-760l141.54 141.54-28.31 28.77L500-682.92v346h-40ZM200-200v-161.54h40V-240h480v-121.54h40V-200H200Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.notification",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M200-209.23v-40h64.62v-316.92q0-78.39 49.61-137.89 49.62-59.5 125.77-74.11V-840h80v61.85q76.15 14.61 125.77 74.11 49.61 59.5 49.61 137.89v316.92H760v40H200Zm280-286.15Zm-.14 390.76q-26.71 0-45.59-18.98-18.89-18.98-18.89-45.63h129.24q0 26.85-19.03 45.73-19.02 18.88-45.73 18.88ZM304.62-249.23h350.76v-316.92q0-72.93-51.23-124.16-51.23-51.23-124.15-51.23-72.92 0-124.15 51.23-51.23 51.23-51.23 124.16v316.92Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.close",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.favorite",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="m480-173.85-30.31-27.38q-97.92-89.46-162-153.15-64.07-63.7-101.15-112.35-37.08-48.65-51.81-88.04Q120-594.15 120-634q0-76.31 51.85-128.15Q223.69-814 300-814q52.77 0 99 27t81 78.54Q514.77-760 561-787q46.23-27 99-27 76.31 0 128.15 51.85Q840-710.31 840-634q0 39.85-14.73 79.23-14.73 39.39-51.81 88.04-37.08 48.65-100.77 112.35Q609-290.69 510.31-201.23L480-173.85Zm0-54.15q96-86.77 158-148.65 62-61.89 98-107.39t50-80.61q14-35.12 14-69.35 0-60-40-100t-100-40q-47.77 0-88.15 27.27-40.39 27.27-72.31 82.11h-39.08q-32.69-55.61-72.69-82.5Q347.77-774 300-774q-59.23 0-99.62 40Q160-694 160-634q0 34.23 14 69.35 14 35.11 50 80.61t98 107q62 61.5 158 149.04Zm0-273Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.star",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143Zm-61 83.92 49.62-212.54-164.93-142.84 217.23-18.85L480-777.69l85.08 200.38 217.23 18.85-164.93 142.84L667-203.08 480-315.92 293-203.08ZM480-470Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.moreVertical",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M480-218.46q-16.5 0-28.25-11.75T440-258.46q0-16.5 11.75-28.25T480-298.46q16.5 0 28.25 11.75T520-258.46q0 16.5-11.75 28.25T480-218.46ZM480-440q-16.5 0-28.25-11.75T440-480q0-16.5 11.75-28.25T480-520q16.5 0 28.25 11.75T520-480q0 16.5-11.75 28.25T480-440Zm0-221.54q-16.5 0-28.25-11.75T440-701.54q0-16.5 11.75-28.25T480-741.54q16.5 0 28.25 11.75T520-701.54q0 16.5-11.75 28.25T480-661.54Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.moreHorizontal",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M258.46-440q-16.5 0-28.25-11.75T218.46-480q0-16.5 11.75-28.25T258.46-520q16.5 0 28.25 11.75T298.46-480q0 16.5-11.75 28.25T258.46-440ZM480-440q-16.5 0-28.25-11.75T440-480q0-16.5 11.75-28.25T480-520q16.5 0 28.25 11.75T520-480q0 16.5-11.75 28.25T480-440Zm221.54 0q-16.5 0-28.25-11.75T661.54-480q0-16.5 11.75-28.25T701.54-520q16.5 0 28.25 11.75T741.54-480q0 16.5-11.75 28.25T701.54-440Z"/></svg>`,
    attrs: { fas: true },
  },
  {
    uri: "azos.ico.apps",
    f: "svg",
    c: `<svg viewBox="0 -960 960 960"><path d="M240-190.77q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm240 0q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm240 0q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm-480-240q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm240 0q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm240 0q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm-480-240q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm240 0q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Zm240 0q-20.31 0-34.77-14.46-14.46-14.46-14.46-34.77 0-20.31 14.46-34.77 14.46-14.46 34.77-14.46 20.31 0 34.77 14.46 14.46 14.46 14.46 34.77 0 20.31-14.46 34.77-14.46 14.46-34.77 14.46Z"/></svg>`,
    attrs: { fas: true },
  },
]);
