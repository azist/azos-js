/*<FILE_LICENSE>
 * Azos (A to Z Application Operating System) Framework
 * The A to Z Foundation (a.k.a. Azist) licenses this file to you under the MIT license.
 * See the LICENSE file in the project root for more information.
</FILE_LICENSE>*/

import { html } from "../../ui";
import { CaseBase } from "./case-base";

export class CaseCharts extends CaseBase {


  renderControl() {
    return html`
<h2>Charts</h2>


<az-chart height="250px" data='{
    "title": {
        "text": "title.text",
        "subtext": "title.subtext title.left (center) title.top (5)",
        "left": "center",
        "top": 5
    },
    "tooltip": {
        "trigger": "axis",
        "axisPointer": {
            "type": "shadow"
        }
    },
    "legend": {
        "bottom": -20,
        "padding": 20,
        "data": ["Alpha", "Beta", "Gamma", "Delta"]
    },
    "xAxis": [
        {
            "type": "category",
            "axisTick": { "show": false },
            "data": ["2012", "2013", "2014", "2015", "2016"]
        }
    ],
    "yAxis": [
        {
            "type": "value"
        }
    ],
    "series": [
        {
            "name": "Alpha",
            "type": "bar",
            "barGap": 0,
            "emphasis": {
                "focus": "series"
            },
            "data": [320, 332, 301, 334, 390]
        },
        {
            "name": "Beta",
            "type": "bar",
            "emphasis": {
                "focus": "series"
            },
            "data": [220, 182, 191, 234, 290]
        },
        {
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
        {
            "name": "Delta",
            "type": "bar",
            "emphasis": {
                "focus": "series"
            },
            "data": [98, 77, 101, 99, 40]
        }
    ]
}
' id="chart" scope="this"></az-chart>

<az-chart height="400px" data='
{
    "title": {
        "text": "Monthly Revenue and Expenses Data",
        "subtext": "Demo Data 2",
        "left": "150",
        "top": 5
    },
    "tooltip": {
        "trigger": "axis",
        "axisPointer": {
            "type": "shadow"
        }
    },
    "legend": {
        "bottom": 0,
        "padding": 20,
        "data": ["Revenue", "Expenses"]
    },
    "xAxis": [
        {
            "type": "category",
            "axisTick": { "show": false },
            "data": ["2019", "2020", "2021", "2022", "2023"]
        }
    ],
    "yAxis": [
        {
            "type": "value"
        }
    ],
    "series": [
        {
            "name": "Revenue",
            "type": "bar",
            "barGap": 0,
            "emphasis": {
                "focus": "series"
            },
            "data": [500, 620, 720, 850, 950]
        },
        {
            "name": "Expenses",
            "type": "bar",
            "emphasis": {
                "focus": "series"
            },
            "data": [300, 400, 450, 500, 550]
        }
    ]
}'></az-chart>

    `;
  }
}

window.customElements.define("az-case-charts", CaseCharts);
