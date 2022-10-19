export default StackedAreaChart;
function StackedAreaChart(container) {
	// initialization
    const margin = ({top: 30, right: 50, bottom: 75, left: 50});
    const width = 700 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;
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
    const color = d3.scaleOrdinal(d3.schemeTableau10);
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    var drawY = svg.append('g')
                   .attr('class', 'axis y-axis');
    var drawX = svg.append('g')
                   .attr('class', 'axis x-axis')
                   .attr("transform", `translate(0, ${height})`);
    let selected = null, xDomain, data;
	function update(_data){
        data = _data;
        console.log(data)
        var keys = selected ? [selected] : data.columns.slice(1);
        var stack = d3.stack()
                      .keys(keys)(data);
        xScale.domain(xDomain ? xDomain : d3.extent(data, d => d.date));
        yScale.domain([0, d3.max(stack, d => d3.max(d, d => d[1]))]);
        color.domain(keys);

        svg.append('defs')
           .append('clipPath')
           .attr('id', 'clip')
           .append('rect')
           .attr('width', width)
           .attr('height', height);
        var area = d3.area()
                     .x(d => xScale(d.data.date))
                     .y0(d => yScale(d[0]))
                     .y1(d => yScale(d[1]));
        const areas = svg.selectAll(".area")
                         .data(stack, d => d.key);
        areas.enter()
             .append("path")
             .attr('class', 'area')
             .merge(areas)
             .attr("fill", ({key}) => color(key))
             .attr("d", area)
             .attr("clip-path", "url(#clip)")
             .on("mouseover", (event, d, i) => tooltip.text(d.key))
             .on("mouseout", (event, d, i) => tooltip.text(""))
             .on("click", (event, d) => {// toggle selected based on d.key
                                         if (selected === d.key) {selected = null;} 
                                         else {selected = d.key;}
                                         update(data); // simply update the chart again
                                        });
        areas.exit()
             .remove();
        drawX.call(xAxis);
        drawY.call(yAxis);
	}
    function filterByDate(timeRange) {
        xDomain = timeRange;
        update(data);
    }
    const tooltip = svg.append("text")
                       .attr("x", 20)
                       .attr("y", -5);
	return {
		update,
        filterByDate
	}
}