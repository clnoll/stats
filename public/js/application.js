angular.module("Renzu", ['nvd3ChartDirectives', 'ngRoute'])

.config(function($routeProvider) {
    $routeProvider

    // route for the display page
        .when('/', {
            templateUrl: 'partials/display.html',
            controller: 'allDataCtrl'
        })
        .when('/detail', {
            templateUrl: 'partials/appDetails.html',
            controller: 'detailAppDataCtrl'
        })
})

.controller('allDataCtrl', ['$scope',
    function($scope) {
        // Set filter options
        $scope.filterOptions = {
            filters: ['App', 'Category', 'Platform'],
            selectedFilter: 'App'
        }

        // Assign filter to the scope by watching changes to the $scope.filterOptions object
       $scope.$watchCollection("filterOptions", function(newVal, oldVal, scope) {
            console.log('change!')
           // scope.filterOptions.selectedFilter = newVal;

        // Pull in csv file with d3
        d3.csv('resources/challenge-dataset.csv', function(dataset) {
            // Set max variable for use in chart
            var datasetMax = 0
            // Filter dataset to return values rather than percentages
            dataset = dataset.filter(function(row) {
                return row['Metric'] == 'DAU';
            })
            // Use d3's nest method to reorganize data by the selected filter
            var nestFunction = d3.nest().key(function(d) {
                if ($scope.filterOptions.selectedFilter === "App") {
                    return d.App;
                } else if ($scope.filterOptions.selectedFilter === "Category") {
                    return d.Category;
                } else if ($scope.filterOptions.selectedFilter === "Platform") {
                    return d.Platform; }
            });
            // Map data to nested App
            chartData = nestFunction.entries(
                dataset.map(function(d) {
                    // Parse date values to JavaScript date object
                    var format = d3.time.format("%m/%d/%Y");
                    var parseFormat = format.parse(d.Date);
                    d.Date = format.parse(d.Date);
                    // Assign x and y variables for import into chart
                    d.x = d.Date;
                    d.y = +d.Value; // + changes value to a number
                    // Track max value of dataset
                    if (d.y > datasetMax) { datasetMax = d.y }
                    return d;
                })
            );

            // Use NVD3 library to add Stacked Area Chart for cumulative app use
            nv.addGraph(function() {
                var chart = nv.models.lineChart()
                    .margin({
                        right: 100
                    })
                    .x(function(d) {
                        return d.x
                    }) //We can modify the data accessor functions...
                    .y(function(d) {
                        return d.y
                    }) //...in case your data is formatted differently.
                    // .useInteractiveGuideline(true) //Tooltips which show all data points. Very nice!
                    // .rightAlignYAxis(true) //Let's move the y-axis to the right side.
                    // .transitionDuration(500)
                    // .showControls(true) //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                    .clipEdge(true);

                //Format x-axis labels with custom function.
                chart.xAxis
                    .axisLabel("Date")
                    .tickFormat(function(d) {
                        str = d3.time.format('%m/%Y')(new Date(d))
                        return str.substr(0,3) + str.substr(5);
                    })
                    .scale()
                    .domain([dataset[0].Date, dataset[dataset.length-1].Date]);

                chart.yAxis
                    .axisLabel("Users")
                    .axisLabelDistance(100)
                    .tickFormat(d3.format(',f'))
                    .scale()
                    .domain([0, datasetMax])

                d3.select('#chart svg')
                    .datum(chartData)
                    .call(chart)
                    .style({ 'width': 700, 'height': 500 });

                nv.utils.windowResize(chart.update);

                return chart;
            });
        })
     })
    }
])
