import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

var data;
var keys;
function sumUnemployment (data) {
    for (let i = 0; i < data.length; i++) {
        data[i].total = 0
        for (let j = 0; j < keys.length; j++) {
            data[i].total += data[i][keys[j]];
        }
    }
}

d3.csv('unemployment.csv', d3.autoType).then(d => {data = d;
                                                   keys = data.columns.slice(1);
                                                   sumUnemployment(data);
                                                   const stackedChart = StackedAreaChart(".chart-container1");
                                                   stackedChart.update(data);
                                                   const areaChart = AreaChart(".chart-container2");
                                                   areaChart.update(data);
                                                   areaChart.on("brushed", (range)=>{stackedChart.filterByDate(range);})}); // coordinating with stackedAreaChart