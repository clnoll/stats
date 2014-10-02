// Pull in csv file with d3
getCsv = function(dataset) {

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
                    d.x = d.Platform
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


}
