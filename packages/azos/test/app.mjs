/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import {suite, Runner, cmdArgsCaseFilter, defineUnit, defineCase} from "../run.js";
import * as aver from "../aver.js";

import "./types-tests.js";
import "./aver-tests.js";
import "./strings-tests.js";
import "./linq-tests.js";
import "./localization-tests.js";
import "./conf-tests.js";
import "./atom-tests.js";
import "./entity-id-tests.js";

import "./app-lifecycle.js";
import "./app-mod-tests.js";
import "./linker-tests.js";
import "./linker-tests2.js";
import "./time-tests.js";
import "./router-tests.js";
import "./img-registry-tests.js";
import "./app-log-tests.js";
import "./security-tests.js";

////clearSuite();

defineUnit("RunnerSystemTests", function(){

  defineCase("function", function(){
    aver.areEqual(4, 2 + 2);
  });

  defineCase("arrow", () => aver.areEqual(5, 2 + 3));

  defineCase("async-arrow-instant", async () => aver.areEqual(5, 2 + 3));
  defineCase("async-arrow-delay", async () => await new Promise(r => setTimeout(r, 250)));

  defineCase("promise-fun-instant", function(){ return Promise.resolve(123); } );
  defineCase("promise-fun-delay", function(){ return new Promise(r => setTimeout(r, 250)); });

  defineUnit("SkippedUnitWhichWillNeverRun", function(){
    defineCase("never-run", function(){  });
  }, () => true);

  defineCase("this-case-will-be-skipped", function(){  }, () => true);

});

//run.defineSuite();
const runner = new Runner(cmdArgsCaseFilter);

//Cant use `await` because Parcel compiles into CJS bro target
//top level module awaits can only be used in ES modules
//////await suite().run(runner);
//////process.exitCode = runner.countError;
suite().runIfMatch(runner)
       .then(() => {
          runner.summarize();
          if (runner.countError > 0){
            console.warn(`\x1b[93m\x1b[40m  *** Test suite has ${runner.countError} errors !!! *** \x1b[0m`);
            process.exitCode = runner.countError;//process is polyfilled by Parcel
          }
        });


