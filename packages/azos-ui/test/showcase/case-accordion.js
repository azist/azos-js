/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseAccordion extends CaseBase {

  renderControl() {
    return html`
<h2>Accordion (WIP)</h2>
<az-accordion name="accordion" width="75%" align="center" activeItemIndex="0">
  <az-accordion-item title="First accordion item">
    <p>Eu culpa dolore adipisicing qui cillum duis incididunt consequat amet. <strong><em>Non ipsum nostrud</em></strong> culpa nulla quis dolor culpa commodo anim labore sit fugiat culpa minim. Adipisicing et qui ex cupidatat excepteur anim laborum eiusmod aute amet cupidatat et. Eiusmod qui eiusmod Lorem amet cupidatat esse aliqua ipsum ex laborum officia reprehenderit incididunt adipisicing. Sint quis cupidatat commodo aliquip mollit enim voluptate dolore consectetur.</p>
    <h3>Irure minim qui esse dolor. Reprehenderit culpa minim reprehenderit Lorem exercitation cillum magna laboris. Ea in dolor ut ipsum officia commodo sit. Veniam ut nulla culpa veniam tempor duis aliquip in velit consequat incididunt enim reprehenderit.</h3>
    <blockquote>Magna pariatur reprehenderit ullamco labore. Ullamco deserunt enim irure ex Lorem ex. Est proident nulla fugiat fugiat non incididunt dolore pariatur. Commodo do quis nulla elit non id in est esse est anim adipisicing id. Culpa eu fugiat qui et et. Culpa esse occaecat aliqua nostrud et cupidatat. Aute ipsum voluptate exercitation quis labore exercitation aliquip ad exercitation non irure.</blockquote>
    <p>Laboris sint elit incididunt sit consectetur consectetur aliquip consequat nostrud eu nostrud ullamco ad. Aliquip laboris adipisicing Lorem quis occaecat reprehenderit. Nostrud voluptate sunt est commodo. Lorem eiusmod laboris non non.</p>
  </az-accordion-item>
  <az-accordion-item title="Item #2 going #2 all over the fkin place">
    <h1 style="text-decoration:strikethrough;"><em>Tempor quis sit eu laborum velit enim irure velit quis.</em></h1>
  </az-accordion-item>
  <az-accordion-item title="This is for Item #3">
    <h3>Item 3</h3>
    <p>Lorem ipsum odor amet, consectetuer adipiscing elit. Leo montes commodo tempor egestas facilisis ullamcorper. Morbi nulla magnis himenaeos eros dapibus varius, cursus elit rutrum. Consectetur dapibus malesuada enim adipiscing facilisi iaculis. Imperdiet at ex dolor nibh habitant tortor senectus ultrices. Maecenas hendrerit risus fringilla maecenas consectetur viverra. Tempor congue placerat nullam sagittis praesent egestas? Lobortis feugiat montes nam neque tellus. Himenaeos magna aptent habitant est lacinia ut. Fringilla semper ex facilisi et quam eget augue proin sit.</p>
    <p>Porttitor odio laoreet tempor pulvinar gravida id. Habitasse integer torquent per dignissim sed hac. Tortor posuere lectus neque sollicitudin vehicula; curae duis. Per ridiculus curae malesuada pharetra nostra vivamus. Faucibus amet phasellus lacinia congue dapibus condimentum nostra mattis. Pulvinar platea id venenatis mattis torquent eros conubia. Sapien adipiscing nisi nisi cubilia nec turpis. Posuere at potenti sed vel mauris ullamcorper cubilia. Ultricies condimentum nascetur magnis torquent quis nibh.</p>
    <p>Phasellus posuere ut sapien rutrum dignissim enim leo. Quis cubilia ridiculus, primis justo turpis semper senectus. Habitant dis class lobortis, amet potenti himenaeos. Tellus platea suspendisse montes, mus dis cursus magnis. Imperdiet molestie aenean auctor odio sapien. Alaoreet risus senectus scelerisque litora adipiscing nisl vel nisi. Natoque varius lectus nibh dignissim viverra sodales. Fusce mattis tortor proin condimentum hendrerit.</p>
    <p>Eget gravida sit venenatis posuere amet congue. Orci congue etiam volutpat ultricies finibus cursus velit ad. Aliquet lectus pulvinar lacinia rhoncus lectus aenean malesuada nibh. Vestibulum eros justo proin; nullam ut sapien ante. Nascetur porta class; nascetur eu pellentesque primis. Ad pretium litora fermentum, sem fermentum habitant suscipit. Sociosqu mattis facilisis senectus morbi porta laoreet, maximus dolor. Viverra aptent a sit posuere nisl in enim. Netus nec interdum diam nascetur fermentum, magnis dapibus mattis lacinia.</p>
    <p>Integer dapibus facilisis aliquam placerat nascetur elementum, proin netus montes. Turpis amet est pharetra facilisi eget scelerisque. Ut neque erat sodales at tortor nisi inceptos luctus. Dapibus accumsan nulla purus consectetur tincidunt hac consequat duis. Torquent ipsum viverra nisl gravida penatibus nascetur dui ad. Morbi vestibulum vehicula semper potenti sapien sociosqu. Ligula praesent dignissim senectus aenean dictum condimentum erat.</p>
  </az-accordion-item>
</az-accordion>
    `;
  }
}

window.customElements.define("az-case-accordion", CaseAccordion);
