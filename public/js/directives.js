// Create the line chart
app.directive('linearChart', function($window){
   return{
      restrict:'EA',
      template:"<svg width='850' height='200'></svg>",
       link: function(scope, elem, attrs){

          d3.csv('resources/challenge-dataset.csv', function(dataset) {
            // console.log(dataset)
            scope.dataset = dataset
            scope.subset = []
            scope.dataset.forEach(function(d) {
            // var format = d3.time.format("%Y/%m/%d");
            // var parseFormat = format.parse(d.Date);
            // d.Date = format.parse(d.Date);
            if (d.Metric === "DAU") {
              d.jDate = +d.Date.slice(4,6);
              d.Value = +d.Value;
              scope.subset.push(d)
              console.log(d)
              }
            // else {
            //   d.pctJDate = +d.Date.slice(4,6);
            //   d.pctValue = +(d.Value.substring(0, d.Value.length - 1));
            // }

            })

           var dataToPlot=scope.subset;
           var padding = 20;
           var pathClass="path";
           var xScale, yScale, xAxisGen, yAxisGen, lineFun;

           var d3 = $window.d3;
           var rawSvg=elem.find('svg');
           var svg = d3.select(rawSvg[0]);

           function setChartParameters(){
            console.log(dataToPlot)
               xScale = d3.scale.linear()
                   .domain([dataToPlot[0].jDate, dataToPlot[dataToPlot.length-1].jDate])
                   .range([padding + 5, rawSvg.attr("width") - padding]);

               yScale = d3.scale.linear()
                   .domain([0, d3.max(dataToPlot, function (d) {
                       return d.Value;
                   })])
                   .range([rawSvg.attr("height") - padding, 0]);

               xAxisGen = d3.svg.axis()
                   .scale(xScale)
                   .orient("bottom")
                   .ticks(dataToPlot.length - 1);

               yAxisGen = d3.svg.axis()
                   .scale(yScale)
                   .orient("left")
                   .ticks(5);

               lineFun = d3.svg.line()
                   .x(function (d) {
                       return xScale(d.jDate);
                   })
                   .y(function (d) {
                       return yScale(d.Value);
                   })
                   .interpolate("basis");
           }

         function drawLineChart() {

               setChartParameters();

               svg.append("svg:g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0,180)")
                   .call(xAxisGen);

               svg.append("svg:g")
                   .attr("class", "y axis")
                   .attr("transform", "translate(20,0)")
                   .call(yAxisGen);

               svg.append("svg:path")
                   .attr({
                       d: lineFun(dataToPlot),
                       "stroke": "blue",
                       "stroke-width": 2,
                       "fill": "none",
                       "class": pathClass
                   });
           }

           drawLineChart();
        })

      }

   };
});
