/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import * as types from "./types.js";
import * as aver from "./aver.js";
import { Application } from "./application.js";
import { AppComponent } from "./components.js";

/**
 * Arena represents a virtual "stage" - what application/user "deals with"
 * e.g. sees at the present moment.
 * An arena maintains a state of scenes which get created by components such as
 * modal dialogs which have a stacking order
 */
export class Arena extends AppComponent{

  constructor(app){
    aver.isOf(app, Application);
    super(app);
  }

}
