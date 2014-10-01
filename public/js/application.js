angular.module("Renzu", ['nvd3ChartDirectives', 'ngRoute'])

.config(function($routeProvider) {
    $routeProvider

    // route for the display page
        .when('/', {
            templateUrl: 'partials/display.html',
            controller: 'allDAUCtrl'
        })
        .when('/detail', {
            templateUrl: 'partials/appDetails.html',
            controller: 'detailAppDataCtrl'
        })
})

.controller('allDAUCtrl', ['$scope',
    function($scope) {
        // Set filter options - outside of D3 due to asynchronicity
        $scope.filterOptions = {
            filters: ['App', 'Category', 'Platform'],
            selectedFilter: 'App'
        }
        $scope.metricOptions = {
            metrics: ['D1 Retention', 'DAU'],
            selectedMetric: 'DAU'
        }
        $scope.appOptions = {
            apps: ['CandyBash', 'Words with Enemies', 'Crappy Birds', 'Zuber', 'Carry']
        }

        // Assign filter to the scope by watching changes to the $scope.filterOptions object
       $scope.$watchCollection("filterOptions", function(newVal, oldVal, scope) {
            console.log('change!')
           // scope.filterOptions.selectedFilter = newVal;

        // Pull in csv file with d3
        d3.csv('resources/challenge-dataset.csv', function(dataset) {
            // Set start and end dates for dataset
            var startDate = dataset[0].Date;
            var endDate = dataset[dataset.length-1].Date;

            // Set dimensions for aggregate charts
            var dimensions = { 'width': 600, 'height': 200 }

            // Filter dataset to return Retention
            var retention = dataset.filter(function(row) {
                return row['Metric'] == 'D1 Retention';
            });

            // Filter dataset to return DAU
            var dataset = dataset.filter(function(row) {
                return row['Metric'] == 'DAU';
            });

            // Use d3's nest method to reorganize data by the selected filter and date
            var nestFunction = d3.nest().key(function(d) {
                if ($scope.filterOptions.selectedFilter === "App") {
                    return d.App;
                } else if ($scope.filterOptions.selectedFilter === "Category") {
                    return d.Category;
                } else if ($scope.filterOptions.selectedFilter === "Platform") {
                    return d.Platform; }
            }).key(function(d) {
                return d.Date
            })

            var dateLabels = function(d) {
                str = d3.time.format('%m/%Y')(new Date(d))
                return str.substr(0,3) + str.substr(5);
            }

            var entriesFxn = function(d) {
                // Parse date values to JavaScript date object
                var format = d3.time.format("%m/%d/%Y");
                var parseFormat = format.parse(d.Date);
                d.Date = format.parse(d.Date);
                // Assign x and y variables for import into chart
                d.x = d.Date;
                if (d.Metric === "DAU") { d.y = +d.Value; }
                else if (d.Metric === "D1 Retention") {
                    var str = d.Value
                    d.y = +(str.substring(0, str.length-1)) // remove % sign and change string to numerical value
                }
                return d;
            }

            var entriesDetailFxn = function(d) {
                if (d.Metric === "DAU") { d.y = +d.Value; }
                else if (d.Metric === "D1 Retention") {
                    var str = d.Value
                    d.y = +(str.substring(0, str.length-1)) // remove % sign and change string to numerical value
                        }
                return d;
            }

            // Function to get DAU charts
            var getDau = function(dataset) {
                var datasetMax = 0
                // Sum values by category and date
                var rollup = nestFunction.rollup(function(d) {
                    return d3.sum(d, function(g) {
                        return +g.y
                    })
                });

                // Map data to nested App
                var chartDAUData = rollup.entries(
                    dataset.map(function(d) {
                        if (d.y > datasetMax) { datasetMax = d.y }
                        return entriesFxn(d);
                    })
                );

                // Use NVD3 library to add Line Chart for cumulative app use
                nv.addGraph(function() {
                    var chart = nv.models.lineChart()
                        .margin({ right: 100 })
                        .x(function(d) { return new Date(d.key) })
                        .y(function(d) { return d.values })
                        .useInteractiveGuideline(true)
                        .clipEdge(true);

                    chart.xAxis
                        .axisLabel("Date")
                        .tickFormat(function(d) { return dateLabels(d); })
                        .scale()
                        .domain([startDate, endDate]);

                    chart.yAxis
                        .axisLabel("Users")
                        // .axisLabelDistance(100)
                        .tickFormat(d3.format(',f'))
                        .scale()
                        .domain([0, datasetMax])

                    d3.select('#dau-chart svg')
                        .datum(chartDAUData)
                        .call(chart)
                        .style(dimensions);

                    nv.utils.windowResize(chart.update);
                    return chart;
                });
            }

            // Function to get Retention charts
            var getRetention = function(dataset) {
                // Get avg percentages by category and date
                var rollup = nestFunction.rollup(function(d) {
                    return d3.mean(d, function(g) {
                        return +g.y
                    })
                });

                // Map data to nested App
                var chartRetentionData = rollup.entries(
                    dataset.map(function(d) {
                        return entriesFxn(d);
                    })
                );

                // Use NVD3 library to add Line Chart for cumulative app use
                nv.addGraph(function() {
                    var chart = nv.models.lineChart()
                        .margin({ right: 100 })
                        .x(function(d) { return new Date(d.key) })
                        .y(function(d) { return d.values })
                        .useInteractiveGuideline(true)
                        .clipEdge(true);

                    chart.xAxis
                        .axisLabel("Date")
                        .tickFormat(function(d) { return dateLabels(d); })
                        .scale()
                        .domain([startDate, endDate]);

                    chart.yAxis
                        .axisLabel("% Retention")
                        // .axisLabelDistance(100)
                        .tickFormat(d3.format(',f'))
                        .scale()
                        .domain([0, 100])

                    d3.select('#retention-chart svg')
                        .datum(chartRetentionData)
                        .call(chart)
                        .style(dimensions);

                    nv.utils.windowResize(chart.update);

                    return chart;
                });
            }

            // Function to get DAU detail charts (by App)
            var getDauDetails = function(dataset) {
                // Create stats object to house data for charts
                var stats = { totalDAU: 0, minDailyValue: 0, maxDailyValue: 0 }

                // Reorganize data by platform
                var nestFunction = d3.nest().key(function(d) { return d.Platform; })

                // Sum values by category
                var rollup = nestFunction.rollup(function(d) {
                    val = parseInt(d[0].Value)
                    stats.minDailyValue = val;
                    stats.maxDailyValue = val;
                    for (i = 0; i < d.length; i++) {
                        val = parseInt(d[i].Value)
                        if (val < stats.minDailyValue) {
                            stats.minDailyValue = val;
                        }
                        if (val > stats.maxDailyValue) {
                            stats.maxDailyValue = val;
                        }
                        i += 1
                    }
                    return d3.sum(d, function(g) {
                        return +g.y;
                    })
                });

                // Map data to nested App
                var chartDAUData = rollup.entries(
                    dataset.map(function(d) {
                        return entriesDetailFxn(d);
                    })
                );

                for (item in chartDAUData) {
                    var objKey = chartDAUData[item].key;
                    stats[objKey] = chartDAUData[item].values;
                    stats.totalDAU += chartDAUData[item].values;
                }

                nv.addGraph(function() {
                      var chart = nv.models.bulletChart();

                      d3.select('#chart svg')
                          .datum(exampleData())
                          .transition().duration(1000)
                          .call(chart);

                      return chart;
                    });

                function exampleData() {
                    return {
                        "title":"DAU",
                        "subtitle":"8/2013 - 9/2014",
                        "ranges":[150,225,300],  //Minimum, mean and maximum values.
                        "measures":[220],        //Value representing current measurement (the thick blue line in the example)
                        "markers":[250]          //Place a marker on the chart (the white triangle marker)
                      };
                    }


            }

            // Function to get Retention detail charts (by App)
            var getRetentionDetails = function(dataset) {

            }

        // Call functions to create the overview charts
        getDau(dataset);
        getRetention(retention);
        for (app in $scope.appOptions.apps) {
            var dataset = dataset.filter(function(row) {
                return row['App'] == $scope.appOptions.apps[app];
            });
            getDauDetails(dataset);
            getRetentionDetails(retention);
        }
        })
     })
    }
])
