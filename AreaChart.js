export default AreaChart;
// input: selector for a chart container e.g., ".chart"
function AreaChart(container){
	// initialization
    const margin = ({top: 30, right: 50, bottom: 75, left: 50});
    const width = 700 - margin.left - margin.right,
          height = 200 - margin.top - margin.bottom;
    const svg = d3.select(container)
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const xScale = d3.scaleTime()
                     .range([0, width])
    const yScale = d3.scaleLinear()
                     .range([height, 0]);
    var path = svg.append("path")
                  .attr('class', 'path');
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    var drawY = svg.append('g')
                   .attr('class', 'axis y-axis');
    var drawX = svg.append('g')
                   .attr('class', 'axis x-axis')
                   .attr("transform", `translate(0, ${height})`);
	function update(data){ 
		// update scales, encodings, axes (use the total count)
        console.log('in update');
        xScale.domain(d3.extent(data, d => d.date));
		yScale.domain([0, d3.max(data, d => d.total)])
        var area = d3.area()
                     .x(d => xScale(d.date))
                     .y0(yScale(0))
                     .y1(d => yScale(d.total));
        d3.select('.path')
          .datum(data)
          .attr('d', area);
        drawX.call(xAxis);
        drawY.call(yAxis);
	}
    const listeners = {brushed: null};
    const brush = d3.brushX() 
                    // set the brush extent and callbacks for "brush" and "end" events
                    .extent([[0, 0], [width, height]])
                    .on("end", brushed);
    svg.append("g")
       .attr('class', 'brush')
       .call(brush);
    function brushed(event) {
        if (event.selection) {
            console.log("brushed", event.selection);
            let selection = event.selection;
            listeners["brushed"] (selection.map(xScale.invert));
        }
    }
    function on(event, listener) {
		listeners[event] = listener;
    }
	return {
		update, // ES6 shorthand for "update": update
        on
	};
}