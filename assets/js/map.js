// setup
var w = 1400;
var h = 700;
var county = "LOS ANGELES";

var svgContainer = d3.select("#map")
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
            .attr("stroke-width", 0.75)
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
            .on('mouseover', function(d) {
                console.log(d.properties["name"].toUpperCase());
                d3.select(this).style('stroke-width',1).style('stroke','orange');
            })
            .on('mouseout', function(d) {
                console.log(d.properties["name"].toUpperCase());
                d3.select(this).style('stroke-width',0.75).style('stroke','black');
            })
            .on('click', function(d, i) {
                
                // update county variable
                county = d.properties["name"].toUpperCase();
                // console.log(county);

                // draw Vega maps
                var county_maps = {
                    // title: {field: 'ProjectCountyName', type:'nominal'},
                    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                    background: 'whitesmoke',
                    description: 'Filterable bar chart of racial demographics with available data.',
                    data: {url:"https://raw.githubusercontent.com/lilyjtaylor22/stan20-21/main/demog.csv"}, // relative path didn't work ... troubleshoot that later
                    hconcat: [
                        {
                            transform: [{filter: `datum.ProjectCountyName=="${county}"`},
                                        {filter: 'year(datum.DateApproved)<2021'},
                                        {filter: 'month(datum.DateApproved)=="03"'} // for some reason this does the month AFTER the one you put 
                                ],
                            mark: 'bar',
                            encoding: {
                                x: {field: 'DateApproved', type: 'temporal', title:'Date Approved'},
                                y: {field: 'InitialApprovalAmount', type: 'quantitative', aggregate:'mean', title:'Mean Approval Amount'},
                                color: {field:'Race', type: 'nominal'}, // default Tableau10
                                tooltip: [{field:'ProjectCountyName', type:'Nominal'}, 
                                            {field:'Race', type:'Nominal'}, 
                                            {field:'InitialApprovalAmount', type: 'quantitative', aggregate:'mean', title:'Init. App. Amt.'} // figure out how to aggregate this stat. 
                                ]
                            }
                        },
                        {
                            transform: [{filter: `datum.ProjectCountyName=="${county}"`},
                                        {filter: 'year(datum.DateApproved)<2021'},
                                        {filter: 'month(datum.DateApproved)=="03"'} // for some reason this does the month AFTER the one you put 
                                ],
                            mark: 'bar',
                            encoding: {
                                x: {field: 'DateApproved', type: 'temporal', title:'Date Approved'},
                                y: {field: 'InitialApprovalAmount', type: 'quantitative', aggregate:'mean', title:'Mean Approval Amount'},
                                color: {field:'Gender', type: 'Nominal'}, // default Tableau10
                                tooltip: [{field:'ProjectCountyName', type:'Nominal'}, 
                                            {field:'Gender', type: 'Nominal'}, 
                                            {field:'InitialApprovalAmount', type: 'Quantitative', aggregate:'mean', title:'Init. App. Amt.'} // figure out how to aggregate this stat. 
                                ]
                            }
                        }
                ]};
                vegaEmbed('#race', county_maps);
            });

            // rehook up to full dataset with local dependency
});

