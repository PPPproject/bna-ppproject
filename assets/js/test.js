var w = 1000;
var h = 700;

// plot container on page
var svg = d3.select("#viz-3")
    .append("svg")
    .attr("viewBox", "0 0 " + w + " " + h)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("background-color", "whitesmoke")
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
svg.append("circle")
        .attr('cx',25)
        .attr('cy',25)
        .attr('r',15)
        .style('fill','purple');