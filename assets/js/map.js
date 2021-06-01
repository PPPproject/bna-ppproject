// setup
var w = 450;
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
                    .center([-119, 36])
                    .translate([w/2, h/2]);		
var path = d3.geoPath().projection(projection);
var color = d3.scaleQuantize([0,3000],d3.schemeBlues[9]);

var map = d3.json("assets/data/ca.topojson");
var data = d3.csv("assets/data/county_pc_rates.csv");

function mouseover() {
    
};

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
            .attr("stroke-width", 0.5)
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
                // console.log(d.properties["name"].toUpperCase());
                d3.select(this).style('stroke-width',1).style('stroke','#e49444').style('cursor','pointer'); // cannot get mouse icon to change
            })
            .on('mouseout', function(d) {
                // console.log(d.properties["name"].toUpperCase());
                d3.select(this).style('stroke-width',0.5).style('stroke','black');
                d3.select(this).style("cursor", "default"); 
            })
            .on('click', function(d, i) {
                
                // update county variable
                county = d.properties["name"].toUpperCase();
                // console.log(county);

                // draw Vega county maps
                var county_maps = {
                    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
                    description: 'Two bar chart of racial and gender demographics with available data in selected county.',
                    background: 'whitesmoke',
                    data: {url:"assets/data/demog.csv"},
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
                                tooltip: [{field:'ProjectCountyName', type:'Nominal', title:'County'}, 
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
                                tooltip: [{field:'ProjectCountyName', type:'Nominal', title:'County'}, 
                                            {field:'Gender', type: 'Nominal'}, 
                                            {field:'InitialApprovalAmount', type: 'Quantitative', aggregate:'mean', title:'Init. App. Amt.'} // figure out how to aggregate this stat. 
                                ]
                            }
                        }
                ]};
                vegaEmbed('#race', county_maps);

                // give summary/overview dashboard
                // var overview = {
                //     $schema: "https://vega.github.io/schema/vega-lite/v5.json",
                //     description: 'One summary dashboard of county stats during entirety of PPP Loan Program',
                //     data: {url:'assets/data/county_pc_rates.csv'},
                //     mark: 'bar',
                //     encoding: {
                //         x: {field: 'ProjectCountyName', type: 'Nominal', title:'County'},
                //         y: {field: 'c.num.entries', type: 'Quantitative', title:'PC Loans Dispersed'},
                //         color: {field:'Race', type: 'nominal'}, // change this to highlight action?
                //         tooltip: [{field:'ProjectCountyName', type:'Nominal', title:'County'}, 
                //                     {field: 'pc.num.entries', type: 'Quantitative', title:'PC Loans Dispersed'}
                //         ]
                //     }
                    // params: [
                    //     {
                    //       name: "highlight",
                    //       select: {type: "point", on: "mouseover"}
                    //     },
                    //     {name: "select", select: "point"}
                    //   ],
                    //   mark: {
                    //     type: "bar",
                    //     fill: "#4C78A8",
                    //     stroke: "black",
                    //     cursor: "pointer"
                    //   },
                    //   encoding: {
                    //     x: {field: "ProjectCountyName", type: "Nominal"},
                    //     y: {field: "pc.num.entries", type: "Quantitative"},
                    //     fillOpacity: {
                    //       condition: {param: "select", value: 1},
                    //       value: 0.3
                    //     },
                    //     strokeWidth: {
                    //       condition: [
                    //         {
                    //           param: "select",
                    //           empty: false,
                    //           value: 2
                    //         },
                    //         {
                    //           param: "highlight",
                    //           empty: false,
                    //           value: 1
                    //         }
                    //       ],
                    //       value: 0
                    //     }
                    //   },

                // }
                // vegaEmbed('#overview', overview);
            });
});

