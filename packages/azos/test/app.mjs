import {suite, Runner, cmdArgsCaseFilter} from "../run.js";
import "./aver-tests.js";
//import "./conf-tests.js";


//run.defineSuite();
suite().run(new Runner(cmdArgsCaseFilter));
