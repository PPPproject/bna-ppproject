// static size variables ... tweak to dynamic
var margin = {top: 20, right: 30, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// plot container on html page
let svgPlotContainer = d3.select("#section-1").selectAll('div') // the select is not ocnnecting here...
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background-color", "whitesmoke")
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// test circle
svgPlotContainer.append("circle")
    .attr('cx',25)
    .attr('cy',25)
    .attr('r',15)
    .style('fill','purple')