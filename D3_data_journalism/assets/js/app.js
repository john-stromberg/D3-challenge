//define svg area dimensions
var svgWidth = 960;
var svgHeight = 500;

// define the charts' margins as an object
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100,  
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//create a SVG wrapper, append an SVG group that will hold chart;
var svg = d3.select("#scatter").append("svg").attr("width", svgWidth).attr("height", svgHeight);

//append an svg group
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data
d3.csv("../assets/data/data.csv").then(function(stateData, err) {
    if (err) throw err;
    console.log(stateData);
    //parse data and cast as numbers
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.abbr = data.abbr;
        console.log(data.abbr)
    });
    

    // create scale function
    var xLinearScale = d3.scaleLinear().domain([d3.min(stateData, d => d.poverty)*0.9, d3.max(stateData, d => d.poverty)*1.1]).range([0, width]);
    var yLinearScale = d3.scaleLinear().domain([d3.min(stateData, d => d.healthcare)*0.9, d3.max(stateData, d => d.healthcare)*1.1]).range([height, 0]);

    //create axis functions 
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axis to chart 
    chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
    chartGroup.append("g").call(leftAxis);

    //create circles 
    var circlesGroup = chartGroup.selectAll("circle").data(stateData).enter().append("circle")
    .attr("cx", d => xLinearScale(d.poverty)).attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10").attr("fill", "lightblue").attr("opacity", "1");
    // add text labels to circles
    
    

    //initialize tooltip 
    var toolTip = d3.tip().attr("class", "tooltip").offset([80, -60]).html(function(d) {
        return (`${d.state}<br>Poverty (%): ${d.poverty}<br> Lacks Healthcare (%): ${d.healthcare}`);
      });
    //create tooltip in chart
    chartGroup.call(toolTip);

    //create event listener to display tooltip
    circlesGroup.on("mouseover", function(data){
        toolTip.show(data, this);
    }).on("mouseout", function(data, index){
        toolTip.hide(data)
    });

    //create axes labels
   
    chartGroup.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left + 40).attr("x", 0 - (height / 2))
      .attr("dy", "1em").attr("class", "axis-text").text("Lacks Healthcare (%)");
    chartGroup.append("text").attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText").text("In Poverty (%)");  
}).catch(function(error) {
    console.log(error);
});     


