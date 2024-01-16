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

import "./app-mod-tests.js";
import "./linker-tests.js";
import "./app-log-tests.js";
import "./security-tests.js";

////clearSuite();

defineCase("runner.function", function(){
  aver.areEqual(4, 2 + 2);
});

defineCase("runner.arrow", () => aver.areEqual(5, 2 + 3));

defineCase("runner.asyncArrowInstant", async () => aver.areEqual(5, 2 + 3));
defineCase("runner.asyncArrowDelay", async () => await new Promise(r => setTimeout(r, 100)));

defineCase("runner.promiseFunctionInstant", function(){ return Promise.resolve(123); } );
defineCase("runner.promiseFunctionDelay", function(){ return new Promise(r => setTimeout(r, 100)); });

defineUnit("Runner.SkippedUnit", function(){
  defineCase("nevrRun", function(){  });
}, () => true);
defineCase("runner.thisCaseWillBeSkipped", function(){  }, () => true);


//run.defineSuite();
const runner = new Runner(cmdArgsCaseFilter);

//Cant use `await` because Parcel compiles into CJS bro target
//top level module awaits can only be used in ES modules
//////await suite().run(runner);
//////process.exitCode = runner.countError;
suite().run(runner)
       .then(() => {
          if (runner.countError > 0){
            console.warn(`\x1b[93m\x1b[40m  *** Test suite has ${runner.countError} errors !!! *** \x1b[0m`);
            process.exitCode = runner.countError;//process is polyfilled by Parcel
          }
        });


