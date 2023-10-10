/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

//MANUAL TESTING
//$ node tezt.mjs

import {Configuration} from "azos/conf";

const cfg = new Configuration({
  a: 2,
  b: -4,
  c: true,
  d:{ a: -2, b: { v: -9}},
  e: [1, 2, {a: {b: { flag: -90e4 }}}]
});

console.info(cfg.root.name);
console.info(cfg.root.get("a"));
console.info(cfg.root.get("b"));

console.info(cfg.root.get("d")?.get("a"));

for(let one of cfg.root.get("e")){
  console.info(one);
}

console.info(cfg.root.get("e").get(2).name);
console.info(cfg.root.get("a").toString());
console.info(cfg.root.get("d").toString());
console.info(cfg.root.get("e").toString());

console.info(cfg.root.get("d").get("b").path);
console.info(cfg.root.get("e").get("2").get("a").get("b").path);

console.info(cfg.root.nav("/e/#2/a/b").path);
console.info(cfg.root.nav("/e/#2/a/b/$flag"));
