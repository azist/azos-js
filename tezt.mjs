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
  d:{ a: -2, b: true},
  e: [1,2,{}]
});

console.info(cfg.root.name);
console.info(cfg.root.get("a"));
console.info(cfg.root.get("b"));

console.info(cfg.root.get("d")?.get("a"));

for(let one of cfg.root.get("e")){
  console.dir(one);
}

console.info(cfg.root.get("e").get(2).name);
