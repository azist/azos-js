/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { describe, it } from "mocha";
import * as aver from "../aver.js";
import { ABSTRACT } from "../coreconsts.js"
import { ILog } from "../ilog.js";
import { application } from "../application.js";
import { Verbatim } from "../conf.js";
import { dispose } from "../types.js";


class IMemoryLog extends ILog{
  #buffer;
  constructor(dir, cfg){
    super(dir, cfg);
    this.#buffer = cfg.get("buffer");
  }
  _doWrite(msg){ this.#buffer.push(msg); }
}


describe("#AppLog", function() {

  it("Basic1",   function() {

    let logBuffer = [];

    const app = application({
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
