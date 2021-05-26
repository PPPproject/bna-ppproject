// setup
var w = 1400;
var h = 700;
var svgContainer = d3.select("#daniel-map")
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 " + w + " " + h)
                .style("background","whitesmoke")
                .classed("svg-content", true);
var projection = d3.geoMercator()
                    .scale(1000 * 2)
                    .center([-120, 36])
                    .translate([w/2, h/2]);		
var path = d3.geoPath().projection(projection);
var color = d3.scaleQuantize([0,3000],d3.schemeBlues[9]);

var map = d3.json("assets/data/ca.topojson");
var data = d3.csv("assets/data/county_pc_rates.csv");

// main function call
Promise.all([map, data]).then(function(values){
    // topojson to geojson
    var topo = values[0];
    // console.log(topo);
    // console.log(topo.objects.subunits);
    var geo = (topojson.feature(topo, topo.objects.subunits));
    var countyData = values[1];
    // console.log(countyData);
    // console.log(geo.features);
    svgContainer.append("g")
        .selectAll("path")
        .data(geo.features)
        .enter()
        .append("path")
        //.join("path")
            .attr("d", path)
            .attr("class","county")
            //image attributes
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill", "blue")
            .attr("fill", function(d){
                var stat = 0
                for(let i=0; i<countyData.length; i++){
                    if(countyData[i]["ProjectCountyName"]==d.properties["name"].toUpperCase()){
                        stat = countyData[i]["pc.curr.app.amt"]
                        break;
                    }
                }
                return color(stat);
            })
            .attr("fill-opacity", 1)
            .attr("fill-rule", "nonzero")
            // tooltip! -- LILY INTEGRATE
            .on('click', function(d, i) {
                var stat = 0
                alert(d.properties["name"]); // get county name from click. Beautiful.
                for(let i=0; i<countyData.length; i++){
                    if(countyData[i]["ProjectCountyName"]==d.properties["name"].toUpperCase()){
                        stat = countyData[i]["pop"]
                        break;
                    }
                }
                d3.select(this)
                .transition()
                .duration(100)
                .attr("fill-opacity", 1)    
                });
});