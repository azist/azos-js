/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

//import { describe, it } from "mocha";
import { defineUnit as describe, defineCase as it } from "../run.js";
import * as aver from "../aver.js";
import { ILog } from "../ilog.js";
import * as log from "../log.js";
import { application } from "../application.js";
import { Verbatim } from "../conf.js";
import { dispose, AzosError } from "../types.js";


class IMemoryLog extends ILog{
  #buffer;
  constructor(dir, cfg){
    super(dir, cfg);
    this.#buffer = cfg.get("buffer");
  }
  _doWrite(msg){ this.#buffer.push(msg); }
}


describe("#AppLog", function() {

  it("write membuffer",   function() {

    let logBuffer = [];

    const app = application({
      //logLevel: "info",
      modules: [
        {name: "log", type: IMemoryLog, buffer: new Verbatim(logBuffer)}
      ]
    });

    app.log.write({text: "Message 1"});
    app.log.write({text: "Message 2"});
    app.log.write({text: "3 Message"});

    dispose(app);

    aver.areEqual(3, logBuffer.length);
    aver.areEqual("Message 1", logBuffer[0].text);
    aver.areEqual("Message 2", logBuffer[1].text);
    aver.areEqual("3 Message", logBuffer[2].text);
  });

});

describe("Log.Common", function() {

  it("exceptionToData(new Error())",   function() {
    const got = log.exceptionToData(new Error("crap message"));
    console.log(JSON.stringify(got, null, 2));
    aver.areEqual("Error", got["TypeName"]);
    aver.areEqual("crap message", got["Message"]);
    aver.areEqual(0, got["Code"]);
    aver.areEqual("", got["Source"]);
    aver.isTrue(got["StackTrace"].length > 0);
  });

  it("exceptionToData(throw new Error())",   function() {
    try{
      throw new Error("crap message");
    } catch(err) {
      const got = log.exceptionToData(err);
      console.log(JSON.stringify(got, null, 2));
      aver.areEqual("Error", got["TypeName"]);
      aver.areEqual("crap message", got["Message"]);
      aver.areEqual(0, got["Code"]);
      aver.areEqual("", got["Source"]);
      aver.isTrue(got["StackTrace"].length > 0);
    }
  });

  it("exceptionToData(new AzosError())",   function() {
    const got = log.exceptionToData(new AzosError("AZ5 msg", "reactor4", null, -1234));
    console.log(JSON.stringify(got, null, 2));
    aver.areEqual("AzosError -1234 @ 'reactor4'", got["TypeName"]);
    aver.areEqual("AZ5 msg", got["Message"]);
    aver.areEqual(-1234, got["Code"]);
    aver.areEqual("reactor4", got["Source"]);
    aver.isTrue(got["StackTrace"].length > 0);
  });

  it("exceptionToData(throw new AzosError(nested))",   function() {
    try{
      try{
        throw new AzosError("Inner msg", "site-3", null, 37);
      }catch(inner){
        throw new AzosError("AZ5 msg", "reactor4", inner, -1234);
      }
    } catch(err) {
      const got = log.exceptionToData(err);
      console.log(JSON.stringify(got, null, 2));
      aver.areEqual("AzosError -1234 @ 'reactor4'", got["TypeName"]);
      aver.areEqual("AZ5 msg", got["Message"]);
      aver.areEqual(-1234, got["Code"]);
      aver.areEqual("reactor4", got["Source"]);
      aver.isTrue(got["StackTrace"].length > 0);
      aver.isObject(got["ExternalStatus"]);
      aver.areEqual("js", got["ExternalStatus"]["ns"]);

      const cause = got["InnerException"];
      aver.isObject(cause);
      aver.areEqual("AzosError 37 @ 'site-3'", cause["TypeName"]);
      aver.areEqual("Inner msg", cause["Message"]);
      aver.areEqual(37, cause["Code"]);
      aver.areEqual("site-3", cause["Source"]);
      aver.isTrue(cause["StackTrace"].length > 0);
      aver.isObject(cause["ExternalStatus"]);
      aver.areEqual("js", cause["ExternalStatus"]["ns"]);
    }
  });


});
