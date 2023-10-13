/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

//MANUAL TESTING
//$ node tezt.mjs

import {ConfigNode, config, makeNew} from "azos/conf";


class ClassA{
  #msg = null;
  constructor(d, n){
   console.debug(`In ClassA ctor(${arguments.length})`);
   console.dir(arguments);
   this.#msg = n.getString("msg", "message")
  }

  toString(){ return this.#msg;}
}


const cfg = config({
  "22": 23,
  a: 2,
  b: -4,
  c: true,
  d: {
    a: -2,
    b: {v: -9}
  },
  msg: ["String 1", "String2: $(/a)$(2)", "String 3: $(../e/2/a/b/val)"],
  e: [1, 2, {a: {b: {flag: -90e4, val: "Hello: $(/ra)" }}}],
  n: null,
  //s: "  ",
  kpss: "zzz",
  udf: undefined,

  vs: "Lenin jiv!",
  vi: "21",
  vr: "-14.000456",
  vb: "yes",
  vd: "1/1/1980",
  vm: "123.89601",

  vvar: "a=$(vs) b=$(vi) flag=$(/e/#2/a/b/flag) esc=$(^^^escaped)",

  ra: "$(rb)",
  rb: "Something $(rc)",
  rc: "Loop $(/ra)",

  session: { type: ClassA, msg: "I am good!" }
});


const dir = {};
console.dir(cfg.root.nav("/session"));
const obj = makeNew(cfg.root.nav("/session"), dir, null, [5, true, "potz"]);
//const obj = makeNew(ClassA, dir, null, [5, true, "potz"]);
console.log(obj.toString());
console.dir(obj);
process.exit(0);


//console.info(cfg.root.nav("/e/#2/a/b").evaluate("$(/ra)"));//.get("val"));
//console.info(cfg.root.nav("/e/#2/a/b").get("val"));
console.info(cfg.root.get("msg").get(1));
process.exit(0);

console.info(cfg.root.getString(["vsw", "vs"], "Kakurba"));
console.info(cfg.root.getInt(["vsw", "vi"], 45));
console.info(cfg.root.getReal(["vsw", "vr"], 41.6));
console.info(cfg.root.getBool(["vsw", "vb"], false));
console.info(cfg.root.getTriBool(["vsw", "vb"], false));
console.info(cfg.root.getDate(["vsw", "vd"], new Date()));
console.info(cfg.root.getMoney(["vsw", "vm"], 100.00));

console.info(cfg.root.getVerbatim("vvar"));
console.info(cfg.root.get("dontExist", "vvar"));
console.info(cfg.root.getString(["nothere", "vvar"], "Nothing came"));

console.info(cfg.root.evaluate("x = $(d/a) and b = $(/e/#2/a/b/flag)"));


//process.exit(0);

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
console.info(cfg.root.nav("/e/#2/a/b/flag"));

console.info(cfg.root.get("e").get('#2').get('a').get('b').get('flag'));

console.info(` root.n = ${cfg.root.get("n")}   root.udf = ${cfg.root.get("udf")}`);

console.info(cfg.root.getString(["kpss","a"], null));
console.info(cfg.root.getString(["s", "a", "kpss"], "football"));
