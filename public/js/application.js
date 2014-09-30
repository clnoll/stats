angular.module("nvd3TestApp", ['nvd3ChartDirectives', 'ngRoute'])

.config(function($routeProvider) {
    $routeProvider

    // route for the display page
        .when('/', {
            templateUrl: 'partials/display.html',
            controller: 'ExampleCtrl'
        })
        .when('/test', {
            templateUrl: 'partials/test.html',
            controller: 'testController'
        })
})


.controller('ExampleCtrl', ['$scope', '$window',
    function($scope, $window) {
        var d3 = $window.d3;


        d3.csv('resources/challenge-dataset.csv', function(dataset) {
            var datasetMax = 0

            dataset = dataset.filter(function(row) {
                return row['Metric'] == 'DAU';
            })

            var nestFunction = d3.nest().key(function(d) {
                return d.App;
            });

            chartData = nestFunction.entries(
                dataset.map(function(d) {
                    var format = d3.time.format("%m/%d/%Y");
                    var parseFormat = format.parse(d.Date);
                    d.Date = format.parse(d.Date);
                    d.x = d.Date;
                    d.y = +d.Value;
                    if (d.y > datasetMax) { datasetMax = d.y }
                    return d;
                })
            );

            nv.addGraph(function() {

                var chart = nv.models.stackedAreaChart()
                    .margin({
                        right: 100
                    })
                    .x(function(d) {
                        return d.x
                    }) //We can modify the data accessor functions...
                    .y(function(d) {
                        return d.y
                    }) //...in case your data is formatted differently.
                    .useInteractiveGuideline(true) //Tooltips which show all data points. Very nice!
                    .rightAlignYAxis(true) //Let's move the y-axis to the right side.
                    .transitionDuration(500)
                    .showControls(true) //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                    .clipEdge(true);

                //Format x-axis labels with custom function.
                chart.xAxis
                    .tickFormat(function(d) {
                        return d3.time.format('%m/%Y')(new Date(d))
                    })
                    .scale()
                    .domain([dataset[0].Date, dataset[dataset.length-1].Date]);

                chart.yAxis
                    .tickFormat(d3.format(',f'))
                    .scale()
                    .domain([0, datasetMax]);

                d3.select('#chart svg')
                    .datum(chartData)
                    .call(chart);

                nv.utils.windowResize(chart.update);

                return chart;
            });
        })
    }
])
