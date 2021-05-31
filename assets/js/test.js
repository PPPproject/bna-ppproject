var overview = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        description: 'One summary dashboard of county stats during entirety of PPP Loan Program.',
        data: {url:"assets/data/county_pc_rates.csv"},
        transform: [{filter: 'year(datum.DateApproved)<2021'},
                        {filter: 'month(datum.DateApproved)=="03"'}], 
        mark: 'bar',
        encoding: {
                x: {field: 'ProjectCountyName', type: 'Nominal', title:'County'},
                y: {field: 'pc.num.entries', type: 'quantitative', title:'Mean Approval Amount'},
                color: {field:'Race', type: 'nominal'}, // default Tableau10
                tooltip: [{field:'ProjectCountyName', type:'Nominal', title:'County'}, 
                        {field:'pc.num.entries', type:'quantitative'},
                        ]
        }
};
var test = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        description: 'Vanilla JS Test Embed',
        data: {
values: [
  {a: 'A', b: 28},
  {a: 'B', b: 55},
  {a: 'C', b: 43},
  {a: 'D', b: 91},
  {a: 'E', b: 81},
  {a: 'F', b: 53},
  {a: 'G', b: 19},
  {a: 'H', b: 87},
  {a: 'I', b: 52}
]
},
mark: 'bar',
encoding: {
x: {field: 'a', type: 'ordinal'},
y: {field: 'b', type: 'quantitative'}
}
};
vegaEmbed('#overview', test);
