 // create the module
 angular.module('Renzu', ['ngRoute', 'ngResource'])

 .config(function($routeProvider) {
     $routeProvider

     // route for the calculator page
     .when('/', {
         templateUrl: 'partials/display.html',
         controller: 'displayController'
     })
 })

 .controller('displayController', function($scope, $http) {

  // Get data from the CSV file and attach to D3 chart elements
  d3.csv('resources/challenge-dataset.csv', function(dataset) {

  // Set Value column to integer
  dataset.forEach(function(d) {
    var format = d3.time.format("%Y/%m/%d");
    d.Date = format.parse(d.Date);
    d.Value = +d.Value;
  })
    console.log(dataset)


  // Set chart dimensions
  var margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  }
  width = 700 - margin.left - margin.right;
  height = 350 - margin.top - margin.bottom;

  // Create svg element
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add bar elements to svg
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 20)
    .attr("height", 100);

  // Set x and y scales
  var xScale = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);
  var yScale = d3.scale.linear()
    .rangeRound([height, 0]);

  var color = d3.scale.ordinal()
    .range(["#308fef", "#5fa9f3", "#1176db"]);

  // Set axes
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .tickFormat(d3.format(".2s"))











  }) // closes csv function

  // console.log(dataset)
//   d3.csv('resources/challenge-dataset.csv', function(data) {
//       data.forEach(function(d) {
//         d.date = parseDate(d['Date'])
//       })
//     }, function() {
//       console.log(dataset)



// // Date,Metric,App,Category,Platform,Value

//     // console.log(dataset)

//     var w = 500;
//     var h = 200;
//     var padding = 30;

//     var svg = d3.select('body')
//       .append("svg")
//       .attr("width", w)
//       .attr("height", h);

//     var xScale = d3.scale.linear()
//       .domain([0,2400])
//       .range([padding, w-padding]);

//     var yScale = d3.scale.linear()
//       .domain([0,100])
//       .range([h-padding, padding]);

//     svg.selectAll("circle")
//       .data(dataset)
//       .enter()
//       .append("circle")
//       .attr("cx", function(d) {
//         return xScale(d.Date);
//       })
//       .attr("cy", function(d) {
//         return yScale(d.Value)
//       })

//   })



 })
