import {suite, Runner, cmdArgsCaseFilter} from "../run.js";
import "./types-tests.js";
import "./aver-tests.js";
import "./strings-tests.js";
import "./linq-tests.js";
import "./localization-tests.js";
import "./conf-tests.js";

import "./app-mod-tests.js";
import "./linker-tests.js";
import "./app-log-tests.js";


//run.defineSuite();
suite().run(new Runner(cmdArgsCaseFilter));
