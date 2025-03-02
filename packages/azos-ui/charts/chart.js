/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html, Part } from '../ui.js';
import * as echarts from "echarts";

/**
 * Chart part
 * @property {String} data - Chart data in JSON format as a string (not stringified)
 * @property {String} height - Chart height in CSS format (e.g. '400px')
 * @example see example-data.json
 * 
 * TODO: Add more properties to customize the chart, for now this is a basic chart
 * 
 */
export class Chart extends Part {

  static properties = {
    data: { type: String, reflect: true },
    height: { type: String, reflect: true }
  }

  constructor(data, height = '400px') {
    super();
    this.chart = null;
    this.data = data;
    this.height = height;
  }

  firstUpdated() {
    this.initChart(this.data);
  }

  initChart(data) {
    data = JSON.parse(data);
    const chartDom = this.renderRoot.getElementById('chart-container');
    this.chart = echarts.init(chartDom);

    /**
     * https://echarts.apache.org/en/option.html#grid.tooltip.axisPointer.label
     */
    const labelOption = {
      show: true,
      position: 'inside',
      distance: 20,
      align: 'left',
      verticalAlign: 'middle',
      rotate: 90,
      formatter: '{c}  {name|{a}}',
      fontSize: 16,
      rich: {
        name: {
          fontSize: 14,
        }
      }
    };

    /**
     * to style specific data points see
     * https://echarts.apache.org/examples/en/editor.html?c=bar-data-color
     */

    /**
     * to style an entire series see
     *         {
            "name": "Gamma",
            "type": "bar",
            "emphasis": {
                "focus": "series"
            },
            "itemStyle": {
              "color": "rgba(255, 0, 212, 0.5)",
              "shadowBlur": 200,
              "shadowColor": "rgba(0, 0, 0, 0.5)"
            },
            "data": [150, 232, 201, 154, 190]
        },
     */


    data.series.forEach(function (item) {
      item.label = labelOption;
    });

    const option = {
      ...data,
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        containLabel: true
      }
    };

    /**
     * https://echarts.apache.org/en/option.html#title
     */
    this.chart.setOption(option);

    window.addEventListener('resize', () => {
      this.chart.resize();
    });
  }

  renderPart() {
    return html`<div id="chart-container" style="width: 100%; height: ${this.height};"></div>`;
  }
}

customElements.define('az-chart', Chart);
